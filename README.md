# VixoAi V4

**Your Intelligence. Your AI. Your World.**  
Footer: **Powered by VishalMinoteAI**

VixoAi is the existing React + TypeScript + Vite frontend and Node.js + Express backend, with Supabase authentication/history and server-side provider adapters. This archive preserves the original project structure and all 15 dashboard sections.

## Requirements
- Node.js 20+ and npm 10+
- Supabase project (Google, email and optionally phone auth enabled)
- Gemini API key for AI features
- Tavily API key for AI Search
- Vonage Verify credentials for the additional phone verification step
- Image Studio and Video Studio require a compatible external provider endpoint and credentials

## Local setup
1. Copy `.env.example` to `.env` in the repository root.
2. Set the server variables and the public Supabase browser variables. Never commit `.env`.
3. In Supabase SQL Editor, run `supabase/schema.sql` (also mirrored in `supabase/migrations/`).
4. In Supabase Authentication, enable Google and Email providers. Add `http://localhost:5173` and the deployed app URL to allowed redirect URLs. For phone login, enable Supabase phone auth and configure its SMS provider.
5. In Google Cloud, configure OAuth consent and credentials, then add the Supabase callback URL shown in Supabase's Google provider settings.
6. Configure Vonage Verify for SMS and ensure the account is enabled for the destination countries.
7. Run `npm install`, then `npm run dev`. Vite is on `http://localhost:5173`; Express is on `http://localhost:10000`.

## Authentication flows
- Email uses Supabase `signInWithOtp` magic-link flow.
- Google uses Supabase `signInWithOAuth({ provider: 'google' })`.
- Mobile performs Vonage Verify first. Only after Vonage confirms the code does the browser request a Supabase SMS OTP; that second OTP is verified by Supabase to establish the actual Supabase session. This intentionally requires two OTP messages.
- Server AI routes verify the Supabase bearer token with `auth.getUser`.

## Provider status
`GET /api/status` reports provider states. Missing variables yield **Demo Mode** and list the exact variable names. Configured-but-unused providers yield **Verification Pending**. A successful real request changes the provider to **Live**. A failed real request changes it to **Connection Error**. The status is process-local and resets on restart.

## Image/video status
Image Studio and Video Studio call configured compatible provider endpoints. Without the matching endpoint URL and API key they return a clear configuration error; they never fabricate generated media. Provider response formats vary, and asynchronous job polling is not included in this generic adapter.

## Render deployment
1. Push this repository to GitHub.
2. Create a Render Web Service from the repository; Render uses `render.yaml`.
3. Set `APP_ORIGIN` to the exact production origin (scheme + hostname, no path). Multiple exact origins may be comma-separated. Do not use `*`.
4. Add required secrets in Render Environment. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` before building; these are embedded at build time and are public browser credentials.
5. Set Supabase redirect URLs to the Render origin and configure Google OAuth callback URLs.
6. Deploy and check `/api/health` and `/api/status`.

## Environment variables
See `.env.example` and `ENVIRONMENT_GUIDE.md` for the placeholder template and Render variable-by-variable setup. Server secrets include the AI/search/SMS/admin credentials and Supabase service-role key. Only the Supabase URL and anon key belong in `VITE_` browser variables. `SUPABASE_SERVICE_ROLE_KEY` must remain server-only.

## API endpoints
- `GET /api/health` — health check
- `GET /api/status` — provider configuration and observed state
- `POST /api/chat` — authenticated Gemini chat; saves chat messages when service-role database access is configured
- `POST /api/search` — authenticated Tavily + Gemini research
- `POST /api/generate/image`, `/api/generate/video` — authenticated compatible media-provider requests
- `POST /api/assistant` — authenticated Gemini workflow for the ten text-oriented dashboard sections
- `POST /api/files/inspect` — authenticated in-memory TXT/CSV/PDF/DOCX/XLSX text extraction (max 8 files, 20 MB each)
- `POST /api/presentation/export` — authenticated PPTX export from structured slide data
- `POST /api/auth/phone/start`, `/api/auth/phone/check` — Vonage Verify
- `GET /api/history` — authenticated Supabase chat history
- `POST /api/admin/login`, `GET /api/admin/status` — owner diagnostics

## Security and operational limitations
- Production CORS requires an exact `APP_ORIGIN` allowlist. With no configured production origin, browser cross-origin requests are rejected.
- Helmet, API rate limits, JSON size limit, upload count/size/MIME restrictions and Supabase token verification are enabled.
- File MIME checks do not constitute malware scanning or cryptographic file-signature validation. Files remain in request memory and are not persisted.
- Admin sessions are random, process-memory tokens expiring after 30 minutes. They reset on restart and are not shared across multiple instances.
- Chat history persistence requires `SUPABASE_SERVICE_ROLE_KEY`; service role is never exposed to the browser.
- Oriental Guru uses generated tutoring/practice content. It does not ship an official RGPV syllabus or verified previous-year question bank. Generated questions must be labelled practice. PDF export is not implemented.
- Presentation Maker provides slide content/outline only; PPTX export is not implemented. Data Analysis accepts pasted data; it does not parse spreadsheets or execute analysis code. AI Agents creates workflow plans but does not autonomously execute tools.
- Voice input/read-aloud, image/video job polling and asset rendering, full scanned-PDF OCR, image OCR/vision, persistent file storage, admin analytics, chat regeneration, voice input/read-aloud and autonomous agent execution are not implemented. TXT/CSV/PDF (selectable text)/DOCX/XLSX extraction and a structured PPTX export endpoint are included in this source archive. Image Studio and Video Studio require configured compatible providers.

## Testing
Run `npm install`, `npm test`, `npm run typecheck`, `npm run build`, and `npm start` in a network-enabled Node environment. See `VERIFICATION.md` for the checks actually run while preparing this archive. External provider tests require valid credentials and are never claimed when credentials are absent.


## Feature honesty
Image Studio and Video Studio are intentionally Demo Mode and do not call external generation APIs. Documents supports bounded text extraction for PDF/DOCX/XLSX/CSV/TXT; scanned PDF OCR is not included. Presentation Maker can export a basic PPTX from its generated outline. Data Analysis, AI Agents, Oriental Guru, voice, image understanding, and chat attachments have the limitations listed in `docs/FEATURE_MATRIX.md`.


## Updated workspace features
Chat supports up to four PNG/JPEG/WEBP image attachments (4 MB each), browser voice dictation where supported, read-aloud, regenerate, and session-only response feedback. Data Analysis can inspect CSV/XLSX files and produce bounded descriptive summaries. See `docs/FEATURE_MATRIX.md` for exact limitations.
