!function(){"use strict";

  var endpoint = document.currentScript.getAttribute("data-api") || (new URL(document.currentScript.src).origin);
  var domain   = document.currentScript.getAttribute("data-domain");
  if (!domain) return console.warn("[analytics-g] Missing data-domain attribute");

  var API = endpoint + "/collect";

  // ---- Visitor ID (anonymous, persisted in localStorage) ----
  function vid() {
    var key = "_ag_vid";
    var id = localStorage.getItem(key);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
    return id;
  }

  // ---- Session state ----
  var sessionId = null;
  var currentPageviewId = null;
  var pageEnteredAt = null;

  // ---- UA detection (lightweight) ----
  function detect() {
    var ua = navigator.userAgent;
    var mobile = /Mobi|Android/i.test(ua);
    var tablet = /Tablet|iPad/i.test(ua);
    var device = tablet ? "Tablet" : mobile ? "Mobile" : "Desktop";

    var browser = "Unknown";
    if (/Firefox\//i.test(ua))       browser = "Firefox";
    else if (/Edg\//i.test(ua))      browser = "Edge";
    else if (/OPR\//i.test(ua))      browser = "Opera";
    else if (/Chrome\//i.test(ua))   browser = "Chrome";
    else if (/Safari\//i.test(ua))   browser = "Safari";

    var os = "Unknown";
    if (/Windows/i.test(ua))         os = "Windows";
    else if (/Mac OS/i.test(ua))     os = "macOS";
    else if (/Linux/i.test(ua))      os = "Linux";
    else if (/Android/i.test(ua))    os = "Android";
    else if (/iPhone|iPad/i.test(ua)) os = "iOS";

    return { device: device, browser: browser, os: os };
  }

  // ---- UTM params ----
  function utm() {
    var params = new URLSearchParams(window.location.search);
    var result = {};
    ["utm_source","utm_medium","utm_campaign"].forEach(function(k) {
      var v = params.get(k); if (v) result[k] = v;
    });
    return result;
  }

  // ---- Referrer (skip self) ----
  function referrer() {
    if (!document.referrer) return undefined;
    try {
      var ref = new URL(document.referrer);
      if (ref.hostname === window.location.hostname) return undefined;
      return ref.href;
    } catch(e) { return undefined; }
  }

  // ---- Send helpers ----
  function post(path, data) {
    var url = API + path;
    var body = JSON.stringify(data);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(body);
    }
  }

  // ---- Pageview ----
  function trackPageview() {
    sendDuration(); // flush previous page duration

    var info = detect();
    var utmParams = utm();
    var payload = {
      domain: domain,
      pathname: window.location.pathname,
      visitor_id: vid(),
      referrer: referrer()
    };

    // First pageview in session: attach metadata
    if (!sessionId) {
      payload.device = info.device;
      payload.browser = info.browser;
      payload.os = info.os;
      if (utmParams.utm_source)   payload.utm_source   = utmParams.utm_source;
      if (utmParams.utm_medium)   payload.utm_medium   = utmParams.utm_medium;
      if (utmParams.utm_campaign) payload.utm_campaign  = utmParams.utm_campaign;
    } else {
      payload.session_id = sessionId;
    }

    pageEnteredAt = Date.now();

    // Use XHR to get session_id back
    var xhr = new XMLHttpRequest();
    xhr.open("POST", API + "/pageview", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
        try {
          var res = JSON.parse(xhr.responseText);
          sessionId = res.session_id;
          currentPageviewId = res.pageview_id;
        } catch(e) {}
      }
    };
    xhr.send(JSON.stringify(payload));
  }

  // ---- Duration ----
  function sendDuration() {
    if (!sessionId || !currentPageviewId || !pageEnteredAt) return;
    var duration = Math.round((Date.now() - pageEnteredAt) / 1000);
    if (duration < 1) return;
    post("/duration", {
      session_id: sessionId,
      pageview_id: currentPageviewId,
      duration: duration
    });
    currentPageviewId = null;
    pageEnteredAt = null;
  }

  // ---- Custom events ----
  window.ag = function(name, props) {
    if (!sessionId) return console.warn("[analytics-g] No active session, call pageview first");
    post("/event", {
      domain: domain,
      visitor_id: vid(),
      session_id: sessionId,
      name: name,
      props: props || {}
    });
  };

  // ---- SPA support: listen to History changes ----
  var pushState = history.pushState;
  history.pushState = function() {
    pushState.apply(history, arguments);
    trackPageview();
  };
  window.addEventListener("popstate", trackPageview);

  // ---- Lifecycle ----
  window.addEventListener("beforeunload", sendDuration);
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") sendDuration();
  });

  // ---- Init ----
  trackPageview();

}();
