# Access Gap trust boundaries

Scope: the current Node.js localhost prototype, custom fictional QA journey/evidence editor, local checklist export and optional Nebius question selection. This model authorizes neither public deployment nor real journey processing.

## Browser and source records to Node

The browser and all evidence fields are untrusted. A caller can submit hostile excerpts, forged classifications, private extra fields, misleading dates/structured findings or arbitrary IDs. Validation does not establish source accuracy. The shared evidence engine recomputes missing, stale, undated, conflicting and reported findings; a newer report never automatically resolves disagreement. Known findings remain user-reported evidence, not an independently verified route verdict.

Edits remain in browser memory until an explicit consented AI request. Source links are validated HTTP(S) links without credentials and opened only on user action; the server never fetches them. Source and model text render as text. Downloaded plain-text reports contain source links/excerpts and checkbox state, so they introduce a persistent artifact outside application deletion control.

Host validation prevents ordinary DNS rebinding to the loopback service. A supplied Origin must match a permitted Host exactly; opaque/null, malformed and differing origins fail. Cross-site browser metadata and non-JSON posts fail. Missing Origin is intentionally supported, so these checks provide no authentication against local processes or HTTP callers that forge headers.

Loopback hosts must match the actual listening port. Optional exact deployment origins permit HTTPS authorities; they do not enable a listener, TLS or public service. HTTP allowlist entries are loopback-only. Proxy headers are ignored. Public hosting still requires a private backend, verified authority forwarding, TLS, authentication and edge controls. Rewriting a hostile Origin at the proxy can defeat the browser boundary and must not be permitted.

## Node to Nebius

Only Node holds the key. One fixed HTTPS endpoint receives a fixed prompt and a minimal projection: travel date, sample flag, opaque server-generated check IDs/criteria, recomputed statuses/findings, and associated source titles, dates, excerpts and stale/undated flags. Separate source URL and start/destination/place-name fields and unrelated properties are omitted even for direct HTTP clients. Titles and excerpts are shared verbatim and can contain links or identifying text. The key appears only in the Authorization header. Redirects and supplied-URL fetching are disabled.

Per-client/global attempts, a bounded IP map, concurrency, process-lifetime call/output-token reservation ceilings, streamed byte bounds and deadlines constrain abuse. Operators may configure bounded rates/budgets; malformed configuration fails closed. Failed work consumes its admission. Timed-out work ignoring cancellation retains its slot until it settles. There are no automatic retries. Injectable clock and bounded test deadlines permit deterministic offline admission and cancellation checks.

Input tokens still cost money. Restarts reset counters, replicas multiply allowance and shared proxy IPs affect fairness. Local callers can exhaust the allowance. Require a provider-enforced monetary quota and dedicated key, authentication and shared accounting before a broader trial. No process-local counter is a complete spending or availability guarantee.

## Nebius to browser

A prompt alone cannot contain injection or misleading answers. Model output is parsed as exactly `{"questionIds":[...]}` with at most five unique strings from server-derived candidates. Candidates include missing/conflicting information and reported unavailable/limited access. The server returns fixed criterion question templates with a one-based check number; untrusted IDs, place names, source text and generated prose never become question text, factual evidence, HTML or route advice.

A valid selection can still omit important checks or rank them poorly. The local evidence report and checklist remain available; AI does not replace them. Live compatibility with the constrained selection schema is unverified. Refusal, malformed output and service failure produce generic errors without provider details or secret values.

## Future sources and real users

External maps, scraping and community feeds are not integrated. Before integration, review permissions, provenance, date/freshness standards, untrusted source instructions and SSRF/private-network boundaries. Before real user data, complete the privacy decisions in [PRIVACY.md](PRIVACY.md). The current input interface does not grant approval to enter real journeys or sensitive needs.

The project lead owns evidence/product validity and release decisions. The security lead owns hosting, authentication, budgets and secret review. Both must approve real-data processing and provider retention terms. Operators own infrastructure logs, provider quota and key rotation; the Node application cannot control those systems.
