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

