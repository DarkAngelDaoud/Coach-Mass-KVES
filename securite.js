/* © KVES · Coach-Mass-KVES : contrôle de sécurité automatique.  Usage : node securite.js
   Sort avec un code 1 si une règle est enfreinte (alerte), 0 sinon. Aucune dépendance. */
var fs = require('fs'), path = require('path'), crypto = require('crypto');
var root = __dirname, fails = [], warns = [], okn = 0;
function rd(f) { return fs.readFileSync(path.join(root, f), 'utf8'); }
function ok(c, msg, warn) { if (c) okn++; else (warn ? warns : fails).push(msg); }
var PUB = ['index.html', 'app.js', 'theme-init.js', 'styles.css', 'sw.js', 'manifest.webmanifest', 'avis-config.js'];
var HAS_SRC = fs.existsSync(path.join(root, 'app.source.js')); /* app.js est minifié depuis app.source.js (lisible) */
if (HAS_SRC) PUB.push('app.source.js');
var code = PUB.map(function (f) { return [f, rd(f)]; });

/* 1. aucune dépendance : pas de package.json avec dépendances d'exécution, pas de node_modules publié */
if (fs.existsSync(path.join(root, 'package.json'))) {
  var pk = JSON.parse(rd('package.json'));
  ok(!pk.dependencies || Object.keys(pk.dependencies).length === 0, 'package.json : des dépendances d\'exécution sont déclarées (' + Object.keys(pk.dependencies || {}).join(', ') + ').');
}
ok(!fs.existsSync(path.join(root, 'node_modules')), 'Un dossier node_modules est présent dans le projet : il ne doit pas être publié.', true);

