Project Title: TunaiFlow

Team members: 
1. Aiman (Frontend Developer)
2. Mior Muhammad Adib (Frontend Developer)
3. Faris (Backend Developer)
4. Nurul Hanis Fatini (Designer)
5. Norsabreena (Business Strategist)


Problem and solution summary:

Problem: Streamlining Business Operations & Financial Clarity
Many companies struggle with manual processes, leading to wasted time, delayed cash flow, and a lack of clear financial oversight. Challenges include inefficient client follow-up, manual invoicing, and a lack of insight into budgeting, burn rate, or revenue goals.

Solutions:
Automated follow-ups: Background jobs send quote/due/overdue reminders via email to reduce DSO.
Rapid invoicing & PDFs: ASP.NET Core + EF Core with QuestPDF for branded, shareable invoices and clear status flow.
Email receipt ingestion: IMAP (MailKit) pulls receipt emails, saves attachments to Supabase Storage, and auto-links to invoices by ID with de-duplication.
Financial dashboards: Aggregations power views for revenue, expenses, burn rate, runway, AR aging, and goal tracking in a Next.js UI.
User experience & security: Next.js + Tailwind, JWT auth, helpful toasts/search/sorting.
Infra: Frontend on Vercel, backend on Render, Supabase PostgreSQL + Storage; structured logging and sane CORS.


Technology stack used:

Frontend
- Next.js (React)
- Tailwind CSS (UI styling)

Backend
- ASP.NET Core 8 (C#)
- Entity Framework Core (data access & migrations)
- Npgsql (PostgreSQL driver)
- QuestPDF (invoice PDF generation)
- MailKit + MimeKit (SMTP sending & IMAP ingestion)
- Regex-based parsing for invoice/receipt matching
- Background jobs via IHostedService (scheduled reminders & email ingestion)
- Swagger / OpenAPI (API docs)
- JWT authentication & CORS

Data & Storage
- Supabase PostgreSQL (primary DB)
- Supabase Storage (receipt file storage)

Deployment & Ops
- Vercel (frontend hosting)
- Render (backend hosting)

Frontend: [https://tunai-flow-89vi.vercel.app](https://tunai-flow-89vi.vercel.app) 
Backend: [https://tunaiflow.onrender.com](https://tunaiflow.onrender.com)


Setup instructions:

1. Prerequisites
   - Download Node.js 18+ and npm
   - .Net SDK 8.0
   - PostgreSQ
  
2. Clone
   - git clone https://github.com/Aimanjay1/TunaiFlow
   - cd Frontend or cd Backend

3. Backend Configuration
   1. insert this commands after the directory of Backend:
```
dotnet user-secrets set "Supabase:ServiceRoleKey" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuc3VjdWltb2l6a3NyYXdiY3dwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY2NjU4MSwiZXhwIjoyMDcxMjQyNTgxfQ.0dZtE7ueLqGX-jOI0vB2LtBeBtgZf1IAUVSBtekGpu8"

dotnet user-secrets set "PORT" "5226"

dotnet user-secrets set "JwtSettings:Secret" "any password you like"
dotnet user-secrets set "JwtSettings:Issuer" "BizOpsAPI"
dotnet user-secrets set "JwtSettings:Audience" "BizOpsAPIUsers"

dotnet user-secrets set "EmailSettings:Username" "<PUT-YOUR-OWN-EMAIL-HERE>"
dotnet user-secrets set "EmailSettings:SenderEmail" "<PUT-YOUR-OWN-EMAIL-HERE>"
dotnet user-secrets set "EmailSettings:Password" "<PUT-YOUR-OWN-EMAIL-PASSWORD-HERE>"
dotnet user-secrets set "EmailSettings:AppPassword" "<PUT-YOUR-OWN-EMAIL-PASSWORD-HERE>"

dotnet user-secrets set "EmailIngestion:Username" "<PUT-YOUR-OWN-EMAIL-HERE>"
dotnet user-secrets set "EmailIngestion:Password" "<PUT-YOUR-OWN-EMAIL-PASSWORD-HERE>"
dotnet user-secrets set "EmailIngestion:AppPassword" "<PUT-YOUR-OWN-EMAIL-PASSWORD-HERE>"

dotnet user-secrets set "ConnectionStrings:DefaultConnection" "User Id=postgres.dnsucuimoizksrawbcwp;Password=TunaiFlow123;Server=aws-1-ap-southeast-      1.pooler.supabase.com;Port=6543;Database=postgres"

dotnet user-secrets set "ASPNETCORE_ENVIRONMENT" "Development"
```
   2. then, you can run it with:
```
dotnet run
```
   3. then, go to [http://localhost:5226/swagger](http://localhost:5226/swagger) to access the swagger.
4. Frontend Configuration
   1. Go into Frontend directory 
```
cd Frontend
```
   2. Build the optimized production build by running npm run build in the command terminal
```
npm run build
```
   3. Start the Next app by running npm run start in the command terminal
```
npm run start
```
   4. The next app will default to port 3000 on your machine. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Reflections on Challenges and Learnings:

Challenges

- Integration Complexity – Connecting multiple services (Supabase, .NET backend, Next.js frontend, and email ingestion) required careful configuration of secrets, authentication, and database connections. Misconfigured environment variables and database timeouts were frequent obstacles.
- Managing Secrets Securely – Handling API keys, JWT settings, and email credentials posed security risks. We needed to balance ease of development with good security practices.
- Deployment Issues – Deploying the backend separately from the frontend introduced challenges with connection strings, ports, and ensuring services ran consistently in production.
- Time Constraints – As with any hackathon-style build, limited time forced us to prioritize features and sometimes settle for simpler implementations rather than perfect solutions.
- Debugging & Testing – Debugging issues like database retries, email parsing, and receipt ingestion consumed significant time. Proper logging became essential.

Learnings

- Importance of Clear Architecture – Splitting responsibilities (frontend for UI, backend for business logic, Supabase for storage, etc.) improved maintainability and clarity.
- Secrets Management – Using dotnet user-secrets and environment variables taught us the importance of never hardcoding sensitive values, and made local vs. production setup easier.
- Cloud & Third-Party Services – Working with Supabase, Render, and Vercel gave us practical experience with modern deployment pipelines and how managed services speed up development.
- Iterative Problem Solving – Each error forced us to dig deeper (e.g., timeout handling, retry strategies, email parsing edge cases), which sharpened our debugging and problem-solving skills.
- Collaboration Under Pressure – Dividing tasks across team members (UI, backend, integrations) highlighted the importance of communication, version control, and documenting changes.
- Growth Mindset – We realized challenges are not blockers but opportunities to learn new tools, sharpen troubleshooting, and improve resilience as developers.
