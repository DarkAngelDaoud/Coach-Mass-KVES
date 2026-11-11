/* © KVES · Coach-Mass-KVES. FICHIER GÉNÉRÉ par build.js à partir de src/. Ne le modifie pas à la main : modifie src/ puis lance : node build.js */
(function () {
'use strict';

/* © KVES · Coach-Mass-KVES */

/* ====================== données fixes ====================== */
var KEY = 'coach-masse-v1';
var JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

var VERSION = '10';
var NOM = 'Coach-Mass-KVES', AUTEUR = 'KVES';
var WARM = [
  { l: 'Sauts légers sur place', s: 60, fig: 'jump', period: 0.9 },
  { l: 'Rotations des épaules et des hanches', s: 60, fig: 'arms', period: 2.4 },
  { l: '10 squats lents, sans effort', s: 60, fig: 'squats', period: 3 },
  { l: '10 pompes lentes, mains sur une table', s: 60, fig: 'pompes', period: 3 }
];

var EX = [
  { id: 'pompes', name: 'Pompes', lo: 8, hi: 12, rest: 60, grow: true,
    levels: ['Pompes', 'Pompes pieds surélevés (chaise)', 'Pompes pieds surélevés + descente 3 s', 'Pompes archer'],
    tip: 'Corps droit de la tête aux talons, coudes à 45°. Poitrine près du sol.',
    a: { paths: [[[30,97],[140,57]], [[140,57],[140,98]]], head: [153,48] },
    b: { paths: [[[30,97],[140,84]], [[140,84],[119,92],[140,98]]], head: [154,80] }, la: 'Haut', lb: 'Bas' },
  { id: 'squats', name: 'Squats', lo: 12, hi: 15, rest: 60, grow: true,
    levels: ['Squats', 'Squats avec sac à dos chargé', 'Squat bulgare (pied arrière sur chaise)', 'Squat bulgare + sac à dos'],
    tip: 'Talons au sol, genoux dans l\'axe des pieds. Cuisses parallèles au sol.',
    a: { paths: [[[100,98],[102,70],[100,46]], [[100,46],[100,22]], [[100,26],[126,32]], [[100,98],[116,98]]], head: [100,11] },
    b: { paths: [[[105,98],[135,74],[85,72]], [[85,72],[98,44]], [[98,48],[128,52]], [[105,98],[121,98]]], head: [103,32] }, la: 'Départ', lb: 'Bas' },
  { id: 'tirage', name: 'Tirage sous table', lo: 8, hi: 12, rest: 75, grow: true,
    levels: ['Tirage sous table, genoux fléchis', 'Tirage sous table, jambes tendues', 'Tirage sous table, pieds sur une chaise'],
    tip: 'Table très stable (teste-la). Corps gainé, tire la poitrine vers le bord.',
    a: { props: [[[100,34],[195,34]], [[190,34],[190,100]]], paths: [[[20,97],[115,72]], [[115,72],[112,36]]], head: [128,70] },
    b: { props: [[[100,34],[195,34]], [[190,34],[190,100]]], paths: [[[20,97],[115,52]], [[115,52],[124,44],[112,36]]], head: [128,46] }, la: 'Bras tendus', lb: 'Poitrine au bord' },
  { id: 'pike', name: 'Pompes pike', lo: 6, hi: 10, rest: 75, grow: false,
    levels: ['Pompes pike', 'Pompes pike pieds surélevés', 'Pompes pike pieds très surélevés'],
    tip: 'Hanches hautes en V inversé. Tête vers le sol entre les mains, puis pousse.',
    a: { paths: [[[35,98],[85,34],[125,70]], [[125,70],[130,98]]], head: [136,80] },
    b: { paths: [[[35,98],[85,38],[122,84]], [[122,84],[106,92],[130,98]]], head: [139,93] }, la: 'Haut', lb: 'Bas' },
  { id: 'fentes', name: 'Fentes marchées', lo: 10, hi: 12, rest: 60, grow: true,
    levels: ['Fentes marchées', 'Fentes marchées + sac à dos', 'Fentes marchées + sac à dos lourd'],
    tip: 'Grand pas, buste droit, genou arrière près du sol. Reps par jambe.',
    a: { paths: [[[118,98],[112,75],[105,52]], [[92,98],[98,75],[105,52]], [[105,52],[105,26]], [[105,30],[100,52]], [[118,98],[128,98]], [[92,98],[82,98]]], head: [105,14] },
    b: { paths: [[[135,98],[133,72],[105,70]], [[48,97],[72,90],[105,70]], [[105,70],[105,42]], [[105,46],[112,66]], [[135,98],[148,98]], [[48,97],[38,97]]], head: [105,30] }, la: 'Debout', lb: 'Bas de la fente' },
  { id: 'pont', name: 'Pont fessier', lo: 12, hi: 15, rest: 45, grow: false,
    levels: ['Pont fessier', 'Pont fessier sur une jambe', 'Pont une jambe, pied surélevé'],
    tip: 'Monte les hanches en serrant les fessiers, pause 1 s en haut.',
    a: { paths: [[[45,96],[95,96]], [[95,96],[125,68],[140,96]], [[45,96],[72,97]]], head: [30,90] },
    b: { paths: [[[45,96],[95,66]], [[95,66],[128,72],[140,96]], [[45,96],[72,97]]], head: [30,90] }, la: 'Départ', lb: 'Haut' },
  { id: 'mollets', name: 'Montées sur pointes', lo: 15, hi: 20, rest: 45, grow: false,
    levels: ['Montées sur pointes', 'Montées sur une jambe', 'Une jambe + sac à dos'],
    tip: 'Monte haut, pause, redescends lentement. Bord d\'une marche si possible.',
    a: { paths: [[[100,96],[100,62]], [[100,62],[100,36]], [[100,40],[104,62]], [[88,98],[112,98]]], head: [100,24] },
    b: { paths: [[[96,86],[100,52]], [[100,52],[100,26]], [[100,30],[104,52]], [[92,88],[112,98]]], head: [100,14] }, la: 'Talons au sol', lb: 'Sur les pointes' },
  { id: 'gainage', name: 'Gainage avant-bras', lo: 30, hi: 45, rest: 45, grow: false, timed: true,
    levels: ['Gainage sur les avant-bras', 'Gainage avec levée de jambe alternée', 'Gainage bras tendus, épaules qui touchent'],
    tip: 'Coudes sous les épaules, corps aligné, fessiers et ventre serrés. Respire.',
    a: { paths: [[[35,97],[130,70]], [[130,70],[128,97],[152,97]]], head: [144,62] },
    b: { paths: [[[35,97],[100,90],[130,70]], [[130,70],[128,97],[152,97]]], head: [144,62] }, la: 'À tenir', lb: 'À éviter : hanches basses', bad2: true }
];

var LEGS = [[[92,98],[98,74],[100,50]], [[108,98],[102,74],[100,50]]];
var FIG = {
  jump: { name: 'Sauts légers', la: 'Pieds joints', lb: 'Jambes et bras écartés',
    a: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[92,44],[90,58]], [[100,32],[108,44],[110,58]]], head: [100,16] },
    b: { paths: [[[78,92],[90,68],[100,46]], [[122,92],[110,68],[100,46]], [[100,46],[100,22]], [[100,28],[86,20],[76,8]], [[100,28],[114,20],[124,8]]], head: [100,12] } },
  arms: { name: 'Rotations des épaules', la: 'Bras bas', lb: 'Bras hauts',
    a: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[84,40],[70,50]], [[100,32],[116,40],[130,50]]], head: [100,16] },
    b: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[90,16],[84,2]], [[100,32],[110,16],[116,2]]], head: [100,16] } }
};
var FIGS = {};
EX.forEach(function (e) { FIGS[e.id] = e; });
Object.keys(FIG).forEach(function (k) { FIGS[k] = FIG[k]; });

var MEALS = [
  { t: '9 h 30', x: 'Omelette de 3 œufs, 1 pain, 1 c. à soupe d\'huile d\'olive, 1 verre de lait au chocolat', k: 660, p: 32 },
  { t: '12 h', x: 'Smoothie : 300 ml de lait, 2 bananes, 40 g de flocons d\'avoine, 1 c. à soupe d\'amlou ou de beurre de cacahuète', k: 650, p: 21 },
  { t: '14 h 30', x: '150 g de poulet ou 4 sardines, 80 g de riz (cru), légumes, 1 c. à soupe d\'huile d\'olive', k: 670, p: 40 },
  { t: '18 h', x: '1 pain avec 1 c. à soupe d\'amlou, 1 yaourt', k: 330, p: 12 },
  { t: '21 h 30', x: '150 g de lentilles ou de pois chiches cuits, 2 œufs, 1 pain', k: 475, p: 31 }
];
var EXTRA = { t: 'Avant de dormir', x: 'Verre de lait + 1 pain à l\'amlou (ajout de 300 kcal)', k: 300, p: 10 };
var BASE_KCAL = MEALS.reduce(function (a, m) { return a + m.k; }, 0);

/* © KVES · Coach-Mass-KVES */
/* ====================== état ====================== */
function pad(n) { return String(n).padStart(2, '0'); }
function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function today() { return dstr(new Date()); }
function dnum(s) { return Math.round(new Date(s + 'T00:00:00').getTime() / 864e5); }

