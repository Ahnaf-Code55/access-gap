# Integrated security handoff audit — 28 October 2026

Scope: integrate security commit `d44736f24fd9da03f8e92ea09dac6c43a4746a47` with product workflow commit `f010e678e005b50e9f8d0f7582c6cd742059c802` and the updated issue #1 acceptance criteria. GPT-6.1 Terra implemented server integration/configuration, a separate worker integrated regression tests and documentation, and GPT-6.1 Sol reviewed the complete combined source, tests, documentation, CI and supporting paths, fixed confirmed findings and performed final validation. This is a patch code review, not a formal exhaustive security assessment.

## Preserved workflow and updated contract

The editable journey/evidence workflow, source inspection/removal, classification engine, stale/negative/conflicting findings, explicit consent, availability endpoint, revision guard, checked checklist download and no-key local operation are retained. The original eight evidence/export tests are unchanged. Inputs and exports are labelled fictional QA/sample data only pending privacy/release approval.

The API accepts exactly `{plan, consent:true}`, bounds the body to 64,000 bytes, validates the shared plan schema and recomputes classifications. No client verdict is trusted. The model receives only a minimal projection of eligible gaps, including negative/limited reported findings, with opaque `check-N` aliases. Separate place-name, source URL and unrelated fields are omitted; shared source titles/excerpts are still untrusted verbatim text and may contain links or identifying text. Output must select at most five unique permitted aliases. The server renders fixed criterion question templates, mapped to numbered cards, without copying generated prose or untrusted names/IDs into question text.

Per-client/global rates, concurrency, lifetime requests/output reservations and rate windows are configurable within validated bounds; invalid settings fail closed. Tests inject a clock and short deadlines without mutating global clocks/timers. Loopback defaults remain; optional exact configured origins support deployment authorities without enabling TLS, external binding, authentication or proxy-header trust. One Node 20/22 CI workflow remains; the duplicate security workflow is removed.

## Findings fixed during audit

- **Malformed evidence could throw:** an object-valued finding with null coercion methods reached `Object.hasOwn` key conversion. The shared validator now requires a string before lookup. Engine and HTTP regressions verify rejection, no upstream call and continued server operation.
- **Export structure could be forged:** embedded newlines/control characters in place/source/excerpt fields could introduce headings or checked rows in the plain-text report. Inline fields now collapse line breaks, excerpt continuation lines are indented, and control/direction-changing characters are replaced. Tests preserve readable excerpts, checkbox state and permanent fictional/unverified warnings. Raw control/whitespace characters in source URLs are rejected.
- **Wildcard origin configuration was accepted:** the URL parser accepts literal wildcard hostnames even though configuration promises exact origins. Explicit wildcard rejection and a regression now enforce that promise.
- **Unnecessary identifiers could disclose names:** model IDs formerly contained user-controlled stop identifiers. Opaque server-derived aliases now carry the selection mapping without forwarding those identifiers.
- **Earlier resource fixes retained:** socket idle timeout exceeds the upstream deadline; failed upstream bodies are cancelled; concurrency remains reserved until cancellation settles even when abort is ignored; oversized inbound bodies return a safe error before connection closure; empty keys disable AI consistently. Regression tests cover these failure paths and connection/header limits.

## Validation

`npm test`: **46 passed, 0 failed**, locally on Node.js **26.11.1**. Model responses are mocked, HTTP traffic is loopback, and no paid calls or real journeys were used. Coverage includes evidence/export rules, malicious inputs/output, consent, minimized egress and recomputation, authority/origin/proxy boundaries, invalid environment/option configuration, independent process ceilings, rate windows, concurrency, streamed byte limits, deadlines, cancellation and safe errors.

Four DOM/VM browser tests exercise the module app: consent and numbered-card mapping, URL-field omission and text-only rendering, no-key editing/source removal/checked download/reset, stale AI-result suppression after revision, and transport failure recovery. These are behavioral harness tests rather than a full real-browser or accessibility assessment. Earlier product browser checks remain attributed in [QA.md](QA.md).

Syntax and whitespace checks pass. GitHub Actions is configured for Node 20 and 22 with a read-only token, no persisted checkout credentials, no dependency installation and a five-minute bound. CI on the integrated commit is pending publication; it was not run locally. Full keyboard/screen-reader, mobile and visual regression checks remain release items.

## Disposition and limits

No unresolved blocking code findings were identified in the combined local patch review. The integrated result is ready for project-lead PR review as a localhost fictional-data prototype.

Allowlisting is not authentication; originless/native clients remain supported. Public hosting still requires reviewed TLS/gateway authority handling, authentication, backend isolation and provider monetary controls. All counters are process-local, reset on restart and multiply across replicas. Output reservations omit input-token cost and impose no currency cap. Local callers can exhaust allowance. Model selection can omit useful checks. Downloaded files persist outside application control. Live Nebius compatibility, provider retention/billing, real-data privacy and source/accessibility truth remain unverified. Follow [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) and [PRIVACY.md](PRIVACY.md).

No deployment, live model call, merge approval or external audit approval is recorded here.
