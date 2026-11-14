# Prescott's Best Construction — primary-domain migration (2026-11-13)

## Decision and verified infrastructure
- Primary public marketing domain: https://prescottsbestconstruction.com (APEX, no www).
- Secondary/legacy marketing domain: https://prescottsbestremodeling.com (and www).
- Existing Render Web Service ID: srv-d84udt57vvec73filv6g, GitHub repo ChrisAdamsdevelopment/prescottsbest-bid-portal, branch main, auto deploy on main.
- In Render Settings > Custom Domains, all four hostnames (root and www for construction and remodeling) were VERIFIED and TLS certificates ISSUED on November 13. DNS is already pointing both domains to Render. NO extra Wix DNS changes required.
- Keep both domain pairs registered on the SAME Render service so older HTTPS links retain valid TLS. Do not remove either domain, shut off the Render service, or use wildcard redirects in the Render UI.
- The service still has a misleading historical label SpectraCleanse-AI, but is confirmed by repository and live remodeling domains; do not select a separate MeasuredField service.

## Release in this feature branch — domain only
- Node server issues 301 GET/HEAD redirects from both remodeling hostnames to construction.com, maintaining identical path and query, with one-hop normalization of old /remodeling-preview and /contact route prefixes.
- Exempts /api/* requests, /healthz, private /proposal, and its JS/CSS dependencies to avoid breaking signed customer invitations or cached application calls. The original onrender.com hostname remains the private portal origin.
- Replaces public canonical origin with construction.com in marketing HTML, sitemap.xml, robots.txt, RSS feed, llms.txt, JSON-LD, video/image metadata and exported inspiration links.
- Construction apex is canonical, while www construction is accepted and declares the apex canonical. Render edge may redirect www automatically.
- No Wix DNS edit, new Render domain, Render setting, new content page, new image, new service, or secret change required.
- The separately staged Argon service-depth/accessible-remodeling feature branch has NOT been merged or deployed.
- Local integration tests verify redirect paths, query strings, canonical, sitemap, feed, robots, private portal, API and localhost. Entire repository test suite: 71 passed.

## Live verification after merge
1. GET https://prescottsbestremodeling.com/ returns 301 Location: https://prescottsbestconstruction.com/
2. GET https://prescottsbestremodeling.com/bathroom-remodeling?utm_source=test returns 301 to the equivalent construction page WITH QUERY, which returns 200, NOT a redirect loop.
3. www remodeling redirects to construction (one or two hops acceptable if the Render edge first normalizes www).
4. Construction homepage returns 200 with canonical https://prescottsbestconstruction.com/.
5. /bathroom-remodeling and /kitchen-remodeling on construction respond 200 with matching construction canonical.
6. Construction /robots.txt points to construction /sitemap.xml, sitemap uses only construction loc URLs, and feed/news/video metadata are consolidated.
7. The Render original hostname still serves the private proposal portal at / and /proposal, and /healthz and /api/public/site-status return success.
8. Confirm no customer's private invite workflow is broken. Do NOT submit synthetic production customer records without owner authorization.

## Still not migrated (important)
- BEFORE cutover, the old Wix URLs /projects/crystal-creek-accessible-remodel and /prescott-fast-track-permits-2026 already returned HTTP 404 on construction.com after DNS pointed Render. Do not silently redirect these to the homepage: restore corresponding licensed/approved project content and authoritative permitting material, or map each to a genuinely equivalent article with a 301 after review.
- /projects in the current Render app points back to the old Wix construction.com/projects address, which is now the new /projects itself. Recover approved original project media and replace this self-referencing archive link before a portfolio campaign.
- The separate Argon accessibility draft needs verified owner media, consent, and sign-off; it is intentionally not in the sitemap.
- Search Console: verify both domains and the www variants as appropriate, submit https://prescottsbestconstruction.com/sitemap.xml, update Google's Change of Address tool for the remodeling property IF permitted/applicable, monitor pages/clicks/redirect coverage and maintain redirects for at least one year (prefer indefinitely). Google may show ranking volatility for several weeks during domain migrations.
- Update GBP, social profiles, ad links, printed QR destinations and public email signatures to construction primary where controlled, while honoring incoming remodeling links.

## Rollback plan
- If significant production regression: revert the release's merge commit in GitHub (after review), let Render auto deploy. DNS and Render domain attachment DO NOT change.
- Avoid relying on browser-cached 301s for rollback checks; use uncached command-line requests, because clients may cache redirect responses.
- Review production deployment logs for successful startup and health if rollback occurs.

Source: Google Search Central site-move documentation and Render's Custom Domains guidance, rechecked Nov 13 2026.