function defaults() {
  return {
    profile: { start: today(), w0: 75, goal: 80, height: 179, age: 41, days: [1, 3, 5], tempo: 3, voice: true, vib: true,
      count: true, auto: true, restBonus: 15, sound: true, rotate: false, metro: true, warn10: true, vol: 7, hasBar: false, cigs: false, kcalAdj: 0, lastAdj: '', bkLast: '', bkEvery: 7, vibLevel: 2, avisName: '', avisEmail: '', theme: 'auto', rmOn: false, rmW: '07:30', rmM: '22:00', rmLw: '', rmLm: '', shopDays: 7, shopM3: 'mix', shopM5: 'mix', shopDone: {} },
    logs: {}, measures: [], sessions: [], levels: {}, avis: { sent: [], inbox: [] }
  };
}
function normalize(o) {
  var d = defaults();
  o = o || {};
  return { profile: Object.assign(d.profile, o.profile || {}), logs: o.logs || {}, measures: o.measures || [], sessions: o.sessions || [], levels: o.levels || {}, avis: { sent: (o.avis && o.avis.sent) || [], inbox: (o.avis && o.avis.inbox) || [] } };
}
var D;
try { D = normalize(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch (e) { D = defaults(); try { window.__cmCorrupt = localStorage.getItem(KEY); } catch (e2) {} }
var P = D.profile;
function applyRotate() {
  try {
    var so = window.screen && window.screen.orientation;
    if (!so) return;
    if (P.rotate) { var r = so.lock && so.lock('any'); if (r && r.catch) r.catch(function () {}); }
    else if (so.unlock) so.unlock();
  } catch (e) {}
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) {} try { syncRemind(); } catch (e) {} }

function log(d) { return D.logs[d || today()] || (D.logs[d || today()] = {}); }
function lv(id) { return D.levels[id] || (D.levels[id] = { level: 0, off: 0 }); }
function levelsFor(e) { return e.id === 'tirage' && P.hasBar ? e.levels.concat(['Tractions (barre)']) : e.levels; }
function wkNo() { return Math.max(1, Math.floor((dnum(today()) - dnum(P.start)) / 7) + 1); }
function isTrainDay(dow) { return P.days.indexOf(dow) >= 0; }
function doneToday() { return D.sessions.some(function (s) { return s.date === today() && !s.partial; }); }
function isLight() { var l = D.logs[today()] || {}; return (l.sleep && +l.sleep < 6) || (l.energy && +l.energy <= 2); }
function weekStartStr() { var d = new Date(); var off = (d.getDay() + 6) % 7; d.setDate(d.getDate() - off); return dstr(d); }
function sessionsThisWeek() { var w = weekStartStr(); return D.sessions.filter(function (s) { return !s.partial && s.date >= w; }).length; }
function missedThisWeek() {
  var n = 0, d = new Date(), t = today(), off = (d.getDay() + 6) % 7;
  for (var i = 0; i < off; i++) {
    var x = new Date(); x.setDate(x.getDate() - (off - i));
    var s = dstr(x);
    if (isTrainDay(x.getDay()) && s >= P.start && !D.sessions.some(function (q) { return q.date === s && !q.partial; })) n++;
  }
  return n;
}
function kcalTarget() { return BASE_KCAL + Math.max(0, P.kcalAdj); }
function mealsList() { return P.kcalAdj >= 300 ? MEALS.concat([EXTRA]) : MEALS; }
function eatenKcal() {
  var l = log(), m = mealsList(), s = 0;
  (l.meals || []).forEach(function (c, i) { if (c && m[i]) s += m[i].k; });
  return s;
}

/* poids et tendance */
function weights() {
  var a = [];
  Object.keys(D.logs).sort().forEach(function (k) { if (D.logs[k].weight) a.push({ d: k, w: +D.logs[k].weight }); });
  return a;
}
function currentWeight() { var a = weights(); return a.length ? a[a.length - 1].w : +P.w0; }
function slopeWeek(days) {
  var t = dnum(today());
  var a = weights().filter(function (x) { return t - dnum(x.d) <= days; });
  if (a.length < 3) return null;
  var x0 = dnum(a[0].d);
  if (dnum(a[a.length - 1].d) - x0 < 10) return null;
  var n = a.length, sx = 0, sy = 0, sxy = 0, sxx = 0;
  a.forEach(function (p) { var x = dnum(p.d) - x0; sx += x; sy += p.w; sxy += x * p.w; sxx += x * x; });
  var den = n * sxx - sx * sx;
  return den ? ((n * sxy - sx * sy) / den) * 7 : null;
}
function suggestion() {
  var s = slopeWeek(28);
  if (s === null) return null;
  if (P.lastAdj && dnum(today()) - dnum(P.lastAdj) < 14) return null;
  if (s < 0.15 && P.kcalAdj < 900) return { up: true, s: s };
  if (s > 0.7 && P.kcalAdj > -300) return { up: false, s: s };
  return null;
}

/* © KVES · Coach-Mass-KVES */
/* ====================== utilitaires UI ====================== */
function $(s, r) { return (r || document).querySelector(s); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function fmt(n, d) { return n === null || n === undefined || isNaN(n) ? '—' : Number(n).toFixed(d === undefined ? 1 : d).replace('.', ','); }
function pts(p) { return p.map(function (q) { return q[0] + ',' + q[1]; }).join(' '); }
function figure(d, dx, label, bad) {
  var o = '<g transform="translate(' + dx + ',0)"><line class="ground" x1="6" y1="101" x2="194" y2="101"/>';
  (d.props || []).forEach(function (p) { o += '<polyline class="prop" points="' + pts(p) + '"/>'; });
  d.paths.forEach(function (p) { o += '<polyline class="fig' + (bad ? ' bad' : '') + '" points="' + pts(p) + '"/>'; });
  o += '<circle class="fig head' + (bad ? ' bad' : '') + '" cx="' + d.head[0] + '" cy="' + d.head[1] + '" r="8"/>';
  o += '<text class="lbl" x="100" y="121" text-anchor="middle">' + label + '</text></g>';
  return o;
}
function drawEx(e, single) {
  return '<div class="draw"><svg viewBox="0 0 ' + (single ? 200 : 420) + ' 128" role="img" aria-label="' + esc(e.name) + '">' +
    figure(e.a, 0, e.la) + (single ? '' : figure(e.b, 220, e.lb, e.bad2)) + '</svg></div>';
}

/* © KVES · Coach-Mass-KVES */
/* ====================== animations ====================== */
var REDUCED = false;
try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
function lerp(a, b, t) { return a + (b - a) * t; }
function resample(p, n) {
  if (p.length === n) return p;
  var d = [0], i, k;
  for (i = 1; i < p.length; i++) d.push(d[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  var tot = d[d.length - 1] || 1, out = [];
  for (k = 0; k < n; k++) {
    var x = tot * k / (n - 1), j = 0;
    while (j < p.length - 2 && d[j + 1] < x) j++;
    var seg = (d[j + 1] - d[j]) || 1, f = Math.min(1, Math.max(0, (x - d[j]) / seg));
    out.push([lerp(p[j][0], p[j + 1][0], f), lerp(p[j][1], p[j + 1][1], f)]);
  }
  return out;
}
function prepFig(f) {
  if (f._P) return f._P;
  f._P = f.a.paths.map(function (pa, i) {
    var pb = f.b.paths[i], n = Math.max(pa.length, pb.length);
    return { a: resample(pa, n), b: resample(pb, n) };
  });
  return f._P;
}
function ptsAt(P, t) {
  return P.a.map(function (q, j) { return lerp(q[0], P.b[j][0], t).toFixed(1) + ',' + lerp(q[1], P.b[j][1], t).toFixed(1); }).join(' ');
}
function animSvg(id, mode, period) {
  var f = FIGS[id], P = prepFig(f);
  var o = '<svg class="anim" viewBox="0 0 200 128" role="img" aria-label="' + esc(f.name || id) + '" data-fig="' + id + '" data-mode="' + mode + '" data-period="' + period + '" data-origin="' + Math.round(performance.now()) + '" data-t="0">';
  o += '<line class="ground" x1="6" y1="101" x2="194" y2="101"/>';
  (f.a.props || []).forEach(function (q) { o += '<polyline class="prop" points="' + pts(q) + '"/>'; });
  P.forEach(function (q) { o += '<polyline class="fig" points="' + ptsAt(q, 0) + '"/>'; });
  o += '<circle class="fig head" cx="' + f.a.head[0] + '" cy="' + f.a.head[1] + '" r="8"/>';
  o += '<text class="lbl" x="100" y="121" text-anchor="middle">' + esc(f.la) + '</text></svg>';
  return o;
}
function animBlock(id) {
  var f = FIGS[id], manual = !!f.timed;
  return '<div class="draw">' + animSvg(id, manual ? 'manual' : 'loop', Math.max(2, +P.tempo || 3)) + '</div>' +
    '<div class="scrub"><button class="btn alt sm" data-act="animtoggle">' + (manual ? 'Animer' : 'Figer') + '</button>' +
    '<input type="range" min="0" max="100" value="0" data-scrub aria-label="Décomposer le mouvement"></div>';
}
function applyPose(sv, f, t) {
  var P = prepFig(f), pl = sv.querySelectorAll('polyline.fig'), i;
  for (i = 0; i < P.length && i < pl.length; i++) pl[i].setAttribute('points', ptsAt(P[i], t));
  var c = sv.querySelector('circle.head');
  c.setAttribute('cx', lerp(f.a.head[0], f.b.head[0], t).toFixed(1));
  c.setAttribute('cy', lerp(f.a.head[1], f.b.head[1], t).toFixed(1));
  var bad = !!(f.bad2 && t > 0.5);
  for (i = 0; i < pl.length; i++) pl[i].classList.toggle('bad', bad);
  c.classList.toggle('bad', bad);
  var tx = sv.querySelector('text.lbl'), lab = t < 0.5 ? f.la : f.lb;
  if (tx && tx.textContent !== lab) tx.textContent = lab;
}
var lastF = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  if (ts - lastF < 33) return;
  lastF = ts;
  var list = document.querySelectorAll('svg.anim');
  for (var i = 0; i < list.length; i++) {
    var sv = list[i], f = FIGS[sv.getAttribute('data-fig')];
    if (!f) continue;
    var mode = sv.getAttribute('data-mode'), t = 0;
    if (mode === 'manual') t = parseFloat(sv.getAttribute('data-t')) || 0;
    else if (mode === 'loop' && !REDUCED) {
      var per = parseFloat(sv.getAttribute('data-period')) || 3, org = parseFloat(sv.getAttribute('data-origin')) || 0;
      t = 0.5 - 0.5 * Math.cos(2 * Math.PI * ((ts - org) / 1000 / per));
    }
    sv._t = t;
    applyPose(sv, f, t);
  }
}

/* © KVES · Coach-Mass-KVES */
/* ====================== coach (messages) ====================== */
function pick(a) { var d = new Date(); return a[(d.getDate() + d.getHours()) % a.length]; }
function coachMsg() {
  var l = D.logs[today()] || {}, d = new Date(), h = d.getHours(), dow = d.getDay();
  var train = isTrainDay(dow), done = doneToday(), left = kcalTarget() - eatenKcal(), miss = missedThisWeek();
  if (!l.weight && !l.sleep && !l.energy && h < 12) return ['Bilan du matin', pick(['Bilan du jour. Sommeil, énergie, poids si c\'est dimanche. Deux minutes, maintenant.', 'Pas de bilan, pas de progrès. Remplis-le avant ton premier repas.'])];
  if (done) return ['Séance faite', left > 400 ? 'Séance validée. Maintenant tu manges : il te reste environ ' + left + ' kcal. Ne saute rien.' : 'Séance validée et repas presque complets. Bien. Dors tes 7 heures.'];
  if (train) {
    if (isLight()) return ['Séance allégée', 'Tu as peu dormi ou peu d\'énergie. Séance allégée aujourd\'hui, mais elle est faite. Une série en moins, pas d\'excuses.'];
    return ['Jour de séance', pick(['Aujourd\'hui, séance. Une heure, pas de négociation. Lance-la quand tu es prêt.', 'C\'est jour de séance. Mange ta collation, mets tes écouteurs et commence.'])];
  }
  if (miss > 0) return ['Séance manquée', 'Tu as raté ' + miss + ' séance' + (miss > 1 ? 's' : '') + ' cette semaine. Rattrape-en une aujourd\'hui si tu es en forme. Sinon, tiens la prochaine sans faute.'];
  return ['Jour de récupération', pick(['Récupération. 30 minutes de marche, tes 5 repas, 2,5 litres d\'eau. Rien de plus, rien de moins.', 'Pas de séance. Le muscle se construit maintenant : mange, bois, dors.'])];
}

/* © KVES · Coach-Mass-KVES */
/* ====================== rendu des onglets ====================== */
var tab = 'today';
var view = $('#view');

function nextTrainLabel() {
  var d = new Date();
  for (var i = 0; i < 8; i++) {
    var x = new Date(); x.setDate(d.getDate() + i);
    if (isTrainDay(x.getDay()) && !(i === 0 && doneToday())) return i === 0 ? 'aujourd\'hui' : (i === 1 ? 'demain' : JOURS[x.getDay()].toLowerCase());
  }
  return '—';
}

function viewToday() {
  var l = log(), m = coachMsg(), sug = suggestion();
  var energy = [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="energy" data-n="' + n + '" class="' + (+l.energy === n ? 'on' : '') + '">' + n + '</button>'; }).join('');
  var water = +l.water || 0;
  var h = '<div class="card coach"><span class="head">Le coach · ' + m[0] + '</span><p class="msg">' + m[1] + '</p></div>';
  h += bkBanner();
  if (isTrainDay(new Date().getDay()) && !doneToday()) h += '<button class="btn go" data-act="start">Lancer la séance' + (isLight() ? ' (allégée)' : '') + '</button>';
  else h += '<p class="small">Prochaine séance : ' + nextTrainLabel() + '. Tu peux en lancer une quand même dans l\'onglet Séance.</p>';
  h += '<div class="card"><h2>Bilan du jour</h2><div class="grid2">' +
    '<label class="f">Poids (kg, à jeun)<input type="number" inputmode="decimal" step="0.1" data-log="weight" value="' + (l.weight || '') + '" placeholder="' + fmt(currentWeight()) + '"></label>' +
    '<label class="f">Sommeil (heures)<input type="number" inputmode="decimal" step="0.5" data-log="sleep" value="' + (l.sleep || '') + '" placeholder="7"></label>' +
    '<label class="f">Pas (montre ou téléphone)<input type="number" inputmode="numeric" data-log="steps" value="' + (l.steps || '') + '" placeholder="6000"></label>' +
    (P.cigs ? '<label class="f">Cigarettes fumées<input type="number" inputmode="numeric" data-log="cigs" value="' + (l.cigs === undefined ? '' : l.cigs) + '" placeholder="20"></label>' : '<span></span>') +
    '</div><label class="f">Énergie (1 = à plat, 5 = au top)</label><div class="seg">' + energy + '</div></div>';
  h += '<div class="card"><div class="row"><h2 class="grow">Eau</h2><b>' + fmt(water / 1000, 2) + ' / 2,5 L</b></div><div class="bar"><i class="' + (water >= 2500 ? 'ok' : '') + '" style="width:' + Math.min(100, water / 25) + '%"></i></div>' +
    '<div class="row"><button class="btn alt sm grow" data-act="water" data-n="250">+ 250 ml</button><button class="btn alt sm" data-act="water" data-n="-250">− 250</button></div></div>';
  var eaten = eatenKcal(), tg = kcalTarget();
  h += '<div class="card"><div class="row"><h2 class="grow">Repas validés</h2><b>' + eaten + ' / ' + tg + ' kcal</b></div><div class="bar"><i class="' + (eaten >= tg * 0.95 ? 'ok' : '') + '" style="width:' + Math.min(100, eaten / tg * 100) + '%"></i></div></div>';
  if (sug) {
    h += '<div class="card"><h2>Ajustement conseillé</h2><p>' + (sug.up
      ? 'Ton poids monte de ' + fmt(sug.s, 2) + ' kg par semaine : trop lent. Ajoute 300 kcal par jour (un repas en plus avant de dormir).'
      : 'Ton poids monte de ' + fmt(sug.s, 2) + ' kg par semaine : trop vite. Retire 200 kcal par jour.') +
      '</p><div class="row"><button class="btn sm grow" data-act="adj" data-v="' + (sug.up ? 300 : -200) + '">Appliquer</button><button class="btn alt sm" data-act="adjno">Plus tard</button></div></div>';
  }
  return h;
}

function viewTrain() {
  var h = '<h1>Séance corps entier</h1><p class="small">Semaine ' + wkNo() + ' · ' + (wkNo() <= 2 ? '3 séries' : '4 séries') + ' sur les exercices principaux. Jours prévus : ' + P.days.slice().sort().map(function (d) { return JOURS[d]; }).join(', ') + '.</p>';
  h += '<button class="btn go" data-act="start">Lancer la séance' + (isLight() ? ' (allégée)' : '') + '</button>';
  h += '<div class="cards2">';
  EX.forEach(function (e) {
    var L = lv(e.id), names = levelsFor(e), li = Math.min(L.level, names.length - 1);
    var tgt = e.timed ? (e.lo + L.off) + '–' + (e.hi + L.off) + ' s' : (e.lo + L.off) + '–' + (e.hi + L.off) + ' reps';
    h += '<div class="card"><div class="row"><h3 class="grow">' + esc(names[li]) + '</h3><span class="pill on">' + tgt + '</span></div>' + animBlock(e.id) + '<p class="small">' + esc(e.tip) + '</p>' + mtHtml(e, e.hi + L.off) + '</div>';
  });
  h += '</div>';
  var last = D.sessions.slice(-5).reverse();
  if (last.length) h += '<div class="card"><h2>Dernières séances</h2><ul class="list">' + last.map(function (s) {
    return '<li><span>' + s.date + (s.free ? ' · libre' : s.partial ? ' · incomplète' : '') + '</span><span>' + (s.free ? '' : s.min + ' min · ') + s.sets + ' série' + (s.sets > 1 ? 's' : '') + '</span></li>';
  }).join('') + '</ul></div>';
  return h;
}

function viewMeals() {
  var l = log(), m = mealsList(), c = l.meals || [];
  var h = '<h1>Repas du jour</h1><p class="small">Cible : environ ' + kcalTarget() + ' kcal et 135 g de protéines. Coche chaque repas quand tu l\'as fini.</p><div class="card">';
  m.forEach(function (x, i) {
    h += '<label class="meal"><input type="checkbox" data-act="meal" data-i="' + i + '"' + (c[i] ? ' checked' : '') + '><span><span class="t">' + x.t + '</span><br>' + esc(x.x) + '</span><span class="k">' + x.k + ' kcal<br>' + x.p + ' g</span></label>';
  });
  h += '</div><div class="card"><h2>Variantes</h2><ul class="list"><li><span>Pas de poulet</span><span>4 sardines ou 200 g de lentilles</span></li><li><span>Peu d\'appétit</span><span>Bois le smoothie en plus</span></li><li><span>Budget serré</span><span>Œufs, légumineuses, sardines</span></li></ul></div>';
  h += shopCard();
  return h;
}

/* © KVES · Coach-Mass-KVES */
var CH = { range: 56, ex: 'total' };
var delArmed = -1;
function sdate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
function ldate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); }
function inRange(d) { return !CH.range || dnum(today()) - dnum(d) <= CH.range; }
function niceMax(v) {
  if (!(v > 0)) return 10;
  var pw = Math.pow(10, Math.floor(Math.log10(v))), n = v / pw;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pw;
}
function tickStr(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }

function weightChart() {
  var a = weights();
  if (!a.some(function (x) { return x.d === P.start; })) a.unshift({ d: P.start, w: +P.w0 });
  a.sort(function (x, y) { return x.d < y.d ? -1 : 1; });
  a = a.filter(function (x) { return inRange(x.d); });
  if (a.length < 2) return { svg: '<p class="small">Pas assez de pesées sur cette période. Note ton poids dans le bilan du jour.</p>', pts: a };
  var W = 340, H = 170, ml = 38, mr = 10, mt = 18, mb = 26, goal = +P.goal;
  var ws = a.map(function (x) { return x.w; });
  var lo = Math.floor(Math.min.apply(null, ws.concat([goal])) - 1), hi = Math.ceil(Math.max.apply(null, ws.concat([goal])) + 1);
  var step = Math.max(1, Math.ceil((hi - lo) / 3)); hi = lo + 3 * step;
  var x0 = dnum(a[0].d), x1 = Math.max(dnum(a[a.length - 1].d), x0 + 7);
  function X(d) { return ml + (dnum(d) - x0) / (x1 - x0) * (W - ml - mr); }
  function Y(w) { return mt + (hi - w) / (hi - lo) * (H - mt - mb); }
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img" aria-label="Évolution du poids">', k;
  for (k = 0; k <= 3; k++) {
    var v = lo + k * step, y = Y(v).toFixed(1);
    s += '<line x1="' + ml + '" y1="' + y + '" x2="' + (W - mr) + '" y2="' + y + '" stroke="var(--line)"/><text x="' + (ml - 5) + '" y="' + (+y + 3.5) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + v + '</text>';
  }
  var gy = Y(goal).toFixed(1);
  s += '<line x1="' + ml + '" y1="' + gy + '" x2="' + (W - mr) + '" y2="' + gy + '" stroke="var(--ok)" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<text x="' + (W - mr) + '" y="' + (+gy - 4) + '" text-anchor="end" fill="var(--ok)" font-size="10">objectif ' + tickStr(goal) + ' kg</text>';
  s += '<polyline points="' + a.map(function (p) { return X(p.d).toFixed(1) + ',' + Y(p.w).toFixed(1); }).join(' ') + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>';
  a.forEach(function (p, i) { s += '<circle cx="' + X(p.d).toFixed(1) + '" cy="' + Y(p.w).toFixed(1) + '" r="' + (i === a.length - 1 ? 4.5 : 2.5) + '" fill="var(--accent)"/>'; });
  var last = a[a.length - 1], lx = X(last.d);
  s += '<text x="' + (lx > W - 50 ? lx : lx).toFixed(1) + '" y="' + (Y(last.w) - 9).toFixed(1) + '" text-anchor="' + (lx > W - 50 ? 'end' : 'middle') + '" fill="var(--fg)" font-size="11" font-weight="700">' + tickStr(last.w) + ' kg</text>';
  s += '<text x="' + ml + '" y="' + (H - 8) + '" fill="var(--muted)" font-size="10">' + sdate(a[0].d) + '</text>';
  s += '<text x="' + (W - mr) + '" y="' + (H - 8) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + sdate(a[a.length - 1].d) + '</text></svg>';
  return { svg: s, pts: a };
}

function barChart(items, unit) {
  if (!items.length) return '<p class="small">Aucune séance terminée sur cette période. Fais une séance pour voir ta courbe.</p>';
  var W = 340, H = 170, ml = 38, mr = 10, mt = 18, mb = 26, n = items.length;
  var mx = niceMax(Math.max.apply(null, items.map(function (x) { return x.v; })) * 1.08);
  var iw = (W - ml - mr) / n, bw = Math.min(30, iw * 0.7);
  function Y(v) { return mt + (1 - v / mx) * (H - mt - mb); }
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img" aria-label="Performance par séance">', k;
  for (k = 0; k <= 2; k++) {
    var v = mx * k / 2, y = Y(v).toFixed(1);
    s += '<line x1="' + ml + '" y1="' + y + '" x2="' + (W - mr) + '" y2="' + y + '" stroke="var(--line)"/><text x="' + (ml - 5) + '" y="' + (+y + 3.5) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + tickStr(v) + '</text>';
  }
  items.forEach(function (it, i) {
    var cx = ml + (i + 0.5) * iw, y = Y(it.v), isLast = i === n - 1;
    s += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(1, H - mb - y).toFixed(1) + '" rx="3" fill="var(--accent)" opacity="' + (isLast ? 1 : 0.55) + '"/>';
    if (n <= 10 || isLast) s += '<text x="' + cx.toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" text-anchor="middle" fill="var(--fg)" font-size="10" font-weight="700">' + it.v + '</text>';
  });
  s += '<text x="' + ml + '" y="' + (H - 8) + '" fill="var(--muted)" font-size="10">' + sdate(items[0].d) + '</text>';
  if (n > 1) s += '<text x="' + (W - mr) + '" y="' + (H - 8) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + sdate(items[n - 1].d) + '</text>';
  return s + '</svg>';
}

function perfItems() {
  var out = [];
  D.sessions.forEach(function (s) {
    if (s.partial || !inRange(s.date)) return;
    var v = 0, has = false;
    (s.logs || []).forEach(function (l) {
      var e = FIGS[l.id];
      if (!e) return;
      if (CH.ex === 'total') { if (!e.timed) { v += l.reps; has = true; } }
      else if (l.id === CH.ex) { v += l.reps; has = true; }
    });
    if (has) out.push({ d: s.date, v: v });
  });
  return out;
}

function weekRows() {
  var cw = wkNo(), wk = {};
  function slot(w) { return wk[w] || (wk[w] = { n: 0, reps: 0, ws: [] }); }
  D.sessions.forEach(function (s) {
    var w = Math.max(1, Math.floor((dnum(s.date) - dnum(P.start)) / 7) + 1), o = slot(w);
    if (!s.partial) o.n++;
    (s.logs || []).forEach(function (l) { var e = FIGS[l.id]; if (e && !e.timed) o.reps += l.reps; });
  });
  Object.keys(D.logs).forEach(function (d) {
    if (!D.logs[d].weight) return;
    var w = Math.max(1, Math.floor((dnum(d) - dnum(P.start)) / 7) + 1);
    slot(w).ws.push(+D.logs[d].weight);
  });
  var from = Math.max(1, CH.range ? cw - Math.ceil(CH.range / 7) + 1 : 1, cw - 25), rows = [], w;
  for (w = cw; w >= from; w--) {
    var o = wk[w] || { n: 0, reps: 0, ws: [] };
    rows.push('<tr><th scope="row">S' + w + (w === cw ? ' · en cours' : '') + '</th><td class="n">' + o.n + ' / ' + P.days.length + '</td><td class="n">' + o.reps + '</td><td class="n">' + (o.ws.length ? fmt(o.ws.reduce(function (a, b) { return a + b; }, 0) / o.ws.length) + ' kg' : '—') + '</td></tr>');
  }
  return rows.join('');
}

function viewTrack() {
  var cur = currentWeight(), sl = slopeWeek(28), goal = +P.goal;
  var eta = sl && sl > 0.05 && cur < goal ? Math.ceil((goal - cur) / sl) + ' sem.' : '—';
  var h = '<h1>Suivi</h1><div class="card"><div class="stats"><div class="stat"><b>' + fmt(cur) + '</b><span>kg actuel</span></div><div class="stat"><b>' + fmt(goal - cur) + '</b><span>kg restants</span></div><div class="stat"><b>' + eta + '</b><span>estimation</span></div></div>' +
    '<p class="small">Rythme mesuré : ' + (sl === null ? 'pas assez de pesées (3 sur 10 jours minimum)' : fmt(sl, 2) + ' kg par semaine') + '. Cible saine : 0,25 à 0,5.</p></div>';
  h += '<div class="seg" role="group" aria-label="Période">' + [[28, '4 sem.'], [56, '8 sem.'], [182, '6 mois'], [0, 'Tout']].map(function (r) {
    return '<button data-act="range" data-v="' + r[0] + '" class="' + (CH.range === r[0] ? 'on' : '') + '">' + r[1] + '</button>';
  }).join('') + '</div>';
  var wc = weightChart(), dw = '';
  if (wc.pts.length >= 2) { var df = wc.pts[wc.pts.length - 1].w - wc.pts[0].w; dw = '<p class="small">Sur la période : ' + (df > 0 ? '+' : '') + fmt(df) + ' kg (de ' + fmt(wc.pts[0].w) + ' à ' + fmt(wc.pts[wc.pts.length - 1].w) + ' kg).</p>'; }
  h += '<div class="card"><h2>Évolution du poids</h2>' + wc.svg + dw + '</div>';
  var chips = '<button class="chip' + (CH.ex === 'total' ? ' on' : '') + '" data-act="exsel" data-v="total">Total</button>' + EX.map(function (e) {
    return '<button class="chip' + (CH.ex === e.id ? ' on' : '') + '" data-act="exsel" data-v="' + e.id + '">' + esc(e.name) + '</button>';
  }).join('');
  var it = perfItems(), ex = FIGS[CH.ex], unit = ex && ex.timed ? 's' : 'reps', pd = '';
  if (it.length >= 2) { var d2 = it[it.length - 1].v - it[0].v; pd = '<p class="small">Du début à la dernière séance de la période : ' + it[0].v + ' → ' + it[it.length - 1].v + ' ' + unit + ' (' + (d2 > 0 ? '+' : '') + d2 + ').</p>'; }
  h += '<div class="card"><h2>Performance par séance</h2><div class="chips">' + chips + '</div><p class="small">' + (CH.ex === 'total' ? 'Total des répétitions (hors gainage)' : esc(ex.name) + ' : ' + (ex.timed ? 'secondes tenues' : 'répétitions') + ' cumulées sur la séance') + '</p>' + barChart(it, unit) + pd + '</div>';
  h += '<div class="card"><h2>Semaine par semaine</h2><div class="table-wrap"><table><thead><tr><th>Semaine</th><th class="n">Séances</th><th class="n">Reps</th><th class="n">Poids moy.</th></tr></thead><tbody>' + weekRows() + '</tbody></table></div></div>';
  h += '<div class="card"><h2>Mensurations</h2><p class="small">Toutes les 2 semaines, matin à jeun, en cm.</p><div class="grid2">' +
    ['bras', 'poitrine', 'taille', 'cuisse'].map(function (k) { return '<label class="f">' + k.charAt(0).toUpperCase() + k.slice(1) + '<input type="number" inputmode="decimal" step="0.5" id="m_' + k + '"></label>'; }).join('') +
    '</div><button class="btn sm" data-act="measure">Enregistrer</button>';
  if (D.measures.length) {
    var f = D.measures[0], z = D.measures[D.measures.length - 1];
    h += '<ul class="list">' + ['bras', 'poitrine', 'taille', 'cuisse'].map(function (k) {
      var dd = (z[k] && f[k]) ? z[k] - f[k] : null;
      return '<li><span>' + k + '</span><span>' + (z[k] || '—') + ' cm' + (D.measures.length > 1 && dd !== null ? ' (' + (dd > 0 ? '+' : '') + fmt(dd) + ')' : '') + '</span></li>';
    }).join('') + '</ul><p class="small">Dernière mesure : ' + z.date + '</p>';
  }
  h += '</div><div class="card"><h2>Sauvegarde</h2><p class="small">Tes données restent sur ce téléphone. Exporte-les de temps en temps.</p><div class="row"><button class="btn alt sm grow" data-act="export">Exporter</button><button class="btn alt sm grow" data-act="import">Importer</button></div></div>';
  return h;
}

function viewHistory() {
  var ss = D.sessions, h = '<h1>Historique</h1>';
  if (!ss.length) return h + '<div class="card"><p>Aucune séance enregistrée pour le moment. Chaque série que tu fais est conservée ici, avec la date, la variante et tes répétitions.</p></div>';
  var done = ss.filter(function (x) { return !x.partial; }), mins = 0, reps = 0;
  ss.forEach(function (x) { mins += x.min || 0; (x.logs || []).forEach(function (l) { var e = FIGS[l.id]; if (e && !e.timed) reps += l.reps; }); });
  h += '<div class="card"><div class="stats"><div class="stat"><b>' + done.length + '</b><span>séances</span></div><div class="stat"><b>' + Math.round(mins / 60 * 10) / 10 + '</b><span>heures</span></div><div class="stat"><b>' + reps + '</b><span>répétitions</span></div></div></div>';
  var rec = '';
  EX.forEach(function (e) {
    var best = null, first = null, lastv = null;
    ss.forEach(function (x) {
      var tot = 0, has = false;
      (x.logs || []).forEach(function (l) {
        if (l.id !== e.id) return;
        has = true; tot += l.reps;
        if (!best || l.reps > best.v) best = { v: l.reps, d: x.date };
      });
      if (has && !x.partial) { if (first === null) first = tot; lastv = tot; }
    });
    if (!best) return;
    var u = e.timed ? ' s' : '';
    rec += '<li><span>' + esc(e.name) + '</span><span>meilleure série ' + best.v + u + ' · ' + sdate(best.d) + (first !== null && lastv !== null && first !== lastv ? '<br>total par séance : ' + first + ' → ' + lastv + u : '') + '</span></li>';
  });
  if (rec) h += '<div class="card"><h2>Records et progression</h2><ul class="list">' + rec + '</ul></div>';
  h += '<h2>Toutes les séances</h2>';
  for (var i = ss.length - 1; i >= 0; i--) {
    var s = ss[i], g = {}, rows = '', tot = 0;
    (s.logs || []).forEach(function (l) { (g[l.id] = g[l.id] || []).push(l); var e = FIGS[l.id]; if (e && !e.timed) tot += l.reps; });
    EX.forEach(function (e) {
      if (!g[e.id]) return;
      var arr = g[e.id].slice().sort(function (a, b) { return a.sn - b.sn; });
      rows += '<li><span>' + esc(arr[0].name || e.name) + '</span><span>' + arr.map(function (l) { return l.reps; }).join(' · ') + (e.timed ? ' s' : '') + '</span></li>';
    });
    h += '<details class="card"' + (delArmed === i ? ' open' : '') + '><summary><span class="grow">' + esc(ldate(s.date)) + '</span>' +
      (s.free ? '<span class="pill">libre</span>' : s.partial ? '<span class="pill">incomplète</span>' : '') + (s.light ? '<span class="pill">allégée</span>' : '') + '</summary>' +
      '<p class="small">' + s.min + ' min · ' + s.sets + ' séries · ' + tot + ' répétitions · semaine ' + (s.week || '—') + '</p>' +
      '<ul class="list">' + (rows || '<li><span>Aucune série enregistrée</span></li>') + '</ul>' +
      '<button class="btn bad sm" data-act="delsession" data-i="' + i + '">' + (delArmed === i ? 'Confirmer la suppression' : 'Supprimer cette séance') + '</button></details>';
  }
  return h;
}

/* © KVES · Coach-Mass-KVES */
function tog(key, label, hint) {
  return '<label class="meal"><input type="checkbox" data-set="' + key + '"' + (P[key] ? ' checked' : '') + '><span><b>' + label + '</b>' + (hint ? '<br><span class="small">' + hint + '</span>' : '') + '</span></label>';
}
function viewSettings() {
  var h = '<button class="btn alt sm back" data-act="tab" data-v="more">← Plus</button><h1>Réglages</h1><div class="card"><h2>Jours de séance</h2><div class="seg">' +
    [1, 2, 3, 4, 5, 6, 0].map(function (d) { return '<button data-act="day" data-d="' + d + '" class="' + (isTrainDay(d) ? 'on' : '') + '">' + JOURS[d] + '</button>'; }).join('') + '</div></div>';
  h += '<div class="card"><h2>Coach</h2>' + tog('voice', 'Voix du coach', 'Parle en français dans tes écouteurs') + tog('vib', 'Vibrations') + '<label class="f">Intensité des vibrations</label><div class="seg" role="group">' + [[1, 'Normale'], [2, 'Forte'], [3, 'Très forte']].map(function (x) { return '<button data-act="vibpow" data-v="' + x[0] + '" class="' + ((P.vibLevel || 2) === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' + tog('count', 'Compter les répétitions à voix haute', 'Le coach donne le rythme') + tog('auto', 'Enchaînement automatique', 'Mains libres : le coach relance après le repos') +
    '<div class="grid2"><label class="f">Secondes par répétition<input type="number" inputmode="numeric" min="2" max="6" data-set="tempo" value="' + P.tempo + '"></label>' +
    '<label class="f">Repos en plus (secondes)<input type="number" inputmode="numeric" min="0" max="60" step="5" data-set="restBonus" value="' + P.restBonus + '"></label></div>' +
    '<div class="row"><button class="btn alt sm" data-act="testvoice">Tester la voix</button><button class="btn alt sm" data-act="testvib">Tester la vibration</button></div></div>';
  h += '<div class="card"><h2>Signaux sonores</h2>' + tog('sound', 'Sons activés', 'Bips de fin de série, d\'exercice et de repos') + tog('metro', 'Métronome de cadence', 'Bip grave à la descente, bip aigu à la montée') + tog('warn10', 'Alerte 10 secondes avant la fin du repos') +
    '<label class="f">Volume : ' + P.vol + ' sur 10<input type="range" min="1" max="10" step="1" data-set="vol" value="' + P.vol + '" aria-label="Volume des sons"></label>' +
    '<p class="small">Teste chaque signal :</p><div class="chips">' + [['setend', 'Fin de série'], ['exend', 'Fin d\'exercice'], ['go', 'Fin du repos'], ['warn', 'Alerte 10 s'], ['count', 'Compte à rebours'], ['beat', 'Cadence'], ['fanfare', 'Fin de séance']].map(function (x) {
      return '<button class="chip" data-act="testsnd" data-v="' + x[0] + '">' + x[1] + '</button>';
    }).join('') + '</div></div>';
  h += '<div class="card"><h2>Profil et objectif</h2><div class="grid2">' +
    '<label class="f">Poids de départ (kg)<input type="number" inputmode="decimal" step="0.1" data-set="w0" value="' + P.w0 + '"></label>' +
    '<label class="f">Objectif (kg)<input type="number" inputmode="decimal" step="0.5" data-set="goal" value="' + P.goal + '"></label>' +
    '<label class="f">Date de départ<input type="text" data-set="start" value="' + P.start + '"></label></div>' +
    tog('hasBar', 'J\'ai une barre de traction', 'Ajoute les tractions au tirage') + tog('cigs', 'Suivre mes cigarettes', 'Un compteur dans le bilan du jour') + '</div>';
  h += rmCard();
  h += '<div class="card"><h2>Affichage</h2>' + themeCard() + tog('rotate', 'Forcer la rotation de l\'écran', 'À activer si l\'application reste bloquée en portrait. Elle suit alors le capteur du téléphone.') + '</div>';
  h += bkCard();
  h += '<div class="card"><h2>Données</h2><button class="btn bad sm" data-act="reset">' + (resetArmed ? 'Confirmer : tout effacer' : 'Effacer toutes les données') + '</button><p class="small">Version ' + VERSION + '</p></div>';
  return h;
}
var resetArmed = false;

function render() {
  $('#weekTag').textContent = 'Semaine ' + wkNo() + ' · ' + fmt(currentWeight()) + ' kg → ' + P.goal;
  var map = { today: viewToday, train: viewTrain, meals: viewMeals, track: viewTrack, history: viewHistory, settings: viewSettings, more: viewMore, avis: viewAvis, owner: viewOwner };
  view.innerHTML = map[tab]();
  document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === (({ avis: 'more', settings: 'more', owner: 'more' })[tab] || tab)); });
}

/* © KVES · Coach-Mass-KVES */
/* ====================== audio, voix, vibration ====================== */
var actx = null;
function unlockAudio() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
  } catch (e) {}
}
function tone(f, dur, delay, type, vol) {
  if (!P.sound) return;
  try {
    unlockAudio();
    if (!actx) return;
    var t0 = actx.currentTime + (delay || 0), o = actx.createOscillator(), g = actx.createGain();
    var v = (vol || 1) * Math.pow((+P.vol || 7) / 10, 2) * 0.5;
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  } catch (e) {}
}
var SND = {
  tick: function () { tone(1200, 0.04, 0, 'square', 0.35); },
  down: function () { tone(520, 0.1, 0, 'triangle', 1); },
  up: function () { tone(780, 0.1, 0, 'triangle', 1); },
  beat: function () { tone(520, 0.1, 0, 'triangle', 1); tone(780, 0.1, 0.5, 'triangle', 1); },
  count: function () { tone(700, 0.1, 0, 'sine', 1); },
  start: function () { tone(1000, 0.25, 0, 'sine', 1); },
  warn: function () { tone(900, 0.09, 0, 'square', 0.5); tone(900, 0.09, 0.16, 'square', 0.5); },
  setend: function () { tone(880, 0.16, 0, 'sine', 1); tone(660, 0.16, 0.18, 'sine', 1); tone(440, 0.3, 0.36, 'sine', 1); },
  exend: function () { SND.setend(); tone(660, 0.14, 0.75, 'triangle', 0.9); tone(990, 0.3, 0.9, 'triangle', 0.9); },
  go: function () { tone(523, 0.12, 0, 'triangle', 1); tone(659, 0.12, 0.14, 'triangle', 1); tone(784, 0.3, 0.28, 'triangle', 1); },
  newex: function () { tone(392, 0.14, 0, 'triangle', 1); tone(523, 0.14, 0.16, 'triangle', 1); tone(659, 0.14, 0.32, 'triangle', 1); tone(784, 0.35, 0.48, 'triangle', 1); },
  chime: function () { tone(988, 0.14, 0, 'sine', 0.8); tone(1318, 0.26, 0.12, 'sine', 0.8); },
  fanfare: function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.2, i * 0.18, 'triangle', 1); }); tone(1046, 0.5, 0.8, 'triangle', 1); }
};
function play(n) { if (SND[n]) SND[n](); }
function beep(f, ms) { tone(f || 880, (ms || 120) / 1000, 0, 'sine', 1); }
function flash() {
  try { runner.classList.add('flash'); setTimeout(function () { runner.classList.remove('flash'); }, 450); } catch (e) {}
}
function say(t) {
  if (!P.voice) return;
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t); u.lang = 'fr-FR'; u.rate = 1.05;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
/* Intensité : 1 = normale (impulsions telles quelles), 2 = forte (impulsions allongées, mini 90 ms), 3 = très forte (mini 160 ms).
   Les impulsions de 30-40 ms sont trop brèves pour être senties sur beaucoup de téléphones. */
