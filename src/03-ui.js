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

