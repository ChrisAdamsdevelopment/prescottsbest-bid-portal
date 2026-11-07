// Server-rendered shell: contents are populated client-side from on-device saved design choices.
export const inspirationPanel=(link,{compact=false}={})=>{
 const heading=compact?'Your saved design ideas':'My Design Inspiration List';
 const action=compact?'Send these ideas with my request':'Discuss my inspiration list';
 const url=link('/schedule')+'?preview=1&from=inspiration';
 return '<section class="site-section inspiration-list-panel'+(compact?' inspiration-list-compact':'')+'" id="my-inspiration-list" data-inspiration-list aria-labelledby="inspiration-list-title">'+
  '<div class="section-heading"><span class="kicker">SAVE IDEAS AS YOU EXPLORE</span><h2 id="inspiration-list-title">'+heading+'</h2>'+
  '<p>Tap <strong>Add to My Inspiration List</strong> on any kitchen, cabinet, wood, deck or hardware design. Your choices stay on this device until you decide to send them with a consultation request.</p></div>'+
  '<p class="inspiration-status" data-inspiration-status role="status" aria-live="polite">No ideas saved yet.</p>'+
  '<p data-inspiration-empty class="inspiration-empty">Your list is empty. Explore <a href="'+link('/kitchen-remodeling')+'">kitchen finishes</a>, <a href="'+link('/custom-cabinetry')+'">cabinetry and hardware</a>, or <a href="'+link('/deck-building-outdoor-carpentry')+'">decks</a> and tag the ideas you like.</p>'+
  '<ol class="inspiration-items" data-inspiration-items></ol>'+
  '<div class="site-actions inspiration-list-actions"><a href="'+url+'" class="site-button primary">'+action+'</a>'+
  '<button type="button" class="site-button outline" data-inspiration-clear hidden>Clear my list</button></div>'+
  '<p class="micro">Your list is stored only in this browser. Nothing is sent until you explicitly submit the consultation form or send its email draft. Inspiration visuals are not final product specifications or guaranteed designs.</p></section>';
};
export const inspirationSummary=(link)=>{
 return '<section class="inspiration-form-summary" data-inspiration-list aria-labelledby="form-inspiration-title">'+
 '<h3 id="form-inspiration-title">My saved inspiration ideas (<span data-inspiration-total>0</span>)</h3>'+
 '<p class="micro">You can edit or remove choices here before sending your project request. These are references, not a finalized order.</p>'+
 '<p class="inspiration-status" data-inspiration-status role="status" aria-live="polite">No ideas saved yet.</p>'+
 '<p data-inspiration-empty class="inspiration-empty">No ideas selected yet. <a data-inspiration-link href="'+link('/visual-design-preview')+'#my-inspiration-list">Explore and save design inspiration</a>.</p>'+
 '<ol class="inspiration-items" data-inspiration-items></ol>'+
 '<button type="button" class="site-button outline" data-inspiration-clear hidden>Clear my list</button>'+
 '</section>';
};
