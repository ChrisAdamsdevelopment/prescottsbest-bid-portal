# Prescott's Best — Phase 5 illustration and process UX delivery
Date: 2026-11-02
Domain: https://prescottsbestremodeling.com
Branch: main

## User-provided additions
Two downloaded AI-generated images were found in D:/PrescottsBestConstruction/ASSETS/GENERATED_CONCEPTS_INBOX/:
- front_of_home.png — generic high-desert home exterior, 16:9. Used on /about in a location-introduction panel. It is expressly a generated regional illustration and *not an actual PBC job or client property*.
- two_people_talking.png — generic consultation between fictional people at a kitchen table, 4:3. Used on /schedule/contact beside the phone and email information. People are explicitly disclosed as not PBC staff or customers, and no names or invented endorsements are attached.

## Processing and provenance
Rebuilt imagery via scripts/integrate-concept-images.py with preserved source SHA-256 and original files left untouched. The provenance record in ASSETS/APPROVED_WEBSITE_IMAGES/CONCEPT_IMAGE_PROVENANCE_2026-11-02.json now tracks eight AI-generated assets, including these two.
Created responsive detailed and small WebP versions for both:
public/site-assets/concepts/local-home-{detail,card}.webp
public/site-assets/concepts/consultation-{detail,card}.webp
The set now has 16 allowlisted WebP assets. marketing/imagery.mjs owns image URLs and honest labels. marketing/routes.mjs only serves these known paths.

## Related quality improvement
Corrected process page numbered cards: cards with no matching image now show their real STEP/number icons instead of blank spaces. Added accessible Our Process / About links to the website footer.
Responsive layouts and images are lazy loaded where appropriate; no use of invented before/after projects.

## Tests
- npm run check and npm test both pass.
- tests/concept-images-browser-qa.py passes 13 browser checks across six prior pages and both new routes at 390px and 1440px, image decoding, accessible disclosure text, no horizontal overflow, and process icons.
- Automated tests ensure four new images serve as correct image/webp, about and consultation page tags and captions are present, and backend private proposal and lead controls remain intact.
- Local screenshots (.editorial-*.png) remain untracked, never commit.

## Remaining launch work
- LEAD_FORM_ENABLED=false is intentional pending verified outgoing sender/real inbox receipt and lead retention workflow.
- SITE_INDEXABLE=false and /robots.txt Disallow / intentional until canonical/domain strategy, accurate owner-approved copy, marketing consent and GBP/GSC verification.
- Website estimator numbers still research-only; not Andrew's approved company pricebook.
- Highest trust investment now authentic Andrew-approved project photos, permission and scopes, then real project case-study pages.
