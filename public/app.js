import { CRITERIA, VALUES, isoToday, samplePlan, validatePlan, analyzePlan, reportMarkdown } from '/evidence.js';
const $ = selector => document.querySelector(selector);
let plan = samplePlan();
let report;
let aiAvailable = false;
let revision = 0;
let aiBusy = false;
const checkedQuestions = new Set();
const labels = { known: 'Reported', unknown: 'Unknown', conflicting: 'Conflicting' };
function element(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
function message(text) { $('#form-status').textContent = text; }
function refreshAiButton() { $('#ai-button').disabled = !aiAvailable || !$('#ai-consent').checked || aiBusy; }
function resetAi() { checkedQuestions.clear(); revision++; $('#ai-result').textContent = ''; $('#ai-consent').checked = false; refreshAiButton(); }
function fillJourneyForm() { $('#from').value = plan.from; $('#to').value = plan.to; $('#travel-date').value = plan.travelDate; }
function render() {
  report = analyzePlan(plan);
  $('#sample-badge').textContent = plan.isSample ? 'FICTIONAL SAMPLE' : 'FICTIONAL QA';
  $('#data-notice').textContent = plan.isSample ? 'Illustrative data only. The sample places and sources are fictional. Do not use this example for travel planning.' : 'Fictional QA evidence only. Do not enter real journeys, locations, disability information or accessibility needs. These sources are not independently verified and must not be used for travel planning.';
  $('#route-title').textContent = `${plan.from} → ${plan.to}`;
  for (const key of ['known', 'unknown', 'conflicting']) $(`#count-${key}`).textContent = report.counts[key];
  $('#steps').replaceChildren();
  $('#place').replaceChildren(...plan.stops.map(s => { const option = element('option', '', s.name); option.value = s.id; return option; }));
  fillCriteria();
  let checkNumber = 0;
  report.stops.forEach((stop, index) => {
    const section = element('section', 'step'); const marker = element('div', 'marker', String(index + 1)); marker.setAttribute('aria-hidden', 'true'); section.append(marker);
    const body = element('div', 'step-body'); body.append(element('h4', '', stop.name));
    for (const fact of stop.facts) {
      const card = element('div', 'fact'); const top = element('div', 'fact-top'); top.append(element('strong', '', `Check ${++checkNumber} · ${fact.label}`), element('span', `badge ${fact.status}`, labels[fact.status]));
      card.append(top, element('p', '', fact.detail));
      if (fact.evidence.length) {
        const details = element('details', 'source-details'); details.append(element('summary', '', `View ${fact.evidence.length} source${fact.evidence.length === 1 ? '' : 's'}`));
        for (const item of fact.evidence) {
          const source = element('div', 'source-record');
          source.append(element('strong', '', item.sourceTitle), element('div', 'source-date', `${item.observedAt || 'Date unknown'}${item.stale ? ' · Over 90 days old' : ''}`), element('blockquote', '', item.quote));
          if (item.sourceUrl) { const link = element('a', '', 'Open source ↗'); link.href = item.sourceUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; source.append(link); }
          const remove = element('button', 'remove-button', 'Remove evidence'); remove.type = 'button'; remove.setAttribute('aria-label', `Remove ${item.sourceTitle} evidence for ${fact.label} at ${stop.name}`);
          remove.addEventListener('click', () => { plan.evidence = plan.evidence.filter(e => e.id !== item.id); resetAi(); render(); message('Evidence removed. Checklist updated.'); }); source.append(remove); details.append(source);
        }
        card.append(details);
      }
      body.append(card);
    }
    section.append(body); $('#steps').append(section);
  });
  $('#checklist').replaceChildren();
  for (const q of report.questions) {
    const li = element('li'); const label = element('label', 'check-label'); const input = element('input'); input.type = 'checkbox'; input.checked = checkedQuestions.has(q.id); input.addEventListener('change', () => { if (input.checked) checkedQuestions.add(q.id); else checkedQuestions.delete(q.id); }); label.append(input, element('span', '', q.text)); li.append(label); $('#checklist').append(li);
  }
  if (!report.questions.length) $('#checklist').append(element('li', '', 'No gaps found in the supplied reports. Confirm current conditions for your travel date.'));
}
function fillCriteria() {
  const stop = plan.stops.find(s => s.id === $('#place').value);
  $('#criterion').replaceChildren(...CRITERIA.filter(c => stop?.kind !== 'connection' || c.id === 'pavement').map(c => { const option = element('option', '', c.label); option.value = c.id; return option; }));
}
$('#place').addEventListener('change', fillCriteria);
$('#observed-at').max = isoToday();
fillJourneyForm(); render();

$('#journey-form').addEventListener('submit', event => {
  event.preventDefault();
  const from = $('#from').value.trim(); const to = $('#to').value.trim();
  const renamed = from !== plan.from || to !== plan.to;
  const candidate = { ...plan, from, to, travelDate: $('#travel-date').value };
  if (renamed) { candidate.stops = [{ id: 'start', name: from }, { id: 'path', name: 'Connecting pavement', kind: 'connection' }, { id: 'destination', name: to }]; candidate.evidence = []; candidate.isSample = false; }
  const error = validatePlan(candidate); if (error) return message(error);
  plan = candidate; resetAi(); render(); message(renamed ? 'Journey updated. Previous evidence was cleared because the places changed.' : 'Travel date updated.');
});
$('#own-journey').addEventListener('click', () => {
  plan = { from: 'Fictional starting point', to: 'Fictional destination', travelDate: isoToday(), isSample: false, stops: [{ id: 'start', name: 'Fictional starting point' }, { id: 'path', name: 'Connecting pavement', kind: 'connection' }, { id: 'destination', name: 'Fictional destination' }], evidence: [] };
  resetAi(); fillJourneyForm(); render(); message('Enter fictional QA places only, then choose Update journey.'); $('#from').focus(); $('#from').select();
});
$('#load-sample').addEventListener('click', () => { plan = samplePlan(); resetAi(); fillJourneyForm(); render(); message('Fictional example restored. Your previous changes were cleared.'); });
$('#evidence-form').addEventListener('submit', event => {
  event.preventDefault();
  const evidence = { id: crypto.randomUUID(), stopId: $('#place').value, criterion: $('#criterion').value, value: $('#finding').value, sourceTitle: $('#source-title').value.trim(), sourceUrl: $('#source-url').value.trim(), observedAt: $('#observed-at').value, quote: $('#quote').value.trim() };
  const candidate = { ...plan, evidence: [...plan.evidence, evidence] };
  const error = validatePlan(candidate); if (error) return message(error);
  plan = candidate; resetAi(); render(); $('#source-title').value = ''; $('#source-url').value = ''; $('#quote').value = ''; message('Evidence added. Report and questions updated.');
});
$('#download').addEventListener('click', () => {
  const blob = new Blob([reportMarkdown(report, checkedQuestions)], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = element('a'); link.href = url; link.download = 'access-gap-checklist.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); message('Checklist downloaded. It includes source links and excerpts.');
});
$('#ai-consent').addEventListener('change', refreshAiButton);
$('#ai-button').addEventListener('click', async () => {
  const requestRevision = revision; aiBusy = true; refreshAiButton(); $('#ai-result').textContent = 'Preparing questions…';
  try {
    const response = await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: { ...plan, evidence: plan.evidence.map(e => ({ ...e, sourceUrl: '' })) }, consent: $('#ai-consent').checked }) });
    const data = await response.json();
    if (revision === requestRevision) $('#ai-result').textContent = response.ok ? `AI-selected questions — not accessibility evidence or travel advice\n\n${data.questions || 'No additional checks selected.'}` : data.error || 'Could not prepare questions.';
  } catch { if (revision === requestRevision) $('#ai-result').textContent = 'Could not reach the server. Your evidence checklist is still available.'; }
  finally { aiBusy = false; refreshAiButton(); }
});
try {
  const response = await fetch('/api/config'); if (!response.ok) throw new Error(); const config = await response.json(); aiAvailable = config.aiAvailable === true;
  $('#ai-availability').textContent = aiAvailable ? 'AI selects check IDs using NVIDIA Nemotron on Nebius Token Factory. Questions use fixed templates; selection can omit useful checks.' : 'AI is not configured on this server. The evidence checklist and download work without an API key.';
} catch { $('#ai-availability').textContent = 'Could not check AI availability. The evidence checklist and download are available.'; }
refreshAiButton();
