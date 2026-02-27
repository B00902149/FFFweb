// ── Cycling hero word ──────────────────────────────────────────
const BLUE = '#007BFF';

const words = [
  { hero: 'FAITH',   tag1: 'fitness', tag2: 'faith'   },
  { hero: 'FITNESS', tag1: 'faith',   tag2: 'fitness' },
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

    tagWord1.textContent = w.tag1;
    tagWord2.textContent = w.tag2;

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