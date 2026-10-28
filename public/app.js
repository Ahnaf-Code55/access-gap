const journey = 'Riverside Station to Garden Community Clinic (fictional sample)';
const steps = [
  { name: 'Riverside Station', kind: 'YOUR START', facts: [
    { label: 'Step-free entrance', status: 'known', detail: 'Sample station guide describes a level entrance.', source: 'Fictional station guide', date: 'Example: 12 Oct 2026' },
    { label: 'Lift availability', status: 'unknown', detail: 'No current lift status is available in this sample.', source: 'No source provided', date: 'Not checked' }
  ] },
  { name: 'The connecting pavement', kind: 'ON THE WAY', facts: [
    { label: 'Kerb access', status: 'conflicting', detail: 'One fictional report describes a ramp; another describes a raised kerb.', source: 'Two fictional community reports', date: 'Example: Sep–Oct 2026' }
  ] },
  { name: 'Garden Community Clinic', kind: 'YOUR DESTINATION', facts: [
    { label: 'Entrance width', status: 'unknown', detail: 'The example venue page does not list the entrance width.', source: 'Fictional venue page', date: 'Not checked' },
    { label: 'Accessible toilet', status: 'unknown', detail: 'No toilet information is provided in the sample.', source: 'No source provided', date: 'Not checked' }
  ] }
];
const labels = { known: 'Supported', unknown: 'Unknown', conflicting: 'Conflicting' };
const stepsEl = document.querySelector('#steps');
function element(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
let checkNumber = 0;
steps.forEach((step, index) => {
  const section = element('section', 'step');
  const marker = element('div', 'marker', String(index + 1)); marker.setAttribute('aria-hidden', 'true'); section.append(marker);
  const body = element('div', 'step-body'); body.append(element('div', 'tiny', step.kind), element('h4', '', step.name));
  for (const fact of step.facts) {
    const card = element('div', 'fact'); const top = element('div', 'fact-top'); top.append(element('strong', '', `Check ${++checkNumber} · ${fact.label}`), element('span', `badge ${fact.status}`, labels[fact.status]));
    card.append(top, element('p', '', fact.detail), element('div', 'source', `${fact.source} · ${fact.date}`)); body.append(card);
  }
  section.append(body); stepsEl.append(section);
});
const questions = ['Is the station lift working on the day of travel?', 'Is there a step-free kerb along the connecting pavement?', 'How wide is the clinic entrance?', 'Is there an accessible toilet at the clinic?'];
for (const q of questions) document.querySelector('#checklist').append(element('li', '', q));
const button = document.querySelector('#ai-button');
button.addEventListener('click', async () => {
  const result = document.querySelector('#ai-result'); result.textContent = 'Preparing questions…'; button.disabled = true;
  try {
    const response = await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ journey, facts: steps.flatMap(s => s.facts.map(({label, status, detail}) => ({label, status, detail}))) }) });
    const data = await response.json(); result.textContent = response.ok ? data.questions : data.error || 'Could not prepare questions.';
  } catch { result.textContent = 'Could not reach the server. Try again.'; }
  finally { button.disabled = false; }
});
