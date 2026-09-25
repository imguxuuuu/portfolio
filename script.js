/* ===================================================
   PORTFOLIO SCRIPT — Editorial Engineering Edition
   =================================================== */

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 700);
});

/* ── SMOOTH SCROLL (Lenis) ── */
let lenis;
const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (typeof Lenis !== 'undefined' && isPointerFine) {
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

/* ==========================================================
   CUSTOM CURSOR — data-cursor attribute driven
========================================================== */
(function () {
  const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isTouch) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursorEl = document.getElementById('cursor');
  if (!cursorEl) return;

  /* Position tracking with lerp */
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let curX    = targetX;
  let curY    = targetY;
  const LERP  = 0.12;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  /* Animation loop */
  (function animateCursor() {
    curX += (targetX - curX) * LERP;
    curY += (targetY - curY) * LERP;
    cursorEl.style.transform = `translate3d(${curX}px,${curY}px,0)`;
    requestAnimationFrame(animateCursor);
  })();

  /* Hide/show at page edges */
  document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; }, { passive: true });
  document.addEventListener('mouseenter', () => { cursorEl.style.opacity = '1'; }, { passive: true });

  /* State machine */
  function setCursorState(state) {
    cursorEl.classList.remove('state-nav', 'state-project');
    if (state) cursorEl.classList.add(`state-${state}`);
  }

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-cursor]');
    if (el) setCursorState(el.dataset.cursor);
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('[data-cursor]');
    if (el && !el.contains(e.relatedTarget)) setCursorState(null);
  }, { passive: true });
})();

/* ==========================================================
   HERO — Scroll-driven white → dark transition
========================================================== */
(function () {
  const heroSection    = document.getElementById('hero');
  const heroSticky     = document.getElementById('heroSticky');
  const heroPortrait   = document.getElementById('heroPortrait');
  const heroVignette   = document.getElementById('heroVignette');
  const heroDisplay    = document.getElementById('heroDisplay');
  const heroWordmark   = document.getElementById('heroWordmark');
  const wmPrefix       = document.getElementById('wmPrefix');
  const heroScrollHint = document.getElementById('heroScrollHint');
  const navbar         = document.getElementById('navbar');

  if (!heroSection || !heroSticky) return;

  /* Initial white state */
  heroSticky.style.background = '#ffffff';
  heroSticky.style.color      = '#000000';
  if (heroPortrait) heroPortrait.style.opacity = '0';
  navbar.classList.add('nav-light');

  /* Interpolate between two values */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* Convert 0–255 to hex */
  function toRgb(r, g, b) {
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
  }

  /* Easing — smoothstep */
  function smoothstep(t) { return t * t * (3 - 2 * t); }

  /* Track scroll progress — single master value drives entire composition */
  function updateHero() {
    /* Full transition completes within first ~300px of scroll (responsive) */
    const ANIM_PX = Math.min(Math.round(window.innerHeight * 0.3), 300);
    const rawT    = Math.max(0, Math.min(1, window.scrollY / ANIM_PX));
    const t       = smoothstep(rawT); /* eased 0 → 1 */

    /* ── Background: white → near-black ── */
    const bgVal = Math.round(lerp(255, 10, t));
    const bg    = toRgb(bgVal, bgVal, bgVal);
    heroSticky.style.background = bg;

    /* ── Text color: black → white (synchronised with background) ── */
    const textVal = Math.round(lerp(0, 255, t));
    heroSticky.style.color = toRgb(textVal, textVal, textVal);

    /* ── Wordmark: translate left + subtle scaleX narrowing ── */
    if (heroWordmark && wmPrefix) {
      const tx     = -(t * wmPrefix.offsetWidth);
      const scaleX = lerp(1, 0.93, t);
      heroWordmark.style.transformOrigin = 'left center';
      heroWordmark.style.transform =
        `translate3d(${tx.toFixed(1)}px,0,0) scaleX(${scaleX.toFixed(3)})`;
    }

    /* ── Portrait: emerge from the right, lag slightly behind background ── */
    if (heroPortrait) {
      const pT = smoothstep(Math.max(0, Math.min(1, (rawT - 0.08) / 0.72)));
      heroPortrait.style.opacity   = pT.toFixed(3);
      heroPortrait.style.transform =
        `translateX(${lerp(6, 0, pT).toFixed(2)}vw) scale(${lerp(1.05, 1, pT).toFixed(3)})`;
    }

    /* ── Vignette: gradient colour tracks background ── */
    if (heroVignette) {
      heroVignette.style.background = `
        linear-gradient(to right, ${bg} 0%, transparent 45%),
        linear-gradient(to top,   ${bg} 0%, transparent 55%)
      `;
    }

    /* ── Scroll hint: fade out quickly ── */
    if (heroScrollHint) {
      heroScrollHint.style.opacity = Math.max(0, 1 - rawT * 4).toFixed(2);
    }

    /* ── Navbar states ── */
    navbar.classList.toggle('nav-light', t < 0.5);
    navbar.classList.toggle('scrolled',  window.scrollY > 20);

    /* ── Hero state classes (used by buttons etc.) ── */
    heroSticky.classList.toggle('hero-dark',  t > 0.5);
    heroSticky.classList.toggle('hero-light', t <= 0.5);
  }

  /* Initial call */
  updateHero();

  window.addEventListener('scroll', updateHero, { passive: true });
  window.addEventListener('resize', updateHero, { passive: true });
})();

