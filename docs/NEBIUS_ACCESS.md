# Nebius Token Factory access status

Updated 29 October 2026.

## What we know

- The hackathon's [Devpost resources page](https://nebiusglobalaihackathon.devpost.com/resources) advertises $25 in Token Factory credits through its promo form using activation code `NEBIUS-DEVPOST-GLOBAL26`, and another $25 through the Nebius Builders Program.
- Nebius emailed a $25 Token Factory promo code. The email says to apply it by 31 December 2026. The connected Gmail tool redacted the code, so it was not copied into this repository or chat.
- Nebius also sent a Token Factory welcome email saying the account has gained access. This confirms account onboarding by email, but the console has not yet been reached to verify billing, promo redemption, API-key creation, or a successful inference call.
- Nebius's [billing documentation](https://docs.tokenfactory.nebius.com/other-capabilities/billing) says promo codes can be applied without billing information or a bank card, through the account balance menu.
- In the earlier signup flow, the console was blocked at a mandatory billing page asking for card details for a temporary $0 authorization. The team has no card and has not entered one or attempted a charge. The welcome email arrived afterwards, so the current account state may have changed; this still needs verification in the console.
- No `NEBIUS_API_KEY` is configured in the local `.env`; the file was checked without displaying or copying its contents.
- A [Devpost discussion](https://nebiusglobalaihackathon.devpost.com/forum_topics/45365-token-factory-access-without-a-credit-debit-card) contains recent reports of the same onboarding block, including after participants requested hackathon promo credits. The organizer directed participants to Nebius's [current Discord](https://discord.com/invite/eXYTGhgnhK). These participant reports are not an official resolution.
- The hackathon's [official FAQ](https://nebiusglobalaihackathon.devpost.com/details/faqs) says cases involving missing promo credits or unsupported billing access are handled individually through Nebius Discord. Its [rules](https://nebiusglobalaihackathon.devpost.com/rules) require a runtime call to Token Factory or a project deployed/run on Nebius AI Cloud, plus an NVIDIA open-source model. The FAQ says using a different provider does not meet this requirement.

The published instructions and the earlier observed onboarding flow did not line up. The welcome email suggests access may now be available, but neither promo redemption nor API-key access has been confirmed. No live inference call has been made.

## Next steps that do not require a card

1. In the Nebius Token Factory account, complete any human security verification and check whether the console now opens. Do not enter card details.
2. Retrieve the $25 promo code from the Nebius email in Gmail and apply it through the Token Factory balance menu. Do not put the code in chat or this repository.
3. Create a restricted API key and save it locally as `NEBIUS_API_KEY` in `.env`. Do not expose the key in browser code, GitHub, logs, or chat.
4. Run one minimal fictional-data Nemotron call, verify the app's constrained-response behavior, and update the submission only with measured results.
5. If the console remains blocked or the credits do not apply, ask Nebius in its current support Discord. The official FAQ says to handle access/credit cases there. Do not post API keys, payment details, or personal account information in the public channel.
6. Keep the public demo in browser-only mode until the approved Nebius integration has been tested. Do not replace the required Nebius model with another provider and claim the integration is complete.

## Support request draft

> I am participating in the Nebius x NVIDIA Global AI Hackathon and building Access Gap. I received the $25 Token Factory promo email and a Token Factory welcome email. I have not redeemed the promo code or created an API key yet. Earlier, account setup stopped at a billing page asking for card details for a $0 authorization, and I do not have a card. The current login tab is stuck on Cloudflare security verification, so I cannot confirm whether the account is now active. Is there an approved card-free path to redeem the hackathon credits and create an API key? If not, what is the approved way for a participant to satisfy the Nebius requirement?

No message has been sent on the team's behalf. Never share an API key, promo code, or payment credentials in the support discussion.
