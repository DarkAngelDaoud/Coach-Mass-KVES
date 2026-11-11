/* © KVES · Coach-Mass-KVES */
var CACHE = 'coach-masse-v10';
var FILES = ['./', 'index.html', 'styles.css', 'app.js', 'avis-config.js', 'banner.jpg', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(FILES.map(function (f) { return c.add(new Request(f, { cache: 'reload' })).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== CACHE && n.indexOf('coach-masse-v') === 0; }).map(function (n) { return caches.delete(n); })); }).then(function () { return self.clients.claim(); }));
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

/* rappels : clic sur une notification, et vérification périodique (Chrome, quand il l'autorise) */
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cl) {
    if (cl.length) return cl[0].focus();
    return self.clients.openWindow('./index.html');
  }));
});
self.addEventListener('periodicsync', function (e) {
  if (e.tag !== 'cm-remind') return;
  e.waitUntil(caches.open('coach-masse-remind').then(function (c) {
    return c.match('remind.json').then(function (r) { return r ? r.json() : null; }).then(function (o) {
      if (!o || !o.on) return;
      var d = new Date(), n = d.getHours() * 60 + d.getMinutes(), t = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      function mins(s) { var m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; }
      var jobs = [];
      if (mins(o.w) !== null && n >= mins(o.w) && o.wd !== t && o.lw !== t) { o.lw = t; jobs.push(self.registration.showNotification('Coach-Mass-KVES', { body: 'Pèse-toi à jeun et note ton poids.', tag: 'cm-w', icon: 'icon-192.png', badge: 'icon-192.png' })); }
      if (mins(o.m) !== null && n >= mins(o.m) && o.md !== t && o.lm !== t) { o.lm = t; jobs.push(self.registration.showNotification('Coach-Mass-KVES', { body: 'Valide tes repas du jour.', tag: 'cm-m', icon: 'icon-192.png', badge: 'icon-192.png' })); }
      return Promise.all(jobs).then(function () { return c.put('remind.json', new Response(JSON.stringify(o))); });
    });
  }));
});
