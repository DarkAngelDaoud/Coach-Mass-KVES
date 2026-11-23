/* © KVES · Coach-Mass-KVES. FICHIER GÉNÉRÉ par build.js à partir de src/. Ne le modifie pas à la main : modifie src/ puis lance : node build.js */
(function () {
'use strict';

/* © KVES · Coach-Mass-KVES */

/* ====================== données fixes ====================== */
var KEY = 'coach-masse-v1';
var JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

var VERSION = '18.5';
var NOM = 'Coach-Mass-KVES', AUTEUR = 'KVES';
var NOTES = ['Protection des données : une copie de sécurité est gardée à part, et si ton navigateur efface les données, l\'application te propose de les restaurer. Avant une mise à jour, tu peux d\'abord faire une sauvegarde.'];
var CD = window.CM_DATA;
if (!CD) { document.body.textContent = 'Fichier donnees.js introuvable : recharge la page ou réinstalle l\'application.'; return; }
var STRETCH = CD.STRETCH, WARM = CD.WARM, EX = CD.EX, LEGS = CD.LEGS, FIG = CD.FIG, FIGS = CD.FIGS, MEALS = CD.MEALS, EXTRA = CD.EXTRA, BASE_KCAL = CD.BASE_KCAL, SHOPN = CD.SHOPN, SHOP_ORDER = CD.SHOP_ORDER, SLOTS = CD.SLOTS, EXTRA_OPTS = CD.EXTRA_OPTS, ZONES = CD.ZONES, MUSCLE_NAMES = CD.MUSCLE_NAMES, META = CD.META, HL = CD.HL, RISK = CD.RISK;
function advOk() { return !!P.advOn || (lv('pompes').level >= 2 && lv('squats').level >= 1); }
function exLocked(e) { return !!e.adv && !advOk(); }
function selected(e) { return !exLocked(e) && (e.core ? (P.sessOff || []).indexOf(e.id) < 0 : (P.extras || []).indexOf(e.id) >= 0); }
function inSession(e) { return selected(e); }
/* surbrillance des muscles sur le corps de profil : [numéro du tracé, début, fin] en fraction de sa longueur */
/* © KVES · Coach-Mass-KVES */
/* ====================== état ====================== */
function pad(n) { return String(n).padStart(2, '0'); }
function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function today() { return dstr(new Date()); }
function dnum(s) { return Math.round(new Date(s + 'T00:00:00').getTime() / 864e5); }

/* version du format des données : à augmenter quand la forme de D change, avec une étape dans MIGR */
var SCHEMA = 1;
var MIGR = { 0: function (o) { return o; } }; /* 0 -> 1 : anciennes données sans numéro, rien à convertir */
function schemaOf(o) { return o && typeof o === 'object' && typeof o.schema === 'number' && isFinite(o.schema) ? Math.floor(o.schema) : 0; }
function migrate(o) {
  var v = schemaOf(o);
  while (v < SCHEMA) { if (MIGR[v]) o = MIGR[v](o) || o; v++; }
  return o;
}
function defaults() {
  return {
    schema: SCHEMA,
    profile: { start: today(), w0: 75, goal: 80, height: 179, age: 41, days: [1, 3, 5], tempo: 3, voice: true, voiceFr: false, tabac: false, absSkip: '', ignUpd: '', lvlDone: '', tabacFrom: '', phExp: '', deloadUntil: '', vib: true,
      count: true, auto: true, restBonus: 15, sound: true, rotate: false, metro: true, warn10: true, vol: 7, hasBar: false, cigs: false, kcalAdj: 0, lastAdj: '', bkLast: '', bkEvery: 7, vibLevel: 2, exCfg: {}, seenVersion: '', gender: 'n', obj: 'masse', onboarded: false, healthOk: false, early: false, rmWater: false, rmLe: '', mt1: '', mt2: '', mt3: '', mt4: '', mt5: '', deloadOn: '', deloadLast: 0, deloadSkip: 0, parq: '', parqDate: '', extras: [], sessOff: [], advOn: false, avisName: '', avisEmail: '', theme: 'auto', rmOn: false, rmW: '07:30', rmM: '22:00', rmLw: '', rmLm: '', lang: 'fr', noEgg: false, noMilk: false, noNuts: false, noGluten: false, veg: false, budget: 'normal', shopDays: 7, shopM3: 'mix', shopM5: 'mix', shopDone: {} },
    logs: {}, measures: [], sessions: [], levels: {}, avis: { sent: [], inbox: [] }
  };
}
/* nettoyage strict des données lues (stockage local, sauvegarde importée) : types forcés, clés sûres, tailles limitées */
var DATE_RE = /^\d{4}-\d{2}-\d{2}$/, KEY_RE = /^[A-Za-z0-9_.:-]{1,60}$/;
function numOr(v, dflt) { if (typeof v === 'string' && v.trim() !== '') v = Number(v); return typeof v === 'number' && isFinite(v) ? v : dflt; }
function cleanV(v, depth, cap) {
  if (typeof v === 'string') return v.slice(0, cap || 2000);
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  if (typeof v === 'boolean') return v;
  if (depth > 5 || !v || typeof v !== 'object') return null;
  var i, o;
  if (Array.isArray(v)) { var a = []; for (i = 0; i < v.length && i < 3000; i++) a.push(cleanV(v[i], depth + 1, cap)); return a; }
  o = {}; var ks = Object.keys(v);
  for (i = 0; i < ks.length && i < 400; i++) if (KEY_RE.test(ks[i]) && ks[i] !== '__proto__' && ks[i] !== 'constructor' && ks[i] !== 'prototype') o[ks[i]] = cleanV(v[ks[i]], depth + 1, cap);
  return o;
}
function cleanProfile(p, d) {
  var out = {}, k, dv, v;
  p = p && typeof p === 'object' && !Array.isArray(p) ? p : {};
  for (k in d) {
    dv = d[k]; v = Object.prototype.hasOwnProperty.call(p, k) ? p[k] : undefined;
    if (v === undefined || v === null) out[k] = dv;
    else if (typeof dv === 'number') out[k] = numOr(v, dv);
    else if (typeof dv === 'boolean') out[k] = !!v;
    else if (typeof dv === 'string') out[k] = typeof v === 'string' ? v.slice(0, 200) : dv;
    else if (Array.isArray(dv) && typeof dv[0] === 'number') out[k] = Array.isArray(v) ? v.slice(0, 20).map(function (x) { return numOr(x, null); }).filter(function (x) { return x !== null; }) : dv;
    else if (Array.isArray(dv)) out[k] = Array.isArray(v) ? v.slice(0, 100).map(function (x) { return typeof x === 'number' ? (isFinite(x) ? x : 0) : typeof x === 'string' ? x.slice(0, 60) : null; }).filter(function (x) { return x !== null; }) : dv;
    else if (dv && typeof dv === 'object' && k !== 'exCfg') out[k] = v && typeof v === 'object' && !Array.isArray(v) ? cleanV(v, 1) : dv;
    else if (dv && typeof dv === 'object') {
      var o2 = {};
      if (typeof v === 'object' && !Array.isArray(v)) Object.keys(v).slice(0, 100).forEach(function (kk) {
        var x = v[kk];
        if (KEY_RE.test(kk) && kk !== '__proto__' && x && typeof x === 'object') { var y = {}; Object.keys(x).slice(0, 20).forEach(function (k3) { var q = numOr(x[k3], null); if (q !== null && KEY_RE.test(k3) && k3 !== '__proto__') y[k3] = q; }); o2[kk] = y; }
      });
      out[k] = o2;
    } else out[k] = v;
  }
  for (k in p) if (!(k in d) && KEY_RE.test(k) && k !== '__proto__' && (typeof p[k] === 'string' || typeof p[k] === 'number' || typeof p[k] === 'boolean')) out[k] = typeof p[k] === 'string' ? p[k].slice(0, 200) : p[k];
  return out;
}
function normalize(o) {
  var d = defaults(), i, k, r;
  o = o && typeof o === 'object' ? migrate(o) : {};
  var logs = {}, lg = o.logs && typeof o.logs === 'object' && !Array.isArray(o.logs) ? o.logs : {};
  Object.keys(lg).slice(0, 5000).forEach(function (dk) { if (DATE_RE.test(dk) && lg[dk] && typeof lg[dk] === 'object') logs[dk] = cleanV(lg[dk], 1); });
  var measures = [];
  (Array.isArray(o.measures) ? o.measures : []).slice(0, 3000).forEach(function (m) {
    if (!m || typeof m !== 'object' || !DATE_RE.test(m.date)) return;
    r = { date: m.date }; Object.keys(m).forEach(function (mk) { if (mk !== 'date' && KEY_RE.test(mk) && mk !== '__proto__') { var q = numOr(m[mk], null); if (q !== null) r[mk] = q; } });
    measures.push(r);
  });
  var sessions = [];
  (Array.isArray(o.sessions) ? o.sessions : []).slice(0, 5000).forEach(function (s) {
    if (!s || typeof s !== 'object' || !DATE_RE.test(s.date)) return;
    r = cleanV(s, 1); r.date = s.date; r.min = numOr(s.min, 0); r.sets = numOr(s.sets, 0); r.rpe = Math.max(0, Math.min(5, Math.round(numOr(s.rpe, 0)))); sessions.push(r);
  });
  var levels = {}, lv0 = o.levels && typeof o.levels === 'object' && !Array.isArray(o.levels) ? o.levels : {};
  Object.keys(lv0).slice(0, 200).forEach(function (id) { if (KEY_RE.test(id) && id !== '__proto__' && lv0[id] && typeof lv0[id] === 'object') levels[id] = { level: numOr(lv0[id].level, 0), off: numOr(lv0[id].off, 0) }; });
  var av = o.avis && typeof o.avis === 'object' ? o.avis : {};
  return { schema: SCHEMA, profile: cleanProfile(o.profile, d.profile), logs: logs, measures: measures, sessions: sessions, levels: levels,
    avis: { sent: Array.isArray(av.sent) ? cleanV(av.sent, 2, 20000) : [], inbox: Array.isArray(av.inbox) ? cleanV(av.inbox, 2, 20000) : [] } };
}
var D;
var NEWER = false, STORE_EMPTY = false;
try {
  var rawD = JSON.parse(localStorage.getItem(KEY) || 'null');
  STORE_EMPTY = rawD === null;
  if (schemaOf(rawD) > SCHEMA) { NEWER = true; if (!localStorage.getItem(KEY + '-newer')) localStorage.setItem(KEY + '-newer', localStorage.getItem(KEY)); }
  D = normalize(rawD);
  if (rawD && !NEWER && schemaOf(rawD) < SCHEMA) localStorage.setItem(KEY, JSON.stringify(D));
} catch (e) { D = defaults(); try { window.__cmCorrupt = localStorage.getItem(KEY); } catch (e2) {} }
var P = D.profile;
function applyRotate() {
  try {
    var so = window.screen && window.screen.orientation;
    if (!so) return;
    if (P.rotate) { var r = so.lock && so.lock('any'); if (r && r.catch) r.catch(function () {}); }
    else if (so.unlock) so.unlock();
  } catch (e) {}
}
function saveFlag(ok) {
  var b = document.getElementById('savefail');
  if (ok) { if (b) b.remove(); return; }
  if (b) return;
  b = document.createElement('div'); b.id = 'savefail'; b.className = 'savefail'; b.setAttribute('role', 'alert');
  var t = document.createElement('p'); t.textContent = trText('Enregistrement impossible : stockage plein ou bloqué. Sauvegarde tes données maintenant.');
  var k = document.createElement('button'); k.className = 'btn sm'; k.setAttribute('data-act', 'bkexport'); k.textContent = trText('Sauvegarder maintenant');
  b.appendChild(t); b.appendChild(k); document.body.appendChild(b);
}
function save() { safeSoon(); var ok = true; try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { ok = false; } try { saveFlag(ok); } catch (e) {} try { syncRemind(); } catch (e) {} }

function log(d) { return D.logs[d || today()] || (D.logs[d || today()] = {}); }
function lv(id) { return D.levels[id] || (D.levels[id] = { level: 0, off: 0 }); }
function levelsFor(e) { return e.id === 'tirage' && P.hasBar ? e.levels.concat(['Tractions (barre)']) : e.levels; }
function wkNo() { return Math.max(1, Math.floor((dnum(today()) - dnum(P.start)) / 7) + 1); }
function isTrainDay(dow) { return P.days.indexOf(dow) >= 0; }
function doneToday() { return D.sessions.some(function (s) { return s.date === today() && !s.partial && !s.quick; }); }
function quickToday() { return D.sessions.some(function (s) { return s.date === today() && !s.partial && s.quick; }); }
function deloadActive() { return (!!P.deloadOn && P.deloadOn === weekStartStr()) || (!!P.deloadUntil && today() <= P.deloadUntil); }
function rpeLast3() {
  var a = D.sessions.filter(function (x) { return !x.partial && !x.free && !x.quick && +x.rpe > 0; }).slice(-3);
  return a.length === 3 ? (a[0].rpe + a[1].rpe + a[2].rpe) / 3 : null;
}
function deloadDue() {
  if (!P.onboarded || deloadActive()) return false;
  var wk = wkNo(), r = rpeLast3();
  if (P.deloadSkip === wk) return false;
  return (wk >= 5 && wk - P.deloadLast >= 5) || (r !== null && r >= 4.5 && wk - P.deloadLast >= 2);
}
function lastSessDate() { var m = ''; D.sessions.forEach(function (x) { if (x.date > m) m = x.date; }); return m; }
function absenceDays() {
  var l = lastSessDate(); if (!l) return 0;
  return Math.floor((new Date(today() + 'T00:00:00') - new Date(l + 'T00:00:00')) / 86400000);
}
function absenceDue() { return !!P.onboarded && !deloadActive() && absenceDays() >= 10 && P.absSkip !== lastSessDate(); }
function absenceCard() {
  return '<div class="card coach"><h2>Content de te revoir</h2><p class="small"><span>Dernière séance il y a</span> <b>' + absenceDays() + '</b> <span>jours</span></p><p class="small">Reprends en douceur : 7 jours allégés, puis retour au programme normal. Ton corps te remerciera.</p><button class="btn go" data-act="absgo">Reprendre en douceur</button><button class="btn alt" data-act="absskip">Reprendre normalement</button></div>';
}
function deloadCard() {
  if (absenceDue()) return absenceCard();
  if (deloadActive()) return '<div class="card coach"><h2>Semaine d\'allègement en cours</h2><p class="small">' + (P.deloadUntil && today() <= P.deloadUntil && P.deloadOn !== weekStartStr() ? 'Les séances sont allégées pendant 7 jours.' : 'Les séances sont allégées jusqu\'à dimanche.') + '</p><button class="btn alt sm" data-act="deloadstop">Arrêter l\'allègement</button></div>';
  if (deloadDue()) return '<div class="card"><h2>Semaine d\'allègement conseillée</h2><p class="small">Après plusieurs semaines d\'effort, ou si tes séances sont très dures, une semaine plus légère aide à récupérer et à progresser ensuite.</p><button class="btn alt" data-act="deloadon">Activer cette semaine</button><button class="btn alt sm" data-act="deloadskip">Pas maintenant</button></div>';
  return '';
}
function isLight() { var l = D.logs[today()] || {}; return deloadActive() || (l.sleep && +l.sleep < 6) || (l.energy && +l.energy <= 2); }
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
/* objectif, calories et repas */
var OBJ = { masse: 'Prise de masse', perte: 'Perte de poids', tonif: 'Tonification', maintien: 'Maintien' };
function obj() { return OBJ[P.obj] ? P.obj : 'masse'; }
function bmr() { var s = P.gender === 'h' ? 5 : P.gender === 'f' ? -161 : -78; return 10 * currentWeight() + 6.25 * (+P.height || 170) - 5 * (+P.age || 30) + s; }
function tdee() { return Math.round(bmr() * 1.4); }
function kcalFloor() { return P.gender === 'h' ? 1500 : P.gender === 'f' ? 1200 : 1350; }
function round10(x) { return Math.round(x / 10) * 10; }
/* calories des repas types (avant tout ajout) */
function kcalCore() {
  var o = obj(), t = tdee(), c;
  if (o === 'masse') return P.onboarded ? Math.max(1600, Math.min(3400, round10(t + 400))) : BASE_KCAL;
  if (o === 'perte') { c = Math.max(kcalFloor(), Math.round(t - Math.min(500, 0.2 * t))) + P.kcalAdj; return round10(Math.min(t, Math.max(kcalFloor(), Math.round(t * 0.75), c))); }
  return round10(Math.max(kcalFloor(), t + P.kcalAdj));
}
/* exclusions alimentaires du profil */
function dietEx() {
  var e = [];
  if (P.noEgg) e.push('oeuf'); if (P.noMilk) e.push('lait'); if (P.noNuts) e.push('noix'); if (P.noGluten) e.push('gluten');
  if (P.veg) { e.push('viande'); e.push('poisson'); }
  return e;
}
function okOpt(o) { var ex = dietEx(); if (o.lt && obj() === 'masse') return false; return !o.has.some(function (h) { return ex.indexOf(h) >= 0; }); }
function slotOpts(s) { var c = s.opts.filter(okOpt); if (obj() !== 'masse') { var l = c.filter(function (o) { return o.lt; }); if (l.length) return l; } return c; }
/* choix du jour pour un créneau : liste de [option, nombre de jours sur d] (variantes alternées si besoin) */
function slotChoices(s) {
  var comp = slotOpts(s), withV = comp.filter(function (o) { return o.v; });
  if (!withV.length) return [comp[0] || s.opts[s.opts.length - 1]];
  var first = withV[0], same = withV.filter(function (o) { return o.x.length >= 0; });
  /* variantes possibles = une option par clé v, la première compatible de chaque clé */
  var seen = {}, vs = [];
  withV.forEach(function (o) { if (!seen[o.v]) { seen[o.v] = 1; vs.push(o); } });
  if (P.budget === 'serre' && s.id === 'm3') { var nb = vs.filter(function (o) { return o.v !== 'poulet'; }); if (nb.length) vs = nb; }
  var pref = s.pref ? P[s.pref] : 'mix';
  if (pref !== 'mix') { var f = vs.filter(function (o) { return o.v === pref; }); if (f.length) return f; }
  return vs;
}
function slotVariants(s) { var seen = {}, n = []; slotOpts(s).forEach(function (o) { if (o.v && !seen[o.v]) { seen[o.v] = 1; n.push(o.v); } }); return n; }
var MT_DEF = ['09:30', '12:00', '14:30', '18:00', '21:30'];
function fmtT(m) { var h = Math.floor(m / 60), n = m % 60; return h + ' h' + (n ? ' ' + (n < 10 ? '0' : '') + n : ''); }
function mealMin(i) { var v = hm(P['mt' + (i + 1)]); return v !== null ? v : hm(MT_DEF[i]); }
function mealEff(i) {
  var a = [0, 1, 2, 3, 4].map(mealMin);
  if (P.early && a[4] > 20 * 60 + 30) { a[4] = 20 * 60 + 30; for (var j = 3; j >= 0; j--) if (a[j] > a[j + 1] - 120) a[j] = a[j + 1] - 120; }
  return a[i];
}
function mealT(s) { var i = +s.id.slice(1) - 1, v = hm(P['mt' + (i + 1)]); return P.early ? fmtT(mealEff(i)) : v !== null ? fmtT(v) : s.t; }
function mealTimesOk(a) { for (var i = 1; i < a.length; i++) if (a[i] - a[i - 1] < 120) return false; return true; }
function mealTimesCard() {
  var lab = ['Repas 1', 'Repas 2', 'Repas 3', 'Repas 4', 'Repas 5'];
  var h = '<div class="card"><h2>Heures des repas</h2><p class="small">Choisis l\'heure de chaque repas. Les repas non proposés pour ton objectif n\'apparaissent pas dans l\'onglet Repas. Garde au moins 2 h entre deux repas.</p><div class="grid2">';
  for (var i = 0; i < 5; i++) { var m = mealMin(i); h += '<label class="f">' + lab[i] + '<input type="time" data-mt="' + i + '" value="' + (m < 600 ? '0' : '') + Math.floor(m / 60) + ':' + (m % 60 < 10 ? '0' : '') + (m % 60) + '"></label>'; }
  h += '</div>';
  h += '<label class="meal"><input type="checkbox" data-early="1"' + (P.early ? ' checked' : '') + '><span>Dernier repas avant 20 h 30</span></label><p class="small">Le dernier repas est ramené à 20 h 30 au plus tard ; les repas précédents se décalent si besoin (2 h d\'écart minimum).</p>';
  if (!P.early && mealMin(4) > 21 * 60 + 30) h += '<p class="small">Un dernier repas après 21 h 30 peut gêner le sommeil et la digestion : garde-le léger.</p>';
  return h + '<button class="btn alt sm" data-act="mtreset">Heures par défaut</button></div>';
}
document.addEventListener('change', function (ev) {
  var t = ev.target; if (t && t.getAttribute && t.getAttribute('data-early') !== null) { P.early = !!t.checked; save(); render(); return; }
  if (!t || !t.getAttribute || t.getAttribute('data-mt') === null) return;
  var i = +t.getAttribute('data-mt'), v = hm(t.value);
  if (v === null) { render(); return; }
  var a = []; for (var k = 0; k < 5; k++) a.push(k === i ? v : mealMin(k));
  if (!mealTimesOk(a)) { toast('Les heures doivent rester dans l\'ordre, avec au moins 2 h d\'écart.'); render(); return; }
  P['mt' + (i + 1)] = t.value; save(); render();
});
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act=mtreset]');
  if (t) { for (var i = 1; i <= 5; i++) P['mt' + i] = ''; save(); render(); }
});
function slotMeal(s) {
  var ch = slotChoices(s), o = ch[0];
  var ob = { t: mealT(s), x: ch.length > 1 && o.mx ? o.mx : o.x, k: o.k, p: o.p, slot: s.id };
  return ob;
}
/* sous-ensemble de créneaux : tous, sans le smoothie, ou sans smoothie ni collation, selon la cible */
function planSlots() {
  var all = SLOTS, cand = [all, all.filter(function (s) { return s.id !== 'm2'; }), all.filter(function (s) { return s.id !== 'm2' && s.id !== 'm4'; })];
  var target = kcalCore();
  function base(l) { return l.reduce(function (a, s) { return a + slotMeal(s).k; }, 0); }
  if (obj() === 'masse') return all;
  var best = all, bd = 9;
  cand.forEach(function (l) { var f = target / base(l), d = Math.abs(Math.log(f)); if (f >= 0.7 && f <= 1.25 && d < bd) { bd = d; best = l; } });
  return best;
}
function planBase() { return planSlots().reduce(function (a, s) { return a + slotMeal(s).k; }, 0); }
function mealFactor() { return P.onboarded || obj() !== 'masse' ? kcalCore() / planBase() : 1; }
function kcalTarget() { return Math.max(1200, kcalCore() + (obj() === 'masse' ? P.kcalAdj : 0)); }
function protTarget() { var k = (obj() === 'masse' || obj() === 'perte') ? 1.8 : 1.6; return obj() === 'masse' && !P.onboarded ? 135 : Math.round(k * currentWeight() / 5) * 5; }
function extraMeal() { var o = EXTRA_OPTS.filter(okOpt)[0] || EXTRA_OPTS[1]; return { t: P.early ? 'Avec le dîner' : 'Avant de dormir', x: o.x, k: o.k, p: o.p, extra: true, shop: o.shop }; }
function mealsList() {
  var l = planSlots().map(slotMeal);
  if (obj() === 'masse' && P.kcalAdj >= 300) l.push(extraMeal());
  return l;
}
function mealK(m) { return m.extra ? m.k : round10(m.k * mealFactor()); }
function mealP(m) { return m.extra ? m.p : Math.round(m.p * mealFactor()); }
function eatenKcal() {
  var l = log(), m = mealsList(), s = 0;
  (l.meals || []).forEach(function (c, i) { if (c && m[i]) s += mealK(m[i]); });
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
  var s = slopeWeek(28), o = obj();
  if (s === null) return null;
  if (P.lastAdj && dnum(today()) - dnum(P.lastAdj) < 14) return null;
  if (o === 'masse') {
    if (s < 0.15 && P.kcalAdj < 900) return { v: 300, msg: 'Ton poids monte de ' + fmt(s, 2) + ' kg par semaine : trop lent. Ajoute 300 kcal par jour (un repas en plus avant de dormir).' };
    if (s > 0.7 && P.kcalAdj > -300) return { v: -200, msg: 'Ton poids monte de ' + fmt(s, 2) + ' kg par semaine : trop vite. Retire 200 kcal par jour.' };
    return null;
  }
  var low = Math.max(kcalFloor(), o === 'perte' ? Math.round(tdee() * 0.75) : 0);
  if (o === 'perte') {
    if (s > -0.15 && kcalTarget() - 150 >= low) return { v: -150, msg: 'Ton poids ne baisse que de ' + fmt(-s, 2) + ' kg par semaine (cible saine : 0,25 à 0,5). Retire 150 kcal par jour.' };
    if (s < -0.7) return { v: 200, msg: 'Tu perds ' + fmt(-s, 2) + ' kg par semaine : trop vite, tu risques de perdre du muscle. Ajoute 200 kcal par jour.' };
    return null;
  }
  if (s > 0.3) return { v: -150, msg: 'Ton poids monte de ' + fmt(s, 2) + ' kg par semaine alors que tu vises la stabilité. Retire 150 kcal par jour.' };
  if (s < -0.3) return { v: 150, msg: 'Ton poids baisse de ' + fmt(-s, 2) + ' kg par semaine alors que tu vises la stabilité. Ajoute 150 kcal par jour.' };
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
/* les muscles sollicités du mannequin de face se contractent au rythme du mouvement */
var EFF_B = ['tirage', 'pont', 'mollets', 'lateral', 'superman', 'rowing', 'curl', 'crunch', 'releves', 'mountain', 'saute'];
function pulseFront(sv, f, t) {
  var box = sv.parentNode && sv.parentNode.querySelector ? sv.parentNode.querySelector('.mfront') : null;
  if (!box) return;
  var e = f.timed ? 1 : (EFF_B.indexOf(f.id) >= 0 ? t : 1 - t), els = box.querySelectorAll('.mu.on'), i;
  for (i = 0; i < els.length; i++) { els[i].style.opacity = (0.45 + 0.55 * e).toFixed(2); els[i].style.transform = 'scale(' + (1 + 0.14 * e).toFixed(3) + ')'; }
}
function subPoly(Pp, t, f0, f1) {
  var a = Pp.a.map(function (q, j) { return [lerp(q[0], Pp.b[j][0], t), lerp(q[1], Pp.b[j][1], t)]; }), d = [0], i;
  for (i = 1; i < a.length; i++) d.push(d[i - 1] + Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]));
  var tot = d[d.length - 1] || 1, out = [], x0 = tot * f0, x1 = tot * f1;
  function at(x) { var j = 0; while (j < a.length - 2 && d[j + 1] < x) j++; var sg = (d[j + 1] - d[j]) || 1, f = Math.min(1, Math.max(0, (x - d[j]) / sg)); return [lerp(a[j][0], a[j + 1][0], f), lerp(a[j][1], a[j + 1][1], f)]; }
  out.push(at(x0));
  for (i = 1; i < a.length - 1; i++) if (d[i] > x0 && d[i] < x1) out.push(a[i]);
  out.push(at(x1));
  return out.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
}
function animSvg(id, mode, period) {
  var f = FIGS[id], P = prepFig(f);
  var o = '<svg class="anim" viewBox="0 0 200 128" role="img" aria-label="' + esc(f.name || id) + '" data-fig="' + id + '" data-mode="' + mode + '" data-period="' + period + '" data-origin="' + Math.round(performance.now()) + '" data-t="0">';
  o += '<line class="ground" x1="6" y1="101" x2="194" y2="101"/>';
  (f.a.props || []).forEach(function (q) { o += '<polyline class="prop" points="' + pts(q) + '"/>'; });
  P.forEach(function (q) { o += '<polyline class="fig" points="' + ptsAt(q, 0) + '"/>'; });
  (f.hl || []).forEach(function (h) { o += '<polyline class="fig hl" data-p="' + h[0] + '" data-a="' + h[1] + '" data-b="' + h[2] + '" points=""/>'; });
  o += '<circle class="fig head" cx="' + f.a.head[0] + '" cy="' + f.a.head[1] + '" r="8"/>';
  o += '<text class="lbl" x="100" y="121" text-anchor="middle">' + esc(f.la) + '</text></svg>';
  return o;
}
/* animation de profil avec muscles qui s'illuminent + mannequin de face à côté */
function drawBox(id, mode, period) {
  var f = FIGS[id];
  return '<div class="draw' + (f.mus ? ' dual' : '') + '">' + animSvg(id, mode, period) + (f.mus ? '<div class="mfront">' + mannequinSvg(f.mus, 'face') + '</div>' : '') + '</div>';
}
function animBlock(id) {
  var f = FIGS[id], manual = !!f.timed;
  return drawBox(id, manual ? 'manual' : 'loop', Math.max(2, +P.tempo || 3)) + (f.mus ? '<p class="small mulbl">Muscles qui travaillent : ' + esc(muscleNames(f.mus)) + '</p>' : '') +
    '<div class="scrub"><button class="btn alt sm" data-act="animtoggle">' + (manual ? 'Animer' : 'Figer') + '</button>' +
    '<input type="range" min="0" max="100" value="0" data-scrub aria-label="Décomposer le mouvement"></div>';
}
function applyPose(sv, f, t) {
  var P = prepFig(f), pl = sv.querySelectorAll('polyline.fig:not(.hl)'), i;
  for (i = 0; i < P.length && i < pl.length; i++) pl[i].setAttribute('points', ptsAt(P[i], t));
  pulseFront(sv, f, t);
  sv.querySelectorAll('polyline.hl').forEach(function (h) {
    var q = P[+h.getAttribute('data-p')];
    if (q) h.setAttribute('points', subPoly(q, t, +h.getAttribute('data-a'), +h.getAttribute('data-b')));
  });
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
/* ====================== mannequin : face + profil, muscles colorés ====================== */
function mannequinSvg(mus, view) {
  mus = mus || [];
  var only = view === 'face';
  function on(id) { return mus.indexOf(id) >= 0 ? ' on' : ''; }
  function el(id, cx, cy, rx, ry, rot) {
    return '<ellipse class="mu' + on(id) + '" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"' + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + '/>';
  }
  var s = '<svg class="mq" viewBox="0 0 230 208" role="img" aria-label="Mannequin de face et de profil, muscles sollicités : ' + esc(mus.map(function (m) { return MUSCLE_NAMES[m]; }).join(', ')) + '">';
  /* vue de face */
  s += '<circle class="bd" cx="55" cy="16" r="10"/><rect class="bd" x="51" y="25" width="8" height="8" rx="2"/>' +
    '<path class="bd" d="M38 33 L72 33 L75 60 L66 100 L44 100 L35 60 Z"/>' +
    '<ellipse class="bd" cx="25" cy="86" rx="4.5" ry="14"/><ellipse class="bd" cx="85" cy="86" rx="4.5" ry="14"/>' +
    '<rect class="bd" x="42" y="98" width="12" height="62" rx="6"/><rect class="bd" x="56" y="98" width="12" height="62" rx="6"/>' +
    '<ellipse class="bd" cx="46" cy="190" rx="8" ry="3.5"/><ellipse class="bd" cx="64" cy="190" rx="8" ry="3.5"/>';
  s += el('shoulders', 34, 40, 8, 7) + el('shoulders', 76, 40, 8, 7) +
    el('chest', 46, 52, 10, 9) + el('chest', 64, 52, 10, 9) +
    '<rect class="mu' + on('abs') + '" x="47" y="64" width="16" height="30" rx="5"/>' +
    el('biceps', 28, 58, 4.5, 12) + el('biceps', 82, 58, 4.5, 12) +
    el('quads', 47, 124, 8, 22) + el('quads', 63, 124, 8, 22) +
    el('calves', 46, 168, 5.5, 15) + el('calves', 64, 168, 5.5, 15);
  if (only) return s.replace('<svg class="mq" viewBox="0 0 230 208"', '<svg class="mq mqf" viewBox="14 0 82 208"') + '<text class="mqt" x="55" y="205" text-anchor="middle">Face</text></svg>';
  /* vue de profil (regarde à droite) */
  s += '<circle class="bd" cx="172" cy="16" r="10"/><rect class="bd" x="164" y="25" width="9" height="8" rx="2"/>' +
    '<path class="bd" d="M148 33 L188 33 L190 62 L186 100 L148 100 L146 60 Z"/>' +
    '<ellipse class="bd" cx="168" cy="88" rx="5" ry="15"/>' +
    '<rect class="bd" x="149" y="98" width="38" height="62" rx="12"/><ellipse class="bd" cx="170" cy="190" rx="14" ry="3.5"/>';
  s += el('back', 154, 52, 4.5, 13) + el('lowback', 154, 84, 4.5, 9) + el('chest', 183, 52, 4, 10) + el('abs', 183, 82, 3.8, 14) +
    el('shoulders', 168, 40, 7, 8) + el('triceps', 164, 64, 3.5, 11) + el('biceps', 172, 64, 3.5, 11) +
    el('glutes', 156, 106, 8, 9) + el('hams', 158, 134, 6, 20) + el('quads', 180, 132, 5.5, 18) + el('calves', 163, 170, 6, 14);
  s += '<text class="mqt" x="55" y="205" text-anchor="middle">Face</text><text class="mqt" x="168" y="205" text-anchor="middle">Profil</text></svg>';
  return s;
}
function muscleNames(mus) { return mus.map(function (m) { return MUSCLE_NAMES[m]; }).join(', '); }
function mannequinHtml(e) {
  return '<details class="cfg"><summary>Muscles : ' + esc(muscleNames(e.mus)) + '</summary><div class="draw mqbox">' + mannequinSvg(e.mus) + '</div></details>';
}
/* © KVES · Coach-Mass-KVES */
/* ====================== coach (messages) ====================== */
function pick(a) { var d = new Date(); return a[(d.getDate() + d.getHours()) % a.length]; }
function coachMsg() {
  var l = D.logs[today()] || {}, d = new Date(), h = d.getHours(), dow = d.getDay();
  var train = isTrainDay(dow), done = doneToday(), left = kcalTarget() - eatenKcal(), miss = missedThisWeek();
  if (!l.weight && !l.sleep && !l.energy && h < 12) return ['Bilan du matin', pick(['Bilan du jour. Sommeil, énergie, poids si c\'est dimanche. Deux minutes, maintenant.', 'Pas de bilan, pas de progrès. Remplis-le avant ton premier repas.'])];
  if (done) return ['Séance faite', left > 400 ? (obj() === 'masse' ? 'Séance validée. Maintenant tu manges : il te reste environ ' + left + ' kcal. Ne saute rien.' : 'Séance validée. Il te reste environ ' + left + ' kcal à manger aujourd\'hui : ni plus, ni moins.') : 'Séance validée et repas presque complets. Bien. Dors tes 7 heures.'];
  if (train) {
    if (deloadActive()) return ['Semaine d\'allègement', 'Cette semaine, les séances sont allégées. Fais-les quand même : récupérer fait partie du programme.'];
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

function waterTarget() {
  var ml = 30 * currentWeight() + (isTrainDay(new Date().getDay()) ? 500 : 0);
  return Math.round(Math.max(2000, Math.min(3500, ml)) / 50) * 50;
}
function waterNote(water, target) {
  var h = new Date().getHours() + new Date().getMinutes() / 60, exp = target * Math.max(0, Math.min(1, (h - 8) / 13));
  if (water >= target) return 'Objectif atteint, bravo.';
  if (h >= 11 && water < exp - 500) return 'En retard sur ton objectif : bois un verre maintenant.';
  return 'Tu es dans le rythme.';
}
function cigAvg(from, n) {
  var tot = 0, c = 0, i, d, k, v, t0 = today();
  for (i = from; i < from + n; i++) {
    d = new Date(); d.setDate(d.getDate() - i); k = dstr(d); v = (D.logs[k] || {}).cig;
    if (v !== undefined && v !== null && !isNaN(+v)) { tot += +v; c++; }
    else if (k < t0 && P.tabacFrom && k >= P.tabacFrom) { c++; }
  }
  return c ? tot / c : null;
}
function tabacCard() {
  if (!P.tabac) return '';
  if (!P.tabacFrom) { P.tabacFrom = today(); save(); }
  var l = D.logs[today()] || {}, a = cigAvg(0, 7), b = cigAvg(7, 7);
  var h = '<div class="card"><div class="row"><h2 class="grow">Tabac</h2><b>' + (+l.cig || 0) + '</b></div>' +
    '<div class="row"><button class="btn alt sm grow" data-act="cig" data-n="1">+ 1 cigarette</button><button class="btn alt sm" data-act="cig" data-n="-1">− 1</button></div>';
  if (a !== null) h += '<div class="stats"><div class="stat"><b>' + fmt(a, 1) + '</b><span>par jour, 7 derniers jours</span></div>' + (b !== null ? '<div class="stat"><b>' + fmt(b, 1) + '</b><span>par jour, 7 jours d\'avant</span></div>' : '') + '</div>';
  return h + '<p class="small">Noter sans te juger. Chaque jour compte. Pour être aidé à arrêter, parles-en à un médecin ou à un pharmacien.</p><p class="small">Un jour passé sans saisie compte pour 0 cigarette.</p></div>';
}
function viewToday() {
  var l = log(), m = coachMsg(), sug = suggestion();
  var energy = [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="energy" data-n="' + n + '" class="' + (+l.energy === n ? 'on' : '') + '">' + n + '</button>'; }).join('');
  var water = +l.water || 0;
  var h = '<div class="card coach"><span class="head">Le coach · ' + m[0] + '</span><p class="msg">' + m[1] + '</p></div>';
  h += bkBanner();
  h += deloadCard();
  h += parqCard();
  if (isTrainDay(new Date().getDay()) && !doneToday() && quickToday()) h += '<p class="small">Séance express faite aujourd\'hui. Tu peux encore faire la séance complète.</p>';
  if (isTrainDay(new Date().getDay()) && !doneToday()) h += '<button class="btn go" data-act="start">Lancer la séance' + (isLight() ? ' (allégée)' : '') + '</button>';
  else h += '<p class="small">Prochaine séance : ' + nextTrainLabel() + '. Tu peux en lancer une quand même dans l\'onglet Séance.</p>';
  h += '<div class="card"><h2>Bilan du jour</h2><div class="grid2">' +
    '<label class="f">Poids (kg, à jeun)<input type="number" inputmode="decimal" step="0.1" data-log="weight" value="' + (l.weight || '') + '" placeholder="' + fmt(currentWeight()) + '"></label>' +
    '<label class="f">Sommeil (heures)<input type="number" inputmode="decimal" step="0.5" data-log="sleep" value="' + (l.sleep || '') + '" placeholder="7"></label>' +
    '<label class="f">Pas (montre ou téléphone)<input type="number" inputmode="numeric" data-log="steps" value="' + (l.steps || '') + '" placeholder="6000"></label>' +
    (P.cigs ? '<label class="f">Cigarettes fumées<input type="number" inputmode="numeric" data-log="cigs" value="' + (l.cigs === undefined ? '' : l.cigs) + '" placeholder="20"></label>' : '<span></span>') +
    '</div><label class="f">Énergie (1 = à plat, 5 = au top)</label><div class="seg">' + energy + '</div></div>';
  var wt = waterTarget();
  h += '<div class="card"><div class="row"><h2 class="grow">Eau</h2><b>' + fmt(water / 1000, 2) + ' / ' + fmt(wt / 1000, 2) + ' L</b></div><div class="bar"><i class="' + (water >= wt ? 'ok' : '') + '" style="width:' + Math.min(100, water * 100 / wt) + '%"></i></div><p class="small">' + waterNote(water, wt) + ' Objectif calculé : 30 ml par kg, plus 500 ml les jours de séance.</p>' +
    '<div class="row"><button class="btn alt sm grow" data-act="water" data-n="250">+ 250 ml</button><button class="btn alt sm" data-act="water" data-n="-250">− 250</button></div></div>' + tabacCard();
  var eaten = eatenKcal(), tg = kcalTarget();
  h += '<div class="card"><div class="row"><h2 class="grow">Repas validés</h2><b>' + eaten + ' / ' + tg + ' kcal</b></div><div class="bar"><i class="' + (eaten >= tg * 0.95 ? 'ok' : '') + '" style="width:' + Math.min(100, eaten / tg * 100) + '%"></i></div></div>';
  if (sug) {
    h += '<div class="card"><h2>Ajustement conseillé</h2><p>' + sug.msg +
      '</p><div class="row"><button class="btn sm grow" data-act="adj" data-v="' + sug.v + '">Appliquer</button><button class="btn alt sm" data-act="adjno">Plus tard</button></div></div>';
  }
  if (P.onboarded && !P.lvlDone && !D.sessions.length) h += '<div class="card"><h2>Règle ton niveau de départ</h2><p class="small">Dis à l\'application ce que tu sais déjà faire : tes premières séances seront adaptées.</p><button class="btn sm" data-act="lvlopen">Régler mon niveau</button></div>';
  if (!P.onboarded) h += '<div class="card"><h2>Complète ton profil</h2><p class="small">Genre, objectif (prise de masse, perte de poids, tonification, maintien), âge et mensurations : l\'application adapte les calories et les conseils.</p><button class="btn alt" data-act="obopen">Compléter mon profil</button></div>';
  return h;
}

function riskHtml(e) {
  return '<div class="warn"><b>⚠ Précautions.</b> ' + esc(e.risk[0]) + ' ' + esc(e.risk[1]) + '<br><b>Arrête-toi si :</b> ' + esc(e.risk[2]) + '</div>';
}
function exCard(e) {
  var L = lv(e.id), names = levelsFor(e), li = Math.min(L.level, names.length - 1), lock = exLocked(e);
  var tgt = e.timed ? (e.lo + L.off) + '–' + (e.hi + L.off) + ' s' : (e.lo + L.off) + '–' + (e.hi + L.off) + ' reps';
  var h = '<div class="card' + (lock ? ' locked' : '') + '" data-ex="' + e.id + '"><div class="row"><h3 class="grow">' + esc(names[li]) + '</h3>' + (e.adv ? '<span class="pill">avancé</span>' : '') + '<span class="pill on">' + tgt + '</span></div>' + animBlock(e.id) + '<p class="small">' + esc(e.tip) + '</p>';
  if (e.risk) h += riskHtml(e);
  if (lock) return h + '<p class="small"><b>Réservé aux niveaux avancés.</b> Il se débloque quand tes pompes et tes squats ont bien progressé, ou dans Réglages (Débloquer les exercices avancés).</p>' + '</div>';
  h += '<label class="meal"><input type="checkbox" data-act="extra" data-id="' + e.id + '"' + (selected(e) ? ' checked' : '') + '><span><b>Dans ma séance complète</b><br><span class="small">Décoche pour le retirer (3 exercices minimum). Il reste disponible en « Lancer seul ».</span></span></label>';
  return h + mtHtml(e, e.hi + L.off) + exCfgHtml(e) + '</div>';
}
function viewTrain() {
  var n = EX.filter(inSession).length;
  var h = '<h1>Séance</h1><p class="small">Semaine ' + wkNo() + ' · ' + (wkNo() <= 2 ? '3 séries' : '4 séries') + ' sur les exercices principaux · ' + n + ' exercices dans la séance complète. Jours prévus : ' + P.days.slice().sort().map(function (d) { return JOURS[d]; }).join(', ') + '.</p>';
  h += painCard();
  h += '<button class="btn go" data-act="start">Lancer la séance' + (isLight() ? ' (allégée)' : '') + '</button>';
  h += '<button class="btn" data-act="quick">Séance express</button><p class="small">Environ 15 minutes : échauffement court, 2 séries par exercice. Pas de montée de niveau avec cette version.</p>';
  ZONES.forEach(function (z) {
    var list = EX.filter(function (e) { return e.zone === z.id; });
    if (!list.length) return;
    h += '<div class="zonehead"><h2>' + z.name + '</h2><span class="pill">' + list.length + '</span></div><div class="cards2">' + list.map(exCard).join('') + '</div>';
  });
  var last = D.sessions.slice(-5).reverse();
  if (last.length) h += '<div class="card"><h2>Dernières séances</h2><ul class="list">' + last.map(function (s) {
    return '<li><span>' + s.date + (s.free ? ' · libre' : s.partial ? ' · incomplète' : '') + '</span><span>' + (s.free ? '' : s.min + ' min · ') + s.sets + ' série' + (s.sets > 1 ? 's' : '') + '</span></li>';
  }).join('') + '</ul></div>';
  return h;
}

function dietCard() {
  var T = [['noEgg', 'Sans œufs'], ['noMilk', 'Sans lait'], ['noNuts', 'Sans fruits à coque / cacahuètes'], ['noGluten', 'Sans gluten'], ['veg', 'Végétarien (sans viande ni poisson)']];
  var h = '<div class="card"><h2>Régime et budget</h2><p class="small">Les repas et les courses s\'adaptent. Halal : le poulet et les sardines du plan conviennent, choisis-les halal chez ton boucher.</p>';
  T.forEach(function (x) { h += '<label class="meal"><input type="checkbox" data-act="diet" data-k="' + x[0] + '"' + (P[x[0]] ? ' checked' : '') + '><span>' + x[1] + '</span></label>'; });
  return h + '<label class="f">Budget</label>' + shopSeg('budget', P.budget, [['normal', 'Normal'], ['serre', 'Serré (moins de viande)']]) + '</div>';
}
function viewMeals() {
  var l = log(), m = mealsList(), c = l.meals || [];
  var h = '<h1>Repas du jour</h1><p class="small">' + OBJ[obj()] + ' · cible : environ ' + kcalTarget() + ' kcal et ' + protTarget() + ' g de protéines. Coche chaque repas quand tu l\'as fini.</p><div class="card">';
  m.forEach(function (x, i) {
    h += '<label class="meal"><input type="checkbox" data-act="meal" data-i="' + i + '"' + (c[i] ? ' checked' : '') + '><span><span class="t">' + x.t + '</span><br>' + esc(x.x) + '</span><span class="k">' + mealK(x) + ' kcal<br>' + mealP(x) + ' g</span></label>';
  });
  if (obj() !== 'masse' || (P.onboarded && Math.abs(mealFactor() - 1) > 0.05)) h += '<p class="small">Portions ajustées à ton objectif (environ ' + Math.round(mealFactor() * 100) + ' % du plan de base) : réduis surtout le riz, le pain, l\'huile et le beurre de cacahuète ou d\'amlou, garde les œufs, le poulet et les légumes. Plancher : ' + kcalFloor() + ' kcal.</p>';
  h += '</div><div class="card"><h2>Variantes</h2><ul class="list"><li><span>Pas de poulet</span><span>4 sardines ou 200 g de lentilles</span></li><li><span>Peu d\'appétit</span><span>Bois le smoothie en plus</span></li><li><span>Budget serré</span><span>Œufs, légumineuses, sardines</span></li></ul></div>';
  h += dietCard() + shopCard();
  return h;
}

/* © KVES · Coach-Mass-KVES */
/* ====================== bilan de la semaine (7 derniers jours) ====================== */
function weekReview() {
  var t = dnum(today()), days = [], i, x, s, r = { planned: 0, done: 0, sl: [], en: [], mealPct: [], kc: [], w: [] };
  for (i = 6; i >= 0; i--) { x = new Date(); x.setDate(x.getDate() - i); days.push({ s: dstr(x), dow: x.getDay() }); }
  var ml = mealsList();
  days.forEach(function (d) {
    var l = D.logs[d.s] || {};
    if (isTrainDay(d.dow) && d.s >= P.start) { r.planned++; if (D.sessions.some(function (q) { return q.date === d.s && !q.partial; })) r.done++; }
    if (+l.sleep) r.sl.push(+l.sleep);
    if (+l.energy) r.en.push(+l.energy);
    if (+l.weight) r.w.push(+l.weight);
    if (l.meals && l.meals.some(function (c) { return c; })) {
      var k = 0, n = 0; ml.forEach(function (m, j) { if (l.meals[j]) { n++; k += mealK(m); } });
      r.mealPct.push(Math.round(100 * n / ml.length)); r.kc.push(k);
    }
  });
  function avg(a) { return a.length ? a.reduce(function (p, c) { return p + c; }, 0) / a.length : null; }
  r.sleep = avg(r.sl); r.energy = avg(r.en); r.meals = avg(r.mealPct); r.kcal = avg(r.kc);
  r.dw = r.w.length >= 2 ? r.w[r.w.length - 1] - r.w[0] : null;
  r.rpe = avg(D.sessions.filter(function (q) { return !q.partial && !q.free && +q.rpe > 0 && q.date >= days[0].s; }).map(function (q) { return +q.rpe; }));
  r.advice = weekAdvice(r);
  return r;
}
function weekAdvice(r) {
  var o = obj();
  if (r.rpe !== null && r.rpe >= 4.5) return 'Tes séances sont ressenties très dures : allège ou prévois une semaine d\'allègement.';
  if (r.planned && r.done < r.planned) return 'Il manque ' + (r.planned - r.done) + ' séance(s). Cette semaine : place-les à l\'avance dans ton agenda, même en version légère.';
  if (r.sleep !== null && r.sleep < 6.5) return 'Ton sommeil moyen est court. Gagne une heure de coucher avant de chercher plus de charge : c\'est là que le muscle se construit.';
  if (r.meals !== null && r.meals < 70) return 'Tu as coché moins de 70 % de tes repas. Prépare tes repas du lendemain la veille.';
  if (r.dw !== null) {
    if (o === 'masse' && r.dw < -0.3) return 'Ton poids baisse alors que tu veux prendre de la masse : ajoute un repas ou une collation.';
    if (o === 'perte' && r.dw > 0.3) return 'Ton poids monte alors que tu veux perdre : surveille le riz, le pain et l\'huile.';
  }
  if (r.rpe !== null && r.rpe <= 2 && r.planned && r.done === r.planned) return 'Tes séances te paraissent faciles : ajoute une répétition par série ou passe à la variante suivante.';
  if (r.planned && r.done === r.planned) return 'Semaine complète. Tiens le même rythme et vise une répétition de plus par série.';
  return 'Continue : coche tes repas, pèse-toi chaque dimanche et note ton sommeil.';
}
function weekText(r) {
  return 'Bilan de la semaine (Coach-Mass-KVES)\nSéances : ' + r.done + ' sur ' + r.planned + '\nRepas cochés : ' + (r.meals === null ? '—' : Math.round(r.meals) + ' %') +
    '\nSommeil moyen : ' + (r.sleep === null ? '—' : fmt(r.sleep) + ' h') + '\nÉnergie moyenne : ' + (r.energy === null ? '—' : fmt(r.energy) + ' / 5') +
    '\nPoids : ' + (r.dw === null ? '—' : (r.dw > 0 ? '+' : '') + fmt(r.dw) + ' kg') + '\nConseil : ' + r.advice;
}
var WKI = { w: false };
function weekImage(cb) {
  var r = weekReview(), W = 1080, H = 1350, c = document.createElement('canvas'), x = c.getContext('2d'), L = [], y = 620;
  c.width = W; c.height = H;
  x.fillStyle = '#12151b'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#ff9a4d'; x.fillRect(0, 0, W, 14);
  x.textAlign = 'center'; x.fillStyle = '#ffffff';
  x.font = 'bold 64px system-ui, sans-serif'; x.fillText(trText('Ma semaine'), W / 2, 150);
  x.fillStyle = '#9aa3b2'; x.font = '40px system-ui, sans-serif'; x.fillText(trText('Semaine') + ' ' + wkNo(), W / 2, 215);
  x.fillStyle = '#ff9a4d'; x.font = 'bold 260px system-ui, sans-serif'; x.fillText(r.done + '/' + r.planned, W / 2, 470);
  x.fillStyle = '#ffffff'; x.font = '48px system-ui, sans-serif'; x.fillText(trText('séances'), W / 2, 575);
  if (r.meals !== null) L.push([trText('repas cochés'), Math.round(r.meals) + ' %']);
  if (r.sleep !== null) L.push([trText('sommeil moy.'), fmt(r.sleep) + ' h']);
  if (r.energy !== null) L.push([trText('énergie moy.'), fmt(r.energy) + '/5']);
  if (r.rpe !== null) L.push([trText('effort moy.'), fmt(r.rpe) + '/5']);
  if (WKI.w && r.dw !== null) L.push([trText('poids'), (r.dw > 0 ? '+' : '') + fmt(r.dw) + ' kg']);
  L.forEach(function (it) {
    y += 100;
    x.textAlign = 'left'; x.fillStyle = '#9aa3b2'; x.font = '44px system-ui, sans-serif'; x.fillText(it[0], 150, y);
    x.textAlign = 'right'; x.fillStyle = '#ffffff'; x.font = 'bold 52px system-ui, sans-serif'; x.fillText(it[1], W - 150, y);
  });
  x.textAlign = 'center'; x.fillStyle = '#9aa3b2'; x.font = '34px system-ui, sans-serif'; x.fillText('Coach-Mass-KVES · © KVES', W / 2, H - 70);
  c.toBlob(function (b) { cb(b); }, 'image/png');
}
document.addEventListener('change', function (ev) { var t = ev.target; if (t && t.getAttribute && t.getAttribute('data-wki') === 'w') { WKI.w = !!t.checked; } });
document.addEventListener('click', function (ev) {
  var t = ev.target && ev.target.closest ? ev.target.closest('[data-act="weekimg"]') : null;
  if (!t) return;
  weekImage(function (b) {
    if (!b) return;
    var name = 'bilan-semaine-' + wkNo() + '.png', f = null;
    function dl() { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
    try { f = new File([b], name, { type: 'image/png' }); } catch (e) { f = null; }
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: 'Coach-Mass-KVES' }).catch(function (e) { if (!e || e.name !== 'AbortError') dl(); });
    else dl();
  });
});
function weekCard() {
  var r = weekReview();
  function st(v, u) { return '<div class="stat"><b>' + v + '</b><span>' + u + '</span></div>'; }
  return '<div class="card"><h2>Bilan de la semaine</h2><p class="small">Les 7 derniers jours.</p><div class="stats">' +
    st(r.done + '/' + r.planned, 'séances') + st(r.meals === null ? '—' : Math.round(r.meals) + ' %', 'repas cochés') + st(r.sleep === null ? '—' : fmt(r.sleep) + ' h', 'sommeil moy.') + '</div><div class="stats">' +
    st(r.energy === null ? '—' : fmt(r.energy) + '/5', 'énergie moy.') + st(r.kcal === null ? '—' : Math.round(r.kcal / 10) * 10, 'kcal/jour (cochés)') + st(r.dw === null ? '—' : (r.dw > 0 ? '+' : '') + fmt(r.dw), 'kg') + '</div>' +
    (r.rpe === null ? '' : '<div class="stats">' + st(fmt(r.rpe) + '/5', 'effort moy.') + '</div>') +
    '<p><b>Conseil du coach :</b> ' + esc(r.advice) + '</p><button class="btn alt sm" data-act="weekcopy">Copier le bilan</button> <button class="btn alt sm" data-act="weekimg">Partager en image</button><label class="meal"><input type="checkbox" data-wki="w"' + (WKI.w ? ' checked' : '') + '><span>Inclure l\'évolution du poids dans l\'image</span></label></div>';
}
/* © KVES · Coach-Mass-KVES */
var CH = { range: 56, ex: 'total', mk: 'taille' };
var MKEYS = ['poitrine', 'taille', 'hanches', 'bras', 'cuisse', 'mollet'], MLAB = { poitrine: 'Poitrine', taille: 'Taille', hanches: 'Hanches', bras: 'Bras', cuisse: 'Cuisse', mollet: 'Mollet' };
function exUsed(e) { return e.core || D.sessions.some(function (s) { return (s.logs || []).some(function (l) { return l.id === e.id; }); }); }
function measChart(k) {
  var pts = D.measures.filter(function (m) { return m[k]; }).map(function (m) { return { d: m.date, v: +m[k] }; });
  if (pts.length < 2) return '<p class="small">Courbe : enregistre au moins 2 mesures de « ' + MLAB[k].toLowerCase() + ' ».</p>';
  var W = 340, H = 130, ml = 34, mr = 10, mt = 12, mb = 22, vs = pts.map(function (p) { return p.v; }), lo = Math.floor(Math.min.apply(null, vs) - 1), hi = Math.ceil(Math.max.apply(null, vs) + 1);
  var x0 = dnum(pts[0].d), x1 = Math.max(dnum(pts[pts.length - 1].d), x0 + 1);
  function X(d) { return ml + (dnum(d) - x0) / (x1 - x0) * (W - ml - mr); }
  function Y(v) { return mt + (hi - v) / (hi - lo) * (H - mt - mb); }
  var s = '<svg class="minichart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Courbe : ' + MLAB[k] + '">';
  s += '<text x="' + (ml - 4) + '" y="' + (mt + 4) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + hi + '</text><text x="' + (ml - 4) + '" y="' + (H - mb) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + lo + '</text>';
  s += '<polyline fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" points="' + pts.map(function (p) { return X(p.d).toFixed(1) + ',' + Y(p.v).toFixed(1); }).join(' ') + '"/>';
  pts.forEach(function (p) { s += '<circle cx="' + X(p.d).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="3" fill="var(--accent)"/>'; });
  s += '<text x="' + ml + '" y="' + (H - 6) + '" fill="var(--muted)" font-size="10">' + sdate(pts[0].d) + '</text><text x="' + (W - mr) + '" y="' + (H - 6) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + sdate(pts[pts.length - 1].d) + '</text></svg>';
  return s;
}
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
  var toward = goal >= cur ? sl : (sl === null ? null : -sl), eta = toward && toward > 0.05 && Math.abs(goal - cur) > 0.05 ? Math.ceil(Math.abs(goal - cur) / toward) + ' sem.' : '—';
  var h = '<h1>Suivi</h1><div class="card"><div class="stats"><div class="stat"><b>' + fmt(cur) + '</b><span>kg actuel</span></div><div class="stat"><b>' + fmt(Math.abs(goal - cur)) + '</b><span>kg restants</span></div><div class="stat"><b>' + eta + '</b><span>estimation</span></div></div>' +
    '<p class="small">Rythme mesuré : ' + (sl === null ? 'pas assez de pesées (3 sur 10 jours minimum)' : fmt(sl, 2) + ' kg par semaine') + '. ' + (obj() === 'masse' ? 'Cible saine : 0,25 à 0,5 kg par semaine.' : obj() === 'perte' ? 'Perte saine : 0,25 à 0,5 kg par semaine, jamais plus.' : 'Vise un poids stable (moins de 0,3 kg par semaine).') + '</p></div>';
  h += weekCard();
  h += '<div class="seg" role="group" aria-label="Période">' + [[28, '4 sem.'], [56, '8 sem.'], [182, '6 mois'], [0, 'Tout']].map(function (r) {
    return '<button data-act="range" data-v="' + r[0] + '" class="' + (CH.range === r[0] ? 'on' : '') + '">' + r[1] + '</button>';
  }).join('') + '</div>';
  var wc = weightChart(), dw = '';
  if (wc.pts.length >= 2) { var df = wc.pts[wc.pts.length - 1].w - wc.pts[0].w; dw = '<p class="small">Sur la période : ' + (df > 0 ? '+' : '') + fmt(df) + ' kg (de ' + fmt(wc.pts[0].w) + ' à ' + fmt(wc.pts[wc.pts.length - 1].w) + ' kg).</p>'; }
  h += '<div class="card"><h2>Évolution du poids</h2>' + wc.svg + dw + '</div>';
  var chips = '<button class="chip' + (CH.ex === 'total' ? ' on' : '') + '" data-act="exsel" data-v="total">Total</button>' + EX.filter(exUsed).map(function (e) {
    return '<button class="chip' + (CH.ex === e.id ? ' on' : '') + '" data-act="exsel" data-v="' + e.id + '">' + esc(e.name) + '</button>';
  }).join('');
  var it = perfItems(), ex = FIGS[CH.ex], unit = ex && ex.timed ? 's' : 'reps', pd = '';
  if (it.length >= 2) { var d2 = it[it.length - 1].v - it[0].v; pd = '<p class="small">Du début à la dernière séance de la période : ' + it[0].v + ' → ' + it[it.length - 1].v + ' ' + unit + ' (' + (d2 > 0 ? '+' : '') + d2 + ').</p>'; }
  h += '<div class="card"><h2>Performance par séance</h2><div class="chips">' + chips + '</div><p class="small">' + (CH.ex === 'total' ? 'Total des répétitions (hors gainage)' : esc(ex.name) + ' : ' + (ex.timed ? 'secondes tenues' : 'répétitions') + ' cumulées sur la séance') + '</p>' + barChart(it, unit) + pd + '</div>';
  h += '<div class="card"><h2>Semaine par semaine</h2><div class="table-wrap"><table><thead><tr><th>Semaine</th><th class="n">Séances</th><th class="n">Reps</th><th class="n">Poids moy.</th></tr></thead><tbody>' + weekRows() + '</tbody></table></div></div>';
  h += '<div class="card"><h2>Mensurations</h2><p class="small">Toutes les 2 semaines, matin à jeun, en cm.</p><div class="grid2">' +
    MKEYS.map(function (k) { return '<label class="f">' + MLAB[k] + '<input type="number" inputmode="decimal" step="0.5" id="m_' + k + '"></label>'; }).join('') +
    '</div><button class="btn sm" data-act="measure">Enregistrer</button>';
  if (D.measures.length) {
    var f = D.measures[0], z = D.measures[D.measures.length - 1];
    h += '<ul class="list">' + MKEYS.map(function (k) {
      var vals = D.measures.filter(function (m) { return m[k]; }), dd = vals.length > 1 ? vals[vals.length - 1][k] - vals[0][k] : null, last = vals.length ? vals[vals.length - 1][k] : null;
      return '<li><span>' + MLAB[k] + '</span><span>' + (last || '—') + ' cm' + (dd !== null ? ' (' + (dd > 0 ? '+' : '') + fmt(dd) + ')' : '') + '</span></li>';
    }).join('') + '</ul><p class="small">Dernière mesure : ' + z.date + '</p>';
    h += '<div class="chips">' + MKEYS.map(function (k) { return '<button class="chip' + (CH.mk === k ? ' on' : '') + '" data-act="mksel" data-v="' + k + '">' + MLAB[k] + '</button>'; }).join('') + '</div>' + measChart(CH.mk);
  }
  h += '</div>' + phCard() + '<div class="card"><h2>Sauvegarde</h2><p class="small">Tes données restent sur ce téléphone. Exporte-les de temps en temps.</p><div class="row"><button class="btn alt sm grow" data-act="export">Exporter</button><button class="btn alt sm grow" data-act="exportenc">Exporter chiffré</button><button class="btn alt sm grow" data-act="import">Importer</button></div></div>';
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
      (s.free ? '<span class="pill">libre</span>' : s.partial ? '<span class="pill">incomplète</span>' : '') + (s.light ? '<span class="pill">allégée</span>' : '') + (s.quick ? '<span class="pill">express</span>' : '') + '</summary>' +
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
function settingsRaw() {
  var h = '<button class="btn alt sm back" data-act="tab" data-v="more">← Plus</button><h1>Réglages</h1><div class="card"><h2>Jours de séance</h2><div class="seg">' +
    [1, 2, 3, 4, 5, 6, 0].map(function (d) { return '<button data-act="day" data-d="' + d + '" class="' + (isTrainDay(d) ? 'on' : '') + '">' + JOURS[d] + '</button>'; }).join('') + '</div></div>';
  h += '<div class="card"><h2>Tabac</h2>' + tog('tabac', 'Suivre ma consommation de tabac', 'Facultatif, privé, sans jugement : un simple compteur par jour') + '</div>';
  h += '<div class="card"><h2>Coach</h2>' + tog('voice', 'Voix du coach', 'Parle dans tes écouteurs') + tog('voiceFr', 'Voix toujours en français', 'Même si l\'application est dans une autre langue') + tog('vib', 'Vibrations') + '<label class="f">Intensité des vibrations</label><div class="seg" role="group">' + [[1, 'Normale'], [2, 'Forte'], [3, 'Très forte']].map(function (x) { return '<button data-act="vibpow" data-v="' + x[0] + '" class="' + ((P.vibLevel || 2) === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' + tog('count', 'Compter les répétitions à voix haute', 'Le coach donne le rythme') + tog('auto', 'Enchaînement automatique', 'Mains libres : le coach relance après le repos') +
    '<div class="grid2"><label class="f">Secondes par répétition<input type="number" inputmode="numeric" min="2" max="6" data-set="tempo" value="' + P.tempo + '"></label>' +
    '<label class="f">Repos en plus (secondes)<input type="number" inputmode="numeric" min="0" max="60" step="5" data-set="restBonus" value="' + P.restBonus + '"></label></div>' +
    '<div class="row"><button class="btn alt sm" data-act="testvoice">Tester la voix</button><button class="btn alt sm" data-act="testvib">Tester la vibration</button></div></div>';
  h += '<div class="card"><h2>Signaux sonores</h2>' + tog('sound', 'Sons activés', 'Bips de fin de série, d\'exercice et de repos') + tog('metro', 'Métronome de cadence', 'Bip grave à la descente, bip aigu à la montée') + tog('warn10', 'Alerte 10 secondes avant la fin du repos') +
    '<label class="f">Volume : ' + P.vol + ' sur 10<input type="range" min="1" max="10" step="1" data-set="vol" value="' + P.vol + '" aria-label="Volume des sons"></label>' +
    '<p class="small">Teste chaque signal :</p><div class="chips">' + [['setend', 'Fin de série'], ['exend', 'Fin d\'exercice'], ['go', 'Fin du repos'], ['warn', 'Alerte 10 s'], ['count', 'Compte à rebours'], ['beat', 'Cadence'], ['fanfare', 'Fin de séance']].map(function (x) {
      return '<button class="chip" data-act="testsnd" data-v="' + x[0] + '">' + x[1] + '</button>';
    }).join('') + '</div></div>';
  h += '<div class="card"><h2>Profil et objectif</h2><p class="small">' + OBJ[obj()] + ' · ' + GEN[P.gender || 'n'] + ' · ' + P.age + ' ans · ' + P.height + ' cm</p><button class="btn alt sm" data-act="obopen">Modifier mon profil</button><button class="btn alt sm" data-act="parqopen">Questionnaire de santé</button><div class="grid2">' +
    '<label class="f">Poids de départ (kg)<input type="number" inputmode="decimal" step="0.1" data-set="w0" value="' + P.w0 + '"></label>' +
    '<label class="f">Objectif (kg)<input type="number" inputmode="decimal" step="0.5" data-set="goal" value="' + P.goal + '"></label>' +
    '<label class="f">Date de départ<input type="text" data-set="start" value="' + P.start + '"></label></div>' +
    tog('hasBar', 'J\'ai une barre de traction', 'Ajoute les tractions au tirage') + tog('advOn', 'Débloquer les exercices avancés', 'Pompes diamant, dips, squat sauté : à n\'activer que si tu es à l\'aise') + tog('cigs', 'Suivre mes cigarettes', 'Un compteur dans le bilan du jour') + '</div>';
  h += mealTimesCard();
  h += rmCard();
  h += '<div class="card"><h2>Langue</h2>' + shopSeg('lang', lang(), Object.keys(LANGS).map(function (k) { return [k, LANGS[k]]; })) + '</div>';
  h += '<div class="card"><h2>Affichage</h2>' + themeCard() + tog('rotate', 'Forcer la rotation de l\'écran', 'À activer si l\'application reste bloquée en portrait. Elle suit alors le capteur du téléphone.') + '</div>';
  h += bkCard();
  h += '<div class="card"><h2>Données</h2><button class="btn bad sm" data-act="reset">' + (resetArmed ? 'Confirmer : tout effacer' : 'Effacer toutes les données') + '</button><p class="small">Version ' + VERSION + '</p></div>';
  return h;
}
var resetArmed = false;
/* 13.8 : chaque carte de Réglages devient une section repliable (état gardé pendant la session) */
var SEC = { 'Jours de séance': true };
function viewSettings() {
  var raw = settingsRaw(), out = '', depth = 0, start = -1, re = /<div\b|<\/div>/g, m, i, last = 0;
  while ((m = re.exec(raw))) {
    if (m[0] === '</div>') { depth--; if (depth === 0 && start >= 0) { out += secWrap(raw.slice(start, m.index + 6)); start = -1; last = m.index + 6; } }
    else { if (depth === 0) { if (start < 0) { out += raw.slice(last, m.index); } start = m.index; } depth++; }
  }
  return out + raw.slice(last);
}
function secWrap(card) {
  var m = card.match(/^<div class="card"><h2>([^<]*)<\/h2>([\s\S]*)<\/div>$/);
  if (!m) return card;
  return '<details class="card" data-sec="' + m[1].replace(/"/g, '') + '"' + (SEC[m[1]] ? ' open' : '') + '><summary><h2>' + m[1] + '</h2></summary>' + m[2] + '</details>';
}
document.addEventListener('toggle', function (ev) { var d = ev.target; if (d && d.getAttribute && d.hasAttribute('data-sec')) SEC[d.getAttribute('data-sec')] = d.open; }, true);

function render() {
  $('#weekTag').textContent = 'Semaine ' + wkNo() + ' · ' + fmt(currentWeight()) + ' kg → ' + P.goal;
  var map = { today: viewToday, train: viewTrain, meals: viewMeals, track: viewTrack, history: viewHistory, settings: viewSettings, more: viewMore, avis: viewAvis, owner: viewOwner, sources: viewSources, player: viewPlayer, sante: viewSante, confid: viewConfid, cond: viewCond, adapt: viewAdapt };
  view.innerHTML = map[tab]();
  if ($('#sigstat')) setTimeout(sigRun, 0);
  if (render._tab !== undefined && render._tab !== tab) { var h1 = view.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); try { h1.focus({ preventScroll: true }); } catch (e) {} } }
  render._tab = tab;
  document.querySelectorAll('#nav button').forEach(function (b) { if (b.getAttribute('data-v') === (({ avis: 'more', settings: 'more', owner: 'more', sources: 'more', player: 'more', sante: 'more', confid: 'more', cond: 'more', adapt: 'more' })[tab] || tab)) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === (({ avis: 'more', settings: 'more', owner: 'more', sources: 'more', player: 'more', sante: 'more', confid: 'more', cond: 'more', adapt: 'more' })[tab] || tab)); });
  document.body.setAttribute('data-tab', ({ avis: 'more', settings: 'more', owner: 'more', sources: 'more', player: 'more', sante: 'more', confid: 'more', cond: 'more', adapt: 'more' })[tab] || tab);
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
/* Voix : suit la langue de l'appli (EN -> anglais, AR et darija -> arabe). Si la phrase n'a pas de traduction connue, le coach parle français. */
function voiceFor(t) {
  var L = lang(), o = P.lang;
  if (P.voiceFr || L === 'fr') return { t: t, l: 'fr-FR' };
  var code = L === 'en' ? 'en' : 'ar', out = t;
  try { P.lang = code; out = trText(t); } catch (e) { out = t; } finally { P.lang = o; }
  if (out === t) return { t: t, l: 'fr-FR' };
  return { t: out, l: code === 'en' ? 'en-US' : 'ar-SA' };
}
function say(t) {
  if (!P.voice) return;
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var vl = voiceFor(t), u = new SpeechSynthesisUtterance(vl.t); u.lang = vl.l; u.rate = 1.05;
    mDuckSay(u);
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

function startSession(opts) {
  var solo = opts && opts.only ? opts.only : null;
  var light = !solo && !!isLight(), w = wkNo();
  var list = solo ? EX.filter(function (e) { return e.id === solo; }) : EX.filter(inSession);
  var quick = !solo && !!(opts && opts.quick);
  if (!list.length) return;
  if (quick) {
    var tot = 1.5, keep = [];
    list.forEach(function (e) { var c = (P.exCfg && P.exCfg[e.id]) || {}, est = 2 * (40 + (c.rest || exDef(e).rest)) / 60; if (tot + est <= 15.5) { keep.push(e); tot += est; } });
    list = keep.length ? keep : list.slice(0, 1);
  }
  var plan = list.map(function (e) {
    var L = lv(e.id), names = levelsFor(e), li = Math.min(L.level, names.length - 1), c = (P.exCfg && P.exCfg[e.id]) || {}, d = exDef(e);
    var base = (w <= 2 || !e.grow) ? 3 : 4;
    var step = e.timed ? 5 : 1;
    var hi = solo && c.reps ? c.reps : e.hi + L.off;
    return { e: e, name: names[li], sets: solo ? (c.sets || d.sets) : quick ? 2 : Math.max(2, base - (light ? 1 : 0)), lo: Math.min(e.lo + L.off, hi), hi: hi, rest: c.rest || d.rest, step: step };
  });
  var steps = [];
  if (!solo) WARM.slice(0, quick ? 2 : WARM.length).forEach(function (x) { steps.push({ k: 'warm', label: x.l, sec: x.s, fig: x.fig, period: x.period }); });
  plan.forEach(function (p, i) { for (var s = 1; s <= p.sets; s++) steps.push({ k: 'set', pi: i, sn: s }); });
  R = { sess: null, plan: plan, steps: steps, i: -1, phase: 'intro', t0: Date.now(), logs: [], light: light, quick: quick, solo: !!solo, paused: false, timer: null, endAt: 0, remain: 0, last: -1, count: 0, reps: 0, quit: false };
  runner.hidden = false; document.body.style.overflow = 'hidden';
  unlockAudio();
  wake();
  if (!solo) say(light ? 'Séance allégée aujourd\'hui. Échauffement.' : 'Séance. Échauffement d\'abord.');
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
function startStretch() {
  clearTimer();
  R.stretch = true; R.steps = STRETCH.map(function (x) { return { k: 'warm', label: x.l, sec: x.s, fig: x.fig, period: x.period }; });
  R.i = -1; R.paused = false; R.quit = false; R.painOpen = false; R.phase = 'warm';
  wake(); advance();
}
function endStretch() {
  clearTimer(); R.stretch = false; R.stretched = true; R.phase = 'done'; unwake();
  play('chime'); drawDone();
}
function advance() {
  clearTimer();
  R.i++;
  if (R.i >= R.steps.length) return R.stretch ? endStretch() : finish(false);
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
  R.logs.push({ id: p.e.id, name: p.name, hi: p.hi, sn: o.s.sn, reps: reps, m: !!(p.e.timed || P.count) });
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

function findPrs(logs) {
  /* Un record se compare à la même variante de l'exercice (id + nom). Une série n'est comptée que si le nombre de répétitions a été
     réellement mesuré (compteur, exercice chronométré, ou corrigé à la main) : sans comptage, la valeur n'est que la cible. */
  var prev = {}, cur = {}, out = [];
  function key(l) { return l.id + '|' + l.name; }
  D.sessions.forEach(function (x) { (x.logs || []).forEach(function (l) { if (+l.reps > (prev[key(l)] || 0)) prev[key(l)] = +l.reps; }); });
  logs.forEach(function (l) { if (l.m === true && +l.reps > (cur[key(l)] ? cur[key(l)].v : 0)) cur[key(l)] = { v: +l.reps, name: l.name, id: l.id }; });
  Object.keys(cur).forEach(function (k) {
    var c = cur[k], e = EX.filter(function (x) { return x.id === c.id; })[0];
    if (prev[k] > 0 && c.v > prev[k]) out.push({ name: c.name, v: c.v, old: prev[k], nx: c.v + (e && e.timed ? 5 : 1), timed: !!(e && e.timed) });
  });
  return out;
}
function finish(partial) {
  clearTimer();
  if (R.painSkip) partial = true;
  R.prs = findPrs(R.logs);
  var min = Math.max(1, Math.round((Date.now() - R.t0) / 60000));
  var ups = [];
  if (!partial && !R.solo && !R.quick) ups = applyProgress(R.logs);
  var hasPain = !!(R.pain && R.pain.length);
  if ((R.logs.length || hasPain) && R.solo) {
    var fs = null;
    D.sessions.forEach(function (x) { if (x.free && x.date === today()) fs = x; });
    if (!fs) { fs = { date: today(), min: 0, sets: 0, partial: true, free: true, light: false, week: wkNo(), logs: [] }; D.sessions.push(fs); }
    R.logs.forEach(function (l) { fs.logs.push(l); });
    (R.pain || []).forEach(function (n) { fs.pain = fs.pain || []; if (fs.pain.indexOf(n) < 0) fs.pain.push(n); });
    fs.sets = fs.logs.length; fs.min += min;
  } else if (R.logs.length || hasPain) { R.sess = { date: today(), min: min, sets: R.logs.length, partial: !!partial, light: R.light, quick: !!R.quick, week: wkNo(), logs: R.logs }; if (R.pain && R.pain.length) R.sess.pain = R.pain.slice(); ; D.sessions.push(R.sess); }
  save();
  R.phase = 'done'; R.ups = ups; R.min = min; R.partial = partial;
  unwake(); drawDone();
  if (!partial) { play('fanfare'); say(R.solo ? 'Exercice terminé.' : 'Séance terminée. ' + min + ' minutes. Maintenant, tu manges.'); vib([300, 100, 300]); flash(); }
}
function applyProgress(logs) {
  var ups = [];
  EX.forEach(function (e) {
    var ss = logs.filter(function (s) { return s.id === e.id; });
    var pl = R.plan.filter(function (p) { return p.e.id === e.id; })[0];
    if (!pl) return;
    var need = pl.sets;
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

function drawPain() {
  var pn = new DOMParser().parseFromString('<div class="rtop"><span class="small">Douleur</span></div><div class="rbody"><div class="rl"><p class="title">Arrête et respire</p><p class="small">Ne force pas à travers une douleur. Si elle est vive, brutale ou si elle dure, consulte un médecin ou un kinésithérapeute.</p></div><div class="rr"><button class="btn go" data-act="painskip">Passer cet exercice</button><button class="btn alt" data-act="painend">Terminer la séance</button><button class="btn alt" data-act="painno">Reprendre</button></div></div>', 'text/html');
  runner.replaceChildren.apply(runner, Array.prototype.slice.call(pn.body.childNodes));
}
function painMark() {
  var s = cur(); if (!s) return;
  var nm = s.k === 'warm' ? s.label : R.plan[s.pi].name; R.pain = R.pain || [];
  if (R.pain.indexOf(nm) < 0) R.pain.push(nm);
  if (R.stretch) {
    var sv = R.sess || null;
    if (!sv) D.sessions.forEach(function (x) { if (x.free && x.date === today()) sv = x; });
    if (sv) { sv.pain = sv.pain || []; if (sv.pain.indexOf(nm) < 0) sv.pain.push(nm); save(); }
  }
}
function painRecent() {
  var d30 = new Date(), d7 = new Date(), lim, wk; d30.setDate(d30.getDate() - 30); d7.setDate(d7.getDate() - 7); lim = dstr(d30); wk = dstr(d7);
  var cnt = {}, rec = {};
  D.sessions.forEach(function (x) { if (x.date >= lim) (x.pain || []).forEach(function (n) { cnt[n] = (cnt[n] || 0) + 1; if (x.date >= wk) rec[n] = 1; }); });
  return { rec: Object.keys(rec), again: Object.keys(cnt).filter(function (n) { return cnt[n] >= 2; }) };
}
function painCard() {
  var r = painRecent();
  if (!r.rec.length) return '';
  return '<div class="card"><h2>Douleur signalée récemment</h2><p class="small"><b>' + r.rec.map(esc).join(', ') + '</b></p><p class="small">Va doucement sur cet exercice, ou passe-le si ça fait mal.</p>' + (r.again.length ? '<p class="small">Elle est revenue plusieurs fois : parles-en à un médecin ou à un kinésithérapeute.</p>' : '') + '</div>';
}
function draw() {
  if (R.painOpen) { drawPain(); return; }
  var s = cur(), h = '', pr = Math.round(R.i / R.steps.length * 100);
  h += '<div class="rtop"><span class="small">' + (s.k === 'warm' ? (R.stretch ? 'Étirements' : 'Échauffement') : 'Exercice ' + (s.pi + 1) + '/' + R.plan.length + ' · série ' + s.sn + '/' + R.plan[s.pi].sets) + '</span>' +
    '<span class="row">' + '<button class="btn alt sm" data-act="pain">J\'ai mal</button>' + '<button class="btn alt sm" data-act="pause">' + (R.paused ? 'Reprendre' : 'Pause') + '</button><button class="btn alt sm" data-act="quit">' + (R.quit ? 'Confirmer' : 'Quitter') + '</button></span></div>';
  h += '<div class="bar"><i style="width:' + pr + '%"></i></div>' + mMiniHtml();
  if (s.k === 'warm') {
    h += '<div class="rbody"><div class="rl"><p class="title">' + esc(s.label) + '</p>' + (s.fig ? drawBox(s.fig, R.paused ? 'hold' : 'loop', s.period) : '') + '</div><div class="rr"><div class="big" id="tmr">' + s.sec + '</div><p class="sub">secondes</p><button class="btn alt" data-act="skip">Passer</button></div></div>';
  } else {
    var p = R.plan[s.pi], e = p.e, unit = e.timed ? 'secondes' : 'répétitions';
    var ds = R.phase === 'rest' && R.steps[R.i + 1] ? R.plan[R.steps[R.i + 1].pi] : p;
    h += '<div class="rbody"><div class="rl"><p class="title">' + esc(ds.name) + '</p>' + drawBox(ds.e.id, (R.paused || ds.e.timed) ? 'hold' : 'loop', Math.max(2, +P.tempo || 3)) + '</div><div class="rr">';
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
  var h = '<div class="rtop"><span class="small">' + (R.partial ? (R.solo ? 'Exercice interrompu' : 'Séance interrompue') : (R.solo ? 'Exercice terminé' : 'Séance terminée')) + '</span></div>';
  h += '<div class="rbody"><div class="rl"><p class="title">' + (R.solo ? 'Enregistré dans l\'historique (libre)' : R.partial ? 'Séance incomplète enregistrée' : 'Séance validée') + '</p><div class="stats"><div class="stat"><b>' + R.min + '</b><span>minutes</span></div><div class="stat"><b>' + R.logs.length + '</b><span>séries</span></div><div class="stat"><b>' + R.logs.reduce(function (a, x) { return a + (R.plan.filter(function (p) { return p.e.id === x.id; })[0].e.timed ? 0 : x.reps); }, 0) + '</b><span>répétitions</span></div></div></div><div class="rr">';
  if (R.ups && R.ups.length) h += '<div class="card"><h2>Tu passes au niveau supérieur</h2><ul class="list">' + R.ups.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul></div>';
  if (R.prs && R.prs.length) h += '<div class="card"><h2>Nouveau record</h2><ul class="list">' + R.prs.map(function (r) { var u = r.timed ? ' s' : ''; return '<li><b>' + esc(r.name) + '</b> : <span>' + r.v + u + '</span> <span class="small">(<span>' + r.old + u + '</span>)</span><br><span class="small">Prochain objectif</span> <span>' + r.nx + u + '</span></li>'; }).join('') + '</ul></div>';
  if (R.pain && R.pain.length) h += '<div class="card"><h2>Douleur signalée</h2><p class="small"><b>' + R.pain.map(esc).join(', ') + '</b></p><p class="small">Repose-toi. Si la douleur revient ou dure, consulte un médecin ou un kinésithérapeute.</p></div>';
  h += '<div class="card coach"><span class="head">Le coach</span><p class="msg">' + (R.solo ? 'Bien joué. Une série de plus chaque semaine, c\'est comme ça qu\'on progresse.' : R.partial ? 'Tu as arrêté en route. La prochaine fois, tu vas au bout.' : 'Mange dans l\'heure, hydrate-toi, dors tes 7 heures. La séance ne compte que si la récupération suit.') + '</p></div>';
  if (R.quick && !R.partial) h += '<div class="card"><h2>Séance express</h2><p class="small">Cette séance ne compte pas pour la montée de niveau ni pour l\'effort moyen. Fais la séance complète pour progresser.</p></div>';
  if (R.sess && !R.partial && !R.solo && !R.quick) h += '<div class="card"><h2>Effort ressenti (1 = très facile, 5 = très dur)</h2><div class="seg">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="rpe" data-n="' + n + '" class="' + (+R.sess.rpe === n ? 'on' : '') + '" aria-pressed="' + (+R.sess.rpe === n) + '">' + n + '</button>'; }).join('') + '</div></div>';
  if (!R.stretched) h += '<div class="card"><h2>Étirements</h2><p class="small">3 minutes pour détendre les muscles. Sans forcer, sans rebondir.</p><button class="btn alt" data-act="stretch">Faire les étirements</button></div>';
  h += '<button class="btn go" data-act="closerun">Fermer</button></div></div>';
  runner.innerHTML = h;
}

/* © KVES · Coach-Mass-KVES */
/* ====================== photos de progression (locales) ====================== */
/* Stockées dans IndexedDB (base « coach-masse-ph ») sur l'appareil, jamais envoyées, hors sauvegarde. */
var PH = { list: null, urls: {}, sel: [], armed: '', db: null };
function phDb() {
  if (!PH.db) PH.db = new Promise(function (res, rej) {
    try {
      var q = indexedDB.open('coach-masse-ph', 1);
      q.onupgradeneeded = function () { q.result.createObjectStore('p', { keyPath: 'id' }); };
      q.onsuccess = function () { res(q.result); };
      q.onerror = function () { rej(q.error); };
    } catch (e) { rej(e); }
  });
  return PH.db;
}
function phTx(mode, fn) {
  return phDb().then(function (db) {
    return new Promise(function (res, rej) {
      var tx = db.transaction('p', mode), out = fn(tx.objectStore('p'));
      tx.oncomplete = function () { res(out && out.result !== undefined ? out.result : undefined); };
      tx.onerror = tx.onabort = function () { rej(tx.error); };
    });
  });
}
function phLoad() {
  if (PH.list) return;
  PH.list = [];
  phTx('readonly', function (st) { return st.getAll(); }).then(function (a) {
    PH.list = (a || []).sort(function (x, y) { return x.date < y.date ? -1 : x.date > y.date ? 1 : (x.id < y.id ? -1 : 1); });
    if (PH.list.length && tab === 'track') render();
  }).catch(function () {});
}
function phUrl(it) { if (!PH.urls[it.id]) PH.urls[it.id] = URL.createObjectURL(it.blob); return PH.urls[it.id]; }
function phResize(file, cb) {
  var img = new Image(), u = URL.createObjectURL(file);
  img.onload = function () {
    var k = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(u);
    c.toBlob(function (b) { cb(b); }, 'image/jpeg', 0.8);
  };
  img.onerror = function () { URL.revokeObjectURL(u); cb(null); };
  img.src = u;
}
function phDel(ids) {
  return Promise.all(ids.map(function (id) { return phTx('readwrite', function (st) { return st.delete(id); }); })).then(function () {
    ids.forEach(function (id) { if (PH.urls[id]) { URL.revokeObjectURL(PH.urls[id]); delete PH.urls[id]; } });
    PH.list = (PH.list || []).filter(function (x) { return ids.indexOf(x.id) < 0; });
    PH.sel = PH.sel.filter(function (x) { return ids.indexOf(x) < 0; }); PH.armed = '';
    render();
  }).catch(function () {});
}
function phWipe() {
  Object.keys(PH.urls).forEach(function (k) { try { URL.revokeObjectURL(PH.urls[k]); } catch (e) {} });
  PH.urls = {}; PH.list = []; PH.sel = []; PH.armed = '';
  return phTx('readwrite', function (st) { return st.clear(); }).catch(function () {});
}
function phCard() {
  phLoad();
  var L = PH.list || [], h = '<div class="card" id="phcard"><h2>Photos de progression</h2><p class="small">Tes photos restent uniquement sur ce téléphone, jamais envoyées. Elles ne sont pas dans la sauvegarde.</p>';
  h += '<p class="small"><b>Attention :</b> si tu effaces les données du site dans Chrome, les photos disparaissent. Exporte-les de temps en temps.</p>';
  h += '<div class="row"><label class="btn alt sm">Ajouter une photo<input type="file" accept="image/*" data-ph="add" hidden></label><label class="btn alt sm">Importer des photos<input type="file" accept=".json,application/json" data-ph="imp" hidden></label>' + (L.length ? '<button class="btn alt sm" data-act="phexp">Exporter les photos</button><button class="btn alt sm" data-act="phexpenc">Exporter chiffré</button>' : '') + '</div>';
  if (L.length) h += '<p class="small">' + (P.phExp ? '<span>Dernier export :</span> ' + esc(sdate(P.phExp)) : 'Jamais exporté') + '</p>';
  if (!L.length) return h + '<p class="small">Aucune photo pour l\'instant.</p></div>';
  h += '<p class="small">Touche deux photos pour les comparer.</p><div class="phgrid">' + L.map(function (it) {
    return '<button class="phth' + (PH.sel.indexOf(it.id) >= 0 ? ' on' : '') + '" data-act="phsel" data-id="' + esc(it.id) + '" aria-pressed="' + (PH.sel.indexOf(it.id) >= 0) + '" aria-label="' + esc(trText('Photo du') + ' ' + sdate(it.date)) + '"><img src="' + phUrl(it) + '" alt=""><span>' + esc(sdate(it.date)) + '</span></button>';
  }).join('') + '</div>';
  if (PH.sel.length === 2) {
    var a = L.filter(function (x) { return PH.sel.indexOf(x.id) >= 0; });
    h += '<div class="phcmp">' + a.map(function (it, i) { return '<figure><img src="' + phUrl(it) + '" alt=""><figcaption><span>' + (i ? 'Après' : 'Avant') + '</span> · ' + esc(sdate(it.date)) + '</figcaption></figure>'; }).join('') + '</div>';
  }
  if (PH.sel.length) h += '<button class="btn bad sm" data-act="phdel">' + (PH.armed ? 'Confirmer : supprimer' : 'Supprimer') + '</button>';
  return h + '</div>';
}
function phToData(b) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsDataURL(b); }); }
function phExport(pass) {
  var L = PH.list || [];
  Promise.all(L.map(function (it) { return phToData(it.blob).then(function (d) { return { id: it.id, date: it.date, data: d }; }); })).then(function (items) {
    var plain = JSON.stringify({ app: 'coach-masse-photos', v: 1, items: items });
    return pass ? encPack(plain, pass) : plain;
  }).then(function (txt) {
    var b = new Blob([txt], { type: 'application/json' }), name = 'photos-coach-mass-' + (pass ? 'chiffrees-' : '') + today() + '.json', f = null;
    function dl() { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
    P.phExp = today(); save(); render();
    try { f = new File([b], name, { type: 'application/json' }); } catch (e) { f = null; }
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: 'Photos Coach-Mass-KVES' }).catch(function (e) { if (!e || e.name !== 'AbortError') dl(); });
    else dl();
  }).catch(function () { toast('Photo illisible'); });
}
function phImport(file) {
  var r = new FileReader();
  r.onload = function () {
    var j;
    try { j = JSON.parse(r.result); } catch (e) { j = null; }
    if (j && j.coachMasseEnc) { ENCIMP = j; ENCCB = phImportObj; encImportOpen(); return; }
    phImportObj(j);
  };
  r.readAsText(file);
}
function phImportObj(j) {
  var add = [], have = {};
  {
    if (!j || j.app !== 'coach-masse-photos' || !Array.isArray(j.items)) { toast('Fichier non reconnu'); return; }
    (PH.list || []).forEach(function (x) { have[x.id] = 1; });
    j.items.slice(0, 300).forEach(function (it) {
      if (!it || typeof it.id !== 'string' || it.id.length > 40 || have[it.id] || !/^\d{4}-\d{2}-\d{2}$/.test(it.date) || typeof it.data !== 'string' || it.data.indexOf('data:image/jpeg;base64,') !== 0 || it.data.length > 4000000) return;
      try {
        var bin = atob(it.data.slice(23)), u = new Uint8Array(bin.length), k;
        for (k = 0; k < bin.length; k++) u[k] = bin.charCodeAt(k);
        add.push({ id: it.id, date: it.date, blob: new Blob([u], { type: 'image/jpeg' }) });
      } catch (e) {}
    });
    if (!add.length) { toast('Aucune nouvelle photo'); return; }
    Promise.all(add.map(function (it) { return phTx('readwrite', function (st) { return st.put(it); }); })).then(function () {
      PH.list = (PH.list || []).concat(add).sort(function (x, y) { return x.date < y.date ? -1 : x.date > y.date ? 1 : (x.id < y.id ? -1 : 1); }); render(); toast('Photos importées');
    }).catch(function () { toast('Photo illisible'); });
  }
}
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t && t.getAttribute && t.getAttribute('data-ph') === 'imp') { var fi = t.files && t.files[0]; t.value = ''; if (fi) phImport(fi); return; }
  if (!t || !t.getAttribute || t.getAttribute('data-ph') !== 'add') return;
  var f = t.files && t.files[0]; t.value = '';
  if (!f) return;
  phResize(f, function (b) {
    if (!b) { toast('Photo illisible'); return; }
    var it = { id: Date.now() + '-' + Math.floor(Math.random() * 1e6), date: today(), blob: b };
    phTx('readwrite', function (st) { return st.put(it); }).then(function () {
      PH.list = (PH.list || []).concat([it]); PH.armed = ''; render();
    }).catch(function () { toast('Photo illisible'); });
  });
});
document.addEventListener('click', function (ev) {
  var t = ev.target && ev.target.closest ? ev.target.closest('[data-act]') : null;
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'phsel') {
    var id = t.getAttribute('data-id'), i = PH.sel.indexOf(id);
    if (i >= 0) PH.sel.splice(i, 1); else { PH.sel.push(id); if (PH.sel.length > 2) PH.sel.shift(); }
    PH.armed = ''; render();
  } else if (a === 'phexp') { phExport(); }
  else if (a === 'phexpenc') { encExportOpen('ph'); }
  else if (a === 'phdel') {
    if (!PH.armed) { PH.armed = '1'; render(); return; }
    phDel(PH.sel.slice());
  }
});
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
    mark(); window.open('https://wa.me/' + String(CFG.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  } else if (navigator.share) {
    navigator.share({ title: 'Avis Coach-Mass-KVES', text: text }).then(mark).catch(function () {});
  } else { copyText(text); }
}

/* vues */
function backBtn() { return '<button class="btn alt sm back" data-act="tab" data-v="more">← Plus</button>'; }
var LEGAL = {"sante": [["t", "Avertissement santé"], ["p", "Coach-Mass-KVES est un outil d'entraînement et de suivi à usage personnel. Ce n'est pas un dispositif médical et il ne remplace pas l'avis d'un médecin, d'un kinésithérapeute ou d'un diététicien."], ["h", "Avant de commencer"], ["li", "Si tu as une maladie (cœur, tension, articulations, dos, diabète…), une blessure, ou si tu es sous traitement, demande l'avis d'un médecin avant de t'entraîner ou de changer ton alimentation."], ["li", "Si tu fumes, si tu as été longtemps sédentaire ou si tu reprends le sport, commence doucement. Le coach te le rappellera, mais c'est à toi de t'écouter."], ["li", "Cette application est destinée aux adultes (18 ans et plus). Elle n'est pas faite pour les femmes enceintes sans avis médical."], ["h", "Pendant l'entraînement"], ["li", "Arrête immédiatement en cas de douleur vive, vertige, malaise, gêne dans la poitrine, essoufflement anormal ou douleur articulaire. Ne « force » pas à travers une douleur."], ["li", "Échauffe-toi toujours. Respecte les temps de repos."], ["li", "Les exercices marqués « à risque » demandent une attention particulière : lis les précautions avant de les lancer."], ["li", "En cas de symptôme grave, appelle les secours (au Maroc : 15 pour le SAMU, 150 pour la Protection civile)."], ["h", "Alimentation et poids"], ["li", "Les calories et protéines proposées sont des estimations générales calculées à partir de ce que tu saisis. Elles ne tiennent pas compte de ton état de santé."], ["li", "L'application ne propose pas de régime en dessous d'un seuil de sécurité, et ne remplace pas un suivi nutritionnel."], ["h", "Responsabilité"], ["li", "Tu t'entraînes sous ta propre responsabilité. Les auteurs ne peuvent pas être tenus responsables d'une blessure ou d'un problème de santé lié à l'usage de l'application, dans la mesure permise par la loi."]], "confid": [["t", "Politique de confidentialité"], ["p", "En bref : tes données restent sur ton téléphone. Nous n'avons pas de serveur, pas de compte, pas de publicité, pas de traceur."], ["h", "Quelles données ?"], ["li", "Ton profil (âge, taille, poids, objectif, régime, allergies déclarées), tes séances, tes mesures, tes réglages."], ["li", "Si tu les actives : suivi du tabac, douleurs signalées pendant les séances, photos de progression."], ["li", "Ces données peuvent concerner ta santé : elles sont donc sensibles. Tu les saisis volontairement."], ["h", "Où sont-elles ?"], ["li", "Uniquement dans le stockage local de ton navigateur/appli (sur ton appareil). Elles ne sont envoyées nulle part automatiquement."], ["li", "Les photos de progression sont gardées séparément sur ton appareil. Elles ne sont pas dans la sauvegarde normale."], ["li", "Si tu supprimes les données du site ou désinstalles l'application, elles disparaissent, sauf si tu as fait une sauvegarde."], ["h", "Ce que tu choisis de partager"], ["li", "Sauvegarde : le fichier est créé sur ton appareil. Tu décides où le ranger. Il n'est pas chiffré à ce stade : garde-le en lieu sûr."], ["li", "Export des photos : le fichier contient tes photos et n'est pas chiffré. Garde-le en lieu sûr."], ["li", "Image du bilan de la semaine : elle est créée sur ton appareil et c'est toi qui choisis de la partager. Le poids n'y figure que si tu le coches."], ["li", "QR code de partage : il contient seulement l'adresse de l'application, aucune donnée personnelle."], ["li", "Boîte à avis : ton message est chiffré de bout en bout avec la clé publique du propriétaire. Seul le propriétaire peut le lire. Ne mets pas d'informations de santé ou personnelles dont tu n'as pas besoin."], ["li", "Rappels / calendrier (.ics) : le fichier est créé sur ton appareil, puis traité par ton application de calendrier."], ["h", "Voix du coach"], ["li", "La voix utilise la synthèse vocale de ton téléphone. Selon la voix choisie dans Android, elle peut passer par un service en ligne du fabricant ou de Google. L'application n'y envoie que le texte lu, jamais tes données."], ["h", "Musique"], ["li", "Les fichiers audio que tu choisis restent sur ton appareil. Ils ne sont ni copiés ni envoyés."], ["h", "Hébergement"], ["li", "L'application est hébergée sur GitHub Pages. GitHub peut enregistrer des données techniques de connexion (adresse IP, par exemple) selon sa propre politique. L'application elle-même n'y envoie rien."], ["h", "Tes droits"], ["li", "Accès, modification, suppression : tout se fait dans l'application (Réglages > Données). Tu peux tout effacer à tout moment."], ["li", "« Effacer toutes les données » supprime aussi les photos de progression."], ["li", "Pour une question ou une demande : utilise la boîte à avis."], ["h", "Cadre légal"], ["p", "Loi marocaine 09-08 sur la protection des données personnelles (CNDP) et, pour les utilisateurs concernés, RGPD."], ["p", "Mineurs : l'application est réservée aux 18 ans et plus."], ["p", "Changements : cette politique peut évoluer. La date de dernière mise à jour est indiquée en bas de page."]], "cond": [["t", "Conditions d'utilisation"], ["li", "Objet : Coach-Mass-KVES est une application gratuite de coaching sportif et de suivi, © KVES."], ["li", "Usage : personnel et non commercial. Tu dois avoir 18 ans ou plus."], ["li", "Santé : tu as lu l'avertissement santé et tu t'entraînes sous ta responsabilité."], ["li", "Pas de garantie : l'application est fournie « telle quelle », sans promesse de résultat (prise de poids, de muscle) ni de disponibilité continue. Les résultats dépendent de toi, de ton alimentation, de ton sommeil et de ta santé."], ["li", "Données : tu es responsable de tes sauvegardes. Les données sont locales (voir la politique de confidentialité)."], ["li", "Contenus : textes, illustrations, logo, nom et signature KVES sont protégés. Copie et redistribution interdites sans accord, sauf licence indiquée."], ["li", "Conduite : n'essaie pas de détourner l'application ni de nuire à d'autres utilisateurs (par exemple via la boîte à avis)."], ["li", "Évolution : l'application peut changer ou s'arrêter. Les conditions peuvent être mises à jour, la version en vigueur est celle affichée dans l'application."], ["li", "Droit applicable : droit marocain. Tribunaux compétents : Casablanca."], ["li", "Contact : via la boîte à avis."]]};
LEGAL.adapt = [["t", "Comment le programme s'adapte"], ["p", "Le programme se calibre selon ton profil et ton objectif. Voici ce qui change tout seul, et ce qui reste fixe pour l'instant."], ["h", "Ce qui s'adapte automatiquement"], ["li", "Calories et protéines : calculées selon ton objectif, ton âge, ta taille, ton poids et ton genre, avec un plancher de sécurité en perte de poids."], ["li", "Portions des repas : ajustées à ta cible de calories."], ["li", "Horaires des repas : tu les choisis dans Réglages > Heures des repas, avec l'option « dernier repas avant 20 h 30 »."], ["li", "Menus : plus légers pour la perte de poids, la tonification et le maintien (yaourt nature, fruits, plus de légumes) ; la prise de masse garde ses menus riches."], ["li", "Fruits : une orange au petit-déjeuner et un fruit de saison à la collation de 18 h, comptés dans la liste de courses."], ["li", "Menus : filtrés selon tes allergies, ton régime végétarien, ton budget et tes variantes choisies. La liste de courses suit."], ["li", "Séances : allégées si tu dors peu ou si ton énergie est basse. Plus difficiles quand tu réussis tes séries."], ["li", "Effort et récupération : l'effort ressenti et la semaine d'allègement règlent la charge."], ["li", "Poids visé : refusé s'il est trop éloigné ou dangereux pour ta taille."], ["h", "Ce qui reste fixe pour l'instant"], ["h", "À retenir"], ["p", "Ces repères sont généraux et ne remplacent pas un diététicien. En cas de doute, demande un avis professionnel."]];
var LEGAL_DATE = 'Dernière mise à jour : 22 novembre 2026';
function viewLegal(k) {
  var it = LEGAL[k], h = backBtn() + '<h1>' + esc(it[0][1]) + '</h1><div class="card">', ul = false;
  it.slice(1).forEach(function (x) {
    if (x[0] === 'li' && !ul) { h += '<ul class="list">'; ul = true; }
    if (x[0] !== 'li' && ul) { h += '</ul>'; ul = false; }
    h += x[0] === 'h' ? '<h2>' + esc(x[1]) + '</h2>' : x[0] === 'p' ? '<p>' + esc(x[1]) + '</p>' : '<li>' + esc(x[1]) + '</li>';
  });
  if (ul) h += '</ul>';
  if (k === 'adapt') return h + '</div>';
  return h + '<p class="small">' + LEGAL_DATE + '</p><p class="small">Brouillon à faire relire par un professionnel avant publication publique.</p></div>';
}
function viewSante() { return viewLegal('sante'); }
function viewConfid() { return viewLegal('confid'); }
function viewCond() { return viewLegal('cond'); }
function viewAdapt() { return viewLegal('adapt'); }
function viewMore() {
  return '<h1>Plus</h1>' + (PEND ? '<div class="card"><h2>Mise à jour disponible</h2>' + (PEND.v ? '<p class="small">Version ' + esc(PEND.v) + '</p>' : '') + '<button class="btn" data-act="updopen">Voir les nouveautés</button></div>' : '') +
    '<div class="card"><h2>Boîte à avis</h2><p class="small">Une idée, un problème, un merci ? Ton avis est chiffré sur ton téléphone avant l\'envoi : seul le propriétaire de l\'application peut le lire.</p><button class="btn" data-act="tab" data-v="avis">Donner mon avis</button></div>' +
    persistCard() + pinCard() + lvlCard() +
    '<div class="card"><h2>Réglages</h2><p class="small">Jours de séance, voix, sons, objectif de poids, rotation de l\'écran.</p><button class="btn alt" data-act="tab" data-v="settings">Ouvrir les réglages</button></div>' +
    '<div class="card"><h2>Lecteur de musique</h2><p class="small">Écoute la musique de ton téléphone (MP3, M4A). Rien n\'est copié ni envoyé.</p><button class="btn alt" data-act="tab" data-v="player">Ouvrir le lecteur</button></div>' +
    '<div class="card"><h2>Sources et limites</h2><p class="small">D\'où viennent les repères du programme, et les précautions à connaître.</p><button class="btn alt" data-act="tab" data-v="sources">Lire</button></div>' +
    '<div class="card"><h2>Comment le programme s\'adapte</h2><p class="small">Ce qui change selon ton objectif, et ce qui reste fixe.</p><button class="btn alt" data-act="tab" data-v="adapt">Lire</button></div>' +
    shareCard() +
    '<div class="card"><h2>À propos</h2><img class="banner" src="banner.jpg" alt="' + NOM + '" width="1200" height="593"><img class="klogo" src="logo-kves.png" alt="KVES Services &amp; Tech" width="900" height="491"><p class="small">Une application de KVES Services &amp; Tech.</p><p class="small" id="sigstat" role="status">' + SIG_MSG[SIG.s] + '</p><p class="small" id="sigfp" hidden><span>Empreinte de la clé KVES :</span> <code id="sigfpv"></code></p><p class="small">' + NOM + ' · version ' + VERSION + ' · © ' + AUTEUR + '. Tes données restent sur ton téléphone.</p><button class="btn alt sm back" data-act="tab" data-v="owner">Espace propriétaire</button></div>' +
    '<div class="card"><h2>Légal</h2><div class="links"><button class="linkrow" data-act="tab" data-v="sante">Avertissement santé</button><button class="linkrow" data-act="tab" data-v="confid">Politique de confidentialité</button><button class="linkrow" data-act="tab" data-v="cond">Conditions d\'utilisation</button></div></div>';
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
var SHOP_SCALE = { pain: 1, riz: 1, huile: 1, amlou: 1, flocons: 1, miel: 1, dattes: 1, lait: 1 };
function shopFmt(k, q) {
  var u = SHOPN[k][1];
  if (u === 'g') return qG(Math.round(q / 10) * 10);
  if (u === 'L') return qL(q);
  if (u === 'ml') return Math.round(q / 10) * 10 + ' ml';
  if (u === 'p') return Math.round(q) + ' pièces';
  if (u === 'v') return Math.round(q) + ' verres';
  return String(Math.max(1, Math.round(q)));
}
/* liste calculée d'après les repas réels : objectif, régime, budget et variantes choisies */
function shopList() {
  var d = P.shopDays || 7, f = mealFactor(), tot = {};
  function add(o, days) {
    Object.keys(o.shop || {}).forEach(function (k) { tot[k] = (tot[k] || 0) + o.shop[k] * days * (SHOP_SCALE[k] ? f : 1); });
  }
  planSlots().forEach(function (s) {
    var ch = slotChoices(s), n = ch.length, left = d;
    ch.forEach(function (o, i) { var dd = i === n - 1 ? left : Math.ceil(d / n); left -= dd; if (dd > 0) add(o, dd); });
  });
  if (obj() === 'masse' && P.kcalAdj >= 300) add(extraMeal(), d);
  return SHOP_ORDER.filter(function (k) { return tot[k] > 0; }).map(function (k) { return [k, SHOPN[k][0], shopFmt(k, tot[k])]; });
}
function shopSeg(act, cur, opts) {
  return '<div class="seg" role="group">' + opts.map(function (o) { return '<button data-act="' + act + '" data-v="' + o[0] + '" class="' + (String(cur) === String(o[0]) ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>';
}
function shopCard() {
  var done = P.shopDone || {}, L = shopList(), n = 0;
  var h = '<div class="card"><h2>Liste de courses</h2><p class="small">Choisis tes variantes : la liste se calcule toute seule, d\'après les repas ci-dessus.</p>' +
    '<label class="f">Pour combien de jours</label>' + shopSeg('shopdays', P.shopDays, [[3, '3 jours'], [7, '7 jours'], [14, '14 jours']]) +
    '<label class="f">Déjeuner</label>' + shopSeg('shopm3', P.shopM3, [['poulet', 'Poulet'], ['sardines', 'Sardines'], ['mix', 'Alterné']]) +
    '<label class="f">Dîner</label>' + shopSeg('shopm5', P.shopM5, [['lentilles', 'Lentilles'], ['pois', 'Pois chiches'], ['mix', 'Alterné']]) + '<div class="shop">';
  L.forEach(function (x) {
    if (done[x[0]]) n++;
    h += '<label class="meal"><input type="checkbox" data-shop="' + x[0] + '"' + (done[x[0]] ? ' checked' : '') + '><span>' + esc(x[1]) + '</span><span class="k">' + esc(x[2]) + '</span></label>';
  });
  return h + '</div><p class="small">Quantités calculées d\'après tes repas, ton objectif, ton régime et ton budget. Légumes estimés, lentilles et pois chiches comptés secs (60 g secs pour 150 g cuits). Les prix varient : aucun coût n\'est affiché.</p>' +
    '<div class="row"><button class="btn sm grow" data-act="shopcopy">Copier la liste</button><button class="btn alt sm" data-act="shopreset">Tout décocher</button></div></div>';
}
function shopText() {
  return 'Courses (' + P.shopDays + ' jours)\n' + shopList().map(function (x) { return '- ' + x[1] + ' : ' + x[2]; }).join('\n');
}

/* © KVES · Coach-Mass-KVES */
/* rappels */
function hm(s) { var m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; }
function mealsAllDone() { var c = (D.logs[today()] || {}).meals || []; return mealsList().every(function (_, i) { return c[i]; }); }
function waterSlot(d) { var h = d.getHours() + d.getMinutes() / 60, r = -1; [10, 12, 14, 16, 18].forEach(function (x) { if (h >= x && h < 20.5) r = x; }); return r; }
function rmMealHM() {
  var m = hm(P.rmM); if (m === null) return null;
  var last = mealEff(Math.max(0, planSlots().length - 1));
  return Math.max(m, last + 30);
}
function rmMealStr() { var n = rmMealHM(); if (n === null) return P.rmM; n = Math.min(n, 23 * 60 + 59); return pad(Math.floor(n / 60)) + ':' + pad(n % 60); }
function rmDue() {
  var out = [];
  if (!P.rmOn) return out;
  var d = new Date(), n = d.getHours() * 60 + d.getMinutes(), w = hm(P.rmW), m = rmMealHM(), l = D.logs[today()] || {};
  if (w !== null && n >= w && !l.weight && P.rmLw !== today()) out.push('w');
  if (m !== null && n >= m && !mealsAllDone() && P.rmLm !== today()) out.push('m');
  var sl = waterSlot(d);
  if (P.rmWater && sl > 0 && P.rmLe !== today() + '#' + sl && (+l.water || 0) < waterTarget() * Math.max(0, Math.min(1, (sl - 8) / 13))) out.push('e');
  return out;
}
function syncRemind() {
  if (!window.caches || !P.rmOn) return;
  var l = D.logs[today()] || {};
  var o = { on: !!P.rmOn, w: P.rmW, m: rmMealStr(), wd: l.weight ? today() : '', md: mealsAllDone() ? today() : '', lw: P.rmLw || '', lm: P.rmLm || '', we: !!P.rmWater, ww: +l.water || 0, wt: waterTarget(), le: P.rmLe || '' };
  caches.open('coach-masse-remind').then(function (c) { return c.put('remind.json', new Response(JSON.stringify(o))); }).catch(function () {});
}
function sysNotify(txt, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted' || !navigator.serviceWorker) return false;
  navigator.serviceWorker.ready.then(function (reg) { reg.showNotification('Coach-Mass-KVES', { body: txt, tag: tag, icon: 'icon-192.png', badge: 'icon-192.png', vibrate: [200, 100, 200] }); }).catch(function () {});
  return true;
}
function rmNotify(kind) {
  var txt = kind === 'w' ? 'Pèse-toi à jeun et note ton poids.' : kind === 'e' ? 'Pense à boire : un verre d\'eau maintenant.' : 'Valide tes repas du jour.';
  if (kind === 'w') P.rmLw = today(); else if (kind === 'e') P.rmLe = today() + '#' + waterSlot(new Date()); else P.rmLm = today();
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
/* Calendrier : fichier .ics avec deux événements quotidiens et alerte (poids, repas). */
function icsText() {
  var d = new Date(), day = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  var stamp = day + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
  function ev(uid, hhmm, title, desc) {
    var m = hm(hhmm), e = (m + 15) % 1440;
    return ['BEGIN:VEVENT', 'UID:' + uid + '@coach-mass-kves', 'DTSTAMP:' + stamp, 'DTSTART:' + day + 'T' + pad(Math.floor(m / 60)) + pad(m % 60) + '00', 'DTEND:' + day + 'T' + pad(Math.floor(e / 60)) + pad(e % 60) + '00',
      'RRULE:FREQ=DAILY', 'SUMMARY:' + title, 'DESCRIPTION:' + desc, 'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:' + title, 'END:VALARM', 'END:VEVENT'];
  }
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KVES//Coach-Mass-KVES//FR', 'CALSCALE:GREGORIAN']
    .concat(ev('poids', P.rmW, 'Coach-Mass-KVES : note ton poids', 'Pese-toi a jeun puis note ton poids dans l application.'))
    .concat(ev('repas', rmMealStr(), 'Coach-Mass-KVES : valide tes repas', 'Valide les repas du jour dans l application.'))
    .concat(['END:VCALENDAR']).join('\r\n') + '\r\n';
}
function rmCard() {
  var np = 'Notification' in window ? Notification.permission : 'none';
  return '<div class="card"><h2>Rappels</h2><label class="meal"><input type="checkbox" data-rm="on"' + (P.rmOn ? ' checked' : '') + '><span><b>Rappels quotidiens</b><br><span class="small">Poids le matin, validation des repas le soir. Rien n\'est envoyé si c\'est déjà fait.</span></span></label>' +
    '<p class="small">La validation des repas n\'est jamais envoyée avant 30 minutes après ton dernier repas.</p>' +
    '<div class="grid2"><label class="f">Poids à<input type="time" data-rm="w" value="' + esc(P.rmW) + '"></label><label class="f">Validation repas à<input type="time" data-rm="m" value="' + esc(P.rmM) + '"></label></div>' +
    '<label class="meal"><input type="checkbox" data-rm="water"' + (P.rmWater ? ' checked' : '') + '><span><b>Rappel d\'eau</b><br><span class="small">Toutes les 2 h entre 10 h et 18 h, seulement si tu es en retard sur ton objectif.</span></span></label>' +
    '<p class="small">' + (np === 'granted' ? 'Notifications autorisées. ' : np === 'denied' ? 'Notifications bloquées : autorise-les dans les réglages Android de Chrome. ' : np === 'none' ? 'Notifications non disponibles ici. ' : '') +
    'Application fermée, Android peut retarder ou ignorer le rappel. Pour être sûr de l\'heure, ajoute-les aussi à ton calendrier.</p>' +
    '<div class="row"><button class="btn alt sm" data-act="rmtest">Tester</button><button class="btn alt sm grow" data-act="rmics">Ajouter au calendrier</button></div>' +
    '<p class="small">Crée deux événements quotidiens avec alerte (poids et repas). Si tu changes les heures, supprime les anciens événements puis ajoute-les de nouveau.</p></div>';
}

document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act="rmics"]');
  if (!t) return;
  if (hm(P.rmW) === null || hm(P.rmM) === null) { toast('Règle d\'abord les deux heures.'); return; }
  download('coach-mass-kves-rappels.ics', icsText(), 'text/calendar');
  toast('Fichier créé : ouvre-le pour l\'ajouter à ton calendrier.');
});
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
  if (a === 'lang') { if (LANGS[v]) { P.lang = v; save(); location.reload(); } return; }
  if (a === 'budget') { P.budget = v === 'serre' ? 'serre' : 'normal'; save(); render(); return; }
  if (a === 'diet') { var dk = t.getAttribute('data-k'); if (/^(noEgg|noMilk|noNuts|noGluten|veg)$/.test(dk)) { P[dk] = !P[dk]; save(); render(); } return; }
  if (a === 'shopdays') { P.shopDays = +v; save(); render(); return; }
  if (a === 'shopm3') { P.shopM3 = v; save(); render(); return; }
  if (a === 'shopm5') { P.shopM5 = v; save(); render(); return; }
  if (a === 'shopreset') { P.shopDone = {}; save(); render(); return; }
  if (a === 'weekcopy') { copyText(weekText(weekReview())); return; }
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
  if (k === 'water') { P.rmWater = !!t.checked; save(); if (t.checked && !P.rmOn) rmEnable(); else { render(); rmCheck(); } return; }
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
function bkAuto() { safePut(); return bkSnap('auto', 'auto-' + today()); }

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
/* sauvegarde chiffrée par phrase secrète (17.8) : PBKDF2-SHA256 + AES-GCM */
var ENCIMP = null, ENCCB = null, ENCWHAT = 'data';
function encKey(pass, salt, it) {
  return subtle().importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']).then(function (k) {
    return subtle().deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: it }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  });
}
function encPack(txt, pass) {
  var salt = rnd(16), iv = rnd(12), it = 250000;
  return encKey(pass, salt, it).then(function (k) { return subtle().encrypt({ name: 'AES-GCM', iv: iv }, k, new TextEncoder().encode(txt)); }).then(function (ct) {
    return JSON.stringify({ app: NOM, auteur: AUTEUR, coachMasseEnc: 1, kdf: 'PBKDF2-SHA256', it: it, salt: b64u(salt), iv: b64u(iv), ct: b64u(new Uint8Array(ct)) });
  });
}
function encUnpack(o, pass) {
  if (!o || o.coachMasseEnc !== 1 || typeof o.salt !== 'string' || typeof o.iv !== 'string' || typeof o.ct !== 'string' || !(o.it >= 100000 && o.it <= 1000000)) return Promise.reject(new Error('format'));
  return encKey(pass, unb64u(o.salt), o.it).then(function (k) { return subtle().decrypt({ name: 'AES-GCM', iv: unb64u(o.iv) }, k, unb64u(o.ct)); }).then(function (b) { return JSON.parse(new TextDecoder().decode(b)); });
}
function encMsg(t) { var m = $('#encmsg'); if (m) m.textContent = t; }
function encExportOpen(what) {
  ENCWHAT = what === 'ph' ? 'ph' : 'data';
  if (!pinOk()) { toast('Le chiffrement n\'est pas disponible sur cet appareil.'); return; }
  modal('<h2>Exporter chiffré</h2><p class="small">Ta sauvegarde sera illisible sans cette phrase secrète. Si tu l\'oublies, personne ne pourra la récupérer, pas même moi.</p><label class="f">Phrase secrète (8 caractères minimum)<input type="password" autocomplete="new-password" id="enc1"></label><label class="f">Répète-la<input type="password" autocomplete="new-password" id="enc2"></label><p class="small" id="encmsg" role="alert"></p><button class="btn" data-act="encgo">Exporter</button> <button class="btn alt" data-act="modalclose">Annuler</button>');
}
function encExportGo() {
  var a = $('#enc1').value, b = $('#enc2').value;
  if (a.length < 8) { encMsg('La phrase secrète doit faire au moins 8 caractères.'); return; }
  if (a !== b) { encMsg('Les deux phrases ne correspondent pas.'); return; }
  closeModal(); if (ENCWHAT === 'ph') phExport(a); else exportData(a);
}
function encImportOpen() {
  modal('<h2>Sauvegarde chiffrée</h2><p class="small">Saisis la phrase secrète choisie lors de l\'export.</p><label class="f">Phrase secrète<input type="password" autocomplete="off" id="encp"></label><p class="small" id="encmsg" role="alert"></p><button class="btn" data-act="encimpgo">Déchiffrer et importer</button> <button class="btn alt" data-act="encimpno">Annuler</button>');
}
function encImportGo() {
  var pw = $('#encp').value;
  encUnpack(ENCIMP, pw).then(function (o) { ENCIMP = null; closeModal(); (ENCCB || importObj)(o); ENCCB = null; }).catch(function () { encMsg('Phrase secrète incorrecte, ou fichier abîmé.'); });
}
function importObj(o) {
  try {
    if (o && o.coachMasse && o.data) o = o.data;
    if (schemaOf(o) > SCHEMA) { toast('Cette sauvegarde vient d\'une version plus récente de l\'appli : mets l\'appli à jour d\'abord.'); return; }
    if (!validData(o)) throw 0;
    applyData(o, 'avant-import'); toast('Sauvegarde importée.');
  } catch (e) { toast('Fichier invalide : rien n\'a été modifié.'); }
}
function exportData(pass) {
  var plain = JSON.stringify({ app: NOM, auteur: AUTEUR, coachMasse: VERSION, exportedAt: new Date().toISOString(), data: D });
  if (pass) { encPack(plain, pass).then(function (x) { exportRun(x, 'coach-mass-kves-sauvegarde-chiffree-' + today() + '.json'); }).catch(function () { toast('Export impossible sur cet appareil.'); }); return; }
  exportRun(plain, 'coach-mass-kves-sauvegarde-' + today() + '.json');
}
function exportRun(txt, name) {
  var file = null;
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
      if (String(r.result).length > 5000000) throw 0;
      var o = JSON.parse(r.result);
      if (o && o.coachMasseEnc) { ENCIMP = o; ENCCB = importObj; encImportOpen(); return; }
      importObj(o);
    } catch (e) { toast('Fichier invalide : rien n\'a été modifié.'); }
  };
  r.readAsText(f);
  ev.target.value = '';
});
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') bkAuto(); });
setTimeout(bkAuto, 2500);
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(function (p) { PERSIST = p; if (tab === 'settings') render(); }); } catch (e) {}

