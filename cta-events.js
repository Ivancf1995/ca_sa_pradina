/**
 * CTA click events for client landings (GA4).
 * Safe without gtag: no-ops until Analytics loads after consent.
 * Events: click_call (tel:), click_reserve (wa.me / explicit reserve).
 */
(function () {
  function send(name, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params || {});
  }

  function isReserveIntent(el, href) {
    if (el.getAttribute('data-cta') === 'reserve') return true;
    if (/wa\.me\//i.test(href)) return true;
    var text = (el.textContent || '').toLowerCase();
    return /reserv|cita|whatsapp|pedir cita/i.test(text);
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href) return;

      if (/^tel:/i.test(href)) {
        var reserveTel = isReserveIntent(a, href);
        send(reserveTel ? 'click_reserve' : 'click_call', {
          link_url: href,
          method: 'tel',
          location: a.getAttribute('data-cta-location') || undefined,
        });
        return;
      }

      if (/wa\.me\//i.test(href) || a.getAttribute('data-cta') === 'reserve') {
        send('click_reserve', {
          link_url: href,
          method: /wa\.me\//i.test(href) ? 'whatsapp' : 'other',
          location: a.getAttribute('data-cta-location') || undefined,
        });
      }
    },
    true
  );
})();
