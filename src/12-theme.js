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

