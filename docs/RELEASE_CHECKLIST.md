# Release checklist and remaining risks

Project and security leads should review this together. Local hardening and a custom input interface do not authorize public deployment or real journeys.

## Local review evidence

- [ ] Review the full evidence workflow and security patch together. Confirm no credentials or real journeys/needs entered fixtures, source, history or logs.
- [ ] Run the complete offline suite under Node 20 and 22, preserving evidence/export tests. All upstream responses must remain mocked; CI configuration is not proof of a successful run.
- [ ] Exercise sample/custom fictional QA workflows, stale/conflicting/negative findings, source inspection/removal, checkbox reset, source links and downloaded report contents. Confirm check numbers match their evidence cards.
- [ ] Confirm consent gates both browser/server requests; source URLs and unrelated properties stay out of the upstream projection even for direct HTTP callers. Confirm server recomputation ignores forged verdicts.
- [ ] Confirm missing/empty key leaves the local checklist usable, config exposes only availability, and generic errors/429 states restore the UI controls. Verify keyboard and screen-reader behavior.
- [ ] Review configurable limits and exact deployment allowlisting, fail-closed invalid configuration, cancellation and concurrency retention. Obtain independent project-lead review of the PR before merging.

## Before a protected public demo

- [ ] Obtain explicit deployment approval. Keep fictional-only notices visible for sample, custom inputs and exports. No real journey fields or accessibility needs may be used pending privacy review.
- [ ] Set authentication, rate/concurrency controls and a private backend at the edge. Configure `ACCESS_GAP_ALLOWED_ORIGINS` with exact HTTPS origins and test matching authority/Origin behavior through the real proxy. It supplies an allowlist, not TLS or proxy trust. Preserve the external Origin and validated Host; do not rewrite attacker Origin to bypass checks. Reject direct backend access. Forwarded IP/authority headers remain untrusted.
- [ ] Choose conservative `ACCESS_GAP_*` rates, lifetime calls and output allowance; validate startup rejects empty/invalid values. Set a provider-enforced monetary quota, restricted dedicated demo key and account alerts. Input tokens cost extra; process restarts/replicas reset or multiply local allowance. Add shared persistent accounting before scaling.
- [ ] Verify HTTPS, certificate handling, redirects, HSTS and deployed CSP/security headers on normal/error paths. Plain localhost HTTP does not send HSTS.
- [ ] Inject secrets through protected environment/secrets management. Keep keys out of assets, build logs and browser configuration. Record revocation/rotation and rapid AI-disable procedures.
- [ ] Disable sensitive platform/proxy request logging, establish retention/access, and monitor safe aggregate error/rate/budget signals without bodies, URLs containing sensitive data or Authorization headers.
- [ ] Test request/body/header/connection/time limits through the actual runtime/proxy. Validate configured authorities and all error paths. Serverless restarts and replica/process counts require explicit budget design.
- [ ] Separately authorize a small fictional-data paid smoke test: verify model availability and exact JSON ID-selection contract, refusal/malformed output, latency, billing and provider cap behavior. Never present mocks as live inference.
- [ ] Record rollback: remove public route, disable/revoke demo key, stop affected processes, inspect safe usage records and require review before restoration.

## Before real journeys or new sources

- [ ] Complete all [privacy decisions](PRIVACY.md), including provider training/retention terms, minimization, clear notice, deletion/access and exported-file handling.
- [ ] Define evidence permission, provenance, recency and conflict standards. Recomputed classifications remain based on user-selected findings, not semantic truth verification; model output never becomes evidence.
- [ ] Review new fetching/feeds for SSRF, private-network access, hostile instructions and source licensing.
- [ ] Seek accessibility-practitioner and representative-user feedback. Test mobile, keyboard, screen-reader and export workflows without implying compliance or travel safety from automated tests alone.

Residual limitations: no authentication, shared persistent spend ledger, currency cap, hosted proxy/TLS configuration or independent source truth verification. Local callers can exhaust allowance. Valid AI selection can omit useful checks. Downloads persist outside application control. These remain release decisions.
