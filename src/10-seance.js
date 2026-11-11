/* ====================== séance guidée ====================== */
var R = null;
var runner = $('#runner');

function startSession() {
  var light = !!isLight(), w = wkNo();
  var plan = EX.map(function (e) {
    var L = lv(e.id), names = levelsFor(e), li = Math.min(L.level, names.length - 1);
    var base = (w <= 2 || !e.grow) ? 3 : 4;
    var step = e.timed ? 5 : 1;
    return { e: e, name: names[li], sets: Math.max(2, base - (light ? 1 : 0)), lo: e.lo + L.off, hi: e.hi + L.off, rest: e.rest + (+P.restBonus || 0), step: step };
  });
  var steps = [];
  WARM.forEach(function (x) { steps.push({ k: 'warm', label: x.l, sec: x.s, fig: x.fig, period: x.period }); });
  plan.forEach(function (p, i) { for (var s = 1; s <= p.sets; s++) steps.push({ k: 'set', pi: i, sn: s }); });
  R = { plan: plan, steps: steps, i: -1, phase: 'intro', t0: Date.now(), logs: [], light: light, paused: false, timer: null, endAt: 0, remain: 0, last: -1, count: 0, reps: 0, quit: false };
  runner.hidden = false; document.body.style.overflow = 'hidden';
  unlockAudio();
  wake();
  say(light ? 'Séance allégée aujourd\'hui. Échauffement.' : 'Séance. Échauffement d\'abord.');
  advance();
}

function clearTimer() { if (R) { if (R.timer) { clearInterval(R.timer); R.timer = null; } R.last = -1; } }
function setTimer(sec, onTick, onEnd, onFine) {
  clearTimer();
  R.endAt = performance.now() + sec * 1000; R.last = -1;
  R.timer = setInterval(function () {
    if (!R || R.paused) return;
    var rem = R.endAt - performance.now(), left = Math.ceil(rem / 1000);
    if (onFine) onFine(rem);
    if (left !== R.last) { R.last = left; onTick(Math.max(0, left)); }
    if (left <= 0) { clearTimer(); onEnd(); }
  }, 100);
}
function setTxt(id, t) { var n = $('#' + id); if (n) n.textContent = t; }

function cur() { return R.steps[R.i]; }
function advance() {
  clearTimer();
  R.i++;
  if (R.i >= R.steps.length) return finish(false);
  var s = cur();
  if (s.k === 'warm') {
    R.phase = 'warm'; draw();
    say(s.label);
    setTimer(s.sec, function (left) { setTxt('tmr', left); if (left > 0 && left <= 3) { play('count'); vib(40); } }, function () { play('chime'); vib([120]); flash(); advance(); });
  } else {
    prep();
  }
}

