const jsonHeaders = { "content-type": "application/json" };
const providerStates = new Map();
export function markProvider(name, mode, message) { providerStates.set(name, { configured: true, mode, message, checkedAt: new Date().toISOString() }); }

export function providerStatus() {
  const required = {
    gemini: ["GEMINI_API_KEY"], tavily: ["TAVILY_API_KEY"],
    image: ["IMAGE_API_URL", "IMAGE_API_KEY"], video: ["VIDEO_API_URL", "VIDEO_API_KEY"],
    supabase: ["SUPABASE_URL", "SUPABASE_ANON_KEY"], vonage: ["VONAGE_API_KEY", "VONAGE_API_SECRET"]
  };
  return Object.fromEntries(Object.entries(required).map(([name, vars]) => {
    const missing = vars.filter(v => !process.env[v]);
    const previous = providerStates.get(name);
    return [name, missing.length
      ? { configured: false, mode: "Demo Mode", message: `Missing: ${missing.join(", ")}` }
      : previous || { configured: true, mode: "Verification Pending", message: "Credentials configured; provider has not yet passed a live request." }];
  }));
}

export async function geminiGenerate({ contents, systemInstruction }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw Object.assign(new Error("Gemini is not configured. Add GEMINI_API_KEY in Render Environment."), { status: 503, code: "PROVIDER_NOT_CONFIGURED" });
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const body = { contents };
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] };
  let response;
  try { response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, { method: "POST", headers: jsonHeaders, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) }); }
  catch { markProvider("gemini", "Connection Error", "Gemini network request failed or timed out."); throw Object.assign(new Error("Gemini connection failed or timed out."), { status: 502, code: "PROVIDER_CONNECTION_ERROR" }); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { markProvider("gemini", "Connection Error", `Gemini returned HTTP ${response.status}.`); throw Object.assign(new Error(data?.error?.message || `Gemini request failed (${response.status})`), { status: response.status, provider: "gemini" }); }
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("\n");
  if (!text) { markProvider("gemini", "Connection Error", "Gemini returned no text."); throw Object.assign(new Error("Gemini returned no text."), { status: 502, provider: "gemini" }); }
  markProvider("gemini", "Live", "Gemini request succeeded.");
  return text;
}

export async function tavilySearch(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw Object.assign(new Error("Tavily is not configured. Add TAVILY_API_KEY."), { status: 503, code: "PROVIDER_NOT_CONFIGURED" });
  let r;
  try { r = await fetch("https://api.tavily.com/search", { method:"POST", headers:jsonHeaders, body:JSON.stringify({api_key:key, query, search_depth:"basic", max_results:5}), signal:AbortSignal.timeout(30000) }); }
  catch { markProvider("tavily", "Connection Error", "Tavily network request failed or timed out."); throw Object.assign(new Error("Tavily connection failed or timed out."), {status:502, code:"PROVIDER_CONNECTION_ERROR"}); }
  const d = await r.json().catch(()=>({}));
  if (!r.ok) { markProvider("tavily", "Connection Error", `Tavily returned HTTP ${r.status}.`); throw Object.assign(new Error(d?.message || `Tavily failed (${r.status})`), {status:r.status, provider:"tavily"}); }
  markProvider("tavily", "Live", "Tavily search succeeded.");
  return d.results || [];
}

export async function callCompatibleProvider(kind, prompt) {
  const base = kind === "image" ? process.env.IMAGE_API_URL : process.env.VIDEO_API_URL;
  const key = kind === "image" ? process.env.IMAGE_API_KEY : process.env.VIDEO_API_KEY;
  if (!base || !key) throw Object.assign(new Error(`${kind} provider is not configured. Add ${kind.toUpperCase()}_API_URL and ${kind.toUpperCase()}_API_KEY.`), {status:503, code:"PROVIDER_NOT_CONFIGURED"});
  let r;
  try { r = await fetch(base, {method:"POST", headers:{...jsonHeaders, authorization:`Bearer ${key}`}, body:JSON.stringify({prompt}), signal:AbortSignal.timeout(90000)}); }
  catch { markProvider(kind, "Connection Error", `${kind} provider network request failed or timed out.`); throw Object.assign(new Error(`${kind} provider connection failed or timed out.`), {status:502, code:"PROVIDER_CONNECTION_ERROR"}); }
  const d = await r.json().catch(()=>({}));
  if (!r.ok) { markProvider(kind, "Connection Error", `${kind} provider returned HTTP ${r.status}.`); throw Object.assign(new Error(d?.error?.message || d?.message || `${kind} provider failed (${r.status})`), {status:r.status, provider:kind}); }
  markProvider(kind, "Live", `${kind} provider request succeeded.`);
  return d;
}
