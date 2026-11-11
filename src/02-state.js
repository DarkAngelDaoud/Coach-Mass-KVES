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

