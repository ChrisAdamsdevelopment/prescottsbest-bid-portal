// Small, accessible, self-contained read-aloud guides for complex homeowner tools.
// Audio asset remains optional: the browser reads this same text aloud until approved recordings arrive.
const source={
  '/holiday-lighting/design':{
    id:'holiday-designer',
    title:'Holiday Lighting Designer',
    short:'Hear how to choose lights, trace your roofline, and save a design.',
    intro:'Welcome to the Holiday Lighting Designer. You can try it without an account or an appointment.',
    steps:[
      'First, choose a lighting style, such as warm white, red and white, or multicolor. You can always change it later.',
      'Next, use the sample house, or select a picture of your own home. Your photo stays on your device unless you separately agree to share it.',
      'Press Open the lighting editor. Choose Draw lights, then tap along the roof or patio where you want lights. Press Finish this run when you are done. To make changes, use Select or move.',
      'When you are happy, save your preview or add your idea to your list. You can request a quote, and our team will confirm measurements, products, and installation details.'
    ]
  },
  '/visual-design-preview':{
    id:'design-center',
    title:'Design Center',
    short:'Hear how to compare ideas and save your favorite designs.',
    intro:'Welcome to the Design Center. This is a place to explore ideas before making construction decisions.',
    steps:[
      'Scroll to the design examples and choose the type of project you have in mind, such as kitchens, cabinets, hardware, decks, or holiday lights.',
      'Open a category and compare the different finishes, colors, or styles. These pictures are examples to help you decide what you like.',
      'When you find a favorite, use the Save idea option where it is available. You can revisit your choices in Saved looks.',
      'If you would like a design based on your own home, choose Ask about a custom preview. Our team will explain what is available and confirm the project details before any work begins.'
    ]
  },
  '/estimate':{
    id:'budget-explorer',
    title:'Project Budget Explorer',
    short:'Hear how to answer four questions and understand your starting budget.',
    intro:'Welcome to the Project Budget Explorer. It gives you a planning range, not a final contractor quote.',
    steps:[
      'First, choose the type of project you want, such as a bathroom, kitchen, shower, or carpentry project.',
      'Next, choose the approximate project size and the level of finishes you would prefer.',
      'Then, select whether the job looks straightforward or may have added complications. It is fine to make your best guess.',
      'Press the button to see your budget range. The result is an estimate for planning only. Real measurements, material choices, and a written review determine the actual price.'
    ]
  }
};
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const voiceGuideConfig=Object.freeze(source);
export function voiceGuideForPath(suffix){
 const g=source[suffix];
 if(!g)return '';
 const speech=[g.intro,...g.steps].join(' ');
 const ref='audio-guide-'+g.id;
 return '<section class="voice-guide" data-voice-guide="'+g.id+'" data-guide-speech="'+escape(speech)+'" aria-labelledby="'+ref+'-heading">'+
   '<div class="voice-guide-intro"><div class="voice-guide-copy"><span class="voice-guide-kicker">NEED A HAND?</span>'+
   '<h2 id="'+ref+'-heading">Let us talk you through it.</h2><p>'+escape(g.short)+'</p></div>'+
   '<button type="button" class="voice-guide-open" data-guide-open aria-expanded="false" aria-controls="'+ref+'-panel"><span aria-hidden="true">▶</span> Listen to instructions</button></div>'+
   '<div class="voice-guide-panel" id="'+ref+'-panel" hidden>'+
   '<div class="voice-guide-controls" aria-label="Spoken instructions controls">'+
   '<button type="button" data-guide-pause disabled>Pause</button>'+
   '<button type="button" data-guide-restart>Start again</button>'+
   '<button type="button" data-guide-close>Close guide</button></div>'+
   '<p class="voice-guide-status" data-guide-status role="status" aria-live="polite">Ready to listen.</p>'+
   '<details class="voice-guide-transcript"><summary>Read the step-by-step instructions</summary>'+
   '<p>'+escape(g.intro)+'</p><ol>'+g.steps.map(s=>'<li>'+escape(s)+'</li>').join('')+'</ol></details>'+
   '<p class="voice-guide-privacy">Read-aloud uses your device. No account or microphone is needed.</p></div></section>';
}
