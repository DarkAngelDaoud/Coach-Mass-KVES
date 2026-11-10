(function () {
'use strict';

/* ====================== données fixes ====================== */
var KEY = 'coach-masse-v1';
var JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

var VERSION = '2';
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

/* ====================== état ====================== */
function pad(n) { return String(n).padStart(2, '0'); }
function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function today() { return dstr(new Date()); }
function dnum(s) { return Math.round(new Date(s + 'T00:00:00').getTime() / 864e5); }

function defaults() {
  return {
    profile: { start: today(), w0: 75, goal: 80, height: 179, age: 41, days: [1, 3, 5], tempo: 3, voice: true, vib: true,
      count: true, auto: true, restBonus: 15, hasBar: false, cigs: false, kcalAdj: 0, lastAdj: '' },
    logs: {}, measures: [], sessions: [], levels: {}
  };
}
function normalize(o) {
  var d = defaults();
  o = o || {};
  return { profile: Object.assign(d.profile, o.profile || {}), logs: o.logs || {}, measures: o.measures || [], sessions: o.sessions || [], levels: o.levels || {} };
}
var D;
try { D = normalize(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch (e) { D = defaults(); }
var P = D.profile;
function save() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) {} }

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
  EX.forEach(function (e) {
    var L = lv(e.id), names = levelsFor(e), li = Math.min(L.level, names.length - 1);
    var tgt = e.timed ? (e.lo + L.off) + '–' + (e.hi + L.off) + ' s' : (e.lo + L.off) + '–' + (e.hi + L.off) + ' reps';
    h += '<div class="card"><div class="row"><h3 class="grow">' + esc(names[li]) + '</h3><span class="pill on">' + tgt + '</span></div>' + animBlock(e.id) + '<p class="small">' + esc(e.tip) + '</p></div>';
  });
  var last = D.sessions.slice(-5).reverse();
  if (last.length) h += '<div class="card"><h2>Dernières séances</h2><ul class="list">' + last.map(function (s) {
    return '<li><span>' + s.date + (s.partial ? ' · incomplète' : '') + '</span><span>' + s.min + ' min · ' + s.sets + ' séries</span></li>';
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
  h += '<details class="card"><summary>Liste de courses de la semaine</summary><ul class="list"><li><span>Œufs</span><span>35</span></li><li><span>Lait</span><span>5 L</span></li><li><span>Poulet ou sardines</span><span>1 kg</span></li><li><span>Lentilles ou pois chiches secs</span><span>500 g</span></li><li><span>Riz</span><span>600 g</span></li><li><span>Flocons d\'avoine</span><span>300 g</span></li><li><span>Bananes</span><span>14</span></li><li><span>Pains</span><span>20 à 25</span></li><li><span>Yaourts</span><span>7</span></li><li><span>Amlou ou beurre de cacahuète, huile d\'olive</span><span>1 pot, 1 bouteille</span></li></ul></details>';
  return h;
}

function chartSvg() {
  var a = weights(), t0 = P.start;
  if (!a.some(function (x) { return x.d === t0; })) a.unshift({ d: t0, w: +P.w0 });
  if (a.length < 2) return '<p class="small">Ajoute une pesée dans le bilan du jour pour voir ta courbe.</p>';
  var W = 340, H = 150, L = 34, R = 8, T = 10, B = 22;
  var ws = a.map(function (x) { return x.w; });
  var lo = Math.floor(Math.min.apply(null, ws) - 1), hi = Math.ceil(Math.max.apply(null, ws.concat([+P.goal])) + 1);
  var x0 = dnum(a[0].d), x1 = Math.max(dnum(a[a.length - 1].d), x0 + 7);
  function X(d) { return L + (dnum(d) - x0) / (x1 - x0) * (W - L - R); }
  function Y(w) { return T + (hi - w) / (hi - lo) * (H - T - B); }
  var line = a.map(function (p) { return X(p.d).toFixed(1) + ',' + Y(p.w).toFixed(1); }).join(' ');
  var gy = Y(+P.goal).toFixed(1);
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img" aria-label="Courbe de poids">';
  s += '<line x1="' + L + '" y1="' + gy + '" x2="' + (W - R) + '" y2="' + gy + '" stroke="var(--ok)" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<text x="' + (L - 4) + '" y="' + (+gy + 4) + '" text-anchor="end" fill="var(--ok)" font-size="10">' + P.goal + '</text>';
  s += '<text x="' + (L - 4) + '" y="' + (T + 4) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + hi + '</text>';
  s += '<text x="' + (L - 4) + '" y="' + (H - B + 4) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + lo + '</text>';
  s += '<line x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '" stroke="var(--line)"/>';
  s += '<polyline points="' + line + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>';
  a.forEach(function (p, i) { s += '<circle cx="' + X(p.d).toFixed(1) + '" cy="' + Y(p.w).toFixed(1) + '" r="' + (i === a.length - 1 ? 4.5 : 2.5) + '" fill="var(--accent)"/>'; });
  s += '</svg>';
  return s;
}

function viewTrack() {
  var cur = currentWeight(), sl = slopeWeek(28), goal = +P.goal;
  var eta = sl && sl > 0.05 && cur < goal ? Math.ceil((goal - cur) / sl) + ' sem.' : '—';
  var h = '<h1>Suivi</h1><div class="card"><div class="stats"><div class="stat"><b>' + fmt(cur) + '</b><span>kg actuel</span></div><div class="stat"><b>' + fmt(goal - cur) + '</b><span>kg restants</span></div><div class="stat"><b>' + eta + '</b><span>estimation</span></div></div>' + chartSvg() +
    '<p class="small">Rythme mesuré : ' + (sl === null ? 'pas assez de pesées (3 sur 10 jours minimum)' : fmt(sl, 2) + ' kg par semaine') + '. Cible saine : 0,25 à 0,5.</p></div>';
  h += '<div class="card"><h2>Cette semaine</h2><div class="row"><b>' + sessionsThisWeek() + ' / ' + P.days.length + '</b><span class="small">séances faites</span></div></div>';
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

function tog(key, label, hint) {
  return '<label class="meal"><input type="checkbox" data-set="' + key + '"' + (P[key] ? ' checked' : '') + '><span><b>' + label + '</b>' + (hint ? '<br><span class="small">' + hint + '</span>' : '') + '</span></label>';
}
function viewSettings() {
  var h = '<h1>Réglages</h1><div class="card"><h2>Jours de séance</h2><div class="seg">' +
    [1, 2, 3, 4, 5, 6, 0].map(function (d) { return '<button data-act="day" data-d="' + d + '" class="' + (isTrainDay(d) ? 'on' : '') + '">' + JOURS[d] + '</button>'; }).join('') + '</div></div>';
  h += '<div class="card"><h2>Coach</h2>' + tog('voice', 'Voix du coach', 'Parle en français dans tes écouteurs') + tog('vib', 'Vibrations') + tog('count', 'Compter les répétitions à voix haute', 'Le coach donne le rythme') + tog('auto', 'Enchaînement automatique', 'Mains libres : le coach relance après le repos') +
    '<div class="grid2"><label class="f">Secondes par répétition<input type="number" inputmode="numeric" min="2" max="6" data-set="tempo" value="' + P.tempo + '"></label>' +
    '<label class="f">Repos en plus (secondes)<input type="number" inputmode="numeric" min="0" max="60" step="5" data-set="restBonus" value="' + P.restBonus + '"></label></div>' +
    '<button class="btn alt sm" data-act="testvoice">Tester la voix</button></div>';
  h += '<div class="card"><h2>Profil et objectif</h2><div class="grid2">' +
    '<label class="f">Poids de départ (kg)<input type="number" inputmode="decimal" step="0.1" data-set="w0" value="' + P.w0 + '"></label>' +
    '<label class="f">Objectif (kg)<input type="number" inputmode="decimal" step="0.5" data-set="goal" value="' + P.goal + '"></label>' +
    '<label class="f">Date de départ<input type="text" data-set="start" value="' + P.start + '"></label></div>' +
    tog('hasBar', 'J\'ai une barre de traction', 'Ajoute les tractions au tirage') + tog('cigs', 'Suivre mes cigarettes', 'Un compteur dans le bilan du jour') + '</div>';
  h += '<div class="card"><h2>Données</h2><button class="btn bad sm" data-act="reset">' + (resetArmed ? 'Confirmer : tout effacer' : 'Effacer toutes les données') + '</button><p class="small">Version ' + VERSION + '</p></div>';
  return h;
}
var resetArmed = false;

function render() {
  $('#weekTag').textContent = 'Semaine ' + wkNo() + ' · ' + fmt(currentWeight()) + ' kg → ' + P.goal;
  var map = { today: viewToday, train: viewTrain, meals: viewMeals, track: viewTrack, settings: viewSettings };
  view.innerHTML = map[tab]();
  document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === tab); });
}

/* ====================== audio, voix, vibration ====================== */
var actx = null;
function beep(f, ms) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    var o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = f || 880; g.gain.value = 0.15; o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + (ms || 120) / 1000);
  } catch (e) {}
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
function vib(p) { if (P.vib) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} } }
var wl = null;
function wake() { try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (s) { wl = s; }).catch(function () {}); } catch (e) {} }
function unwake() { try { wl && wl.release(); } catch (e) {} wl = null; }
document.addEventListener('visibilitychange', function () { if (R && document.visibilityState === 'visible') wake(); });

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
  wake();
  say(light ? 'Séance allégée aujourd\'hui. Échauffement.' : 'Séance. Échauffement d\'abord.');
  advance();
}

