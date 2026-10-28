# Release status — 28 October 2026

## Completed

- Security PR #2 independently inspected, 46 offline tests rerun, and merged into main; security handoff issue #1 closed.
- Added an attributed public-institution example with unknown observation dates preserved, plus a regression test (47 tests total).
- Corrected six contrast findings. Axe-core 4.14.0 reports no violations for the selected WCAG A/AA rule tags at desktop and 375px mobile; some checks remain incomplete/manual.
- Checked 320px and 375px reflow with no horizontal overflow, and keyboard skip-link focus. Focus after evidence removal now moves to the status message.
- Deployed the public browser-only evidence demo with AI explicitly disabled: https://access-gap-hackathon.brinyberry67.chatgpt.site

## Pending account-dependent steps

- Nebius access is blocked by mandatory card verification even though the hackathon advertises credits and Nebius documentation says promo codes can be applied without a card. See [NEBIUS_ACCESS.md](NEBIUS_ACCESS.md). The promo request and an official card-free resolution are still pending; no key or card was entered.
- A real runtime NVIDIA-model call via Nebius, with a recorded test result and a final decision on how judges access inference.
- Devpost registration: personal eligibility declarations and Official Rules acceptance must be completed by the team leader.
- Final demo recording and public YouTube upload after the live model segment is available.
- Confirm Turjo's Devpost identifier and add him to the submission.
- Final Devpost submission, with the completed links and factual tool feedback.

## Validation still requiring people

No wheelchair-user feedback or actual screen-reader-user validation has been obtained. Do not invent testimonials, user studies, or compliance certification. The app is a prototype, and the supplied public-source case is not independently verified onsite.
