(function () {
  'use strict';

  var preferences = window.realitnyAnalytics;
  // Preferences remain usable even when this optional file is blocked.
  if (!preferences || !preferences.hasConsent()) return;
  var projectToken = 'phc_v88R53LfS9cJbhZW7nfePhgNR2pZyv2U7uqHo8chm7gE';
  var allowedEvents = ['$pageview', '$pageleave', 'phone_call_clicked', 'email_clicked',
    'whatsapp_clicked', 'contact_copied', 'faq_expanded', 'quote_requested',
    'cta_band_viewed', 'price_calculator_used', 'price_estimate_cta_clicked'];
  var started = false;

  function hasConsent() { return preferences.hasConsent(); }
  function clearAnalyticsStorage() { preferences.clearAnalyticsStorage(); }

  function cleanUrl(value) {
    if (typeof value !== 'string') return value;
    if (value === '' || value === '$direct') return value;
    try {
      var url = new URL(value, location.origin);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin + url.pathname : '';
    } catch (e) { return ''; }
  }

  function cleanProperties(properties, depth) {
    depth = depth || 0;
    if (!properties || typeof properties !== 'object' || depth > 8) return;
    Object.keys(properties).forEach(function (key) {
      if (/url$|referrer$/i.test(key)) properties[key] = cleanUrl(properties[key]);
      if (properties[key] && typeof properties[key] === 'object') cleanProperties(properties[key], depth + 1);
    });
  }

  function enableCapture(ph) {
    if (!hasConsent()) {
      try {
        ph.opt_out_capturing({ clear_persistence: true });
      } catch (e) { /* A blocked SDK must not prevent cleanup. */ }
      clearAnalyticsStorage();
      // SDK initialization can finish writing its consent marker after loaded().
      queueMicrotask(function () { if (!hasConsent()) clearAnalyticsStorage(); });
      return;
    }
    try {
      ph.opt_in_capturing({ captureEventName: null, enable_persistence: true });
      ph.capture('$pageview');
    } catch (e) { /* A blocked SDK must not affect privacy settings. */ }
  }

  function startAnalytics() {
    if (!hasConsent()) return;
    if (started) {
      if (window.posthog && window.posthog.__loaded) enableCapture(window.posthog);
      return;
    }
    started = true;
    try {
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
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_performance: false,
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
          if (!hasConsent() || allowedEvents.indexOf(event.event) === -1) return null;
          cleanProperties(event.properties);
          return event;
        },
        loaded: enableCapture,
      });
    } catch (e) {
      started = false;
    }
  }

  preferences.startAnalytics = startAnalytics;
  startAnalytics();
})();
