(function () {
  'use strict';

  var projectToken = 'phc_v88R53LfS9cJbhZW7nfePhgNR2pZyv2U7uqHo8chm7gE';
  var consentKey = 'realitnyznalec_analytics_consent';
  var consentMaxAge = 180 * 24 * 60 * 60 * 1000;
  var production = location.protocol === 'https:' && location.hostname === 'realitnyznalec.sk';
  var consent = readConsent();
  var started = false;
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

  function cleanUrl(value) {
    if (typeof value !== 'string') return value;
    try {
      var url = new URL(value, location.origin);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin + url.pathname : '';
    } catch (e) { return ''; }
  }

  function cleanProperties(properties) {
    if (!properties || typeof properties !== 'object') return;
    Object.keys(properties).forEach(function (key) {
      if (/url$|referrer$/i.test(key)) properties[key] = cleanUrl(properties[key]);
      if (key === '$set' || key === '$set_once') cleanProperties(properties[key]);
    });
  }

  function enableCapture(ph) {
    if (!hasConsent()) {
      ph.opt_out_capturing({ clear_persistence: true });
      clearAnalyticsStorage();
      // SDK initialization can finish writing its consent marker after loaded().
      queueMicrotask(function () { if (!hasConsent()) clearAnalyticsStorage(); });
      return;
    }
    ph.opt_in_capturing({ captureEventName: null, enable_persistence: true });
    ph.capture('$pageview');
  }

  function startAnalytics() {
    if (!hasConsent()) return;
    if (started) {
      if (window.posthog && window.posthog.__loaded) enableCapture(window.posthog);
      return;
    }
    started = true;

    // The SDK is loaded only after explicit consent and only on the live domain.
      !(function (t, e) {
        var o, n, p, r;
        e.__SV ||
          ((window.posthog = e),
          (e._i = []),
          (e.init = function (i, s, a) {
            function g(t, e) {
              var o = e.split(".");
              (2 == o.length && ((t = t[o[0]]), (e = o[1])),
                (t[e] = function () {
                  t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                }));
            }
            (((p = t.createElement("script")).type = "text/javascript"),
              (p.crossOrigin = "anonymous"),
              (p.async = !0),
              (p.src =
                s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js"),
              (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r));
            var u = e;
            for (
              void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
                u.people = u.people || [],
                u.toString = function (t) {
                  var e = "posthog";
                  return ("posthog" !== a && (e += "." + a), t || (e += " (stub)"), e);
                },
                u.people.toString = function () {
                  return u.toString(1) + ".people (stub)";
                },
                o =
                  "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(
                    " ",
                  ),
                n = 0;
              n < o.length;
              n++
            )
              g(u, o[n]);
            e._i.push([i, s, a]);
          }),
          (e.__SV = 1));
      })(document, window.posthog || []);

    window.posthog.init(projectToken, {
      api_host: 'https://e.realitnyznalec.sk',
      ui_host: 'https://eu.posthog.com',
      defaults: '2026-05-30',
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: false,
      person_profiles: 'identified_only',
      cookie_expiration: 30,
      secure_cookie: true,
      cross_subdomain_cookie: false,
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      mask_all_element_attributes: true,
      mask_all_text: true,
      disable_session_recording: true,
      before_send: function (event) {
        if (!hasConsent()) return null;
        cleanProperties(event.properties);
        return event;
      },
      loaded: enableCapture,
    });
  }

  function choose(value) {
    var wasGranted = hasConsent();
    consent = value;
    try {
      localStorage.setItem(consentKey, JSON.stringify({ version: 1, value: value, updatedAt: Date.now() }));
    } catch (e) { /* The choice still applies to the current page. */ }
    if (value === 'granted') {
      if (!wasGranted) startAnalytics();
    } else {
      try {
        if (window.posthog && window.posthog.__loaded) window.posthog.opt_out_capturing({ clear_persistence: true });
      } catch (e) { /* A blocked SDK must not prevent withdrawal. */ }
      clearAnalyticsStorage();
    }
    if (panel) panel.hidden = true;
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    previousFocus = null;
  }

  function showConsentSettings() {
    if (!panel) return;
    previousFocus = document.activeElement;
    panel.hidden = false;
    panel.querySelector('[data-consent-deny]').focus();
  }

  function setupConsent() {
    var style = document.createElement('style');
    style.textContent = '.analytics-consent{position:fixed;z-index:1000;left:16px;right:16px;bottom:16px;max-width:760px;margin:auto;padding:22px;border:1px solid #c7d3e0;border-radius:16px;background:#fff;color:#16202e;box-shadow:0 8px 40px rgba(22,32,46,.2);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.analytics-consent[hidden]{display:none}.analytics-consent h2{font-size:19px;margin:0 0 8px}.analytics-consent p{margin:0 0 14px}.analytics-consent a{color:#0d3b66;text-decoration:underline}.analytics-consent-actions{display:flex;flex-wrap:wrap;gap:10px}.analytics-consent button{flex:1;min-height:44px;padding:10px 16px;border:1px solid #0d3b66;border-radius:8px;background:#fff;color:#0d3b66;font:inherit;font-weight:700;cursor:pointer}.analytics-consent button:hover{background:#f4f7fb}.analytics-consent button:focus-visible,.analytics-consent a:focus-visible{outline:3px solid #1d7a46;outline-offset:3px}@media(max-width:480px){.analytics-consent{left:10px;right:10px;bottom:10px;padding:18px;max-height:calc(100dvh - 20px);overflow:auto}.analytics-consent-actions{flex-direction:column}}';
    document.head.appendChild(style);
    panel = document.createElement('section');
    panel.className = 'analytics-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'analytics-consent-title');
    panel.innerHTML = '<h2 id="analytics-consent-title">Súkromie a cookies</h2><p>Analytické cookies používame iba s vaším súhlasom. Pomáhajú nám zistiť návštevnosť a používanie webu. Web funguje aj bez nich. Voľbu môžete kedykoľvek zmeniť v pätičke. <a href="/privacy.html">Viac o súkromí</a>.</p><div class="analytics-consent-actions"><button type="button" data-consent-deny>Odmietnuť analytiku</button><button type="button" data-consent-accept>Povoliť analytiku</button></div>';
    panel.hidden = consent !== null;
    document.body.appendChild(panel);
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
    if (panel) panel.hidden = consent !== null;
  });

  window.realitnyAnalytics = { hasConsent: hasConsent, showConsentSettings: showConsentSettings };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupConsent, { once: true });
  else setupConsent();
})();
