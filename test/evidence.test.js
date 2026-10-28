import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePlan, samplePlan, validatePlan, reportMarkdown, safeSourceUrl } from '../public/evidence.js';
const today = '2026-10-28';
const empty = () => ({ from: 'Station', to: 'Clinic', travelDate: today, isSample: false, stops: [{ id: 'clinic', name: 'Clinic' }], evidence: [] });
const evidence = (changes = {}) => ({ id: 'e1', stopId: 'clinic', criterion: 'entrance', value: 'yes', sourceTitle: 'Venue page', sourceUrl: 'https://example.com/access', observedAt: today, quote: 'The main entrance is step-free.', ...changes });
const entrance = plan => analyzePlan(plan, today).stops[0].facts[0];

test('an empty journey exposes gaps instead of inventing accessible features', () => {
  const report = analyzePlan(empty(), today);
  assert.deepEqual(report.counts, { known: 0, unknown: 5, conflicting: 0 });
  assert.equal(report.questions.length, 5);
});
test('an unavailable report is known evidence but still generates a question', () => {
  const plan = empty(); plan.evidence.push(evidence({ value: 'no' }));
  const result = entrance(plan);
  assert.equal(result.status, 'known'); assert.equal(result.finding, 'no'); assert.ok(result.question);
  assert.match(result.detail, /unavailable/);
});
test('stale or undated evidence never becomes current support', () => {
  for (const date of ['2026-01-01', '']) {
    const plan = empty(); plan.evidence.push(evidence({ observedAt: date }));
    assert.equal(entrance(plan).status, 'unknown'); assert.ok(entrance(plan).question);
  }
});
test('a newer source does not silently overwrite conflicting older evidence', () => {
  const plan = empty(); plan.evidence.push(evidence(), evidence({ id: 'e2', value: 'no', observedAt: '2026-01-01' }));
  assert.equal(entrance(plan).status, 'conflicting'); assert.equal(entrance(plan).evidence.length, 2);
  plan.evidence = plan.evidence.filter(e => e.id !== 'e2');
  assert.equal(entrance(plan).status, 'known');
});
test('invalid dates, future evidence, unsafe URLs, and unmatched places are rejected', () => {
  for (const changes of [{ observedAt: '2026-02-30' }, { observedAt: '2026-10-29' }, { sourceUrl: 'javascript:alert(1)' }, { sourceUrl: 'https://secret@example.com' }, { stopId: 'missing' }, { value: '__proto__' }]) {
    const plan = empty(); plan.evidence.push(evidence(changes)); assert.ok(validatePlan(plan, today));
  }
  assert.equal(safeSourceUrl('https://example.com/access'), true);
});
test('export preserves missing facts, conflicts, source excerpts, and sample labelling', () => {
  const report = analyzePlan(samplePlan(today), today); const output = reportMarkdown(report);
  assert.match(output, /Fictional sample/); assert.match(output, /Sources disagree/); assert.match(output, /raised kerb/); assert.match(output, /date|Date/); assert.match(output, /Questions to confirm/);
  assert.equal(report.counts.conflicting, 1); assert.equal(report.counts.known, 1);
});

test('a connecting pavement only asks about relevant access details', () => {
  const plan = empty(); plan.stops = [{ id: 'walk', name: 'Connecting pavement', kind: 'connection' }];
  const report = analyzePlan(plan, today);
  assert.equal(report.questions.length, 1); assert.equal(report.stops[0].facts[0].criterion, 'pavement');
});
test('download preserves explicitly checked questions', () => {
  const report = analyzePlan(empty(), today);
  const output = reportMarkdown(report, new Set([report.questions[0].id]));
  assert.match(output, /- \[x\] Clinic: Is there a step-free entrance/);
  assert.match(output, /- \[ \] Clinic: Is a working lift/);
});
