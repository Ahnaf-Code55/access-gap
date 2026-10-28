import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';
import { samplePlan } from '../public/evidence.js';
async function withServer(options, run) {
  const server = createServer(options);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
const request = () => ({ plan: samplePlan(), consent: true });
const post = (base, payload, extraHeaders = {}) => fetch(`${base}/api/questions`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...extraHeaders }, body: JSON.stringify(payload) });

test('serves page and shared evidence engine with restrictive headers; config exposes no key', async () => {
  await withServer({ apiKey: 'test-key-not-real' }, async base => {
    const res = await fetch(base); assert.equal(res.status, 200); assert.match(res.headers.get('content-security-policy'), /script-src 'self'/); assert.match(await res.text(), /FICTIONAL SAMPLE/);
    assert.equal((await fetch(`${base}/evidence.js`)).status, 200);
    assert.deepEqual(await (await fetch(`${base}/api/config`)).json(), { aiAvailable: true });
    assert.equal((await fetch(`${base}/constructor`)).status, 404);
  });
});
test('missing key leaves the local checklist usable and returns an explicit API error', async () => {
  await withServer({ apiKey: '' }, async base => {
    const res = await post(base, request()); assert.equal(res.status, 503); assert.match((await res.json()).error, /NEBIUS_API_KEY/);
    assert.equal((await fetch(base)).status, 200);
  });
});
test('rejects invalid evidence, missing consent, wrong content type, and cross-site requests before an upstream call', async () => {
  let calls = 0;
  await withServer({ apiKey: 'test-key-not-real', fetchImpl: async () => { calls++; throw new Error(); } }, async base => {
    assert.equal((await post(base, { ...request(), consent: false })).status, 400);
    assert.equal((await post(base, { plan: { ...request().plan, evidence: [{ id: 'x' }] }, consent: true })).status, 400);
    assert.equal((await post(base, request(), { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal((await post(base, request(), { Origin: 'https://attacker.example' })).status, 403);
    assert.equal((await post(base, request(), { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
    assert.equal((await post(base, { ...request(), padding: 'x'.repeat(65000) })).status, 400);
    assert.equal(calls, 0);
  });
});
test('server recomputes evidence and strips URLs and unrelated properties before sending to Nebius', async () => {
  let sent;
  await withServer({ apiKey: 'test-key-not-real', fetchImpl: async (url, options) => { sent = { url, options }; return new Response(JSON.stringify({ choices: [{ message: { content: '<script>untrusted output</script> Ask about the kerb.' } }] })); } }, async base => {
    const payload = request(); payload.plan.extraPrivateData = 'must-not-be-forwarded'; payload.plan.evidence[1].sourceUrl = 'https://example.com/private-link';
    const res = await post(base, payload); assert.equal(res.status, 200); assert.match((await res.json()).questions, /untrusted output/);
    assert.equal(sent.url, 'https://api.tokenfactory.us-central1.nebius.com/v1/chat/completions');
    assert.match(sent.options.body, /nemotron/i); assert.doesNotMatch(sent.options.body, /must-not-be-forwarded|private-link/);
    assert.match(sent.options.body, /conflicting/);
    assert.equal(sent.options.headers.Authorization, 'Bearer test-key-not-real');
  });
});
test('upstream errors and empty output do not leak private error details', async () => {
  for (const upstream of [async () => new Response('private-service-error', { status: 500 }), async () => new Response(JSON.stringify({ choices: [] })), async () => { throw new Error('private-service-error'); }]) {
    await withServer({ apiKey: 'test-key-not-real', fetchImpl: upstream }, async base => {
      const res = await post(base, request()); assert.equal(res.status, 502); assert.doesNotMatch(await res.text(), /private-service-error|test-key-not-real/);
    });
  }
});
