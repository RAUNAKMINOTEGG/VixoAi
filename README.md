# VIXO AI V4

**Your Intelligence. Your AI. Your World.**  
Footer: **Powered by VishalMinoteAI**

VIXO AI is a React + TypeScript + Vite frontend with a Node.js + Express backend. Supabase provides authentication and optional persistent chat history; Gemini powers chat and assistant workflows; Tavily powers AI Search. This archive contains one complete deployable project and intentionally contains placeholders—not live API keys.

## Requirements
- Node.js 20 or newer and npm
- Supabase project for sign-in and authenticated features
- Gemini API key for AI chat and assistant workflows
- Tavily API key for AI Search
- Vonage credentials only if the optional extra phone verification flow is wanted

## Local setup
1. Copy `.env.example` to `.env` and fill only the values you have.
2. Run `npm install`.
3. For local Supabase auth, configure the Supabase Email/Google providers and allow `http://localhost:5173` as a redirect URL.
4. Run `npm run dev`. Vite is at `http://localhost:5173`; Express is at `http://localhost:10000`.
5. Run `npm run check:env` to see which variables are set. This is informational only and does not validate API credentials.

## Deploy to GitHub + Render
1. Extract this ZIP and upload the project contents to one GitHub repository. Do not upload `.env` or real credentials.
2. In Render, select **New → Blueprint** and connect the repository. The included `render.yaml` defines the web service, build/start commands, and health check.
3. Enter the environment values listed in `ENVIRONMENT_GUIDE.md` in Render → Environment. Add the two `VITE_SUPABASE_*` public values before building because Vite embeds them at build time.
4. Set `APP_ORIGIN` to the exact deployed Render origin.
5. Add the Render URL to Supabase Auth redirect settings, enable the providers you plan to use, then deploy.
6. Check `/api/health` and `/api/status` after deployment.

**All exact variable names, where to obtain each value, visibility, required/optional status, and Render instructions are in `ENVIRONMENT_GUIDE.md`.** The same names are in `.env.example` and `render.yaml`. Do not paste real secrets into ChatGPT or hardcode them in source files.

## Authentication
- Email uses Supabase magic-link authentication.
- Google uses Supabase OAuth.
- The optional phone flow verifies with Vonage first, then requests a Supabase SMS OTP to establish the Supabase session. This can result in two OTP messages.
- Protected API routes verify the Supabase bearer token.

## API endpoints
- `GET /api/health` — health check
- `GET /api/status` — provider configuration and observed state
- `POST /api/chat` — authenticated Gemini chat with supported image attachments; optional history persistence
- `POST /api/search` — authenticated Tavily search summarized by Gemini
- `POST /api/assistant` — authenticated Gemini workflows for study, coding, writing, translation and other dashboard sections
- `POST /api/data/inspect` — authenticated CSV/XLSX inspection and bounded descriptive statistics
- `POST /api/files/inspect` — authenticated in-memory TXT/CSV/PDF/DOCX/XLSX text extraction
- `POST /api/presentation/export` — authenticated basic PPTX export from structured slide data
- `POST /api/auth/phone/start`, `/api/auth/phone/check` — optional Vonage Verify
- `GET /api/history` — authenticated Supabase chat history (requires service-role key)
- `POST /api/admin/login`, `GET /api/admin/status` — optional owner diagnostics

## Feature limitations (read before launch)
- Image Studio and Video Studio are Demo Mode. Their current API endpoint does not call a media-generation provider.
- Documents extracts selectable text; scanned-PDF OCR and malware scanning are not included. Uploads are held in memory and not persisted.
- Presentation export creates basic text slides; inspect the generated deck.
- Data Analysis provides bounded CSV/XLSX previews and basic descriptive statistics, not advanced forecasting or arbitrary code execution.
- AI Agents creates human-approved workflow plans; it does not autonomously execute external tools.
- Oriental Guru generates tutoring/practice content. It does not include an official RGPV syllabus or verified previous-year-question database; generated questions should be treated as practice.
- Admin sessions are stored in process memory and reset on restart; this is not a multi-instance admin session store.
- Free hosting and provider quotas can sleep, throttle, or run out. No unlimited-free-use promise is made.

## Verification
Run `npm test`, `npm run typecheck`, and `npm run build` in a network-enabled Node.js 20+ environment before production launch. See `VERIFICATION.md` for what has and has not been verified for this archive.