function setInfo() { var s = cur(), p = R.plan[s.pi]; return { s: s, p: p }; }
function prep() {
  var o = setInfo(), p = o.p, s = o.s;
  R.phase = 'prep'; R.count = 0; draw();
  var unit = p.e.timed ? p.hi + ' secondes' : p.hi + ' répétitions';
  say((s.sn === 1 ? 'Exercice : ' + p.name + '. ' : 'Série ' + s.sn + '. ') + unit + '. Position.');
  if (P.auto) {
    setTimer(6, function (left) { setTxt('tmr', left); if (left > 0 && left <= 3) { play('count'); vib(40); } }, work);
  }
}
function metroFn(totalSec, tempo, maxBeat) {
  return function (rem) {
    if (!P.metro) return;
    var h = Math.floor((totalSec * 1000 - rem) / (tempo * 500));
    if (h > R.beat && h <= maxBeat) { R.beat = h; if (h % 2 === 1) SND.up(); else SND.down(); }
  };
}
function work() {
  var o = setInfo(), p = o.p, tempo = Math.max(2, Math.round(+P.tempo || 3));
  clearTimer(); R.phase = 'work'; R.count = 0; R.beat = 0; draw();
  play('start'); vib([200]); flash();
  if (p.e.timed) {
    var half = Math.floor(p.hi / 2);
    setTimer(p.hi, function (left) {
      setTxt('tmr', left);
      var el = p.hi - left;
      if (left === half) { say('Tiens. Moitié.'); play('chime'); }
      else if (left === 10) { say('Dix secondes. Ne lâche pas.'); play('warn'); }
      else if (left > 3 && P.metro && el > 0 && el % 5 === 0) play('tick');
      if (left > 0 && left <= 3) { play('count'); vib(40); }
    }, function () { finishSet(p.hi); });
  } else if (P.count) {
    var total = p.hi * tempo;
    setTimer(total, function (left) {
      var c = Math.floor((total - left) / tempo);
      if (c > R.count && c <= p.hi) { R.count = c; setTxt('cnt', c); say(c === p.hi ? c + '. Terminé.' : String(c)); vib(30); }
    }, function () { finishSet(p.hi); }, metroFn(total, tempo, 2 * p.hi - 1));
  } else if (P.metro) {
    setTimer(900, function () {}, function () {}, metroFn(900, tempo, 99999));
  }
}
function stopWork() {
  var p = setInfo().p;
  if (p.e.timed) { var el = Math.max(0, p.hi - Math.max(0, R.last)); finishSet(el); }
  else finishSet(P.count ? R.count : p.hi);
}
function finishSet(reps) {
  var o = setInfo(), p = o.p;
  clearTimer();
  R.logs.push({ id: p.e.id, name: p.name, hi: p.hi, sn: o.s.sn, reps: reps });
  R.reps = reps;
  if (R.i + 1 >= R.steps.length) return finish(false);
  var nx = R.steps[R.i + 1], np = R.plan[nx.pi];
  play(nx.sn === 1 ? 'exend' : 'setend'); vib([300, 80, 300]); flash();
  R.phase = 'rest'; draw();
  say('Repos. Prochain : ' + (nx.sn === 1 ? np.name : 'série ' + nx.sn) + '. Sois honnête sur tes répétitions.');
  setTimer(p.rest, function (left) {
    setTxt('tmr', left);
    if (P.warn10 && left === 10 && p.rest > 15) { play('warn'); vib([60, 60, 60]); }
    if (left > 0 && left <= 3) { play('count'); vib(40); }
  }, function () { play(nx.sn === 1 ? 'newex' : 'go'); vib([100, 60, 100]); flash(); advance(); });
}

function finish(partial) {
  clearTimer();
  var min = Math.max(1, Math.round((Date.now() - R.t0) / 60000));
  var ups = [];
  if (!partial) ups = applyProgress(R.logs);
  if (R.logs.length) D.sessions.push({ date: today(), min: min, sets: R.logs.length, partial: !!partial, light: R.light, week: wkNo(), logs: R.logs });
  save();
  R.phase = 'done'; R.ups = ups; R.min = min; R.partial = partial;
  unwake(); drawDone();
  if (!partial) { play('fanfare'); say('Séance terminée. ' + min + ' minutes. Maintenant, tu manges.'); vib([300, 100, 300]); flash(); }
}
function applyProgress(logs) {
  var ups = [];
  EX.forEach(function (e) {
    var ss = logs.filter(function (s) { return s.id === e.id; });
    var need = R.plan.filter(function (p) { return p.e.id === e.id; })[0].sets;
    if (ss.length < need) return;
    var hi = ss[0].hi;
    if (ss.every(function (s) { return s.reps >= hi; })) {
      var L = lv(e.id), max = levelsFor(e).length - 1;
      if (L.level < max) { L.level++; L.off = 0; ups.push(levelsFor(e)[L.level]); }
      else { L.off += e.timed ? 5 : 2; ups.push(e.name + ' : objectif augmenté'); }
    }
  });
  return ups;
}

function closeRunner() {
  clearTimer(); unwake(); R = null; runner.hidden = true; document.body.style.overflow = '';
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
  render();
}

