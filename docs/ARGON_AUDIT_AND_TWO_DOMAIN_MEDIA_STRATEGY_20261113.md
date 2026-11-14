# Argon assessment response, two-domain strategy, and media-gated content
Status: STAGED ONLY — NOT DEPLOYED. 2026-11-13, Prescott Valley, Arizona.

## Verified facts and assessment limits
- The supplied Argon High audit describes the legacy Wix site, including the Crystal Creek story, permit article, legacy Media menu inconsistency, thin original service pages and copied-review spelling errors. Its findings cannot automatically be applied to the newer Render web app.
- The existing Render app already has dedicated public paths for bathrooms, kitchens, shower conversions, finish carpentry, room conversions, custom cabinetry, deck/outdoor carpentry, projects, and homeowner education.
- Both https://prescottsbestconstruction.com/ and https://prescottsbestremodeling.com/ currently load the same Render site with HTTP 200. Both pages declare https://prescottsbestremodeling.com/ as the canonical. Construction.com and its bathroom-remodeling path returned 200 with the remodeling.com canonical.
- HIGH PRIORITY LEGACY URL LOSS: Live https://prescottsbestconstruction.com/projects/crystal-creek-accessible-remodel and https://prescottsbestconstruction.com/prescott-fast-track-permits-2026 currently return HTTP 404 after the Wix-to-Render switch. Restore faithful equivalent content/approved media first, then map these legacy URL paths to their replacements with a 301. Do not redirect an important project article to an unrelated generic page.
- Keeping two domains is valuable for marketing, legacy links, tracking and brand capture, but identical content does not create two independent ranking opportunities. Duplicate content is generally not penalized; Google selects one canonical. Refer to https://developers.google.com/search/docs/crawling-indexing/canonicalization .
- Google recommends a permanent redirect from the alternate hostname to the preferred one when both have the same content: https://developers.google.com/search/help/crawling-index-faq .
- If deliberately pursuing two separately indexable domains, develop genuinely distinct useful audiences/content and maintain two SEO programs; do not clone identical local service pages. This is not the near-term recommendation.

## Proposed release sequence — DO NOT ACTIVATE UNTIL APPROVED
1. Review actual Search Console clicks, indexed legacy Wix pages, backlinks and branded traffic. Likely choose prescottsbestconstruction.com as the PRIMARY brand; confirm with Andrew before changing canonical/redirects.
2. Archive and preserve top-ranked original Wix content, project videos and homeowner-approved photos. Known legacy URLs flagged by Argon: /projects, /projects/crystal-creek-accessible-remodel, /prescott-fast-track-permits-2026. Map each to an equivalent complete page, not an irrelevant homepage.
3. Complete service-page source and associated media. Keep any unique Wix permittings and case-study authority intact; do not silently discard stories.
4. After content + assets + approvals, implement one canonical domain across tags, sitemap, structured data, social cards, and internal links; add 301 redirects from the other hostname and relevant old Wix URLs; preserve private customer invitation routes.
5. Test DNS, SSL, all 4 hostnames (www/root for both domains), page equivalents, HTTP redirect chains and Search Console. Monitor organic metrics on both properties through the transition. Google advises staging major content and domain changes separately.
6. Retain the secondary domain as a permanent marketing redirect; use tracking tags on campaign links when helpful.

## Staged code changes on feature branch only
- marketing/service-depth.mjs: a section with four substantial build/material considerations for each of the seven EXISTING service pages.
- marketing/site.mjs: material depth inserted into all seven service pages, NOT published to main.
- public/marketing.css: responsive two-column sections, mobile single-column.
- marketing/accessible-remodeling.draft.mjs: complete text and renderable page draft for Accessible & Aging-in-Place Remodeling. Intentionally NOT linked to routing, navigation or sitemap.
- tests/argon-audit-staging.test.mjs: checks route depth and that the accessibility draft is unpublished.

## Image, video and proof requirements before release
- Accessible hero: approved REAL bathroom/shower photo, 16:9; alternatively a clearly labeled AI concept, not claimed as completed construction. Provide descriptive alt text from actual image.
- Accessible sequence: matched before and after photos with homeowner permission; or explicit technical illustration of shower entrance, floor elevations and waterproofing. Never manufacture an alleged completed project.
- Accessible detail: genuine grab-bar blocking, drain detail and curbless transition, or labeled educational schematic.
- Accessible walkthrough: narrated and captioned original 20–45s footage or 3 x 10s approved clips with an accurate transcript/poster.
- Bathroom: completed shower proof, an actual wet-area assembly shot, optional contractor explanation.
- Kitchen: genuine drawer/hinge/cabinet and countertop examples; completed project footage if owner supplies it.
- Finish carpentry: macro of real casing/reveals and wide room context.
- Conversions: real original room and approved finished room, or clearly labeled planning concepts.
- Original Media page: export Wix videos and Crystal Creek source assets and permissions before replacing links. Current new /projects link to the old construction-domain /projects is a self-reference after DNS cutover. Replace with actual owned media before release. The Render app already has shared nav and a contact form phone field.
- Reviews: leave authentic customer quotes faithful to the source. Fix site-authored copy, not silently rewrite quotes; use owner-approved paraphrases if needed.
- Technical quality: mobile/desktop crops, sensible image file sizes, captions, accessible playback, truthful alt text, ImageObject/VideoObject grounded in actual file metadata, working links and no missing-media blocks.

## Publication gate
[ ] Andrew approves content, license/trade scope and project facts
[ ] Visual assets acquired, consent and provenance recorded
[ ] All internal links work, no links to the displaced Wix Media page
[ ] Structured data and alt text verified against approved media
[ ] All automated and browser tests pass
[ ] Canonical decision and Wix redirect mapping approved
[ ] Only then merge to main (Render auto-deploy triggers on main commit)

Assessment basis: Argon High's user-attached 75-line report. The new live-domain observations above are independently checked. No live changes made by this feature branch.
