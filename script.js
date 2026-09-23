const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// "How it works" screen switcher.
const tabs = [...document.querySelectorAll('.tour__steps [role="tab"]')];
const panel = document.getElementById('tour-panel');
const tourImg = document.getElementById('tour-img');

function selectTab(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', tab.id);

  if (tourImg.getAttribute('src') === tab.dataset.src) return;
  const swap = () => {
    tourImg.src = tab.dataset.src;
    tourImg.alt = tab.dataset.alt;
    tourImg.classList.remove('is-fading');
  };
  if (reduceMotion) {
    swap();
  } else {
    tourImg.classList.add('is-fading');
    setTimeout(swap, 150);
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = tabs[(index + keys[event.key] + tabs.length) % tabs.length];
    next.focus();
    selectTab(next);
  });
});

// Warm the cache so switching screens doesn't flash.
tabs.forEach((tab) => { new Image().src = tab.dataset.src; });
