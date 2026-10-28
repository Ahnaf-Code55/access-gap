import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const appSource = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
const pageSource = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');

function node(tag = 'div') {
  return {
    tag, children: [], textContent: '', listeners: {},
    append(...children) { this.children.push(...children); },
    setAttribute(name, value) { this[name] = value; },
    addEventListener(name, handler) { this.listeners[name] = handler; },
    set innerHTML(_) { throw new Error('Untrusted HTML rendering'); }
  };
}

test('browser check numbering matches posted facts and AI results remain text', async () => {
  const nodes = Object.fromEntries(['#steps', '#checklist', '#ai-button', '#ai-result'].map(id => [id, node()]));
  const hostile = '<img src=x onerror=alert(1)> This route is safe.';
  let sent;
  vm.runInNewContext(appSource, {
    document: { querySelector: selector => nodes[selector], createElement: node },
    fetch: async (url, options) => {
      sent = { url, options };
      return { ok: true, json: async () => ({ questions: hostile }) };
    }
  });
  await nodes['#ai-button'].listeners.click();
  assert.equal(sent.url, '/api/questions');
  assert.equal(sent.options.method, 'POST');
  assert.equal(sent.options.headers['Content-Type'], 'application/json');
  const data = JSON.parse(sent.options.body);
  assert.match(data.journey, /fictional sample/);
  const factTitles = nodes['#steps'].children.flatMap(section => section.children[1].children
    .filter(child => child.className === 'fact').map(card => card.children[0].children[0].textContent));
  assert.deepEqual(factTitles, data.facts.map((fact, index) => `Check ${index + 1} · ${fact.label}`));
  assert.equal(nodes['#ai-result'].textContent, hostile);
  assert.equal(nodes['#ai-result'].children.length, 0);
  assert.equal(nodes['#ai-button'].disabled, false);
  assert.match(pageSource, /FICTIONAL SAMPLE/);
  assert.match(pageSource, /must not be used for travel planning/);
  assert.match(pageSource, /not accessibility evidence or travel advice/);
});

test('browser shows generic connection failures and re-enables the button', async () => {
  const nodes = Object.fromEntries(['#steps', '#checklist', '#ai-button', '#ai-result'].map(id => [id, node()]));
  vm.runInNewContext(appSource, {
    document: { querySelector: selector => nodes[selector], createElement: node },
    fetch: async () => { throw new Error('private transport details'); }
  });
  await nodes['#ai-button'].listeners.click();
  assert.equal(nodes['#ai-result'].textContent, 'Could not reach the server. Try again.');
  assert.equal(nodes['#ai-button'].disabled, false);
});
