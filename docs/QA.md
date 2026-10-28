# Evidence workflow verification

Date: 2026-10-28. Local prototype; no public deployment or live Nebius key.

## Automated checks

`npm test` exercises the evidence engine and HTTP server, including:

- Empty, stale, undated, negative, and conflicting evidence.
- Retaining old disagreements rather than assuming the newer report is correct.
- Invalid dates and links, unsupported references, maximum payload size, and relevant criteria for a connecting pavement.
- Exporting source excerpts, missing facts, conflicts, sample labels, and checked questions.
- Restrictive response headers, static resource allowlisting, no key disclosure in config, and missing-key behavior.
- Consent, JSON content type, basic cross-site request rejection, and stripping source links and unrelated properties from upstream payloads.
- Upstream errors, missing model output, and sensitive error redaction with mocked responses.

GitHub Actions runs the suite on Node 20 and 22 for pushes and pull requests.

## Browser checks performed

Desktop browser interaction against the local app:

- Created a new journey with fictional QA places; verified sample evidence was cleared.
- Added a dated source and observed its status change from unknown to reported.
- Added an opposing account and observed a conflict and corresponding question.
- Expanded source records; confirmed literal HTML-like text remained visible as text.
- Exercised the download button and observed its completion state. Export contents are also covered by unit tests.
- Restored the fictional example and verified unavailable AI is clearly described with its button disabled.

## Not yet verified

- Live Nebius compatibility, reasoning quality, latency, or costs.
- Public deployment, production abuse limits, and host/proxy hardening.
- Mobile browser layouts, a screen-reader pass, and a full automated accessibility audit.
- Real-world correctness or source accuracy; sample data is fictional, and custom findings are user-entered.

There is no committed visual regression baseline, so visual regression is inconclusive. The desktop interaction check does not establish full accessibility compliance.