function vibScale(p) {
  var lv = P.vibLevel || 2, mini = lv >= 3 ? 160 : lv === 2 ? 90 : 0, k = lv >= 3 ? 3 : lv === 2 ? 2 : 1;
  var a = Array.isArray(p) ? p : [p];
  return a.map(function (v, i) { return i % 2 === 0 ? Math.max(mini, Math.round(v * k)) : v; });
}
function vib(p) { if (P.vib) { try { return navigator.vibrate ? navigator.vibrate(vibScale(p)) : null; } catch (e) { return false; } } return null; }
var wl = null;
function wake() { try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (s) { wl = s; }).catch(function () {}); } catch (e) {} }
function unwake() { try { wl && wl.release(); } catch (e) {} wl = null; }
document.addEventListener('visibilitychange', function () { if (R && document.visibilityState === 'visible') wake(); });

/* © KVES · Coach-Mass-KVES */
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

/* © KVES · Coach-Mass-KVES */
/* ====================== boîte à avis (chiffrée de bout en bout) ====================== */
/* Principe : l'avis est chiffré sur le téléphone de l'utilisateur avec la clé PUBLIQUE du propriétaire
   (ECDH P-256 éphémère + HKDF-SHA256 + AES-256-GCM). Seule la clé PRIVÉE du propriétaire, gardée sur son
   téléphone et protégée par une phrase secrète (PBKDF2 + AES-GCM), peut le lire. Aucun serveur n'est utilisé. */
var CFG = window.AVIS_CONFIG || {};
var OWNER_KEY = 'coach-masse-owner-v1';
var AV_TYPES = { idee: 'Idée', probleme: 'Problème', question: 'Question', bravo: 'Bravo' };
var TYPE_LABEL = { idee: 'Idée', probleme: 'Problème', question: 'Question', bravo: 'Bravo', autre: 'Autre' };
var ST_LABEL = { 'new': 'Nouveau', todo: 'À traiter', done: 'Fait' };
var EMAIL_RE = /^[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]{2,}$/;
var AV = { name: P.avisName || '', email: P.avisEmail || '', type: 'idee', note: 0, msg: '', consent: false, busy: false, last: 0 };
var OW = { priv: null, items: null, filter: 'all', busy: false, hiddenAt: 0, armed: '' };
var avDelArmed = 0;
var te = new TextEncoder(), td = new TextDecoder();

function subtle() { return window.crypto && window.crypto.subtle; }
function rnd(n) { return window.crypto.getRandomValues(new Uint8Array(n)); }
function b64u(u8) {
  var s = '', i;
  for (i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64u(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  var bin = atob(s), a = new Uint8Array(bin.length), i;
  for (i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return a;
}
function toast(t) {
  var n = $('#toast');
  if (!n) return;
  n.textContent = t; n.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { n.hidden = true; }, 3400);
}
function copyText(t) {
  var p;
  try { p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(t) : Promise.reject(); } catch (e) { p = Promise.reject(); }
  return p.then(function () { toast('Copié.'); }).catch(function () {
    try {
      var ta = document.createElement('textarea');
      ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy'); ta.remove();
      toast(ok ? 'Copié.' : 'Copie impossible : sélectionne le texte à la main.');
    } catch (e) { toast('Copie impossible : sélectionne le texte à la main.'); }
  });
}
function download(name, text, mime) {
  try {
    var b = new Blob([text], { type: mime || 'text/plain' }), a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  } catch (e) { toast('Téléchargement impossible sur cet appareil. Utilise Copier.'); }
}

/* compression et chiffrement */
function streamBytes(u8, ts) { return new Response(new Blob([u8]).stream().pipeThrough(ts)).arrayBuffer().then(function (b) { return new Uint8Array(b); }); }
function deflate(u8) { return window.CompressionStream ? streamBytes(u8, new CompressionStream('deflate-raw')) : Promise.resolve(u8); }
function inflate(u8) { return streamBytes(u8, new DecompressionStream('deflate-raw')); }
function deriveAes(bits, usages) {
  var S = subtle();
  return S.importKey('raw', bits, 'HKDF', false, ['deriveKey']).then(function (hk) {
    return S.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode('coach-masse-avis-v1') }, hk, { name: 'AES-GCM', length: 256 }, false, usages);
  });
}
function avisEncrypt(obj, pubJwk) {
  var S = subtle(), epkRaw, iv, aes;
  return S.importKey('jwk', pubJwk, { name: 'ECDH', namedCurve: 'P-256' }, false, []).then(function (pub) {
    return S.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']).then(function (eph) {
      return Promise.all([S.deriveBits({ name: 'ECDH', public: pub }, eph.privateKey, 256), S.exportKey('raw', eph.publicKey)]);
    });
  }).then(function (r) {
    epkRaw = new Uint8Array(r[1]);
    return deriveAes(r[0], ['encrypt']);
  }).then(function (k) {
    aes = k; iv = rnd(12);
    return deflate(te.encode(JSON.stringify(obj)));
  }).then(function (pt) {
    return S.encrypt({ name: 'AES-GCM', iv: iv, additionalData: epkRaw }, aes, pt);
  }).then(function (ct) {
    ct = new Uint8Array(ct);
    var out = new Uint8Array(77 + ct.length);
    out.set(epkRaw, 0); out.set(iv, 65); out.set(ct, 77);
    return (window.CompressionStream ? 'CM1.' : 'CM0.') + b64u(out);
  });
}
function avisDecrypt(code, priv) {
  var S = subtle(), m = /^CM([01])\.([A-Za-z0-9_-]+)$/.exec(code);
  if (!m) return Promise.reject(new Error('format'));
  var comp = m[1] === '1', u = unb64u(m[2]);
  if (u.length < 77 + 16) return Promise.reject(new Error('court'));
  var epkRaw = u.slice(0, 65), iv = u.slice(65, 77), ct = u.slice(77);
  return S.importKey('raw', epkRaw, { name: 'ECDH', namedCurve: 'P-256' }, false, []).then(function (epk) {
    return S.deriveBits({ name: 'ECDH', public: epk }, priv, 256);
  }).then(function (bits) {
    return deriveAes(bits, ['decrypt']);
  }).then(function (k) {
    return S.decrypt({ name: 'AES-GCM', iv: iv, additionalData: epkRaw }, k, ct);
  }).then(function (pt) {
    pt = new Uint8Array(pt);
    return comp ? inflate(pt) : pt;
  }).then(function (u8) { return JSON.parse(td.decode(u8)); });
}
function cleanAvis(o) {
  if (!o || typeof o !== 'object') return null;
  function s(x, n) { return String(x == null ? '' : x).slice(0, n); }
  return { n: s(o.n, 60), e: s(o.e, 120), t: AV_TYPES[o.t] ? o.t : 'autre', r: Math.max(0, Math.min(5, parseInt(o.r, 10) || 0)), m: s(o.m, 800), d: s(o.d, 20), a: s(o.a, 10), s: s(o.s, 14) };
}

/* clé du propriétaire */
function ownerRec() { try { return JSON.parse(localStorage.getItem(OWNER_KEY) || 'null'); } catch (e) { return null; } }
function wrapKey(pass, salt, it) {
  var S = subtle();
  return S.importKey('raw', te.encode(pass), 'PBKDF2', false, ['deriveKey']).then(function (base) {
    return S.deriveKey({ name: 'PBKDF2', salt: salt, iterations: it, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  });
}
function ownerCreate(pass) {
  var S = subtle(), rec = { v: 1, it: 600000 }, salt = rnd(16), iv = rnd(12);
  return S.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']).then(function (kp) {
    return Promise.all([S.exportKey('jwk', kp.publicKey), S.exportKey('pkcs8', kp.privateKey), wrapKey(pass, salt, rec.it)]);
  }).then(function (r) {
    rec.pub = { kty: r[0].kty, crv: r[0].crv, x: r[0].x, y: r[0].y };
    return S.encrypt({ name: 'AES-GCM', iv: iv }, r[2], r[1]);
  }).then(function (ct) {
    rec.salt = b64u(salt); rec.iv = b64u(iv); rec.ct = b64u(new Uint8Array(ct));
    localStorage.setItem(OWNER_KEY, JSON.stringify(rec));
    return rec;
  });
}
function decryptAll() {
  return Promise.all(D.avis.inbox.map(function (rec) {
    return avisDecrypt(rec.code, OW.priv).then(function (o) { return { rec: rec, data: cleanAvis(o) }; }, function () { return { rec: rec, data: null }; });
  })).then(function (items) { OW.items = items; });
}
function ownerUnlock(pass) {
  var S = subtle(), rec = ownerRec();
  if (!rec) return Promise.reject(new Error('nokey'));
  return wrapKey(pass, unb64u(rec.salt), rec.it).then(function (wk) {
    return S.decrypt({ name: 'AES-GCM', iv: unb64u(rec.iv) }, wk, unb64u(rec.ct));
  }).then(function (pk) {
    return S.importKey('pkcs8', pk, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits']);
  }).then(function (key) { OW.priv = key; return decryptAll(); });
}
function owLock() { OW.priv = null; OW.items = null; }
function cfgText(pub) {
  return 'window.AVIS_CONFIG = {\n  publicKey: ' + JSON.stringify(pub) + ',\n  email: ' + JSON.stringify(CFG.email || '') + ',\n  whatsapp: ' + JSON.stringify(CFG.whatsapp || '') + '\n};\n';
}
function owIngest(text) {
  var found = text.match(/CM[01]\.[A-Za-z0-9_-]{60,6000}/g) || [], added = 0, dup = 0;
  if (!found.length) { toast('Aucun avis trouvé dans ce texte.'); return Promise.resolve(); }
  found.forEach(function (c) {
    if (D.avis.inbox.some(function (x) { return x.code === c; })) dup++;
    else { D.avis.inbox.push({ code: c, added: today(), st: 'new' }); added++; }
  });
  save();
  return decryptAll().then(function () {
    var bad = OW.items.filter(function (x) { return !x.data; }).length;
    toast(added + ' avis ajouté(s)' + (dup ? ', ' + dup + ' déjà présent(s)' : '') + (bad ? ', ' + bad + ' illisible(s)' : '') + '.');
    render();
  });
}
function owReadable() {
  var out = 'Avis reçus - Coach-Mass-KVES (export du ' + today() + ')\n\n';
  OW.items.slice().reverse().forEach(function (x) {
    var d = x.data;
    if (!d) return;
    out += '[' + (d.d || x.rec.added) + '] ' + d.n + ' <' + d.e + '> | ' + TYPE_LABEL[d.t] + (d.r ? ' | note ' + d.r + '/5' : '') + ' | v' + d.a + ' | ' + d.s + ' | statut : ' + ST_LABEL[x.rec.st || 'new'] + '\n' + d.m + '\n\n';
  });
  return out;
}

/* envoi par l'utilisateur */
function avText(code) { return 'Avis pour Coach-Mass-KVES (chiffré : seul le propriétaire peut le lire)\n' + code; }
function avValidate() {
  var n = AV.name.trim(), e = AV.email.trim(), m = AV.msg.trim();
  if (n.length < 2) return 'Écris ton nom.';
  if (!EMAIL_RE.test(e)) return 'Écris une adresse e-mail valide.';
  if (m.length < 5) return 'Écris ton message (5 caractères minimum).';
  if (/CM[01]\.[A-Za-z0-9_-]{40,}/.test(m) || /^Avis pour Coach/i.test(m)) return 'Ton message contient un code d\'avis déjà chiffré. Efface-le et écris ton texte à la main.';
  if (!AV.consent) return 'Coche la case pour accepter.';
  var last = D.avis.sent[0];
  if (last && Date.now() - last.id < 30000) return 'Attends quelques secondes avant un nouvel avis.';
  return '';
}
function avPrepare() {
  if (AV.busy) return;
  if (!CFG.publicKey) { toast('La boîte à avis n\'est pas encore activée.'); return; }
  var err = avValidate();
  if (err) { toast(err); return; }
  if (!subtle()) { toast('Le chiffrement n\'est pas disponible dans ce navigateur.'); return; }
  AV.busy = true; render();
  var payload = { v: 1, n: AV.name.trim(), e: AV.email.trim(), t: AV.type, r: AV.note, m: AV.msg.trim(), d: today() + ' ' + pad(new Date().getHours()) + ':' + pad(new Date().getMinutes()), a: VERSION, s: window.innerWidth + 'x' + window.innerHeight };
  avisEncrypt(payload, CFG.publicKey).then(function (code) {
    P.avisName = payload.n; P.avisEmail = payload.e;
    var it = { id: Date.now(), date: today(), type: AV.type, code: code, shared: false };
    D.avis.sent.unshift(it);
    AV.last = it.id; AV.msg = ''; AV.note = 0; AV.consent = false; AV.busy = false;
    save(); render(); toast('Avis chiffré. Choisis comment l\'envoyer.');
  }).catch(function () { AV.busy = false; render(); toast('Le chiffrement a échoué sur cet appareil.'); });
}
function avShare(it, via) {
  var text = avText(it.code);
  function mark() { it.shared = true; save(); render(); }
  if (via === 'mail' && CFG.email) {
    mark(); window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent('Avis Coach-Mass-KVES') + '&body=' + encodeURIComponent(text);
  } else if (via === 'wa' && CFG.whatsapp) {
    mark(); window.open('https://wa.me/' + String(CFG.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(text), '_blank');
  } else if (navigator.share) {
    navigator.share({ title: 'Avis Coach-Mass-KVES', text: text }).then(mark).catch(function () {});
  } else { copyText(text); }
}

/* vues */
function backBtn() { return '<button class="btn alt sm back" data-act="tab" data-v="more">← Plus</button>'; }
function viewMore() {
  return '<h1>Plus</h1>' +
    '<div class="card"><h2>Boîte à avis</h2><p class="small">Une idée, un problème, un merci ? Ton avis est chiffré sur ton téléphone avant l\'envoi : seul le propriétaire de l\'application peut le lire.</p><button class="btn" data-act="tab" data-v="avis">Donner mon avis</button></div>' +
    '<div class="card"><h2>Réglages</h2><p class="small">Jours de séance, voix, sons, objectif de poids, rotation de l\'écran.</p><button class="btn alt" data-act="tab" data-v="settings">Ouvrir les réglages</button></div>' +
    '<div class="card"><h2>À propos</h2><img class="banner" src="banner.jpg" alt="' + NOM + '" width="1200" height="593"><p class="small">' + NOM + ' · version ' + VERSION + ' · © ' + AUTEUR + '. Tes données restent sur ton téléphone.</p><button class="btn alt sm back" data-act="tab" data-v="owner">Espace propriétaire</button></div>';
}
function avItem(it, i) {
  var share = navigator.share ? '<button class="btn sm grow" data-act="avshare" data-i="' + i + '" data-via="share">Partager</button>' : '';
  var mail = CFG.email ? '<button class="btn alt sm" data-act="avshare" data-i="' + i + '" data-via="mail">E-mail</button>' : '';
  var wa = CFG.whatsapp ? '<button class="btn alt sm" data-act="avshare" data-i="' + i + '" data-via="wa">WhatsApp</button>' : '';
  return '<div class="card' + (it.id === AV.last ? ' coach' : '') + '"><div class="row"><b class="grow">' + esc(TYPE_LABEL[it.type] || 'Avis') + ' · ' + esc(it.date) + '</b><span class="pill' + (it.shared ? ' ok' : '') + '">' + (it.shared ? 'partagé' : 'à envoyer') + '</span></div>' +
    (it.id === AV.last && !it.shared ? '<p class="small">Ton avis est chiffré et prêt. Choisis comment l\'envoyer au propriétaire.</p>' : '') +
    '<div class="row">' + share + mail + wa + '<button class="btn alt sm" data-act="avcopy" data-i="' + i + '">Copier le code</button></div>' +
    '<details><summary>Voir le code chiffré</summary><textarea readonly rows="4" class="code" aria-label="Code chiffré">' + esc(it.code) + '</textarea></details>' +
    '<button class="btn alt sm back" data-act="avdel" data-i="' + i + '">' + (avDelArmed === it.id ? 'Confirmer la suppression' : 'Supprimer') + '</button></div>';
}
function viewAvis() {
  var h = backBtn() + '<h1>Boîte à avis</h1><p class="small">Dis-moi ce qui marche, ce qui manque, ce qui te gêne. Ton message est chiffré avant de quitter ton téléphone.</p>';
  if (!CFG.publicKey) {
    h += '<div class="card"><h2>Pas encore activée</h2><p>Le propriétaire n\'a pas encore activé la boîte à avis. Reviens après la prochaine mise à jour.</p></div>';
  } else {
    h += '<div class="card"><h2>Ton avis</h2>' +
      '<label class="f">Ton nom<input type="text" data-av="name" value="' + esc(AV.name) + '" maxlength="60" autocomplete="name"></label>' +
      '<label class="f">Ton e-mail (pour te répondre)<input type="email" data-av="email" value="' + esc(AV.email) + '" maxlength="120" inputmode="email" autocomplete="email"></label>' +
      '<div class="chips" role="group" aria-label="Type d\'avis">' + Object.keys(AV_TYPES).map(function (k) { return '<button class="chip' + (AV.type === k ? ' on' : '') + '" data-act="avtype" data-v="' + k + '">' + AV_TYPES[k] + '</button>'; }).join('') + '</div>' +
      '<label class="f">Note de l\'application (facultatif)</label><div class="seg">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="avnote" data-n="' + n + '" class="' + (AV.note === n ? 'on' : '') + '">' + n + '</button>'; }).join('') + '</div>' +
      '<label class="f">Ton message<textarea data-av="msg" rows="5" maxlength="800">' + esc(AV.msg) + '</textarea></label><p class="small" id="av_cnt">' + AV.msg.length + ' / 800</p>' +
      '<label class="meal"><input type="checkbox" data-av="consent"' + (AV.consent ? ' checked' : '') + '><span>J\'accepte que le propriétaire lise mon nom, mon e-mail et mon message pour me répondre et améliorer l\'application. Ces informations sont chiffrées avec l\'avis.</span></label>' +
      '<button class="btn" data-act="avsend"' + (AV.busy ? ' disabled' : '') + '>' + (AV.busy ? 'Chiffrement…' : 'Préparer l\'envoi') + '</button>' +
      '<p class="small">Tu choisis ensuite toi-même comment l\'envoyer (partage, e-mail, messagerie). Ton identité n\'est pas vérifiée.</p></div>';
  }
  if (D.avis.sent.length) h += '<h2>Mes avis</h2>' + D.avis.sent.map(avItem).join('');
  return h;
}

