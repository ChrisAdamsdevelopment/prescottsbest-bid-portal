# Prescott's Best Construction — Argon High editorial review
Status: REVIEW ONLY. Feature branch `feat/argon-human-voice-review-20261114`. **DO NOT MERGE OR DEPLOY** without Andrew's content and media approval.

## Assessment received
User provided Argon High's 314-line corrected editorial audit on November 14, 2026. It surveyed the homepage, About, Process, bathrooms, kitchens, finish carpentry, custom cabinetry, Budget Explorer, and Holiday Lighting, and proposed six-part marketing copy, authentic imagery, and preserving license/scope/consent accuracy. Argon said it could not directly reach /design-center, so its Design Center commentary is NOT a live-page audit. Its "75% to 80% AI-generated" figure is an editorial impression, not a detection result.

## Independently verified/current corrections
- At time of recheck: https://prescottsbestremodeling.com/ returned HTTP 301 to construction.com; https://prescottsbestconstruction.com/ returned HTTP 200 on the newer Render app. Both domains are NOT independent Wix/Render sites anymore.
- The kitchen FAQ in `marketing/site.mjs` already had a friendly Budget Explorer answer. The older "research demonstration" and "approved pricebook" wording cited by Argon was not in the current source.
- The old instruction "Never treat this preview as an installation/safety plan. Lead must confirm..." was NOT found in current `marketing/` and `public/` JavaScript. Do not claim to have removed it or rewrite a non-existent string.
- The live `POST /api/public/budget` calculation endpoint returned HTTP 200 with a valid synthetic full-bath estimate. The reported browser "Failed to fetch" may be transient; it has NOT been reproduced or conclusively attributed to CORS.
- Original 404 legacy Wix project and permit URLs remain a separate content migration issue.

## Draft changes implemented, gated on this branch
1. Homepage: human lead "Good remodeling starts with listening", owner contact button before budget tool, core service grid moved ahead of holiday lighting/seasonal promotion. Cinematic hero and existing video, storm guide, seasonal features and working links retained.
2. About: replaces defensive "What we will not do" message with an approachable builder/homeowner introduction and direct contact. Keeps Arizona ROC #343141 and link to official ROC site.
3. Process: removes unfinished Google Drive roadmap; explains written plans, customer decisions and final walkthrough in ordinary language; uses four individual labeled concept captions without repeating lengthy legal warnings. Privacy and actual quote requirements elsewhere remain.
4. Services: seven specialized homeowner-first paragraphs and relevant FAQs, notably carpentry-specific instead of universal plumbing/layout questions. Existing service routes, imagery and tool integrations remain intact; no unverifiable project histories added.
5. Budget Explorer client: when the request fails, shows a helpful error and Try again button rather than revealing raw "Failed to fetch" to visitors. No changes to the numeric estimate model or public API.
6. New regression tests verify copy, nav order, non-leakage of internal project roadmap, domain routing, private proposal behavior and image-exclusion policy.

## Not changed
- No live website change, DNS or Render edits, merge to main, migration or deployment.
- No change to client OAuth/consent checkboxes or email/lead submission behavior.
- No generated image deployed or claimed as a real finished project.
- NO file named `bad image of door.png` may be used, even as a placeholder or image fallback. That file was rejected by the owner.
- The separate `feat/argon-audit-content-media-gated-20261113` branch remains unpublished with the Accessible and Aging-in-Place draft, enhanced technical service content, and media plan. Do not merge it into this editorial branch without a separate review.
- `cabinets.png`, `insideofshower.png`, `insideshowerwall.png` and six earlier generated concepts are in the private Generated Concepts inbox. They are concepts, not completed project photos. Verify technical plausibility and appropriate alt text before optimizing them into the website.
- Real Crystal Creek/legacy Wix before-after images, permissions, article text, and exact under-house excavation details require source recovery and Andrew's confirmation. Do not invent verified dates, scope, testimonial, or inaccessible project images.

## Before any release, ask Andrew to confirm
- Who leads walk-throughs and which construction tasks Andrew personally performs.
- What can accurately be said about keeping jobsites protected and the company's walkthrough/cleanup practices.
- Scheduling and travel/service area beyond Prescott/Prescott Valley.
- Scope of trade work and licensed subs; published ROC license/classification.
- Actual fixed-price vs cost-plus agreement practices.
- Whether Crystal Creek photo/story publication is authorized, including specific structure/work details.
- Correct homeowner project photos and video rights; real before/after pairs, if any.
- Holiday lighting services and installation process messaging, including current price examples.

## Release and technical QA checklist
- Owner approves before-and-after copy and claims.
- Review privacy, AI-upload consent, accessibility and pricing disclosures in their original contexts.
- Keep canonical links, metadata, LocalBusiness schema, /schedule inquiry, /api/public/budget, and customer portal working.
- Browser-test estimate under actual network disruption, retry, and mobile viewport. API HTTP 200 alone is not proof against all frontend failures.
- Verify real images and caption labels, file sizes, width/height/alt, mobile crop, and final hosted URLs.
- Preserve legacy Wix 404 restoration and new Accessible/aging-in-place page release as separate media-gated work.
- Execute `npm run check` and `npm test`, inspect Render impact, then approve any merge to production.

## Source of review
User-provided pasted Argon High audit dated 2026-11-14, not a direct live guarantee for every passage.
