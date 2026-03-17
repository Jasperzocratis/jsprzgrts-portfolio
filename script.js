/**
 * Belly Joe Portfolio - Vanilla JS
 * Handles: dark mode, mobile menu, smooth scroll
 */

(function () {
  'use strict';

  // ========== DOM refs ==========
  const themeToggle = document.getElementById('themeToggle');
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.navbar__nav');
  const navLinks = document.querySelectorAll('.navbar__link');
  const menuClose = document.getElementById('menuClose');

  // ========== Dark mode ==========
  const STORAGE_KEY = 'portfolio-theme';
  const ACCENT_KEY = 'portfolio-accent';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  const THEME_AUTO = 'auto';

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || THEME_LIGHT;
  }

  function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getSystemTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? THEME_DARK : THEME_LIGHT;
  }

  function resolveTheme(theme) {
    return theme === THEME_AUTO ? getSystemTheme() : theme;
  }

  function applyTheme(theme) {
    const effective = resolveTheme(theme);
    document.documentElement.setAttribute('data-theme', effective === THEME_DARK ? 'dark' : '');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', effective === THEME_DARK ? 'Switch to light mode' : 'Toggle dark mode');
    }

    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
      avatar.src = effective === THEME_DARK ? 'asset/img/mesleep.png' : 'asset/img/me.png';
    }
  }

  function toggleTheme() {
    const current = resolveTheme(getStoredTheme());
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setStoredTheme(next);
    applyTheme(next);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Init theme from storage or system preference
  (function initTheme() {
    const stored = getStoredTheme();
    const theme = stored || THEME_LIGHT;
    applyTheme(theme);
  })();

  // ========== Accent color ==========
  function getStoredAccent() {
    return localStorage.getItem(ACCENT_KEY) || '';
  }

  function setStoredAccent(hex) {
    localStorage.setItem(ACCENT_KEY, hex);
  }

  function applyAccent(hex) {
    if (!hex) return;
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--accent-hover', hex);
  }

  (function initAccent() {
    const stored = getStoredAccent();
    if (stored) applyAccent(stored);
  })();

  // ========== Mobile menu ==========
  function openMenu() {
    if (!nav) return;
    nav.classList.add('is-open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
    document.body.style.overflow = '';
  }

  function isMenuOpen() {
    return nav && nav.classList.contains('is-open');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (isMenuOpen()) closeMenu();
      else openMenu();
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  // Close menu when clicking outside the nav (mobile only)
  document.addEventListener('click', function (e) {
    if (!isMenuOpen()) return;
    if (!hamburger || !nav) return;
    if (!window.matchMedia || !window.matchMedia('(max-width: 1023px)').matches) return;

    const target = e.target;
    if (!(target instanceof Node)) return;
    if (nav.contains(target) || hamburger.contains(target)) return;
    closeMenu();
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 1023px)').matches) {
        closeMenu();
      }
    });
  });

  // Close menu on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen()) closeMenu();
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', function () {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      closeMenu();
    }
  });

  // ========== Smooth scroll (anchor links) ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    anchor.addEventListener('click', function (e) {
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========== Footer year ==========
  (function setFooterYear() {
    const yearEl = document.getElementById('footerYear');
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
  })();

  // ========== Charts: entry animations ==========
  (function initChartAnimations() {
    const chartsContainer = document.querySelector('.sidebar');
    if (!chartsContainer) return;

    // Trigger CSS animations on next frame so initial styles can apply
    window.requestAnimationFrame(function () {
      chartsContainer.classList.add('charts-animated');
    });
  })();

  // ========== Chart donut hover (tooltip + center text) ==========
  (function initChartDonutHover() {
    const wrap = document.querySelector('.chart-donut-wrap');
    const centerEl = document.getElementById('chartDonutCenter');
    const tooltipEl = document.getElementById('chartDonutTooltip');
    const segments = document.querySelectorAll('.chart-donut__segment');
    if (!wrap || !centerEl || !tooltipEl || !segments.length) return;

    segments.forEach(function (seg) {
      seg.addEventListener('mouseenter', function () {
        const label = seg.getAttribute('data-label') || '';
        const pct = seg.getAttribute('data-pct') || '';
        tooltipEl.textContent = label + ': ' + pct + '%';
        centerEl.textContent = pct + '%';
        wrap.classList.add('show-tooltip');
      });
      seg.addEventListener('mouseleave', function () {
        wrap.classList.remove('show-tooltip');
        centerEl.textContent = '72%';
      });
    });
  })();

  // ========== Theme customizer (right sidebar) ==========
  (function initThemeCustomizer() {
    const toggleBtn = document.getElementById('customizerToggle');
    const closeBtn = document.getElementById('customizerClose');
    const backdrop = document.getElementById('customizerBackdrop');
    const panel = document.getElementById('themeCustomizer');
    const accentInput = document.getElementById('accentColor');
    const rtlToggle = document.getElementById('rtlToggle');
    const radios = document.querySelectorAll('input[name="themeMode"]');

    if (!toggleBtn || !backdrop || !panel) return;

    function setOpen(open) {
      const next = Boolean(open);
      toggleBtn.setAttribute('aria-expanded', String(next));
      panel.classList.toggle('is-open', next);
      backdrop.classList.toggle('is-open', next);
      panel.setAttribute('aria-hidden', next ? 'false' : 'true');
      backdrop.setAttribute('aria-hidden', next ? 'false' : 'true');
      document.body.style.overflow = next ? 'hidden' : '';
    }

    function isOpen() {
      return panel.classList.contains('is-open');
    }

    toggleBtn.addEventListener('click', () => setOpen(!isOpen()));
    if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));
    backdrop.addEventListener('click', () => setOpen(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) setOpen(false);
    });

    // Sync UI from stored values
    const storedTheme = getStoredTheme();
    radios.forEach((r) => {
      r.checked = r.value === storedTheme;
    });

    const storedAccent = getStoredAccent();
    if (accentInput) {
      if (storedAccent) accentInput.value = storedAccent;
      accentInput.addEventListener('input', () => {
        const val = accentInput.value;
        applyAccent(val);
        setStoredAccent(val);
      });
    }

    if (rtlToggle) {
      rtlToggle.addEventListener('change', () => {
        document.documentElement.dir = rtlToggle.checked ? 'rtl' : 'ltr';
      });
    }

    radios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (!radio.checked) return;
        setStoredTheme(radio.value);
        applyTheme(radio.value);
      });
    });
  })();

  // ========== Preloader ==========
  (function initPreloader() {
    const preloader = document.getElementById('preloader');
    const percentEl = document.getElementById('preloaderPercent');
    if (!preloader) return;

    window.addEventListener('load', function () {
      // Animate percentage from 0 to 100 during the bar animation
      if (percentEl) {
        let start = null;
        const duration = 1600;

        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min(1, (timestamp - start) / duration);
          const value = Math.round(progress * 100);
          percentEl.textContent = value + '%';
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        }

        window.requestAnimationFrame(step);
      }

      setTimeout(function () {
        preloader.classList.add('preloader--hidden');
        setTimeout(function () {
          preloader.remove();
        }, 450);
      }, 1600);
    });
  })();

})();
