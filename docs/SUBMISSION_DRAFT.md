# Devpost submission draft — Access Gap

Status: **not submitted**. Do not describe the Nebius integration as live-tested until the pending key setup and test are complete.

## Project name
Access Gap

## Tagline
Turn missing accessibility information into questions you can act on.

## Track
Best Apps and Agents

## Links
- Repository: https://github.com/Ahnaf-Code55/access-gap
- Public evidence demo: https://access-gap-hackathon.brinyberry67.chatgpt.site
- Public YouTube video: pending final recording and upload.

## Inspiration
Accessibility information is often incomplete, old, or contradictory. A single confident answer can hide the very detail someone needs to check. We wanted an evidence checklist that makes those gaps visible and keeps each report attached to its source.

## What it does
Access Gap organizes a journey into places and access details. Users can inspect a fictional demonstration, explore a small attributed public-institution example, or build a fictional QA case. The app compares structured findings, preserves disagreements, treats undated or old records as unknown, and produces questions to confirm with the relevant provider. A downloadable checklist keeps the sources, excerpts, uncertainty, and checked questions together.

The curated public example is drawn from the Natural History Museum's official accessibility page. The page review date is not treated as a date of onsite verification. Neither example supplies a route geometry or a safety verdict.

## How we built it
The browser application uses semantic HTML, CSS, and JavaScript. A pure evidence engine is shared with a Node.js server. The optional server integration calls NVIDIA Nemotron through Nebius Token Factory after explicit consent. It projects evidence into opaque check IDs and allows the model to select only valid candidates; the server renders fixed questions. Raw model prose cannot overwrite the evidence cards.

Turjo led security hardening: input and host/origin validation, resource/rate/concurrency controls, bounded upstream reads, output allowlisting, export hardening, privacy notes, and adversarial tests. The team leader built the evidence workflow, UI, public demo and submission materials.

Current hosting note: the public demo is browser-only and deliberately disables paid inference. The guarded Node/Nebius path is in the repository. Live inference and its final testing instructions are pending; the entry is not ready to submit until that requirement is met.

## Challenges
We had to distinguish a missing fact from a negative report, preserve an old disagreement rather than blindly prefer the latest source, and avoid treating a page review date as a fresh observation. We also treated model output and source excerpts as untrusted, limiting the model to candidate selection instead of permitting unsupported travel claims.

## Accomplishments
The product workflow and guarded API path are implemented. The offline test suite passes, CI covers Node 20 and 22, and Chrome checks cover mobile reflow, labels and keyboard navigation. Automated accessibility checks identified contrast issues that we corrected. Automated checks do not substitute for testing with assistive-technology users.

## What we learned
Making uncertainty useful requires a workflow, not just a disclaimer. Source dates, disagreement, negative evidence, and explicit questions each need their own representation. Security controls also affect the product: constrained candidate selection keeps generated text from inventing an accessibility verdict.

## What's next
Complete live NVIDIA/Nebius validation; obtain feedback from wheelchair users and accessibility practitioners; extend attributed sources and freshness policies; and validate any broader real-data use and hosted inference before release.

## Built with
JavaScript, HTML, CSS, Node.js, GitHub Actions; NVIDIA Nemotron and Nebius Token Factory integration (live validation pending).

## Tool feedback — factual draft
The Token Factory console exposes model examples and an API-key setup path. Account setup is still in progress; we encountered a stalled contact-details/authentication step. We have not yet measured inference latency, quality, cost, or production reliability and should not claim results for those areas.

## Team
- Team leader: Ahnaf-Code55 (Devpost: hossainahnaf700).
- Security lead: Turjo / TRahman2414 (Devpost identifier still to confirm).
