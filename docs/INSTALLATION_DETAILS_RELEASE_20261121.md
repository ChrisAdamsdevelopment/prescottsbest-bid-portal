# Prescott's Best — Installation Details and Visual Caption Refresh
Date: 2026-11-21

## Owner's request, basis and approved copy boundaries
The owner described a recent deck coating installation where manufacturer coverage depended on following precise preparation, temperature and application requirements. He also described a homeowner with water leaking around a window where the window supplier attributed the problem to installation/framing; this example is illustrative and does not establish a specific defective installer or warranty claim. Owner asked for strong, useful product/system installation copy, but **no unsupported company-wide workmanship warranty**. He also asked to preserve polished concept imagery, strip unnecessary visible "design concept"/"design inspiration" photo captions, and insert real project photos only where visually helpful.

## Implemented
- Marketing module `marketing/installation-standards.mjs`: homepage premium editorial proof panel paired with real covered-deck photo, process-page three practical examples (deck coating, window framing/flashing and shower waterproofing), and seven service-specific proof sections for decks, carpentry/window-trim, baths, showers, kitchens, cabinetry and conversions. Links guide customers to the detailed process.
- The site is honest about product-specific manufacturer instructions, no alleged specific product warranty periods, coverage promises, manufacturer endorsements, certifications, or automatic assignment of warranty to Prescott's Best. The copy centers craftsmanship in the hidden parts of the assembly.
- Removed **visible** "Design inspiration", "Design concept", "Design illustration" figcaptions and badge labels on existing visual scene figures, WITHOUT removing polished images or misrepresenting their origin. Screen-reader alt text stays descriptive; ImageGallery metadata still identifies the illustrative images separately from actual PBC projects. Dedicated real-project gallery remains reachable from the homepage and relevant services.
- Existing native estimate form and site contact email remained unchanged because live audit verified they are already consistent. No testimonials or manufacturer warranty guarantees invented.

## Testing
- Full Node site suite: 110/110 PASS.
- QA: 24 real Selenium Chrome combinations (viewport 320/390/768/1280 by home/process/deck/carpentry/bathroom/schedule), ZERO horizontal overflow, broken images or visible concept-photo labels; service proof displayed, native estimate intact.
- Screenshots after dismissing optional analytics banner: `D:\PrescottsBestConstruction\07_PROJECT_PLANS\quality-proof-visual-qa-20261121\` and results JSON.
- Node check, diff check PASS; no new dependencies, routes, customer data changes or paid API calls.

## Release tracking
PR/Render deployment and live verification to be recorded after merge.
