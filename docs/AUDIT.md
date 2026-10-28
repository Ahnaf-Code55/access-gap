# Local security handoff audit — 28 October 2026

Scope: issue #1 hardening against baseline commit `083cd034483c819fd07b3915b91d56cbb14f2faf`. GPT-6.1 Terra implemented the server controls, a separate worker implemented regression tests and operational documentation, and GPT-6.1 Sol reviewed the complete resulting patch and supporting browser/server paths, applied corrections, and performed final validation. This is a code review of this patch, not a claim of a formal exhaustive security assessment.

## Audit corrections

- A 10-second socket idle timeout would interrupt otherwise valid model requests with a 30-second deadline. The idle timeout is now 40 seconds; request/header and incomplete-body limits remain 10 seconds. Tests inspect the configuration and exercise incomplete uploads.
- Failed upstream responses could leave unread bodies while releasing concurrency reservations. Error bodies are cancelled before work settles. A regression holds cancellation promises open and verifies that all four reserved slots remain occupied.
- A nested response-body timeout race could abandon a body reader and release a slot while cancellation was pending. An explicit Web stream reader now links cancellation to work settlement; the outer deadline returns a generic error promptly while the reservation remains occupied. Tests cover ignored abort signals, pending cancellation, byte overflow and later slot recovery.
- Stopping a normal request iterator on an oversized body could destroy the socket before returning the intended generic error. Reading now avoids automatic destruction on iterator return; invalid/oversized bodies receive an error and the connection closes after the response flushes. An incomplete timed-out upload is disconnected. Both paths are tested.
- Empty API keys now disable AI consistently instead of preventing the fictional static demo from starting. Invalid nonempty key/model/port configuration still fails closed. HTTP connection, request-per-socket and header bounds were added and checked.

## Validation

`npm test`: **25 passed, 0 failed**, locally on Node.js **26.11.1**. All model transports are mocked, all HTTP traffic is loopback, and no paid calls or real journeys were used. The suite covers authority/origin policy, exact JSON/schema/size bounds, secret-safe failures, static allowlisting and headers, malicious prompts and model output, fixed-template selection, proxy-header spoofing, rate-window and lifetime admission accounting, concurrency, streaming cancellation and deadlines. A DOM/VM browser test checks numbered facts against posted data, JSON fetch options, text-only rendering of hostile content and button recovery after transport failure.

Syntax and whitespace checks passed. The GitHub Actions workflow schedules the same offline suite on Node 20 and 22 with read-only repository permissions and no dependency installation. Those CI executions are pending PR publication; they were not run locally. Keyboard/screen-reader and real-browser visual review remain checklist items.

## Disposition and remaining gates

No unresolved blocking code findings were identified in this local patch review. The result is ready for project-lead PR review as a **localhost, fictional-data prototype**.

Loopback Host policy deliberately rejects public authorities. Public hosting requires a separately reviewed authenticated gateway, TLS, backend isolation and shared accounting. Fixed counters are per server instance, reset on restart and do not impose a provider currency cap. The 45,000-token reservation covers output only; input cost remains separate. A local caller can exhaust allowance. Valid model selections can omit useful checks. Live Nebius availability, schema compatibility, billing, provider retention, real-data privacy and accessibility verification remain unverified. Follow [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) and [PRIVACY.md](PRIVACY.md) before expanding the demo.

No deployment, live model call, merge or external audit approval is recorded by this document.
