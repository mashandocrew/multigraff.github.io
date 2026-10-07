/* Multigraff — comportamiento compartido (sin dependencias).
   Nav, menú mobile accesible, dropdown de servicios, reveal one-shot y video diferido. */
(function () {
  'use strict';
  window.__siteReady = true;
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Nav: sombra al scrollear ── */
  var nav = document.getElementById('nav');
  if (nav) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle('scrolled', window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Menú mobile ── */
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');
  var closeBtn = document.getElementById('menuClose');
  if (toggle && menu) {
    var lastFocus = null;
    var focusables = function () {
      return Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])'));
    };
    var setClosedState = function () {
      menu.setAttribute('aria-hidden', 'true');
      if ('inert' in menu) menu.inert = true;
    };
    var openMenu = function () {
      lastFocus = document.activeElement;
      menu.classList.add('open');
      menu.removeAttribute('aria-hidden');
      if ('inert' in menu) menu.inert = false;
      toggle.setAttribute('aria-expanded', 'true');
      root.classList.add('menu-open');
      (closeBtn || focusables()[0]).focus();
    };
    var closeMenu = function (restoreFocus) {
      if (!menu.classList.contains('open')) return;
      menu.classList.remove('open');
      setClosedState();
      toggle.setAttribute('aria-expanded', 'false');
      root.classList.remove('menu-open');
      if (restoreFocus !== false) (lastFocus && lastFocus.focus ? lastFocus : toggle).focus();
    };
    setClosedState();
    toggle.addEventListener('click', function () {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { closeMenu(); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a[href]')) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960) closeMenu(false);
    });
  }

  /* ── Dropdown de servicios (desktop): click + teclado ── */
  Array.prototype.forEach.call(document.querySelectorAll('.nav__dropdown'), function (dd) {
    var btn = dd.querySelector('.nav__dropdown-toggle');
    if (!btn) return;
    var setOpen = function (open) {
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () { setOpen(!dd.classList.contains('open')); });
    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dd.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
    dd.addEventListener('focusout', function (e) {
      if (!dd.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target)) setOpen(false);
    });
  });

  /* ── Reveal one-shot ── */
  var srEls = document.querySelectorAll('.sr');
  if (!('IntersectionObserver' in window) || reduced) {
    Array.prototype.forEach.call(srEls, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    Array.prototype.forEach.call(srEls, function (el) { io.observe(el); });
  }

  /* ── Video diferido: se carga y reproduce solo al entrar en pantalla ── */
  Array.prototype.forEach.call(document.querySelectorAll('video[data-autoplay]'), function (v) {
    if (reduced || !('IntersectionObserver' in window)) return; /* queda con controles */
    v.removeAttribute('controls');
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function () { v.setAttribute('controls', ''); });
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    vio.observe(v);
  });
})();
