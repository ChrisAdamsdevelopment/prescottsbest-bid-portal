# Prescott's Best — SEO, homeowner learning and AI discovery (Phase 6)
Date: November 3, 2026
Source: PBC_BID_PORTAL at D:/PrescottsBestConstruction/05_WEBSITE_AND_TECH/PBC_BID_PORTAL
Domain: https://prescottsbestremodeling.com

## Implemented
- /blog — a semantic HTML knowledge center with a four-article library, navigation, accessible mobile layout, cross-links and original educational content.
- Articles: /blog/compare-fixed-price-and-cost-plus, /blog/bathroom-remodel-planning-checklist, /blog/kitchen-budget-decisions, /blog/prescott-permit-questions-homeowners.
- Per-article page titles, description, date, Organization author/publisher and `BlogPosting` JSON-LD. Generic `GeneralContractor` JSON-LD retained. No fabricated FAQs, ratings, locations, cost prices or project photos.
- /llms.txt — curated human/agent-readable link map, including explicit disclosure that budget numbers are examples, AI images are not actual projects and proposals are private.
- /llms-full.txt — detailed plain-text article collection for opt-in agent retrieval.
- /feed.xml — RSS 2.0 with article dates and links.
- /robots.txt and /sitemap.xml exist already with an indexability flag; blog pages now join sitemap generation once approved.
- Existing onboarding planner, estimator, private proposals and security scopes retained.

## Search and indexing precautions
- SITE_INDEXABLE remains false; `robots.txt` Disallow: /; pages have noindex,nofollow; /sitemap.xml returns 404 on purpose until owner confirms canonical domain vs live Wix website, public contact route, content accuracy, email/privacy rules, and real project consent.
- No claims that /llms.txt improves Google ranking. This is an experimental content discovery convention, not an official Google ranking factor.
- Article JSON-LD is for machine understanding, not a guaranteed rich snippet. Google strongly limits FAQ rich results for non-government/non-health sites.
- Permits article deliberately does NOT claim a specific new 2026 Prescott permitting exemption; homeowners must consult current City/Town/County sources.

## QA
- npm run check: PASS.
- npm test: 4/4 test groups PASS, including four article routes and blog schema, llms.txt, llms-full.txt, RSS, robots and sitemap safeguards, existing private portal security.
- Post-deploy production verification recorded separately in 07_PROJECT_PLANS.

## Remaining for genuine search launch
- Owner-approved domain/canonical plan, Google Search Console verification, GBP listing link, unique useful real work case studies, genuine structured contact/availability info, image source rights.
- Production-ready inquiry email delivery, consent/retention and agreed service scope.
- Editorial workflow with approved authors, updates, review dates, internal links and metrics. This is a source-controlled blog, not yet an admin CMS.
