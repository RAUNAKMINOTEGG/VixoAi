# VIXO AI V4 — Complete Environment Variable Guide

This is the single environment template for local development and Render deployment. Add real values later; this ZIP intentionally contains **no live API keys**. Never send secrets in chat, commit them to GitHub, or place server secrets in variables beginning with `VITE_`.

## Variables

| Exact key | What value belongs here / where to get it | Used for | Visibility | Required? |
|---|---|---|---|---|
| `NODE_ENV` | `production` on Render; `development` locally | Express runtime and secure admin cookie behavior | Server setting | Yes |
| `PORT` | `10000` locally; Render normally supplies its own value | HTTP listener | Server setting | Yes; Render may override |
| `APP_ORIGIN` | Exact website origin, e.g. `https://your-service.onrender.com` (no path or trailing slash). For multiple origins, comma-separate exact origins | CORS allowlist | Server setting | Yes in production |
| `GEMINI_API_KEY` | Create an API key in Google AI Studio: https://aistudio.google.com/app/apikey | Gemini chat, image-aware chat, and AI assistant sections | **Server secret** | Required for AI features |
| `GEMINI_MODEL` | Model ID enabled for your Google AI project; default `gemini-2.5-flash` | Selects Gemini model | Server setting | Recommended; default is used if blank |
| `TAVILY_API_KEY` | Create/copy an API key from https://tavily.com/ | AI Search web results | **Server secret** | Required only for AI Search |
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL | Server verifies Supabase access tokens; service client uses same project | Public project URL, server-side | Required for login-protected APIs |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon/publishable key | Server-side access-token verification | Public project key, server-side | Required for login-protected APIs |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → service_role/secret key | Server writes and reads persistent chat history | **Highly sensitive server secret** | Optional; required for server-persisted history |
| `VITE_SUPABASE_URL` | Same Project URL as `SUPABASE_URL` | Browser Supabase client for sign-in | **Public build-time frontend value** | Required for browser login |
| `VITE_SUPABASE_ANON_KEY` | Same anon/publishable key as `SUPABASE_ANON_KEY` | Browser Supabase client for sign-in | **Public build-time frontend value** | Required for browser login |
| `VONAGE_API_KEY` | Vonage API Dashboard → API key | Starts/checks additional Vonage Verify flow | **Server secret** | Optional; only for additional phone verification |
| `VONAGE_API_SECRET` | Vonage API Dashboard → API secret | Authenticates Vonage Verify requests | **Server secret** | Optional; only with `VONAGE_API_KEY` |
| `VONAGE_BRAND_NAME` | Sender brand shown in Verify workflow; default `VIXO AI` | Vonage verification message | Public configuration | Optional |
| `ADMIN_API_KEY` | Generate your own long, random private value; do not reuse a password | Owner diagnostics login | **Server secret** | Optional; admin login disabled if blank |

## Exact Render setup

1. Push the extracted project folder to a private or public GitHub repository. Do not upload a real `.env` file.
2. In Render, choose **New → Blueprint** and select that repository (or create a Web Service using the included `render.yaml`).
3. Confirm the service uses the included build command `npm install && npm run build`, start command `npm start`, and health path `/api/health`.
4. Open the service's **Environment** page. Add the values from the table above. Render's Blueprint marks secret values as `sync: false`, so enter them there when prompted.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` **before the first build** and whenever they change, then trigger a new deploy. Vite embeds these public values during build.
6. Set `APP_ORIGIN` to the exact Render URL, for example `https://your-service.onrender.com`. Do not add a trailing slash or `/*`.
7. In Supabase → Authentication → URL Configuration, add the Render URL to the allowed Site URL / Redirect URLs. Enable Email and Google providers as needed. For Google, use the callback URL shown in Supabase's Google provider configuration in Google Cloud Console.
8. For phone sign-in, configure Supabase Phone Auth and its SMS provider. The optional Vonage verification is an additional step; the current flow sends a Vonage code and then a separate Supabase OTP.
9. After deploy, open `/api/health` and `/api/status`. `/api/health` should return `ok: true`; `/api/status` shows whether each provider is in Demo Mode, Verification Pending, Live, or Connection Error.

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

Fill local `.env` values as needed. Run `npm run check:env` for an informational list of set/missing variables. It does not validate credentials or call external providers. Vite runs at `http://localhost:5173`; the API runs at `http://localhost:10000`.

## Security rules

- Never put `GEMINI_API_KEY`, `TAVILY_API_KEY`, `VONAGE_API_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, or `ADMIN_API_KEY` in frontend code or any `VITE_` variable.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public browser configuration. Supabase RLS must remain enabled; never treat the anon key as an authorization secret.
- Keep `.env` out of Git. The included `.gitignore` excludes it.
- Do not share screenshots of Render Environment if they reveal secret values.
- Free Render instances and free provider quotas have limits; this project does not promise unlimited free use.

## Features that do not become live just by adding a key

Image Studio and Video Studio are currently Demo Mode. No image/video generation API is wired to their UI endpoint in this release. Do not add arbitrary image/video API keys expecting those sections to work. A compatible provider integration, job lifecycle, and asset delivery must be implemented in a future code update first.
