# Security and privacy

Security lead: Turjo ([@TRahman2414](https://github.com/TRahman2414)). Team leader: [@Ahnaf-Code55](https://github.com/Ahnaf-Code55).

Access Gap is a localhost prototype. The example and all custom journey/evidence testing must use **fictional QA data only**. Public deployment and real journeys, locations, disability information or accessibility needs require the release and privacy reviews below. Model output never verifies accessibility or recommends travel.

## Data flow

1. Journey fields, structured findings, source URLs and excerpts are held in browser memory. Adding, removing or editing evidence does not send it to Node or Nebius. Reload clears the tab's state. No database, analytics, cookies or local-storage persistence is implemented.
2. Source links are opened only when selected by the user. They must be HTTP(S) URLs without embedded credentials; the application does not fetch them server-side or verify their truthfulness.
3. An AI request requires explicit consent on both client and server. The browser strips source URLs and posts `{plan, consent:true}`. The server validates evidence and recomputes statuses using the shared evidence engine, including stale/undated and conflicting reports; it ignores client-supplied classifications.
4. The fixed Nebius endpoint receives only travel date, sample flag and eligible facts' opaque server-generated check IDs/criteria, recomputed status/finding, and source titles, dates, excerpts and stale/undated flags. Separate start/destination/place-name fields, source URL fields and unrelated properties are excluded from that projection, including for direct HTTP callers. Shared titles/excerpts can themselves contain links or identifying text; their content is not semantically redacted.
5. A downloaded checklist includes source links, excerpts and checkbox state. It persists wherever the user saves or shares it. The application cannot delete those copies. No journey payloads or provider error bodies are logged by the application; hosting/provider retention is a separate review.

## Implemented boundaries

- The executable binds to `127.0.0.1`. Every request requires a loopback Host with the actual listening port, or an explicitly configured deployment authority. A supplied Origin must match the exact allowed origin for that Host. Missing Origin supports local/native clients; opaque `null`, malformed and mismatched origins are rejected. Cross-site browser metadata is rejected on the AI endpoint. These checks do not authenticate callers.
- Proxy forwarding headers are ignored. `ACCESS_GAP_ALLOWED_ORIGINS` can allow exact HTTPS deployment origins, but does not configure TLS, binding or a trusted proxy. HTTP origins are permitted only for loopback. Wildcards, credentials, paths, fragments and noncanonical origins are invalid.
- JSON type, byte/time limits, bounded fields/collections, valid dates/references and HTTP(S)-only source links are enforced. The request's top level is exactly `plan` and `consent`; unrelated plan/evidence properties are never forwarded upstream.
- Every POST to the AI endpoint after Host/Origin and cross-site metadata validation consumes per-client and global attempt allowance, including malformed bodies. Upstream concurrency, lifetime request and output-token reservations have separate admission checks; failed/timed-out work consumes allowance. There are no retries.
- The key exists only in the server environment and upstream Authorization header. `.env*` files are gitignored except placeholders; Node does not automatically load them. Missing/empty key disables AI. Malformed configuration prevents startup.
- Model output must be exactly `{"questionIds":[...]}` with up to five unique eligible string IDs. The server renders fixed criterion questions as `Check N: ...`; arbitrary generated prose, claims, markup, URLs and extra output fields are rejected. Known negative/limited findings remain eligible for questions. No untrusted place name, ID or source excerpt is copied into returned question text.
- Streamed upstream bytes/deadlines and connection/header bounds limit resource use. Cancellation completes before its concurrency slot releases; work ignoring cancellation keeps its slot. Responses omit credentials/provider error details. Security headers cover normal application responses and application-generated errors; parser-level errors and socket closures bypass that handler. Static serving allows only `/`, `/app.js`, `/evidence.js` and `/style.css`; `/api/config` returns only an availability boolean.

## Limits and configuration

Defaults apply independently to each server instance/process. Restarting resets allowance and multiple instances multiply it. Behind a proxy, all callers share the proxy's socket IP unless a separately reviewed design changes that boundary.

- JSON body: 64,000 bytes and 10 seconds. The shared plan validator permits up to five places and 40 records; current UI uses three places. Place names are at most 100 characters, identifiers 40, source titles 120, source URLs/excerpts 500, with validated dates and references. The 90-day evidence review window is a prototype policy, not an accessibility guarantee.
- AI attempts: 10 per socket IP and 60 globally per 60-second window; at most 1,024 IP records. Expired entries are pruned on subsequent AI attempts. Spoofed `X-Forwarded-For` and `X-Real-IP` are ignored.
- Upstream: 4 concurrent operations; 30-second deadline; 65,536 response bytes; redirects disabled; 450 output tokens per call.
- Lifetime: 100 admitted upstream calls and 45,000 reserved output tokens. Reservations are not refunded on failure. No eligible questions means no upstream call.
- HTTP: 64 maximum connections, 100 requests per socket, 8,192 header bytes; header/request timeout 10 seconds with a one-second timeout check interval; default idle socket timeout 40 seconds.

Environment overrides are positive decimal integers within these bounds: `ACCESS_GAP_PER_IP_LIMIT` 1–60, `ACCESS_GAP_GLOBAL_LIMIT` 1–600, `ACCESS_GAP_MAX_INFLIGHT` 1–8, `ACCESS_GAP_MAX_REQUESTS` 1–1,000, `ACCESS_GAP_MAX_OUTPUT_TOKENS` 1–450,000, and `ACCESS_GAP_WINDOW_MS` 1–3,600,000. Empty, zero, fractional, nonfinite and oversized settings fail closed. `ACCESS_GAP_ALLOWED_ORIGINS` is a comma-separated list of exact origins, with no spaces or trailing slash. Programmatic tests can inject bounded `limits`, `now` and `allowedOrigins`; body/upstream deadlines may only be shortened. A token allowance below 450 permits no upstream calls.

Output-token reservations are **not a currency spending cap**: input tokens cost money and are not included in that reservation. Provider pricing, account controls, processes and restarts affect total spend. Require a provider-enforced monetary quota, restricted demo key, authentication, edge controls and deployment review before public use. Rate/lifetime denials return 429; unavailable AI returns generic 503/502 errors.

## Review and release

[Threat model](docs/THREAT_MODEL.md), [privacy and retention rules](docs/PRIVACY.md), and [release checklist](docs/RELEASE_CHECKLIST.md) distinguish implemented controls from hosting-dependent work. Offline mocked tests do not establish real model compatibility, public deployment safety, source truthfulness or accessibility compliance.

Report vulnerabilities privately to a repository maintainer rather than opening a public issue containing exploit details.
