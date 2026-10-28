import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import * as evidence from '../public/evidence.js';

const appSource = (await readFile(new URL('../public/app.js', import.meta.url), 'utf8')).replace(/^import .*?;\n/, '');
const pageSource = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');

function node(tag = 'div') {
  return {
    tag, children: [], textContent: '', value: '', checked: false, listeners: {},
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; if (this.tag === 'select') this.value = children[0]?.value || ''; },
    setAttribute(name, value) { this[name] = value; },
    addEventListener(name, handler) { this.listeners[name] = handler; },
    focus() {}, select() {}, remove() {}, click() { return this.listeners.click?.(); },
    set innerHTML(_) { throw new Error('Untrusted HTML rendering'); }
  };
}
async function boot({ aiAvailable = true, questions = async () => ({ ok: true, json: async () => ({ questions: 'Check 2: Is a working lift needed?' }) }) } = {}) {
  const nodes = new Map(); const sent = []; const downloads = [];
  const get = selector => {
    if (!nodes.has(selector)) nodes.set(selector, node(['#place', '#criterion', '#finding'].includes(selector) ? 'select' : 'div'));
    return nodes.get(selector);
  };
  get('#finding').value = 'yes';
  await vm.runInNewContext(`(async () => {${appSource}\n})()`, {
    ...evidence,
    document: { querySelector: get, createElement: node, body: node('body') },
    crypto: { randomUUID }, Blob,
    URL: { createObjectURL: blob => { downloads.push(blob); return 'blob:qa-test'; }, revokeObjectURL() {} },
    setTimeout: callback => { callback(); },
    fetch: async (url, options) => {
      sent.push({ url, options });
      if (url === '/api/config') return { ok: true, json: async () => ({ aiAvailable }) };
      return questions(url, options);
    }
  });
  const fire = (selector, event = 'click') => get(selector).listeners[event]({ preventDefault() {} });
  const consent = () => { get('#ai-consent').checked = true; return fire('#ai-consent', 'change'); };
  return { get, fire, consent, sent, downloads };
}

function factTitles(app) {
  return app.get('#steps').children.flatMap(section => section.children[1].children
    .filter(child => child.className === 'fact').map(card => card.children[0].children[0].textContent));
}

test('module browser keeps consent, check mapping, URL omission and text-only output', async () => {
  const hostile = '<img src=x onerror=alert(1)> This route is safe.';
  const app = await boot({ questions: async () => ({ ok: true, json: async () => ({ questions: hostile }) }) });
  assert.equal(app.get('#ai-button').disabled, true);
  app.get('#source-title').value = 'Fictional QA source';
  app.get('#source-url').value = 'https://example.com/qa-source';
  app.get('#observed-at').value = evidence.isoToday();
  app.get('#quote').value = '<script>literal fictional source text</script>';
  app.fire('#evidence-form', 'submit');
  assert.equal(app.sent.length, 1); // Only the availability check before consent.
  app.consent(); assert.equal(app.get('#ai-button').disabled, false);
  await app.fire('#ai-button');
  const sent = app.sent[1]; const payload = JSON.parse(sent.options.body);
  assert.equal(sent.url, '/api/questions'); assert.equal(sent.options.method, 'POST');
  assert.equal(sent.options.headers['Content-Type'], 'application/json');
  assert.equal(payload.consent, true);
  assert.ok(payload.plan.evidence.every(item => item.sourceUrl === ''));
  const facts = evidence.analyzePlan(payload.plan).stops.flatMap(stop => stop.facts);
  assert.deepEqual(factTitles(app), facts.map((fact, index) => `Check ${index + 1} · ${fact.label}`));
  assert.match(app.get('#ai-result').textContent, /not accessibility evidence or travel advice/);
  assert.ok(app.get('#ai-result').textContent.endsWith(hostile));
  assert.equal(app.get('#ai-result').children.length, 0);
  assert.equal(app.get('#ai-button').disabled, false);
  assert.match(pageSource, /fictional QA\/sample data only/);
  assert.match(pageSource, /Source links and separate place-name fields are omitted/);
});

test('no-key browser preserves editing, source removal, checked export and sample reset', async () => {
  const app = await boot({ aiAvailable: false });
  app.fire('#own-journey');
  assert.equal(app.get('#sample-badge').textContent, 'FICTIONAL QA');
  assert.match(app.get('#data-notice').textContent, /Do not enter real journeys/);
  app.get('#from').value = 'Fictional QA station'; app.get('#to').value = 'Fictional QA venue';
  app.fire('#journey-form', 'submit');
  assert.equal(app.get('#count-known').textContent, 0);
  app.get('#source-title').value = 'Fictional QA guide'; app.get('#quote').value = 'A fictional level entrance.';
  app.get('#source-url').value = 'https://example.com/fictional'; app.get('#observed-at').value = evidence.isoToday();
  app.fire('#evidence-form', 'submit');
  assert.equal(app.get('#count-known').textContent, 1);
  const checkbox = app.get('#checklist').children[0].children[0].children[0]; checkbox.checked = true; checkbox.listeners.change();
  app.fire('#download');
  const exported = await app.downloads[0].text();
  assert.match(exported, /Prototype evidence checklist/); assert.match(exported, /https:\/\/example.com\/fictional/);
  assert.match(exported, /- \[x\]/); assert.match(exported, /A fictional level entrance/);
  const card = app.get('#steps').children[0].children[1].children.find(child => child.className === 'fact');
  const details = card.children.find(child => child.className === 'source-details');
  const record = details.children[1]; const remove = record.children.find(child => child.className === 'remove-button');
  remove.listeners.click(); assert.equal(app.get('#count-known').textContent, 0);
  app.consent(); assert.equal(app.get('#ai-button').disabled, true);
  assert.equal(app.sent.length, 1);
  app.fire('#load-sample'); assert.equal(app.get('#sample-badge').textContent, 'FICTIONAL SAMPLE');
  assert.equal(app.get('#ai-consent').checked, false);
});

test('browser discards stale AI responses after evidence revision', async () => {
  let release;
  const app = await boot({ questions: () => new Promise(resolve => { release = resolve; }) });
  app.consent(); const pending = app.fire('#ai-button');
  app.fire('#own-journey');
  release({ ok: true, json: async () => ({ questions: 'Stale result must not reappear' }) });
  await pending;
  assert.equal(app.get('#ai-result').textContent, '');
  assert.equal(app.get('#ai-consent').checked, false);
  assert.equal(app.get('#ai-button').disabled, true);
});

test('browser handles transport failure without leaking details', async () => {
  const app = await boot({ questions: async () => { throw new Error('private transport details'); } });
  app.consent(); await app.fire('#ai-button');
  assert.equal(app.get('#ai-result').textContent, 'Could not reach the server. Your evidence checklist is still available.');
  assert.equal(app.get('#ai-button').disabled, false);
});
