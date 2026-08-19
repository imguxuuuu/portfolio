/* ===================================================
   PORTFOLIO SCRIPT — Dark Luxury Edition
   =================================================== */

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 600);
});

/* ── 0. SMOOTH SCROLL (Lenis) ── */
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
  }
}

/* ── 1. CUSTOM CURSOR ── */
(function () {
  const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isTouch) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200;
  let dx = -200, dy = -200, dvx = 0, dvy = 0;
  let rx = -200, ry = -200, rvx = 0, rvy = 0;

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function tick() {
    /* dot — fast spring */
    dvx += (mx - dx) * 0.22; dvy += (my - dy) * 0.22;
    dvx *= 0.72;              dvy *= 0.72;
    dx  += dvx;               dy  += dvy;

    /* ring — slower spring with stretch */
    rvx += (mx - rx) * 0.1;  rvy += (my - ry) * 0.1;
    rvx *= 0.75;              rvy *= 0.75;
    rx  += rvx;               ry  += rvy;

    const speed   = Math.sqrt(rvx * rvx + rvy * rvy);
    const stretch = Math.min(speed * 0.04, 0.5);
    const angle   = Math.atan2(rvy, rvx) * (180 / Math.PI);
    const sx = 1 + stretch, sy = 1 - stretch * 0.4;

    dot.style.transform  = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) rotate(${angle}deg) scale(${sx},${sy})`;

    requestAnimationFrame(tick);
  }
  tick();

  /* Hover state */
  const sel = 'a,button,[data-magnetic],.tilt-card,.skill-tags span';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(sel)) document.body.classList.add('cursor-hover');
  }, { passive: true });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(sel)) document.body.classList.remove('cursor-hover');
  }, { passive: true });

  /* Click ripple */
  const style = document.createElement('style');
  style.textContent = '@keyframes c-ripple{to{width:56px;height:56px;opacity:0}}';
  document.head.appendChild(style);

  document.addEventListener('click', (e) => {
    const r = document.createElement('div');
    Object.assign(r.style, {
      position: 'fixed', left: e.clientX + 'px', top: e.clientY + 'px',
      width: '0', height: '0', borderRadius: '50%', pointerEvents: 'none',
      border: '1px solid rgba(255,255,255,0.22)', zIndex: '9995',
      transform: 'translate(-50%,-50%)', animation: 'c-ripple 0.55s ease-out forwards',
    });
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 560);
  }, { passive: true });
})();

/* ── 2. HERO CANVAS — Dark particle field ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [], W, H;
  let mouse = { x: -999, y: -999 };
  const SPEED = 0.26, DIST = 145;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    build();
  }
  function build() {
    nodes = [];
    const n = Math.min(58, Math.floor((W * H) / 19000));
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
        r: 0.8 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2,
        big: Math.random() > 0.8,
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.phase += 0.006;
      if (n.x < -10) n.x = W + 10; else if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10; else if (n.y > H + 10) n.y = -10;
      /* subtle mouse repulsion */
      const ex = n.x - mouse.x, ey = n.y - mouse.y;
      const ed = Math.sqrt(ex * ex + ey * ey);
      if (ed < 110 && ed > 0) {
        const f = ((110 - ed) / 110) * 0.35;
        n.vx += (ex / ed) * f; n.vy += (ey / ed) * f;
        n.vx *= 0.94;          n.vy *= 0.94;
      }
    });

    /* connections */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ex = nodes[i].x - nodes[j].x, ey = nodes[i].y - nodes[j].y;
        const d2 = ex * ex + ey * ey;
        if (d2 < DIST * DIST) {
          const d = Math.sqrt(d2);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(180,200,255,${(1 - d / DIST) * 0.09})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    /* nodes */
    nodes.forEach(n => {
      const p = 0.5 + 0.5 * Math.sin(n.phase);
      const r = n.big ? n.r * 1.7 : n.r;
      const a = n.big ? 0.14 + p * 0.11 : 0.07 + p * 0.06;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.2);
      g.addColorStop(0, `rgba(200,220,255,${a})`);
      g.addColorStop(1, `rgba(148,184,255,0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225,235,255,${a + 0.08})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();

/* ── 3. NAVBAR ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── 4. MOBILE NAV ── */
document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

/* ── 5. TYPING ANIMATION ── */
const roles = [
  'Embedded Systems Engineer',
  'PCB Design Engineer',
  'Nanotechnology Researcher',
  'Hardware Design Engineer',
  'IEEE Published Researcher',
];
let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-role');
function type() {
  const role = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = role.slice(0, ++cIdx);
    if (cIdx === role.length) { setTimeout(() => { deleting = true; }, 1800); setTimeout(type, 2100); return; }
  } else {
    typedEl.textContent = role.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 45 : 82);
}
setTimeout(type, 1400);

