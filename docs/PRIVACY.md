# Privacy and retention rules

Current rule: **fictional fixtures only**. Do not enter or test real origin/destination pairs, health/disability details, accessibility needs, names, contact information, account identifiers or provider secrets. Shape validation cannot determine whether a string describes a real person or journey; this restriction depends on operators and reviewers.

## Current data flow

Loading the page serves checked-in fictional fixtures. Pressing the optional AI button posts the fictional journey title and each fact's `label`, `status` and `detail` to Node. Source labels and dates displayed by the browser are not included in that API payload. The Node server sends those same accepted journey/fact fields plus candidate IDs and a fixed system prompt to Nebius Token Factory at the fixed endpoint. The API key travels only in the server's Authorization header. With no key or no uncertain facts there is no model request.

Node holds request/response bytes in memory for processing. It writes no journey database, application request/body logs, analytics, cookies or browser storage. Responses use `Cache-Control: no-store`; this is a cache instruction, not a guarantee of erasure from browser memory, crash dumps or operating-system memory. The browser displays output until it changes or the page is closed/reloaded.

The in-memory limiter retains the socket IP, a count and a window timestamp. Expired entries are removed on later AI attempts; with no later attempts they can remain until process exit. At most 1,024 entries are retained. Aggregate rate and lifetime counters last until process exit. The application does not log these identities. Reverse proxies, hosting infrastructure, network operators and Nebius may have separate logs/retention; their behavior is not established by these offline tests.

## Gates before real-data collection

The project and security leads must record the following decisions before enabling any real journey input:

- A narrow purpose and the minimum fields needed; avoid storing precise journeys and disability needs when aggregate or local-only processing can meet the purpose.
- A clear, accessible notice explaining optional AI egress, recipients, geography, retention, deletion and contact route before a user submits information. Determine an appropriate basis/permission for processing and a way to decline AI while retaining useful non-AI behavior.
- Provider terms and account configuration covering retention, model training use, processing region, subprocessors and deletion. No specific Nebius retention or training promise is assumed here.
- Explicit retention durations for application data, provider records, infrastructure logs, backups and crash reports; deletion procedures and ownership; access controls for each location.
- Data-flow review for new map/venue/community sources, separating public source evidence from sensitive user needs. Redact secrets and personal content from monitoring and support reports.
- An incident response and notification owner, export/deletion procedures, and review with relevant privacy expertise for the intended users and hosting jurisdiction.

Until those decisions are complete, do not accept or save real journeys, build profiles or reuse demo traffic for analytics/training. Do not paste sensitive payloads into GitHub issues or audit emails.
