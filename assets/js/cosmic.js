/* ══════════════════════════════════════════════════════════════════════
   COSMIC CHAOS PRODUCTION — Main Script
   Hero slider · cursor follow · reveal · navbar
══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     1. NAVBAR scroll state
  ───────────────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─────────────────────────────────────────────────────────────────
     2. CURSOR follower (désactivé sur demande)
  ───────────────────────────────────────────────────────────────── */

  /* ─────────────────────────────────────────────────────────────────
     3. HERO SLIDER — before/after drag interaction
  ───────────────────────────────────────────────────────────────── */
  const hero = document.getElementById('hero');
  const handle = document.getElementById('hero-handle');
  const ctaLabel = document.querySelector('#hero-cta .hero-cta-label');
  const ctaLink = document.getElementById('hero-cta');

  if (hero && handle) {
    let isDragging = false;
    let position = 50; // % from left
    let navigating = false;
    let navTimer = null;

    const NAV_THRESHOLD_CINEMA = 10;   // pos <= 10% → navigate to cinema
    const NAV_THRESHOLD_MARKETING = 90; // pos >= 90% → navigate to marketing
    const NAV_DELAY = 450; // ms delay before navigation (smooth UX)

    const navigateTo = (url, universe) => {
      if (navigating) return;
      navigating = true;
      // Visual cue : full immersion
      document.body.classList.add(`navigating-${universe}`);
      hero.classList.add('hero-departing');
      navTimer = setTimeout(() => {
        window.location.href = url;
      }, NAV_DELAY);
    };

    const cancelNavigation = () => {
      if (!navigating) return;
      navigating = false;
      clearTimeout(navTimer);
      document.body.classList.remove('navigating-cinema', 'navigating-marketing');
      hero.classList.remove('hero-departing');
    };

    const setPosition = (pos) => {
      pos = Math.max(0, Math.min(100, pos));
      position = pos;
      hero.style.setProperty('--slider-pos', `${pos}%`);

      // Approche de la zone d'entrée — feedback visuel
      const inCinemaZone = pos <= NAV_THRESHOLD_CINEMA;
      const inMarketingZone = pos >= NAV_THRESHOLD_MARKETING;
      hero.classList.toggle('threshold-cinema', inCinemaZone);
      hero.classList.toggle('threshold-marketing', inMarketingZone);

      // Auto-nav au franchissement
      if (inCinemaZone) {
        navigateTo('cinema.html', 'cinema');
      } else if (inMarketingZone) {
        navigateTo('marketing.html', 'marketing');
      } else {
        cancelNavigation();
      }

      // CTA dynamique selon position
      if (pos < 50) {
        ctaLabel.textContent = "Entrer dans l'univers Cinéma";
        ctaLink.setAttribute('href', 'cinema.html');
        ctaLink.dataset.universe = 'cinema';
      } else {
        ctaLabel.textContent = "Entrer dans l'univers Marketing";
        ctaLink.setAttribute('href', 'marketing.html');
        ctaLink.dataset.universe = 'marketing';
      }
    };

    const getPositionFromEvent = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    };

    const startDrag = (e) => {
      isDragging = true;
      handle.classList.add('dragging');
      document.body.style.cursor = 'ew-resize';
      e.preventDefault();
    };
    const moveDrag = (e) => {
      if (!isDragging) return;
      setPosition(getPositionFromEvent(e));
    };
    const endDrag = () => {
      isDragging = false;
      handle.classList.remove('dragging');
      document.body.style.cursor = '';
    };

    // Mouse
    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', endDrag);

    // Touch
    handle.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', moveDrag, { passive: false });
    document.addEventListener('touchend', endDrag);

    // Click anywhere on hero to teleport handle
    hero.addEventListener('click', (e) => {
      // Don't teleport if clicking on the CTA or interactive elements
      if (e.target.closest('.hero-content a, .hero-content button, .hero-handle, .nav, .hero-scroll')) return;
      setPosition(getPositionFromEvent(e));
    });

    // Keyboard support
    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { setPosition(position - 4); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPosition(position + 4); e.preventDefault(); }
      if (e.key === 'Home') { setPosition(0); e.preventDefault(); }
      if (e.key === 'End') { setPosition(100); e.preventDefault(); }
    });

    // Initial state
    setPosition(50);

    // Subtle auto-sway animation when idle (first 6 seconds)
    let userInteracted = false;
    const markInteraction = () => { userInteracted = true; };
    handle.addEventListener('mousedown', markInteraction);
    handle.addEventListener('touchstart', markInteraction);
    hero.addEventListener('click', markInteraction);

    let swayStart = null;
    const sway = (t) => {
      if (userInteracted) return;
      if (!swayStart) swayStart = t;
      const elapsed = (t - swayStart) / 1000;
      if (elapsed > 6) return;
      // sin wave : amplitude reduces over time
      const amp = Math.max(0, 12 * (1 - elapsed / 6));
      const pos = 50 + Math.sin(elapsed * 1.4) * amp;
      hero.style.setProperty('--slider-pos', `${pos}%`);
      requestAnimationFrame(sway);
    };
    setTimeout(() => requestAnimationFrame(sway), 1200);
  }

  /* ─────────────────────────────────────────────────────────────────
     4. REVEAL on scroll (IntersectionObserver)
  ───────────────────────────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ─────────────────────────────────────────────────────────────────
     5. MOBILE BURGER (basic toggle)
  ───────────────────────────────────────────────────────────────── */
  const burger = document.getElementById('nav-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      // For now : just toggles a class. Mobile nav menu can be wired later.
      burger.classList.toggle('open');
      alert('Menu mobile en cours de finition. Pour l\'instant : Marketing / Cinéma / Réalisations / Journal / Contact.');
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     6. PREVENT TEXT SELECTION while dragging
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('selectstart', (e) => {
    if (document.body.style.cursor === 'ew-resize') e.preventDefault();
  });

})();
