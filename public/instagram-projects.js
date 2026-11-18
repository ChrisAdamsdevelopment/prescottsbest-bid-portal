// Visitor-initiated Instagram embeds for original, company-authored project posts.
// No remote media loads on page entry. No third-party SDK or general tracking script.
(() => {
  'use strict';
  const originals = Object.freeze({
    casings: {kind:'reel', id:'C1VllESr9tH', title:'Window casing preparation and joinery by Prescott’s Best Construction'},
    crystalPhotos: {kind:'p', id:'DV162KsgUxP', title:'Crystal Creek bathroom project photos from Prescott’s Best Construction'},
    crystalProgress: {kind:'reel', id:'DVR_JdVAWff', title:'Crystal Creek bathroom construction progress video'}
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('button.instagram-embed-load');
    if(!button)return;
    const key=button.dataset.instagramPost;
    const entry=Object.hasOwn(originals,key)?originals[key]:null;
    const target=button.closest('.real-media-card')?.querySelector('[data-instagram-target]');
    if(!entry||!target||target.dataset.instagramTarget!==key)return;
    if(target.querySelector('iframe'))return;

    const frame=document.createElement('iframe');
    frame.title=entry.title;
    frame.src='https://www.instagram.com/'+entry.kind+'/'+entry.id+'/embed/';
    frame.loading='lazy';
    frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.allow='fullscreen; picture-in-picture';
    frame.setAttribute('allowfullscreen','');
    frame.setAttribute('width','480');
    frame.setAttribute('height','580');
    target.append(frame);
    button.setAttribute('aria-expanded','true');
    button.textContent='Instagram post loaded below';
    button.disabled=true;
  });
})();
