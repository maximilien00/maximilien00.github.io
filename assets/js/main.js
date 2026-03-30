/* ===========================
   MAIN.JS – Portfolio Logic
=========================== */

(function () {
  'use strict';

  /* ── Particles / Matrix canvas ── */
  (function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコサシスセソ{}[]<>/\\|=+-*&#@!?ABCDEFabcdef'.split('');
    const COLS = 60;
    const drops = [];
    for (let i = 0; i < COLS; i++) drops[i] = Math.random() * -50;

    function drawMatrix() {
      ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.55)';
      ctx.font = '13px JetBrains Mono, monospace';

      const colW = W / COLS;
      for (let i = 0; i < COLS; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * colW;
        ctx.fillText(ch, x, drops[i] * 18);
        if (drops[i] * 18 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.4;
      }
    }

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      drawMatrix();
    }
    animate();

    // Pause when tab is hidden to save CPU
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(animId);
      else animate();
    });
  })();

  /* ── Reading progress bar ── */
  (function initProgress() {
    const bar = document.querySelector('.reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    }, { passive: true });
  })();

  /* ── Navbar scroll effect ── */
  (function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const links = document.querySelectorAll('.nav-links a[data-section]');
    const sections = document.querySelectorAll('section[id]');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      // Active link
      let current = '';
      sections.forEach(function (sec) {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      links.forEach(function (a) {
        a.classList.remove('active');
        if (a.dataset.section === current) a.classList.add('active');
      });
    }, { passive: true });

    // Mobile toggle
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        navLinks.classList.toggle('open');
      });
      // Close on link click
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          toggle.classList.remove('open');
          navLinks.classList.remove('open');
        });
      });
    }
  })();

  /* ── Typed text effect ── */
  (function initTyped() {
    const el = document.getElementById('typed-text');
    if (!el) return;
    const phrases = [
      'Ingénieur en Informatique',
      'Expert Cybersécurité',
      'Pentester & Ethical Hacker',
      'Développeur Full-Stack',
      'Security Researcher',
    ];
    let pi = 0, ci = 0, deleting = false, pause = 0;

    function tick() {
      const phrase = phrases[pi];
      if (!deleting) {
        el.textContent = phrase.slice(0, ci + 1);
        ci++;
        if (ci === phrase.length) { deleting = true; pause = 38; }
      } else {
        if (pause-- > 0) { setTimeout(tick, 60); return; }
        el.textContent = phrase.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; pause = 0; }
      }
      setTimeout(tick, deleting ? 40 : 80);
    }
    setTimeout(tick, 600);
  })();

  /* ── Intersection Observer – reveal & skill bars ── */
  (function initReveal() {
    const revealEls = document.querySelectorAll('.reveal, .timeline-item');
    if (!revealEls.length) return;

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { obs.observe(el); });

    // Skill bars
    const bars = document.querySelectorAll('.skill-bar-fill');
    const barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + '%';
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    bars.forEach(function (bar) { barObs.observe(bar); });
  })();

  /* ── Scroll-to-top button ── */
  (function initScrollTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  /* ── Counter animation for hero stats ── */
  (function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { obs.observe(el); });
  })();

  /* ── Contact form (client-side only) ── */
  (function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const success = form.querySelector('.form-success');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';
      setTimeout(function () {
        btn.style.display = 'none';
        if (success) { success.style.display = 'flex'; }
        form.reset();
      }, 1200);
    });
  })();

  /* ── Smooth anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
