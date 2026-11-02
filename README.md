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
The included render.yaml is a NEW-SERVICE Blueprint; connecting it to an **existing** Render service does not necessarily apply the Blueprint disk/settings. Verify manually.
Never point the suspended/current SpectraCleanse service to this repository without a backup of its files, users, database, Stripe settings and environment.
Once verified, optional customer portal address: bids.prescottsbestconstruction.com. Wix stays the public marketing site.

## ChatGPT/MCP continuity
The local PBC estimator on the Windows PC is unchanged. Continue using node scripts/mcp-launch.mjs inside PBC_ESTIMATOR_APP for chat-driven estimating, Google Drive/Gmail and image work.
This hosted portal is isolated. A future local MCP connector will explicitly publish owner-reviewed redacted snapshots to /api/admin/publish and read status/approval questions from /api/admin/proposals. Do not copy the full local job ledger, Google OAuth state or AI keys to this hosting.
No real e-signatures, payment capture, automated Gmail sending, authenticated staff GUI, or QuickBooks sync in this pilot.
