/* Tests automatiques de Coach Masse. Usage : node build.js && node tests/run.js
   Prérequis (développement seulement) : Node.js et Playwright (npm i -D playwright). */
var http = require('http'), fs = require('fs'), path = require('path'), cp = require('child_process');
var chromium;
try { chromium = require('playwright').chromium; } catch (e) { chromium = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright').chromium; }
var root = path.join(__dirname, '..'), fails = 0, ok = 0;
function t(name, cond, extra) { if (cond) ok++; else { fails++; console.log('ECHEC : ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : '')); } }
var types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
var CFGKEY = null;
var server = http.createServer(function (q, r) {
  var p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
  if (p === '/avis-config.js' && CFGKEY) { r.writeHead(200, { 'content-type': 'application/javascript' }); return r.end('window.AVIS_CONFIG=' + JSON.stringify({ publicKey: CFGKEY, email: '', whatsapp: '' }) + ';'); }
  var f = path.join(root, p);
  if (f.indexOf(root) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f));
});
async function newPage(br, opts) {
  var ctx = await br.newContext(Object.assign({ viewport: { width: 412, height: 915 }, serviceWorkers: 'block', permissions: ['notifications'], acceptDownloads: true }, opts || {}));
  var pg = await ctx.newPage(); pg.errs = [];
  pg.on('pageerror', function (e) { pg.errs.push(e.message); });
  return pg;
}
function dataOf(pg) { return pg.evaluate(function () { return JSON.parse(localStorage.getItem('coach-masse-v1')); }); }
function snaps(pg) {
  return pg.evaluate(function () { return new Promise(function (res) { var q = indexedDB.open('coach-masse-bk', 1); q.onsuccess = function () { var r = q.result.transaction('snaps').objectStore('snaps').getAll(); r.onsuccess = function () { res(r.result.map(function (x) { return { id: x.id, kind: x.kind, sessions: x.sessions }; })); }; }; q.onerror = function () { res(null); }; }); });
}
(async function () {
  /* 1. app.js est bien à jour */
  var before = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  cp.execSync('node build.js', { cwd: root });
  t('app.js correspond à src/ (lance node build.js)', fs.readFileSync(path.join(root, 'app.js'), 'utf8') === before);
  await new Promise(function (r) { server.listen(0, r); });
  var url = 'http://localhost:' + server.address().port + '/index.html';
  var br = await chromium.launch(), pg;

  /* 2. démarrage et onglets */
  pg = await newPage(br); await pg.goto(url);
  for (var tb of ['today', 'train', 'meals', 'track', 'history', 'more', 'settings', 'avis', 'owner']) {
    await pg.evaluate(function (x) { window.__coach.setTab(x); }, tb);
    t('onglet ' + tb + ' s\'affiche', (await pg.textContent('#view')).length > 20);
  }
  t('aucune erreur au démarrage', pg.errs.length === 0, pg.errs);

  /* 3. débordement horizontal */
  for (var sz of [[320, 568], [360, 800], [915, 412]]) {
    await pg.setViewportSize({ width: sz[0], height: sz[1] });
    for (tb of ['today', 'train', 'meals', 'track', 'history', 'more', 'settings', 'avis', 'owner']) {
      await pg.evaluate(function (x) { window.__coach.setTab(x); }, tb);
      t('pas de débordement ' + tb + ' ' + sz.join('x'), await pg.evaluate(function () { return document.documentElement.scrollWidth <= innerWidth + 1; }));
    }
  }
  await pg.context().close();

  /* 4. courses, minuteur, thème */
  pg = await newPage(br, { colorScheme: 'dark' }); await pg.goto(url);
  await pg.click('#nav [data-v=meals]');
  t('courses : 15 lignes sur 7 jours', (await pg.$$('.shop .meal')).length === 15);
  await pg.click('[data-act=shopdays][data-v="14"]'); await pg.click('[data-act=shopm3][data-v=sardines]');
  t('courses : sardines sans poulet', (await pg.textContent('.shop')).includes('Sardines') && !(await pg.textContent('.shop')).includes('Poulet'));
  await pg.click('#nav [data-v=train]');
  await pg.click('[data-act=mtinc][data-id=pompes]'); await pg.click('[data-act=mtinc][data-id=pompes]');
  await pg.click('[data-act=mtsave][data-id=pompes]');
  var d = await dataOf(pg);
  t('mini compteur : série libre enregistrée', d.sessions.length === 1 && d.sessions[0].free && d.sessions[0].logs[0].reps === 2, d.sessions);
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]'); await pg.click('[data-act=theme][data-v=light]');
  t('thème clair appliqué', await pg.evaluate(function () { return getComputedStyle(document.body).backgroundColor === 'rgb(242, 244, 243)'; }));
  await pg.click('[data-act=theme][data-v=auto]');
  t('thème auto suit le système (sombre)', await pg.evaluate(function () { return getComputedStyle(document.body).backgroundColor === 'rgb(12, 19, 24)'; }));
  t('aucune erreur (courses, minuteur, thème)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 5. sauvegarde */
  pg = await newPage(br); await pg.goto(url);
  await pg.evaluate(function () {
    var D = window.__coach.D(), n = new Date(); n.setDate(n.getDate() - 10);
    D.profile.start = n.toISOString().slice(0, 10);
    D.logs[D.profile.start] = { weight: 75 }; D.sessions.push({ date: D.profile.start, min: 50, sets: 3, partial: false, week: 1, logs: [{ id: 'pompes', name: 'Pompes', hi: 12, sn: 1, reps: 10 }] });
    window.__coach.render(); localStorage.setItem('coach-masse-v1', JSON.stringify(D));
  });
  await pg.reload(); await pg.waitForTimeout(3500);
  var s = await snaps(pg);
  t('copie automatique du jour créée', s && s.some(function (x) { return x.kind === 'auto' && x.sessions === 1; }), s);
  t('bannière de rappel de sauvegarde', (await pg.textContent('#view')).includes('Sauvegarde conseillée'));
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  var dl = pg.waitForEvent('download'); await pg.click('#view [data-act=bkexport]');
  var file = await dl, fpath = await file.path(), body = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  t('export : format enveloppé', body.coachMasse === '8' && body.data.sessions.length === 1, Object.keys(body));
  t('export : date de sauvegarde enregistrée', (await dataOf(pg)).profile.bkLast.length === 10);
  t('bannière disparue après sauvegarde', !(await (async function () { await pg.click('#nav [data-v=today]'); return (await pg.textContent('#view')).includes('Sauvegarde conseillée'); })()));
  /* import invalide : rien ne change */
  fs.writeFileSync('/tmp/cm_bad.json', '{"logs": [1,2]}');
  await pg.setInputFiles('#importFile', '/tmp/cm_bad.json'); await pg.waitForTimeout(300);
  t('import invalide refusé', (await dataOf(pg)).sessions.length === 1);
  /* reset puis restauration */
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await pg.click('[data-act=reset]'); await pg.click('[data-act=reset]'); await pg.waitForTimeout(600);
  t('reset vide les données', (await dataOf(pg)).sessions.length === 0);
  s = await snaps(pg);
  t('copie « avant reset » conservée', s && s.some(function (x) { return x.id.indexOf('avant-reset') === 0 && x.sessions === 1; }), s);
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await pg.waitForSelector('[data-act=bkrestore][data-id^=avant-reset]');
  await pg.click('[data-act=bkrestore][data-id^=avant-reset]'); await pg.click('[data-act=bkrestore][data-id^=avant-reset]'); await pg.waitForTimeout(500);
  t('restauration : séance retrouvée', (await dataOf(pg)).sessions.length === 1);
  /* import d'un export */
  await pg.evaluate(function () { var D = window.__coach.D(); D.sessions = []; localStorage.setItem('coach-masse-v1', JSON.stringify(D)); });
  await pg.reload();
  await pg.setInputFiles('#importFile', fpath); await pg.waitForTimeout(600);
  t('import d\'un export : séance retrouvée', (await dataOf(pg)).sessions.length === 1);
  t('aucune erreur (sauvegarde)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 6. données abîmées */
  pg = await newPage(br); await pg.goto(url);
  await pg.evaluate(function () { localStorage.setItem('coach-masse-v1', '{abîmé'); });
  await pg.reload(); await pg.waitForTimeout(800);
  t('données abîmées : l\'appli démarre', (await pg.textContent('#view')).length > 20 && pg.errs.length === 0, pg.errs);
  t('données abîmées : texte brut conservé', await pg.evaluate(function () { return localStorage.getItem('coach-masse-v1-corrompu') === '{abîmé'; }));
  s = await snaps(pg);
  t('données abîmées : copie « corrompu »', s && s.some(function (x) { return x.kind === 'corrompu'; }), s);
  await pg.context().close();

  /* 7. boîte à avis de bout en bout (propriétaire et utilisateur isolés) */
  var own = await newPage(br, { viewport: { width: 390, height: 800 } }); await own.goto(url);
  await own.click('#nav [data-v=more]'); await own.click('[data-act=tab][data-v=owner]');
  await own.fill('#ow_p1', 'phrase-secrete-longue'); await own.fill('#ow_p2', 'phrase-secrete-longue'); await own.click('[data-act=owcreate]');
  await own.waitForSelector('text=Avis reçus', { timeout: 30000 }); await own.click('[data-act=owlock]');
  CFGKEY = await own.evaluate(function () { return JSON.parse(localStorage.getItem('coach-masse-owner-v1')).pub; });
  var usr = await newPage(br); await usr.goto(url);
  await usr.click('#nav [data-v=more]'); await usr.click('[data-act=tab][data-v=avis]');
  await usr.fill('[data-av=name]', 'Amine <b>X</b>'); await usr.fill('[data-av=email]', 'a@b.com');
  await usr.fill('[data-av=msg]', 'Super appli <script>alert(1)</script> éàç 💪'); await usr.click('[data-act=avnote][data-n="5"]');
  await usr.check('[data-av=consent]'); await usr.click('[data-act=avsend]'); await usr.waitForSelector('textarea.code', { state: 'attached' });
  var code = await usr.evaluate(function () { return document.querySelector('textarea.code').value; });
  t('avis : code chiffré CM1', /^CM1\./.test(code));
  await own.fill('#ow_p', 'mauvaise'); await own.click('[data-act=owunlock]'); await own.waitForSelector('text=incorrecte');
  await own.fill('#ow_p', 'phrase-secrete-longue'); await own.click('[data-act=owunlock]'); await own.waitForSelector('#ow_paste');
  await own.fill('#ow_paste', 'texte\n' + code + '\nmerci\n' + code.slice(0, -3) + 'AAA'); await own.click('[data-act=owadd]'); await own.waitForSelector('.msgtxt');
  var html = await own.evaluate(function () { return document.querySelector('#view').innerHTML; });
  t('avis : message déchiffré', (await own.textContent('.msgtxt')).includes('Super appli'));
  t('avis : HTML échappé', !/<script>alert/.test(html) && !/<b>X/.test(html));
  t('avis : code abîmé = illisible', (await own.$$('text=Avis illisible')).length === 1);
  t('aucune erreur (avis)', own.errs.length === 0 && usr.errs.length === 0, own.errs.concat(usr.errs));

  await br.close(); server.close();
  console.log(ok + ' vérifications réussies, ' + fails + ' échec(s)');
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
