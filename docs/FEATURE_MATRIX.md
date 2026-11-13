# VixoAi V4 — Feature matrix

| Feature | Current implementation | Limitations |
|---|---|---|
| Welcome/dashboard | Responsive React workspace with 15 navigation areas | Production build still needs verification |
| Google/email auth | Supabase OAuth and magic-link client flows | Configure Supabase providers, email and redirect URLs |
| Mobile OTP | Vonage Verify followed by Supabase SMS OTP | Two OTP messages; requires both providers |
| AI Chat | Gemini text and image chat (PNG/JPEG/WEBP), Supabase history endpoint, copy, browser voice dictation and read-aloud | Browser speech support varies; no persistent feedback or regenerate control |
| AI Search | Tavily results summarized by Gemini with source links | Requires both API keys |
| Image Studio | Configurable compatible provider adapter | Requires `IMAGE_API_URL` and `IMAGE_API_KEY`; provider-specific async jobs may need extra polling not included |
| Video Studio | Configurable compatible provider adapter | Requires `VIDEO_API_URL` and `VIDEO_API_KEY`; provider-specific async jobs may need extra polling not included |
| Documents | Bounded PDF/DOCX/XLSX/CSV/TXT extraction and extracted-text prompt context | No OCR for scanned PDFs, malware scan or persistent file storage |
| Study/Coding/Writer/Translator | Gemini-guided workflows | Review model output |
| Presentation Maker | AI outline plus basic PPTX export | Basic text slides; inspect deck |
| Data Analysis | CSV/XLSX parsing, bounded preview and basic descriptive statistics | No advanced charts, forecasting or large-file processing |
| AI Agents | Human-approved workflow planning | Does not autonomously execute external tools |
| Oriental Guru | University/subject/unit and answer-format tutoring | No verified official RGPV syllabus or PYQ database |
| College Presentation | AI-generated project content | Verify project facts |
| Admin Panel | Owner-key diagnostics | In-memory admin session and limited analytics |

Status: Demo Mode = intentionally unavailable or missing required credentials; Verification Pending = configured but not verified; Live = a real provider request succeeded; Connection Error = a real request failed.
