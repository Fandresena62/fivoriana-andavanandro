// Ovay ity laharana ity isaky ny manova ny app (ohatra "v16") mba hohavaozina ny findainao.
var V = "v25";
var CACHE = "fivoriana-" + V;
var FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) {
        return Promise.all(ks
          .filter(function (k) { return k.indexOf("fivoriana-") === 0 && k !== CACHE; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

// Aloha tambajotra (mba hita foana ny kinova vaovao); raha tsy misy aterineto dia ny tahiry no ampiasaina.
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var u = new URL(req.url);
  if (u.origin !== location.origin) return; // tsy mikasika ny Worker/jw.org
  e.respondWith(
    fetch(req).then(function (r) {
      if (r && r.ok) {
        var cp = r.clone();
        caches.open(CACHE).then(function (c) { c.put(req, cp); });
      }
      return r;
    }).catch(function () {
      return caches.match(req).then(function (m) { return m || caches.match("./index.html"); });
    })
  );
});
