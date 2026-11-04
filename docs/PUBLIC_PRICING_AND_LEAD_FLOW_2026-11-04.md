# PBC Pricing and Inquiry Continuation — November 4, 2026

## Operator decisions
Keep the site's design, optional AI, rough estimator, private proposal portal and Holiday Lighting Concierge. The site is still being prepared for switching from Wix. Phone: (928) 350-0940. Email recipient: chris@prescottsbestconstruction.com. Do not redirect domains or change local credential files.

## Price research and market comparison
- Santa's Lighting Company advertises a $699 minimum and $1,000–$1,500 average in Prescott. Santa owns lights and includes maintenance, takedown and storage. https://santaslightingcompany.com/prescott-christmas-light-installation/
- Holiday Lights Phoenix quotes roughly $7–$9 per seasonal roofline foot, with separately priced landscape decorations. https://www.holidaylightsphx.com/cost-for-lights
- PBC modeled starting prices: Classic $599 (simple one-story, accessible front roofline, assumed up to 60 ft); Warm Welcome $899; Neighborhood Showcase $1,399. These are market-based hypotheses and must be checked against true supplier invoices, labor, insurance, travel, and takedown obligations before binding acceptance.
- The $599 headline is exactly $100 below the competitor minimum, but is NOT an equivalent package comparison unless lights, maintenance, removal and storage are matched.
- Small accessible ornamental tree add-on $149 research starting model. Large/tall trees priced only after site review. Permanent smart lighting research rate $27/ft and product-specific technical review.
- Studio has approximate linear feet and selected materials. Specialty types (rope/icicle/RGBIC) now receive illustrative ranges using explicit unverified adjustment factors instead of displaying no price.

## Main remodeling budget estimator
- Preserved initial research model with version research-baseline-2026-11-04-v1.
- Before input: full bath/medium/standard/straightforward yields an initial modeled total range $16,100–$43,800.
- Each change recalculates via deterministic API; the homeowner sees one ballpark first, with optional cost-plus versus fixed-price examples in expandable detail.
- Outputs stay clearly nonbinding and suitable for calibration. Owner-independent actual bids and model-independent starting assumptions must not be silently overwritten.

## Lead/contact status
- New Render site was read live November 4: GET /api/public/site-status returned inquiryEnabled:false. Existing public code targets Chris. Don't claim server-delivery works on this deployment yet.
- Contact form is now always visible. In fallback mode it creates a mailto draft containing name, email, phone, selected project and notes; visitor must press Send in their email app. Copy project details is available. The browser has not submitted the lead itself.
- When Resend and LEAD_FORM_ENABLED have been configured on Render and tested end-to-end, the same form can POST to the server and email Chris. A 202 only means recorded, not delivered; notification failure alerts/retries are an additional improvement.
- Existing Wix form may already work independently. Do not confuse its tested delivery with this new Render form.

## Reliability
- Fixed Gemini answer price scrub, llms.txt/llms-full.txt newline escaping, copied AI notes line breaks; added regressions.
- Preserve direct click-to-call, Chris recipient, private bid links, local project assets and existing credentials.

## Source control
- Do not include local credentials, customer files, original screenshots or vendor passwords in commits. Tested with synthetic project data only.

## Next step for real bid experiment
Freeze this research baseline; independently prepare the real project estimate and collect Andrew's separate bid. Record by scope line, material SKU/quantity, loaded labor, subcontract, tax, contingency and time. Compare totals and misses; propose versioned baseline updates only after Andrew approves.