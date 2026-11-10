var CACHE = 'coach-masse-v4';
var FILES = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(FILES.map(function (f) { return c.add(new Request(f, { cache: 'reload' })); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== CACHE; }).map(function (n) { return caches.delete(n); })); }).then(function () { return self.clients.claim(); }));
});
/* Réseau d'abord (nouvelle version dès qu'internet est là), cache si hors ligne ou trop lent. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(new Promise(function (res) {
    var done = false;
    function give(r) { if (!done && r) { done = true; res(r); } }
    var timer = setTimeout(function () { caches.match(e.request).then(give); }, 3000);
    fetch(e.request).then(function (resp) {
      clearTimeout(timer);
      if (resp && resp.ok) { var copy = resp.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
      give(resp);
    }).catch(function () {
      clearTimeout(timer);
      caches.match(e.request).then(function (r) { return r || caches.match('index.html'); }).then(function (r) { if (r) give(r); else if (!done) { done = true; res(Response.error()); } });
    });
  }));
});
