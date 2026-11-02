# PBC Website Preview — Release Controls
Existing private bid portal remains live at /. Marketing preview: /remodeling-preview. All marketing pages currently noindex and robots disallowed.

## Email routing
Public contact links use chris@prescottsbestconstruction.com and +1 (928) 350-0940. /api/public/inquiry stores consented requests with idempotency on private disk when enabled. Staff-only /api/admin/leads and pbc_portal_leads MCP expose requests, with notification status.
LEAD_FORM_ENABLED defaults OFF: no real leads accepted until outbound email delivery tested. Optional Resend adapter requires verified LEAD_FROM_EMAIL and private RESEND_API_KEY in Render. Recipient is fixed Chris; no open relay.
Verify with synthetic request, real inbox receipt, sender domain DNS, spam and failure/pending status before enabling. Human review required; request does not book an appointment.

## Google Business Profile and reviews
Current preview links directly to the genuine Google Maps listing. Live API-fed reviews not enabled yet; no invented rating, review copy or count.
Owner-managed verified GBP review listing requires business.manage OAuth and Google product access; it can paginate reviews. Places API can return limited selected reviews, requiring Google Maps branding, author attribution and source links. Obey caching policy.
Self-serving LocalBusiness reviews, including embedded Google reviews, do not qualify for Google self-review star rich results. Do not add AggregateRating to try to force stars.
Sources: developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list ; developers.google.com/maps/documentation/places/web-service/policies ; developers.google.com/search/docs/appearance/structured-data/review-snippet
No GBP post, review reply or account change performed in this build. These require separate owner approval.

## Structured-data, indexing and content
Server-rendered unique titles/descriptions, GeneralContractor structured data, official ROC number and accessible copy are in preview. SITE_INDEXABLE true plus verified PUBLIC_SITE_ORIGIN needed for canonical/sitemap. Do not index transitional Render/SpectraCleanse domain or duplicate current Wix pages.
Editorial process: homeowner questions and real case studies, fact check official City of Prescott / Prescott Valley / Yavapai permit changes, date each article, publish after human approval. Suggested one meaningful guide or genuine project case per week and one owner-approved social photo. No unattended mass-generated SEO pages.

## Still to implement
Andrew-approved actual local costs, fees, margins and exclusions before real company price estimates; verified transactional email and privacy policy before enabling contact forms; Google Calendar availability/confirmed bookings; optional grounded AI consultant; GBP review feed and compliant attribution; Instagram API/gallery rights; GA4 event tracking and senior usability tests.
Existing proposal links, local estimator, Drive/Gmail and MCP remain separate from public visitor access. No private keys or customer proposal data are committed to public GitHub.
