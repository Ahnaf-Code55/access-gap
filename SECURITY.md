# Security and privacy

Security lead: Turjo ([@TRahman2414](https://github.com/TRahman2414)). Team leader: [@Ahnaf-Code55](https://github.com/Ahnaf-Code55).

The server binds to localhost by default. Public hosting remains pending abuse protection and deployment review.

## Data flow

1. Journey details, structured findings, source URLs, and source excerpts are held in browser memory. There is no database, analytics, or local-storage persistence.
2. Adding or editing evidence does not send it to the server. Source links are only visited if the user opens them.
3. An AI request requires consent. The browser omits source URLs and sends the plan to `/api/questions`. The server recomputes classifications and forwards only the fields needed for questions to a fixed Nebius endpoint.
4. The code does not log journey payloads or upstream error bodies. Hosting and provider logs/retention still need to be verified before using real sensitive information.
5. A downloaded checklist includes source links and excerpts. The user controls where it is saved and shared.

## Implemented boundaries

- Environment-only API key; `.env*` ignored except the placeholder example.
- Explicit JSON content type, a 64 KB request cap, maximum field lengths and collection sizes, date and reference validation, and HTTP(S)-only credential-free links.
- Browser cross-site metadata and differing Origin/Host pairs rejected at the AI endpoint. These checks are a baseline, not complete host/proxy protection.
- Explicit AI consent checked on both client and server; server classification does not trust client verdicts.
- Fixed upstream URL, a 30-second upstream timeout, output length cap, and plain-text rendering.
- Source content is described as untrusted in the model prompt. This is not a complete defense against prompt injection or misleading generated output.
- Restrictive CSP, no-sniff, no-referrer, and no-store headers. Static resources are served from an explicit allowlist.

## Turjo's release work

- Implement rate limits, bounded concurrent AI requests, practical global request/spending caps, and clear 429/503 behavior. Document single-process versus multi-instance limitations.
- Review origin, host, DNS rebinding, CSRF, and proxy handling for the chosen deployment. Do not trust forwarded headers unless the proxy is explicitly trusted.
- Exercise oversized and malformed requests, link schemes, hostile excerpts, HTML-like model output, secret leakage, and service failures with focused tests.
- Document privacy and retention before real journeys or accessibility needs are collected. Confirm what the hosting provider and Nebius retain.
- Review HTTPS, secret configuration, exposure/binding, logging, timeout/resource limits, and smoke-test the hosted app before release.
- Keep source provenance, stale evidence, and conflicting reports visible. Never let model output imply that an unknown route is confirmed accessible.

Please report vulnerabilities privately to a repository maintainer rather than opening a public issue containing exploit details.
