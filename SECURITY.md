# Security and privacy

Security lead: Turjo ([@TRahman2414](https://github.com/TRahman2414)).

Access Gap is a localhost prototype using **fictional sample data only**. It is not approved for public deployment or real journeys, locations, disability information, or accessibility needs. Model output never verifies accessibility or recommends travel.

## Implemented boundaries

- The executable binds to `127.0.0.1`. Every request must have a loopback Host with the actual listening port. An Origin, when present, must match that HTTP authority exactly. Originless local clients are supported. These checks are browser abuse defenses, not authentication.
- The AI endpoint accepts only bounded JSON with the documented journey/facts fields. It never fetches supplied URLs. Proxy forwarding headers are ignored.
- Every POST to the AI endpoint after Host/Origin validation consumes per-IP and process-wide rate allowance, including malformed bodies. Fixed process-local limits also bound concurrent model work, admitted calls and reserved output tokens. There are no automatic retries.
- The server sends a fixed system prompt and JSON data to one fixed Nebius endpoint. The model may select at most five unique IDs belonging to uncertain facts. The server constructs every returned question from fixed templates; arbitrary model prose, claims, markup, URLs, invalid IDs and additional selection fields are rejected. Facts marked `known` remain unverified fictional sample observations.
- Request bodies and upstream responses have byte and time limits. Security headers cover normal application responses and application-generated errors; parser-level errors and socket closures bypass that handler. Static serving permits only `/`, `/app.js` and `/style.css`. Application errors omit provider responses, credentials and stack traces.
- The key stays in the server environment and Authorization header. `.env` files are gitignored. The app does not automatically load `.env` files. No application database, analytics, request-body logging or persistent journey storage is implemented.

## Fixed local controls

Limits apply independently to each `createServer` instance/process. They cannot enforce a shared budget across replicas or restarts.

- JSON body: 12,000 bytes, 10 seconds; journey: 150 characters; 1–20 facts; label: 100 characters; detail: 500 characters.
- AI attempts: 10 per socket IP and 60 globally per 60-second window; at most 1,024 current IP records. No trust is placed in `X-Forwarded-For` or `X-Real-IP`.
- Upstream work: 4 concurrent operations; 30-second deadline; 65,536 response bytes; redirects disabled; at most 450 output tokens per call.
- Lifetime admissions: 100 upstream calls and 45,000 reserved output tokens. Failed and timed-out admissions consume allowance. Reservations are not refunded. No uncertain facts means no upstream admission.
- HTTP connections: 64 maximum, 100 requests per socket, 8,192 header bytes; header/request timeout 10 seconds with a one-second timeout check interval; idle socket timeout 40 seconds.

The output-token ceiling is **not a currency spending cap**. Input tokens also cost money; input size is bounded but not included in the output reservation. Model pricing, account settings, additional processes and restarts affect total spend. A provider-enforced monetary quota, restricted demo key and authenticated edge are required before any public trial. Missing or empty key disables AI; malformed key/model/port settings prevent startup. Rate and lifetime denials return 429; unavailable AI returns generic 503/502 responses.

## Review and release requirements

[Threat model](docs/THREAT_MODEL.md), [privacy and retention rules](docs/PRIVACY.md), and [release checklist](docs/RELEASE_CHECKLIST.md) record the remaining decisions. Public hosting, paid API validation and real-data collection remain separate approval gates. These controls have offline mocked tests; a real Nebius model returning the restricted selection schema has not been verified.

Report vulnerabilities privately to a repository maintainer rather than opening a public issue containing exploit details.
