/* ====================== événements ====================== */
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a !== 'reset') resetArmed = false;
  if (a !== 'delsession') delArmed = -1;
  if (a === 'tab') { tab = t.getAttribute('data-v'); render(); window.scrollTo(0, 0); return; }
  if (a === 'start') { startSession(); return; }
  if (a === 'energy') { log().energy = +t.getAttribute('data-n'); save(); render(); return; }
  if (a === 'water') { var l = log(); l.water = Math.max(0, (+l.water || 0) + +t.getAttribute('data-n')); save(); render(); return; }
  if (a === 'meal') { var lg = log(); lg.meals = lg.meals || []; lg.meals[+t.getAttribute('data-i')] = t.checked; save(); return; }
  if (a === 'adj') { P.kcalAdj += +t.getAttribute('data-v'); P.lastAdj = today(); save(); render(); return; }
  if (a === 'adjno') { P.lastAdj = today(); save(); render(); return; }
  if (a === 'measure') {
    var m = { date: today() }, any = false;
    ['bras', 'poitrine', 'taille', 'cuisse'].forEach(function (k) { var v = parseFloat(($('#m_' + k).value || '').replace(',', '.')); if (v) { m[k] = v; any = true; } });
    if (any) { D.measures.push(m); save(); render(); }
    return;
  }
  if (a === 'day') { var d = +t.getAttribute('data-d'), i = P.days.indexOf(d); if (i >= 0) P.days.splice(i, 1); else P.days.push(d); save(); render(); return; }
  if (a === 'range') { CH.range = +t.getAttribute('data-v'); render(); return; }
  if (a === 'exsel') { CH.ex = t.getAttribute('data-v'); render(); return; }
  if (a === 'testsnd') { unlockAudio(); play(t.getAttribute('data-v')); vib([100]); return; }
  if (a === 'delsession') {
    var di = +t.getAttribute('data-i');
    if (delArmed !== di) { delArmed = di; render(); return; }
    D.sessions.splice(di, 1); delArmed = -1; save(); render(); return;
  }
  if (a === 'animtoggle') {
    var card = t.closest('.card'), sv = card && card.querySelector('svg.anim');
    if (sv) {
      if (sv.getAttribute('data-mode') === 'loop') {
        sv.setAttribute('data-t', sv._t || 0); sv.setAttribute('data-mode', 'manual'); t.textContent = 'Animer';
        var rg = card.querySelector('[data-scrub]'); if (rg) rg.value = Math.round((sv._t || 0) * 100);
      } else { sv.setAttribute('data-origin', performance.now()); sv.setAttribute('data-mode', 'loop'); t.textContent = 'Figer'; }
    }
    return;
  }
  if (a === 'vibpow') { P.vibLevel = +t.getAttribute('data-v'); save(); render(); vib([40, 120, 40]); return; }
  if (a === 'testvib') {
    var vr = navigator.vibrate ? navigator.vibrate(vibScale([40, 150, 40, 150, 200])) : null;
    toast(!P.vib ? 'Les vibrations sont désactivées dans les réglages de l\'application.' : vr === null ? 'Ce navigateur ne gère pas la vibration.' : vr === false ? 'Chrome a bloqué la vibration. Touche l\'écran puis réessaie.' : 'Vibration envoyée. Rien senti ? Vérifie les réglages Android : Son et vibration > Vibrations et retour haptique.');
    return;
  }
  if (a === 'testvoice') { say('Je suis ton coach. Pas d\'excuses. On commence.'); beep(880, 150); vib([150]); return; }
  if (a === 'export') { exportData(); return; }
  if (a === 'import') { $('#importFile').click(); return; }
  if (a === 'reset') {
    if (!resetArmed) { resetArmed = true; render(); return; }
    bkSnap('avant', 'avant-reset-' + Date.now()); D = defaults(); P = D.profile; save(); applyTheme(); resetArmed = false; render(); return;
  }
  /* séance */
  if (!R) return;
  if (a === 'pause') {
    R.paused = !R.paused;
    if (R.paused) { R.remain = R.endAt - performance.now(); try { window.speechSynthesis.cancel(); } catch (e) {} }
    else R.endAt = performance.now() + R.remain;
    draw(); return;
  }
  if (a === 'quit') {
    if (!R.quit) { R.quit = true; draw(); setTimeout(function () { if (R && R.phase !== 'done') { R.quit = false; if (R.phase !== 'done') draw(); } }, 4000); return; }
    finish(true); return;
  }
  if (a === 'skip') { clearTimer(); if (R.phase === 'rest' || R.steps[R.i].k === 'warm') advance(); return; }
  if (a === 'plus') { R.endAt += 15000; R.remain += 15000; return; }
  if (a === 'begin') { work(); return; }
  if (a === 'stopwork') { stopWork(); return; }
  if (a === 'repp' || a === 'repm') {
    var lastLog = R.logs[R.logs.length - 1];
    if (lastLog) { lastLog.reps = Math.max(0, lastLog.reps + (a === 'repp' ? 1 : -1)); R.reps = lastLog.reps; setTxt('reps', lastLog.reps); }
    return;
  }
  if (a === 'closerun') { closeRunner(); return; }
});
document.addEventListener('input', function (ev) {
  var t = ev.target;
  if (t.hasAttribute && t.hasAttribute('data-av')) {
    var k = t.getAttribute('data-av');
    if (k === 'consent') AV.consent = t.checked; else AV[k] = t.value;
    if (k === 'msg') { var c = $('#av_cnt'); if (c) c.textContent = t.value.length + ' / 800'; }
    return;
  }
  if (!t.hasAttribute || !t.hasAttribute('data-scrub')) return;
  var card = t.closest('.card'), sv = card && card.querySelector('svg.anim');
  if (!sv) return;
  sv.setAttribute('data-mode', 'manual'); sv.setAttribute('data-t', String(t.value / 100));
  var b = card.querySelector('[data-act="animtoggle"]'); if (b) b.textContent = 'Animer';
});
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t.hasAttribute('data-log')) {
    var k = t.getAttribute('data-log'), v = t.value.replace(',', '.');
    var l = log();
    if (v === '') delete l[k]; else l[k] = parseFloat(v);
    save(); render(); return;
  }
  if (t.hasAttribute('data-set')) {
    var key = t.getAttribute('data-set');
    if (t.type === 'checkbox') P[key] = t.checked;
    else if (key === 'start') { if (/^\d{4}-\d{2}-\d{2}$/.test(t.value)) P[key] = t.value; }
    else { var n = parseFloat(t.value.replace(',', '.')); if (!isNaN(n)) P[key] = n; }
    if (key === 'rotate') applyRotate();
    save(); render(); return;
  }
  if (t.getAttribute('data-act') === 'meal') {
    var lg = log(); lg.meals = lg.meals || []; lg.meals[+t.getAttribute('data-i')] = t.checked; save();
  }
});
