// Progressive enhancement for the original 20-photo PBC Crystal Creek gallery.
// Without JavaScript, the strip remains horizontally scrollable by touch, mouse or keyboard.
(() => {
  'use strict';
  for (const gallery of document.querySelectorAll('[data-project-gallery]')) {
    const track = gallery.querySelector('.real-gallery-track');
    const slides = [...gallery.querySelectorAll('.real-gallery-slide')];
    const previous = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    const status = gallery.querySelector('[data-gallery-status]');
    if (!track || !slides.length || !previous || !next || !status) continue;

    let index = 0;
    let scheduled = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const render = () => {
      status.textContent = 'Photo ' + (index + 1) + ' of ' + slides.length;
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };
    const jumpTo = newIndex => {
      index = Math.max(0, Math.min(slides.length - 1, newIndex));
      render();
      track.scrollTo({
        left: slides[index].offsetLeft - slides[0].offsetLeft,
        behavior: reduceMotion.matches ? 'instant' : 'smooth'
      });
    };

    previous.addEventListener('click', () => jumpTo(index - 1));
    next.addEventListener('click', () => jumpTo(index + 1));
    track.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      jumpTo(index + (event.key === 'ArrowRight' ? 1 : -1));
    });
    track.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        const position = track.scrollLeft;
        let closestIndex = index;
        let closestDistance = Infinity;
        slides.forEach((slide, i) => {
          const distance = Math.abs(position - (slide.offsetLeft - slides[0].offsetLeft));
          if (distance < closestDistance) {
            closestIndex = i;
            closestDistance = distance;
          }
        });
        index = closestIndex;
        render();
      });
    }, {passive:true});
    gallery.classList.add('is-ready');
    render();
  }
})();
