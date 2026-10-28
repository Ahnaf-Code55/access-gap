# Access Gap trust boundaries

Scope: the current Node.js localhost prototype, fictional browser fixtures and optional Nebius question selection. This model does not authorize deployment or real journeys.

## Browser to Node

The browser and every request field are untrusted. Attackers may modify the journey, add fields, claim facts are known, supply prompt instructions or request the endpoint directly. Host validation limits DNS rebinding to the localhost service; exact Origin matching and JSON content type prevent ordinary cross-origin browser posts. A caller able to omit or forge Origin remains possible, so these controls provide no identity or permission check.

Exact schema and byte limits bound accepted data. Journey and fact strings remain untrusted even after validation. `known` means supported by the fictional sample's stated evidence, not independently verified. The browser uses `textContent`; restrictive CSP and no framing reduce script and UI embedding exposure. Source secrets and server files are outside the three-file static allowlist.

## Node to Nebius

The server alone holds the API key. One fixed HTTPS endpoint receives the system prompt, candidate IDs and validated journey/fact strings. No source URL is fetched, and redirects are refused. The key is an Authorization header, never part of prompts or API responses.

Per-IP and global attempt limits bound repeated requests. A capped IP map bounds retained limiter identities. Process-lifetime admission and output-token ceilings, concurrency, deadlines and streamed byte bounds constrain model use. Failed work consumes the budget; timed-out work that ignores cancellation must continue to occupy its concurrency reservation until it settles. There are no retries.

Compromised local users can invoke the endpoint; distributed public users can exhaust process allowance. A restart resets counters, multiple processes multiply them, IP sharing affects fairness, and input tokens still cost money. Public service needs authentication, shared admission accounting, provider monetary controls, TLS and network isolation. This patch does not supply them.

## Nebius to browser

A model can follow injected instructions or return misleading claims. Prompts alone are insufficient containment. Output is parsed as exactly `{"questionIds":[...]}` with at most five distinct integer IDs from unknown/conflicting input facts. Only fixed server question templates reach the browser. Model prose and supplied labels/details never become question text, executable HTML, factual evidence or route advice.

A valid but poor selection can omit important questions or rank them badly. The static checklist remains available. Model choices cannot establish that a journey is accessible. Live compatibility with the constrained JSON contract is unverified; refusal or malformed output produces a generic unavailable response.

## Future sources and user data

External maps, venue pages and community reports introduce new boundaries and are not integrated here. Before integration: retain source identity, permission, timestamp and freshness; separate reported, unknown and conflicting observations; define evidence standards; prevent source text becoming model instructions; and validate that fetching cannot reach private networks. Real journey collection also requires the privacy gates below. No current security control makes unverified source claims safe to present as verified accessibility.

## Residual risk owners

The project lead owns product evidence, user research and release approval. The security lead owns reviewing authentication, hosting, budgets and secret handling before deployment. Both must approve real-data processing and provider retention terms. Operators own the hosting/proxy logs and provider account quota: the Node app cannot control either.
