# Phase 2 — Prescott's Best Remodeling marketing website delivery
Date: November 2, 2026
Source: D:/PrescottsBestConstruction/05_WEBSITE_AND_TECH/PBC_BID_PORTAL
Domain: https://prescottsbestremodeling.com/

## Scope implemented
- Added mobile-friendly persistent Call / Budget / Contact quick actions, skip link preserved.
- Added guided project worksheet (/start-here), producing an optional checklist in-browser without account, data upload or model API calls.
- Planning choices retained only in sessionStorage and prefilled as editable notes on contact page, alongside original deterministic sample budget.
- Added About, Existing Projects, Smaller-Project Concierge, Privacy, Accessibility and Hiring a Contractor resource page.
- Contact form does not appear operational while live LEAD_FORM_ENABLED=false: public read-only /api/public/site-status controls the form visibility; phone/email fallback remains available. Backend submission gate and authenticated lead records unchanged.
- Corrected indexable custom-domain canonical URLs to clean /paths, excluded duplicate /contact from sitemap, redirected custom-domain legacy /remodeling-preview/* paths and /contact to clean canonical destinations.
- Preserved /proposal hosted portal route with X-Robots-Tag noindex. Original temporary onrender.com root remains the portal; new custom domain root remains marketing.
- No fabricated customer ratings, projects, hard-price bids, available appointment times or AI claims.

## Local quality evidence
- npm test: 4 test groups pass including protected portal, sample budget, new public pages/canonicals.
- npm run check: JavaScript syntax passes.
- tests/phase2-browser-qa.py and tests/phase2_browser_report.json: 4 browser checks PASS for planner, contact fallback, mobile navigation and six new pages.
- Temporary QA browser screenshots stay local and are not committed/published.
- Image strategy: owner's genuine work and homeowner consent are required before public finished-project gallery; AI concepts must be visibly labeled.

## Release flags (must remain controlled)
- SITE_INDEXABLE=false: keep X-Robots-Tag noindex, robots Disallow all and no published sitemap until canonical domain strategy, content, notices and actual lead delivery verified and Andrew approves.
- LEAD_FORM_ENABLED=false: keep disabled until RESEND_API_KEY, LEAD_FROM_EMAIL sender verification, privacy/retention approval and monitored end-to-end receipt tests.
- Live pricing remains conspicuously RESEARCH DEMONSTRATION, never PBC actual local rates.
- Appointment status is request-only; no company calendar freebusy/booking connected.
- No free-form AI agent, live Google review API feed or Instagram gallery implemented.
- Old SpectraCleanse domains must not be detached until their replacement domain/hosting cutover plan is complete.

## Follow-on integration priority
1. Andrew confirms public copy/brand, license/service areas, photo permissions, hosting domain/canonical strategy, privacy owner, budget policy.
2. Provision verified business sender and monitored delivery; exercise synthetic real inbox test, retention/removal policy and only then enable public inquiries.
3. Approved pricing and versioned pricebook replacing illustrative figures.
4. Dedicated calendar access/availability rules, genuine request-to-confirm workflow, then optional fully verified booking.
5. Real project photo stories/gallery, accurate alt text, owner-approved GBP/Instagram feeds, site telemetry and accessible manual QA.
6. Optional constrained grounded AI sales guide after documented API scopes, safe handoff and adversarial evaluation.
7. Enable indexability, publish sitemap, verify Search Console and assess early qualified leads over weeks, not by a single traffic spike.