/* ── MOBILE NAV ── */
const navToggle    = document.getElementById('navToggle');
const navLinksList = document.querySelector('.nav-links');

function closeNavigation() {
  navLinksList.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinksList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeNavigation));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinksList.classList.contains('open')) {
    closeNavigation();
    navToggle.focus();
  }
});

/* ── NAVBAR: section color switching (non-hero sections) ── */
/* navbar var is declared inside hero IIFE — get reference here */
const navbarEl = document.getElementById('navbar');

document.querySelectorAll('section[id]:not(#hero)').forEach(s => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navbarEl.classList.toggle('nav-light', e.target.getAttribute('data-nav') === 'light');
    });
  }, { rootMargin: '-64px 0px -60% 0px' }).observe(s);
});

/* ── ACTIVE NAV HIGHLIGHT ── */
document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`)
        );
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});

/* ── HERO ENTRANCE (initial load) ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = [
    document.getElementById('heroEyebrow'),
    document.getElementById('heroDisplay'),
    document.getElementById('heroNameTag'),
    document.getElementById('heroBottomRow'),
    document.getElementById('heroSocials'),
    document.getElementById('heroScrollHint'),
  ].filter(Boolean);

  /* Start invisible */
  els.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
  });

  /* Stagger in after loader */
  const delay = 800;
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ delay: delay / 1000 });
    els.forEach((el, i) => {
      tl.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, i * 0.1);
    });
  } else {
    els.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'none';
      }, delay + i * 100);
    });
  }
})();

/* ── SCROLL REVEALS ── */
const revealEls = document.querySelectorAll('.reveal');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  /* Skip animation — show everything immediately */
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ── EXPERIENCE EXPAND / COLLAPSE ── */
document.querySelectorAll('[data-exp]').forEach(item => {
  item.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('[data-exp]').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('[data-magnetic]').forEach(btn => {
  let rect;
  btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
  btn.addEventListener('mousemove', (e) => {
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.28;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.28;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
    btn.style.transform  = '';
    setTimeout(() => { btn.style.transition = ''; }, 560);
  });
});

/* ── READING PROGRESS BAR ── */
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

/* ── BACK TO TOP ── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── GSAP SCROLL REVEALS (enhanced) ── */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  /* Skills — text list items stagger */
  document.querySelectorAll('.skill-text-list').forEach(list => {
    gsap.fromTo(list.querySelectorAll('li'),
      { opacity: 0, y: 8 },
      {
        opacity: 1, y: 0,
        duration: 0.35, stagger: 0.05, ease: 'power2.out',
        scrollTrigger: { trigger: list, start: 'top 88%', toggleActions: 'play none none none' },
      }
    );
  });

  /* Direction steps — stagger left-to-right reveal */
  const dirSteps = document.querySelectorAll('.dir-step');
  if (dirSteps.length) {
    gsap.fromTo(dirSteps,
      { opacity: 0, x: -18 },
      {
        opacity: 1, x: 0,
        duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.dir-steps', start: 'top 80%', toggleActions: 'play none none none' },
      }
    );
    dirSteps.forEach(s => { s.classList.remove('reveal'); s.classList.add('visible'); });
  }
}

/* ── PREFERS-REDUCED-MOTION ── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  /* Skip scroll animation — start in final dark composition */
  const heroSticky   = document.getElementById('heroSticky');
  const heroWordmark = document.getElementById('heroWordmark');
  const wmPrefix     = document.getElementById('wmPrefix');
  if (heroSticky) {
    heroSticky.style.background = '#0a0a0a';
    heroSticky.style.color      = '#ffffff';
  }
  if (heroWordmark && wmPrefix) {
    heroWordmark.style.transform = `translateX(${-wmPrefix.offsetWidth}px)`;
  }
  const portrait = document.getElementById('heroPortrait');
  if (portrait) portrait.style.opacity = '1';
}
