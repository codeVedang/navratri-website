const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const gentleEase = 'cubic-bezier(.22,1,.36,1)';
function enter(element, delay = 0, distance = 22) {
  if (!element || motionPreference.matches || !element.animate) return;
  element.getAnimations().forEach(animation => animation.cancel());
  element.animate([
    { opacity: 0, transform: `translateY(${distance}px)` },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 750, delay, easing: gentleEase, fill: 'backwards' });
}

document.querySelectorAll('.hero-copy > *').forEach((element, index) => enter(element, index * 80));
enter(document.querySelector('.hero-art'), 160, 30);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      enter(entry.target, Number(entry.target.dataset.motionDelay || 0));
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08 });
  document.querySelectorAll('.story-copy, .story-art, .section-heading, .night-feature, .purpose h2, .purpose > p, .venue > div, .film-copy, .film-frame, .passes > h2, .faq > div, .partners > div').forEach(element => revealObserver.observe(element));
  document.querySelectorAll('.gallery button, .contact-grid a').forEach((element, index) => {
    element.dataset.motionDelay = String((index % 3) * 100);
    revealObserver.observe(element);
  });
}

document.addEventListener('nightchange', () => {
  ['#night-date', '#night-title', '#night-description', '.night-note'].forEach((selector, index) => enter(document.querySelector(selector), index * 40, 12));
  const poster = document.querySelector('#night-image');
  if (!motionPreference.matches && poster.animate) {
    poster.getAnimations().forEach(animation => animation.cancel());
    poster.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' });
  }
});

const siteHeader = document.querySelector('header');
let scrollScheduled = false;
function updateHeader() { siteHeader.classList.toggle('is-scrolled', window.scrollY > 20); scrollScheduled = false; }
window.addEventListener('scroll', () => {
  if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateHeader); }
}, { passive: true });
updateHeader();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    const target = href === '#' ? document.documentElement : document.getElementById(href.slice(1));
    if (!target || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState(null, '', href);
    target.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'start' });
  });
});

motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) document.getAnimations().forEach(animation => animation.cancel());
});
