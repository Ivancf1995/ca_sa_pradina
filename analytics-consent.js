(function () {
  var CONSENT_KEY = 'csp_analytics_consent';
  var GA_ID = 'G-EEFDRBVZRY';

  function loadGoogleAnalytics() {
    if (window.__cspGaLoaded) return;
    window.__cspGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function hideBanner(banner) {
    if (banner) banner.hidden = true;
  }

  function showBanner() {
    var banner = document.getElementById('csp-cookie-banner');
    if (!banner) return;
    banner.hidden = false;

    var accept = document.getElementById('csp-cookie-accept');
    var reject = document.getElementById('csp-cookie-reject');

    if (accept) {
      accept.addEventListener('click', function () {
        try {
          localStorage.setItem(CONSENT_KEY, 'granted');
        } catch (e) {}
        hideBanner(banner);
        loadGoogleAnalytics();
      });
    }

    if (reject) {
      reject.addEventListener('click', function () {
        try {
          localStorage.setItem(CONSENT_KEY, 'denied');
        } catch (e) {}
        hideBanner(banner);
      });
    }
  }

  function initConsent() {
    var value = null;
    try {
      value = localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      value = null;
    }

    if (value === 'granted') {
      loadGoogleAnalytics();
      return;
    }
    if (value === 'denied') return;
    showBanner();
  }

  var revokeBtn = document.getElementById('csp-revoke-analytics');
  if (revokeBtn) {
    revokeBtn.addEventListener('click', function () {
      try {
        localStorage.setItem(CONSENT_KEY, 'denied');
      } catch (e) {}
      alert('Has revocado la analítica. Recarga la página para aplicar los cambios.');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsent);
  } else {
    initConsent();
  }
})();
