/**
 * Scroll depth + section views for client landings (GA4).
 * Basic engagement metric: how far users scroll / which blocks they reach.
 *
 * Events (once per page load each):
 *   scroll_depth_25 / scroll_depth_50 / scroll_depth_75 / scroll_depth_90
 *     params: { percent_scrolled, engagement_time_msec }
 *   section_view  { section_id, section_name? }
 *
 * Safe without gtag: milestones queue until Analytics loads after consent.
 * Sections: section[id], [data-section], main > [id] (skip tiny chrome ids).
 *
 * Copy from portfolio/strategy/templates/ into each client repo.
 * Include in index.html next to cta-events.js (before or after analytics-consent.js).
 */
(function () {
  var THRESHOLDS = [25, 50, 75, 90];
  var SKIP_IDS = {
    top: 1,
    nav: 1,
    drawer: 1,
    'nav-mobile': 1,
    'nav-toggle': 1,
    'menu-btn': 1,
    'lang-btn': 1,
    'lang-menu': 1,
    'lang-select': 1,
    'cookie-banner': 1,
    'site-loader': 1,
    'loader-status': 1,
    'loader-progress': 1,
    year: 1,
    reel: 1,
  };

  var reached = {};
  var seenSection = {};
  var pendingDepth = [];
  var pendingSections = [];
  var flushTimer = null;

  function send(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
      return true;
    }
    return false;
  }

  function queueOrSend(name, params, pending) {
    if (send(name, params)) return;
    pending.push({ name: name, params: params });
  }

  function flush() {
    if (typeof window.gtag !== 'function') return;
    var i;
    for (i = 0; i < pendingDepth.length; i++) {
      send(pendingDepth[i].name, pendingDepth[i].params);
    }
    pendingDepth.length = 0;
    for (i = 0; i < pendingSections.length; i++) {
      send(pendingSections[i].name, pendingSections[i].params);
    }
    pendingSections.length = 0;
  }

  function markDepth(pct) {
    if (reached[pct]) return;
    reached[pct] = true;
    queueOrSend(
      'scroll_depth_' + pct,
      { percent_scrolled: pct, engagement_time_msec: Math.round(performance.now()) },
      pendingDepth
    );
  }

  function markSection(id, name) {
    if (!id || seenSection[id]) return;
    seenSection[id] = true;
    var params = { section_id: id };
    if (name) params.section_name = name;
    queueOrSend('section_view', params, pendingSections);
  }

  function docHeight() {
    var el = document.documentElement;
    var body = document.body;
    return Math.max(
      el ? el.scrollHeight : 0,
      body ? body.scrollHeight : 0,
      el ? el.offsetHeight : 0,
      body ? body.offsetHeight : 0
    );
  }

  function scrollPercent() {
    var el = document.documentElement;
    var scrollTop = window.scrollY || el.scrollTop || 0;
    var view = window.innerHeight || el.clientHeight || 0;
    var height = docHeight();
    if (height <= view) return 100;
    var maxScroll = height - view;
    if (maxScroll <= 0) return 100;
    return Math.min(100, Math.round((scrollTop / maxScroll) * 100));
  }

  function checkDepth() {
    var pct = scrollPercent();
    for (var i = 0; i < THRESHOLDS.length; i++) {
      if (pct >= THRESHOLDS[i]) markDepth(THRESHOLDS[i]);
    }
    flush();
  }

  function sectionLabel(node) {
    var custom = node.getAttribute('data-section');
    if (custom) return custom;
    var heading = node.querySelector('h1, h2, h3, [data-i18n]');
    if (heading) {
      var t = (heading.textContent || '').replace(/\s+/g, ' ').trim();
      if (t) return t.slice(0, 80);
    }
    return node.id;
  }

  function collectSections() {
    var nodes = document.querySelectorAll('section[id], [data-section]');
    var list = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var id = node.id || node.getAttribute('data-section');
      if (!id || SKIP_IDS[id]) continue;
      if (/cookie|banner|drawer|loader|lang/i.test(id)) continue;
      list.push(node);
    }
    return list;
  }

  function observeSections() {
    var sections = collectSections();
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: mark when section top crosses mid-viewport on scroll
      window.addEventListener(
        'scroll',
        function () {
          var mid = window.scrollY + (window.innerHeight || 0) * 0.35;
          for (var i = 0; i < sections.length; i++) {
            var rect = sections[i].getBoundingClientRect();
            var top = rect.top + window.scrollY;
            var bottom = top + rect.height;
            if (mid >= top && mid <= bottom) {
              markSection(sections[i].id || sections[i].getAttribute('data-section'), sectionLabel(sections[i]));
            }
          }
          flush();
        },
        { passive: true }
      );
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (!entry.isIntersecting) continue;
          var node = entry.target;
          var id = node.id || node.getAttribute('data-section');
          markSection(id, sectionLabel(node));
          io.unobserve(node);
        }
        flush();
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );

    for (var j = 0; j < sections.length; j++) {
      io.observe(sections[j]);
    }
  }

  function onScroll() {
    checkDepth();
  }

  function init() {
    var ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener('resize', checkDepth, { passive: true });
    observeSections();
    checkDepth();
    flushTimer = setInterval(flush, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
