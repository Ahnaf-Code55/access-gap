# Release status — 29 October 2026

## Completed

- Security PR #2 independently inspected, 46 offline tests rerun, and merged into main; security handoff issue #1 closed.
- Added an attributed public-institution example with unknown observation dates preserved, plus a regression test (47 tests total).
- Corrected six contrast findings. Axe-core 4.14.0 reports no violations for the selected WCAG A/AA rule tags at desktop and 375px mobile; some checks remain incomplete/manual.
- Checked 320px and 375px reflow with no horizontal overflow, and keyboard skip-link focus. Focus after evidence removal now moves to the status message.
- Deployed the public browser-only evidence demo with AI explicitly disabled: https://access-gap-hackathon.brinyberry67.chatgpt.site
- Created a 47-second captioned offline walkthrough preview at `artifacts/AccessGap-demo-preview.mp4`. It is local-only and clearly says live inference is unavailable; it is not the required public YouTube submission video.
- Reverified the public demo and GitHub repository respond successfully; all 47 offline tests pass.

## Pending account-dependent steps

- Nebius emailed the $25 promo code and a Token Factory welcome message confirming account access. The connected Gmail tool redacted the promo code; it was not copied into the repo or chat. Console access, promo redemption, API-key creation, and live inference still need verification. No key or card was entered. See [NEBIUS_ACCESS.md](NEBIUS_ACCESS.md).
- A real runtime NVIDIA-model call via Nebius, with a recorded test result and a final decision on how judges access inference.
- Devpost draft: team and overview are saved; project details, required video, Additional Info, and final submission remain incomplete. Required personal eligibility and country fields must be accurate.
- Final demo recording and public YouTube upload after the live model segment is available.
- Final Devpost submission, with the completed links and factual tool feedback.

## Validation still requiring people

No wheelchair-user feedback or actual screen-reader-user validation has been obtained. Do not invent testimonials, user studies, or compliance certification. The app is a prototype, and the supplied public-source case is not independently verified onsite.