function draw() {
  var s = cur(), h = '', pr = Math.round(R.i / R.steps.length * 100);
  h += '<div class="rtop"><span class="small">' + (s.k === 'warm' ? 'Échauffement' : 'Exercice ' + (s.pi + 1) + '/' + R.plan.length + ' · série ' + s.sn + '/' + R.plan[s.pi].sets) + '</span>' +
    '<span class="row"><button class="btn alt sm" data-act="pause">' + (R.paused ? 'Reprendre' : 'Pause') + '</button><button class="btn alt sm" data-act="quit">' + (R.quit ? 'Confirmer' : 'Quitter') + '</button></span></div>';
  h += '<div class="bar"><i style="width:' + pr + '%"></i></div>';
  if (s.k === 'warm') {
    h += '<div class="rbody"><div class="rl"><p class="title">' + esc(s.label) + '</p><div class="draw">' + animSvg(s.fig, R.paused ? 'hold' : 'loop', s.period) + '</div></div><div class="rr"><div class="big" id="tmr">' + s.sec + '</div><p class="sub">secondes</p><button class="btn alt" data-act="skip">Passer</button></div></div>';
  } else {
    var p = R.plan[s.pi], e = p.e, unit = e.timed ? 'secondes' : 'répétitions';
    var ds = R.phase === 'rest' && R.steps[R.i + 1] ? R.plan[R.steps[R.i + 1].pi] : p;
    h += '<div class="rbody"><div class="rl"><p class="title">' + esc(ds.name) + '</p><div class="draw">' + animSvg(ds.e.id, (R.paused || ds.e.timed) ? 'hold' : 'loop', Math.max(2, +P.tempo || 3)) + '</div></div><div class="rr">';
    if (R.phase === 'prep') {
      h += '<p class="sub">Vise ' + p.hi + ' ' + unit + (e.timed ? '' : ' (minimum ' + p.lo + ')') + '</p>';
      h += P.auto ? '<div class="big" id="tmr">6</div><p class="sub">Prépare-toi</p><button class="btn go" data-act="begin">Commencer maintenant</button>' : '<button class="btn go" data-act="begin">Commencer</button>';
    } else if (R.phase === 'work') {
      if (e.timed) h += '<div class="big pulse" id="tmr">' + p.hi + '</div><p class="sub">secondes à tenir</p>';
      else if (P.count) h += '<div class="big pulse" id="cnt">0</div><p class="sub">sur ' + p.hi + '</p>';
      else h += '<p class="sub">Fais tes répétitions, puis valide.</p>';
      h += '<button class="btn go" data-act="stopwork">' + (e.timed || P.count ? 'Arrêter ici' : 'Terminé') + '</button>';
    } else if (R.phase === 'rest') {
      var nx = R.steps[R.i + 1], np = R.plan[nx.pi];
      h += '<p class="sub">Repos</p><div class="big" id="tmr">' + p.rest + '</div>';
      if (!e.timed) h += '<p class="sub">Répétitions réussies (corrige si besoin)</p><div class="stepper"><button data-act="repm">−</button><b id="reps">' + R.reps + '</b><button data-act="repp">+</button></div>';
      h += '<p class="sub">Ensuite : ' + esc(nx.sn === 1 ? np.name : 'série ' + nx.sn + ' · ' + np.name) + '</p><div class="row"><button class="btn alt grow" data-act="plus">+ 15 s</button><button class="btn go grow" data-act="skip">Passer</button></div>';
    }
    h += '</div></div>';
  }
  runner.innerHTML = h;
  if (R.last >= 0) setTxt('tmr', R.last);
  if (R.phase === 'work' && R.count) setTxt('cnt', R.count);
}
function drawDone() {
  var h = '<div class="rtop"><span class="small">' + (R.partial ? 'Séance interrompue' : 'Séance terminée') + '</span></div>';
  h += '<div class="rbody"><div class="rl"><p class="title">' + (R.partial ? 'Séance incomplète enregistrée' : 'Séance validée') + '</p><div class="stats"><div class="stat"><b>' + R.min + '</b><span>minutes</span></div><div class="stat"><b>' + R.logs.length + '</b><span>séries</span></div><div class="stat"><b>' + R.logs.reduce(function (a, x) { return a + (R.plan.filter(function (p) { return p.e.id === x.id; })[0].e.timed ? 0 : x.reps); }, 0) + '</b><span>répétitions</span></div></div></div><div class="rr">';
  if (R.ups && R.ups.length) h += '<div class="card"><h2>Tu passes au niveau supérieur</h2><ul class="list">' + R.ups.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul></div>';
  h += '<div class="card coach"><span class="head">Le coach</span><p class="msg">' + (R.partial ? 'Tu as arrêté en route. La prochaine fois, tu vas au bout.' : 'Mange dans l\'heure, hydrate-toi, dors tes 7 heures. La séance ne compte que si la récupération suit.') + '</p></div>';
  h += '<button class="btn go" data-act="closerun">Fermer</button></div></div>';
  runner.innerHTML = h;
}

