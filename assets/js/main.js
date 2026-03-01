// ── Cycling hero word ──────────────────────────────────────────
const BLUE = '#007BFF';

const words = [
  { hero: 'FAITH',   tag1: 'faith',   through1: 'fitness', tag2: 'fitness', through2: 'faith'   },
  { hero: 'FITNESS', tag1: 'fitness', through1: 'faith',   tag2: 'faith',   through2: 'fitness' },
];

let current = 0;
let cycling = false;

const cycleEl  = document.getElementById('cycleWord');
const tagWord1 = document.getElementById('tagWord1');
const tagWord2 = document.getElementById('tagWord2');
const heroEl   = document.getElementById('hero');

cycleEl.style.color  = BLUE;
tagWord1.style.color = BLUE;
tagWord2.style.color = BLUE;

function doTransition() {
  if (cycling) return;
  cycling = true;

  const next = (current + 1) % words.length;
  const w    = words[next];

  // slide out upward
  cycleEl.style.transition = 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.5s ease';
  cycleEl.style.transform  = 'translateY(-110%)';
  cycleEl.style.opacity    = '0';

  setTimeout(() => {
    cycleEl.textContent      = w.hero;
    cycleEl.style.color      = BLUE;

    // jump to below with no transition
    cycleEl.style.transition = 'none';
    cycleEl.style.transform  = 'translateY(110%)';
    cycleEl.style.opacity    = '0';

    cycleEl.getBoundingClientRect(); // force reflow

    // slide in
    cycleEl.style.transition = 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.5s ease';
    cycleEl.style.transform  = 'translateY(0)';
    cycleEl.style.opacity    = '1';

    tagWord1.textContent  = w.tag1;
    tagWord2.textContent  = w.tag2;
    document.getElementById('tagThrough1').textContent = w.through1;
    document.getElementById('tagThrough2').textContent = w.through2;

    current = next;
    setTimeout(() => { cycling = false; }, 520);
  }, 520);
}

// ── Hover idle trigger ─────────────────────────────────────────
let idleTimer = null;

function startIdleTimer() {
  clearTimeout(idleTimer);
  clearInterval(idleTimer);
  idleTimer = setTimeout(() => {
    doTransition();
    idleTimer = setInterval(doTransition, 3500);
  }, 3000);
}

function resetTimer() {
  clearInterval(idleTimer);
  clearTimeout(idleTimer);
  idleTimer = null;
}

heroEl.addEventListener('mouseenter', startIdleTimer);
heroEl.addEventListener('mousemove',  startIdleTimer);
heroEl.addEventListener('mouseleave', resetTimer);

// Mobile fallback — auto start after 4s
setTimeout(() => {
  if (!idleTimer) {
    doTransition();
    setInterval(doTransition, 3500);
  }
}, 4000);

// ── Feature highlight tabs ─────────────────────────────────────
const hlTabs   = document.querySelectorAll('.hl-tab');
const hlPanels = document.querySelectorAll('.hl-panel');

hlTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = tab.dataset.index;
    hlTabs.forEach(t   => t.classList.remove('active'));
    hlPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.hl-panel[data-index="${idx}"]`).classList.add('active');
  });
});

// Auto-cycle tabs every 5s when section is in view
let hlTimer = null;
let hlCurrent = 0;
const hlObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      hlTimer = setInterval(() => {
        hlCurrent = (hlCurrent + 1) % hlTabs.length;
        hlTabs.forEach(t   => t.classList.remove('active'));
        hlPanels.forEach(p => p.classList.remove('active'));
        hlTabs[hlCurrent].classList.add('active');
        hlPanels[hlCurrent].classList.add('active');
      }, 5000);
    } else {
      clearInterval(hlTimer);
    }
  });
}, { threshold: 0.3 });
const hlSection = document.getElementById('highlights');
if (hlSection) hlObserver.observe(hlSection);

// Stop auto-cycle when user manually clicks a tab
hlTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    clearInterval(hlTimer);
    hlCurrent = parseInt(tab.dataset.index);
  });
});

// ── FAQ accordion ──────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // open clicked if it wasn't already open
    if (!isOpen) item.classList.add('open');
  });
});

// ── Fade in on scroll ──────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

// ── Email signup ───────────────────────────────────────────────
document.getElementById('signupBtn').addEventListener('click', () => {
  const input = document.getElementById('emailInput');
  const btn   = document.getElementById('signupBtn');
  const email = input.value.trim();
  if (email && email.includes('@')) {
    input.value = '';
    input.placeholder = "✓ You're on the list!";
    input.style.borderColor = '#00C9A7';
    btn.textContent = 'Done!';
    btn.style.background = '#00C9A7';
  } else {
    input.style.borderColor = '#ff4444';
    setTimeout(() => { input.style.borderColor = ''; }, 2000);
  }
});