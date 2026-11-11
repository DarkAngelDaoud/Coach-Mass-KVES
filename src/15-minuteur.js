/* mini compteur et minuteur par exercice */
var MT = {}, MT_I = null;
function mt(id) { return MT[id] || (MT[id] = { c: 0, ms: 0, run: false, t0: 0, beeped: false }); }
function mtMs(m) { return m.ms + (m.run ? Date.now() - m.t0 : 0); }
function mtFmt(ms) { var s = Math.floor(ms / 1000); return pad(Math.floor(s / 60)) + ':' + pad(s % 60); }
function mtFind(id) { for (var i = 0; i < EX.length; i++) if (EX[i].id === id) return EX[i]; return null; }
function mtHtml(e, tgt) {
  var m = mt(e.id), id = e.id;
  return '<div class="mt">' + (e.timed ? '' :
    '<div class="mtrow"><button class="btn alt round" data-act="mtdec" data-id="' + id + '" aria-label="Moins une répétition">−</button><b class="mtv" id="mt_c_' + id + '">' + m.c + '</b><button class="btn round" data-act="mtinc" data-id="' + id + '" aria-label="Plus une répétition">+</button><span class="small grow">répétitions</span></div>') +
    '<div class="mtrow"><b class="mtv wide" id="mt_t_' + id + '">' + mtFmt(mtMs(m)) + '</b><button class="btn alt sm" id="mt_b_' + id + '" data-act="mttoggle" data-id="' + id + '">' + (m.run ? 'Pause' : 'Minuteur') + '</button><button class="btn alt sm" data-act="mtreset" data-id="' + id + '">Zéro</button>' + (e.timed ? '<span class="small">objectif ' + tgt + ' s</span>' : '') + '</div>' +
    '<button class="btn alt sm" data-act="mtsave" data-id="' + id + '">Enregistrer la série</button></div>';
}
function mtTick() {
  var any = false;
  Object.keys(MT).forEach(function (id) {
    var m = MT[id];
    if (!m.run) return;
    any = true;
    var n = $('#mt_t_' + id);
    if (n) n.textContent = mtFmt(mtMs(m));
    var e = mtFind(id);
    if (e && e.timed && !m.beeped) {
      var tg = e.hi + lv(id).off;
      if (mtMs(m) >= tg * 1000) { m.beeped = true; if (P.sound) play('setend'); vib([300, 100, 300]); toast('Objectif atteint : ' + tg + ' s'); }
    }
  });
  if (!any && MT_I) { clearInterval(MT_I); MT_I = null; }
}
function mtSave(id) {
  var e = mtFind(id), m = mt(id);
  if (!e) return;
  var L = lv(id), names = levelsFor(e), val = e.timed ? Math.round(mtMs(m) / 1000) : m.c;
  if (!(val > 0)) { toast(e.timed ? 'Lance le minuteur d\'abord.' : 'Compte au moins une répétition.'); return; }
  var s = null;
  D.sessions.forEach(function (x) { if (x.free && x.date === today()) s = x; });
  if (!s) { s = { date: today(), min: 0, sets: 0, partial: true, free: true, light: false, week: wkNo(), logs: [] }; D.sessions.push(s); }
  var sn = s.logs.filter(function (l) { return l.id === id; }).length + 1;
  s.logs.push({ id: id, name: names[Math.min(L.level, names.length - 1)], hi: e.hi + L.off, sn: sn, reps: val });
  s.sets = s.logs.length;
  m.c = 0; m.ms = 0; m.run = false; m.beeped = false;
  save(); render(); toast('Série enregistrée dans l\'historique : ' + val + (e.timed ? ' s' : ' répétitions'));
}

document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act'), id = t.getAttribute('data-id'), v = t.getAttribute('data-v');
  if (a === 'theme') { P.theme = v; save(); applyTheme(); render(); return; }
  if (a === 'shopdays') { P.shopDays = +v; save(); render(); return; }
  if (a === 'shopm3') { P.shopM3 = v; save(); render(); return; }
  if (a === 'shopm5') { P.shopM5 = v; save(); render(); return; }
  if (a === 'shopreset') { P.shopDone = {}; save(); render(); return; }
  if (a === 'shopcopy') { copyText(shopText()); return; }
  if (a === 'rmtest') {
    var go = function () { if (!sysNotify('Test : tes rappels fonctionnent.', 'cm-test')) toast('Notifications non autorisées sur cet appareil.'); else toast('Notification envoyée. Ferme l\'écran pour la voir.'); };
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission().then(go).catch(go); else go();
    return;
  }
  if (a.indexOf('mt') !== 0 || !id) return;
  unlockAudio();
  var m = mt(id), e = mtFind(id);
  if (a === 'mtinc' || a === 'mtdec') {
    m.c = Math.max(0, Math.min(999, m.c + (a === 'mtinc' ? 1 : -1)));
    var c = $('#mt_c_' + id); if (c) c.textContent = m.c;
    if (a === 'mtinc') { vib(15); if (P.sound) beep(m.c % 5 === 0 ? 990 : 660, 40); }
    return;
  }
  if (a === 'mttoggle') {
    if (m.run) { m.ms = mtMs(m); m.run = false; }
    else { m.t0 = Date.now(); m.run = true; if (!MT_I) MT_I = setInterval(mtTick, 250); }
    t.textContent = m.run ? 'Pause' : 'Minuteur';
    return;
  }
  if (a === 'mtreset') {
    m.ms = 0; m.run = false; m.c = 0; m.beeped = false;
    var tn = $('#mt_t_' + id), cn = $('#mt_c_' + id), bn = $('#mt_b_' + id);
    if (tn) tn.textContent = '00:00'; if (cn) cn.textContent = '0'; if (bn) bn.textContent = 'Minuteur';
    return;
  }
  if (a === 'mtsave') { if (m.run) { m.ms = mtMs(m); m.run = false; } mtSave(id); return; }
});
document.addEventListener('change', function (ev) {
  var t = ev.target, k;
  if (!t.getAttribute) return;
  if (t.hasAttribute('data-shop')) {
    k = t.getAttribute('data-shop'); P.shopDone = P.shopDone || {};
    if (t.checked) P.shopDone[k] = 1; else delete P.shopDone[k];
    save(); return;
  }
  k = t.getAttribute('data-rm');
  if (!k) return;
  if (k === 'on') { if (t.checked) rmEnable(); else { P.rmOn = false; save(); render(); } return; }
  if (hm(t.value) !== null) { if (k === 'w') P.rmW = t.value; else P.rmM = t.value; save(); render(); rmCheck(); }
});
setInterval(rmCheck, 30000);
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') rmCheck(); });
if (P.rmOn) { regPeriodic(); setTimeout(rmCheck, 1500); }


