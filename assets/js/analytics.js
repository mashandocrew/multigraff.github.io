/* ── Multigraff: eventos personalizados para GA4 ──
   Requiere que gtag.js ya esté cargado (ver <head>).
   Cubre: clics en WhatsApp, clics en botones/CTA, llamadas, email y scroll depth. */
(function () {
  if (typeof window.gtag !== 'function') return;

  function locationOf(el) {
    var withId = el.closest('[id]');
    if (withId && withId.id) return withId.id;
    var section = el.closest('section, nav, footer, header');
    if (section) {
      var cls = (section.className || '').toString().trim().split(/\s+/)[0];
      return cls || section.tagName.toLowerCase();
    }
    return 'other';
  }

  function labelOf(el) {
    return (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60) || el.getAttribute('aria-label') || '';
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var location = locationOf(link);
    var label = labelOf(link);

    if (/^https?:\/\/(api\.)?wa\.me\//.test(href) || href.indexOf('wa.me') !== -1) {
      window.gtag('event', 'whatsapp_click', {
        button_location: location,
        button_text: label,
        link_url: href
      });
    } else if (href.indexOf('tel:') === 0) {
      window.gtag('event', 'phone_click', {
        button_location: location,
        link_url: href
      });
    } else if (href.indexOf('mailto:') === 0) {
      window.gtag('event', 'email_click', {
        button_location: location,
        link_url: href
      });
    } else if (link.classList.contains('btn') || link.classList.contains('btn-cmyk')) {
      window.gtag('event', 'cta_click', {
        button_location: location,
        button_text: label,
        link_url: href
      });
    }
  }, true);

  /* ── Scroll depth: hitos personalizados 25/50/75/100% ── */
  var firedMarks = {};
  var marks = [25, 50, 75, 100];

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.round((scrollTop / docHeight) * 100);
    marks.forEach(function (m) {
      if (pct >= m && !firedMarks[m]) {
        firedMarks[m] = true;
        window.gtag('event', 'scroll_depth', { percent_scrolled: m, page_path: location.pathname });
      }
    });
    if (firedMarks[100]) {
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