/* © KVES · Coach-Mass-KVES */
/* ====================== exercices dissociables : réglages par exercice + lancement seul ====================== */
function exDef(e) { return { sets: (wkNo() <= 2 || !e.grow) ? 3 : 4, reps: e.hi + lv(e.id).off, rest: e.rest + (+P.restBonus || 0) }; }
function exCfg(e) {
  var c = (P.exCfg && P.exCfg[e.id]) || {}, d = exDef(e);
  return { sets: c.sets || d.sets, reps: c.reps || d.reps, rest: c.rest || d.rest };
}
function exFind(id) { for (var i = 0; i < EX.length; i++) if (EX[i].id === id) return EX[i]; return null; }
function exStep(e, k, dir) {
  var c = exCfg(e), lim = k === 'sets' ? [1, 8, 1] : k === 'rest' ? [10, 300, 5] : e.timed ? [5, 300, 5] : [1, 100, 1];
  var v = Math.max(lim[0], Math.min(lim[1], c[k] + dir * lim[2]));
  P.exCfg = P.exCfg || {};
  (P.exCfg[e.id] = P.exCfg[e.id] || {})[k] = v;
  save();
  return v;
}
function exCfgHtml(e) {
  var c = exCfg(e), id = e.id;
  function row(k, label, unit) {
    return '<div class="cfgrow"><span class="grow">' + label + '</span><button class="btn alt sm round" data-act="excfg" data-id="' + id + '" data-k="' + k + '" data-d="-1" aria-label="Moins : ' + label + '">−</button><b class="cfgv" id="cfg_' + id + '_' + k + '">' + c[k] + '</b><button class="btn alt sm round" data-act="excfg" data-id="' + id + '" data-k="' + k + '" data-d="1" aria-label="Plus : ' + label + '">+</button><span class="small cfgu">' + unit + '</span></div>';
  }
  return '<details class="cfg"><summary>Réglages et lancement seul</summary>' +
    row('sets', 'Séries', '') + row('reps', e.timed ? 'Durée' : 'Répétitions', e.timed ? 's' : '') + row('rest', 'Repos', 's') +
    '<p class="small">Les séries et répétitions servent au lancement seul. Le repos s\'applique aussi à la séance complète.</p>' +
    '<div class="row"><button class="btn sm grow" data-act="exsolo" data-id="' + id + '">Lancer seul</button><button class="btn alt sm" data-act="exreset" data-id="' + id + '">Réinitialiser</button></div></details>';
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a !== 'excfg' && a !== 'exsolo' && a !== 'exreset' && a !== 'exsoloGo') return;
  var e = exFind(t.getAttribute('data-id'));
  if (!e) return;
  if (a === 'excfg') {
    var k = t.getAttribute('data-k'), v = exStep(e, k, +t.getAttribute('data-d')), n = $('#cfg_' + e.id + '_' + k);
    if (n) n.textContent = v;
    return;
  }
  if (a === 'exreset') { if (P.exCfg) delete P.exCfg[e.id]; save(); render(); toast('Réglages remis par défaut.'); return; }
  if (exLocked(e)) { toast('Exercice réservé aux niveaux avancés.'); return; }
  if (a === 'exsolo' && e.risk) {
    modal('<h2>⚠ Avant de lancer</h2><p><b>' + esc(e.name) + '</b></p><p class="small">' + esc(e.risk[0] + ' ' + e.risk[1]) + '</p><p class="small"><b>Arrête-toi si :</b> ' + esc(e.risk[2]) + '</p>' +
      '<button class="btn go" data-act="exsoloGo" data-id="' + e.id + '">Je comprends, lancer</button><button class="btn alt" data-act="modalclose">Annuler</button>');
    return;
  }
  if (a === 'exsoloGo') closeModal();
  if (!R) startSession({ only: e.id });
});
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
  if (a === 'quick') { startSession({ quick: true }); return; }
  if (a === 'energy') { log().energy = +t.getAttribute('data-n'); save(); render(); return; }
  if (a === 'cig') { var lc = log(); lc.cig = Math.max(0, (+lc.cig || 0) + +t.getAttribute('data-n')); save(); render(); return; }
  if (a === 'water') { var l = log(); l.water = Math.max(0, (+l.water || 0) + +t.getAttribute('data-n')); save(); render(); syncRemind(); return; }
  if (a === 'meal') { var lg = log(); lg.meals = lg.meals || []; lg.meals[+t.getAttribute('data-i')] = t.checked; save(); return; }
  if (a === 'adj') { P.kcalAdj += +t.getAttribute('data-v'); P.lastAdj = today(); save(); render(); return; }
  if (a === 'adjno') { P.lastAdj = today(); save(); render(); return; }
  if (a === 'measure') {
    var m = { date: today() }, any = false;
    MKEYS.forEach(function (k) { var v = parseFloat(($('#m_' + k).value || '').replace(',', '.')); if (v) { m[k] = v; any = true; } });
    if (any) { D.measures.push(m); save(); render(); }
    return;
  }
  if (a === 'day') { var d = +t.getAttribute('data-d'), i = P.days.indexOf(d); if (i >= 0) P.days.splice(i, 1); else P.days.push(d); save(); render(); return; }
  if (a === 'range') { CH.range = +t.getAttribute('data-v'); render(); return; }
  if (a === 'mksel') { CH.mk = t.getAttribute('data-v'); render(); return; }
  if (a === 'extra') {
    var xi = t.getAttribute('data-id'), xe = exFind(xi), core = !!(xe && xe.core), ar = core ? (P.sessOff = P.sessOff || []) : (P.extras = P.extras || []), ix = ar.indexOf(xi);
    if (!t.checked && EX.filter(inSession).length <= 3) { t.checked = true; toast('La séance garde au moins 3 exercices.'); return; }
    if (core) { if (t.checked && ix >= 0) ar.splice(ix, 1); else if (!t.checked && ix < 0) ar.push(xi); }
    else { if (t.checked && ix < 0) ar.push(xi); else if (!t.checked && ix >= 0) ar.splice(ix, 1); }
    save(); render(); return;
  }
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
    bkSnap('avant', 'avant-reset-' + Date.now()); safeWipe(); phWipe(); D = defaults(); P = D.profile; save(); applyTheme(); resetArmed = false; render(); return;
  }
  /* séance */
  if (!R) return;
  if (a === 'pause') {
    R.paused = !R.paused;
    if (R.paused) { R.remain = R.endAt - performance.now(); try { window.speechSynthesis.cancel(); } catch (e) {} }
    else R.endAt = performance.now() + R.remain;
    draw(); return;
  }
  if (a === 'pain') {
    if (R.phase === 'done' || !cur()) return;
    painMark(); R.painOpen = true; R.pp = !R.paused;
    if (R.pp) { R.paused = true; R.remain = R.endAt - performance.now(); try { window.speechSynthesis.cancel(); } catch (e) {} }
    draw(); try { runner.querySelector('[data-act=painskip]').focus(); } catch (e) {} return;
  }
  if (a === 'painno') { R.painOpen = false; if (R.pp) { R.paused = false; R.endAt = performance.now() + R.remain; R.pp = false; } draw(); try { runner.querySelector('[data-act=pain]').focus(); } catch (e) {} return; }
  if (a === 'painend') { R.painOpen = false; R.pp = false; R.paused = false; if (R.stretch) { endStretch(); return; } finish(true); return; }
  if (a === 'painskip' && cur().k === 'warm') { R.painOpen = false; R.pp = false; R.paused = false; clearTimer(); advance(); return; }
  if (a === 'painskip') {
    var ci = cur().pi, ni = -1, q;
    for (q = R.i + 1; q < R.steps.length; q++) { if (R.steps[q].k === 'set' && R.steps[q].pi !== ci) { ni = q; break; } }
    R.painOpen = false; R.pp = false; R.paused = false; R.painSkip = true; clearTimer();
    if (ni < 0) { finish(true); return; }
    R.i = ni - 1; advance(); return;
  }
  if (a === 'quit') {
    if (R.stretch && R.quit) { endStretch(); return; }
    if (!R.quit) { R.quit = true; draw(); setTimeout(function () { if (R && R.phase !== 'done') { R.quit = false; if (R.phase !== 'done') draw(); } }, 4000); return; }
    finish(true); return;
  }
  if (a === 'skip') { clearTimer(); if (R.phase === 'rest' || R.steps[R.i].k === 'warm') advance(); return; }
  if (a === 'plus') { R.endAt += 15000; R.remain += 15000; return; }
  if (a === 'begin') { work(); return; }
  if (a === 'stopwork') { stopWork(); return; }
  if (a === 'repp' || a === 'repm') {
    var lastLog = R.logs[R.logs.length - 1];
    if (lastLog) { lastLog.reps = Math.max(0, lastLog.reps + (a === 'repp' ? 1 : -1)); lastLog.m = true; R.reps = lastLog.reps; setTxt('reps', lastLog.reps); }
    return;
  }
  if (a === 'stretch') { startStretch(); return; }
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
    else { var n = parseFloat(t.value.replace(',', '.')); if (key === 'goal' && !isNaN(n)) { var gm = goalCheck(obj(), P.height, currentWeight(), n); if (gm) { toast(gm); render(); return; } } if (!isNaN(n)) P[key] = n; }
    if (key === 'rotate') applyRotate();
    save(); render(); return;
  }
  if (t.getAttribute('data-act') === 'meal') {
    var lg = log(); lg.meals = lg.meals || []; lg.meals[+t.getAttribute('data-i')] = t.checked; save();
  }
});
/* © KVES · Coach-Mass-KVES */
/* ====================== mise à jour : popup « nouveautés » et « version prête » ====================== */
/* verrou par code (17.3) : cache l'écran, ne chiffre pas les données */
var PIN_KEY = 'coach-masse-pin-v1', lockEl = null, lockHid = 0, lockFails = 0, lockUntil = 0, lockForgot = false;
function pinRec() { try { return JSON.parse(localStorage.getItem(PIN_KEY) || 'null'); } catch (e) { return null; } }
function pinOk() { return !!(subtle() && window.TextEncoder); }
function pinHash(pin, salt) {
  return subtle().importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']).then(function (k) {
    return subtle().deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: 150000 }, k, 256);
  }).then(function (b) { return b64u(new Uint8Array(b)); });
}
function pinSet(pin) { var salt = rnd(16); return pinHash(pin, salt).then(function (h) { localStorage.setItem(PIN_KEY, JSON.stringify({ s: b64u(salt), h: h })); }); }
function pinCheck(pin) { var r = pinRec(); if (!r) return Promise.resolve(true); return pinHash(pin, unb64u(r.s)).then(function (h) { return h === r.h; }); }
function lockMk(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
function lockShow() {
  if (!pinRec() || lockEl) return;
  var el = lockMk('div', 'lockscr'), inp = lockMk('input'), msg = lockMk('p', 'small');
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
  inp.type = 'password'; inp.setAttribute('inputmode', 'numeric'); inp.setAttribute('autocomplete', 'off'); inp.maxLength = 8; inp.id = 'lockpin'; inp.setAttribute('aria-label', 'Code');
  msg.id = 'lockmsg'; msg.setAttribute('role', 'alert');
  var go = lockMk('button', 'btn', 'Déverrouiller'); go.setAttribute('data-act', 'lockgo');
  var fg = lockMk('button', 'btn alt sm', 'Code oublié'); fg.setAttribute('data-act', 'lockforgot');
  el.appendChild(lockMk('h2', '', 'Application verrouillée')); el.appendChild(lockMk('p', 'small', 'Saisis ton code pour continuer.'));
  el.appendChild(inp); el.appendChild(msg); el.appendChild(go); el.appendChild(fg);
  document.body.appendChild(el); lockEl = el; lockForgot = false;
  try { inp.focus(); } catch (e) {}
}
function lockHide() { if (lockEl) { lockEl.remove(); lockEl = null; } lockFails = 0; }
function lockMsg(t) { var m = $('#lockmsg'); if (m) m.textContent = t; }
function lockTry() {
  var inp = $('#lockpin'); if (!inp) return;
  if (Date.now() < lockUntil) { lockMsg('Trop d\'essais : réessaie dans quelques secondes.'); return; }
  pinCheck(inp.value).then(function (ok) {
    if (ok) { lockHide(); return; }
    lockFails++; inp.value = '';
    if (lockFails >= 5) { lockFails = 0; lockUntil = Date.now() + 30000; lockMsg('Trop d\'essais : réessaie dans quelques secondes.'); } else lockMsg('Code incorrect.');
  }).catch(function () { lockMsg('Code incorrect.'); });
}
function lockForgotGo(btn) {
  if (!lockForgot) { lockForgot = true; btn.textContent = 'Confirmer : effacer toutes les données et le code'; lockMsg('Sans le code, la seule issue est d\'effacer les données de l\'appli.'); return; }
  safeWipe(); phWipe(); D = defaults(); P = D.profile; save(); try { localStorage.removeItem(PIN_KEY); } catch (e) {} lockHide(); applyTheme(); render();
}
function pinCard() {
  if (!pinOk()) return '';
  var on = !!pinRec();
  return '<div class="card"><h2>Verrouillage par code</h2><p class="small">Un code de 4 à 8 chiffres cache l\'application à l\'ouverture et après une minute d\'absence. C\'est un verrou d\'écran, pas un chiffrement : il protège d\'un regard indiscret.</p>' +
    (on ? '<p class="small"><b>Code actif.</b></p><button class="btn" data-act="locknow">Verrouiller maintenant</button> <button class="btn alt" data-act="pinoff">Retirer le code</button>' : '<button class="btn alt" data-act="pinset">Activer le code</button>') + '</div>';
}
function pinSetOpen() {
  modal('<h2>Choisir un code</h2><label class="f">Code (4 à 8 chiffres)<input type="password" inputmode="numeric" autocomplete="off" maxlength="8" id="pin1"></label><label class="f">Répète le code<input type="password" inputmode="numeric" autocomplete="off" maxlength="8" id="pin2"></label><p class="small" id="pinmsg" role="alert"></p><button class="btn" data-act="pinsave">Enregistrer</button> <button class="btn alt" data-act="modalclose">Annuler</button>');
}
function pinOffOpen() {
  modal('<h2>Retirer le code</h2><label class="f">Code actuel<input type="password" inputmode="numeric" autocomplete="off" maxlength="8" id="pin1"></label><p class="small" id="pinmsg" role="alert"></p><button class="btn" data-act="pinoffgo">Retirer</button> <button class="btn alt" data-act="modalclose">Annuler</button>');
}
function pinMsg(t) { var m = $('#pinmsg'); if (m) m.textContent = t; }
function pinSave() {
  var a = $('#pin1').value, b = $('#pin2').value;
  if (!/^\d{4,8}$/.test(a)) { pinMsg('Le code doit contenir 4 à 8 chiffres.'); return; }
  if (a !== b) { pinMsg('Les deux codes ne correspondent pas.'); return; }
  pinSet(a).then(function () { closeModal(); toast('Code enregistré.'); render(); }).catch(function () { pinMsg('Impossible d\'enregistrer le code.'); });
}
function pinOffGo() {
  pinCheck($('#pin1').value).then(function (ok) { if (!ok) { pinMsg('Code incorrect.'); return; } try { localStorage.removeItem(PIN_KEY); } catch (e) {} closeModal(); toast('Code retiré.'); render(); }).catch(function () { pinMsg('Code incorrect.'); });
}
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') lockHid = Date.now();
  else if (lockHid && Date.now() - lockHid > 60000) lockShow();
});
document.addEventListener('keydown', function (ev) {
  if (ev.key !== 'Enter' || !ev.target || !ev.target.id) return;
  if (ev.target.id === 'lockpin') lockTry();
});
/* œil pour voir ou masquer un mot de passe (17.4) */
function eyeAll() {
  var list = document.querySelectorAll('input[type=password]:not([data-eye])'), i;
  for (i = 0; i < list.length; i++) {
    var inp = list[i], foc = document.activeElement === inp, w = document.createElement('span'), b = document.createElement('button');
    inp.setAttribute('data-eye', '1'); w.className = 'pw';
    b.type = 'button'; b.className = 'eye'; b.setAttribute('data-act', 'eye'); b.setAttribute('aria-pressed', 'false'); b.textContent = 'Voir';
    inp.parentNode.insertBefore(w, inp); w.appendChild(inp); w.appendChild(b);
    if (foc) { try { inp.focus(); } catch (e) {} }
  }
}
function eyeToggle(b) {
  var inp = b.parentNode.querySelector('input'); if (!inp) return;
  var show = inp.type === 'password'; inp.type = show ? 'text' : 'password';
  b.setAttribute('aria-pressed', show ? 'true' : 'false'); b.textContent = show ? 'Masquer' : 'Voir';
}
new MutationObserver(eyeAll).observe(document.body, { childList: true, subtree: true });
/* niveau de départ (17.6) : auto-évaluation par mouvement, aucun effort demandé */
var TL = {};
function lvlOpen() {
  TL = {};
  var h = '<h2>Niveau de départ</h2><p class="small">Pour chaque mouvement, choisis la variante que tu peux faire 8 à 12 fois (ou tenir 30 secondes pour le gainage) en gardant une bonne forme. Dans le doute, prends la plus facile : l\'application te fera monter toute seule. Rien à faire maintenant, ce n\'est pas un test physique.</p>';
  EX.filter(function (e) { return e.core; }).forEach(function (e) {
    TL[e.id] = Math.min(lv(e.id).level, 2);
    h += '<h3>' + esc(e.name) + '</h3><div class="seg wrap" role="group">' + e.levels.slice(0, 3).map(function (n, i) { return '<button type="button" data-act="lvpick" data-e="' + e.id + '" data-v="' + i + '" class="' + (TL[e.id] === i ? 'on' : '') + '">' + esc(n) + '</button>'; }).join('') + '</div>';
  });
  h += '<button class="btn go" data-act="lvsave">Appliquer ce niveau</button> <button class="btn alt" data-act="modalclose">Plus tard</button>';
  modal(h);
}
function lvlSave() {
  EX.filter(function (e) { return e.core; }).forEach(function (e) { if (TL[e.id] !== undefined && TL[e.id] !== lv(e.id).level) { lv(e.id).level = TL[e.id]; lv(e.id).off = 0; } });
  P.lvlDone = today(); save(); closeModal(); render(); toast('Niveau enregistré.');
}
function lvlCard() {
  return '<div class="card"><h2>Niveau de départ</h2><p class="small">Règle la variante de chaque exercice selon ce que tu sais déjà faire.</p><button class="btn alt" data-act="lvlopen">Régler mon niveau</button></div>';
}
/* signature KVES (18.4) : vérifie que les fichiers viennent bien de KVES (Ed25519 + empreintes SHA-256) */
var SIG = { s: 'idle', fp: '', run: false };
var SIG_MSG = {
  idle: 'Vérification de la signature KVES…',
  ok: 'Signature KVES vérifiée : les fichiers sont authentiques.',
  bad: 'Signature KVES invalide : ne fais pas confiance à cette copie.',
  changed: 'Fichiers différents de la version signée : mets l\'application à jour.',
  none: 'Signature KVES non configurée.',
  na: 'Vérification impossible pour le moment (hors ligne ou appareil trop ancien).'
};
var SIG_CHECK = ['index.html', 'app.js', 'langues.js', 'donnees.js', 'theme-init.js', 'styles.css', 'manifest.webmanifest'];
function sigGet(u, bin) {
  return fetch(u).then(function (r) { if (!r.ok) { var e = new Error('http'); e.status = r.status; throw e; } return bin ? r.arrayBuffer() : r.text(); });
}
function sigPaint() {
  var e = $('#sigstat'), f = $('#sigfp'), v = $('#sigfpv');
  if (e) { e.textContent = SIG_MSG[SIG.s]; e.className = 'small' + (SIG.s === 'ok' ? ' sigok' : (SIG.s === 'bad' || SIG.s === 'changed') ? ' sigko' : ''); }
  if (f && v) { f.hidden = !SIG.fp; v.textContent = SIG.fp; }
}
function sigDone(s, fp) { SIG.s = s; SIG.fp = fp || ''; SIG.run = false; sigPaint(); }
function sigHex(buf, n) { return Array.prototype.map.call(new Uint8Array(buf).slice(0, n), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
function sigRun() {
  if (SIG.run || SIG.s !== 'idle') { sigPaint(); return; }
  SIG.run = true;
  if (!subtle() || !window.TextEncoder) { sigDone('na'); return; }
  var miss = function (e) { return e && e.status ? null : false; };
  Promise.all([sigGet('kves-cle-publique.txt').catch(miss), sigGet('SIGNATURE-KVES.sig').catch(miss), sigGet('SIGNATURE-KVES.txt', true).catch(miss)]).then(function (a) {
    if (a[0] === false || a[1] === false || a[2] === false) { sigDone('na'); return; }
    if (!a[0] || !a[1] || !a[2]) { sigDone('none'); return; }
    var pub = unb64u(a[0].trim()), fp = '';
    return subtle().digest('SHA-256', pub).then(function (d) { fp = sigHex(d, 8).toUpperCase().replace(/(.{4})/g, '$1 ').trim(); return subtle().importKey('raw', pub, { name: 'Ed25519' }, false, ['verify']); })
      .then(function (k) { return subtle().verify({ name: 'Ed25519' }, k, unb64u(a[1].trim()), a[2]); })
      .then(function (ok) {
        if (!ok) { sigDone('bad', fp); return; }
        var want = {};
        new TextDecoder().decode(a[2]).split('\n').forEach(function (l) { var m = l.match(/^([0-9a-f]{64})  (\S+)$/); if (m) want[m[2]] = m[1]; });
        return Promise.all(SIG_CHECK.filter(function (f) { return want[f]; }).map(function (f) {
          return sigGet(f, true).then(function (b) { return subtle().digest('SHA-256', b); }).then(function (d) { return sigHex(d, 32) === want[f]; });
        })).then(function (r) { sigDone(r.every(Boolean) ? 'ok' : 'changed', fp); });
      });
  }).catch(function () { sigDone('na'); });
}
/* protection des données (18.5) : copie de sécurité dans le stockage « cache » (distinct de localStorage), restauration proposée si les données ont disparu */
var SAFE_CACHE = 'coach-masse-safe', SAFE_URL = './copie-securite', safeT = 0;
function safePut() {
  try {
    if (!window.caches || !hasData(D)) return Promise.resolve();
    return caches.open(SAFE_CACHE).then(function (c) { return c.put(SAFE_URL, new Response(JSON.stringify({ at: new Date().toISOString(), v: VERSION, data: D }))); }).catch(function () {});
  } catch (e) { return Promise.resolve(); }
}
function safeSoon() { clearTimeout(safeT); safeT = setTimeout(safePut, 3000); }
function safeGet() {
  try {
    if (!window.caches) return Promise.resolve(null);
    return caches.open(SAFE_CACHE).then(function (c) { return c.match(SAFE_URL); }).then(function (r) { return r ? r.json() : null; }).catch(function () { return null; });
  } catch (e) { return Promise.resolve(null); }
}
function safeWipe() { try { if (window.caches) caches.delete(SAFE_CACHE); } catch (e) {} }
var RC = null;
function recoverCheck() {
  return Promise.all([safeGet(), bkAll().catch(function () { return []; })]).then(function (a) {
    var cand = [];
    if (a[0] && a[0].data && hasData(a[0].data)) cand.push({ at: a[0].at || '', n: (a[0].data.sessions || []).length, json: JSON.stringify(a[0].data) });
    (a[1] || []).forEach(function (r) { if (r && r.json && (r.sessions > 0 || r.days > 0) && r.kind !== 'corrompu') cand.push({ at: r.at || '', n: r.sessions || 0, json: r.json }); });
    cand.sort(function (x, y) { return x.at < y.at ? 1 : -1; });
    if (!cand.length) return false;
    RC = cand[0];
    modal('<h2>Tes données ont disparu</h2><p>Ce navigateur a perdu les données de l\'application, mais une copie a été retrouvée :</p><p><b>' + esc(RC.at.slice(0, 10) + ' ' + RC.at.slice(11, 16)) + '</b> · <b>' + RC.n + '</b> <span>séances</span></p><button class="btn go" data-act="rcgo">Restaurer cette copie</button> <button class="btn alt" data-act="rcno">Non, repartir de zéro</button>');
    return true;
  }).catch(function () { return false; });
}
function recoverGo() {
  try { var o = JSON.parse(RC.json); if (!validData(o)) throw 0; closeModal(); applyData(o, 'avant-restauration'); toast('Données restaurées.'); }
  catch (e) { toast('Cette copie est illisible.'); }
  RC = null;
}
function recoverNo() { RC = null; safeWipe(); closeModal(); if (needOnboarding()) showOnboarding(); }
function persistCard() {
  var standalone = false; try { standalone = !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches); } catch (e) {}
  if (PERSIST !== false || standalone) return '';
  return '<div class="card"><h2>Stockage non protégé</h2><p class="small">Ton navigateur peut effacer les données de ce site. Installe l\'application (menu ⋮ puis « Installer l\'application ») et pense à exporter une sauvegarde.</p></div>';
}
function modal(h) {
  var m = $('#modal');
  if (m.hidden) modal._prev = document.activeElement;
  m.innerHTML = '<div class="mbox" role="document">' + h + '</div>'; m.hidden = false;
  var b = m.querySelector('button'); if (b) b.focus();
}
function closeModal() { $('#modal').hidden = true; var p = modal._prev; modal._prev = null; if (p && p.focus && document.contains(p)) { try { p.focus({ preventScroll: true }); } catch (e) {} } }
document.addEventListener('keydown', function (ev) { var m = $('#modal'); if (ev.key === 'Escape' && m && !m.hidden && m.querySelector('[data-act=modalclose]')) closeModal(); });
function whatsNew() {
  modal('<h2>Mise à jour installée</h2><p class="small">' + esc(NOM) + ' · version ' + esc(VERSION) + '</p><ul class="list">' + NOTES.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul><button class="btn" data-act="modalclose">Compris</button>');
}
/* À appeler au démarrage : montre les nouveautés une seule fois après un changement de version.
   Première installation, ou passage depuis une version sans cette fonction : rien n'est affiché. */
function checkUpdate() {
  var seen = P.seenVersion;
  P.seenVersion = VERSION; save();
  if (seen && seen !== VERSION && !R) whatsNew();
}
/* Mise à jour en deux temps : 1) annonce des nouveautés, 2) choix de mettre à jour (recharge) ou d'ignorer (on garde la version actuelle). */
var PEND = null, ACCEPT = false;
function updStep1() {
  if (!PEND) return;
  var n = (PEND.notes || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
  modal('<h2>Nouvelle version disponible</h2>' + (PEND.v ? '<p class="small">' + esc(NOM) + ' · version ' + esc(PEND.v) + '</p>' : '') + (n ? '<ul class="list">' + n + '</ul>' : '') + '<button class="btn" data-act="updnext">Suite</button>');
}
function updStep2() {
  modal('<h2>Mettre à jour ?</h2><p>L\'application va se recharger. Tes données sont conservées. Par prudence, tu peux d\'abord faire une sauvegarde.</p><button class="btn alt" data-act="updbk">Sauvegarder d\'abord</button> <button class="btn go" data-act="updgo">Mettre à jour et recharger</button><button class="btn alt" data-act="updignore">Ignorer et garder cette version</button>');
}
function offerUpdate() {
  if (!PEND) return;
  if (PEND.v && PEND.v === VERSION) { try { PEND.w.postMessage({ type: 'skip' }); } catch (e) {} PEND = null; return; }
  if (PEND.v && P.ignUpd === PEND.v) { if (tab === 'more') render(); return; }
  if (R) { toast('Nouvelle version disponible : voir dans Plus.'); return; }
  updStep1();
}
function pendUpdate(w) {
  if (!w || (PEND && PEND.w === w)) return;
  var done = false;
  function fin(o) { if (done) return; done = true; PEND = { w: w, v: o.version || '', notes: o.notes || [] }; offerUpdate(); }
  try { var ch = new MessageChannel(); ch.port1.onmessage = function (e) { fin(e.data || {}); }; w.postMessage({ type: 'info' }, [ch.port2]); } catch (e) { fin({}); }
  setTimeout(function () { fin({}); }, 3000);
}
function watchReg(reg) {
  if (!reg) return;
  if (reg.waiting && navigator.serviceWorker.controller) pendUpdate(reg.waiting);
  reg.addEventListener('updatefound', function () {
    var nw = reg.installing; if (!nw) return;
    nw.addEventListener('statechange', function () { if (nw.state === 'installed' && navigator.serviceWorker.controller) pendUpdate(nw); });
  });
}
if (navigator.serviceWorker) {
  var hadController = !!navigator.serviceWorker.controller, lastUpd = 0;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController) { hadController = true; return; }
    if (ACCEPT) window.location.reload();
  });
  navigator.serviceWorker.getRegistration().then(watchReg).catch(function () {});
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible' || Date.now() - lastUpd < 3600000) return;
    lastUpd = Date.now();
    navigator.serviceWorker.getRegistration().then(function (r) { if (r) return r.update(); }).catch(function () {});
  });
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'modalclose') closeModal();
  else if (a === 'modalreload') window.location.reload();
  else if (a === 'eye') eyeToggle(t);
  else if (a === 'rcgo') recoverGo();
  else if (a === 'rcno') recoverNo();
  else if (a === 'updbk') exportData();
  else if (a === 'exportenc') encExportOpen();
  else if (a === 'encgo') encExportGo();
  else if (a === 'encimpgo') encImportGo();
  else if (a === 'encimpno') { ENCIMP = null; ENCCB = null; closeModal(); }
  else if (a === 'lvlopen') lvlOpen();
  else if (a === 'lvpick') { TL[t.getAttribute('data-e')] = +t.getAttribute('data-v'); Array.prototype.forEach.call(t.parentNode.children, function (b) { b.classList.toggle('on', b === t); }); }
  else if (a === 'lvsave') lvlSave();
  else if (a === 'lockgo') lockTry();
  else if (a === 'lockforgot') lockForgotGo(t);
  else if (a === 'locknow') lockShow();
  else if (a === 'pinset') pinSetOpen();
  else if (a === 'pinoff') pinOffOpen();
  else if (a === 'pinsave') pinSave();
  else if (a === 'pinoffgo') pinOffGo();
  else if (a === 'updopen') updStep1();
  else if (a === 'updnext') updStep2();
  else if (a === 'updgo') { if (PEND && PEND.w) { ACCEPT = true; try { PEND.w.postMessage({ type: 'skip' }); } catch (e) { window.location.reload(); } toast('Mise à jour en cours…'); } else closeModal(); }
  else if (a === 'updignore') { if (PEND) { P.ignUpd = PEND.v || '?'; save(); } closeModal(); toast('Mise à jour ignorée. Tu pourras la faire depuis Plus.'); render(); }
});
/* © KVES · Coach-Mass-KVES */
/* ====================== sources et limites ====================== */
function viewSources() {
  var refs = [
    ['Renforcement musculaire', 'Au moins 2 jours par semaine sur les grands groupes musculaires (OMS, Lignes directrices sur l\'activité physique et la sédentarité, 2020). L\'application propose 3 séances.'],
    ['Progression', 'Augmenter la difficulté quand toutes les séries sont réussies (American College of Sports Medicine, Position Stand « Progression models in resistance training for healthy adults », 2009).'],
    ['Protéines', 'Environ 1,6 g par kg et par jour suffisent en général pour gagner du muscle en s\'entraînant, jusqu\'à 2,2 g/kg selon les cas (Morton et coll., British Journal of Sports Medicine, 2018). La cible de 135 g correspond à 1,7 à 1,8 g/kg pour 75 à 80 kg.'],
    ['Sommeil', 'Sept heures ou plus par nuit pour un adulte (Watson et coll., consensus AASM et SRS, Journal of Clinical Sleep Medicine, 2015).'],
    ['Calories', 'Besoins estimés avec l\'équation de Mifflin-St Jeor (Mifflin et coll., American Journal of Clinical Nutrition, 1990), multipliés par 1,4 (activité légère). Perte de poids : déficit limité à 500 kcal ou 20 %, avec un plancher de 1 500 kcal (homme), 1 200 kcal (femme) et 1 350 kcal (non précisé). C\'est une estimation : ajuste avec ton poids.'],
    ['Rythme de prise de poids', 'Un gain lent de l\'ordre de 0,25 à 0,5 kg par semaine est un repère courant pour limiter la prise de graisse.']
  ];
  var lim = [
    'Ce programme est un repère général pour un adulte en bonne santé. Il ne remplace ni un médecin, ni un coach, ni un diététicien.',
    'Consulte un médecin avant de commencer si tu as une maladie cardiaque, de l\'hypertension, du diabète, une blessure, une douleur au thorax, ou un doute.',
    'Arrête l\'exercice en cas de douleur vive, de vertige, de malaise ou d\'essoufflement anormal.',
    'Les repas sont des exemples avec des valeurs indicatives. Ils ne tiennent pas compte des allergies, des intolérances ni des régimes médicaux.',
    'Les exercices avancés (pompes diamant, dips, squat sauté) sollicitent davantage les articulations : passe au niveau suivant seulement si le précédent est maîtrisé.',
    'Le tabac réduit l\'endurance et ralentit la récupération. Pour arrêter, un médecin ou un service d\'aide à l\'arrêt peut t\'accompagner.',
    'Les résultats varient d\'une personne à l\'autre et ne sont pas garantis. L\'application est prévue pour les adultes (18 ans et plus).'
  ];
  var risky = EX.filter(function (e) { return e.risk; });
  return backBtn() + '<h1>Sources et limites</h1>' +
    '<div class="card"><h2>D\'où viennent les repères</h2><ul class="list">' + refs.map(function (r) { return '<li><span><b>' + esc(r[0]) + '</b><br><span class="small">' + esc(r[1]) + '</span></span></li>'; }).join('') + '</ul></div>' +
    '<div class="card"><h2>Limites et prudence</h2><ul class="list">' + lim.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
    '<div class="card"><h2>Exercices à risque</h2><p class="small">Ces exercices demandent plus d\'attention. Ils portent aussi un encadré « Précautions » dans l\'onglet Séance.</p><ul class="list">' + risky.map(function (e) { return '<li><span><b>' + esc(e.name) + '</b>' + (e.adv ? ' <span class="pill">avancé</span>' : '') + '<br><span class="small">' + esc(e.risk[0] + ' ' + e.risk[1]) + '<br><b>Arrête-toi si :</b> ' + esc(e.risk[2]) + '</span></span></li>'; }).join('') + '</ul></div>' +
    '<div class="card"><h2>Tes données</h2><p class="small">Elles restent sur ton téléphone. Aucun serveur ne les reçoit. Seuls les avis que tu envoies toi-même sont transmis, chiffrés.</p></div>';
}
/* © KVES · Coach-Mass-KVES */
/* ====================== lecteur de musique locale (13.5) ======================
   Les fichiers choisis restent sur le téléphone : lus via une adresse temporaire (blob), jamais copiés ni envoyés. */
