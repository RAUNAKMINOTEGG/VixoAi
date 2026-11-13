import test from 'node:test';
import assert from 'node:assert/strict';
import { providerStatus, geminiGenerate, tavilySearch, callCompatibleProvider } from '../src/adapters/providers.js';

test('missing providers report Demo Mode with exact missing variables', () => {
  for (const key of ['GEMINI_API_KEY','TAVILY_API_KEY','IMAGE_API_URL','IMAGE_API_KEY','VIDEO_API_URL','VIDEO_API_KEY','SUPABASE_URL','SUPABASE_ANON_KEY','VONAGE_API_KEY','VONAGE_API_SECRET']) delete process.env[key];
  const status = providerStatus();
  assert.equal(status.gemini.mode, 'Demo Mode');
  assert.match(status.gemini.message, /GEMINI_API_KEY/);
  assert.equal(status.image.mode, 'Demo Mode');
  assert.match(status.image.message, /IMAGE_API_URL, IMAGE_API_KEY/);
  assert.equal(status.video.mode, 'Demo Mode');
});

test('AI adapters reject missing credentials without fabricating output', async () => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.TAVILY_API_KEY;
  delete process.env.IMAGE_API_URL;
  delete process.env.IMAGE_API_KEY;
  await assert.rejects(() => geminiGenerate({ contents: [] }), e => e.status === 503 && e.code === 'PROVIDER_NOT_CONFIGURED');
  await assert.rejects(() => tavilySearch('test'), e => e.status === 503 && e.code === 'PROVIDER_NOT_CONFIGURED');
  await assert.rejects(() => callCompatibleProvider('image', 'test'), e => e.status === 503 && e.code === 'PROVIDER_NOT_CONFIGURED');
});

test('configured but rejected provider key reports Connection Error, not Live', async () => {
  process.env.GEMINI_API_KEY = 'test-invalid-key';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'API key not valid' } }), { status: 401, headers: { 'content-type': 'application/json' } });
  try {
    await assert.rejects(() => geminiGenerate({ contents: [{ role: 'user', parts: [{ text: 'hello' }] }] }), e => e.status === 401);
    assert.equal(providerStatus().gemini.mode, 'Connection Error');
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.GEMINI_API_KEY;
  }
});

test('provider becomes Live only after a successful real adapter response', async () => {
  process.env.GEMINI_API_KEY = 'test-success-key';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'hello from test provider' }] } }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  try {
    const answer = await geminiGenerate({ contents: [{ role: 'user', parts: [{ text: 'hello' }] }] });
    assert.equal(answer, 'hello from test provider');
    assert.equal(providerStatus().gemini.mode, 'Live');
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.GEMINI_API_KEY;
  }
});
