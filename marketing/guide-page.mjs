// Dedicated, senior-friendly and accessible optional AI project-guide screen.
export function guidePage(link){
 const tool=(path,label,summary)=>'<a class="guide-tool-link" href="'+link(path)+'"><strong>'+label+'</strong><span>'+summary+'</span></a>';
 return {title:'AI Remodeling Project Guide | Prescott’s Best Construction',
  description:'An optional plain-language AI project planning helper for Prescott Valley and Prescott homeowners. Ask about remodeling ideas, accessibility and preparing for a contractor visit.',
  body:
  '<div class="site-pagehead guide-heading"><span class="kicker">OPTIONAL AI PROJECT GUIDE</span><h1>Tell us what you would like to change.</h1><p class="lede">No need to know construction terms. Ask one question at a time and explore possibilities at your own pace. You can always talk to a real person instead.</p></div>'+
  '<section class="site-section guide-overview"><h2>What would you like help with?</h2><div class="guide-quick-picks" aria-label="Example questions">'+
  '<button type="button" class="guide-prompt" data-prompt="I want to make my bathroom easier and safer to use. What should I consider?">A safer, easier bathroom</button>'+
  '<button type="button" class="guide-prompt" data-prompt="I want to refresh my kitchen without changing the layout. What choices matter?">Refreshing my kitchen</button>'+
  '<button type="button" class="guide-prompt" data-prompt="How can I describe a small door or trim project to a contractor?">A door or trim repair</button>'+
  '<button type="button" class="guide-prompt" data-prompt="What should I prepare before getting a rough remodeling budget?">Planning a budget</button></div></section>'+
  '<section id="guide-panel" class="site-section guide-layout" aria-label="AI project conversation">'+
  '<div class="guide-main"><h2>Ask the AI Project Guide</h2><p class="micro">AI can make mistakes. It is not Andrew, cannot approve bids, and cannot determine permits or site safety. No account is required.</p>'+
  '<div id="guide-transcript" class="guide-transcript" role="log" aria-live="polite" aria-relevant="additions text"><p class="guide-greeting">Welcome! Tell me what you want to improve in your home. If you are not sure where to begin, tap one of the questions above.</p></div>'+
  '<form id="guide-form" class="guide-form"><label for="guide-question">Your question or project description</label>'+
  '<textarea id="guide-question" name="question" maxlength="650" rows="4" placeholder="For example: I have a bathtub that is hard to step into. I would like something easier to use."></textarea>'+
  '<p class="guide-privacy-note">Do not enter your name, street address, phone number, email, payment details or medical information.</p>'+
  '<label class="guide-permission"><input type="checkbox" id="guide-consent"/><span>I understand that when I press Ask, my question and recent conversation will be sent to <strong>Google Gemini</strong> to generate an answer. This is optional. <a href="'+link('/privacy')+'">Read privacy details</a>.</span></label>'+
  '<div class="guide-controls"><button type="submit" id="guide-submit" class="site-button primary" disabled>Ask my question</button>'+
  '<button type="button" id="guide-read" class="site-button outline" disabled>Read last answer aloud</button>'+
  '<button type="button" id="guide-stop" class="site-button outline" hidden>Stop reading</button>'+
  '<button type="button" id="guide-clear" class="site-button outline">Start over</button></div>'+
  '<p id="guide-status" role="status" aria-live="polite">Checking AI guide availability…</p></form></div>'+
  '<aside class="guide-assistance"><h2>Prefer another way?</h2><p>You do not need AI to use these tools.</p>'+
  tool('/start-here','Four-question project planner','Make a checklist privately on your device.')+
  tool('/estimate','Rough budget explorer','See clearly labeled research-only examples. No AI calculates the price.')+
  tool('/blog','Homeowner knowledge center','Read simple articles about materials and permits.')+
  tool('/schedule','Talk to a real person','Call (928) 350-0940 or send a regular email.')+
  '<p class="micro">The AI guide does not collect a lead or book an appointment. Use the contact page when you want to speak with Prescott’s Best.</p></aside></section>'
 };
}
