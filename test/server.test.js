import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';

async function withServer(options, run) {
  const server = createServer(options);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
const request = { journey: 'Sample route', facts: [{ label: 'Lift', status: 'unknown', detail: 'Status missing' }] };

test('serves sample page with a restrictive security policy', async () => {
  await withServer({}, async base => {
    const res = await fetch(base); assert.equal(res.status, 200); assert.match(res.headers.get('content-security-policy'), /script-src 'self'/); assert.match(await res.text(), /FICTIONAL SAMPLE/);
  });
});
test('missing key fails clearly without an upstream call', async () => {
  await withServer({ apiKey: '' }, async base => {
    const res = await fetch(`${base}/api/questions`, { method: 'POST', body: JSON.stringify(request) }); assert.equal(res.status, 503); assert.match((await res.json()).error, /NEBIUS_API_KEY/);
  });
});
test('rejects invalid facts and returns model output as text', async () => {
  let sent;
  await withServer({ apiKey: 'test-key', fetchImpl: async (url, options) => { sent = {url, options}; return new Response(JSON.stringify({ choices: [{ message: { content: 'Is the lift working?' } }] }), {status: 200}); } }, async base => {
    let res = await fetch(`${base}/api/questions`, { method: 'POST', body: JSON.stringify({ journey: 'x', facts: [{ label: 'Lift', status: 'safe', detail: '' }] }) }); assert.equal(res.status, 400);
    res = await fetch(`${base}/api/questions`, { method: 'POST', body: JSON.stringify(request) }); assert.equal(res.status, 200); assert.equal((await res.json()).questions, 'Is the lift working?');
    assert.equal(sent.url, 'https://api.tokenfactory.us-central1.nebius.com/v1/chat/completions'); assert.match(JSON.parse(sent.options.body).model, /nemotron/i);
  });
});