var MP = { list: [], i: -1, shuffle: false, rep: 'off', hist: [], vol: 1 };
var mAudio = new Audio();
mAudio.preload = 'metadata';
var M_EXT = /\.(mp3|m4a|aac|ogg|opus|wav|flac|weba)$/i;
function mName(f) { return String(f.name || 'Audio').replace(/\.[A-Za-z0-9]{2,5}$/, ''); }
function mFmt(s) { s = Math.max(0, Math.floor(+s || 0)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
function mAdd(files) {
  var n = 0, i, f;
  for (i = 0; i < files.length && MP.list.length < 300; i++) {
    f = files[i];
    if (!(/^audio\//.test(f.type) || M_EXT.test(f.name || ''))) continue;
    MP.list.push({ name: mName(f), url: URL.createObjectURL(f) }); n++;
  }
  if (!n) { toast('Aucun fichier audio reconnu.'); return; }
  toast(n + ' morceau(x) ajouté(s).');
  if (MP.i < 0) mPlay(0); else if (tab === 'player') render();
}
/* mini-lecteur de la séance + baisse du volume quand le coach parle (13.6) */
var mDuckN = 0;
function mDuck(on) { try { mAudio.volume = on ? MP.vol * 0.3 : MP.vol; } catch (e) {} }
function mDuckSay(u) {
  if (mAudio.paused || !MP.list.length) return;
  var id = ++mDuckN;
  function back() { if (id === mDuckN) mDuck(false); }
  mDuck(true);
  u.onend = back; u.onerror = back;
  setTimeout(back, 9000);
}
function mMiniHtml() {
  if (!MP.list.length) return '';
  var playing = MP.i >= 0 && !mAudio.paused;
  return '<div class="row mini"><button class="btn alt sm" data-act="mprev" aria-label="Précédent">⏮</button><button class="btn alt sm" id="mmtoggle" data-act="mtoggle" aria-label="' + (playing ? 'Pause' : 'Lecture') + '">' + (playing ? '⏸' : '▶') + '</button><button class="btn alt sm" data-act="mnext" aria-label="Suivant">⏭</button><span class="small grow" id="mmname">♪ ' + esc(MP.i >= 0 ? MP.list[MP.i].name : '') + '</span></div>';
}
function mMiniSync() {
  var b = document.getElementById('mmtoggle'), n = document.getElementById('mmname');
  if (b) { var pl = !mAudio.paused; b.textContent = pl ? '⏸' : '▶'; b.setAttribute('aria-label', trText(pl ? 'Pause' : 'Lecture')); }
  if (n && MP.i >= 0) n.textContent = '♪ ' + MP.list[MP.i].name;
}
function mMeta() {
  if (!('mediaSession' in navigator) || typeof MediaMetadata !== 'function' || MP.i < 0) return;
  try { navigator.mediaSession.metadata = new MediaMetadata({ title: MP.list[MP.i].name, artist: NOM, album: 'Ma musique' }); } catch (e) {}
}
function mPlay(i, noHist) {
  if (i < 0 || i >= MP.list.length) return;
  if (!noHist && MP.i >= 0 && MP.i !== i) MP.hist.push(MP.i);
  MP.i = i;
  mAudio.src = MP.list[i].url;
  mAudio.volume = MP.vol;
  var p = mAudio.play(); if (p && p.catch) p.catch(function () { toast('Lecture impossible : touche Lecture.'); });
  mMeta(); mMiniSync();
  if (tab === 'player') render();
}
function mToggle() {
  if (MP.i < 0) { if (MP.list.length) mPlay(0); return; }
  if (mAudio.paused) { var p = mAudio.play(); if (p && p.catch) p.catch(function () {}); } else mAudio.pause();
}
function mNext(auto) {
  var n = MP.list.length, j;
  if (!n) return;
  if (auto && MP.rep === 'one') { mAudio.currentTime = 0; mAudio.play(); return; }
  if (MP.shuffle && n > 1) { do { j = Math.floor(Math.random() * n); } while (j === MP.i); mPlay(j); return; }
  j = MP.i + 1;
  if (j >= n) { if (MP.rep === 'all' || !auto) j = 0; else { mAudio.pause(); mAudio.currentTime = 0; if (tab === 'player') render(); return; } }
  mPlay(j);
}
function mPrev() {
  if (!MP.list.length) return;
  if (mAudio.currentTime > 3) { mAudio.currentTime = 0; return; }
  if (MP.hist.length) { mPlay(MP.hist.pop(), true); return; }
  mPlay(MP.i > 0 ? MP.i - 1 : MP.list.length - 1, true);
}
function mClear() {
  mAudio.pause(); mAudio.removeAttribute('src'); try { mAudio.load(); } catch (e) {}
  MP.list.forEach(function (t) { try { URL.revokeObjectURL(t.url); } catch (e) {} });
  MP.list = []; MP.i = -1; MP.hist = [];
  if ('mediaSession' in navigator) { try { navigator.mediaSession.metadata = null; } catch (e) {} }
  if (tab === 'player') render();
}
mAudio.addEventListener('ended', function () { mNext(true); });
mAudio.addEventListener('play', function () { if (tab === 'player') render(); mMiniSync(); });
mAudio.addEventListener('pause', function () { if (tab === 'player') render(); mMiniSync(); });
mAudio.addEventListener('error', function () { if (MP.i >= 0) toast('Fichier illisible : ' + MP.list[MP.i].name); });
mAudio.addEventListener('timeupdate', function () {
  var s = document.getElementById('mpos'), t = document.getElementById('mtime');
  if (s && document.activeElement !== s) { s.max = Math.floor(mAudio.duration || 0) || 0; s.value = Math.floor(mAudio.currentTime); }
  if (t) t.textContent = mFmt(mAudio.currentTime) + ' / ' + mFmt(mAudio.duration);
});
if ('mediaSession' in navigator) {
  [['play', function () { mToggle(); }], ['pause', function () { mAudio.pause(); }], ['previoustrack', mPrev], ['nexttrack', function () { mNext(false); }],
   ['seekto', function (d) { if (d && typeof d.seekTime === 'number') mAudio.currentTime = d.seekTime; }]].forEach(function (a) { try { navigator.mediaSession.setActionHandler(a[0], a[1]); } catch (e) {} });
}
$('#musicFile').addEventListener('change', function (ev) { mAdd(ev.target.files || []); ev.target.value = ''; });
document.addEventListener('input', function (ev) {
  var t = ev.target;
  if (t.id === 'mpos') mAudio.currentTime = +t.value;
  else if (t.id === 'mvol') { MP.vol = Math.max(0, Math.min(1, (+t.value) / 100)); mAudio.volume = MP.vol; }
});
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'mpick') $('#musicFile').click();
  else if (a === 'mplay') mPlay(+t.getAttribute('data-i'));
  else if (a === 'mtoggle') mToggle();
  else if (a === 'mnext') mNext(false);
  else if (a === 'mprev') mPrev();
  else if (a === 'mshuf') { MP.shuffle = !MP.shuffle; render(); }
  else if (a === 'mrep') { MP.rep = MP.rep === 'off' ? 'all' : MP.rep === 'all' ? 'one' : 'off'; render(); }
  else if (a === 'mclear') mClear();
});
function viewPlayer() {
  var cur = MP.i >= 0 ? MP.list[MP.i] : null, playing = cur && !mAudio.paused;
  var repL = { off: 'Répétition : aucune', all: 'Répétition : toute la liste', one: 'Répétition : un morceau' }[MP.rep];
  var h = backBtn() + '<h1>Lecteur</h1>';
  h += '<div class="card"><h2>Ma musique</h2><p class="small">Choisis des fichiers audio de ton téléphone (MP3, M4A…). Ils ne sont ni copiés ni envoyés. À la prochaine ouverture de l\'application, il faudra les choisir de nouveau.</p><button class="btn" data-act="mpick">Choisir mes musiques</button></div>';
  h += '<div class="card' + (cur ? ' coach' : '') + '"><span class="head">' + (cur ? 'En lecture' : 'Rien en lecture') + '</span>' +
    '<p class="msg">' + (cur ? esc(cur.name) : 'Aucun morceau choisi.') + '</p>' +
    '<input type="range" id="mpos" min="0" max="' + (Math.floor(mAudio.duration || 0) || 0) + '" value="' + Math.floor(mAudio.currentTime || 0) + '" aria-label="Position"' + (cur ? '' : ' disabled') + '>' +
    '<p class="small" id="mtime">' + mFmt(mAudio.currentTime) + ' / ' + mFmt(mAudio.duration) + '</p>' +
    '<div class="row"><button class="btn alt grow" data-act="mprev" aria-label="Précédent">⏮</button><button class="btn go grow" data-act="mtoggle" aria-label="' + (playing ? 'Pause' : 'Lecture') + '">' + (playing ? '⏸' : '▶') + '</button><button class="btn alt grow" data-act="mnext" aria-label="Suivant">⏭</button></div>' +
    '<div class="row"><button class="btn ' + (MP.shuffle ? '' : 'alt ') + 'sm grow" data-act="mshuf" aria-pressed="' + MP.shuffle + '">Aléatoire : ' + (MP.shuffle ? 'oui' : 'non') + '</button><button class="btn ' + (MP.rep === 'off' ? 'alt ' : '') + 'sm grow" data-act="mrep">' + repL + '</button></div>' +
    '<label class="f">Volume</label><input type="range" id="mvol" min="0" max="100" value="' + Math.round(MP.vol * 100) + '" aria-label="Volume"></div>';
  if (MP.list.length) {
    h += '<div class="card"><h2>' + MP.list.length + ' morceau(x)</h2><ul class="list">' + MP.list.map(function (t, i) {
      return '<li><button class="btn ' + (i === MP.i ? '' : 'alt ') + 'sm grow" data-act="mplay" data-i="' + i + '">' + (i === MP.i ? '▶ ' : '') + esc(t.name) + '</button></li>';
    }).join('') + '</ul><button class="btn alt sm" data-act="mclear">Vider la liste</button></div>';
  }
  return h;
}
/* © KVES · Coach-Mass-KVES */
/* ====================== profil : genre, objectif, âge, mensurations ====================== */
var OB = { gender: 'n', obj: 'masse', fresh: false };
var GEN = { h: 'Homme', f: 'Femme', n: 'Ne pas préciser' };
function userHasData() { return hasData(D); }
function needOnboarding() { return !P.onboarded && !userHasData(); }
function segHtml(act, cur, map) {
  return '<div class="seg wrap" role="group">' + Object.keys(map).map(function (k) { return '<button type="button" data-act="' + act + '" data-v="' + k + '" class="' + (cur === k ? 'on' : '') + '">' + map[k] + '</button>'; }).join('') + '</div>';
}
var PARQ = ["Un médecin t'a-t-il déjà parlé d'un problème de cœur ou de tension trop élevée ?", "Ressens-tu une douleur dans la poitrine, au repos ou à l'effort ?", "As-tu des vertiges, des pertes d'équilibre ou des malaises ?", "As-tu un problème d'os, d'articulations ou de dos qui peut s'aggraver avec l'exercice ?", "Prends-tu un médicament pour le cœur, la tension ou le diabète ?", "Es-tu enceinte ou as-tu accouché récemment ?", "Connais-tu une autre raison pour laquelle tu ne devrais pas faire d'effort physique ?"];
function showParq() {
  modal('<h2>Questionnaire de santé</h2><p class="small">Coche ce qui te concerne. Si tu ne coches rien, tu peux commencer.</p>' + PARQ.map(function (q, i) { return '<label class="meal"><input type="checkbox" data-parq="' + i + '"><span>' + esc(q) + '</span></label>'; }).join('') + '<button class="btn" data-act="parqsave">Valider mes réponses</button><button class="btn alt" data-act="modalclose">Plus tard</button>');
}
function goalCheck(o, h, w, goal) {
  if (!(h > 0 && w > 0 && goal > 0)) return '';
  if (o === 'masse' && goal / Math.pow(h / 100, 2) > 27) return 'Ce poids visé est trop élevé pour ta taille (IMC au-dessus de 27). Choisis un objectif plus bas ou parle à un médecin.';
  if (Math.abs(goal - w) / w > 0.15) return 'Objectif trop éloigné (plus de 15 % de ton poids actuel). Fixe une première étape plus proche : tu pourras la relever ensuite.';
  return '';
}
function parqCard() {
  if (!P.onboarded) return '';
  if (!P.parq) return '<div class="card"><h2>Questionnaire de santé</h2><p class="small">7 questions, 1 minute, pour savoir si tu dois voir un médecin avant de commencer.</p><button class="btn alt" data-act="parqopen">Faire le questionnaire</button></div>';
  if (P.parq === 'avis') return '<div class="card"><h2>Avis médical conseillé</h2><p class="small">Tes réponses indiquent qu\'un avis médical est conseillé avant de t\'entraîner.</p><button class="btn alt" data-act="parqdone">J\'ai consulté un médecin</button><button class="btn alt sm" data-act="parqopen">Refaire le questionnaire</button></div>';
  return '';
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'rpe') { if (R && R.sess) { R.sess.rpe = +t.getAttribute('data-n'); save(); drawDone(); } }
  else if (a === 'deloadon') { P.deloadOn = weekStartStr(); P.deloadLast = wkNo(); save(); render(); }
  else if (a === 'absgo') { var u7 = new Date(); u7.setDate(u7.getDate() + 6); P.deloadUntil = dstr(u7); P.deloadLast = wkNo(); save(); render(); }
  else if (a === 'absskip') { P.absSkip = lastSessDate(); save(); render(); }
  else if (a === 'deloadskip') { P.deloadSkip = wkNo(); save(); render(); }
  else if (a === 'deloadstop') { P.deloadOn = ''; P.deloadUntil = ''; save(); render(); }
  else if (a === 'parqopen') showParq();
  else if (a === 'parqdone') { P.parq = 'consulte'; save(); render(); }
  else if (a === 'parqsave') {
    var n = document.querySelectorAll('#modal [data-parq]:checked').length;
    P.parq = n ? 'avis' : 'ok'; P.parqDate = today(); save(); render();
    if (n) modal('<h2>Parle à un médecin avant de commencer</h2><p>Au moins une réponse demande un avis médical. Montre ces réponses à ton médecin avant de t\'entraîner ou de changer ton alimentation. Ce questionnaire ne remplace pas une consultation.</p><button class="btn" data-act="modalclose">Compris</button>');
    else { closeModal(); toast('Questionnaire enregistré : aucune alerte.'); }
  }
});
function showOnboarding() {
  OB.fresh = !userHasData();
  OB.gender = P.gender || 'n'; OB.obj = obj();
  function v(x) { return OB.fresh ? '' : x; }
  var h = '<div class="onb"><h2>Ton profil</h2><p class="small">Pour adapter les calories et les conseils. Tout reste sur ton téléphone. Application réservée aux personnes de 18 ans et plus.</p>' +
    '<label class="f">Genre</label>' + segHtml('obg', OB.gender, GEN) +
    '<label class="f">Objectif</label>' + segHtml('obo', OB.obj, OBJ) +
    '<div class="grid2"><label class="f">Âge<input type="number" inputmode="numeric" id="ob_age" value="' + v(P.age) + '" placeholder="25"></label>' +
    '<label class="f">Taille (cm)<input type="number" inputmode="numeric" id="ob_h" value="' + v(P.height) + '" placeholder="175"></label>' +
    '<label class="f">Poids actuel (kg)<input type="number" inputmode="decimal" step="0.1" id="ob_w" value="' + v(fmt(currentWeight()).replace(',', '.')) + '" placeholder="70"></label>' +
    '<label class="f">Poids visé (kg)<input type="number" inputmode="decimal" step="0.5" id="ob_goal" value="' + v(P.goal) + '" placeholder="75"></label></div>' +
    '<details class="cfg"><summary>Mensurations (facultatif, en cm)</summary><div class="grid2">' + MKEYS.map(function (k) { return '<label class="f">' + MLAB[k] + '<input type="number" inputmode="decimal" step="0.5" id="ob_m_' + k + '"></label>'; }).join('') + '</div></details>' +
    '<p class="small">Repères généraux, pas un avis médical. En cas de maladie, de traitement, de grossesse ou de doute, parle à un médecin avant de changer ton alimentation ou ton sport.</p>' +
    (P.healthOk ? '' : '<label class="meal"><input type="checkbox" id="ob_health"><span>J\'ai lu l\'avertissement santé et les conditions d\'utilisation (Plus > Légal).</span></label>') +
    '<p class="small bad" id="obErr" role="alert" hidden></p>' +
    '<button class="btn go" data-act="obsave">Valider</button>' +
    (OB.fresh ? '<button class="btn alt" data-act="import">J\'ai déjà une sauvegarde : l\'importer</button>' : '<button class="btn alt" data-act="modalclose">Plus tard</button>') + '</div>';
  modal(h);
}
function obErr(t) { var n = $('#obErr'); if (n) { n.textContent = t; n.hidden = !t; if (t) n.scrollIntoView({ block: 'nearest' }); } return false; }
function num(id) { var n = $('#' + id); return n ? parseFloat((n.value || '').replace(',', '.')) : NaN; }
function saveOnboarding() {
  var age = num('ob_age'), h = num('ob_h'), w = num('ob_w'), goal = num('ob_goal'), o = OB.obj;
  if (!(age >= 1)) return obErr('Indique ton âge.');
  if (age < 18) return obErr('Cette application est réservée aux personnes de 18 ans et plus. Reviens à tes 18 ans ou demande conseil à un professionnel.');
  if (age > 99) return obErr('Âge invalide.');
  if (!(h >= 120 && h <= 230)) return obErr('Taille invalide (entre 120 et 230 cm).');
  if (!(w >= 35 && w <= 250)) return obErr('Poids actuel invalide (entre 35 et 250 kg).');
  if (o === 'tonif' || o === 'maintien') { if (!(goal >= 35 && goal <= 250)) goal = w; }
  if (!(goal >= 35 && goal <= 250)) return obErr('Indique ton poids visé.');
  if (o === 'masse' && goal <= w) return obErr('Pour une prise de masse, ton poids visé doit être supérieur à ton poids actuel.');
  if (o === 'perte' && goal >= w) return obErr('Pour perdre du poids, ton poids visé doit être inférieur à ton poids actuel.');
  var imc = goal / Math.pow(h / 100, 2);
  if (o === 'perte' && imc < 18.5) return obErr('Ce poids visé est trop bas pour ta taille (IMC sous 18,5). Choisis un objectif plus haut ou parle à un médecin.');
  if (!P.healthOk) { var hc = $('#ob_health'); if (!hc || !hc.checked) return obErr('Coche la case pour confirmer que tu as lu l\'avertissement santé.'); }
  var gc = goalCheck(o, h, w, goal); if (gc) return obErr(gc);
  var fresh = !userHasData(), changed = obj() !== o;
  P.gender = OB.gender; P.obj = o; P.age = Math.round(age); P.height = Math.round(h); P.goal = goal; P.onboarded = true; P.healthOk = true;
  if (fresh) { P.w0 = w; P.start = today(); }
  else if (Math.abs(w - currentWeight()) >= 0.05) log().weight = w;
  if (changed) { P.kcalAdj = 0; P.lastAdj = ''; }
  var m = { date: today() }, any = false;
  MKEYS.forEach(function (k) { var x = num('ob_m_' + k); if (x > 0) { m[k] = x; any = true; } });
  if (any) D.measures.push(m);
  save(); closeModal(); render(); toast('Profil enregistré.');
  return true;
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'obopen') showOnboarding();
  else if (a === 'obg' || a === 'obo') {
    OB[a === 'obg' ? 'gender' : 'obj'] = t.getAttribute('data-v');
    Array.prototype.forEach.call(t.parentNode.children, function (b) { b.classList.toggle('on', b === t); });
  } else if (a === 'obsave') saveOnboarding();
});
/* © KVES · Coach-Mass-KVES */
/* ====================== partager l'application : message, lien, QR code ====================== */
var APP_URL = 'https://darkangeldaoud.github.io/Coach-Mass-KVES/';
var SHARE_TEXT = NOM + ' : ton coach de musculation à la maison. Séances guidées à la voix, repas adaptés à ton objectif, suivi du poids et des mensurations. Sans matériel, hors ligne, 100 % privé.';
function shareCard() {
  return '<div class="card"><h2>Partager l\'application</h2><p class="small">Envoie ' + esc(NOM) + ' à un ami pour qu\'il l\'essaie : le lien affiche le logo et les fonctionnalités clés.</p>' +
    '<div class="row"><button class="btn grow" data-act="appshare">Partager</button><button class="btn alt" data-act="appcopy">Copier le lien</button></div>' +
    '<details class="cfg"><summary>Afficher le QR code</summary><div class="qrbox">' + QR.svg(APP_URL) + '</div><p class="small">Ton ami scanne ce code avec l\'appareil photo de son téléphone.</p></details></div>';
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'appcopy') copyText(trText(SHARE_TEXT) + ' ' + APP_URL);
  else if (a === 'appshare') {
    if (navigator.share) navigator.share({ title: NOM, text: trText(SHARE_TEXT), url: APP_URL }).catch(function () {});
    else copyText(trText(SHARE_TEXT) + ' ' + APP_URL);
  }
});
/* © KVES · Coach-Mass-KVES */
/* ====================== QR code (hors ligne : versions 1 à 4 correction L, version 6 correction H pour le logo central) ====================== */
var QR = (function () {
  var CAP = [null, [19, 7], [34, 10], [55, 15], [80, 20]];   /* [mots de données, mots de correction] */
  var EXP = [], LOG = [];
  (function () { var x = 1; for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; } for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  function mul(a, b) { return a && b ? EXP[LOG[a] + LOG[b]] : 0; }
  function ecc(data, deg) {
    var div = [], i, j, root = 1;
    for (i = 0; i < deg - 1; i++) div.push(0); div.push(1);
    for (i = 0; i < deg; i++) {
      for (j = 0; j < deg; j++) { div[j] = mul(div[j], root); if (j + 1 < deg) div[j] ^= div[j + 1]; }
      root = mul(root, 2);
    }
    var rem = []; for (i = 0; i < deg; i++) rem.push(0);
    data.forEach(function (bt) {
      var f = bt ^ rem.shift(); rem.push(0);
      for (var k = 0; k < deg; k++) rem[k] ^= mul(div[k], f);
    });
    return rem;
  }
  function bytes(txt) { return unescape(encodeURIComponent(txt)).split('').map(function (c) { return c.charCodeAt(0); }); }
  function build(txt, hi) {
    var b = bytes(txt), v = 0, i;
    if (hi) { if (b.length > 58) return null; v = 6; } else { for (i = 1; i <= 4; i++) if (b.length <= CAP[i][0] - 2) { v = i; break; } }
    if (!v) return null;
    var bits = [];
    function put(val, n) { for (var k = n - 1; k >= 0; k--) bits.push((val >> k) & 1); }
    put(4, 4); put(b.length, 8); b.forEach(function (x) { put(x, 8); });
    var dcw = hi ? 60 : CAP[v][0], total = dcw * 8;
    for (i = 0; i < 4 && bits.length < total; i++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var cw = [];
    for (i = 0; i < bits.length; i += 8) { var w = 0; for (var k = 0; k < 8; k++) w = (w << 1) | bits[i + k]; cw.push(w); }
    for (i = 0; cw.length < dcw; i++) cw.push(i % 2 ? 0x11 : 0xec);
    if (hi) {                                           /* version 6, niveau H : 4 blocs de 15 mots de données + 28 mots de correction */
      var blocks = [], ecs = [];
      for (i = 0; i < 4; i++) { blocks.push(cw.slice(i * 15, i * 15 + 15)); ecs.push(ecc(blocks[i], 28)); }
      cw = [];
      for (i = 0; i < 15; i++) blocks.forEach(function (bl) { cw.push(bl[i]); });
      for (i = 0; i < 28; i++) ecs.forEach(function (ec) { cw.push(ec[i]); });
    } else cw = cw.concat(ecc(cw, CAP[v][1]));
    var n = 17 + 4 * v, M = [], F = [], r, c;
    for (r = 0; r < n; r++) { M.push(new Array(n).fill(0)); F.push(new Array(n).fill(false)); }
    function set(r, c, val) { M[r][c] = val ? 1 : 0; F[r][c] = true; }
    function finder(r0, c0) {
      for (var y = -1; y <= 7; y++) for (var x = -1; x <= 7; x++) {
        var rr = r0 + y, cc = c0 + x; if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        set(rr, cc, (y >= 0 && y <= 6 && (x === 0 || x === 6)) || (x >= 0 && x <= 6 && (y === 0 || y === 6)) || (y >= 2 && y <= 4 && x >= 2 && x <= 4));
      }
    }
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);
    for (i = 8; i < n - 8; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    if (v >= 2) { var ap = n - 7; for (var y = -2; y <= 2; y++) for (var x = -2; x <= 2; x++) set(ap + y, ap + x, Math.max(Math.abs(x), Math.abs(y)) !== 1); }
    set(n - 8, 8, true);
    for (i = 0; i < 9; i++) { if (!F[8][i]) { M[8][i] = 0; F[8][i] = true; } if (!F[i][8]) { M[i][8] = 0; F[i][8] = true; } }
    for (i = 0; i < 8; i++) { if (!F[8][n - 1 - i]) { M[8][n - 1 - i] = 0; F[8][n - 1 - i] = true; } if (!F[n - 1 - i][8]) { M[n - 1 - i][8] = 0; F[n - 1 - i][8] = true; } }
    var all = []; cw.forEach(function (x) { for (var k = 7; k >= 0; k--) all.push((x >> k) & 1); });
    var pos = [], up = true, col, k2 = 0;
    for (col = n - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      for (i = 0; i < n; i++) { r = up ? n - 1 - i : i; for (var dc = 0; dc < 2; dc++) { c = col - dc; if (!F[r][c]) pos.push([r, c]); } }
      up = !up;
    }
    function fmtBits(mask) {
      var d = ((hi ? 2 : 1) << 3) | mask, rem = d, j;
      for (j = 0; j < 10; j++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      return ((d << 10) | rem) ^ 0x5412;
    }
    function maskFn(m, r, c) { return [(r + c) % 2 === 0, r % 2 === 0, c % 3 === 0, (r + c) % 3 === 0, (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0, (r * c) % 2 + (r * c) % 3 === 0, ((r * c) % 2 + (r * c) % 3) % 2 === 0, ((r + c) % 2 + (r * c) % 3) % 2 === 0][m]; }
    function penalty(G) {
      var p = 0, y, x, run, cnt;
      for (y = 0; y < n; y++) { run = 1; for (x = 1; x < n; x++) { if (G[y][x] === G[y][x - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (x = 0; x < n; x++) { run = 1; for (y = 1; y < n; y++) { if (G[y][x] === G[y - 1][x]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (y = 0; y < n - 1; y++) for (x = 0; x < n - 1; x++) if (G[y][x] === G[y][x + 1] && G[y][x] === G[y + 1][x] && G[y][x] === G[y + 1][x + 1]) p += 3;
      cnt = 0; for (y = 0; y < n; y++) for (x = 0; x < n; x++) cnt += G[y][x];
      p += Math.floor(Math.abs(cnt * 100 / (n * n) - 50) / 5) * 10;
      return p;
    }
    var best = null, bp = 1e9, m;
    for (m = 0; m < 8; m++) {
      var G = M.map(function (row) { return row.slice(); });
      pos.forEach(function (q, idx) { var bit = idx < all.length ? all[idx] : 0; G[q[0]][q[1]] = maskFn(m, q[0], q[1]) ? bit ^ 1 : bit; });
      var f = fmtBits(m), bit;
      for (i = 0; i < 15; i++) {
        bit = (f >>> i) & 1;
        if (i <= 5) G[i][8] = bit; else if (i === 6) G[7][8] = bit; else if (i === 7) G[8][8] = bit; else if (i === 8) G[8][7] = bit; else G[8][14 - i] = bit;
        if (i < 8) G[8][n - 1 - i] = bit; else G[n - 15 + i][8] = bit;
      }
      G[n - 8][8] = 1;
      var pe = penalty(G); if (pe < bp) { bp = pe; best = G; }
    }
    return best;
  }
  /* QR stylisé : points arrondis bleus, repères carrés orange, logo (haltère) au centre, nom en dessous */
  function svg(txt) {
    var G = build(txt, true); if (!G) return '';
    var n = G.length, q = 4, T = n + 2 * q, H = T + 3.4, cx = n / 2, half = n * 0.115, y, x, o = '', blue = '#1d3fb8', or = '#e8590c';
    function fin(r, c) { return (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8); }
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
      if (!G[y][x] || fin(y, x)) continue;
      if (Math.abs(x + 0.5 - cx) < half + 0.6 && Math.abs(y + 0.5 - cx) < half + 0.6) continue;
      o += '<rect x="' + (x + q - 0.02) + '" y="' + (y + q - 0.02) + '" width="1.04" height="1.04" rx="0.32"/>';
    }
    var f = '';
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(function (p) {
      var fx = p[1] + q, fy = p[0] + q;
      f += '<rect x="' + fx + '" y="' + fy + '" width="7" height="7" rx="0.5" fill="' + or + '"/><rect x="' + (fx + 1) + '" y="' + (fy + 1) + '" width="5" height="5" fill="#fff"/><rect x="' + (fx + 2) + '" y="' + (fy + 2) + '" width="3" height="3" rx="0.4" fill="' + blue + '"/>';
    });
    var a = cx + q, s = 2 * half;
    var logo = '<rect x="' + (a - half) + '" y="' + (a - half) + '" width="' + s + '" height="' + s + '" rx="1.3" fill="#0f1a21"/><g stroke-linecap="round" fill="none">' +
      '<path d="M' + (a - half * 0.5) + ' ' + a + ' L' + (a + half * 0.5) + ' ' + a + '" stroke-width="0.55" stroke="#5b8cff"/>' +
      '<path d="M' + (a - half * 0.6) + ' ' + (a - half * 0.4) + ' V' + (a + half * 0.4) + ' M' + (a + half * 0.6) + ' ' + (a - half * 0.4) + ' V' + (a + half * 0.4) + '" stroke-width="0.95" stroke="#ff9a4d"/>' +
      '<path d="M' + (a - half * 0.8) + ' ' + (a - half * 0.22) + ' V' + (a + half * 0.22) + ' M' + (a + half * 0.8) + ' ' + (a - half * 0.22) + ' V' + (a + half * 0.22) + '" stroke-width="0.7" stroke="#5b8cff"/></g>';
    return '<svg viewBox="0 0 ' + T + ' ' + H + '" shape-rendering="geometricPrecision" role="img" aria-label="QR code du lien de l\'application Coach-Mass-KVES"><rect width="' + T + '" height="' + H + '" rx="2.2" fill="#fff"/><g fill="' + blue + '">' + o + '</g>' + f + logo +
      '<text x="' + (T / 2) + '" y="' + (T + 1.7) + '" text-anchor="middle" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="1.9" fill="' + blue + '">Coach-Mass-KVES</text></svg>';
  }
  return { svg: svg, build: build };
})();
/* © KVES · Coach-Mass-KVES */
/* ====================== langues : traduction de l'affichage ======================
   Le texte de l'application est écrit en français. Pour une autre langue, un dictionnaire (LANG_DATA)
   remplace les textes affichés (phrases exactes + modèles avec {1}, {2}...). Un texte absent reste en français. */
var LANGS = { fr: 'Français', en: 'English' };
var LANG_DATA = {};
function lang() { return LANGS[P.lang] ? P.lang : 'fr'; }
function PT(fr, en) {
  var parts = fr.split(/\{\d+\}/), keys = (fr.match(/\{\d+\}/g) || []), src = '^';
  parts.forEach(function (p, i) { src += p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); if (i < keys.length) src += '(.+?)'; });
  return { re: new RegExp(src + '$'), en: en };
}
function trText(s) {
  var d = LANG_DATA[lang()];
  if (!d) return s;
  var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), core = m[2], i, r, o;
  if (!core) return s;
  if (Object.prototype.hasOwnProperty.call(d.w, core)) return m[1] + d.w[core] + m[3];
  for (i = 0; i < d.p.length; i++) {
    r = core.match(d.p[i].re);
    if (r) { o = d.p[i].en.replace(/\{(\d+)\}/g, function (_, n) { var v = r[+n]; return Object.prototype.hasOwnProperty.call(d.w, v) ? d.w[v] : v.indexOf(', ') > 0 ? v.split(', ').map(function (x) { return Object.prototype.hasOwnProperty.call(d.w, x) ? d.w[x] : x; }).join(', ') : v; }); return m[1] + o + m[3]; }
  }
  var sn = core.split(/(?<=[.!?]) /);
  if (sn.length > 1) {
    var out = [], j = 0, k, hit = false, seg, found;
    while (j < sn.length) {
      found = false;
      for (k = sn.length; k > j; k--) { seg = sn.slice(j, k).join(' '); if (Object.prototype.hasOwnProperty.call(d.w, seg)) { out.push(d.w[seg]); j = k; found = true; hit = true; break; } }
      if (!found) { out.push(sn[j]); j++; }
    }
    if (hit) return m[1] + out.join(' ') + m[3];
  }
  return s;
}
var trMem = typeof WeakMap === 'function' ? new WeakMap() : null;
function trNode(n) {
  var rec = trMem.get(n), cur = n.nodeValue;
  if (rec && rec.out === cur) return;
  var out = trText(cur);
  trMem.set(n, { out: out });
  if (out !== cur) n.nodeValue = out;
}
var TR_ATTR = ['placeholder', 'aria-label', 'title', 'alt'];
function trTree(root) {
  if (!root) return;
  if (root.nodeType === 3) { trNode(root); return; }
  if (root.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(root.nodeName)) return;
  var w = document.createTreeWalker(root, 4 | 1), n = root;
  while (n) {
    if (n.nodeType === 3) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) trNode(n); }
    else TR_ATTR.forEach(function (a) { var v = n.getAttribute && n.getAttribute(a); if (v) { var o = trText(v); if (o !== v) n.setAttribute(a, o); } });
    n = w.nextNode();
  }
}
function startI18n() {
  if (!trMem || lang() === 'fr' || !LANG_DATA[lang()]) return;
  document.documentElement.lang = lang() === 'ma' ? 'ary-Latn' : lang(); if (lang() === 'ar') document.documentElement.dir = 'rtl';
  var busy = false, mo = new MutationObserver(function (list) {
    if (busy) return; busy = true; mo.disconnect();
    try { list.forEach(function (m) { if (m.type === 'characterData') trNode(m.target); else m.addedNodes.forEach(trTree); }); } catch (e) {}
    mo.observe(document.body, { childList: true, subtree: true, characterData: true }); busy = false;
  });
  trTree(document.body);
  mo.observe(document.body, { childList: true, subtree: true, characterData: true });
}
/* © KVES · Coach-Mass-KVES */
/* les traductions (anglais, arabe, darija) sont dans langues.js, chargé avant cette application */
if (window.CM_I18N) window.CM_I18N(LANG_DATA, PT, LANGS);
startI18n();
/* © KVES · Coach-Mass-KVES */
applyRotate();
render();
requestAnimationFrame(frame);
lockShow();
if (NEWER) setTimeout(function () { toast('Tes données viennent d\'une version plus récente : une copie a été gardée à part.'); }, 900);
if (STORE_EMPTY) setTimeout(function () { recoverCheck().then(function (found) { if (found) return; if (needOnboarding()) showOnboarding(); else setTimeout(checkUpdate, 400); }); }, 300);
else if (needOnboarding()) setTimeout(showOnboarding, 300); else setTimeout(checkUpdate, 700);
if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').then(watchReg).catch(function () {}); }); }
window.__coach = { D: function () { return D; }, save: save, startSession: startSession, render: render, setTab: function (t) { tab = t; render(); },
  /* calculs du coaching exposés pour les tests automatiques (lecture seule, aucun effet sur l'écran) */
  calc: { bmr: bmr, tdee: tdee, kcalCore: kcalCore, kcalTarget: kcalTarget, protTarget: protTarget, waterTarget: waterTarget, goalCheck: goalCheck, slopeWeek: slopeWeek, suggestion: suggestion, findPrs: findPrs, deloadDue: deloadDue, absenceDue: absenceDue, wkNo: wkNo, ex: function (id) { return EX.filter(function (e) { return e.id === id; })[0]; },
    progress: function (plan, logs) { var o = R; R = { plan: plan }; try { return applyProgress(logs); } finally { R = o; } } } };
})();