function viewOwner() {
  var rec = ownerRec(), h = backBtn() + '<h1>Espace propriétaire</h1>';
  if (!rec) {
    h += '<div class="card"><h2>Crée ta clé</h2><p class="small">Cette clé sert à lire les avis. Elle reste sur ce téléphone, protégée par une phrase secrète. Si tu l\'oublies, les avis reçus seront définitivement illisibles : fais ensuite une sauvegarde de la clé.</p>' +
      '<label class="f">Phrase secrète (10 caractères minimum)<input type="password" id="ow_p1" autocomplete="new-password"></label>' +
      '<label class="f">Répète-la<input type="password" id="ow_p2" autocomplete="new-password"></label>' +
      '<button class="btn" data-act="owcreate"' + (OW.busy ? ' disabled' : '') + '>' + (OW.busy ? 'Calcul en cours…' : 'Créer ma clé') + '</button></div>' +
      '<div class="card"><h2>J\'ai déjà une sauvegarde</h2><p class="small">Importe le fichier de clé enregistré avec « Sauvegarder ma clé ».</p><button class="btn alt" data-act="owimportkey">Importer ma clé</button></div>';
    return h;
  }
  var match = !!(CFG.publicKey && CFG.publicKey.x === rec.pub.x && CFG.publicKey.y === rec.pub.y);
  h += '<div class="card"><div class="row"><h2 class="grow">Ma clé</h2><span class="pill' + (match ? ' ok' : '') + '">' + (match ? 'active sur le site' : 'pas encore sur le site') + '</span></div>';
  if (!match) {
    h += '<p>Dernière étape : active la boîte à avis pour tes utilisateurs. Tant que ce n\'est pas fait, personne ne peut t\'envoyer d\'avis.</p><ol class="small steps"><li>Touche « Copier » ci-dessous.</li><li>Sur github.com, ouvre ton dépôt, puis le fichier <b>avis-config.js</b>.</li><li>Touche le crayon, remplace tout le contenu par le texte copié, puis « Commit changes ».</li><li>Attends 2 minutes, puis rouvre l\'application.</li></ol>' +
      '<textarea readonly rows="6" class="code" aria-label="Contenu de avis-config.js">' + esc(cfgText(rec.pub)) + '</textarea><button class="btn sm" data-act="owcfgcopy">Copier</button>';
  } else {
    h += '<p class="small">Les utilisateurs peuvent t\'envoyer des avis chiffrés. Garde une sauvegarde de ta clé.</p>';
  }
  h += '<div class="row"><button class="btn alt sm grow" data-act="owexportkey">Sauvegarder ma clé</button><button class="btn alt sm" data-act="owdelkey">' + (OW.armed === 'key' ? 'Confirmer : supprimer la clé' : 'Supprimer la clé') + '</button></div></div>';
  if (!OW.priv) {
    h += '<div class="card"><h2>Lire mes avis</h2><label class="f">Phrase secrète<input type="password" id="ow_p" autocomplete="current-password"></label><button class="btn" data-act="owunlock"' + (OW.busy ? ' disabled' : '') + '>' + (OW.busy ? 'Calcul en cours…' : 'Déverrouiller') + '</button><p class="small">' + D.avis.inbox.length + ' avis conservés, chiffrés, sur ce téléphone.</p></div>';
    return h;
  }
  var items = OW.items || [], nNew = items.filter(function (x) { return (x.rec.st || 'new') === 'new'; }).length;
  h += '<div class="card"><div class="row"><h2 class="grow">Avis reçus</h2><span class="pill on">' + nNew + ' nouveau' + (nNew > 1 ? 'x' : '') + '</span></div>' +
    '<label class="f">Colle ici le ou les avis reçus (message, e-mail ou WhatsApp)<textarea id="ow_paste" rows="4" placeholder="CM1...."></textarea></label>' +
    '<div class="row"><button class="btn sm grow" data-act="owadd">Ajouter</button><button class="btn alt sm" data-act="owfile">Importer un fichier</button></div></div>';
  h += '<div class="chips" role="group" aria-label="Filtrer">' + [['all', 'Tous'], ['new', 'Nouveaux'], ['todo', 'À traiter'], ['done', 'Fait']].map(function (f) { return '<button class="chip' + (OW.filter === f[0] ? ' on' : '') + '" data-act="owfilter" data-v="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div>';
  var shown = 0;
  for (var i = items.length - 1; i >= 0; i--) {
    var x = items[i], st = x.rec.st || 'new';
    if (OW.filter !== 'all' && OW.filter !== st) continue;
    shown++;
    var d = x.data;
    if (!d) {
      h += '<div class="card"><div class="row"><b class="grow">Avis illisible</b><span class="pill">' + esc(x.rec.added) + '</span></div><p class="small">Chiffré avec une autre clé, ou message abîmé.</p><button class="btn alt sm back" data-act="owdel" data-i="' + i + '">' + (OW.armed === 'd' + i ? 'Confirmer' : 'Supprimer') + '</button></div>';
      continue;
    }
    var okMail = EMAIL_RE.test(d.e);
    h += '<div class="card"><div class="row"><b class="grow">' + esc(d.n) + '</b><span class="pill">' + esc(TYPE_LABEL[d.t]) + '</span>' + (d.r ? '<span class="pill on">' + d.r + '/5</span>' : '') + '</div>' +
      '<p class="small">' + esc(d.d || x.rec.added) + ' · ' + esc(d.e) + ' · v' + esc(d.a) + ' · ' + esc(d.s) + '</p>' +
      '<p class="msgtxt">' + esc(d.m) + '</p><div class="row">' +
      '<button class="btn sm" data-act="owstatus" data-i="' + i + '">' + ST_LABEL[st] + '</button>' +
      (okMail ? '<a class="btn alt sm linkbtn" href="mailto:' + esc(d.e) + '?subject=' + encodeURIComponent('Re : ton avis sur Coach-Mass-KVES') + '">Répondre</a>' : '') +
      '<button class="btn alt sm" data-act="owdel" data-i="' + i + '">' + (OW.armed === 'd' + i ? 'Confirmer' : 'Supprimer') + '</button></div></div>';
  }
  if (!shown) h += '<div class="card"><p class="small">' + (items.length ? 'Aucun avis dans ce filtre.' : 'Aucun avis pour le moment. Quand un utilisateur t\'en envoie un, colle-le ci-dessus.') + '</p></div>';
  h += '<div class="card"><h2>Garder et analyser</h2><p class="small">Les avis restent chiffrés sur ton téléphone, y compris dans la sauvegarde de l\'application. Pour les analyser avec moi, copie-les en clair et colle-les dans la conversation.</p><div class="row"><button class="btn alt sm grow" data-act="owcopyall">Copier tous les avis (lisible)</button><button class="btn alt sm" data-act="owexport">Fichier .txt</button></div><button class="btn alt sm back" data-act="owlock">Verrouiller</button></div>';
  return h;
}

/* événements de la boîte à avis */
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a.indexOf('av') !== 0 && a.indexOf('ow') !== 0) return;
  var i = +t.getAttribute('data-i');
  if (a === 'avtype') { AV.type = t.getAttribute('data-v'); render(); return; }
  if (a === 'avnote') { var n = +t.getAttribute('data-n'); AV.note = AV.note === n ? 0 : n; render(); return; }
  if (a === 'avsend') { avPrepare(); return; }
  if (a === 'avshare') { if (D.avis.sent[i]) avShare(D.avis.sent[i], t.getAttribute('data-via')); return; }
  if (a === 'avcopy') { if (D.avis.sent[i]) copyText(avText(D.avis.sent[i].code)); return; }
  if (a === 'avdel') {
    var it = D.avis.sent[i];
    if (!it) return;
    if (avDelArmed !== it.id) { avDelArmed = it.id; render(); return; }
    D.avis.sent.splice(i, 1); avDelArmed = 0; save(); render(); return;
  }
  if (a !== 'owdel' && a !== 'owdelkey') OW.armed = '';
  if (a === 'owcreate') {
    var p1 = $('#ow_p1').value, p2 = $('#ow_p2').value;
    if (p1.length < 10) { toast('La phrase secrète doit faire au moins 10 caractères.'); return; }
    if (p1 !== p2) { toast('Les deux phrases ne sont pas identiques.'); return; }
    if (!subtle()) { toast('Le chiffrement n\'est pas disponible dans ce navigateur.'); return; }
    OW.busy = true; render();
    ownerCreate(p1).then(function () { return ownerUnlock(p1); }).then(function () { OW.busy = false; render(); toast('Clé créée. Fais une sauvegarde de ta clé.'); })
      .catch(function () { OW.busy = false; render(); toast('Création impossible sur cet appareil.'); });
    return;
  }
  if (a === 'owunlock') {
    var p = $('#ow_p').value;
    if (!p) { toast('Écris ta phrase secrète.'); return; }
    OW.busy = true; render();
    ownerUnlock(p).then(function () { OW.busy = false; render(); }).catch(function () { OW.busy = false; render(); toast('Phrase secrète incorrecte.'); });
    return;
  }
  if (a === 'owlock') { owLock(); render(); return; }
  if (a === 'owexportkey') { var rec = ownerRec(); if (rec) download('coach-mass-kves-cle-proprietaire.json', JSON.stringify(rec), 'application/json'); return; }
  if (a === 'owimportkey') { $('#keyFile').click(); return; }
  if (a === 'owdelkey') {
    if (OW.armed !== 'key') { OW.armed = 'key'; render(); return; }
    try { localStorage.removeItem(OWNER_KEY); } catch (e) {}
    owLock(); OW.armed = ''; render(); toast('Clé supprimée de cet appareil.'); return;
  }
  if (a === 'owcfgcopy') { var r2 = ownerRec(); if (r2) copyText(cfgText(r2.pub)); return; }
  if (a === 'owadd') { var tx = $('#ow_paste'); if (tx && tx.value) owIngest(tx.value); else toast('Colle d\'abord un avis.'); return; }
  if (a === 'owfile') { $('#avisFile').click(); return; }
  if (a === 'owfilter') { OW.filter = t.getAttribute('data-v'); render(); return; }
  if (a === 'owstatus') {
    var x = OW.items && OW.items[i];
    if (x) { x.rec.st = { 'new': 'todo', todo: 'done', done: 'new' }[x.rec.st || 'new']; save(); render(); }
    return;
  }
  if (a === 'owdel') {
    if (OW.armed !== 'd' + i) { OW.armed = 'd' + i; render(); return; }
    var y = OW.items && OW.items[i];
    if (y) { D.avis.inbox.splice(D.avis.inbox.indexOf(y.rec), 1); OW.armed = ''; save(); decryptAll().then(render); }
    return;
  }
  if (a === 'owcopyall') { if (OW.items) copyText(owReadable()); return; }
  if (a === 'owexport') { if (OW.items) download('coach-mass-kves-avis.txt', owReadable(), 'text/plain'); return; }
});
$('#keyFile').addEventListener('change', function (ev) {
  var f = ev.target.files && ev.target.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function () {
    try {
      var o = JSON.parse(r.result);
      if (!(o && o.v === 1 && o.pub && o.salt && o.iv && o.ct && +o.it >= 100000 && +o.it <= 2000000)) throw 0;
      if (ownerRec()) { toast('Une clé existe déjà sur cet appareil. Supprime-la d\'abord.'); return; }
      localStorage.setItem(OWNER_KEY, JSON.stringify({ v: 1, it: +o.it, salt: o.salt, iv: o.iv, ct: o.ct, pub: { kty: o.pub.kty, crv: o.pub.crv, x: o.pub.x, y: o.pub.y } }));
      toast('Clé importée. Déverrouille-la avec ta phrase secrète.'); render();
    } catch (e) { toast('Fichier de clé invalide.'); }
  };
  r.readAsText(f); ev.target.value = '';
});
$('#avisFile').addEventListener('change', function (ev) {
  var files = ev.target.files ? Array.prototype.slice.call(ev.target.files) : [];
  if (!files.length) return;
  Promise.all(files.map(function (f) { return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(String(r.result)); }; r.onerror = function () { res(''); }; r.readAsText(f); }); }))
    .then(function (txts) { return owIngest(txts.join('\n')); });
  ev.target.value = '';
});
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') OW.hiddenAt = Date.now();
  else if (OW.priv && OW.hiddenAt && Date.now() - OW.hiddenAt > 5 * 60000) { owLock(); render(); }
});