/* 2. adresses externes : seules celles de la liste blanche */
var ALLOW = /^https?:\/\/(darkangeldaoud\.github\.io|wa\.me|www\.w3\.org|github\.com\/darkangeldaoud)/;
code.forEach(function (c) {
  if (c[0] === 'styles.css' || c[0] === 'manifest.webmanifest') { var m0 = c[1].match(/https?:\/\/[^\s"')]+/g) || []; m0.forEach(function (u) { ok(ALLOW.test(u), c[0] + ' : adresse externe non autorisée : ' + u); }); return; }
  (c[1].match(/https?:\/\/[^\s"'`)<>\\]+/g) || []).forEach(function (u) { ok(ALLOW.test(u), c[0] + ' : adresse externe non autorisée : ' + u); });
});
ok(!/<script[^>]+src=["']https?:/i.test(rd('index.html')) && !/<link[^>]+href=["']https?:\/\/(?!darkangeldaoud)/i.test(rd('index.html')), 'index.html charge une ressource externe (script, police ou style).');

/* 3. motifs dangereux */
var BAD = [[/\beval\s*\(/, 'eval()'], [/new\s+Function\s*\(/, 'new Function()'], [/document\.write\s*\(/, 'document.write()'], [/importScripts\s*\(/, 'importScripts()'], [/\.outerHTML\s*=/, 'outerHTML ='], [/insertAdjacentHTML/, 'insertAdjacentHTML'], [/javascript:/i, 'adresse javascript:']];
code.forEach(function (c) { if (c[0] === 'index.html' || c[0] === 'app.js' || c[0] === 'app.source.js' || c[0] === 'theme-init.js' || c[0] === 'sw.js') BAD.forEach(function (b) { ok(!b[0].test(c[1]), c[0] + ' : motif dangereux ' + b[1]); }); });
ok(!/\son(click|load|error|change|input|submit)\s*=/i.test(rd('index.html')), 'index.html : gestionnaire d\'événement en ligne (onclick, onload...).');
var inner = (rd('app.js').match(/\.innerHTML\s*=/g) || []).length;
ok(inner <= 4, 'app.js : ' + inner + ' affectations innerHTML (4 connues et contrôlées) : vérifie que les nouvelles données sont passées par esc().');

/* 4. politique de sécurité de contenu */
var csp = (rd('index.html').match(/Content-Security-Policy"\s+content="([^"]+)"/) || [])[1] || '';
ok(!!csp, 'index.html : politique de sécurité de contenu (CSP) absente.');
ok(/default-src 'self'/.test(csp) && /script-src 'self'/.test(csp) && /object-src 'none'/.test(csp) && /base-uri 'self'/.test(csp), 'CSP : directives default-src, script-src, object-src et base-uri incomplètes.');
ok(!/script-src[^;]*('unsafe-inline'|'unsafe-eval'|https?:|\*)/.test(csp), 'CSP : script-src trop permissif.');
ok(!/connect-src[^;]*(https?:|\*)/.test(csp), 'CSP : connect-src autorise un site externe.');
var scripts = rd('index.html').match(/<script\b[^>]*>/g) || [];
scripts.forEach(function (s) { ok(/\ssrc=/.test(s), 'index.html : script en ligne (bloqué par la CSP).'); });

/* 5. secrets et clés privées */
var SECRET = [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, /ghp_[A-Za-z0-9]{20,}/, /github_pat_[A-Za-z0-9_]{20,}/, /AKIA[0-9A-Z]{16}/, /sk-[A-Za-z0-9]{32,}/, /"d"\s*:\s*"[A-Za-z0-9_-]{40,}"/];
fs.readdirSync(root).filter(function (f) { return /\.(js|html|json|webmanifest|md|txt|css)$/.test(f); }).forEach(function (f) { var t = rd(f); SECRET.forEach(function (re) { if (f === 'securite.js') return; ok(!re.test(t), f + ' : motif de secret détecté (' + re + ').'); }); });
(function () { var t = rd('avis-config.js'); ok(!/"d"\s*:/.test(t) && !/private/i.test(t), 'avis-config.js : contient peut-être une clé privée !'); })();

/* 6. signature : empreintes des fichiers publiés */
(function () {
  var sig = rd('SIGNATURE-KVES.txt').split('\n').filter(function (l) { return /^[0-9a-f]{64}  /.test(l); });
  ok(sig.length >= 9, 'SIGNATURE-KVES.txt : liste incomplète.');
  sig.forEach(function (l) { var h = l.slice(0, 64), f = l.slice(66); ok(fs.existsSync(path.join(root, f)) && crypto.createHash('sha256').update(fs.readFileSync(path.join(root, f))).digest('hex') === h, 'Signature : ' + f + ' a changé depuis le dernier "node build.js".'); });
})();

/* 6b. cohérence des fichiers publiés (détecte un envoi incomplet ou mélangé) */
(function () {
  var vm = require('vm');
  ['app.js', 'sw.js', 'theme-init.js'].forEach(function (f) { try { new vm.Script(rd(f), { filename: f }); okn++; } catch (e) { fails.push(f + ' : erreur de syntaxe (' + e.message + ').'); } });
  try { var mf = JSON.parse(rd('manifest.webmanifest')); okn++; (mf.icons || []).forEach(function (i) { ok(fs.existsSync(path.join(root, i.src)), 'manifest : icône absente ' + i.src); }); } catch (e) { fails.push('manifest.webmanifest : JSON invalide.'); }
  var html = rd('index.html');
  (html.match(/(?:src|href)="(?!https?:|#|data:)([^"]+)"/g) || []).forEach(function (m) { var f = m.replace(/^[a-z]+="/, '').replace(/"$/, '').split('?')[0]; ok(fs.existsSync(path.join(root, f)), 'index.html référence un fichier absent : ' + f); });
  var sw = rd('sw.js'); (sw.match(/'[A-Za-z0-9._-]+\.(?:js|css|html|png|jpg|webmanifest)'/g) || []).forEach(function (q) { var f = q.slice(1, -1); ok(fs.existsSync(path.join(root, f)), 'sw.js liste un fichier absent : ' + f); });
  var vApp = (rd(HAS_SRC ? 'app.source.js' : 'app.js').match(/var VERSION = '([^']+)'/) || [])[1], vSw = (sw.match(/coach-masse-v([0-9-]+)/) || [])[1];
  if (HAS_SRC) ok(rd('app.js').indexOf('"' + vApp + '"') >= 0 && rd('app.js').length < rd('app.source.js').length, 'app.js (minifié) ne correspond pas à app.source.js : relance la minification.');
  ok(vApp && vSw && vSw === vApp.replace(/\./g, '-'), 'Version incohérente entre app.js (' + vApp + ') et sw.js (' + vSw + ') : fichiers de versions différentes ?');
})();

/* 6b. app.js doit être la version minifiée EXACTE de app.source.js : tout mot d'un texte du source doit se retrouver dans app.js
   (un app.js oublié ou resté à l'ancienne version laisse des mots manquants). Aucune dépendance : petit lecteur de chaînes. */
(function () {
  if (!HAS_SRC) return;
  var src = rd('app.source.js'), min = rd('app.js'), i = 0, n = src.length, words = {}, prev = '', lit = 0;
  function addWords(t) { (t.match(/[A-Za-zÀ-ÿ0-9_]{8,}/g) || []).forEach(function (w) { words[w] = 1; }); }
  while (i < n) {
    var ch = src[i], nx = src[i + 1];
    if (ch === '/' && nx === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (ch === '/' && nx === '*') { i = src.indexOf('*/', i + 2); if (i < 0) break; i += 2; continue; }
    if (ch === '\'' || ch === '"' || ch === '`') {
      var q2 = ch, j = i + 1, buf = '';
      while (j < n && src[j] !== q2) { if (src[j] === '\\') { buf += ' '; j += 2; continue; } buf += src[j]; j++; }
      addWords(buf); lit++; prev = 'x'; i = j + 1; continue;
    }
    if (ch === '/' && '(,=:[!&|?{};+-*%<>~^'.indexOf(prev) >= 0) {
      var k = i + 1, cls = false;
      while (k < n && (src[k] !== '/' || cls) && src[k] !== '\n') { if (src[k] === '\\') k++; else if (src[k] === '[') cls = true; else if (src[k] === ']') cls = false; k++; }
      i = k + 1; while (/[a-z]/.test(src[i] || '')) i++; prev = 'x'; continue;
    }
    if (!/\s/.test(ch)) prev = ch;
    i++;
  }
  var DROPPED = ['translate']; /* mots d'un code mort retiré par la minification */
  var miss = Object.keys(words).filter(function (w) { return min.indexOf(w) < 0 && DROPPED.indexOf(w) < 0; });
  ok(lit > 500 && miss.length === 0, 'app.js ne correspond pas à app.source.js (' + miss.length + ' mot(s) absent(s), ex. : ' + miss.slice(0, 5).join(', ') + ') : relance la minification.');
})();

/* 7. service worker : même origine uniquement */
ok(!/fetch\(\s*['"]https?:/.test(rd('sw.js')), 'sw.js : requête vers un site externe.');
ok(/skipWaiting/.test(rd('sw.js')) && /coach-masse-v/.test(rd('sw.js')), 'sw.js : mise à jour / nom de cache inattendus.', true);

console.log('Contrôle de sécurité : ' + okn + ' vérifications réussies, ' + fails.length + ' alerte(s), ' + warns.length + ' avertissement(s).');
warns.forEach(function (w) { console.log('  AVERTISSEMENT : ' + w); });
fails.forEach(function (f) { console.log('  ALERTE : ' + f); });
/* 6. syntaxe des scripts publiés (détecte un fichier tronqué ou cassé) */
['app.js', 'sw.js', 'theme-init.js'].forEach(function (f) { try { new (require('vm').Script)(rd(f), { filename: f }); okn++; } catch (e) { fails.push(f + ' : erreur de syntaxe (' + e.message + ').'); } });

process.exit(fails.length ? 1 : 0);
