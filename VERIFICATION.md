# Verification status

Checks performed while preparing this archive:
- ZIP contents extracted successfully and the project structure was inspected.
- Server JavaScript files passed `node --check` syntax validation.
- Environment variable names were aligned across `.env.example`, `render.yaml`, and `ENVIRONMENT_GUIDE.md`.
- The Gemini default model was aligned with the documented `GEMINI_MODEL` value.

Not verified in this preparation environment:
- A clean dependency installation from the public npm registry.
- Full provider integration using real Supabase, Gemini, Tavily, or Vonage credentials.
- A live Render deployment and production-domain OAuth flow.

Before production launch, use Node.js 20+ and run:

```bash
npm install
npm test
npm run typecheck
npm run build
```

Then deploy to a test Render service, set the environment values described in `ENVIRONMENT_GUIDE.md`, and verify `/api/health`, `/api/status`, sign-in, AI chat, and AI Search. No live API keys are included in this ZIP.