function clearTimer() { if (R) { if (R.timer) { clearInterval(R.timer); R.timer = null; } R.last = -1; } }
function setTimer(sec, onTick, onEnd) {
  clearTimer();
  R.endAt = performance.now() + sec * 1000; R.last = -1;
  R.timer = setInterval(function () {
    if (!R || R.paused) return;
    var left = Math.ceil((R.endAt - performance.now()) / 1000);
    if (left !== R.last) { R.last = left; onTick(Math.max(0, left)); }
    if (left <= 0) { clearTimer(); onEnd(); }
  }, 200);
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
    setTimer(s.sec, function (left) { setTxt('tmr', left); if (left > 0 && left <= 3) { beep(660, 80); vib(40); } }, function () { beep(880, 200); vib([120]); advance(); });
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
    setTimer(6, function (left) { setTxt('tmr', left); if (left > 0 && left <= 3) { beep(660, 80); vib(40); } }, work);
  }
}
function work() {
  var o = setInfo(), p = o.p;
  clearTimer(); R.phase = 'work'; R.count = 0; draw();
  beep(1000, 250); vib([200]);
  if (p.e.timed) {
    setTimer(p.hi, function (left) {
      setTxt('tmr', left);
      if (left === Math.floor(p.hi / 2)) say('Tiens. Moitié.');
      if (left === 10) say('Dix secondes. Ne lâche pas.');
      if (left > 0 && left <= 3) { beep(660, 80); vib(40); }
    }, function () { finishSet(p.hi); });
  } else if (P.count) {
    var tempo = Math.max(2, Math.round(+P.tempo || 3)), total = p.hi * tempo;
    setTimer(total, function (left) {
      var c = Math.floor((total - left) / tempo);
      if (c > R.count && c <= p.hi) { R.count = c; setTxt('cnt', c); say(c === p.hi ? c + '. Terminé.' : String(c)); vib(30); }
    }, function () { finishSet(p.hi); });
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
  var prev = lastReps(p.e.id, o.s.sn);
  R.logs.push({ id: p.e.id, hi: p.hi, sn: o.s.sn, reps: reps });
  R.reps = reps;
  if (R.i + 1 >= R.steps.length) return finish(false);
  R.phase = 'rest'; draw();
  var nx = R.steps[R.i + 1], np = R.plan[nx.pi];
  say('Repos. Prochain : ' + (nx.sn === 1 ? np.name : 'série ' + nx.sn) + '. Sois honnête sur tes répétitions.');
  setTimer(p.rest, function (left) {
    setTxt('tmr', left);
    if (left > 0 && left <= 3) { beep(660, 80); vib(40); }
  }, function () { beep(880, 200); vib([100, 60, 100]); advance(); });
}
function lastReps() { return null; }

function finish(partial) {
  clearTimer();
  var min = Math.max(1, Math.round((Date.now() - R.t0) / 60000));
  var ups = [];
  if (!partial) ups = applyProgress(R.logs);
  if (R.logs.length) D.sessions.push({ date: today(), min: min, sets: R.logs.length, partial: !!partial, light: R.light, week: wkNo(), logs: R.logs });
  save();
  R.phase = 'done'; R.ups = ups; R.min = min; R.partial = partial;
  unwake(); drawDone();
  if (!partial) { say('Séance terminée. ' + min + ' minutes. Maintenant, tu manges.'); vib([300, 100, 300]); }
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
    h += '<p class="title">' + esc(s.label) + '</p><div class="draw">' + animSvg(s.fig, R.paused ? 'hold' : 'loop', s.period) + '</div><div class="big" id="tmr">' + s.sec + '</div><p class="sub">secondes</p><button class="btn alt" data-act="skip">Passer</button>';
  } else {
    var p = R.plan[s.pi], e = p.e, unit = e.timed ? 'secondes' : 'répétitions';
    var ds = R.phase === 'rest' && R.steps[R.i + 1] ? R.plan[R.steps[R.i + 1].pi] : p;
    h += '<p class="title">' + esc(ds.name) + '</p><div class="draw">' + animSvg(ds.e.id, (R.paused || ds.e.timed) ? 'hold' : 'loop', Math.max(2, +P.tempo || 3)) + '</div>';
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
  }
  runner.innerHTML = h;
  if (R.last >= 0) setTxt('tmr', R.last);
  if (R.phase === 'work' && R.count) setTxt('cnt', R.count);
}
function drawDone() {
  var h = '<div class="rtop"><span class="small">' + (R.partial ? 'Séance interrompue' : 'Séance terminée') + '</span></div>';
  h += '<p class="title">' + (R.partial ? 'Séance incomplète enregistrée' : 'Séance validée') + '</p><div class="stats"><div class="stat"><b>' + R.min + '</b><span>minutes</span></div><div class="stat"><b>' + R.logs.length + '</b><span>séries</span></div><div class="stat"><b>' + R.logs.reduce(function (a, x) { return a + (R.plan.filter(function (p) { return p.e.id === x.id; })[0].e.timed ? 0 : x.reps); }, 0) + '</b><span>répétitions</span></div></div>';
  if (R.ups && R.ups.length) h += '<div class="card"><h2>Tu passes au niveau supérieur</h2><ul class="list">' + R.ups.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul></div>';
  h += '<div class="card coach"><span class="head">Le coach</span><p class="msg">' + (R.partial ? 'Tu as arrêté en route. La prochaine fois, tu vas au bout.' : 'Mange dans l\'heure, hydrate-toi, dors tes 7 heures. La séance ne compte que si la récupération suit.') + '</p></div>';
  h += '<button class="btn go" data-act="closerun">Fermer</button>';
  runner.innerHTML = h;
}

