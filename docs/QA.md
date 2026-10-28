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
- Upstream errors, missing/model-injected prose, malformed selection IDs and sensitive error redaction with mocked responses.
- Configurable per-client/global limits, injected-clock rate-window recovery, separate lifetime call/output reservations and concurrency.
- Loopback and configured deployment authority/Origin boundaries, DNS rebinding attempts and ignored proxy headers.
- Oversized streaming responses, deadlines, cancellation and concurrency reservations retained until cancellation settles; incomplete upload timeouts.
- Invalid budget/origin/key/model/port configuration fails closed. Only fixed server question templates can reach the AI result.

GitHub Actions is configured to run the suite on Node 20 and 22 for pushes and pull requests. This configuration alone does not establish a successful CI run; consult the PR checks. Local security runs use mocked upstreams only.

## Previously recorded browser checks

The product workflow update recorded these desktop browser interactions against the local app before the security integration:

- Created a new journey with fictional QA places; verified sample evidence was cleared.
- Added a dated source and observed its status change from unknown to reported.
- Added an opposing account and observed a conflict and corresponding question.
- Expanded source records; confirmed literal HTML-like text remained visible as text.
- Exercised the download button and observed its completion state. Export contents are also covered by unit tests.
- Restored the fictional example and verified unavailable AI is clearly described with its button disabled.

## Not yet verified

- Live Nebius compatibility, reasoning quality, latency, or costs.
- Public deployment, actual provider monetary caps, deployed authentication/edge limits and selected host/proxy/TLS configuration. Local limits and explicit allowlisting are covered offline.
- Mobile browser layouts, a screen-reader pass, and a full automated accessibility audit.
- Real-world correctness or source accuracy; sample data is fictional, and custom findings are user-entered.

There is no committed visual regression baseline, so visual regression is inconclusive. The desktop interaction check does not establish full accessibility compliance.

The custom workflow is available for fictional QA only pending privacy/release approval. Export tests cover source links/excerpts and checked state; saved reports persist outside the application. Current browser automation and final audit evidence are recorded separately in [AUDIT.md](AUDIT.md).

## Release follow-up, 28 October 2026

The integrated suite now has 47 tests, including a public-source fixture check. Chrome reflow checks at 320px and 375px found no horizontal overflow. All form controls had labels in a DOM-backed check. Keyboard activation of the skip link moved focus to `#journey` after making the target programmatically focusable.

Axe-core 4.14.0 with the WCAG A/AA rule tags found six contrast failures in the first mobile run. After color adjustments, desktop and mobile reruns reported zero violations (28 and 27 passing checks respectively). `aria-prohibited-attr` and `color-contrast` still include incomplete/manual cases; see `docs/audits/`. This is not a full compliance certification or a substitute for screen-reader-user testing.

The public evidence demo was published successfully using Sites and its public-source example was exercised in Chrome. It explicitly reports AI unavailable. Live Nebius validation remains pending signup/key setup.
