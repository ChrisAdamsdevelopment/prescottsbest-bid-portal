# PBC Website Phase 4 — AI Concept Images Integration
Date: November 2, 2026
Repository: D:/PrescottsBestConstruction/05_WEBSITE_AND_TECH/PBC_BID_PORTAL
Live domain: https://prescottsbestremodeling.com
## Source files and mapped pages
Original six are retained exactly at:
D:/PrescottsBestConstruction/ASSETS/GENERATED_CONCEPTS_INBOX/
- kitchen_with_blank_wall.png → homepage hero, kitchen-hero-detail.webp/card.webp
- kitchen.png → /kitchen-remodeling and homepage card, kitchen-remodel-detail.webp/card.webp
- bathroom_showing_sink.png → /bathroom-remodeling and homepage card, bathroom-remodel-detail.webp/card.webp
- bathroom_facing_shower.png → /shower-conversions and homepage card, shower-conversion-detail.webp/card.webp
- room_with_desk_office.png → /room-conversions and homepage card, room-conversion-detail.webp/card.webp
- looking_through_doorway.png → /finish-carpentry and homepage card, finish-carpentry-detail.webp/card.webp

Source-faithful copies and SHA-256 manifest:
D:/PrescottsBestConstruction/ASSETS/APPROVED_WEBSITE_IMAGES/CONCEPT_IMAGE_PROVENANCE_2026-11-02.json
Public web copies are 12 optimized WebP images in public/site-assets/concepts/, all under 400KB each (~920KB combined). Reproducible conversion script scripts/integrate-concept-images.py.

## Website integration
marketing/imagery.mjs maps pages to approved concept variants and descriptive alternative text. Homepage uses actual image HTML with prioritized loading and responsive placement. Service cards use lazy-loaded concept thumbnails. The service page hero areas show full-size concept images and explicit "Design inspiration · AI-generated concept, not a completed Prescott’s Best project" disclosures. Homepage hero/card copy also indicates AI-generated design inspiration. Existing real project links stay separate from conceptual imagery.
marketing/routes.mjs serves only a static allowlisted set of 12 WebP paths as image/webp (no arbitrary file paths or uploads).
public/marketing.css contains desktop hero gradient for readable text, accessible high-contrast captions, card photo crop, service page photo layout, and mobile stacking. No customer images or private documents exposed.

## Validation
- npm run check: PASS
- npm test: full portal and web tests PASS, including all 12 image routes, 5 service images and original protected proposal API behavior
- Selenium tests/concept-images-browser-qa.py: PASS 8 checks (desktop six pages, mobile hero, mobile bathroom); images decoded, labels visible and no horizontal overflow.
- QA screenshots .concept-home-desktop.png, .concept-home-mobile.png, .concept-bathroom-mobile.png are local only; they should not go to GitHub.

## Next images to request (optional)
1. Consultation scene (4:3): ordinary homeowner and contractor discussing renovation plan, materials and expectations at a kitchen table, no badges or actor resemblance. Must be labeled illustrative.
2. Local Prescott/Prescott Valley exterior home (16:9): modest Northern Arizona residential home, high-desert landscaping, no identifying street/address, generic concept label.
Do not generate more fake project case studies. Ask owner Andrew for genuine documented completed-job photos with homeowner permission; authentic before/after photos, scope and location are the highest value next visual investment for trust/SEO.

## Release guardrails unchanged
The website still has SITE_INDEXABLE=false, robots Disallow / and no published sitemap. LEAD_FORM_ENABLED=false until verified inbox notification, privacy/retention and owner review. All pricing remains research examples rather than real construction bids. The existing Wix site and private Render proposal portal are not to be disrupted.
