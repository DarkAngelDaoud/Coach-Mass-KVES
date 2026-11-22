/* © KVES · Coach-Mass-KVES */
var CACHE = 'coach-masse-v17-7';
/* Fichiers indispensables : tout est mis en cache ou rien (pas de mélange d'anciens et de nouveaux fichiers). */
var FILES = ['./', 'index.html', 'styles.css', 'theme-init.js', 'app.js', 'version.json', 'banner.jpg', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
var OPTIONAL = ['avis-config.js'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); })).then(function () {
      return Promise.all(OPTIONAL.map(function (f) { return c.add(new Request(f, { cache: 'reload' })).catch(function () {}); }));
    });
  }).catch(function (err) { return caches.delete(CACHE).then(function () { throw err; }); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== CACHE && n.indexOf('coach-masse-v') === 0; }).map(function (n) { return caches.delete(n); })); }).then(function () { return self.clients.claim(); }));
});
/* Mise à jour : la nouvelle version s'installe en attente. Elle ne remplace l'ancienne que si l'utilisateur accepte (message « skip »). */
self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.type === 'skip') { self.skipWaiting(); return; }
  if (d.type === 'info' && e.ports && e.ports[0]) {
    var port = e.ports[0];
    e.waitUntil(caches.open(CACHE).then(function (c) { return c.match('version.json'); }).then(function (r) { return r ? r.json() : {}; }).catch(function () { return {}; }).then(function (o) { port.postMessage({ version: o.version || '', notes: o.notes || [] }); }));
  }
});
/* Cache d'abord : l'application garde sa version tant que la mise à jour n'est pas acceptée (pas de mélange de fichiers). */
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin || /\/sw\.js$/.test(u.pathname)) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (r) {
      if (r) return r;
      return fetch(e.request).then(function (resp) {
        if (resp && resp.ok && e.request.mode !== 'navigate') { var copy = resp.clone(); c.put(e.request, copy); }
        return resp;
      }).catch(function () { return c.match('index.html').then(function (x) { return x || Response.error(); }); });
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
      var hh = d.getHours() + d.getMinutes() / 60, sl = -1;
      [10, 12, 14, 16, 18].forEach(function (x) { if (hh >= x && hh < 20.5) sl = x; });
      if (o.we && sl > 0 && o.le !== t + '#' + sl && (+o.ww || 0) < (+o.wt || 2500) * Math.max(0, Math.min(1, (sl - 8) / 13))) { o.le = t + '#' + sl; jobs.push(self.registration.showNotification('Coach-Mass-KVES', { body: 'Pense à boire : un verre d\'eau maintenant.', tag: 'cm-e', icon: 'icon-192.png', badge: 'icon-192.png' })); }
      return Promise.all(jobs).then(function () { return c.put('remind.json', new Response(JSON.stringify(o))); });
    });
  }));
});
