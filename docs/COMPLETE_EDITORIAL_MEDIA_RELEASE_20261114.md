# Prescott's Best Construction — Complete Homeowner Pages, Editorial and Media Release

**Date:** November 14, 2026 (America/Phoenix)
**Primary website:** https://prescottsbestconstruction.com
**Source branch:** release/homeowner-pages-concepts-20261114
**Approved by:** Project owner/user in conversation ("do all of it. Add the other pages ... images ... adjust the copy").

## All components in this combined release
- All already-tested copy edits from draft editorial PR #8: homeowner-first homepage, About, Process, seven service introductions and service-specific FAQs, useful Budget Explorer retry, primary CTA and remodeling service priority.
- New indexable **Accessible and Aging-in-Place Remodeling** page at `/accessible-aging-in-place-remodeling`: low-entry showers, seating, grab-bar support blocking, circulation, lighting, entryways, kitchens, an archived real project example, and homeowner contact.
- New **Real Project Stories** page at `/projects`, with the genuine Crystal Creek case study as its featured example and concepts clearly separate.
- Restored `/projects/crystal-creek-accessible-remodel` from **the company's original published Wix page**, relying on archived project details and verified screenshots from October 31, 2026, not fabricated images or invented testimonial claims. Original Instagram project link remains external; original customer photos are *not* falsely represented as new image concepts.
- Current **Prescott Remodeling Permit Guide** at `/guides/prescott-remodeling-permits`, grounded in the original October 30, 2026 Wix article and current official city/town/county sources. Old indexed Wix URL `/prescott-fast-track-permits-2026` issues permanent 301 to matching new guide, retaining URL query.
- Seven existing service pages have practical, accessible expandable sections explaining materials, planning and installation details, rather than repeating legal-heavy disclaimers.
- Nine user-approved original generated illustration PNGs converted to **18 responsive optimized WebP assets**, each with truthful alt text and "Design concept" or "Educational illustration" visible caption. Rejected `bad image of door.png` is not copied, referenced, or served.
- **20-second, silent, original concept walkthrough reel** on the accessible page, derived from five approved illustrations, with user-controlled playback (no autoplay), five timestamped caption cues (`.vtt`), poster, descriptive VideoObject metadata; *not* filmed contractor work. The video is approximately 1.09 MB.
- Updated navigation, homepage teaser, sitemap, metadata and schema based on construction primary domain. Existing desktop/mobile layouts and private customer proposal/API paths retained.

## Provenance
- Crystal Creek original publication report:
  `D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\CRYSTAL_CREEK_PUBLICATION_AND_GBP_REVIEW_REPORT_2026-10-31.md`.
- Original published Crystal Creek webpage screenshot with the real job description:
  `D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\CRYSTAL_PUBLIC_STORY_VIEW.png`.
- Original permit guide verbatim source:
  `D:\PrescottsBestConstruction\05_WEBSITE_AND_TECH\permit_page_live_copy_2026-10-30.txt`.
- The nine concept PNG sources remain untouched in:
  `D:\PrescottsBestConstruction\Assets\GENERATED_CONCEPTS_INBOX`.
- Production content makes no claims that the generated concept images are real completed jobs.
- No homeowner-identifying details, private original project photo data, API tokens, credentials or private environment files are included.

## Tests and visual acceptance
- `npm run check`: passed.
- `npm test`: **84 passed, 0 failed** including seven new regression tests for image allowlisting, new pages, authentic case-study text, permit legacy redirect, schema, media serving, private proposal route and remodeling 301.
- Selenium local-browser checks (prior to video addition) succeeded on desktop for home, accessible, projects, Crystal Creek, permits, bathroom, kitchen, cabinetry and conversions and on 390px mobile for home, accessible, kitchen and Crystal Creek. Zero horizontal overflow and zero missing image assets.
- After video addition, local Node integration tests checked MP4 content, VTT captions, WebP poster, 20s VideoObject schema and the primary canonical routing.
- Local QA screenshots and JSON:
  `D:\PrescottsBestConstruction\07_PROJECT_PLANS\PBC_LOCAL_MEDIA_QA_20261114\`.
- Media sizing, alt text, accessibility controls and source IDs recorded in `marketing/remodeling-concept-media.mjs`.

## Postrelease checks
1. Verify Render auto-deployed the squash commit from the combined release PR.
2. Check construction homepage, new accessible page, new project story, legacy Crystal Creek, current permit guide, service pages, media and captions all serve HTTP 200.
3. Verify `/prescott-fast-track-permits-2026` HTTP 301 to `/guides/prescott-remodeling-permits`; `prescottsbestremodeling.com` continues 301 to construction.com.
4. Confirm `https://spectracleanse-ai.onrender.com/proposal` still opens the private portal and `/healthz` succeeds.
5. Submit the new sitemap `https://prescottsbestconstruction.com/sitemap.xml` to Google Search Console if property verification is available; do not claim Search Console access is ready if the Google TXT record remains pending.
6. Watch for 404s, mobile layout issues and first-party page engagement; maintain actual production logs safely.

## Known follow-up opportunities (not release blockers)
- Real original before-and-after photos and approved customer media from Crystal Creek and other builds are not in the currently accessible local image repository. Recover licensed originals, obtain permission if needed and place them on the real-project page; do not fabricate them.
- Video reel is silent planning *concept* media, not Andrew speaking on camera. Replace or supplement it with a real captioned project walkthrough when original footage and consent exist.
- Evaluate a complete future SEO redirect map against verified Search Console indexed URLs; the former permit and Crystal Creek paths are restored in this release.
- Verify the technical accuracy of illustrative cutaway images with a qualified installer before representing them as a prescriptive construction assembly.
