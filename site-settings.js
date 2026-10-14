(function () {
  'use strict';

  // Keep privacy controls usable when the optional analytics-capture.js is blocked.
  var projectToken = 'phc_v88R53LfS9cJbhZW7nfePhgNR2pZyv2U7uqHo8chm7gE';
  var consentKey = 'realitnyznalec_analytics_consent';
  var consentMaxAge = 180 * 24 * 60 * 60 * 1000;
  var production = location.protocol === 'https:' && location.hostname === 'realitnyznalec.sk';
  var consent = readConsent();
  var analyticsLoading = false;
  var panel;
  var previousFocus;

  function readConsent() {
    try {
      var saved = JSON.parse(localStorage.getItem(consentKey));
      if (saved && saved.version === 1 && (saved.value === 'granted' || saved.value === 'denied') &&
          typeof saved.updatedAt === 'number' && saved.updatedAt <= Date.now() &&
          Date.now() - saved.updatedAt < consentMaxAge) return saved.value;
    } catch (e) { /* An unavailable preference store must not enable analytics. */ }
    return null;
  }

  function hasConsent() {
    return production && consent === 'granted';
  }

  function clearAnalyticsStorage() {
    var prefix = 'ph_' + projectToken;
    try {
      Object.keys(localStorage).forEach(function (key) {
        if (key.indexOf(prefix) === 0 || key === '__ph_opt_in_out_' + projectToken) localStorage.removeItem(key);
      });
      Object.keys(sessionStorage).forEach(function (key) {
        if (key.indexOf(prefix) === 0) sessionStorage.removeItem(key);
      });
    } catch (e) { /* Storage can be blocked by browser settings. */ }
    try {
      document.cookie.split(';').forEach(function (cookie) {
        var name = cookie.trim().split('=')[0];
        if (name.indexOf(prefix) !== 0 && name !== '__ph_opt_in_out_' + projectToken) return;
        ['', '; domain=' + location.hostname, '; domain=.' + location.hostname].forEach(function (domain) {
          document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax; Secure';
        });
      });
    } catch (e) { /* Cookies can be unavailable, including in local previews. */ }
  }

  function startAnalytics() {
    if (!hasConsent()) return;
    try {
      if (typeof window.realitnyAnalytics.startAnalytics === 'function') {
        window.realitnyAnalytics.startAnalytics();
      } else if (!analyticsLoading) {
        analyticsLoading = true;
        var script = document.createElement('script');
        script.src = '/analytics-capture.js';
        script.async = true;
        script.onload = function () { analyticsLoading = false; };
        script.onerror = function () {
          analyticsLoading = false;
          script.remove();
        };
        document.head.appendChild(script);
      }
    } catch (e) { /* Analytics is optional; preferences must always work. */ }
  }

  function updateConsentStatus() {
    panel.querySelector('[data-consent-status]').textContent = consent === 'granted'
      ? 'Analytika je aktuálne povolená.'
      : consent === 'denied' ? 'Analytika je aktuálne odmietnutá.' : 'Analytika čaká na váš súhlas.';
    document.querySelectorAll('[data-consent-open]').forEach(function (button) {
      button.setAttribute('aria-controls', panel.id);
      button.setAttribute('aria-expanded', String(!panel.hidden));
    });
  }

  function choose(value) {
    var wasGranted = hasConsent();
    consent = value;
    try {
      localStorage.setItem(consentKey, JSON.stringify({ version: 1, value: value, updatedAt: Date.now() }));
    } catch (e) { /* The choice still applies to the current page. */ }
    // Finish the user's action before starting any optional third-party code.
    if (panel) {
      panel.hidden = true;
      updateConsentStatus();
      updateConsentLayout();
    }
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    previousFocus = null;
    if (value === 'granted') {
      if (!wasGranted) startAnalytics();
    } else {
      try {
        if (window.posthog && window.posthog.__loaded) window.posthog.opt_out_capturing({ clear_persistence: true });
      } catch (e) { /* A blocked SDK must not prevent withdrawal. */ }
      clearAnalyticsStorage();
    }
  }

  function showConsentSettings() {
    if (!panel) return;
    previousFocus = document.activeElement;
    panel.hidden = false;
    updateConsentStatus();
    updateConsentLayout();
    panel.querySelector('[data-consent-deny]').focus();
  }

  // Keep optional cookies from covering keyboard controls. On short screens,
  // place the notice in normal flow so the entire page remains reachable.
  function updateConsentLayout() {
    if (!panel) return;
    var height = panel.hidden ? 0 : panel.getBoundingClientRect().height;
    var inline = height > window.innerHeight * 0.6;
    panel.classList.toggle('is-inline', inline);
    document.documentElement.style.setProperty('--analytics-consent-space',
      height && !inline ? (height + 32) + 'px' : '0px');
  }

  function revealFocusedControl(event) {
    if (!panel || panel.hidden || panel.contains(event.target)) return;
    var target = event.target;
    if (target.matches('input[type=radio]') && target.labels && target.labels[0]) target = target.labels[0];
    var rect = target.getBoundingClientRect();
    var header = document.querySelector('header');
    var top = header && getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().bottom + 8 : 8;
    var bottom = panel.classList.contains('is-inline') ? window.innerHeight - 8 : panel.getBoundingClientRect().top - 12;
    if (rect.bottom > bottom) window.scrollBy({ top: rect.bottom - bottom, behavior: 'instant' });
    else if (rect.top < top) window.scrollBy({ top: rect.top - top, behavior: 'instant' });
  }

  function setupConsent() {
    var style = document.createElement('style');
    style.textContent = '.analytics-consent{position:fixed;z-index:1000;left:16px;right:16px;bottom:16px;max-width:760px;margin:auto;padding:22px;border:1px solid #c7d3e0;border-radius:16px;background:#fff;color:#16202e;box-shadow:0 8px 40px rgba(22,32,46,.2);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.analytics-consent[hidden]{display:none}.analytics-consent h2{font-size:19px;margin:0 0 8px}.analytics-consent p{margin:0 0 14px}.analytics-consent a{color:#0d3b66;text-decoration:underline}.analytics-consent-actions{display:flex;flex-wrap:wrap;gap:10px}.analytics-consent button{flex:1;min-height:44px;padding:10px 16px;border:1px solid #0d3b66;border-radius:8px;background:#fff;color:#0d3b66;font:inherit;font-weight:700;cursor:pointer}.analytics-consent button:hover{background:#f4f7fb}.analytics-consent button:focus-visible,.analytics-consent a:focus-visible{outline:3px solid #1d7a46;outline-offset:3px}@media(max-width:480px){.analytics-consent{left:10px;right:10px;bottom:10px;padding:18px;max-height:calc(100dvh - 20px);overflow:auto}.analytics-consent-actions{flex-direction:column}}';
    style.textContent += 'html{scroll-padding-bottom:var(--analytics-consent-space,0px)}body{padding-bottom:var(--analytics-consent-space,0px)}.analytics-consent.is-inline{position:relative;left:auto;right:auto;bottom:auto;width:calc(100% - 32px);margin:16px auto;max-height:none;overflow:visible}';
    document.head.appendChild(style);
    panel = document.createElement('section');
    panel.id = 'site-consent-settings';
    panel.className = 'analytics-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'analytics-consent-title');
    panel.innerHTML = '<h2 id="analytics-consent-title">Súkromie a cookies</h2><p>Analytické cookies používame iba s vaším súhlasom. Pomáhajú nám zistiť návštevnosť a používanie webu. Web funguje aj bez nich. Voľbu môžete kedykoľvek zmeniť v pätičke. <a href="/privacy.html">Viac o súkromí</a>.</p><p data-consent-status role="status"></p><div class="analytics-consent-actions"><button type="button" data-consent-deny>Odmietnuť analytiku</button><button type="button" data-consent-accept>Povoliť analytiku</button></div>';
    panel.hidden = consent !== null;
    var main = document.querySelector('main');
    if (main) main.parentNode.insertBefore(panel, main);
    else document.body.appendChild(panel);
    updateConsentStatus();
    updateConsentLayout();
    if (typeof ResizeObserver === 'function') new ResizeObserver(updateConsentLayout).observe(panel);
    window.addEventListener('resize', function () {
      updateConsentLayout();
      var focused = document.activeElement;
      if (focused && focused.matches('a,button,input,select,textarea,summary')) {
        revealFocusedControl({ target: focused });
      }
    });
    document.addEventListener('focusin', revealFocusedControl);
    panel.querySelector('[data-consent-deny]').addEventListener('click', function () { choose('denied'); });
    panel.querySelector('[data-consent-accept]').addEventListener('click', function () { choose('granted'); });
    document.querySelectorAll('[data-consent-open]').forEach(function (button) {
      button.addEventListener('click', showConsentSettings);
    });
    if (location.hash === '#analytics-settings') showConsentSettings();
    if (hasConsent()) startAnalytics();
    else clearAnalyticsStorage();
  }

  // Withdrawal in another tab also stops this tab from sending events.
  window.addEventListener('storage', function (event) {
    if (event.key !== consentKey && event.key !== null) return;
    var previous = hasConsent();
    consent = readConsent();
    if (!hasConsent()) {
      try {
        if (window.posthog && window.posthog.__loaded) window.posthog.opt_out_capturing({ clear_persistence: true });
      } catch (e) { /* Analytics is optional. */ }
      clearAnalyticsStorage();
    } else if (!previous) startAnalytics();
    if (panel) {
      panel.hidden = consent !== null;
      updateConsentStatus();
      updateConsentLayout();
    }
  });

  window.addEventListener('hashchange', function () {
    if (location.hash === '#analytics-settings') showConsentSettings();
  });

  window.realitnyAnalytics = {
    hasConsent: hasConsent,
    showConsentSettings: showConsentSettings,
    clearAnalyticsStorage: clearAnalyticsStorage,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupConsent, { once: true });
  else setupConsent();
})();
