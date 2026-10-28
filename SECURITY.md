# Security and privacy

Security lead: Turjo ([@TRahman2414](https://github.com/TRahman2414)).

This is a local, early-stage prototype. It binds to localhost by default; it is not ready for public deployment. Do not use real private journeys or sensitive information in the demo.

## Current boundaries

- `NEBIUS_API_KEY` is read on the server and is never intentionally sent to the browser. Local `.env` files are ignored by git.
- The only AI endpoint sends the fictional sample journey to a fixed Nebius endpoint. It does not fetch user-provided URLs.
- The server limits JSON request size, validates its shape, sets security headers, and renders AI output as text.
- Model output is untrusted and must never be treated as proof that a route is accessible.

## Security lead review before public deployment

- Add authentication or appropriate abuse controls, request-rate limiting, spending limits, and monitoring for the AI endpoint.
- Review prompt injection and data disclosure; keep third-party content untrusted and test hostile examples.
- Define privacy and retention rules before accepting real user journeys; document exactly what goes to Nebius.
- Verify HTTPS, secure hosting, secret rotation, and deployed content security policy.
- Review accessibility evidence, source permissions, stale information, and failure states with the product lead.

Please report vulnerabilities privately to a repository maintainer rather than opening a public issue containing exploit details.
