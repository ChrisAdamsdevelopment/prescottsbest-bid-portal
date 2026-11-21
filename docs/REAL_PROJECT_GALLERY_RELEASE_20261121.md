# Real PBC work gallery and original Andrew reel — November 21, 2026

## Owner authorization and source
The company owner requested immediate live publication of the real photos downloaded from the Prescott's Best Construction Google Business Profile and the company's original Instagram reel. Source photos are retained, unaltered, at `D:\PrescottsBestConstruction\ASSETS\GENERATED_CONCEPTS_INBOX\gallery_and_videos_real`; original reel archived at `D:\PrescottsBestConstruction\ASSETS\original-instagram-captures-20261120\DMwWQTGxWqo.mp4`. Instagram source: https://www.instagram.com/reel/DMwWQTGxWqo/ . The reel contains an original H.264 video and AAC audio. Publication under PBC's own brand is owner authorized. No AI-generated photos are presented as completed jobs.

## Public page design
- New `/projects/gallery`: real project hero; 6 before/after comparison sliders from original vertically stacked two-photo images, 10 completed-work photo cards, real on-site reel with sound and direct contact CTAs. Photo enlargement uses native `dialog`, keyboard Escape and direct close, and works on mobile.
- New `/projects/andrew-at-work`: short original company story and fully native video with audio, no Instagram outbound play requirement.
- Homepage: three real project photos and inline Andrew original work reel after first trust section, without replacing existing service CTAs or films.
- `/projects`: new direct internal gallery feature; original Crystal Creek and casing stories preserved.
- Existing bathroom, shower, kitchen, room-conversion, and outdoor-carpentry service pages: real project teaser cards linking to the gallery.
- Search/share metadata: canonical clean routes, real gallery ImageGallery, VideoObject on dedicated reel page, real-photo OG images for the new pages.
- New site-authored asset HTML/JS/CSS with mobile layout at 320–1280px; no third-party iframe or player; video uses native streaming with HTTP byte ranges, poster, and `preload="none"`.

## Image handling
Six owner-supplied source files contain paired before/after frames. Their upper/lower frames were cropped and compressed independently into WebP; source originals are not altered. Other finished project photos are compressed and displayed with specific captions, avoiding fictional addresses, cost, duration or testimonials. Reproducible derivative script: `D:\PrescottsBestConstruction\07_PROJECT_PLANS\prepare_real_gallery_release_20261121.py`. Reviewed source manifest: `docs/real-gallery-source-manifest-20261121.json`. Video is remuxed with original audio and metadata stripped; 32.55 seconds, 638×360, compressed 1.4MB MP4. Complete optimized media directory ~4.7MB.

## Security and access
Media server permits only explicit, known real-gallery asset filenames and the single original reel path. All other arbitrary files (including original GBP inbox and source manifest) remain unavailable through the public static file router. Video playback uses existing byte-range/HEAD behavior, and social links do not force exit from the website. Native website and CRM endpoints remain unchanged.

## Verification and deployment
- Focused gallery regression: 7/7 passed including VideoObject/ImageGallery metadata and HTTP 206 test.
- Website check: passed. Existing suite before metadata update: 103/103 passed.
- Selenium mobile/desktop QA: 35 page/viewport checks across 320, 360, 390, 430, 768, 1024, 1280 pixels, zero failures; comparison slider, gallery dialog, 6 video playback tests all passed. Evidence stored in `tests/real-gallery-browser-20261121/` (local QA evidence only, do not commit screenshots).
- Full test rerun, code review and production release evidence to be appended after final validation.
