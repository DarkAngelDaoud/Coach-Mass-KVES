/* rappels */
function hm(s) { var m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; }
function mealsAllDone() { var c = (D.logs[today()] || {}).meals || []; return mealsList().every(function (_, i) { return c[i]; }); }
function rmDue() {
  var out = [];
  if (!P.rmOn) return out;
  var d = new Date(), n = d.getHours() * 60 + d.getMinutes(), w = hm(P.rmW), m = hm(P.rmM), l = D.logs[today()] || {};
  if (w !== null && n >= w && !l.weight && P.rmLw !== today()) out.push('w');
  if (m !== null && n >= m && !mealsAllDone() && P.rmLm !== today()) out.push('m');
  return out;
}
function syncRemind() {
  if (!window.caches || !P.rmOn) return;
  var l = D.logs[today()] || {};
  var o = { on: !!P.rmOn, w: P.rmW, m: P.rmM, wd: l.weight ? today() : '', md: mealsAllDone() ? today() : '', lw: P.rmLw || '', lm: P.rmLm || '' };
  caches.open('coach-masse-remind').then(function (c) { return c.put('remind.json', new Response(JSON.stringify(o))); }).catch(function () {});
}
function sysNotify(txt, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted' || !navigator.serviceWorker) return false;
  navigator.serviceWorker.ready.then(function (reg) { reg.showNotification('Coach Masse', { body: txt, tag: tag, icon: 'icon-192.png', badge: 'icon-192.png', vibrate: [200, 100, 200] }); }).catch(function () {});
  return true;
}
function rmNotify(kind) {
  var txt = kind === 'w' ? 'Pèse-toi à jeun et note ton poids.' : 'Valide tes repas du jour.';
  if (kind === 'w') P.rmLw = today(); else P.rmLm = today();
  save();
  if (document.visibilityState === 'visible') { toast('Rappel : ' + txt); vib([200, 100, 200]); } else sysNotify(txt, 'cm-' + kind);
}
function rmCheck() { rmDue().forEach(rmNotify); syncRemind(); }
function regPeriodic() {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.ready.then(function (reg) { if (reg.periodicSync) return reg.periodicSync.register('cm-remind', { minInterval: 3600000 }); }).catch(function () {});
}
function rmEnable() {
  P.rmOn = true; save();
  function go() { regPeriodic(); render(); rmCheck(); }
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(function (p) { if (p !== 'granted') toast('Notifications refusées : rappels seulement quand l\'application est ouverte.'); go(); }).catch(go);
  } else go();
}
function alarmHref(hhmm, msg) {
  var m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || '');
  if (!m) return '#';
  return 'intent:#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.alarm.HOUR=' + (+m[1]) + ';i.android.intent.extra.alarm.MINUTES=' + (+m[2]) + ';S.android.intent.extra.alarm.MESSAGE=' + encodeURIComponent(msg) + ';end';
}
function rmCard() {
  var np = 'Notification' in window ? Notification.permission : 'none';
  return '<div class="card"><h2>Rappels</h2><label class="meal"><input type="checkbox" data-rm="on"' + (P.rmOn ? ' checked' : '') + '><span><b>Rappels quotidiens</b><br><span class="small">Poids le matin, validation des repas le soir. Rien n\'est envoyé si c\'est déjà fait.</span></span></label>' +
    '<div class="grid2"><label class="f">Poids à<input type="time" data-rm="w" value="' + esc(P.rmW) + '"></label><label class="f">Repas à<input type="time" data-rm="m" value="' + esc(P.rmM) + '"></label></div>' +
    '<p class="small">' + (np === 'granted' ? 'Notifications autorisées. ' : np === 'denied' ? 'Notifications bloquées : autorise-les dans les réglages Android de Chrome. ' : np === 'none' ? 'Notifications non disponibles ici. ' : '') +
    'Application fermée, Android peut retarder ou ignorer le rappel. Pour être sûr de l\'heure, ajoute une alarme dans l\'Horloge.</p>' +
    '<div class="row"><button class="btn alt sm" data-act="rmtest">Tester</button><a class="btn alt sm linkbtn" href="' + alarmHref(P.rmW, 'Coach Masse : poids') + '">Alarme poids</a><a class="btn alt sm linkbtn" href="' + alarmHref(P.rmM, 'Coach Masse : repas') + '">Alarme repas</a></div>' +
    '<p class="small">Si le bouton Alarme n\'ouvre rien, ouvre l\'Horloge et crée une alarme quotidienne à la main.</p></div>';
}

