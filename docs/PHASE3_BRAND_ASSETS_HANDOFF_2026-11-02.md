# Prescott's Best Construction — Phase 3 brand deployment handoff
Date: November 2, 2026
Domain: https://prescottsbestremodeling.com
Source: D:/PrescottsBestConstruction/05_WEBSITE_AND_TECH/PBC_BID_PORTAL

## Asset provenance
Uses the original owner-supplied gold/black badge from D:/PrescottsBestConstruction/ASSWTS_FOR_ESTIMATOR/LOGO/Prescotts Best Construction Badge.png (a second copy is now at ASSETS/LOGO).
Derived images made by deterministic resizing/compositing, without generative reinterpretation of the badge:
- public/site-assets/pbc-logo.webp — optimized full-color logo used in header, hero and footer.
- favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon-48x48.png.
- apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest.
- pbc-social-card.jpg, 1200×630 factual logo and geographic service statement for page sharing.
Rebuild at any time with scripts/build-brand-assets.py; do not replace the owner's authentic source.

## Changes
- SEO/share meta tags: Open Graph image, title, description, clean new-domain URL, Twitter large image, favicon, icons, manifest, descriptive logo alt and page-specific headings.
- Native HTML details/summary mobile menu with no JavaScript dependency, no horizontal page overflow at 390px viewport. Desktop navigation remains separate; site colors tuned to the gold/black badge.
- Budget explorer gains print/save and copy summary controls with the research-demo pricing disclaimer retained in its output.
- All static icon and sharing assets served with appropriate MIME types.
- The private customer proposal root on Render, staff-only APIs, and original Wix website are untouched.
- Live traffic and indexing remain gated. Site still noindex and public inquiry submissions disabled. Price examples are not approved company quotes.

## Validation
- npm run check PASS.
- npm test PASS: four suites, including favicon, icon/manifest MIME and social metadata, budget, protected portal and canonical URL checks.
- Selenium tests/brand-mobile-qa.py PASS: 390px menu opens and closes, no horizontal overflow, desktop nav, favicon/share metadata, printable/copyable deterministic budget.
- Synthetic tests only; no real customer data, images or emails included.

## Image intake, consent, next turn
The user will generate visuals next. Canonical intake:
D:/PrescottsBestConstruction/ASSETS/GENERATED_CONCEPTS_INBOX
Comprehensive exact six-shot prompts:
D:/PrescottsBestConstruction/ASSETS/IMAGE_GENERATION_BRIEF_2026-11-02.md
Wait for explicit visual review and label all AI-generated images as concepts rather than actual PBC completed work. Real project photos stay in ASSETS/REAL_PROJECT_PHOTOS_PRIVATE until their public-use consent is verified. Web-ready approved images go to ASSETS/APPROVED_WEBSITE_IMAGES before publishing.
