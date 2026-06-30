# PostHog post-wizard report

The wizard has completed a full PostHog integration for `valigursky-web.html`, a single-page static marketing site for a real estate appraiser. The PostHog CDN snippet is loaded in `<head>` using the EU host (`eu.i.posthog.com`). An event tracking script at the end of `<body>` captures all key contact conversion actions, FAQ engagement, CTA visibility, and quote requests.

| Event name | Description | File |
|---|---|---|
| `phone_call_clicked` | User clicked any phone number link, with `location` property. | valigursky-web.html |
| `whatsapp_clicked` | User clicked the WhatsApp contact card, with `location` property. | valigursky-web.html |
| `email_clicked` | User clicked an email link, with `location` property. | valigursky-web.html |
| `faq_expanded` | User expanded a FAQ item, with `question` property. | valigursky-web.html |
| `cta_band_viewed` | User scrolled the contact section into view (top of contact funnel). | valigursky-web.html |
| `quote_requested` | User clicked the hero "Nezáväzná cenová ponuka" ghost CTA, with `source: 'hero_cta'`. | valigursky-web.html |
| `price_calculator_used` | User interacted with the price-estimate calculator (fired once), with `property_type`. | valigursky-web.html |
| `price_estimate_cta_clicked` | User carried a calculator estimate to the contact CTA, with `property_type`, `speed`, `floor_area`, `land_area`, `estimate_low`, `estimate_high`. | valigursky-web.html |
| `contact_copied` | User copied a phone/email contact detail to the clipboard, with `contact_type`. | valigursky-web.html |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://eu.posthog.com/project/212693/dashboard/782863)
- [Contact conversion funnel (wizard)](https://eu.posthog.com/project/212693/insights/xxniQelm) — CTA section viewed → contact action taken
- [Contact channel comparison (wizard)](https://eu.posthog.com/project/212693/insights/bUyTZyIV) — Phone vs WhatsApp vs email over time
- [Quote requests over time (wizard)](https://eu.posthog.com/project/212693/insights/ilJpe4kj) — Hero CTA clicks per day
- [FAQ engagement (wizard)](https://eu.posthog.com/project/212693/insights/4ed6UGnT) — FAQ expansions per day
- [Total contact actions – last 30 days (wizard)](https://eu.posthog.com/project/212693/insights/WAHM5gUY) — Combined contact count (bold number)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
