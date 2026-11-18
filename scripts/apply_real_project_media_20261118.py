from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def replace_once(name, old, new):
    path=ROOT/name
    value=path.read_text(encoding="utf-8")
    # This header line is part of a long HTML string; the deployed feature marker
    # is more robust than a whitespace-sensitive whole-line match on re-runs.
    if name=="marketing/site.mjs" and "instagram-projects.js" in new and "instagram-projects.js" in value:
        print("ALREADY APPLIED", name, "(script include)")
        return
    if new in value:
        print("ALREADY APPLIED", name)
        return
    count=value.count(old)
    if count!=1:
        raise RuntimeError(f"{name}: expected 1 anchor, got {count} for {old[:70]!r}")
    path.write_text(value.replace(old,new,1),encoding="utf-8")
    print("PATCHED",name)

# Apply idempotent, exact-anchor edits to the existing PBC source tree.

replace_once(
    "marketing/restored-homeowner-pages.mjs",
    "'<section class=\"site-section\"><div class=\"section-heading\"><span class=\"kicker\">EXPLORE MATERIALS AND LAYOUTS</span>'+",
    """'<section class=\"site-section real-project-teaser\" aria-labelledby=\"real-casing-title\"><div><span class=\"kicker\">ORIGINAL WORKSHOP FOOTAGE · FINISH CARPENTRY</span>'+
 '<h2 id=\"real-casing-title\">Precision window and door casings start at the workbench.</h2>'+
 '<p>Watch the original shop reel showing measured pieces and preassembled trim corners before installation. This is real process footage—not a concept rendering.</p>'+
 '<div class=\"site-actions\"><a class=\"site-button primary\" href=\"'+link('/projects/precision-window-casings')+'\">See the craftsmanship story</a>'+
 '<a class=\"site-button outline\" href=\"'+link('/finish-carpentry')+'\">Explore finish carpentry</a></div></div></section>'+
 '<section class=\"site-section\"><div class=\"section-heading\"><span class=\"kicker\">EXPLORE MATERIALS AND LAYOUTS</span>'+"""
)

replace_once(
    "marketing/restored-homeowner-pages.mjs",
    "description:'Read the Crystal Creek accessible remodel story and explore remodeling ideas from Prescott’s Best Construction, with a clear distinction between real projects and design concepts.'",
    "description:'Explore original Crystal Creek shower construction footage, a precision window-casing reel and real project stories from Prescott’s Best Construction in the Prescott area.'"
)

replace_once(
    "marketing/site.mjs",
    "import {accessibleRemodelingPage,prescottPermitGuidePage,crystalCreekCaseStudyPage,projectsIndexPage} from './restored-homeowner-pages.mjs';",
    "import {accessibleRemodelingPage,prescottPermitGuidePage,crystalCreekCaseStudyPage,projectsIndexPage} from './restored-homeowner-pages.mjs';\nimport {windowCasingCaseStudyPage} from './instagram-project-proof.mjs';"
)

replace_once(
    "marketing/site.mjs",
    "routes['/projects/crystal-creek-accessible-remodel']=()=>crystalCreekCaseStudyPage(link);",
    "routes['/projects/crystal-creek-accessible-remodel']=()=>crystalCreekCaseStudyPage(link);\nroutes['/projects/precision-window-casings']=()=>windowCasingCaseStudyPage(link);"
)

replace_once(
    "marketing/site.mjs",
    "serviceDepth(s.path)+conceptSectionForService(s.path)+",
    "serviceDepth(s.path)+\n (s.path==='/finish-carpentry'?'<section class=\"site-section real-project-teaser\"><span class=\"kicker\">REAL COMPANY WORKSHOP FOOTAGE</span><h2>See how our window casings come together.</h2><p>Andrew measures, lays out and joins the trim before installation. Explore the original footage and the craftsmanship behind a finished opening.</p><a class=\"site-button outline\" href=\"'+link('/projects/precision-window-casings')+'\">View the precision-casing project</a></section>':'')+\n conceptSectionForService(s.path)+"
)

replace_once(
    "marketing/site.mjs",
    "<div class=\"proof-panel\">Explore project videos and homeowner reviews, or contact us to see relevant examples for your renovation.</div>",
    "<div class=\"proof-panel real-project-links\"><strong>Actual work, documented from the jobsite</strong><a href=\"'+link('/projects/crystal-creek-accessible-remodel')+'\">Crystal Creek accessible shower — real construction footage</a><a href=\"'+link('/projects/precision-window-casings')+'\">Window casing — precision shop assembly reel</a><a href=\"'+link('/projects')+'\">Browse real projects and clearly labeled design ideas</a></div>"
)

replace_once(
    "marketing/site.mjs",
    "'<script defer src=\"/voice-guides.js?v=recorded-guides-20261109\"></script>'+",
    "'<script defer src=\"/voice-guides.js?v=recorded-guides-20261109\"></script>'+ \n (body.includes('data-instagram-post=')?'<script defer src=\"/instagram-projects.js\"></script>':'')+"
)

replace_once(
    "marketing/routes.mjs",
    " '/marketing.js':['public/marketing.js','text/javascript; charset=utf-8'],",
    " '/marketing.js':['public/marketing.js','text/javascript; charset=utf-8'],\n '/instagram-projects.js':['public/instagram-projects.js','text/javascript; charset=utf-8'],"
)

replace_once(
    "server.mjs",
    "connect-src 'self'; frame-ancestors 'none';",
    "connect-src 'self'; frame-src https://www.instagram.com; frame-ancestors 'none';"
)
print("SUCCESS: local original-media site source prepared, not deployed")
