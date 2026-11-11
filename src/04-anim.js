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

