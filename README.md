# Access Gap

**Know before you go.** Build an accessibility evidence checklist from the information you have. Access Gap keeps missing, stale, unavailable, and conflicting reports visible, and helps you prepare questions for venues and transport operators.

An early project for the [Nebius x NVIDIA Global AI Hackathon](https://nebiusglobalaihackathon.devpost.com/), Best Apps and Agents track.

## Run locally

Node.js 20 or later. No external package dependencies or installation step is needed.

```sh
git clone https://github.com/Ahnaf-Code55/access-gap.git
cd access-gap
npm start
```

Open http://127.0.0.1:3000. Run `npm test` for the automated tests.

## What you can do

- Explore a clearly labelled fictional example, or enter your own start, destination, and travel date.
- Add an evidence record: place, access detail, reported finding, source title, optional link, date, and excerpt.
- Inspect the resulting evidence cards and source records; remove records and see the checklist recalculate.
- Keep conflicting accounts visible. A newer report does not automatically override an older report.
- See evidence older than 90 days, or with no date, treated as unknown unless another current source supports it. Disagreements remain conflicting regardless of age.
- Get follow-up questions for missing, conflicting, unavailable, or limited access. Mark questions checked and download the report as plain text with sources and checkbox state.
- Optionally request a draft of more focused questions from NVIDIA Nemotron through Nebius Token Factory.

Evidence only exists in the current tab and clears on reload. Changing place names clears the old evidence; changing the travel date preserves it. Evidence edits clear checked questions and any AI draft because the underlying facts changed.

## Optional AI integration

Create an API key in [Nebius Token Factory](https://tokenfactory.nebius.com/), set it on the server, then run the app:

```sh
export NEBIUS_API_KEY='your-key-here'
npm start
```

The default model is `nvidia/nemotron-3-super-120b-a12b`. Set `NEBIUS_MODEL` to an available NVIDIA model if necessary; verify availability in your own account. See the [Nebius Nemotron example](https://nebius.com/services/token-factory/nemotron).

With the key configured, the browser enables the AI button after explicit consent. Only then does the app send place names, travel date, source titles, dates, and excerpts to the server and Nebius. The browser strips source links from the request. The server recomputes evidence classifications rather than accepting client-supplied verdicts. AI output is shown as a draft in plain text and does not replace the evidence report.

Keys are never included in browser code. `.env` is ignored by git but **not automatically loaded**: export variables as above, or use `node --env-file=.env server.js` on a compatible Node version. `.env.example` contains placeholders only.

**Live AI testing is pending:** the team has not configured a key. Tests use mocked upstream responses, so they do not establish real-service compatibility, output quality, or latency.

## Evidence rules and limits

The 90-day window is a prototype review policy, not an accessibility standard or guarantee. Classification compares the structured finding selected by the user (`yes`, `no`, or `limited`), not the semantic accuracy of their excerpt. A report of unavailability is still evidence; it generates a question rather than an accessible-route verdict.

The UI supports the starting place, connecting pavement, and destination. The connecting pavement only checks pavement and kerbs. Venue cards check five access details. The underlying validator permits up to five places and 40 evidence records, while the current UI uses three places.

This app does not calculate a route, retrieve live information, verify source truthfulness, or independently establish accessibility. Sample sources are fictional. User evidence remains attributed to the user-supplied source. Confirm current conditions with providers before travelling.

## Two-person team

- **Team leader / product and implementation:** [@Ahnaf-Code55](https://github.com/Ahnaf-Code55).
- **Security lead:** Turjo, [@TRahman2414](https://github.com/TRahman2414).

[SECURITY.md](SECURITY.md) records current boundaries and remaining controls. [docs/DEMO.md](docs/DEMO.md) contains a demo walkthrough and remaining submission work. [docs/QA.md](docs/QA.md) records the checks performed.

## Submission status

The evidence workflow is implemented. Public hosting, a real tested Nebius/NVIDIA call, attributed real-world examples, user feedback, a public demo video, and the Devpost submission remain. The server binds to localhost and needs Turjo's abuse-control and deployment review before public exposure.

## License

[MIT](LICENSE).
