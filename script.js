/* ===================================================
   PORTFOLIO SCRIPT — Animations & Interactions
   =================================================== */

/* ── 1. HERO CANVAS — Silicon Atomic Lattice (fabrication theme) ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let nodes = [], W, H;
  const SPEED = 0.30;
  const CONNECT_DIST = 145;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initNodes();
  }

  function initNodes() {
    nodes = [];
    const count = Math.min(62, Math.floor((W * H) / 18000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        vx:    (Math.random() - 0.5) * SPEED,
        vy:    (Math.random() - 0.5) * SPEED,
        r:     1.2 + Math.random() * 2.0,
        phase: Math.random() * Math.PI * 2,
        big:   Math.random() > 0.78,   /* occasional larger "atom" */
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* update positions */
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -10) n.x = W + 10; else if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10; else if (n.y > H + 10) n.y = -10;
      n.phase += 0.008;
    });

    /* bonds — thin blue lines fading with distance */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < CONNECT_DIST * CONNECT_DIST) {
          const d = Math.sqrt(d2);
          const alpha = (1 - d / CONNECT_DIST) * 0.13;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,113,227,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    /* atoms — soft pulsing dots */
    nodes.forEach(n => {
      const pulse = 0.5 + 0.5 * Math.sin(n.phase);
      const r = n.big ? n.r * 1.7 : n.r;
      const alpha = n.big ? (0.18 + pulse * 0.14) : (0.10 + pulse * 0.08);
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.8);
      grad.addColorStop(0, `rgba(0,113,227,${alpha})`);
      grad.addColorStop(1, `rgba(0,113,227,0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      /* solid centre dot */
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,113,227,${alpha + 0.06})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();


/* ── 2. NAVBAR: become opaque on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


/* ── 3. MOBILE NAV TOGGLE ── */
document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
// Close on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});


/* ── 4. TYPING ANIMATION ── */
const roles = [
  'Embedded Systems Engineer',
  'EV Powertrain Specialist',
  'Nanotechnology Researcher',
  'Motor Control Engineer',
  'IEEE Published Researcher',
];
let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-role');

function type() {
  const role = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = role.slice(0, ++cIdx);
    if (cIdx === role.length) {
      setTimeout(() => { deleting = true; }, 1800);
      setTimeout(type, 2100);
      return;
    }
  } else {
    typedEl.textContent = role.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 45 : 80);
}
setTimeout(type, 600);


/* ── 5. SCROLL REVEAL (Intersection Observer) ── */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── 6. ACTIVE NAV LINK HIGHLIGHT on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--cyan)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
