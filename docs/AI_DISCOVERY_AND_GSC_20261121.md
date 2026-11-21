# Prescott's Best — AI Discovery and Search Console Recrawl
Date: November 21, 2026 (Arizona)
Canonical host: https://prescottsbestconstruction.com/

## Owner-requested work
The owner asked for updated AI discovery documents and Google recrawl/indexing requests through the existing AdamsChristopher777 Chrome browser. The recent real-project gallery, Andrew’s original reel and practical manufacturer installation details were not in the older AI discovery summaries. Existing canonicals, redirects, verified Search Console files and private API restrictions must remain intact.

## Changes in this release
- /llms.txt now prioritizes actual construction proof: the real photo gallery, original Andrew video, Crystal Creek accessible remodel, precision casing story, and detailed process around manufacturer installation requirements. The schedule page is described as a native project inquiry form; illustrative images are not misidentified as completed work.
- /llms-full.txt now includes new sections on actual completed-work photography, original video, product installation requirements for deck coatings, window flashing and shower waterproofing, and a direct contact link. No blanket workmanship warranty is advertised.
- /sitemap.xml retains canonical pages and adds 16 real project photo composites as image sitemap entries for /projects/gallery, a VideoObject sitemap entry for the original 33-second Andrew audio reel on /projects/andrew-at-work, and November 21 lastmod dates only for substantially updated pages.
- /robots.txt now explicitly permits approved public real-gallery and real-project assets while still excluding /api/ and /proposal.
- Current layout, images, search ownership verification files, URLs and existing structured data are preserved.

## Tests
- Added tests/seo-freshness-20261121.test.mjs covering both llms files, 16 real image sitemap entries, video metadata, accurate lastmod dates and public versus private robots rules.
- Full website suite 114/114 PASS; npm run check PASS; git diff --check PASS.

## GSC — actual signed-in browser operations
Chrome profile Profile 2, adamschristopher777@gmail.com, verified HTTPS URL-prefix property for https://prescottsbestconstruction.com/.
- URL Inspection: /projects/gallery was 'URL is not on Google' and unknown to Google. Clicked Request indexing; green Indexing requested/priority crawl queue confirmation.
- URL Inspection: /projects/andrew-at-work was also unknown to Google. Clicked Request indexing; green Indexing requested confirmation.
- Previous successful November 14 indexing requests on home, bath, kitchen, process and other major pages already exist, and Google says duplicate requests do not raise crawl priority.
- Need submit refreshed sitemap after production deployment and verify the GSC confirmation. Crawl request does not guarantee Google indexing or local-pack rank improvements.
