# Access Gap

**Know before you go.** Build an accessibility evidence checklist from the information you have. Access Gap keeps missing, stale, unavailable, and conflicting reports visible, and helps you prepare questions for venues and transport operators.

An early project for the [Nebius x NVIDIA Global AI Hackathon](https://nebiusglobalaihackathon.devpost.com/), Best Apps and Agents track.

## Public demo

[Open Access Gap](https://access-gap-hackathon.brinyberry67.chatgpt.site). The hosted demo runs the evidence workflow in the browser; paid AI is explicitly disabled. The guarded Node/Nebius path can be run locally after key setup.

## Run locally

Node.js 20 or later. No external package dependencies or installation step is needed.

```sh
git clone https://github.com/Ahnaf-Code55/access-gap.git
cd access-gap
npm start
```

Open http://127.0.0.1:3000. Run `npm test` for the automated tests.

## What you can do

- Explore a clearly labelled fictional example, or exercise the custom start, destination, and travel-date workflow with fictional QA places. Real journeys and personal accessibility needs remain prohibited until the privacy and release reviews are approved.
- Add an evidence record: place, access detail, reported finding, source title, optional link, date, and excerpt.
- Inspect the resulting evidence cards and source records; remove records and see the checklist recalculate.
- Keep conflicting accounts visible. A newer report does not automatically override an older report.
- See evidence older than 90 days, or with no date, treated as unknown unless another current source supports it. Disagreements remain conflicting regardless of age.
- Get follow-up questions for missing, conflicting, unavailable, or limited access. Mark questions checked and download the report as plain text with sources and checkbox state.
- Optionally ask NVIDIA Nemotron through Nebius Token Factory to select relevant checks; the server renders their questions from fixed templates.

Evidence entered in the app exists in the current tab and clears on reload. Downloaded reports persist wherever the user saves or shares them and include source links and excerpts. Changing place names clears the old evidence; changing the travel date preserves it. Evidence edits clear checked questions and any AI draft because the underlying facts changed.

## Optional AI integration

Create an API key in [Nebius Token Factory](https://tokenfactory.nebius.com/), set it on the server, then run the app:

```sh
export NEBIUS_API_KEY='your-key-here'
npm start
```

The default model is `nvidia/nemotron-3-super-120b-a12b`. Set `NEBIUS_MODEL` to an available NVIDIA model if necessary; verify availability in your own account. See the [Nebius Nemotron example](https://nebius.com/services/token-factory/nemotron).

With the key configured, the browser enables the AI button after explicit consent. Adding or editing evidence stays local. Only a consented AI request sends the plan to the server; the browser omits source links. The server validates the plan, recomputes evidence classifications, and forwards a minimal projection: travel date, sample flag, opaque server-generated check IDs/criteria, computed statuses/findings, and relevant source titles, dates and excerpts. Separate start/destination/place-name fields, source URL fields and unrelated extra fields are omitted from the upstream prompt even for direct HTTP clients. Source titles and excerpts are still shared verbatim and may contain links or identifying text.

The model may select up to five eligible fact IDs. The server renders only fixed questions as `Check N: ...`; it rejects arbitrary model prose, markup, URLs, unsupported IDs and extra output fields. Unknown/conflicting facts and reported unavailable/limited access remain eligible. AI selection does not replace the evidence report, verify accessibility, or recommend travel.

Keys are never included in browser code. `.env` is ignored by git but **not automatically loaded**: export variables as above, or use `node --env-file=.env server.js` on a compatible Node version. `.env.example` contains placeholders only.

The executable binds to localhost. Every request requires a loopback Host with the actual port, or an explicitly configured exact deployment authority; any Origin must match it. Originless clients are supported, so these checks are not authentication. Cross-site browser metadata is rejected. Forwarded proxy headers are ignored.

Per-client/global attempt rates, concurrency and lifetime request/output-token allowances have conservative defaults and bounded configuration via `ACCESS_GAP_*` variables in `.env.example`. Invalid configuration prevents startup. See [SECURITY.md](SECURITY.md) for defaults, ranges and deployment requirements. Allowances are process-local and reset on restart; output-token reservations omit input cost and are not a monetary cap. Public trials require separate approval, authentication and provider-enforced monetary controls.

**Live AI testing is pending:** the team has not configured a key. Tests use mocked upstream responses, so they do not establish real-service compatibility, output quality, or latency.

## Evidence rules and limits

The 90-day window is a prototype review policy, not an accessibility standard or guarantee. Classification compares the structured finding selected by the user (`yes`, `no`, or `limited`), not the semantic accuracy of their excerpt. A report of unavailability is still evidence; it generates a question rather than an accessible-route verdict.

The UI supports the starting place, connecting pavement, and destination. The connecting pavement only checks pavement and kerbs. Venue cards check five access details. The underlying validator permits up to five places and 40 evidence records, while the current UI uses three places.

This app does not calculate a route, retrieve live information, verify source truthfulness, or independently establish accessibility. Sample sources are fictional. User evidence remains attributed to the user-supplied source. Confirm current conditions with providers before travelling.

## Two-person team

- **Team leader / product and implementation:** [@Ahnaf-Code55](https://github.com/Ahnaf-Code55).
- **Security lead:** Turjo, [@TRahman2414](https://github.com/TRahman2414).

[SECURITY.md](SECURITY.md), the [trust model](docs/THREAT_MODEL.md), [privacy rules](docs/PRIVACY.md) and [release checklist](docs/RELEASE_CHECKLIST.md) record implemented controls and remaining decisions. [docs/DEMO.md](docs/DEMO.md) contains a demo walkthrough and remaining submission work. [docs/QA.md](docs/QA.md) records the checks performed.

## Submission status

The evidence workflow and public browser demo are implemented. The attributed public-institution example is documented in [docs/SOURCES.md](docs/SOURCES.md). A real tested Nebius/NVIDIA call, user feedback, the final public demo video, and Devpost submission remain. Nebius currently blocks account access behind a card requirement; see [docs/NEBIUS_ACCESS.md](docs/NEBIUS_ACCESS.md). Local abuse controls are implemented and tested offline. The server binds to localhost; the selected hosting/proxy, authentication, provider monetary limits and privacy decisions still need review before public exposure or real-data use.

## License

[MIT](LICENSE).
