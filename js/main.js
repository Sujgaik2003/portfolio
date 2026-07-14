/* ╔══════════════════════════════════════════════════════════╗
   ║  AJAY GARG — Portfolio • Main JavaScript                ║
   ║  Animations · Cursor · Scroll · Interactions            ║
   ╚══════════════════════════════════════════════════════════╝ */

(function () {
  'use strict';

  /* ─── DOM CACHE ─── */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  /* ─── PRELOADER ─── */
  const preloader = $('#preloader');
  const preloaderBar = $('#preloaderBar');
  const preloaderCount = $('#preloaderCount');

  let progress = 0;
  const preloaderInterval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress > 100) progress = 100;
    preloaderBar.style.width = progress + '%';
    preloaderCount.textContent = Math.round(progress);
    if (progress >= 100) {
      clearInterval(preloaderInterval);
      setTimeout(() => {
        preloader.classList.add('done');
        initAnimations();
      }, 400);
    }
  }, 60);


  /* ─── SCROLL PROGRESS ─── */
  const scrollBar = $('.scroll-progress span');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = pct + '%';
  }


  /* ─── NAVBAR SCROLL ─── */
  const nav = $('#nav');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }


  /* ─── ACTIVE NAV LINK ─── */
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');
  function updateActiveLink() {
    const scrollY = window.scrollY + 200;
    for (const sec of sections) {
      const top = sec.offsetTop;
      const h = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + h) {
        const id = sec.getAttribute('id');
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
        break;
      }
    }
  }


  /* ─── MOBILE MENU ─── */
  const toggle = $('#navToggle');
  const menu = $('#menu');
  const menuLinks = $$('.menu__link');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }


  /* ─── BACK TO TOP ─── */
  const toTop = $('#toTop');
  function updateBackToTop() {
    if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
  }
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* ─── REVEAL ON SCROLL (IntersectionObserver) ─── */
  function initReveal() {
    const reveals = $$('.reveal');
    if (!reveals.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay * 120);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }


  /* ─── SPLIT TEXT ANIMATION ─── */
  function initSplitText() {
    $$('[data-splittext]').forEach(el => {
      const text = el.textContent.trim();
      el.textContent = '';
      el.setAttribute('aria-label', text);
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        if (text[i] === ' ') {
          span.className = 'char char-space';
          span.innerHTML = '&nbsp;';
        } else {
          span.className = 'char';
          span.textContent = text[i];
        }
        span.style.animationDelay = (0.8 + i * 0.05) + 's';
        el.appendChild(span);
      }
    });
  }


  /* ─── COUNT-UP ANIMATION ─── */
  function initCountUp() {
    const counters = $$('[data-count]');
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const end = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.max(1, Math.floor(end / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= end) {
              current = end;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }


  /* ─── CUSTOM CURSOR ─── */
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    const cursor = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    const label = $('.cursor__label');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Cursor states
    const cursorLabels = {
      home: 'Home',
      view: 'View',
      write: 'Write',
      open: 'Open',
      pull: 'Explore'
    };

    $$('[data-cursor]').forEach(el => {
      const key = el.dataset.cursor;
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor--hover');
        if (cursorLabels[key]) label.textContent = cursorLabels[key];
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor--hover');
        label.textContent = '';
      });
    });

    // Also trigger on links and buttons
    $$('a, button').forEach(el => {
      if (el.dataset.cursor) return;
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor--hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor--hover');
      });
    });
  }


  /* ─── TILT EFFECT ─── */
  function initTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
        el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }


  /* ─── MAGNETIC BUTTONS ─── */
  function initMagnetic() {
    if (window.matchMedia('(hover: none)').matches) return;
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }


  /* ─── HERO SMART GALLERY ─── */
  function initGallery() {
    const gallery = $('#heroGallery');
    if (!gallery) return;
    const slides = $$('.gallery__slide', gallery);
    const dotsWrap = $('#galleryDots');
    const prevBtn = $('#galleryPrev');
    const nextBtn = $('#galleryNext');
    const n = slides.length;
    if (n <= 1) return;

    const DURATION = 5000;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idx = 0;
    let paused = false;
    let timer = null;

    // Build dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.className = 'gallery__dot' + (i === 0 ? ' is-active' : '');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + n);
      b.addEventListener('click', () => activate(i));
      dotsWrap.appendChild(b);
      return b;
    });

    function restartProgress() {
      gallery.classList.remove('is-playing');
      // force reflow so the animation restarts from 0
      void gallery.offsetWidth;
      if (!reduce && !paused) gallery.classList.add('is-playing');
    }

    function scheduleNext() {
      clearTimeout(timer);
      if (reduce || paused) return;
      timer = setTimeout(() => activate(idx + 1), DURATION);
    }

    function activate(i) {
      idx = (i + n) % n;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
      restartProgress();
      scheduleNext();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => activate(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => activate(idx + 1));

    // Pause on hover
    gallery.addEventListener('mouseenter', () => {
      paused = true;
      clearTimeout(timer);
      gallery.classList.add('is-paused');
    });
    gallery.addEventListener('mouseleave', () => {
      paused = false;
      gallery.classList.remove('is-paused');
      restartProgress();
      scheduleNext();
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { clearTimeout(timer); }
      else if (!paused) { restartProgress(); scheduleNext(); }
    });

    // Swipe support (touch)
    let startX = 0;
    gallery.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    gallery.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) activate(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // Kick off
    activate(0);
  }


  /* ─── YEAR IN FOOTER ─── */
  function setYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }


  /* ─── PARALLAX BLOBS ON SCROLL ─── */
  function updateBlobs() {
    const sy = window.scrollY;
    const blobs = $$('.blob');
    blobs.forEach((b, i) => {
      const speed = (i + 1) * 0.03;
      b.style.transform = `translateY(${sy * speed}px)`;
    });
  }


  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─── */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─── COMBINED SCROLL HANDLER ─── */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNav();
        updateActiveLink();
        updateBackToTop();
        updateBlobs();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ─── INIT ALL ANIMATIONS ─── */
  function initAnimations() {
    initSplitText();
    initReveal();
    initCountUp();
    initCursor();
    initTilt();
    initMagnetic();
    initGallery();
    setYear();
    // Initial state
    updateScrollProgress();
    updateNav();
    updateActiveLink();
    updateBackToTop();
  }

})();
