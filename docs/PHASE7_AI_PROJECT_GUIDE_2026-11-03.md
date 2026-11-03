# Prescott's Best Construction — Phase 7 Optional AI Project Guide
Date: November 3, 2026
Status: Ready for controlled live validation

## Customer experience
- New path `/project-guide`, linked from navigation, homepage CTA, budget links and footer.
- Accessible, senior-first page: large choice cards, plain-language explanations, short guided dialogue, large controls, keyboard-friendly form, explicit Google Gemini consent, read-aloud and stop controls (browser speechSynthesis), start-over and normal contact/worksheet alternatives.
- Starter prompts: safer bathroom; kitchen refresh; door/trim; preliminary budget preparation.
- English or Spanish: Gemini follows the visitor's language. No forced login, client image upload, recorded contact information or automatic lead creation.
- Visitor can leave without using AI; existing `/start-here`, `/estimate`, `/blog`, `/schedule` continue working. The AI guide is not Andrew and cannot book appointments or publish bids.

## Server-side architecture
- Hosted Render environment key only: `GEMINI_API_KEY` or `GOOGLE_GEMINI_API_KEY`. Never transmit it to the browser or include it in URLs, Git commits, logs or docs.
- `GET /api/public/ai-guide/status` safely reports if configured.
- `POST /api/public/ai-guide` requires explicit consent; validates question, history, request size, provider status, limits and basic contact details. Sends redacted question and <=4 recent conversation turns to Gemini's REST generateContent API; no storage of conversations in portal store, lead database, or sessionStorage.
- Default model: `gemini-3.5-flash-lite`; configurable through `GEMINI_PUBLIC_MODEL`. Provider output constrained by system instructions to avoid numerical quotes, false permit claims, customer PII and invented business assurances.
- Gemini model does **not** calculate prices: it directs visitors to deterministic research budget tool. Real bids remain human approved.
- Runtime abuse guard: per-connection rate limit, daily max requests `PUBLIC_AI_MAX_DAILY` default 160, hard input/output caps and 18-second provider timeout. `PUBLIC_AI_ENABLED=false` is the emergency kill switch; the intentionally supplied Gemini key enables the consent-gated guide by default.
- No Google Search / third-party retrieval tools enabled, no automatic browsing, autonomous actions or image generation. No conversation database.
- For broader traffic, move quotas into centralized durable storage and implement more robust monitoring and user privacy consent (in-memory caps reset with deployments or multiple instances). Existing Render portal is a single instance currently.
- Privacy page updated to disclose Google Gemini submission and differing provider usage/retention terms by tier. Before the business asks for identifiable customer photos, address information, drawings or personal data, establish a paid Gemini data-processing arrangement, retention policy and explicit authorization. The present guide explicitly asks not to share sensitive data.

## Tests
- `npm run check` and `npm test`: local passes.
- `tests/ai-guide.test.mjs`: disabled state, consent enforcement, mock provider, API key server-only, redaction and safe provider failure.
- `tests/marketing.test.mjs`: homeowner guide route, required disclosures, JS, no-index and disabled provider response on safe test server, no regressions.
- `tests/ai-guide-browser-qa.py` with mock Gemini: 4/4 browser checks on 390px and 1440px (opt-in, response, speech control availability, reset and no horizontal overflow). Screenshots local only.
- Never call live Gemini from automated regression; initial production sample should be a single clearly synthetic homeowner question.

## Future ideas after production evidence
- Spoken input (browser permissions and accessibility review required), multilingual mode, project-scope extraction feeding the four-question planner, clear comparison of customer-selected material options in the existing private portal, contractor handoff workflow with explicit consent, budget PDF export, visualization requests with owner-approved real photos and opt-in. Do not build a public AI estimating quote engine from unverified prices.
