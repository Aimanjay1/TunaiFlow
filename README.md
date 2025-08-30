Project Title: TunaiFlow

Teamk members: 
1. Aiman (Frontend Developer)
2. Mior Muhammad Adib (Frontend Developer)
3. Faris (Backend Developer)
4. Nurul Hanis Fatini (Designer)
5. Norsabreena (Business Strategist)

Problem and solution summary:

Streamlining Business Operations & Financial Clarity:
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

Setup instructions:

