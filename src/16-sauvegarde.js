/* ====================== sauvegarde : copies automatiques, rappel, export, restauration ====================== */
/* Les copies automatiques sont gardées dans IndexedDB (autre espace que le stockage principal) : elles protègent
   contre une erreur (effacement, import raté, données abîmées), pas contre un « Effacer les données » de Chrome.
   Seul un fichier exporté hors du téléphone protège de tout : d'où le rappel régulier. */
var BK_LIST = null, BK_ARM = '', BK_DB = null, PERSIST = null;

function bkDb() {
  if (!BK_DB) BK_DB = new Promise(function (res, rej) {
    try {
      var q = indexedDB.open('coach-masse-bk', 1);
      q.onupgradeneeded = function () { q.result.createObjectStore('snaps', { keyPath: 'id' }); };
      q.onsuccess = function () { res(q.result); };
      q.onerror = function () { rej(q.error); };
    } catch (e) { rej(e); }
  });
  return BK_DB;
}
function bkTx(mode, fn) {
  return bkDb().then(function (db) {
    return new Promise(function (res, rej) {
      var tx = db.transaction('snaps', mode), out = fn(tx.objectStore('snaps'));
      tx.oncomplete = function () { res(out && out.result !== undefined ? out.result : undefined); };
      tx.onerror = tx.onabort = function () { rej(tx.error); };
    });
  });
}
function bkAll() { return bkTx('readonly', function (s) { return s.getAll(); }).then(function (a) { return (a || []).sort(function (x, y) { return x.at < y.at ? 1 : -1; }); }); }
function hasData(d) {
  if (!d) return false;
  var logs = d.logs || {};
  return !!((d.sessions && d.sessions.length) || (d.measures && d.measures.length) || Object.keys(logs).some(function (k) { return logs[k] && Object.keys(logs[k]).length; }));
}
function bkPrune() {
  return bkAll().then(function (all) {
    var keep = { auto: 7, avant: 4, corrompu: 2 }, n = {}, del = [];
    all.forEach(function (r) { n[r.kind] = (n[r.kind] || 0) + 1; if (n[r.kind] > (keep[r.kind] || 4)) del.push(r.id); });
    return Promise.all(del.map(function (id) { return bkTx('readwrite', function (s) { return s.delete(id); }); }));
  });
}
/* Prend la copie tout de suite (le texte est figé au moment de l'appel), l'écriture suit. */
function bkSnap(kind, id, json) {
  json = json || JSON.stringify(D);
  var d; try { d = JSON.parse(json); } catch (e) { if (kind !== 'corrompu') return Promise.resolve(); d = {}; }
  if (kind === 'auto' && !hasData(d)) return Promise.resolve();
  var rec = { id: id, kind: kind, at: new Date().toISOString(), sessions: (d.sessions || []).length, days: Object.keys(d.logs || {}).filter(function (k) { return d.logs[k] && Object.keys(d.logs[k]).length; }).length, json: json };
  return bkTx('readwrite', function (s) { return s.put(rec); }).then(bkPrune).then(bkRefresh).catch(function () {});
}
function bkRefresh() {
  return bkAll().then(function (a) { BK_LIST = a; if (tab === 'settings') render(); }).catch(function () { BK_LIST = false; });
}
function bkAuto() { return bkSnap('auto', 'auto-' + today()); }

/* données abîmées au démarrage : on garde le texte brut pour ne pas le perdre */
if (window.__cmCorrupt) {
  try { localStorage.setItem(KEY + '-corrompu', window.__cmCorrupt); } catch (e) {}
  bkSnap('corrompu', 'corrompu-' + Date.now(), window.__cmCorrupt);
}

/* validation d'un fichier importé */
function validData(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
  if (o.logs !== undefined && (typeof o.logs !== 'object' || o.logs === null || Array.isArray(o.logs))) return false;
  if (o.sessions !== undefined && !Array.isArray(o.sessions)) return false;
  if (o.measures !== undefined && !Array.isArray(o.measures)) return false;
  if (o.profile !== undefined && (typeof o.profile !== 'object' || o.profile === null || Array.isArray(o.profile))) return false;
  return !!(o.logs || o.sessions || o.profile);
}
function applyData(o, label) {
  bkSnap('avant', label + '-' + Date.now());
  D = normalize(o); P = D.profile; save(); applyTheme(); render();
}

/* export : partage de fichier (Drive, WhatsApp, e-mail...) ou téléchargement */
function bkMark() { P.bkLast = today(); save(); render(); toast('Sauvegarde créée.'); }
function exportData() {
  var txt = JSON.stringify({ coachMasse: VERSION, exportedAt: new Date().toISOString(), data: D });
  var name = 'coach-masse-sauvegarde-' + today() + '.json', file = null;
  function dl() {
    try {
      var b = new Blob([txt], { type: 'application/json' }), a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      bkMark();
    } catch (e) { toast('Export impossible sur cet appareil.'); }
  }
  try { file = new File([txt], name, { type: 'application/json' }); } catch (e) {}
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: 'Sauvegarde Coach Masse' }).then(bkMark).catch(function (e) { if (!e || e.name !== 'AbortError') dl(); });
  } else dl();
}
function bkDays() { return P.bkLast ? dnum(today()) - dnum(P.bkLast) : null; }
function bkDue() {
  var ev = P.bkEvery === undefined ? 7 : P.bkEvery;
  if (!ev || !hasData(D)) return false;
  var d = bkDays();
  if (d === null) return dnum(today()) - dnum(P.start) >= Math.min(ev, 3) || Object.keys(D.logs).filter(function (k) { return Object.keys(D.logs[k]).length; }).length >= 3;
  return d >= ev;
}
function bkBanner() {
  if (!bkDue()) return '';
  var d = bkDays();
  return '<div class="card"><h2>Sauvegarde conseillée</h2><p class="small">' + (d === null ? 'Tu n\'as encore jamais sauvegardé tes données hors du téléphone.' : 'Dernière sauvegarde il y a ' + d + ' jours.') + ' Envoie le fichier sur Drive ou à toi-même par WhatsApp : si le téléphone est perdu ou réinitialisé, tout disparaît.</p><button class="btn sm" data-act="bkexport">Sauvegarder maintenant</button></div>';
}
function bkCard() {
  if (BK_LIST === null) bkRefresh();
  var d = bkDays(), ev = P.bkEvery === undefined ? 7 : P.bkEvery;
  var h = '<div class="card"><h2>Sauvegarde</h2><p class="small">Dernière sauvegarde en fichier : <b>' + (d === null ? 'jamais' : d === 0 ? 'aujourd\'hui' : 'il y a ' + d + ' jours') + '</b>. Le fichier protège de tout, même d\'un téléphone perdu. La clé du propriétaire se sauvegarde à part (Plus > Espace propriétaire).</p>' +
    '<div class="row"><button class="btn sm grow" data-act="bkexport">Sauvegarder maintenant</button><button class="btn alt sm" data-act="import">Importer</button></div>' +
    '<label class="f">Me le rappeler</label><div class="seg">' + [[3, 'Tous les 3 j'], [7, '7 jours'], [14, '14 jours'], [0, 'Jamais']].map(function (x) { return '<button data-act="bkevery" data-v="' + x[0] + '" class="' + (ev === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>';
  h += '<h3>Copies automatiques sur ce téléphone</h3>';
  if (BK_LIST === false) h += '<p class="small">Indisponibles dans ce navigateur.</p>';
  else if (!BK_LIST || !BK_LIST.length) h += '<p class="small">Aucune pour le moment. Une copie est faite chaque jour d\'utilisation.</p>';
  else {
    var NAMES = { auto: 'Copie du jour', avant: 'Avant une action', corrompu: 'Données abîmées' };
    h += '<ul class="list">' + BK_LIST.map(function (r) {
      return '<li><span>' + esc((NAMES[r.kind] || r.kind) + ' · ' + r.at.slice(0, 10) + ' ' + r.at.slice(11, 16)) + '<br><span class="small">' + r.sessions + ' séances, ' + r.days + ' jours de suivi</span></span><button class="btn alt sm" data-act="bkrestore" data-id="' + esc(r.id) + '">' + (BK_ARM === r.id ? 'Confirmer' : 'Restaurer') + '</button></li>';
    }).join('') + '</ul><p class="small">Ces copies restent dans Chrome : elles disparaissent si tu effaces les données du site. Elles protègent d\'une erreur, pas d\'un téléphone perdu.</p>';
  }
  return h + '<p class="small">Stockage protégé contre le nettoyage automatique : <b>' + (PERSIST === true ? 'oui' : PERSIST === false ? 'non accordé' : 'inconnu') + '</b>.</p></div>';
}

document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'bkexport') { exportData(); return; }
  if (a === 'bkevery') { P.bkEvery = +t.getAttribute('data-v'); save(); render(); return; }
  if (a === 'bkrestore') {
    var id = t.getAttribute('data-id');
    if (BK_ARM !== id) { BK_ARM = id; render(); return; }
    BK_ARM = '';
    var rec = (BK_LIST || []).filter(function (r) { return r.id === id; })[0];
    try { var o = JSON.parse(rec.json); if (!validData(o)) throw 0; applyData(o, 'avant-restauration'); toast('Copie restaurée.'); } catch (e) { toast('Cette copie est illisible.'); render(); }
    return;
  }
  if (BK_ARM) { BK_ARM = ''; }
});
$('#importFile').addEventListener('change', function (ev) {
  var f = ev.target.files && ev.target.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function () {
    try {
      var o = JSON.parse(r.result);
      if (o && o.coachMasse && o.data) o = o.data;
      if (!validData(o)) throw 0;
      applyData(o, 'avant-import'); toast('Sauvegarde importée.');
    } catch (e) { toast('Fichier invalide : rien n\'a été modifié.'); }
  };
  r.readAsText(f);
  ev.target.value = '';
});
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') bkAuto(); });
setTimeout(bkAuto, 2500);
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(function (p) { PERSIST = p; if (tab === 'settings') render(); }); } catch (e) {}

