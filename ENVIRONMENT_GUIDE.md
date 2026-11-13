# VixoAi Environment Variable Guide

Set server secrets in Render → your Web Service → Environment. Do not commit real keys or paste them into chat. `.env.example` contains placeholders only.

| Variable | Exact value to enter | Where to obtain it | Visibility | Feature | Required? |
|---|---|---|---|---|---|
| `GEMINI_API_KEY` | Secret API key string | Google AI Studio | Server secret | Main AI chat and AI assistant tools | Required for AI text features |
| `GEMINI_MODEL` | Model ID, default `gemini-2.5-flash` | Google AI model documentation | Server config | Main AI text model | Optional |
| `TAVILY_API_KEY` | Secret API key | Tavily dashboard | Server secret | AI Search | Optional |
| `SUPABASE_URL` | Project URL | Supabase project settings → API | Server config | Authentication and database | Required for login-backed features |
| `SUPABASE_ANON_KEY` | Project anon/public key | Supabase project settings → API | Public config also used server-side | Browser authentication and token verification | Required for login |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role secret | Supabase project settings → API | Server secret only | Saving chat history | Optional for history persistence; protect carefully |
| `VITE_SUPABASE_URL` | Same Supabase project URL | Supabase project settings → API | Frontend public | Browser login | Required for login |
| `VITE_SUPABASE_ANON_KEY` | Same anon/public key | Supabase project settings → API | Frontend public | Browser login | Required for login |
| `IMAGE_API_URL` | Provider endpoint accepting POST JSON `{prompt}` | Your selected compatible image provider | Server config | Image Studio | Optional |
| `IMAGE_API_KEY` | Provider API key | Your selected image provider | Server secret | Image Studio | Optional |
| `VIDEO_API_URL` | Provider endpoint accepting POST JSON `{prompt}` | Your selected compatible video provider | Server config | Video Studio | Optional |
| `VIDEO_API_KEY` | Provider API key | Your selected video provider | Server secret | Video Studio | Optional |
| `VONAGE_API_KEY` | Vonage API key | Vonage dashboard | Server secret | Optional phone verification pre-check | Optional |
| `VONAGE_API_SECRET` | Vonage API secret | Vonage dashboard | Server secret | Optional phone verification pre-check | Optional |
| `VONAGE_BRAND_NAME` | Display brand, default `VixoAi` | Choose your brand label | Server config | Phone verification message | Optional |
| `ADMIN_API_KEY` | Long unique random secret | Generate privately | Server secret | Admin Panel login | Optional; required for admin login |
| `SESSION_SECRET` | Long random secret | Generate privately | Server secret | Reserved session configuration | Optional in current flow |
| `APP_ORIGIN` | Exact deployed frontend origin, e.g. `https://your-service.onrender.com` | Render service URL / custom domain | Server config | CORS allow-list | Required in production |
| `PORT` | Render supplies this automatically; local default `10000` | Render runtime | Server config | HTTP server | Usually automatic |
| `NODE_ENV` | `production` on Render | Deployment setting | Server config | Production security behavior | Recommended |

## Render setup
1. Push the project to a private/public GitHub repository without any real `.env` file.
2. Create a Render Web Service from the repository.
3. Build command: `npm install && npm run build`.
4. Start command: `npm start`.
5. Add the required values above under Environment. Keep all server secrets out of `VITE_` variables.
6. Set `APP_ORIGIN` to the exact browser origin.
7. Deploy and verify `/api/health`.

## Compatible media API contract
Image/video endpoints are provider-specific. The adapter sends `POST` with `Authorization: Bearer <key>` and JSON `{ "prompt": "..." }`. Your selected provider must support that contract. The app returns the provider JSON and common media URL fields; asynchronous providers may require their own job polling workflow and are not claimed to be complete by this generic adapter.