/* ── 6. HERO ENTRANCE ANIMATION ── */
(function () {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  /* split name into animated word spans */
  const parts = heroName.innerHTML.split('<br>');
  heroName.innerHTML = parts.map(part =>
    part.trim().split(/\s+/)
      .map(word => `<span class="word" style="display:inline-block;opacity:0;transform:translateY(36px);filter:blur(8px)">${word}</span>`)
      .join(' ')
  ).join('<br>');

  const words    = heroName.querySelectorAll('.word');
  const eyebrow  = document.querySelector('.hero-eyebrow');
  const roles    = document.querySelector('.hero-roles');
  const sub      = document.querySelector('.hero-sub');
  const actions  = document.querySelector('.hero-actions');
  const socials  = document.querySelector('.hero-socials');
  const heroLogo = document.querySelector('.hero-logo');
  const fadeEls  = [eyebrow, roles, sub, actions, socials].filter(Boolean);

  fadeEls.forEach(el => Object.assign(el.style, { opacity: '0', transform: 'translateY(20px)' }));
  if (heroLogo) Object.assign(heroLogo.style, { opacity: '0', transform: 'translateY(16px)' });

  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ delay: 1.3 });
    if (heroLogo) tl.to(heroLogo, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0);
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0)
      .to(words,   { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.75, stagger: 0.09, ease: 'power3.out' }, 0.12)
      .to(roles,   { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.6)
      .to(sub,     { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.72)
      .to(actions, { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, 0.82)
      .to(socials, { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, 0.9);
  } else {
    const animate = (el, delay) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease';
        el.style.opacity = '1'; el.style.transform = 'none'; el.style.filter = 'none';
      }, delay);
    };
    if (heroLogo) animate(heroLogo, 1300);
    words.forEach((w, i) => animate(w, 1400 + i * 90));
    fadeEls.forEach((el, i) => animate(el, 2000 + i * 100));
  }
})();

/* ── 7. SCROLL REVEALS ── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

  /* generic reveals */
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 36, filter: 'blur(5px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.72, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      }
    );
  });

  /* skill tags stagger */
  document.querySelectorAll('.skill-group').forEach(group => {
    gsap.fromTo(group.querySelectorAll('.skill-tags span'),
      { opacity: 0, y: 10, scale: 0.88 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.38, stagger: 0.045, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' },
      }
    );
  });

  /* timeline line draw */
  document.querySelectorAll('.timeline').forEach(tl => {
    gsap.fromTo(tl, { '--line-opacity': 0 }, {
      duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: tl, start: 'top 80%', toggleActions: 'play none none none' },
    });
  });

} else {
  /* fallback */
  const ro = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
}

/* ── 8. ACTIVE NAV HIGHLIGHT ── */
const secs     = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe(secs.length ? secs[0] : document.body);
secs.forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});

/* ── 9. MAGNETIC BUTTONS ── */
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  let rect;
  btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
  btn.addEventListener('mousemove', (e) => {
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.32;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.32;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
    btn.style.transform  = '';
    setTimeout(() => { btn.style.transition = ''; }, 560);
  });
});

/* ── 10. CARD TILT ── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    this.style.transition = 'border-color 0.3s, box-shadow 0.3s';
    this.style.transform  =
      `perspective(900px) rotateX(${y * -9}deg) rotateY(${x * 9}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', function () {
    this.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s';
    this.style.transform  = '';
    setTimeout(() => { this.style.transition = 'border-color 0.3s, box-shadow 0.3s'; }, 520);
  });
});

/* ── 11. HERO PARALLAX ── */
(function () {
  const content = document.querySelector('.hero-content');
  const cnv     = document.getElementById('hero-canvas');
  if (!content || !cnv) return;
  let ticking   = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      if (sy < window.innerHeight * 1.2) {
        content.style.transform = `translateY(${sy * 0.28}px)`;
        content.style.opacity   = String(Math.max(0, 1 - sy / (window.innerHeight * 0.55)));
        cnv.style.transform     = `translateY(${sy * 0.14}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
})();

/* ── 12. SECTION AMBIENT GLOW (subtle radial under headings) ── */
document.querySelectorAll('.section-title').forEach(title => {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
    width: '400px', height: '200px', pointerEvents: 'none', zIndex: '0',
    background: 'radial-gradient(ellipse at center, rgba(148,184,255,0.045) 0%, transparent 70%)',
  });
  const parent = title.parentElement;
  if (parent && getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
  title.insertAdjacentElement('beforebegin', glow);
});

/* ── 13. READING PROGRESS BAR ── */
(function () {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  function updateBar() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
})();

/* ── 14. BACK TO TOP ── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    if (lenis) { lenis.scrollTo(0, { duration: 1.2 }); }
    else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });
})();

/* ── 15. SECTION NUMBERS ── */
(function () {
  const labels = ['01', '02', '03', '04', '05', '06', '07'];
  document.querySelectorAll('.section-title').forEach((title, i) => {
    if (labels[i] === undefined) return;
    const num = document.createElement('span');
    num.className   = 'section-number';
    num.textContent = labels[i];
    title.insertAdjacentElement('beforebegin', num);
  });
})();

/* ── 16. CURSOR COLOUR SHIFT PER SECTION ── */
(function () {
  const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isTouch) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  const palette = {
    hero:         '#94b8ff',
    about:        '#94b8ff',
    experience:   '#7dd3a8',   /* green tint */
    education:    '#c4b0ff',   /* purple */
    publications: '#f4a261',   /* amber */
    skills:       '#94b8ff',
    projects:     '#60c8f5',   /* cyan */
    contact:      '#c4b0ff',
  };

  const style = document.createElement('style');
  document.head.appendChild(style);

  function setColor(color) {
    style.textContent = `
      #cursor-dot  { background: ${color} !important; }
      #cursor-ring { border-color: ${color} !important; }
    `;
  }
  setColor(palette.hero);

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        setColor(palette[id] || palette.hero);
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' })
  .observe
  && document.querySelectorAll('section[id]').forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setColor(palette[e.target.id] || palette.hero);
      });
    }, { rootMargin: '-35% 0px -55% 0px' }).observe(s);
  });
})();
