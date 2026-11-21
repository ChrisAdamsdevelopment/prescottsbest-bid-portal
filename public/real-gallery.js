// Accessible real-project comparison slider and on-page photo viewer.
// No frameworks, accounts, external embeds or tracking.
(()=>{
  for(const frame of document.querySelectorAll('[data-pbc-compare]')){
    const range=frame.querySelector('input[type="range"]');
    if(!range)continue;
    const update=()=>frame.style.setProperty('--compare',range.value+'%');
    range.addEventListener('input',update,{passive:true});
    update();
  }
  const viewer=document.querySelector('[data-pbc-lightbox]');
  if(!viewer||typeof viewer.showModal!=='function')return;
  const image=viewer.querySelector('img');
  const close=viewer.querySelector('[data-pbc-close]');
  if(!image||!close)return;
  const allowed=/^[a-z0-9-]{1,65}$/;
  document.querySelectorAll('[data-pbc-photo]').forEach(button=>{
    button.addEventListener('click',()=>{
      const id=button.getAttribute('data-pbc-photo')||'';
      if(!allowed.test(id))return;
      const original=button.querySelector('img');
      image.alt=original?.alt||'Real project photograph';
      image.src='/site-assets/real-gallery/'+id+'.webp';
      viewer.showModal();
      close.focus();
    });
  });
  close.addEventListener('click',()=>viewer.close());
  viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
  viewer.addEventListener('close',()=>{image.removeAttribute('src');});
})();
