# Prescott's Best Construction — Private Customer Proposal Portal

A separate, Render-deployable **customer portal**, not a replacement for the local estimator or MCP tools. No real customer data, credentials, or project records are committed here.

## Pilot features
- Mobile-friendly, branded private proposal with cost-plus/fixed costs, scope, terms, site photos and AI design concepts.
- Random 256-bit private invitations with expiration, URL-fragment token exchange, HttpOnly session, CSRF and origin checks, protected image files.
- One-click customer review/approval **intent** with typed name and audit event; contractor acceptance and signed contract remain separate.
- Send clarification questions, check updates by polling every 12 seconds, revoke links and view statuses as an authenticated admin.
- Single-process atomic JSON persistence on persistent disk; no horizontal scale or diskless deploys. For production growth migrate to managed PostgreSQL and add verified recipient identity.

## Local start and testing
Install Node 20+; run npm ci, set DATA_DIR to a private directory, PORTAL_ADMIN_KEY to a 32+ character secret, and PORT to 10000, then npm start. Run npm test.
To create a **test** invitation, POST JSON from examples/demo-proposal.json to /api/admin/publish using Authorization: Bearer [your private admin key].
Combine the returned linkFragment with the site URL, e.g. https://your-service.onrender.com/#/invite/[secret-token]. Send only to verified intended recipient.
Staff can GET /api/admin/proposals or POST /api/admin/revoke with JSON id, authenticated with the same key.
Image snapshots are supported via photos: [{kind: after, label, mimeType: image/png, base64: [base64 encoded PNG]}]. Images are visible only to the authenticated recipient.

## Render setup (existing paid account)
Connect GitHub private repository ChrisAdamsdevelopment/prescottsbest-bid-portal as a Node Web Service, branch main.
Build: npm ci. Start: npm start. Health: /healthz. Set NODE_ENV=production.
Add a persistent disk mounted at /data, set DATA_DIR=/data/pbc-portal; store a 32+ character PORTAL_ADMIN_KEY as a Render secret.
The included render.yaml is a NEW-SERVICE Blueprint (GitHub CI checks must pass before automatic redeploy); connecting it to an **existing** Render service does not necessarily apply the Blueprint disk/settings. Verify manually.
Never point the suspended/current SpectraCleanse service to this repository without a backup of its files, users, database, Stripe settings and environment.
Once verified, optional customer portal address: bids.prescottsbestconstruction.com. Wix stays the public marketing site.

## ChatGPT/MCP continuity
The local PBC estimator on the Windows PC is unchanged. Continue using node scripts/mcp-launch.mjs inside PBC_ESTIMATOR_APP for chat-driven estimating, Google Drive/Gmail and image work.
This hosted portal is isolated. A future local MCP connector will explicitly publish owner-reviewed redacted snapshots to /api/admin/publish and read status/approval questions from /api/admin/proposals. Do not copy the full local job ledger, Google OAuth state or AI keys to this hosting.
No real e-signatures, payment capture, automated Gmail sending, authenticated staff GUI, or QuickBooks sync in this pilot.

## Remodeling marketing website preview (2026-11-02)
The customer bid portal at / and its exact private invitation links are retained. A new NOINDEX public marketing preview is served at /remodeling-preview, with a homepage, five residential service pages, three original general homeowner guides, project process, contact/consultation and a preliminary budget explorer at /remodeling-preview/estimate.

The estimator is a deterministic public API (/api/public/budget), with deliberately illustrative broad research ranges and hypothetical fees—NOT Andrew-approved PBC quotes. It needs an owner-approved local pricebook before switching to real business pricing. Browser calculations do not use Gemini/OpenAI/Claude APIs. Visitors may choose to talk to a human without using chat.

Inquiry requests have consent, input size limits, rate limits, duplicate suppression, private disk storage and a staff-only /api/admin/leads feed. All notification emails are addressed server-side to chris@prescottsbestconstruction.com. Live form submissions stay DISABLED until a verified sender domain, transactional email provider and real inbox delivery test are complete. Outbound mail adapter: RESEND_API_KEY, LEAD_FROM_EMAIL, LEAD_FORM_ENABLED=true AFTER tests.

The locally installed PBC estimator now has read-only MCP tool pbc_portal_leads so ChatGPT can inspect incoming requests and notification status while keeping staff secrets private.

The supplied PBC gold/black oval logo is used as public/site-assets/pbc-logo.webp. Real Google Maps business reviews are LINKED at source; a live API-fed review widget needs approved Google Business Profile business.manage authorization or Places API attribution and licensing. No fabricated reviews or self-serving AggregateRating structured data.

Preview is noindex/robots blocked; no canonical domain registered/approved. Existing Wix remains primary public search site. Never duplicate the same SEO pages across two indexed domains. The Render service is used only as a preview until approved publication.

See docs/IMAGE_PRODUCTION_SHOTLIST.md and docs/WEBSITE_RELEASE_AND_INTEGRATIONS.md. For true SEO launch, verify canonical domain + redirects + robots, email delivery, GBP review API, product pricing, privacy policy, photography rights and lead analytics.
