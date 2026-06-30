# PostHog post-wizard report

The wizard has completed a full PostHog integration for `valigursky-web.html`, a single-page static marketing site for a real estate appraiser. The PostHog CDN snippet was added to `<head>` using the EU host (`eu.i.posthog.com`). An event tracking script was added at the end of `<body>` that captures all key contact conversion actions, FAQ engagement, and CTA section visibility.

| Event name | Description | File |
|---|---|---|
| `phone_call_clicked` | User clicked a phone call link to contact the expert. | valigursky-web.html |
| `whatsapp_clicked` | User clicked the WhatsApp contact button. | valigursky-web.html |
| `email_clicked` | User clicked the email contact link. | valigursky-web.html |
| `faq_expanded` | User expanded a FAQ question to read the answer. | valigursky-web.html |
| `cta_band_viewed` | User scrolled to the main contact CTA section (top of contact conversion funnel). | valigursky-web.html |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/212693/dashboard/782837)
- [Contact clicks by method (wizard)](https://eu.posthog.com/project/212693/insights/nxHOK5yU) — Phone, WhatsApp, and email clicks over time
- [Total contact attempts (wizard)](https://eu.posthog.com/project/212693/insights/Xc5vtPSY) — Unique users who made any contact attempt (last 30 days)
- [Contact conversion funnel (wizard)](https://eu.posthog.com/project/212693/insights/BCJn9HOI) — CTA section viewed → contact clicked
- [FAQ engagement over time (wizard)](https://eu.posthog.com/project/212693/insights/pC6uphJz) — FAQ question expansions per day
- [Phone calls over time (wizard)](https://eu.posthog.com/project/212693/insights/VsjxKczw) — Daily unique users clicking the phone link

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
