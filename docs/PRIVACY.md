# Privacy and retention rules

Current rule: **fictional fixtures and fictional QA entries only, plus the built-in attributed public-institution example in docs/SOURCES.md**, including the custom journey/evidence workflow. Do not enter real origin/destination pairs, health/disability information, accessibility needs, names, contact information, account identifiers or secrets. Validation cannot tell whether a journey or excerpt describes a real person; operators and reviewers must enforce this restriction pending the privacy and release reviews.

## Current data flow

The browser serves the checked-in fictional example and permits local editing of journey fields and evidence. The tab holds start/destination, place names, travel date, structured findings, source titles/URLs/dates/excerpts, checked questions and an optional AI draft in memory. Adding, removing or editing evidence sends no journey payload to Node or Nebius. Reload clears application state; there is no application database, analytics, cookie, local-storage or profile persistence.

Selecting a source link opens that URL and leaves the application boundary; the destination may receive network/browser metadata and apply its own retention policies. Source URL validation is not a privacy guarantee. The application does not fetch links in Node.

AI requires explicit consent. The browser strips source URL fields, then sends the plan and `consent:true` to Node. Node validates and recomputes classifications. Nebius receives only a fixed prompt, travel date, sample flag, opaque server-generated check IDs/criteria, computed statuses/findings, and relevant source titles/dates/excerpts with stale/undated flags. The server omits separate start/destination/place-name fields, source URL fields and unrelated properties, including for direct HTTP clients. Source titles and excerpts may themselves contain links or identifying/sensitive text; they are shared verbatim. Minimization is no permission to enter real data. The key is only an upstream Authorization header. Missing key or no eligible questions means no model request.

Node retains processing bytes in memory but writes no journey database, request/body logs, provider error bodies or analytics. `Cache-Control: no-store` requests cache avoidance; it cannot erase browser memory, crash dumps, operating-system memory or separate infrastructure records. The application does not establish Nebius or hosting retention/training behavior through its offline tests.

Downloaded plain-text checklists contain journey fields, source URLs/excerpts, findings and checked questions. They persist in user-selected files and any backups or shared copies. Reloading the page does not delete downloads; users must manage those copies and avoid exporting or sharing sensitive material. Reports retain warnings about fictional QA use and unverified evidence.

The in-memory rate limiter holds socket IPs, counts and window timestamps, at most 1,024 entries. Expired entries are removed on later AI attempts; with no later traffic they can remain until process exit. Aggregate rate/lifetime counters last until process exit. The application does not log limiter identities. Proxies, hosting infrastructure, network operators and Nebius may retain separate records under policies that remain to be reviewed.

## Gates before real-data collection

The project and security leads must document and approve:

- The purpose and minimum fields needed; avoid precise journey/disability profiles when local-only or aggregate processing can meet the purpose.
- An accessible notice before input/submission explaining optional AI sharing, recipients, geography, retention/deletion, source-link navigation and downloaded files. Establish suitable processing permission/basis and a useful way to decline AI.
- Provider terms/configuration covering retention, training use, processing regions, subprocessors and deletion. No Nebius retention or training promise is assumed here.
- Explicit retention durations, access controls and deletion ownership for application data, provider records, proxy/platform logs, backups, crash reports and support copies. Explain that exported files are outside server deletion control.
- Provenance/permission and data-flow review for external sources, separating public evidence from sensitive personal needs. Keep sensitive payloads and credentials out of monitoring, support tickets, audit emails and GitHub issues.
- Incident response, export/deletion/contact procedures and review with relevant privacy expertise for intended users and jurisdictions.

The curated public-institution fixture contains no private journey or personal accessibility profile and may be shown with its attribution and uncertainty labels. All other custom workflows remain fictional until the gates above are complete. Do not collect profiles or reuse demo inputs for analytics or training.
