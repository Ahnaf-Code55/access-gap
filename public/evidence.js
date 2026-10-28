// Shared by the browser and server. A reported fact is never a route safety verdict.
export const FRESHNESS_DAYS = 90;
export const CRITERIA = [
  { id: 'entrance', label: 'Step-free entrance', question: 'Is there a step-free entrance, and where is it?' },
  { id: 'lift', label: 'Lift access', question: 'Is a working lift needed, and will it be available on the travel date?' },
  { id: 'pavement', label: 'Pavement and kerbs', question: 'Are the pavement and kerb crossings step-free?' },
  { id: 'doorway', label: 'Doorway access', question: 'What is the clear doorway width, and are there any thresholds?' },
  { id: 'toilet', label: 'Accessible toilet', question: 'Is an accessible toilet available during the visit?' }
];
export const VALUES = { yes: 'Reported available', no: 'Reported unavailable', limited: 'Reported with limitations' };
const DAY_MS = 86400000;
const criterionIds = new Set(CRITERIA.map(c => c.id));
const text = (value, max, min = 1) => typeof value === 'string' && value.trim().length >= min && value.length <= max;
export function isoToday() { return new Date().toISOString().slice(0, 10); }
function day(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN;
  const time = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === date ? time : NaN;
}
export function safeSourceUrl(value) {
  if (!value) return true;
  if (typeof value !== 'string' || value.length > 500 || /[\u0000-\u0020\u007f-\u009f\u2028\u2029\u202a-\u202e\u2066-\u2069]/.test(value)) return false;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
}
export function validatePlan(plan, today = isoToday()) {
  if (!plan || typeof plan !== 'object' || !text(plan.from, 100) || !text(plan.to, 100)) return 'Enter a start and destination (up to 100 characters each).';
  if (!Number.isFinite(day(plan.travelDate))) return 'Choose a valid travel date.';
  if (typeof plan.isSample !== 'boolean') return 'Specify whether this is sample data.';
  if (!Array.isArray(plan.stops) || plan.stops.length < 1 || plan.stops.length > 5) return 'Add between one and five places.';
  if (plan.stops.some(s => !s || !text(s.id, 40) || !text(s.name, 100) || (s.kind !== undefined && !['venue', 'connection'].includes(s.kind)))) return 'Each place needs a name and identifier.';
  const stopIds = new Set(plan.stops.map(s => s.id));
  if (stopIds.size !== plan.stops.length) return 'Place identifiers must be unique.';
  if (!Array.isArray(plan.evidence) || plan.evidence.length > 40) return 'Use no more than 40 evidence records.';
  const ids = new Set();
  for (const item of plan.evidence) {
    if (!item || !text(item.id, 40) || ids.has(item.id)) return 'Evidence identifiers must be unique.';
    ids.add(item.id);
    if (!stopIds.has(item.stopId) || (plan.stops.find(s => s.id === item.stopId)?.kind === 'connection' && item.criterion !== 'pavement') || !criterionIds.has(item.criterion) || typeof item.value !== 'string' || !Object.hasOwn(VALUES, item.value)) return 'Choose a place, access detail, and reported finding for every record.';
    if (!text(item.sourceTitle, 120) || !text(item.quote, 500)) return 'Every record needs a source title and an excerpt or observation.';
    if (typeof item.sourceUrl !== 'string' || !safeSourceUrl(item.sourceUrl)) return 'Use an HTTP or HTTPS source link without embedded credentials.';
    if (typeof item.observedAt !== 'string' || (item.observedAt && (!Number.isFinite(day(item.observedAt)) || day(item.observedAt) > day(today)))) return 'Evidence dates must be valid and cannot be in the future. Leave the date empty if unknown.';
  }
  return null;
}

