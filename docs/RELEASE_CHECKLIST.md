# Release checklist and remaining risks

This checklist is for the project lead and security lead to review together. Completion of local hardening does not authorize public deployment or real-data collection.

## Local review evidence

- [ ] Review the patch, trust model and privacy rules; verify no credentials or real journey data entered source, fixtures, history or logs.
- [ ] Run `npm test` under Node 20 and a current supported Node version. All upstream responses must remain mocked; no test should consume paid API usage.
- [ ] Confirm ordinary same-origin browser behavior, fictional-data labels, ordered check references, keyboard flow and screen-reader announcement.
- [ ] Verify absent/empty key disables AI and the static checklist remains usable. Check generic failure and 429 UI behavior.
- [ ] Have the project lead independently audit the PR and record unresolved issues before merging.

## Before a protected public demo

- [ ] Obtain explicit deployment approval. Keep the fictional-data restriction visible; no real journey fields or accessibility needs.
- [ ] Put authentication and rate/concurrency controls at a trusted edge. Node accepts only loopback authorities: a public proxy must be designed and tested explicitly, reach a private loopback/private backend, and normalize Host/Origin safely. Do not simply disable validation or trust forwarded headers. Prevent direct backend exposure.
- [ ] Set a provider-enforced monetary quota and a least-privilege dedicated demo key. Confirm quota behavior and account alerts with the operator. Remember the app reserves output tokens only; input cost, restarts and replica counts increase spend. Add shared persistent accounting before scaling beyond one controlled process.
- [ ] Configure HTTPS at the edge, verify certificates, redirects, HSTS and the deployed CSP/security headers on normal and failure paths. HSTS is not sent by the plain-HTTP localhost app.
- [ ] Use a secret manager or protected environment injection; never bundle the key into assets, build logs or client configuration. Limit key access, document revocation/rotation and disable AI immediately if exposed or spend exceeds plan.
- [ ] Disable sensitive proxy/platform logging; set explicit log retention and access. Monitor safe aggregate error/rate/budget counters without recording journey bodies or Authorization headers.
- [ ] Test request/header/body/time/connection bounds through the actual proxy and deployment runtime. Serverless/replicated restarts reset local accounting and may require a different deployment design.
- [ ] Separately authorize a small paid model smoke test with fictional data; verify model availability, the restricted selection JSON contract, timeouts/refusal/errors and actual billing/usage limits. No live API compatibility is claimed by offline tests.
- [ ] Document stop/rollback steps: remove public route, disable/revoke demo key, stop affected processes, inspect safe usage records, and require review before restoring service.

## Before accepting real journeys or sources

- [ ] Complete every decision in [PRIVACY.md](PRIVACY.md), including provider retention/training terms, minimization, notice, deletion and access.
- [ ] Define evidence, attribution and freshness requirements for external sources. Ensure unknown/conflicting claims remain distinct and that model output never becomes evidence.
- [ ] Review any new fetching for SSRF, malicious source instructions, licensing and private-network access.
- [ ] Test with accessibility practitioners and representative users; confirm the product never encourages reliance on fictional or unverified information for travel safety.

Residual local limitations: no authentication, shared persistent spend ledger, currency cap, real-time source verification or public proxy configuration. A local process can exhaust the allowance; valid model selection can omit useful questions. These are release decisions, not promises supplied by the current patch.
