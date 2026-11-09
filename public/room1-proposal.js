(() => {
 'use strict';
 const fmt=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value)||0);
 const text=(id,v)=>{const x=document.getElementById(id);if(x)x.textContent=v;};
 window.renderRoom1Proposal=(d,request,refresh)=>{
  const p=d?.proposal;
  if(!p||p.projectRef!=='PRELL-ROOM1-INDEPENDENT-BASELINE')return false;
  const before=(p.photos||[]).find(x=>x.kind==='before');
  const after=(p.photos||[]).find(x=>x.kind==='after');
  const root=document.createElement('div');
  root.className='prell-room1';
  root.innerHTML=`
    <section class="pr-hero" aria-labelledby="pr-title">
      <div class="pr-hero-copy">
        <div class="pr-kicker"><span class="pr-eyebrow">CUSTOM BUILT-INS</span><span class="pr-separator"></span> ROOM 01</div>
        <h1 id="pr-title">A room made for<br><em>the way you create.</em></h1>
        <p>A thoughtful sewing and storage space, beautifully integrated into your home.</p>
        <div class="pr-hero-pills"><span>Warm ivory cabinetry</span><span>Dark walnut desktop</span><span>Integrated lighting</span></div>
        <a class="pr-primary" href="#pr-design">Explore your design <span aria-hidden="true">↓</span></a>
      </div>
      <div class="pr-investment" aria-label="Proposed project investment">
       <div class="pr-eyebrow">YOUR ROOM 01 INVESTMENT</div>
       <strong id="pr-hero-price"></strong>
       <span>Complete cabinetry, desktop & installation</span>
       <div class="pr-price-rule"></div>
       <small>One room. One complete proposal.</small>
      </div>
    </section>
    <section class="pr-design" id="pr-design" aria-labelledby="pr-design-title">
     <div class="pr-section-title"><div><span class="pr-eyebrow">THE TRANSFORMATION</span><h2 id="pr-design-title">See your room come together.</h2></div><span class="pr-section-count">01 / DESIGN</span></div>
     <div class="pr-media-frame">
      <div class="pr-media-bar">
       <div class="pr-toggle" role="group" aria-label="View existing room or selected design">
        <button type="button" data-pr-view="after" aria-pressed="true">Your finished design</button>
        <button type="button" data-pr-view="before" aria-pressed="false">Your room today</button>
       </div>
       <span id="pr-image-meta">SELECTED DESIGN · ROOM 01</span>
      </div>
      <div class="pr-picture"><img id="pr-featured-photo" alt="" /></div>
      <div class="pr-photo-foot">
       <div><strong id="pr-photo-title">Warm ivory white + walnut</strong><span id="pr-photo-caption">A custom built-in designed around your sewing and storage needs.</span></div>
       <span class="pr-concept-tag" id="pr-photo-tag">DESIGN VISUALIZATION</span>
      </div>
     </div>
     <p class="pr-visual-caption">The selected design image is a visualization of the proposed finished space.</p>
    </section>
    <section class="pr-plan" id="pr-features" aria-labelledby="pr-plan-title">
      <div class="pr-section-title"><div><span class="pr-eyebrow">DESIGNED FOR YOUR ROUTINE</span><h2 id="pr-plan-title">Every detail has a purpose.</h2></div><span class="pr-section-count">02 / THE DETAILS</span></div>
      <div class="pr-features">
       <article><span class="pr-n">01</span><h3>Beautiful, built-in storage</h3><p>Two full-height ivory shaker cabinets with adjustable shelving and easy-access lower pull-out storage.</p></article>
       <article><span class="pr-n">02</span><h3>A generous sewing station</h3><p>A 60-inch dark walnut desktop with a completely open workspace and comfortable 36-inch chair opening.</p></article>
       <article><span class="pr-n">03</span><h3>Everything within reach</h3><p>Four smooth-gliding drawers, upper storage cabinets, soft-close hardware, and warm metal pulls.</p></article>
       <article><span class="pr-n">04</span><h3>Light where it matters</h3><p>Integrated warm task lighting, cleanly concealed cables, fitted crown and matching trim.</p></article>
      </div>
      <div class="pr-specs" aria-label="Design dimensions">
       <div><strong>108<span>″</span></strong><span>built-in width</span></div>
       <div><strong>60<span>″</span></strong><span>workstation</span></div>
       <div><strong>40<span>″</span></strong><span>open working height</span></div>
       <div><strong>2½ <span>days</span></strong><span>planned on-site installation</span></div>
      </div>
    </section>
    <section class="pr-price-section" id="pr-investment" aria-labelledby="pr-price-title">
     <div class="pr-section-title"><div><span class="pr-eyebrow">THE COMPLETE PROPOSAL</span><h2 id="pr-price-title">A beautiful room. A clear investment.</h2></div><span class="pr-section-count">03 / INVESTMENT</span></div>
     <div class="pr-price-layout">
      <div class="pr-scope-card">
       <div class="pr-eyebrow">WHAT IS INCLUDED</div>
       <h3>Your complete Room 1 package</h3>
       <ul class="pr-inclusions">
        <li>Custom-fabricated warm ivory shaker cabinetry</li>
        <li>Two tall storage towers with shelves and pull-outs</li>
        <li>Four-drawer base and upper storage cabinets</li>
        <li>Finished walnut-veneered desktop and supports</li>
        <li>Soft-close cabinetry hardware and warm metal pulls</li>
        <li>Concealed warm task lighting</li>
        <li>Crown, base, filler and scribe trim</li>
        <li>Delivery, two-person installation and final cleanup</li>
       </ul>
       <div class="pr-schedule"><strong>Installation plan</strong><span>Two-person crew · approximately 2½ standard workdays once the custom cabinetry is ready.</span></div>
      </div>
      <aside class="pr-total-card">
       <div class="pr-eyebrow">PROPOSED ROOM 01 TOTAL</div>
       <strong class="pr-total-amount" id="pr-total-amount"></strong>
       <p>Includes the complete design shown and professional installation.</p>
       <div class="pr-total-divider"></div>
       <div class="pr-total-row"><span>Custom room package</span><strong id="pr-subtotal"></strong></div>
       <div class="pr-total-row"><span>Additional rooms</span><strong>Not included</strong></div>
       <div class="pr-total-row pr-final-row"><span>Total investment</span><strong id="pr-grand-total"></strong></div>
       <a class="pr-primary pr-price-cta" href="#pr-review">Review this proposal <span aria-hidden="true">→</span></a>
      </aside>
     </div>
    </section>
    <section class="pr-review" id="pr-review" aria-labelledby="pr-review-title">
     <div class="pr-section-title"><div><span class="pr-eyebrow">READY WHEN YOU ARE</span><h2 id="pr-review-title">Let's bring your new space to life.</h2></div><span class="pr-section-count">04 / NEXT STEP</span></div>
     <div class="pr-review-columns">
      <div class="pr-review-copy">
        <p>This proposal covers the complete sewing and storage built-in for Room 1, using your selected ivory and walnut design. Other rooms are handled separately.</p>
        <p class="pr-legal">Recording your review shares your intent with Prescott's Best Construction. Work and payments begin only under a separately accepted written agreement.</p>
      </div>
      <div class="pr-review-form">
       <div id="pr-review-action">
        <label for="pr-review-name">Your name</label><input id="pr-review-name" type="text" maxlength="120" autocomplete="name" placeholder="Full name"/>
        <label class="pr-checkbox"><input type="checkbox" id="pr-review-confirm"/><span>I've reviewed this Room 1 proposal and would like to move forward with the next step.</span></label>
        <button type="button" class="pr-primary" id="pr-review-submit">Record my review <span aria-hidden="true">→</span></button>
       </div>
       <p id="pr-review-status" class="pr-inline-status" role="status" aria-live="polite"></p>
       <details class="pr-note">
        <summary>Have a note for our team?</summary>
        <label for="pr-note-text">Your message</label>
        <textarea id="pr-note-text" rows="3" maxlength="850" placeholder="Share a note about your project…"></textarea>
        <button type="button" id="pr-send-note">Send note</button>
        <p id="pr-note-status" class="pr-inline-status" role="status" aria-live="polite"></p>
       </details>
      </div>
     </div>
    </section>
    <div class="pr-mobile-dock"><span><small>ROOM 01 PROPOSAL</small><strong id="pr-mobile-price"></strong></span><a href="#pr-investment">View proposal <span aria-hidden="true">↑</span></a></div>
  `;
  document.body.classList.add('pr-mode');
  document.querySelector('#main').replaceChildren(root);
  for(const id of ['pr-hero-price','pr-total-amount','pr-subtotal','pr-grand-total','pr-mobile-price'])text(id,fmt(p.total));
  const image=document.getElementById('pr-featured-photo');
  const meta=document.getElementById('pr-image-meta');
  const title=document.getElementById('pr-photo-title');
  const caption=document.getElementById('pr-photo-caption');
  const tag=document.getElementById('pr-photo-tag');
  const controls=[...root.querySelectorAll('[data-pr-view]')];
  function show(which){
   const photo=which==='before'?before:after;
   if(!photo)return;
   image.src='/api/image/'+encodeURIComponent(photo.id);
   image.alt=which==='before'?'Existing sewing room before the proposed built-in installation':'Chosen warm ivory cabinetry with walnut sewing desktop, proposed finished design';
   meta.textContent=which==='before'?'YOUR ROOM TODAY · ROOM 01':'SELECTED DESIGN · ROOM 01';
   title.textContent=which==='before'?'The room you know':'Warm ivory white + walnut';
   caption.textContent=which==='before'?'Your existing room, ready for a more personal workspace.':'A custom built-in designed around your sewing and storage needs.';
   tag.textContent=which==='before'?'EXISTING ROOM':'DESIGN VISUALIZATION';
   controls.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.prView===which)));
  }
  controls.forEach(b=>b.addEventListener('click',()=>show(b.dataset.prView)));
  show(after?'after':'before');
  const submit=root.querySelector('#pr-review-submit');
  if(p.status==='customer_reviewed'){
   root.querySelector('#pr-review-action').replaceChildren();
   text('pr-review-status','Thank you. Your review has been recorded, and our team will follow up with the next step.');
  }else if(p.status==='sent'){
   submit.addEventListener('click',async()=>{
    const name=root.querySelector('#pr-review-name').value.trim();
    const checked=root.querySelector('#pr-review-confirm').checked;
    if(!name||!checked){text('pr-review-status','Enter your name and check the review statement to continue.');return;}
    submit.disabled=true;
    text('pr-review-status','Recording your review…');
    try{await request('approve',{name,confirm:true},d.csrf);await refresh();}
    catch(e){text('pr-review-status',e.message);submit.disabled=false;}
   });
  }else{
   root.querySelector('#pr-review-action').replaceChildren();
   text('pr-review-status','This proposal revision is no longer available for review.');
  }
  const sendNote=root.querySelector('#pr-send-note');
  sendNote.addEventListener('click',async()=>{
   const message=root.querySelector('#pr-note-text').value.trim();
   if(!message){text('pr-note-status','Enter a message first.');return;}
   sendNote.disabled=true;
   try{
    await request('question',{message},d.csrf);
    root.querySelector('#pr-note-text').value='';
    text('pr-note-status','Your message has been sent to the project team.');
   }catch(e){text('pr-note-status',e.message)}
   finally{sendNote.disabled=false}
  });
  return true;
 };
})();