export function analyzePlan(plan, today = isoToday()) {
  const error = validatePlan(plan, today);
  if (error) throw new Error(error);
  const stops = plan.stops.map(stop => ({ ...stop, facts: CRITERIA.filter(c => stop.kind !== 'connection' || c.id === 'pavement').map(criterion => {
    const evidence = plan.evidence.filter(e => e.stopId === stop.id && e.criterion === criterion.id).map(e => ({ ...e, stale: Boolean(e.observedAt && (day(today) - day(e.observedAt)) / DAY_MS > FRESHNESS_DAYS), undated: !e.observedAt }));
    const current = evidence.filter(e => !e.stale && !e.undated);
    // Keep disagreements visible, even when one source is older; newer is not automatically correct.
    const values = new Set(evidence.map(e => e.value));
    let status = 'unknown';
    let detail = 'No evidence has been added for this detail.';
    let finding = null;
    if (values.size > 1) { status = 'conflicting'; detail = 'Sources disagree. Confirm which account applies before travelling.'; }
    else if (current.length) { status = 'known'; finding = current[0].value; detail = `${VALUES[finding]}. ${current.length} dated source${current.length === 1 ? '' : 's'} within the ${FRESHNESS_DAYS}-day review window; not independently verified.`; }
    else if (evidence.length) { detail = 'Only older or undated evidence is available. Confirm the current situation.'; }
    const needsCheck = status !== 'known' || finding !== 'yes';
    const question = needsCheck ? `${stop.name}: ${status === 'conflicting' ? 'The sources disagree. ' : ''}${criterion.question}` : null;
    return { id: `${stop.id}:${criterion.id}`, criterion: criterion.id, label: criterion.label, status, finding, detail, evidence, question };
  }) }));
  const facts = stops.flatMap(s => s.facts);
  return { from: plan.from, to: plan.to, travelDate: plan.travelDate, isSample: plan.isSample, assessedAt: today, freshnessDays: FRESHNESS_DAYS, stops,
    counts: { known: facts.filter(f => f.status === 'known').length, unknown: facts.filter(f => f.status === 'unknown').length, conflicting: facts.filter(f => f.status === 'conflicting').length },
    questions: facts.filter(f => f.question).map(f => ({ id: f.id, text: f.question })) };
}

export function reportMarkdown(report, checked = new Set()) {
  // Keep user text inside its field: it cannot create headings or checked rows.
  const clean = value => String(value).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '\uFFFD').replace(/\r\n?|[\u2028\u2029]/g, '\n');
  const inline = value => clean(value).replace(/\n/g, ' ');
  const excerpt = value => clean(value).replace(/\n/g, '\n    ');
  const lines = ['# Access Gap evidence checklist', '', `${inline(report.from)} → ${inline(report.to)}`, `Travel date: ${report.travelDate} | Assessed: ${report.assessedAt}`, '', '**Local prototype: fictional QA/sample data only. Do not use for travel.**', report.isSample ? '**Fictional sample data. Do not use for travel.**' : '**User-supplied QA evidence; not independently verified.**', `Review window: ${report.freshnessDays} days. A source date is not a guarantee of current conditions.`, ''];
  for (const stop of report.stops) {
    lines.push(`## ${inline(stop.name)}`, '');
    for (const fact of stop.facts) {
      lines.push(`- ${fact.label}: ${fact.status === 'known' ? VALUES[fact.finding] : fact.status}. ${fact.detail}`);
      for (const e of fact.evidence) lines.push(`  Source: ${inline(e.sourceTitle)} (${e.observedAt || 'date unknown'}${e.stale ? ', needs a freshness check' : ''})`, `  Link: ${inline(e.sourceUrl || 'not provided')}`, `  Excerpt: ${excerpt(e.quote)}`);
    }
    lines.push('');
  }
  lines.push('## Questions to confirm', '', ...report.questions.map(q => `- [${checked.has(q.id) ? 'x' : ' '}] ${inline(q.text)}`), '', 'Check current conditions directly with the provider before travelling. No route geometry or safety assessment is provided.');
  return lines.join('\n');
}

export function samplePlan(today = isoToday()) {
  const dated = offset => new Date(day(today) - offset * DAY_MS).toISOString().slice(0, 10);
  return { from: 'Riverside Station', to: 'Garden Community Clinic', travelDate: today, isSample: true,
    stops: [{ id: 'station', name: 'Riverside Station' }, { id: 'path', name: 'Connecting pavement', kind: 'connection' }, { id: 'clinic', name: 'Garden Community Clinic' }],
    evidence: [
      { id: 'sample-1', stopId: 'station', criterion: 'entrance', value: 'yes', sourceTitle: 'Fictional station guide', sourceUrl: '', observedAt: dated(3), quote: 'The north entrance is level with the pavement.' },
      { id: 'sample-2', stopId: 'path', criterion: 'pavement', value: 'yes', sourceTitle: 'Fictional community report A', sourceUrl: '', observedAt: dated(12), quote: 'There is a dropped kerb at the crossing.' },
      { id: 'sample-3', stopId: 'path', criterion: 'pavement', value: 'no', sourceTitle: 'Fictional community report B', sourceUrl: '', observedAt: dated(2), quote: 'A raised kerb blocks the crossing.' },
      { id: 'sample-4', stopId: 'clinic', criterion: 'toilet', value: 'yes', sourceTitle: 'Fictional clinic brochure', sourceUrl: '', observedAt: dated(120), quote: 'An accessible toilet is located near reception.' }
    ] };
}