/* ====================== événements ====================== */
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a !== 'reset') resetArmed = false;
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
  if (a === 'testvoice') { say('Je suis ton coach. Pas d\'excuses. On commence.'); beep(880, 150); vib([150]); return; }
  if (a === 'export') { exportData(); return; }
  if (a === 'import') { $('#importFile').click(); return; }
  if (a === 'reset') {
    if (!resetArmed) { resetArmed = true; render(); return; }
    D = defaults(); P = D.profile; save(); resetArmed = false; render(); return;
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
    save(); render(); return;
  }
  if (t.getAttribute('data-act') === 'meal') {
    var lg = log(); lg.meals = lg.meals || []; lg.meals[+t.getAttribute('data-i')] = t.checked; save();
  }
});
$('#importFile').addEventListener('change', function (ev) {
  var f = ev.target.files && ev.target.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function () {
    try { var o = JSON.parse(r.result); if (!o || typeof o !== 'object') throw 0; D = normalize(o); P = D.profile; save(); render(); } catch (e) {}
  };
  r.readAsText(f);
  ev.target.value = '';
});
function exportData() {
  try {
    var b = new Blob([JSON.stringify(D)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = 'coach-masse-sauvegarde.json';
    document.body.appendChild(a); a.click(); a.remove();
  } catch (e) {}
}

render();
requestAnimationFrame(frame);
if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); }
window.__coach = { D: function () { return D; }, startSession: startSession, render: render, setTab: function (t) { tab = t; render(); } };
})();
