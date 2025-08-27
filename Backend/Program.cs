using BizOpsAPI.Data;
using Microsoft.EntityFrameworkCore;
using BizOpsAPI.Repositories;
using BizOpsAPI.Mappings;
using BizOpsAPI.Helpers;
using BizOpsAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;   // ✅ for proxy headers
using Supabase;
using QuestPDF.Infrastructure;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// 👉 Bind Kestrel to Render's dynamic PORT (fallback 8080 for local)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ===== Resolve connection strings (separate for migrate vs runtime) =====
var defaultConn = builder.Configuration.GetConnectionString("DefaultConnection");
var migrateConn = Environment.GetEnvironmentVariable("DB_CONN_MIGRATE")
               ?? builder.Configuration.GetConnectionString("MigrateConnection")
               ?? defaultConn;
var appConn     = Environment.GetEnvironmentVariable("DB_CONN_APP")
               ?? builder.Configuration.GetConnectionString("AppConnection")
               ?? defaultConn;

if (string.IsNullOrWhiteSpace(migrateConn))
    throw new InvalidOperationException("No DB connection string found for migrations (DB_CONN_MIGRATE / ConnectionStrings:MigrateConnection / DefaultConnection).");

if (string.IsNullOrWhiteSpace(appConn))
    throw new InvalidOperationException("No DB connection string found for runtime (DB_CONN_APP / ConnectionStrings:AppConnection / DefaultConnection).");

// ===== Log both (no secrets) =====
try
{
    var m = new NpgsqlConnectionStringBuilder(migrateConn);
    Console.WriteLine($"[DB:MIGRATE] Host={m.Host}; Port={m.Port}; Database={m.Database}; Username={m.Username}");
}
catch { Console.WriteLine("[DB:MIGRATE] (couldn't parse connection string)"); }

try
{
    var a = new NpgsqlConnectionStringBuilder(appConn);
    Console.WriteLine($"[DB:RUNTIME] Host={a.Host}; Port={a.Port}; Database={a.Database}; Username={a.Username}");
    if (a.Port == 6543) // transaction pooler
        Console.WriteLine("[DB:RUNTIME] Using transaction pooler (6543). Consider 'Max Auto Prepare=0' in the connection string.");
}
catch { Console.WriteLine("[DB:RUNTIME] (couldn't parse connection string)"); }

// Global Npgsql behavior
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", false);

// ===== Controllers & Swagger =====
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "BizOpsAPI", Version = "v1" });
    c.AddServer(new OpenApiServer { Url = "/" }); // relative
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Paste the raw JWT (no 'Bearer ' prefix).",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// ===== DbContext (runtime uses appConn) =====
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        appConn,
        npg =>
        {
            npg.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(2), errorCodesToAdd: null);
            npg.CommandTimeout(30);
        });

#if DEBUG
    options.EnableDetailedErrors()
           .EnableSensitiveDataLogging();
#endif
});

// ===== AutoMapper =====
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// ===== Repositories =====
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IInvoiceItemRepository, InvoiceItemRepository>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<IReceiptRepository, ReceiptRepository>();
builder.Services.AddScoped<IRevenueRepository, RevenueRepository>();

// ===== Services =====
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IExpenseService, ExpenseService>();
builder.Services.AddScoped<IReceiptService, ReceiptService>();
builder.Services.AddScoped<IRevenueService, RevenueService>();

// ===== Supabase Storage =====
builder.Services.Configure<SupabaseSettings>(builder.Configuration.GetSection("Supabase"));
builder.Services.AddSingleton<Supabase.Client>(sp =>
{
    var cfg = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<SupabaseSettings>>().Value;
    var client = new Supabase.Client(cfg.Url, cfg.ServiceRoleKey, new SupabaseOptions { AutoConnectRealtime = false });
    client.InitializeAsync().GetAwaiter().GetResult();
    return client;
});
builder.Services.AddSingleton<IFileStorage, SupabaseFileStorage>();
builder.Services.AddScoped<ReceiptLinkService>();

// ===== Current user accessor =====
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();

// ===== Config binding =====
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.Configure<EmailIngestionSettings>(builder.Configuration.GetSection("EmailIngestion"));
builder.Services.AddScoped<IEmailReceiptIngestionJob, EmailReceiptIngestionJob>();

// (Optional) larger uploads
builder.Services.Configure<FormOptions>(o => { o.MultipartBodyLengthLimit = 25 * 1024 * 1024; });

// ===== JWT Auth =====
var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()
          ?? throw new InvalidOperationException("JwtSettings section is missing.");

if (string.IsNullOrWhiteSpace(jwt.Issuer) || string.IsNullOrWhiteSpace(jwt.Audience))
    throw new InvalidOperationException("JwtSettings invalid. Ensure Issuer and Audience are set.");

var signingKey = JwtKeyFactory.Create(jwt);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // OK behind Render proxy
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = jwt.Issuer,
        ValidAudience = jwt.Audience,
        IssuerSigningKey = signingKey,
        ClockSkew = TimeSpan.Zero
    };
});

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("Dev", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// ✅ QuestPDF license
QuestPDF.Settings.License = LicenseType.Community;

// ✅ Respect Render's X-Forwarded-* headers (TLS terminated at proxy)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Swagger only in dev (optional: enable in prod if you want)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ❌ Avoid HTTPS redirect loop on Render (TLS is at proxy). Keep only in dev.
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("Dev");
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Healthcheck for Render
app.MapGet("/healthz", () => Results.Ok("ok"));

// Debug endpoint to verify which strings are in use (sanitized)
app.MapGet("/_debug/db", () =>
{
    object Safe(string cs)
    {
        try
        {
            var b = new NpgsqlConnectionStringBuilder(cs);
            // hide secret
            b.Password = "***";
            return new { b.Host, b.Port, b.Database, b.Username };
        }
        catch { return new { value = "(unparsable)" }; }
    }
    return Results.Ok(new
    {
        migrate = Safe(migrateConn),
        runtime = Safe(appConn)
    });
});

// ===== Apply EF migrations at startup using MIGRATION connection, with fallback to RUNTIME =====
var skipMigrations = (Environment.GetEnvironmentVariable("SKIP_MIGRATIONS") ?? "false")
                     .Equals("true", StringComparison.OrdinalIgnoreCase);

if (!skipMigrations)
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // 1) Try preferred: MIGRATE (typically session pooler 5432)
        db.Database.SetConnectionString(migrateConn);
        app.Logger.LogInformation("DB: trying to connect & migrate via MIGRATE connection…");
        await db.Database.MigrateAsync();
        app.Logger.LogInformation("DB: migrations OK via MIGRATE connection");
    }
    catch (Exception ex1)
    {
        app.Logger.LogWarning(ex1, "DB: migrate via MIGRATE connection failed. Falling back to RUNTIME connection once…");
        try
        {
            using var scope2 = app.Services.CreateScope();
            var db2 = scope2.ServiceProvider.GetRequiredService<AppDbContext>();

            // 2) Fallback: RUNTIME (transaction pooler 6543)
            db2.Database.SetConnectionString(appConn);
            app.Logger.LogInformation("DB: trying to migrate via RUNTIME connection…");
            await db2.Database.MigrateAsync();
            app.Logger.LogInformation("DB: migrations OK via RUNTIME connection");
        }
        catch (Exception ex2)
        {
            app.Logger.LogError(ex2, "DB: migration failed via both MIGRATE and RUNTIME connections.");
            // Optional: rethrow to fail hard
            // throw;
        }
    }
}
else
{
    app.Logger.LogWarning("DB: SKIP_MIGRATIONS=true → startup migrations skipped.");
}

app.Run();
