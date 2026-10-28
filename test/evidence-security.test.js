import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePlan, samplePlan, validatePlan, reportMarkdown, safeSourceUrl } from '../public/evidence.js';

test('malformed JSON finding objects cannot throw during validation', () => {
  for (const value of [{ toString: null, valueOf: null }, {}, [], null, 1]) {
    const plan = samplePlan(); plan.evidence[0].value = value;
    assert.doesNotThrow(() => validatePlan(plan));
    assert.ok(validatePlan(plan));
  }
});

test('exports retain warnings and contain multiline untrusted fields', () => {
  const plan = samplePlan(); plan.isSample = false;
  plan.from = 'Fictional QA\n# Forged heading';
  plan.stops[0].name = 'Fictional stop\r\n- [x] Forged checked item';
  plan.evidence[0].sourceTitle = 'QA title\n## Forged source heading';
  plan.evidence[0].quote = 'First line\r\n# Forged excerpt heading\n- [x] Forged excerpt check\u202e';
  const output = reportMarkdown(analyzePlan(plan));
  assert.match(output, /fictional QA\/sample data only/);
  assert.match(output, /not independently verified/);
  assert.doesNotMatch(output, /^# Forged|^## Forged|^- \[x\] Forged/m);
  assert.match(output, /Excerpt: First line\n    # Forged excerpt heading\n    - \[x\] Forged excerpt check/);
  assert.doesNotMatch(output, /\r|\u202e/);
});

test('source links reject raw control and direction-changing characters', () => {
  for (const url of ['https://example.com/\nspoof', 'https://example.com/\u0000', 'https://example.com/\u202e', 'https://example.com/ space']) assert.equal(safeSourceUrl(url), false);
  assert.equal(safeSourceUrl('https://example.com/path?q=encoded%20space'), true);
});