/* © KVES · Coach-Mass-KVES */
/* ====================== v7 : thème, courses, rappels, mini-compteurs ====================== */
/* thème */
function applyTheme() {
  var th = P.theme || 'auto', r = document.documentElement;
  if (th === 'light' || th === 'dark') r.setAttribute('data-theme', th); else r.removeAttribute('data-theme');
  var light = th === 'light' || (th === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.removeAttribute('media'); m.setAttribute('content', light ? '#F2F4F3' : '#0C1318'); });
}
if (window.matchMedia) {
  try { window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { if ((P.theme || 'auto') === 'auto') applyTheme(); }); } catch (e) {}
}
applyTheme();
function themeCard() {
  var th = P.theme || 'auto';
  return '<div class="seg" role="group" aria-label="Thème">' + [['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']].map(function (x) { return '<button data-act="theme" data-v="' + x[0] + '" class="' + (th === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div><p class="small">Auto suit le mode clair ou sombre d\'Android. Le fond, la barre d\'état et les graphiques suivent ton choix.</p>';
}

/* © KVES · Coach-Mass-KVES */
/* liste de courses */
function qG(g) { return g >= 1000 ? (Math.round(g / 100) / 10).toString().replace('.', ',') + ' kg' : g + ' g'; }
function qL(l) { return (Math.ceil(l * 2) / 2).toString().replace('.', ',') + ' L'; }
function shopList() {
  var d = P.shopDays || 7, ex = P.kcalAdj >= 300 ? d : 0;
  var a3 = P.shopM3 === 'poulet' ? d : P.shopM3 === 'sardines' ? 0 : Math.ceil(d / 2), s3 = d - a3;
  var a5 = P.shopM5 === 'lentilles' ? d : P.shopM5 === 'pois' ? 0 : Math.ceil(d / 2), p5 = d - a5;
  var L = [
    ['oeufs', 'Œufs', String(d * 5)], ['pain', 'Pain', String(d * 3 + ex)],
    ['lait', 'Lait', qL(d * 0.55 + ex * 0.25)], ['cacao', 'Cacao en poudre (lait au chocolat)', d + ' verres'],
    ['bananes', 'Bananes', String(d * 2)], ['flocons', 'Flocons d\'avoine', qG(d * 40)],
    ['amlou', 'Amlou ou beurre de cacahuète', qG(d * 30 + ex * 15)], ['huile', 'Huile d\'olive', Math.round(d * 30 + 0) + ' ml'],
    ['yaourts', 'Yaourts', String(d)], ['riz', 'Riz', qG(d * 80)], ['legumes', 'Légumes de saison (environ)', qG(d * 200)]
  ];
  if (a3) L.push(['poulet', 'Poulet', qG(a3 * 150)]);
  if (s3) L.push(['sardines', 'Sardines', s3 * 4 + ' pièces']);
  if (a5) L.push(['lentilles', 'Lentilles sèches', qG(a5 * 60)]);
  if (p5) L.push(['pois', 'Pois chiches secs', qG(p5 * 60)]);
  return L;
}
function shopSeg(act, cur, opts) {
  return '<div class="seg" role="group">' + opts.map(function (o) { return '<button data-act="' + act + '" data-v="' + o[0] + '" class="' + (String(cur) === String(o[0]) ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>';
}
function shopCard() {
  var done = P.shopDone || {}, L = shopList(), n = 0;
  var h = '<div class="card"><h2>Liste de courses</h2><p class="small">Choisis tes variantes : la liste se calcule toute seule, d\'après les repas ci-dessus.</p>' +
    '<label class="f">Pour combien de jours</label>' + shopSeg('shopdays', P.shopDays, [[3, '3 jours'], [7, '7 jours'], [14, '14 jours']]) +
    '<label class="f">Repas de 14 h 30</label>' + shopSeg('shopm3', P.shopM3, [['poulet', 'Poulet'], ['sardines', 'Sardines'], ['mix', 'Alterné']]) +
    '<label class="f">Repas de 21 h 30</label>' + shopSeg('shopm5', P.shopM5, [['lentilles', 'Lentilles'], ['pois', 'Pois chiches'], ['mix', 'Alterné']]) + '<div class="shop">';
  L.forEach(function (x) {
    if (done[x[0]]) n++;
    h += '<label class="meal"><input type="checkbox" data-shop="' + x[0] + '"' + (done[x[0]] ? ' checked' : '') + '><span>' + esc(x[1]) + '</span><span class="k">' + esc(x[2]) + '</span></label>';
  });
  return h + '</div><p class="small">Quantités par jour : voir les repas. Légumes estimés, lentilles et pois chiches comptés secs (60 g secs pour 150 g cuits). Les prix varient : aucun coût n\'est affiché.</p>' +
    '<div class="row"><button class="btn sm grow" data-act="shopcopy">Copier la liste</button><button class="btn alt sm" data-act="shopreset">Tout décocher</button></div></div>';
}
function shopText() {
  return 'Courses (' + P.shopDays + ' jours)\n' + shopList().map(function (x) { return '- ' + x[1] + ' : ' + x[2]; }).join('\n');
}

/* © KVES · Coach-Mass-KVES */
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
  navigator.serviceWorker.ready.then(function (reg) { reg.showNotification('Coach-Mass-KVES', { body: txt, tag: tag, icon: 'icon-192.png', badge: 'icon-192.png', vibrate: [200, 100, 200] }); }).catch(function () {});
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
    '<div class="row"><button class="btn alt sm" data-act="rmtest">Tester</button><a class="btn alt sm linkbtn" href="' + alarmHref(P.rmW, 'Coach-Mass-KVES : poids') + '">Alarme poids</a><a class="btn alt sm linkbtn" href="' + alarmHref(P.rmM, 'Coach-Mass-KVES : repas') + '">Alarme repas</a></div>' +
    '<p class="small">Si le bouton Alarme n\'ouvre rien, ouvre l\'Horloge et crée une alarme quotidienne à la main.</p></div>';
}

/* © KVES · Coach-Mass-KVES */
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


/* © KVES · Coach-Mass-KVES */
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
  var txt = JSON.stringify({ app: NOM, auteur: AUTEUR, coachMasse: VERSION, exportedAt: new Date().toISOString(), data: D });
  var name = 'coach-mass-kves-sauvegarde-' + today() + '.json', file = null;
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
    navigator.share({ files: [file], title: 'Sauvegarde Coach-Mass-KVES' }).then(bkMark).catch(function (e) { if (!e || e.name !== 'AbortError') dl(); });
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

/* © KVES · Coach-Mass-KVES */
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
/* © KVES · Coach-Mass-KVES */
applyRotate();
render();
requestAnimationFrame(frame);
if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); }
window.__coach = { D: function () { return D; }, startSession: startSession, render: render, setTab: function (t) { tab = t; render(); } };
})();
