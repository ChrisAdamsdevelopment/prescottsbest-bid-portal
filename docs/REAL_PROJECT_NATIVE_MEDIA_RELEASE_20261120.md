# PBC original project videos and photos — November 20, 2026

## Goal and implementation

Eliminate Instagram navigation loss for homeowners browsing genuine work on prescottsbestconstruction.com. Original Instagram embeds presented a prominent "Watch on Instagram" overlay even in mobile iframes, which defeated the in-page playback goal.

The two public, company-posted Instagram reels have been preserved offline and optimized to native HTML5 MP4 with **no audio** (third-party soundtrack was not cleared for reuse). All videos load from the PBC domain using byte-range streaming, lazy `preload="none"`, a real-frame WebP poster, inline-play-capable native controls, and 480-pixel mobile / 720-pixel desktop source selection.

The public Crystal Creek 20-image Instagram carousel has been exported to 20 local WebP photographs, each 960×1200. It is shown via an accessible swipeable horizontally scrolling gallery with Previous/Next buttons, screen-reader live photo count, keyboard arrows, and per-image descriptions. Images are lazy loaded; no Instagram scripts, frames, cookies or account requirements are needed for normal viewing.

The homepage link **Watch Andrew at the workbench** opens the PBC window-casing story anchored to the native video. Project index Crystal Creek action and case study shortcut open the PBC Crystal Creek page anchored to its reel. Optional source links are secondary under collapsed disclosures and open a new tab.

## Authentic source posts and retained provenance

- Casing workshop reel: https://www.instagram.com/reel/C1VllESr9tH/ — 37.45 sec; web assets `window-casing-workbench-{480,720}.mp4` and poster.
- Crystal Creek construction reel: https://www.instagram.com/reel/DVR_JdVAWff/ — 43.16 sec; web assets `crystal-creek-shower-construction-{480,720}.mp4` and poster.
- Crystal Creek shower and closet photographs: https://www.instagram.com/p/DV162KsgUxP/ — 20 image files `crystal-creek-project-01.webp` through `crystal-creek-project-20.webp`.
- Raw original MP4 copies (possibly containing third-party Instagram music), source manifest, and gallery review contact sheet are **not in the deployed website/git**; archived locally under `D:\PrescottsBestConstruction\Assets\original-instagram-captures-20261120`.
- The site continues to distinguish the story's reported hidden structural work from what videos and photos actually document.

## Security and media delivery

`marketing/routes.mjs` allowlists exactly four MP4 URLs for 206 byte-range/HEAD streaming and only the two posters / twenty photo files for static delivery. No dynamic user-provided filepath is accepted. Source links in native site copies are informational only and require a separate visitor decision to open Instagram. All local MP4 editions are silent.

## Browser QA, tests and limits

- `npm run check` and `npm test` must both pass.
- Browser regression: `python tests/native_project_media_browser_20261120.py`. Chromium emulated viewports: 320, 360, 375, 390, 414, 430, 768, and 1280 CSS pixels on both project pages. Assert zero horizontal overflow, correct gallery/video count, no Instagram frames, gallery fit, video fit, real video playback with progressing `currentTime` on both 390 and desktop, swipe/carousel buttons and video seeking byte-range responses.
- Real Android/iOS handset and all older browsers cannot be physically validated through the available remote browser; verify with owner if device-specific anomalies emerge.

## Production sign-off

This record explains work performed. A merged pull request is not proof of Render production availability; after merge verify pages, media endpoint status and HTTP Range support on the canonical domain before marking live.