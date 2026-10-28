# Access Gap

**Know before you go.** Access Gap helps people spot missing and conflicting accessibility details in a journey, and prepares questions they can ask before travelling.

This is an early prototype for the [Nebius x NVIDIA Global AI Hackathon](https://nebiusglobalaihackathon.devpost.com/), Best Apps and Agents track. The current journey and sources are **fictional sample data**. It does not provide live routes or verified accessibility information and must not be used to make travel decisions.

## Try it locally

Requirements: Node.js 20 or later. There are no external package dependencies.

```sh
git clone https://github.com/Ahnaf-Code55/access-gap.git
cd access-gap
npm start
```

Open http://127.0.0.1:3000. The example journey and checklist work without an API key.

### Optional: generate questions with NVIDIA Nemotron

Create an API key in [Nebius Token Factory](https://tokenfactory.nebius.com/), then start the server with the key in its environment:

```sh
export NEBIUS_API_KEY='your-key-here'
npm start
```

When you select **Draft questions with AI**, the server sends the fictional journey title and the sample fact labels, statuses and details to the fixed Nebius Token Factory chat completions endpoint. The model selects uncertain check IDs; the server renders fixed question templates referencing those checks. Arbitrary model prose and accessibility claims are rejected. The key stays on the server. The default model is `nvidia/nemotron-3-super-120b-a12b`; set `NEBIUS_MODEL` to an available NVIDIA model if necessary. Never commit a real key. Live model compatibility with the restricted JSON selection contract is unverified.

The `.env.example` file documents environment names; Node does not load it automatically. A missing or empty key disables AI. Keep the server on localhost and use only fictional data. The API requires JSON, a matching loopback Host/port and, when supplied, an exactly matching Origin. Rate, concurrency, time, byte and process-lifetime admission limits are fixed in `server.js`; see [SECURITY.md](SECURITY.md) for values. The 45,000 reserved output-token allowance is not a monetary cap: input tokens cost extra, and every process restart or replica has a new allowance. Public trials require separate deployment review, authentication and provider monetary controls.

Run tests with `npm test`.

## What works today

- A fictional three-stop journey with clearly labelled supported, unknown, and conflicting observations.
- Source and recency labels, and a checklist of questions.
- Optional server-side integration that asks Nemotron to select uncertain checks, then renders questions from fixed templates; no live API call has been verified.
- No data storage, accounts, tracking, or user-supplied URL fetching.

## What comes next

1. Replace example observations with correctly attributed, timestamped OpenStreetMap and venue data, subject to data access terms.
2. Let people enter a journey and accessibility needs; represent missing data explicitly.
3. Add source links, conflict resolution, freshness policies, and tests with representative cases.
4. Get feedback from wheelchair users and accessibility practitioners; test keyboard and screen-reader workflows.
5. Deploy a protected, cost-controlled demo and test the actual Nebius integration before submitting.

## Two-person team

- **Project lead and builder:** repository owner, [@Ahnaf-Code55](https://github.com/Ahnaf-Code55).
- **Security lead:** Turjo, [@TRahman2414](https://github.com/TRahman2414). Suggested focus: threat model, key management, input and model-output handling, deployment hardening, and security review.

See [SECURITY.md](SECURITY.md), the [trust model](docs/THREAT_MODEL.md), [privacy rules](docs/PRIVACY.md) and [release checklist](docs/RELEASE_CHECKLIST.md) for implemented controls and remaining release decisions.

## Submission status

This repository is a starting point, not a completed hackathon submission. A working deployed demo, a real tested Nebius/NVIDIA API integration, a public video of at most three minutes, feedback, and the remaining submission details are still needed. The example data should never be presented as a live route.

## License

[MIT](LICENSE).
