/* © KVES · Coach-Mass-KVES */
/* Tests automatiques de Coach-Mass-KVES. Usage : node build.js && node tests/run.js
   Prérequis (développement seulement) : Node.js et Playwright (npm i -D playwright). */
var http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
var TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'cm-'));
/* petits fichiers audio de test (WAV 3 s), créés à la volée */
function wav(file, hz) { var n = 8000 * 3, b = Buffer.alloc(44 + n * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(8000, 24); b.writeUInt32LE(16000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40); for (var i = 0; i < n; i++) b.writeInt16LE(Math.round(8000 * Math.sin(2 * Math.PI * hz * i / 8000)), 44 + i * 2); fs.writeFileSync(file, b); }
wav(path.join(TMP, 'morceau-un.wav'), 440); wav(path.join(TMP, 'morceau-deux.wav'), 660);
var chromium;
try { chromium = require('playwright').chromium; } catch (e) { chromium = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright').chromium; }
var root = path.join(__dirname, '..'), fails = 0, ok = 0;
function t(name, cond, extra) { if (cond) ok++; else { fails++; console.log('ECHEC : ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : '')); } }
var types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
var CFGKEY = null, BREAK = null, SWV = null, OVR = null;
var server = http.createServer(function (q, r) {
  var p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
  if (BREAK && p === BREAK) { r.writeHead(500); return r.end('boom'); }
  if (OVR && OVR[p] !== undefined) { r.writeHead(200, { 'content-type': 'text/plain' }); return r.end(OVR[p]); }
  if (SWV && p === '/sw.js') { r.writeHead(200, { 'content-type': 'application/javascript' }); return r.end(fs.readFileSync(path.join(root, 'sw.js'), 'utf8').replace(/coach-masse-v[0-9-]+'/, 'coach-masse-v' + SWV.cache + "'")); }
  if (SWV && p === '/version.json') { r.writeHead(200, { 'content-type': 'application/json' }); return r.end(JSON.stringify({ version: SWV.version, notes: ['Test nouveauté A', 'Test nouveauté B'] })); }
  if (p === '/avis-config.js' && CFGKEY) { r.writeHead(200, { 'content-type': 'application/javascript' }); return r.end('window.AVIS_CONFIG=' + JSON.stringify({ publicKey: CFGKEY, email: '', whatsapp: '' }) + ';'); }
  var f = path.join(root, p);
  if (f.indexOf(root) !== 0 || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f));
});
async function newPage(br, opts) {
  var onb = !!(opts && opts.onb), keepClosed = !!(opts && opts.closed); opts = Object.assign({}, opts || {}); delete opts.onb; delete opts.closed;
  var ctx = await br.newContext(Object.assign({ viewport: { width: 412, height: 915 }, serviceWorkers: 'block', permissions: ['notifications'], acceptDownloads: true }, opts || {}));
  if (!onb) await ctx.addInitScript(function () { try { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true } })); } catch (e) {} });
  /* les sections de Réglages sont repliées : les tests les ouvrent toutes (sauf demande contraire) */
  if (!keepClosed) await ctx.addInitScript(function () { new MutationObserver(function () { document.querySelectorAll('details[data-sec]:not([open])').forEach(function (d) { d.open = true; }); }).observe(document, { childList: true, subtree: true }); });
  var pg = await ctx.newPage(); pg.errs = [];
  pg.on('pageerror', function (e) { pg.errs.push(e.message); });
  pg.on('console', function (m) { if (/Content Security Policy|Refused to/i.test(m.text())) pg.errs.push('CSP : ' + m.text()); });
  return pg;
}
function dataOf(pg) { return pg.evaluate(function () { return JSON.parse(localStorage.getItem('coach-masse-v1')); }); }
function snaps(pg) {
  return pg.evaluate(function () { return new Promise(function (res) { var q = indexedDB.open('coach-masse-bk', 1); q.onsuccess = function () { var r = q.result.transaction('snaps').objectStore('snaps').getAll(); r.onsuccess = function () { res(r.result.map(function (x) { return { id: x.id, kind: x.kind, sessions: x.sessions }; })); }; }; q.onerror = function () { res(null); }; }); });
}
(async function () {
  /* 1. app.js est bien à jour */
  var before = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  if (fs.existsSync(path.join(root, 'src'))) { cp.execSync('node build.js', { cwd: root }); t('app.js correspond à src/ (lance node build.js)', fs.readFileSync(path.join(root, 'app.js'), 'utf8') === before); }
  /* signature KVES à jour et marque présente dans chaque source */
  var sigTxt = fs.readFileSync(path.join(root, 'SIGNATURE-KVES.txt'), 'utf8'), sigOk = true;
  sigTxt.split('\n').filter(function (l) { return /^[0-9a-f]{64}  /.test(l); }).forEach(function (l) {
    var h = l.slice(0, 64), f = l.slice(66);
    if (require('crypto').createHash('sha256').update(fs.readFileSync(path.join(root, f))).digest('hex') !== h) sigOk = false;
  });
  t('SIGNATURE-KVES.txt à jour (relance node build.js)', sigOk);
  if (fs.existsSync(path.join(root, 'src'))) t('marque © KVES dans chaque module', fs.readdirSync(path.join(root, 'src')).every(function (f) { return /^\/\* © KVES/.test(fs.readFileSync(path.join(root, 'src', f), 'utf8')); }));
  t('nom Coach-Mass-KVES dans le manifest', JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8')).name === 'Coach-Mass-KVES');
  await new Promise(function (r) { server.listen(0, r); });
  var url = 'http://localhost:' + server.address().port + '/index.html';
  var br = await chromium.launch(), pg;

  /* 2. démarrage et onglets */
  pg = await newPage(br); await pg.goto(url);
  for (var tb of ['today', 'train', 'meals', 'track', 'history', 'more', 'settings', 'avis', 'owner', 'sources']) {
    await pg.evaluate(function (x) { window.__coach.setTab(x); }, tb);
    t('onglet ' + tb + ' s\'affiche', (await pg.textContent('#view')).length > 20);
  }
  t('aucune erreur au démarrage', pg.errs.length === 0, pg.errs);

  /* 3. débordement horizontal */
  for (var sz of [[320, 568], [360, 800], [915, 412]]) {
    await pg.setViewportSize({ width: sz[0], height: sz[1] });
    for (tb of ['today', 'train', 'meals', 'track', 'history', 'more', 'settings', 'avis', 'owner', 'sources']) {
      await pg.evaluate(function (x) { window.__coach.setTab(x); }, tb);
      t('pas de débordement ' + tb + ' ' + sz.join('x'), await pg.evaluate(function () { return document.documentElement.scrollWidth <= innerWidth + 1; }));
    }
  }
  await pg.context().close();

  /* 4. courses, minuteur, thème */
  pg = await newPage(br, { colorScheme: 'dark' }); await pg.goto(url);
  await pg.click('#nav [data-v=meals]');
  t('courses : 16 lignes sur 7 jours', (await pg.$$('.shop .meal')).length === 16);
  await pg.click('[data-act=shopdays][data-v="14"]'); await pg.click('[data-act=shopm3][data-v=sardines]');
  t('courses : sardines sans poulet', (await pg.textContent('.shop')).includes('Sardines') && !(await pg.textContent('.shop')).includes('Poulet'));
  await pg.click('[data-act=diet][data-k=noEgg]');
  await pg.click('#nav [data-v=track]'); var wk = await pg.textContent('#view');
  t('bilan de la semaine affiché', wk.includes('Bilan de la semaine') && wk.includes('Conseil du coach'), wk.slice(0, 200));
  await pg.click('#nav [data-v=meals]');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=en]')]);
  await pg.waitForSelector('#nav');
  var navEn = await pg.textContent('#nav');
  t('langue : anglais (menu traduit)', navEn.includes('Today') && navEn.includes('Progress') && !navEn.includes('Suivi') && (await pg.evaluate(function () { return document.documentElement.lang; })) === 'en', navEn);
  await pg.click('#nav [data-v=meals]'); var mEn = await pg.textContent('#view');
  t('langue : repas et courses en anglais', mEn.includes("Today's meals") && mEn.includes('Shopping list') && mEn.includes('Chicken') && mEn.includes('Dry lentils') && !mEn.includes('Liste de courses'), mEn.slice(mEn.indexOf('Shopping'), mEn.indexOf('Shopping') + 400));
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=fr]')]); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=ar]')]); await pg.waitForSelector('#nav');
  var navAr = await pg.textContent('#nav');
  t('langue : arabe (menu traduit, sens de lecture droite à gauche)', navAr.includes('اليوم') && navAr.includes('الوجبات') && (await pg.evaluate(function () { return document.documentElement.dir + document.documentElement.lang; })) === 'rtlar', navAr);
  await pg.click('#nav [data-v=meals]'); var mAr = await pg.textContent('#view');
  t('langue : repas en arabe', mAr.includes('وجبات اليوم') && mAr.includes('قائمة المشتريات') && !mAr.includes('Liste de courses'), mAr.slice(0, 120));
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=fr]')]); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=ma]')]); await pg.waitForSelector('#nav');
  var navMa = await pg.textContent('#nav'); await pg.click('#nav [data-v=meals]'); var mMa = await pg.textContent('#view');
  t('langue : darija (écriture latine, de gauche à droite)', navMa.includes('Lyoum') && navMa.includes('Taqaddum') && mMa.includes('Lista dyal l-mchtariyat') && (await pg.evaluate(function () { return document.documentElement.dir; })) !== 'rtl', navMa);
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=fr]')]); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=en]')]); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=train]'); var trEn = await pg.textContent('#view');
  t('langue : consignes des exercices en anglais', trEn.includes('Body straight from head to heels') && !trEn.includes('Corps droit de la tête'), trEn.slice(0, 160));
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=fr]')]); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=ar]')]); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=sources]'); var srAr = await pg.textContent('#view');
  t('langue : page Sources en arabe', srAr.includes('المصادر والحدود') && srAr.includes('بياناتك') && !srAr.includes('Limites et prudence'), srAr.slice(0, 120));
  var shareT = await pg.evaluate(function () { return document.documentElement.lang; });
  t('langue : attribut lang arabe', shareT === 'ar');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await Promise.all([pg.waitForNavigation(), pg.click('[data-act=lang][data-v=fr]')]); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=player]');
  var plV = await pg.textContent('#view'); t('lecteur : page affichée', plV.includes('Choisir mes musiques') && plV.includes('Aucun morceau choisi.'));
  await pg.setInputFiles('#musicFile', [path.join(TMP, 'morceau-un.wav'), path.join(TMP, 'morceau-deux.wav')]); await pg.waitForTimeout(400);
  plV = await pg.textContent('#view');
  t('lecteur : liste et morceau en cours', plV.includes('2 morceau(x)') && plV.includes('morceau-un') && plV.includes('morceau-deux') && plV.includes('En lecture'), plV.slice(0, 200));
  await pg.click('[data-act=mnext]'); await pg.waitForTimeout(300);
  t('lecteur : suivant change le morceau', (await pg.textContent('#view .coach .msg')).includes('morceau-deux'));
  await pg.click('[data-act=mshuf]'); await pg.click('[data-act=mrep]');
  plV = await pg.textContent('#view'); t('lecteur : aléatoire et répétition', plV.includes('Aléatoire : oui') && plV.includes('toute la liste'));
  await pg.click('#nav [data-v=train]'); await pg.click('[data-act=start]'); await pg.waitForTimeout(400);
  var mini = await pg.$('#runner .mini'); t('lecteur : mini-lecteur dans la séance', !!mini && (await pg.textContent('#runner .mini')).includes('morceau-deux'));
  await pg.click('#runner [data-act=mnext]'); await pg.waitForTimeout(400);
  t('lecteur : suivant depuis la séance', (await pg.textContent('#runner .mini')).includes('morceau-'), await pg.textContent('#runner .mini'));
  for (var q2 = 0; q2 < 6 && await pg.isVisible('#runner'); q2++) { await pg.click('#runner [data-act=quit], #runner [data-act=closerun]'); await pg.waitForTimeout(250); }
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=player]');
  await pg.click('[data-act=mclear]'); plV = await pg.textContent('#view');
  t('lecteur : liste vidée', plV.includes('Aucun morceau choisi.') && !plV.includes('morceau-un'));
  await pg.click('[data-act=tab][data-v=more]');
  t('langue : retour au français', (await pg.textContent('#nav')).includes('Suivi'));
  await pg.click('#nav [data-v=meals]');
  t('régime : sans œufs, courses sans œufs', !(await pg.textContent('.shop')).includes('Œufs') && (await pg.textContent('#view')).includes('Sans œufs'));
  await pg.click('[data-act=diet][data-k=veg]');
  var shv = await pg.textContent('.shop');
  t('régime : végétarien, ni poulet ni sardines', !shv.includes('Poulet') && !shv.includes('Sardines') && shv.includes('Lentilles'), shv);
  await pg.click('[data-act=diet][data-k=veg]'); await pg.click('[data-act=diet][data-k=noEgg]');
  await pg.click('[data-act=shopm3][data-v=mix]'); await pg.click('[data-act=budget][data-v=serre]');
  var shb = await pg.textContent('.shop');
  t('budget serré : pas de poulet', !shb.includes('Poulet') && shb.includes('Sardines'), shb);
  await pg.click('[data-act=budget][data-v=normal]');
  await pg.click('#nav [data-v=train]');
  await pg.click('[data-act=mtinc][data-id=pompes]'); await pg.click('[data-act=mtinc][data-id=pompes]');
  await pg.click('[data-act=mtsave][data-id=pompes]');
  var d = await dataOf(pg);
  t('mini compteur : série libre enregistrée', d.sessions.length === 1 && d.sessions[0].free && d.sessions[0].logs[0].reps === 2, d.sessions);
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]'); await pg.click('[data-act=theme][data-v=light]');
  t('thème clair appliqué', await pg.evaluate(function () { return getComputedStyle(document.body).backgroundColor === 'rgb(241, 245, 249)'; }));
  await pg.click('[data-act=theme][data-v=auto]');
  t('thème auto suit le système (sombre)', await pg.evaluate(function () { return getComputedStyle(document.body).backgroundColor === 'rgb(11, 20, 28)'; }));
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
  t('export : format enveloppé', body.coachMasse === '18.6' && body.data.sessions.length === 1, Object.keys(body));
  t('export : date de sauvegarde enregistrée', (await dataOf(pg)).profile.bkLast.length === 10);
  t('bannière disparue après sauvegarde', !(await (async function () { await pg.click('#nav [data-v=today]'); return (await pg.textContent('#view')).includes('Sauvegarde conseillée'); })()));
  /* import invalide : rien ne change */
  fs.writeFileSync(path.join(TMP, 'cm_bad.json'), '{"logs": [1,2]}');
  await pg.setInputFiles('#importFile', path.join(TMP, 'cm_bad.json')); await pg.waitForTimeout(300);
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
  await usr.fill('[data-av=msg]', 'Avis pour Coach-Mass-KVES (chiffré)\nCM1.' + 'A'.repeat(120)); await usr.check('[data-av=consent]'); await usr.click('[data-act=avsend]'); await usr.waitForTimeout(400);
  t('avis : message contenant un code refusé', (await usr.$$('textarea.code')).length === 0 && (await usr.textContent('#toast')).includes('code d\'avis'));
  await usr.fill('[data-av=msg]', 'Super appli <script>alert(1)</script> éàç 💪'); await usr.click('[data-act=avnote][data-n="5"]');
  await usr.waitForTimeout(0); if (!(await usr.isChecked('[data-av=consent]'))) await usr.check('[data-av=consent]');
  await usr.click('[data-act=avsend]'); await usr.waitForSelector('textarea.code', { state: 'attached' });
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

  /* 8. version 11 : couleurs, lancement seul, popup, calendrier, sources */
  pg = await newPage(br, { colorScheme: 'dark' }); await pg.goto(url);
  t('barre du bas : 6 icônes', (await pg.$$('#nav button svg')).length === 6);
  await pg.evaluate(function () { window.__coach.setTab('train'); });
  t('couleur Séance (vert KVES)', await pg.evaluate(function () { return getComputedStyle(document.body).getPropertyValue('--accent').toLowerCase().indexOf('18b169') >= 0; }));
  await pg.evaluate(function () { window.__coach.setTab('meals'); });
  t('couleur Repas (vert KVES)', await pg.evaluate(function () { return getComputedStyle(document.body).getPropertyValue('--accent').toLowerCase().indexOf('18b169') >= 0; }));
  await pg.evaluate(function () { window.__coach.setTab('train'); });
  await pg.click('[data-ex=pompes] details.cfg >> nth=0 >> summary');
  await pg.click('[data-act=excfg][data-id=pompes][data-k=sets][data-d="-1"]');
  t('réglage séries : 3 devient 2', (await pg.textContent('#cfg_pompes_sets')) === '2');
  await pg.click('[data-act=excfg][data-id=pompes][data-k=rest][data-d="1"]');
  t('réglages mémorisés', (await dataOf(pg)).profile.exCfg.pompes.sets === 2 && (await dataOf(pg)).profile.exCfg.pompes.rest > 0);
  await pg.click('[data-act=exsolo][data-id=pompes]');
  var rt = await pg.textContent('#runner');
  t('lancement seul : 1 exercice, 2 séries, sans échauffement', /Exercice 1\/1/.test(rt) && /série 1\/2/.test(rt) && !/Échauffement/.test(rt), rt.slice(0, 120));
  await pg.click('#runner [data-act=begin]'); await pg.waitForTimeout(400);
  await pg.click('#runner [data-act=stopwork]'); await pg.waitForTimeout(300);
  await pg.click('#runner [data-act=quit]'); await pg.click('#runner [data-act=quit]'); await pg.waitForTimeout(300);
  d = await dataOf(pg);
  t('lancement seul interrompu : série libre enregistrée, niveaux inchangés', d.sessions.length === 1 && d.sessions[0].free === true && Object.keys(d.levels).every(function (k) { return d.levels[k].level === 0 && d.levels[k].off === 0; }), d.levels);
  /* popup nouveautés */
  await pg.evaluate(function () { var D = JSON.parse(localStorage.getItem('coach-masse-v1')); D.profile.seenVersion = '10'; localStorage.setItem('coach-masse-v1', JSON.stringify(D)); });
  await pg.reload(); await pg.waitForTimeout(1200);
  t('popup nouveautés après changement de version', await pg.isVisible('#modal') && (await pg.textContent('#modal')).includes('Mise à jour installée'));
  await pg.click('[data-act=modalclose]');
  await pg.reload(); await pg.waitForTimeout(1200);
  t('popup affiché une seule fois', !(await pg.isVisible('#modal')));
  await pg.context().close();
  pg = await newPage(br); await pg.goto(url); await pg.waitForTimeout(1200);
  t('première installation : aucun popup', !(await pg.isVisible('#modal')));
  /* calendrier */
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  var dl2 = pg.waitForEvent('download'); await pg.click('[data-act=rmics]');
  var ics = fs.readFileSync(await (await dl2).path(), 'utf8');
  t('calendrier : 2 événements quotidiens avec alerte', (ics.match(/BEGIN:VEVENT/g) || []).length === 2 && (ics.match(/RRULE:FREQ=DAILY/g) || []).length === 2 && (ics.match(/BEGIN:VALARM/g) || []).length === 2 && /DTSTART:\d{8}T073000/.test(ics) && /DTSTART:\d{8}T220000/.test(ics) && ics.indexOf('\r\n') > 0, ics.slice(0, 200));
  await pg.evaluate(function () { window.__coach.setTab('sources'); });
  t('page Sources et limites', (await pg.textContent('#view')).includes('Morton') && (await pg.textContent('#view')).includes('médecin'));
  t('aucune erreur (v11)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 9. version 12 : profil, zones, mannequin, avancés, calories, partage */
  pg = await newPage(br, { onb: true }); await pg.goto(url); await pg.waitForTimeout(700);
  t('première installation : écran de profil', await pg.isVisible('#modal') && (await pg.textContent('#modal')).includes('Ton profil'));
  await pg.click('[data-act=obg][data-v=f]'); await pg.click('[data-act=obo][data-v=perte]');
  await pg.fill('#ob_age', '17'); await pg.fill('#ob_h', '160'); await pg.fill('#ob_w', '50'); await pg.fill('#ob_goal', '48');
  await pg.click('[data-act=obsave]');
  t('moins de 18 ans refusé', (await pg.textContent('#obErr')).includes('18 ans') && await pg.isVisible('#modal'));
  await pg.fill('#ob_age', '60'); await pg.fill('#ob_goal', '55'); await pg.click('[data-act=obsave]');
  t('perte de poids : objectif supérieur refusé', (await pg.textContent('#obErr')).includes('inférieur'));
  await pg.fill('#ob_goal', '30'); await pg.click('[data-act=obsave]');
  t('poids visé absurde refusé', await pg.isVisible('#modal'));
  await pg.fill('#ob_goal', '42'); await pg.click('[data-act=obsave]');
  t('IMC trop bas refusé', (await pg.textContent('#obErr')).includes('trop bas') || (await pg.textContent('#obErr')).includes('invalide'), await pg.textContent('#obErr'));
  await pg.fill('#ob_goal', '48'); await pg.click('.onb details summary'); await pg.fill('#ob_m_taille', '70'); await pg.click('[data-act=obsave]');
  t('profil : case avertissement santé obligatoire', (await pg.textContent('#obErr')).includes('avertissement santé') && await pg.isVisible('#modal'));
  await pg.check('#ob_health'); await pg.click('[data-act=obsave]');
  d = await dataOf(pg);
  t('profil enregistré', !(await pg.isVisible('#modal')) && d.profile.gender === 'f' && d.profile.obj === 'perte' && d.profile.age === 60 && d.profile.onboarded === true && d.profile.healthOk === true && d.profile.w0 === 50 && d.measures.length === 1, d.profile);
  await pg.click('#nav [data-v=meals]');
  var mt = await pg.textContent('#view');
  t('perte : cible calorique au plancher femme (1200)', mt.includes('Perte de poids') && /cible : environ 1200 kcal/.test(mt), mt.slice(0, 160));
  await pg.reload(); await pg.waitForTimeout(900);
  t('profil conservé, pas de nouvel écran', !(await pg.isVisible('#modal')));
  await pg.context().close();

  pg = await newPage(br); await pg.goto(url);
  await pg.evaluate(function () { window.__coach.setTab('train'); });
  t('7 zones affichées', (await pg.$$('.zonehead')).length === 7);
  t('20 exercices', (await pg.$$('[data-ex]')).length === 20);
  var bad = await pg.evaluate(function () {
    var out = [];
    document.querySelectorAll('[data-ex] svg.anim').forEach(function (sv) { sv.setAttribute('data-mode', 'manual'); sv.setAttribute('data-t', '1'); });
    return new Promise(function (res) { setTimeout(function () {
      document.querySelectorAll('[data-ex] svg.anim').forEach(function (sv) { sv.querySelectorAll('polyline.fig').forEach(function (p) { if (/NaN|undefined/.test(p.getAttribute('points'))) out.push(sv.getAttribute('data-fig')); }); });
      res(out);
    }, 200); });
  });
  t('animations : aucun point invalide', bad.length === 0, bad);
  t('mannequin de face : muscles colorés (pompes)', await pg.evaluate(function () { return document.querySelectorAll('[data-ex=pompes] .mfront svg.mq .mu.on').length >= 4; }));
  t('mannequin de face affiché à côté de l\'animation', (await pg.textContent('[data-ex=pompes] .mfront')).includes('Face'));
  t('profil animé : muscles qui s\'illuminent', await pg.evaluate(function () { var h = document.querySelectorAll('[data-ex=pompes] polyline.hl'); return h.length >= 2 && Array.prototype.every.call(h, function (p) { return /\d/.test(p.getAttribute('points')); }); }));
  var pul = await pg.evaluate(function () { var sv = document.querySelector('[data-ex=pompes] svg.anim'), mu = document.querySelector('[data-ex=pompes] .mfront .mu.on'); function at(v) { sv.setAttribute('data-mode', 'manual'); sv.setAttribute('data-t', v); return new Promise(function (r) { setTimeout(function () { r(parseFloat(mu.style.opacity)); }, 150); }); } return at('0').then(function (a) { return at('1').then(function (b) { return [a, b]; }); }); });
  t('muscles de face qui pulsent avec le mouvement', pul[0] > pul[1] + 0.3, pul);
  t('9 exercices avec précautions', (await pg.$$('[data-ex] .warn')).length === 9);
  t('17 cases (3 avancés verrouillés sans case)', (await pg.$$('[data-act=extra]')).length === 17);
  await pg.uncheck('[data-ex=pompes] [data-act=extra]');
  t('exercice d\'origine décochable', (await dataOf(pg)).profile.sessOff.indexOf('pompes') >= 0);
  for (var uu = 0; uu < 8; uu++) { if ((await pg.$$('[data-act=extra]:checked')).length > 3) { await pg.locator('[data-act=extra]:checked').first().click(); await pg.waitForTimeout(100); } }
  t('minimum 3 exercices dans la séance', (await pg.$$('[data-act=extra]:checked')).length === 3);
  for (var ci of ['pompes', 'squats', 'tirage', 'pike', 'fentes', 'pont', 'mollets', 'gainage']) { if (!(await pg.isChecked('[data-ex=' + ci + '] [data-act=extra]'))) { await pg.click('[data-ex=' + ci + '] [data-act=extra]'); await pg.waitForTimeout(100); } }
  for (var ei of ['crunch']) { if (!(await pg.isChecked('[data-ex=' + ei + '] [data-act=extra]'))) await pg.click('[data-ex=' + ei + '] [data-act=extra]'); }
  for (var xi2 of ['inclinees', 'lateral', 'superman', 'rowing', 'curl', 'releves', 'mountain', 'bulgare']) { if (await pg.isChecked('[data-ex=' + xi2 + '] [data-act=extra]')) { await pg.click('[data-ex=' + xi2 + '] [data-act=extra]'); await pg.waitForTimeout(100); } }
  t('dips verrouillés (avancé)', (await pg.textContent('[data-ex=dips]')).includes('Réservé aux niveaux avancés') && !(await pg.$('[data-ex=dips] [data-act=exsolo]')));
  t('pompes diamant et squat sauté verrouillés', (await pg.textContent('[data-ex=diamant]')).includes('Réservé') && (await pg.textContent('[data-ex=saute]')).includes('Réservé'));
  await pg.evaluate(function () { window.__coach.setTab('settings'); });
  await pg.click('[data-set=advOn]');
  await pg.evaluate(function () { window.__coach.setTab('train'); });
  t('avancés débloqués par le réglage', !(await pg.textContent('[data-ex=dips]')).includes('Réservé') && !!(await pg.$('[data-ex=dips] [data-act=exsolo]')));
  await pg.check('[data-ex=crunch] [data-act=extra]');
  t('exercice ajouté à la séance', (await dataOf(pg)).profile.extras.indexOf('crunch') >= 0);
  await pg.click('#view [data-act=start]');
  for (var wk = 0; wk < 4; wk++) { await pg.click('#runner [data-act=skip]'); await pg.waitForTimeout(150); }
  t('séance complète : 9 exercices', /Exercice 1\/9/.test(await pg.textContent('#runner')), (await pg.textContent('#runner')).slice(0, 80));
  for (var qq = 0; qq < 6 && await pg.isVisible('#runner'); qq++) { await pg.click('#runner [data-act=quit], #runner [data-act=closerun]'); await pg.waitForTimeout(250); }
  await pg.evaluate(function () { window.__coach.setTab('train'); });
  await pg.click('[data-ex=releves] details.cfg >> nth=0 >> summary');
  await pg.click('[data-act=exsolo][data-id=releves]');
  t('exercice à risque : confirmation avant le lancement seul', await pg.isVisible('#modal') && (await pg.textContent('#modal')).includes('Arrête-toi si') && !(await pg.isVisible('#runner')));
  await pg.click('[data-act=modalclose]');
  t('annuler ne lance rien', !(await pg.isVisible('#runner')) && !(await pg.isVisible('#modal')));
  await pg.click('[data-act=exsolo][data-id=releves]'); await pg.click('[data-act=exsoloGo]');
  t('lancement seul d\'un exercice à risque après confirmation', /Exercice 1\/1/.test(await pg.textContent('#runner')));
  for (qq = 0; qq < 6 && await pg.isVisible('#runner'); qq++) { await pg.click('#runner [data-act=quit], #runner [data-act=closerun]'); await pg.waitForTimeout(250); }
  /* courbes de mensurations */
  await pg.evaluate(function () { var D = window.__coach.D(); D.measures.push({ date: '2026-10-01', taille: 90, bras: 33 }, { date: '2026-11-01', taille: 88, bras: 34 }); window.__coach.render(); window.__coach.setTab('track'); });
  t('courbe de mensurations', !!(await pg.$('svg.minichart polyline')));
  /* partage */
  await pg.click('#nav [data-v=more]');
  var mv = await pg.textContent('#view');
  t('partage : carte et QR code', mv.includes('Partager l\'application') && (await pg.$$('.qrbox svg rect')).length > 300 && (await pg.getAttribute('.qrbox svg', 'viewBox')).split(' ')[2] === '49');
  await pg.evaluate(function () { window.__shared = null; navigator.share = function (o) { window.__shared = o; return Promise.resolve(); }; });
  await pg.click('[data-act=appshare]');
  var sh = await pg.evaluate(function () { return window.__shared; });
  t('partage : lien court et message en français', sh && sh.url === 'https://darkangeldaoud.github.io/Coach-Mass-KVES/' && /séances guidées/i.test(sh.text) && /hors ligne/.test(sh.text), sh);
  var html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  t('aperçu du lien : balises Open Graph', /og:title/.test(html) && /og:description/.test(html) && /og:image" content="https:\/\/darkangeldaoud\.github\.io\/Coach-Mass-KVES\/share\.jpg/.test(html) && /twitter:card/.test(html));
  var jpg = fs.readFileSync(path.join(root, 'share.jpg'));
  t('image de partage : JPEG 1200x630 légère', jpg[0] === 0xff && jpg.length < 300000 && (function () { for (var i = 2; i < jpg.length; i += 2 + jpg.readUInt16BE(i + 2)) { if (jpg[i] === 0xff && (jpg[i + 1] === 0xc0 || jpg[i + 1] === 0xc2)) return jpg.readUInt16BE(i + 7) === 1200 && jpg.readUInt16BE(i + 5) === 630; if (jpg[i] !== 0xff) break; } return false; })(), jpg.length);
  await pg.evaluate(function () { window.__coach.setTab('sources'); });
  t('Sources : exercices à risque', (await pg.textContent('#view')).includes('Exercices à risque') && (await pg.textContent('#view')).includes('Dips sur chaise') && (await pg.textContent('#view')).includes('Arrête-toi si'));
  t('aucune erreur (v12)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 10. sécurité : contrôle automatique + données piégées */
  var sec = cp.spawnSync('node', [path.join(root, 'securite.js')], { encoding: 'utf8' });
  t('contrôle de sécurité (securite.js) sans alerte', sec.status === 0, sec.stdout);
  pg = await newPage(br, { onb: true }); await pg.goto(url);
  var evil = { profile: { onboarded: true, age: '<img src=x onerror=window.__x=1>', height: '180', goal: 'abc', days: ['<b>', 2], exCfg: { pompes: { sets: '3', reps: 'x' }, '__proto__': { a: 1 } }, ['bad key<']: 1 }, measures: [{ date: '<i>', taille: 1 }, { date: '2026-01-01', taille: '90', bras: '<u>' }], sessions: [{ date: '<script>', min: 5 }, { date: '2026-01-02', min: '50', sets: 'x' }], logs: { '<x>': {}, '2026-01-03': { weight: 74 } }, levels: { squats: { level: '2', off: 'z' } } };
  await pg.evaluate(function (d) { localStorage.setItem('coach-masse-v1', JSON.stringify(d)); }, evil);
  await pg.reload(); await pg.waitForTimeout(500);
  for (var tb2 of ['today', 'train', 'meals', 'track', 'more', 'settings']) { await pg.evaluate(function (x) { window.__coach.setTab(x); }, tb2); }
  var cl = await pg.evaluate(function () { var D = window.__coach.D(); return { x: window.__x, p: D.profile, m: D.measures, s: D.sessions, l: Object.keys(D.logs), lv: D.levels, proto: ({}).a }; });
  t('données piégées : aucun code exécuté', cl.x === undefined);
  t('données piégées : types forcés', cl.p.age === 41 && cl.p.height === 180 && cl.p.goal === 80 && cl.p.days.length === 1 && cl.p.days[0] === 2 && cl.p.exCfg.pompes.sets === 3 && cl.p.exCfg.pompes.reps === undefined && !('bad key<' in cl.p), cl.p);
  t('données piégées : mesures, séances, journaux filtrés', cl.m.length === 1 && cl.m[0].taille === 90 && cl.m[0].bras === undefined && cl.s.length === 1 && cl.s[0].min === 50 && cl.s[0].sets === 0 && cl.l.indexOf('<x>') < 0 && cl.l.indexOf('2026-01-03') >= 0 && cl.lv.squats.level === 2 && cl.lv.squats.off === 0, cl);
  t('données piégées : pas de pollution de prototype', cl.proto === undefined);
  await pg.context().close();

  /* 11. données réelles de la version 11 : rien ne doit se perdre au nettoyage */
  pg = await newPage(br, { onb: true }); await pg.goto(url);
  var V11 = {profile:{start:'2026-11-09',w0:75,goal:80,height:179,age:41,days:[1,3,5],tempo:3,voice:true,vib:true,count:true,auto:true,restBonus:15,sound:true,rotate:false,metro:true,warn10:true,vol:7,hasBar:false,cigs:true,kcalAdj:300,lastAdj:'2026-11-12',bkLast:'2026-11-14',bkEvery:7,vibLevel:3,exCfg:{pompes:{sets:4,reps:10,rest:90}},seenVersion:'11',avisName:'Ernest',avisEmail:'e@x.com',theme:'dark',rmOn:true,rmW:'07:30',rmM:'22:00',rmLw:'2026-11-14',rmLm:'',shopDays:7,shopM3:'mix',shopM5:'mix',shopDone:{'lentilles':true}},
logs:{'2026-11-10':{weight:75.2,sleep:7,energy:4,meals:[true,true,false,true,true],water:1.5,steps:6000,cigs:20,note:'RAS'},'2026-11-11':{weight:75.6}},
measures:[{date:'2026-11-09',bras:33,poitrine:98,taille:84,cuisse:56},{date:'2026-11-23',bras:33.5,poitrine:99,taille:84,cuisse:56.5}],
sessions:[{date:'2026-11-10',min:58,sets:22,partial:false,light:false,week:1,logs:[{id:'pompes',name:'Pompes',hi:12,sn:1,reps:12},{id:'squats',name:'Squats',hi:15,sn:1,reps:15}]},{date:'2026-11-11',min:4,sets:2,partial:true,free:true,light:false,week:1,logs:[{id:'pompes',name:'Pompes',hi:12,sn:1,reps:10}]}],
levels:{pompes:{level:1,off:2},squats:{level:0,off:0}},
avis:{sent:[{d:'2026-11-12',type:'Idée',stars:5,len:120}],inbox:[{code:'CM1.'+'A'.repeat(300),added:'2026-11-12',st:'new'}]}};
  await pg.evaluate(function (d) { localStorage.setItem('coach-masse-v1', JSON.stringify(d)); }, V11);
  await pg.reload(); await pg.waitForTimeout(400);
  var aft = await pg.evaluate(function () { return JSON.parse(JSON.stringify(window.__coach.D())); });
  function same(a, b) { if (a && typeof a === 'object') { if (!b || typeof b !== 'object') return false; return Object.keys(a).every(function (k) { return same(a[k], b[k]); }); } return a === b; }
  t('données V11 conservées intactes après nettoyage', ['profile', 'logs', 'measures', 'sessions', 'levels', 'avis'].every(function (k) { return same(V11[k], aft[k]); }), aft.profile);
  await pg.context().close();

  /* réglages : sections repliées par défaut, ouvertes à la demande, état gardé */
  pg = await newPage(br, { closed: true }); await pg.goto(url);
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  var secN = await pg.$$eval('details[data-sec]', function (e) { return e.length; }), secOpen = await pg.$$eval('details[data-sec][open]', function (e) { return e.length; });
  t('réglages : sections repliables (une seule ouverte au départ)', secN >= 7 && secOpen === 1, [secN, secOpen]);
  t('réglages : "Coach" masqué tant que la section est fermée', !(await pg.isVisible('[data-act=testvoice]')));
  await pg.click('details[data-sec="Coach"] summary'); await pg.waitForTimeout(150);
  t('réglages : "Coach" s\'ouvre', await pg.isVisible('[data-act=testvoice]'));
  await pg.click('[data-act=testvib]'); await pg.waitForTimeout(150);
  t('réglages : la section reste ouverte après une action', await pg.isVisible('[data-act=testvoice]'));
  await pg.context().close();

  /* 18.5 : protection des données (copie de sécurité + restauration) */
  async function seed185() {
    var q = await newPage(br, { onb: true }); await q.goto(url); await q.waitForSelector('#nav');
    await q.evaluate(function () { var D = window.__coach.D(); D.profile.onboarded = true; D.profile.healthOk = true; D.profile.w0 = 71.5; D.sessions.push({ date: '2026-11-01', min: 30, sets: 10, week: 1, logs: [] }, { date: '2026-11-03', min: 31, sets: 11, week: 1, logs: [] }); window.__coach.save(); });
    await q.waitForTimeout(3800); return q;
  }
  var p5 = await seed185();
  var hasCopy = await p5.evaluate(function () { return caches.open('coach-masse-safe').then(function (c) { return c.match('./copie-securite'); }).then(function (r) { return !!r; }); });
  t('protection : une copie de sécurité est gardée à part après un enregistrement', hasCopy);
  await p5.evaluate(function () { localStorage.clear(); });
  await p5.reload(); await p5.waitForSelector('[data-act=rcgo]', { timeout: 8000 });
  t('protection : données effacées : la restauration est proposée avec le nombre de séances', /2/.test(await p5.textContent('#modal')));
  await p5.click('[data-act=rcgo]'); await p5.waitForTimeout(600);
  var back = await p5.evaluate(function () { var D = window.__coach.D(); return [D.sessions.length, D.profile.w0]; });
  t('protection : restauration complète (séances et profil)', back[0] === 2 && back[1] === 71.5, back);
  await p5.context().close();
  var p6 = await seed185();
  await p6.evaluate(function () { localStorage.clear(); return caches.delete('coach-masse-safe'); });
  await p6.waitForTimeout(500);
  var idbOk = await p6.evaluate(function () { return new Promise(function (res) { var r = indexedDB.open('coach-masse-bk'); r.onsuccess = function () { var q = r.result.transaction(r.result.objectStoreNames[0]).objectStore(r.result.objectStoreNames[0]).count(); q.onsuccess = function () { res(q.result); }; }; r.onerror = function () { res(-1); }; }); });
  await p6.reload(); await p6.waitForTimeout(1500);
  t('protection : sans copie cache, la sauvegarde automatique interne est proposée', idbOk > 0 ? await p6.isVisible('[data-act=rcgo]') : true, idbOk);
  await p6.context().close();
  var p7 = await seed185();
  await p7.evaluate(function () { localStorage.clear(); }); await p7.reload(); await p7.waitForSelector('[data-act=rcno]', { timeout: 8000 });
  await p7.click('[data-act=rcno]'); await p7.waitForTimeout(600);
  var gone = await p7.evaluate(function () { return caches.has('coach-masse-safe'); });
  t('protection : « repartir de zéro » efface la copie de sécurité', gone === false);
  await p7.context().close();
  var p8 = await newPage(br, { onb: true }); await p8.goto(url); await p8.waitForSelector('#nav'); await p8.waitForTimeout(1500);
  t('protection : nouvel utilisateur : aucune fausse alerte de données perdues', !(await p8.isVisible('[data-act=rcgo]')));
  await p8.context().close();
  /* 18.4 : signature KVES (Ed25519) */
  var crypto7 = require('crypto');
  var kp = crypto7.generateKeyPairSync('ed25519'), pubRaw = Buffer.from(kp.publicKey.export({ format: 'jwk' }).x, 'base64url');
  var sigTxt = fs.readFileSync(path.join(root, 'SIGNATURE-KVES.txt'));
  var sigOk = crypto7.sign(null, sigTxt, kp.privateKey).toString('base64url');
  async function aboutSig(ovr) {
    OVR = ovr; var q = await newPage(br); await q.goto(url); await q.waitForSelector('#nav');
    await q.evaluate(function () { window.__coach.setTab('more'); }); await q.waitForTimeout(500); await q.evaluate(function () { document.querySelector('#modal').hidden = true; });
    var txt = ''; for (var w = 0; w < 30 && !/vérifiée|invalide|différents|non configurée|impossible/.test(txt); w++) { await q.waitForTimeout(250); txt = await q.textContent('#sigstat'); }
    var fpv = await q.evaluate(function () { var e = document.getElementById('sigfpv'); return e ? e.textContent : ''; });
    await q.context().close(); OVR = null; return { txt: txt, fp: fpv };
  }
  var s0 = await aboutSig(null);
  t('signature : sans fichiers de signature, message « non configurée » (l\'appli fonctionne)', /non configurée/.test(s0.txt), s0.txt);
  var s1 = await aboutSig({ '/SIGNATURE-KVES.txt': sigTxt, '/SIGNATURE-KVES.sig': sigOk, '/kves-cle-publique.txt': pubRaw.toString('base64url') });
  t('signature : signature valide et fichiers conformes : « vérifiée » + empreinte de la clé', /vérifiée/.test(s1.txt) && /^[0-9A-F]{4}( [0-9A-F]{4}){3}$/.test(s1.fp), [s1.txt, s1.fp]);
  var badTxt = Buffer.from(sigTxt.toString('utf8').replace(/^[0-9a-f]/m, function (c) { return c === 'a' ? 'b' : 'a'; }));
  var s2 = await aboutSig({ '/SIGNATURE-KVES.txt': badTxt, '/SIGNATURE-KVES.sig': sigOk, '/kves-cle-publique.txt': pubRaw.toString('base64url') });
  t('signature : liste modifiée après signature : « invalide »', /invalide/.test(s2.txt), s2.txt);
  var chgTxt = Buffer.from(sigTxt.toString('utf8').replace(/^[0-9a-f]{64}(  app\.js)$/m, '0'.repeat(64) + '$1'));
  var s3 = await aboutSig({ '/SIGNATURE-KVES.txt': chgTxt, '/SIGNATURE-KVES.sig': crypto7.sign(null, chgTxt, kp.privateKey).toString('base64url'), '/kves-cle-publique.txt': pubRaw.toString('base64url') });
  t('signature : fichier du site différent de celui signé : « fichiers différents »', /différents/.test(s3.txt), s3.txt);
  var kp2 = crypto7.generateKeyPairSync('ed25519'), pub2 = Buffer.from(kp2.publicKey.export({ format: 'jwk' }).x, 'base64url');
  var s4 = await aboutSig({ '/SIGNATURE-KVES.txt': sigTxt, '/SIGNATURE-KVES.sig': sigOk, '/kves-cle-publique.txt': pub2.toString('base64url') });
  t('signature : signature faite avec une autre clé que celle publiée : « invalide »', /invalide/.test(s4.txt), s4.txt);
  /* outil privé de signature : création de clé, signature, vérification indépendante avec Node */
  var tool = path.join(root, 'outils', 'SIGNER-KVES.html');
  if (!fs.existsSync(tool)) { console.log('  (outil privé outils/SIGNER-KVES.html absent du dépôt : tests de l\'outil ignorés, normal)'); } else {
  if (!fs.existsSync(tool)) { console.log('(outil de signature absent de ce dossier : normal, il reste privé sur l\'ordinateur de KVES ; ses tests sont ignorés ici)'); } else {
  var ctx7 = await br.newContext({ acceptDownloads: true }), tp7 = await ctx7.newPage(), dls = {};
  tp7.on('download', async function (d) { var f = path.join(os.tmpdir(), 'dl-' + Date.now() + '-' + d.suggestedFilename()); await d.saveAs(f); dls[d.suggestedFilename()] = f; });
  await tp7.goto('file://' + tool);
  await tp7.fill('#p1', 'court'); await tp7.fill('#p2', 'court'); await tp7.click('#gen');
  t('outil de signature : phrase trop courte refusée', /10 caractères/.test(await tp7.textContent('#mg')));
  await tp7.fill('#p1', 'phrase-de-test-kves'); await tp7.fill('#p2', 'phrase-de-test-kves'); await tp7.click('#gen'); await tp7.waitForTimeout(2500);
  var keyJson = dls['KVES-cle-privee-CHIFFREE.json'], pubTxt = dls['kves-cle-publique.txt'];
  var keyStr = keyJson ? fs.readFileSync(keyJson, 'utf8') : '';
  t('outil de signature : clé créée, privée chiffrée (aucun octet de clé en clair), empreinte affichée', !!keyJson && !!pubTxt && /"kves":"cle-privee"/.test(keyStr) && keyStr.indexOf('MC4CAQAw') < 0 && /Empreinte/.test(await tp7.textContent('#mg')), Object.keys(dls));
  await tp7.setInputFiles('#kf', keyJson); await tp7.setInputFiles('#tf', path.join(root, 'SIGNATURE-KVES.txt')); await tp7.fill('#sp', 'mauvaise-phrase'); await tp7.click('#sig'); await tp7.waitForTimeout(1500);
  t('outil de signature : mauvaise phrase : aucune signature créée', /Échec/.test(await tp7.textContent('#ms')) && !dls['SIGNATURE-KVES.sig']);
  await tp7.fill('#sp', 'phrase-de-test-kves'); await tp7.click('#sig'); await tp7.waitForTimeout(2000);
  var sigFile = dls['SIGNATURE-KVES.sig'];
  var pubObj = crypto7.createPublicKey({ key: { kty: 'OKP', crv: 'Ed25519', x: fs.readFileSync(pubTxt, 'utf8').trim() }, format: 'jwk' });
  t('outil de signature : la signature produite est valide (vérifiée par Node, de façon indépendante)', !!sigFile && crypto7.verify(null, sigTxt, pubObj, Buffer.from(fs.readFileSync(sigFile, 'utf8').trim(), 'base64url')));
  var s5 = await aboutSig({ '/SIGNATURE-KVES.txt': sigTxt, '/SIGNATURE-KVES.sig': fs.readFileSync(sigFile, 'utf8'), '/kves-cle-publique.txt': fs.readFileSync(pubTxt, 'utf8') });
  t('signature : clé et signature créées par l\'outil, vérifiées par l\'application', /vérifiée/.test(s5.txt), s5.txt);
  await ctx7.close();
  }
  }
  /* 18.3 : identité visuelle KVES */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.evaluate(function () { window.__coach.setTab('more'); });
  await pg.waitForTimeout(700); await pg.evaluate(function () { document.querySelector('#modal').hidden = true; });
  var brand = await pg.evaluate(function () {
    function px(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { var c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight; var x = c.getContext('2d'); x.drawImage(i, 0, 0); var d = x.getImageData(4, 4, 1, 1).data; res([d[0], d[1], d[2]]); }; i.onerror = function () { res(null); }; i.src = src; }); }
    var logo = document.querySelector('img.klogo');
    return Promise.all([px('icon-512.png'), px('icon-192.png')]).then(function (p) { return { i512: p[0], i192: p[1], logoOk: !!logo && logo.complete && logo.naturalWidth > 0, mf: null }; });
  });
  var mf = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
  function navy(c) { return !!c && c[0] < 30 && c[1] > 40 && c[1] < 100 && c[2] > 70 && c[2] < 150; }
  t('identité : icônes aux couleurs bleu marine KVES', navy(brand.i512) && navy(brand.i192), [brand.i512, brand.i192]);
  t('identité : fond de démarrage Android = bleu KVES', mf.background_color === '#0B4471', mf.background_color);
  t('identité : logo KVES Services & Tech affiché dans À propos', brand.logoOk);
  await pg.context().close();
  /* 18.2 : couverture des traductions du programme (donnees.js) */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  var cov = await pg.evaluate(function () {
    var LD = {}, strs = {}, miss = { en: [], ar: [], ma: [] };
    window.CM_I18N(LD, function (fr, en) { var parts = fr.split(/\{\d+\}/), keys = (fr.match(/\{\d+\}/g) || []), src = '^'; parts.forEach(function (p, i) { src += p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); if (i < keys.length) src += '(.+?)'; }); return { re: new RegExp(src + '$'), en: en }; }, {});
    (function walk(o) { if (typeof o === 'string') { if (/[A-Za-zÀ-ÿ]{3,}/.test(o) && !/^[a-z][A-Za-z0-9]*$/.test(o)) strs[o] = 1; } else if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') Object.keys(o).forEach(function (k) { walk(o[k]); }); })(window.CM_DATA);
    Object.keys(strs).forEach(function (s) { ['en', 'ar', 'ma'].forEach(function (l) { var d = LD[l]; if (!(Object.prototype.hasOwnProperty.call(d.w, s) || d.p.some(function (p) { return p.re.test(s); }))) miss[l].push(s); }); });
    return { n: Object.keys(strs).length, miss: miss };
  });
  t('traductions : tout texte du programme (' + cov.n + ') est traduit en anglais, arabe et darija', cov.n > 200 && !cov.miss.en.length && !cov.miss.ar.length && !cov.miss.ma.length, [cov.miss.en.slice(0, 3), cov.miss.ar.length, cov.miss.ma.length]);
  await pg.context().close();
  /* 17.9 : export de photos chiffré */
  var jpg79 = (await (async function () { var pp = await br.newPage(); var u = await pp.evaluate(function () { var c = document.createElement('canvas'); c.width = 40; c.height = 40; var x = c.getContext('2d'); x.fillStyle = '#3a7'; x.fillRect(0, 0, 40, 40); return c.toDataURL('image/jpeg'); }); await pp.close(); return u; })());
  fs.writeFileSync('/tmp/ph179.jpg', Buffer.from(jpg79.split(',')[1], 'base64'));
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav'); await pg.waitForTimeout(700);
  await pg.evaluate(function () { document.querySelector('#modal').hidden = true; window.__coach.setTab('track'); });
  await pg.setInputFiles('[data-ph=add]', '/tmp/ph179.jpg'); await pg.waitForTimeout(1200);
  await pg.click('[data-act=phexpenc]');
  await pg.fill('#enc1', 'phrase-photos-1'); await pg.fill('#enc2', 'phrase-photos-1');
  var [dlp2] = await Promise.all([pg.waitForEvent('download', { timeout: 20000 }), pg.click('[data-act=encgo]')]);
  var ptxt = fs.readFileSync(await dlp2.path(), 'utf8'), pobj = JSON.parse(ptxt);
  t('photos chiffrées : fichier chiffré, sans image lisible', /^photos-coach-mass-chiffrees-/.test(dlp2.suggestedFilename()) && pobj.coachMasseEnc === 1 && ptxt.indexOf('data:image') < 0 && ptxt.indexOf('base64,') < 0 && ptxt.indexOf('coach-masse-photos') < 0, [dlp2.suggestedFilename(), Object.keys(pobj)]);
  fs.copyFileSync(await dlp2.path(), '/tmp/ph179.enc.json');
  await pg.context().close();
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav'); await pg.waitForTimeout(700);
  await pg.evaluate(function () { document.querySelector('#modal').hidden = true; window.__coach.setTab('track'); });
  var n0 = await pg.evaluate(function () { return document.querySelectorAll('img').length; });
  await pg.setInputFiles('[data-ph=imp]', '/tmp/ph179.enc.json'); await pg.waitForSelector('#encp');
  await pg.fill('#encp', 'mauvaise'); await pg.click('[data-act=encimpgo]'); await pg.waitForTimeout(800);
  t('photos chiffrées : mauvaise phrase refusée', /incorrecte/.test(await pg.textContent('#encmsg')));
  await pg.fill('#encp', 'phrase-photos-1'); await pg.click('[data-act=encimpgo]'); await pg.waitForTimeout(1500);
  var cnt = await pg.evaluate(function () { return new Promise(function (res) { var r = indexedDB.open('coach-masse-ph'); r.onsuccess = function () { var q = r.result.transaction('p').objectStore('p').count(); q.onsuccess = function () { res(q.result); }; }; r.onerror = function () { res(-1); }; }); });
  t('photos chiffrées : bonne phrase : photo restaurée', cnt === 1, cnt);
  await pg.context().close();
  /* 17.8 : sauvegarde chiffrée */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.evaluate(function () { var D = window.__coach.D(); D.profile.onboarded = true; D.profile.healthOk = true; D.profile.w0 = 77.7; D.profile.goal = 83.3; window.__coach.setTab('track'); });
  await pg.waitForTimeout(700); await pg.evaluate(function () { document.querySelector('#modal').hidden = true; });
  await pg.evaluate(function () { var d = document.querySelector('details[data-sec=Sauvegarde]'); if (d) d.open = true; });
  await pg.click('[data-act=exportenc]');
  await pg.fill('#enc1', 'court'); await pg.fill('#enc2', 'court'); await pg.click('[data-act=encgo]');
  t('chiffré : phrase trop courte refusée', /8 caractères/.test(await pg.textContent('#encmsg')));
  await pg.fill('#enc1', 'phrase-secrete-1'); await pg.fill('#enc2', 'phrase-secrete-2'); await pg.click('[data-act=encgo]');
  t('chiffré : phrases différentes refusées', /ne correspondent pas/.test(await pg.textContent('#encmsg')));
  await pg.fill('#enc2', 'phrase-secrete-1');
  var [dle] = await Promise.all([pg.waitForEvent('download', { timeout: 15000 }), pg.click('[data-act=encgo]')]);
  var encPath = await dle.path(), encTxt = fs.readFileSync(encPath, 'utf8'), encObj = JSON.parse(encTxt);
  t('chiffré : fichier chiffré téléchargé, sans données lisibles', /^coach-mass-kves-sauvegarde-chiffree-/.test(dle.suggestedFilename()) && encObj.coachMasseEnc === 1 && encObj.kdf === 'PBKDF2-SHA256' && encTxt.indexOf('77.7') < 0 && encTxt.indexOf('"profile"') < 0 && encTxt.indexOf('phrase-secrete') < 0, [dle.suggestedFilename(), Object.keys(encObj)]);
  var encCopy = '/tmp/enc178.json'; fs.copyFileSync(encPath, encCopy);
  await pg.context().close();
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav'); await pg.waitForTimeout(700);
  await pg.evaluate(function () { document.querySelector('#modal').hidden = true; });
  await pg.setInputFiles('#importFile', encCopy); await pg.waitForSelector('#encp');
  t('chiffré : à l\'import, la phrase est demandée', await pg.isVisible('#encp'));
  await pg.fill('#encp', 'mauvaise-phrase'); await pg.click('[data-act=encimpgo]'); await pg.waitForTimeout(800);
  t('chiffré : mauvaise phrase refusée, rien n\'est modifié', /incorrecte/.test(await pg.textContent('#encmsg')) && (await pg.evaluate(function () { return window.__coach.D().profile.w0; })) !== 77.7);
  await pg.fill('#encp', 'phrase-secrete-1'); await pg.click('[data-act=encimpgo]'); await pg.waitForTimeout(1200);
  var d79 = await pg.evaluate(function () { return window.__coach.D().profile; });
  t('chiffré : bonne phrase : données restaurées', d79.w0 === 77.7 && d79.goal === 83.3, [d79.w0, d79.goal]);
  var tampered = JSON.parse(encTxt); tampered.ct = tampered.ct.slice(0, -4) + (tampered.ct.slice(-4) === 'AAAA' ? 'BBBB' : 'AAAA'); fs.writeFileSync('/tmp/enc178b.json', JSON.stringify(tampered));
  await pg.setInputFiles('#importFile', '/tmp/enc178b.json'); await pg.waitForSelector('#encp'); await pg.fill('#encp', 'phrase-secrete-1'); await pg.click('[data-act=encimpgo]'); await pg.waitForTimeout(800);
  t('chiffré : fichier modifié détecté (intégrité)', /incorrecte|abîmé/.test(await pg.textContent('#encmsg')));
  await pg.context().close();
  /* 17.7 : tests unitaires des calculs du coaching (valeurs attendues calculées à la main) */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  var U7 = await pg.evaluate(function () {
    var c = window.__coach.calc, D = window.__coach.D(), P = D.profile, out = {};
    function ds(n) { var d = new Date(); d.setDate(d.getDate() - n); var m = d.getMonth() + 1, j = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (j < 10 ? '0' : '') + j; }
    function reset() { D.logs = {}; D.sessions = []; P.onboarded = true; P.kcalAdj = 0; P.lastAdj = ''; P.deloadOn = ''; P.deloadUntil = ''; P.deloadLast = 0; P.deloadSkip = 0; P.absSkip = ''; P.start = ds(0); P.days = []; }
    function who(g, o, age, h, w) { reset(); P.gender = g; P.obj = o; P.age = age; P.height = h; P.w0 = w; }
    function weigh(arr) { D.logs = {}; arr.forEach(function (x) { D.logs[ds(x[0])] = { weight: x[1] }; }); }
    /* métabolisme et calories */
    who('h', 'masse', 30, 175, 70);
    out.bmrH = c.bmr(); out.tdeeH = c.tdee(); out.masse = c.kcalCore(); out.protMasse = c.protTarget();
    P.obj = 'perte'; out.perte = c.kcalCore(); P.obj = 'maintien'; out.maint = c.kcalCore(); out.protMaint = c.protTarget();
    who('f', 'perte', 28, 165, 60); out.perteF = c.kcalCore(); out.tdeeF = c.tdee();
    who('h', 'masse', 20, 190, 130); out.masseMax = c.kcalCore();
    who('f', 'masse', 80, 140, 40); out.masseMin = c.kcalCore();
    who('h', 'masse', 30, 175, 70); P.kcalAdj = 300; out.targetAdj = c.kcalTarget();
    /* eau */
    who('h', 'masse', 30, 175, 70); P.days = []; out.eauRepos = c.waterTarget(); P.days = [0, 1, 2, 3, 4, 5, 6]; out.eauSeance = c.waterTarget();
    P.w0 = 40; out.eauMin = c.waterTarget(); P.w0 = 150; out.eauMax = c.waterTarget();
    /* objectif réaliste */
    out.g1 = c.goalCheck('masse', 175, 70, 95); out.g2 = c.goalCheck('masse', 175, 70, 80); out.g3 = c.goalCheck('perte', 175, 70, 50); out.g4 = c.goalCheck('perte', 0, 70, 60);
    /* pente de poids */
    who('h', 'masse', 30, 175, 70);
    weigh([[28, 70], [21, 70.2], [14, 70.4], [7, 70.6], [0, 70.8]]); out.slope = c.slopeWeek(28);
    weigh([[2, 70], [1, 70.5]]); out.slopeFew = c.slopeWeek(28);
    weigh([[8, 70], [6, 70.2], [4, 70.4], [0, 70.6]]); out.slopeShort = c.slopeWeek(28);
    /* suggestions : poids stable / trop lent / trop vite selon l'objectif */
    function flat(rate) { return [[28, 70], [21, 70 + rate], [14, 70 + 2 * rate], [7, 70 + 3 * rate], [0, 70 + 4 * rate]]; }
    who('h', 'masse', 30, 175, 70); weigh(flat(0.0125)); var q = c.suggestion(); out.sugMasseLent = q && q.v;
    weigh(flat(0.8)); q = c.suggestion(); out.sugMasseVite = q && q.v;
    weigh(flat(0.4)); out.sugMasseOk = c.suggestion();
    P.lastAdj = ds(3); weigh(flat(0.0125)); out.sugPause = c.suggestion(); P.lastAdj = '';
    who('h', 'perte', 30, 175, 70); weigh(flat(-0.05)); out.sugPerteFloor = c.suggestion();
    P.kcalAdj = 200; q = c.suggestion(); out.sugPerteLent = q && q.v;
    P.kcalAdj = 0; weigh(flat(-0.8)); q = c.suggestion(); out.sugPerteVite = q && q.v;
    who('h', 'maintien', 30, 175, 70); weigh(flat(0.5)); q = c.suggestion(); out.sugMaintHaut = q && q.v;
    weigh(flat(-0.5)); q = c.suggestion(); out.sugMaintBas = q && q.v;
    /* montée de niveau */
    reset(); D.levels = {};
    function L(id, n, reps, hi) { var a = []; for (var i = 0; i < n; i++) a.push({ id: id, name: 'x', hi: hi, sn: i + 1, reps: reps, m: true }); return a; }
    function plan(id, sets) { return [{ e: c.ex(id), sets: sets }]; }
    var ups = c.progress(plan('pompes', 3), L('pompes', 3, 12, 12));
    out.lvA = D.levels.pompes.level; out.upsA = ups[0]; out.nameA = c.ex('pompes').levels[1];
    D.levels = {}; c.progress(plan('pompes', 3), L('pompes', 2, 12, 12)); out.lvB = D.levels.pompes ? D.levels.pompes.level : 0;
    D.levels = {}; var lg = L('pompes', 3, 12, 12); lg[1].reps = 11; c.progress(plan('pompes', 3), lg); out.lvC = D.levels.pompes ? D.levels.pompes.level : 0;
    D.levels = { pompes: { level: 3, off: 0 } }; ups = c.progress(plan('pompes', 3), L('pompes', 3, 12, 12)); out.lvD = D.levels.pompes.level; out.offD = D.levels.pompes.off; out.upsD = ups[0];
    D.levels = { gainage: { level: 2, off: 0 } }; c.progress(plan('gainage', 3), L('gainage', 3, 45, 45)); out.offG = D.levels.gainage.off;
    /* records */
    reset(); D.sessions = [{ date: ds(3), logs: [{ id: 'pompes', name: 'Pompes', reps: 10, m: true }, { id: 'gainage', name: 'Gainage', reps: 40, m: true }] }];
    var pr = c.findPrs([{ id: 'pompes', name: 'Pompes', reps: 12, m: true }]); out.prN = pr.length; out.prOld = pr[0] && pr[0].old; out.prV = pr[0] && pr[0].v; out.prNx = pr[0] && pr[0].nx;
    out.prNoMeasure = c.findPrs([{ id: 'pompes', name: 'Pompes', reps: 12, m: false }]).length;
    out.prEqual = c.findPrs([{ id: 'pompes', name: 'Pompes', reps: 10, m: true }]).length;
    out.prOtherVariant = c.findPrs([{ id: 'pompes', name: 'Pompes archer', reps: 20, m: true }]).length;
    pr = c.findPrs([{ id: 'gainage', name: 'Gainage', reps: 50, m: true }]); out.prTimedNx = pr[0] && pr[0].nx;
    /* allègement et reprise */
    reset(); P.start = ds(35); out.dlLong = c.deloadDue(); out.wk6 = c.wkNo();
    reset(); out.dlNew = c.deloadDue();
    reset(); P.start = ds(14); D.sessions = [1, 2, 3].map(function (i) { return { date: ds(i), rpe: 5, logs: [] }; }); out.dlRpeHigh = c.deloadDue();
    D.sessions = [1, 2, 3].map(function (i) { return { date: ds(i), rpe: 3, logs: [] }; }); out.dlRpeLow = c.deloadDue();
    D.sessions = [1, 2, 3].map(function (i) { return { date: ds(i), rpe: 5, logs: [] }; }); P.deloadSkip = c.wkNo(); out.dlSkip = c.deloadDue();
    reset(); out.absNone = c.absenceDue();
    D.sessions = [{ date: ds(12), logs: [] }]; out.abs12 = c.absenceDue();
    D.sessions = [{ date: ds(5), logs: [] }]; out.abs5 = c.absenceDue();
    D.sessions = [{ date: ds(12), logs: [] }]; P.absSkip = ds(12); out.absSkipped = c.absenceDue();
    return out;
  });
  var near = function (a, b, e) { return typeof a === 'number' && Math.abs(a - b) <= (e || 0.0001); };
  t('calcul : métabolisme de base d\'un homme (70 kg, 175 cm, 30 ans) = 1648,75', near(U7.bmrH, 1648.75), U7.bmrH);
  t('calcul : dépense totale = 2308', U7.tdeeH === 2308, U7.tdeeH);
  t('calcul : calories prise de masse = 2710 (dépense + 400)', U7.masse === 2710, U7.masse);
  t('calcul : calories perte de poids = 1850 (déficit de 20 %)', U7.perte === 1850, U7.perte);
  t('calcul : calories maintien = 2310', U7.maint === 2310, U7.maint);
  t('calcul : protéines masse 125 g, maintien 110 g (70 kg)', U7.protMasse === 125 && U7.protMaint === 110, [U7.protMasse, U7.protMaint]);
  t('calcul : perte pour une femme (60 kg) = 1490, au-dessus du plancher de 1200', U7.tdeeF === 1862 && U7.perteF === 1490, [U7.tdeeF, U7.perteF]);
  t('calcul : prise de masse plafonnée à 3400 et planchée à 1600', U7.masseMax === 3400 && U7.masseMin === 1600, [U7.masseMax, U7.masseMin]);
  t('calcul : réglage de calories ajouté à la cible de masse (+300)', U7.targetAdj === 3010, U7.targetAdj);
  t('calcul : eau = 30 ml/kg, +500 les jours de séance, bornée entre 2000 et 3500', U7.eauRepos === 2100 && U7.eauSeance === 2600 && U7.eauMin === 2000 && U7.eauMax === 3500, [U7.eauRepos, U7.eauSeance, U7.eauMin, U7.eauMax]);
  t('calcul : objectif réaliste (IMC > 27 refusé, écart > 15 % refusé, bon objectif accepté)', U7.g1 !== '' && U7.g2 === '' && U7.g3 !== '' && U7.g4 === '', [U7.g1.length, U7.g2, U7.g3.length, U7.g4]);
  t('calcul : pente du poids = +0,2 kg par semaine', near(U7.slope, 0.2, 0.001), U7.slope);
  t('calcul : pente absente avec moins de 3 pesées ou moins de 10 jours', U7.slopeFew === null && U7.slopeShort === null, [U7.slopeFew, U7.slopeShort]);
  t('calcul : masse, poids qui monte trop lentement : +300 kcal', U7.sugMasseLent === 300, U7.sugMasseLent);
  t('calcul : masse, poids qui monte trop vite : -200 kcal', U7.sugMasseVite === -200, U7.sugMasseVite);
  t('calcul : masse, bon rythme : aucune suggestion', U7.sugMasseOk === null, U7.sugMasseOk);
  t('calcul : pas de nouvelle suggestion moins de 14 jours après un ajustement', U7.sugPause === null, U7.sugPause);
  t('calcul : perte, poids qui ne baisse pas : -150 kcal (jamais sous le plancher) ; qui baisse trop vite : +200 kcal', U7.sugPerteFloor === null && U7.sugPerteLent === -150 && U7.sugPerteVite === 200, [U7.sugPerteFloor, U7.sugPerteLent, U7.sugPerteVite]);
  t('calcul : maintien, poids qui monte : -150 ; qui baisse : +150', U7.sugMaintHaut === -150 && U7.sugMaintBas === 150, [U7.sugMaintHaut, U7.sugMaintBas]);
  t('calcul : montée de niveau quand toutes les séries atteignent l\'objectif', U7.lvA === 1 && U7.upsA === U7.nameA, [U7.lvA, U7.upsA]);
  t('calcul : pas de montée si une série manque ou n\'atteint pas l\'objectif', U7.lvB === 0 && U7.lvC === 0, [U7.lvB, U7.lvC]);
  t('calcul : au niveau maximum, l\'objectif augmente (+2 répétitions, +5 s en gainage)', U7.lvD === 3 && U7.offD === 2 && /objectif augmenté/.test(U7.upsD) && U7.offG === 5, [U7.lvD, U7.offD, U7.upsD, U7.offG]);
  t('calcul : record détecté (10 → 12, prochain objectif 13)', U7.prN === 1 && U7.prOld === 10 && U7.prV === 12 && U7.prNx === 13, [U7.prN, U7.prOld, U7.prV, U7.prNx]);
  t('calcul : pas de record sans mesure réelle, à égalité ou sur une autre variante', U7.prNoMeasure === 0 && U7.prEqual === 0 && U7.prOtherVariant === 0, [U7.prNoMeasure, U7.prEqual, U7.prOtherVariant]);
  t('calcul : record en gainage : prochain objectif +5 s', U7.prTimedNx === 55, U7.prTimedNx);
  t('calcul : semaine 6 après 35 jours ; allègement conseillé après 5 semaines, pas au début', U7.wk6 === 6 && U7.dlLong === true && U7.dlNew === false, [U7.wk6, U7.dlLong, U7.dlNew]);
  t('calcul : allègement si effort moyen élevé (≥ 4,5), pas s\'il est faible, pas si reporté', U7.dlRpeHigh === true && U7.dlRpeLow === false && U7.dlSkip === false, [U7.dlRpeHigh, U7.dlRpeLow, U7.dlSkip]);
  t('calcul : reprise proposée après 10 jours d\'absence, pas avant, pas si ignorée', U7.absNone === false && U7.abs12 === true && U7.abs5 === false && U7.absSkipped === false, [U7.absNone, U7.abs12, U7.abs5, U7.absSkipped]);
  await pg.context().close();
  /* 17.6 : niveau de départ */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.evaluate(function () { var D = window.__coach.D(); D.profile.onboarded = true; D.profile.healthOk = true; window.__coach.render(); });
  await pg.waitForTimeout(700); await pg.evaluate(function () { document.querySelector('#modal').hidden = true; });
  await pg.click('#nav [data-v=today]').catch(function () {});
  t('niveau : carte proposée au départ', await pg.isVisible('[data-act=lvlopen]'));
  await pg.click('[data-act=lvlopen]');
  t('niveau : la variante la plus facile est présélectionnée', (await pg.locator('#modal [data-act=lvpick].on').count()) === 8);
  await pg.click('#modal [data-act=lvpick][data-e=pompes][data-v="1"]'); await pg.click('#modal [data-act=lvpick][data-e=squats][data-v="2"]');
  await pg.click('[data-act=lvsave]'); await pg.waitForTimeout(300);
  var d78 = await pg.evaluate(function () { return JSON.parse(localStorage.getItem('coach-masse-v1')); });
  t('niveau : niveaux enregistrés', d78.levels.pompes.level === 1 && d78.levels.squats.level === 2 && (!d78.levels.tirage || d78.levels.tirage.level === 0) && /^\d{4}-/.test(d78.profile.lvlDone), d78.levels);
  t('niveau : la carte disparaît de l\'écran Aujourd\'hui', !(await pg.isVisible('#view [data-act=lvlopen]')));
  await pg.click('#nav [data-v=more]');
  t('niveau : toujours accessible depuis Plus', await pg.isVisible('#view [data-act=lvlopen]'));
  await pg.context().close();
  /* 17.5 : numéro de format des données */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  var d75 = await pg.evaluate(function () { return window.__coach.D(); });
  t('format : les données portent le numéro 1', d75.schema === 1, d75.schema);
  await pg.evaluate(function () { localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { w0: 77 }, logs: {}, sessions: [], measures: [] })); });
  await pg.reload(); await pg.waitForSelector('#nav');
  var d76 = await dataOf(pg);
  t('format : anciennes données sans numéro migrées sans perte', d76.schema === 1 && d76.profile.w0 === 77, [d76.schema, d76.profile.w0]);
  await pg.evaluate(function () { localStorage.setItem('coach-masse-v1', JSON.stringify({ schema: 99, profile: { w0: 66, futur: 'x' }, logs: {}, sessions: [], measures: [] })); });
  await pg.reload(); await pg.waitForSelector('#nav'); await pg.waitForTimeout(1300);
  var kept = await pg.evaluate(function () { return localStorage.getItem('coach-masse-v1-newer'); });
  t('format : données plus récentes : copie de sécurité gardée', !!kept && JSON.parse(kept).schema === 99 && JSON.parse(kept).profile.futur === 'x', kept);
  t('format : données plus récentes : avertissement affiché', /plus récente/.test(await pg.textContent('body')));
  await pg.evaluate(function () { localStorage.removeItem('coach-masse-v1-newer'); localStorage.removeItem('coach-masse-v1'); });
  await pg.reload(); await pg.waitForSelector('#nav');
  fs.writeFileSync('/tmp/futur75.json', JSON.stringify({ schema: 99, profile: { w0: 55 }, logs: {}, sessions: [], measures: [] }));
  await pg.click('#nav [data-v=settings]').catch(function () {});
  await pg.setInputFiles('#importFile', '/tmp/futur75.json'); await pg.waitForTimeout(500);
  var d77 = await dataOf(pg);
  t('format : import d\'une sauvegarde plus récente refusé, rien modifié', d77.profile.w0 !== 55 && /plus récente/.test(await pg.textContent('body')), d77.profile.w0);
  await pg.context().close();
  /* 17.4 : oeil sur les mots de passe */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=pinset]'); await pg.waitForTimeout(200);
  t('oeil : un bouton Voir par champ de code', (await pg.locator('#modal .eye').count()) === 2);
  await pg.fill('#pin1', '4821');
  t('oeil : champ masqué par défaut', (await pg.getAttribute('#pin1', 'type')) === 'password');
  await pg.click('#modal .eye >> nth=0');
  t('oeil : Voir affiche le code, Masquer le recache', (await pg.getAttribute('#pin1', 'type')) === 'text' && (await pg.inputValue('#pin1')) === '4821' && (await pg.textContent('#modal .eye >> nth=0')).includes('Masquer') && (await pg.getAttribute('#modal .eye >> nth=0', 'aria-pressed')) === 'true');
  await pg.click('#modal .eye >> nth=0');
  t('oeil : second clic remasque', (await pg.getAttribute('#pin1', 'type')) === 'password');
  await pg.click('[data-act=modalclose]');
  await pg.context().close();
  /* 17.3 : verrou par code */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  t('verrou : absent par défaut', !(await pg.isVisible('#lockpin')));
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=pinset]');
  await pg.fill('#pin1', '12'); await pg.fill('#pin2', '12'); await pg.click('[data-act=pinsave]');
  t('verrou : code trop court refusé', /4 à 8/.test(await pg.textContent('#pinmsg')));
  await pg.fill('#pin1', '4821'); await pg.fill('#pin2', '4822'); await pg.click('[data-act=pinsave]');
  t('verrou : codes différents refusés', /ne correspondent pas/.test(await pg.textContent('#pinmsg')));
  await pg.fill('#pin2', '4821'); await pg.click('[data-act=pinsave]'); await pg.waitForTimeout(600);
  var rec = await pg.evaluate(function () { return localStorage.getItem('coach-masse-pin-v1'); });
  t('verrou : code enregistré sous forme d\'empreinte (pas en clair)', !!rec && rec.indexOf('4821') < 0 && /"h":/.test(rec), rec);
  await pg.reload(); await pg.waitForSelector('#lockpin');
  t('verrou : écran de verrouillage à l\'ouverture', await pg.isVisible('#lockpin'));
  await pg.fill('#lockpin', '0000'); await pg.click('[data-act=lockgo]'); await pg.waitForTimeout(600);
  t('verrou : mauvais code refusé', await pg.isVisible('#lockpin') && /incorrect/.test(await pg.textContent('#lockmsg')));
  await pg.fill('#lockpin', '4821'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(600);
  t('verrou : bon code déverrouille', !(await pg.isVisible('#lockpin')));
  for (var q73 = 0; q73 < 5; q73++) { await pg.evaluate(function () { window.__coach.render(); }); }
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=locknow]');
  t('verrou : verrouiller maintenant', await pg.isVisible('#lockpin'));
  for (var f73 = 0; f73 < 5; f73++) { await pg.fill('#lockpin', '1111'); await pg.click('[data-act=lockgo]'); await pg.waitForTimeout(450); }
  await pg.fill('#lockpin', '4821'); await pg.click('[data-act=lockgo]'); await pg.waitForTimeout(500);
  t('verrou : 5 échecs déclenchent une pause (même le bon code est refusé)', await pg.isVisible('#lockpin') && /Trop d/.test(await pg.textContent('#lockmsg')));
  await pg.reload(); await pg.waitForSelector('#lockpin');
  await pg.click('[data-act=lockforgot]');
  t('verrou : code oublié demande une confirmation', /Confirmer/.test(await pg.textContent('[data-act=lockforgot]')) && await pg.isVisible('#lockpin'));
  await pg.click('[data-act=lockforgot]'); await pg.waitForTimeout(500);
  t('verrou : code oublié efface le code et déverrouille', !(await pg.isVisible('#lockpin')) && (await pg.evaluate(function () { return localStorage.getItem('coach-masse-pin-v1'); })) === null);
  await pg.context().close();
  /* 17.2 : illustrations des étirements */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=train]'); await pg.click('[data-act=start]');
  for (var z72 = 0; z72 < 12 && /Échauffement/.test(await pg.textContent('#runner')); z72++) { await pg.click('#runner [data-act=skip]'); await pg.waitForTimeout(120); }
  await pg.click('#runner [data-act=pain]'); await pg.click('#runner [data-act=painend]'); await pg.waitForTimeout(300);
  await pg.click('#runner [data-act=stretch]'); await pg.waitForTimeout(300);
  var figs72 = [];
  for (var s72 = 0; s72 < 5; s72++) {
    figs72.push(await pg.evaluate(function () { var v = document.querySelector('#runner svg.anim'); return v ? v.getAttribute('data-fig') + ':' + v.querySelectorAll('polyline.fig').length : ''; }));
    if (s72 < 4) { await pg.click('#runner [data-act=skip]'); await pg.waitForTimeout(150); }
  }
  t('étirements : une illustration différente par exercice', figs72.join('|').split('|').every(function (x, i) { return /^st(Chest|Quad|Ham|Child|Breath):[3-9]$/.test(x); }) && new Set(figs72).size === 5, figs72);
  await pg.context().close();
  /* 17.1 : mises à jour en deux temps */
  var VJ = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
  t('version.json : version cohérente avec l\'application', typeof VJ.version === 'string' && VJ.notes.length >= 1 && /\bVERSION = '/.test(fs.readFileSync(path.join(root, 'app.source.js'), 'utf8')) && fs.readFileSync(path.join(root, 'app.source.js'), 'utf8').indexOf("var VERSION = '" + VJ.version + "'") >= 0, VJ.version);
  async function uCtx() { var c = await br.newContext({ viewport: { width: 390, height: 800 }, serviceWorkers: 'allow' }); var p = await c.newPage(); p.errs = []; p.on('pageerror', function (e) { p.errs.push(e.message); }); await p.addInitScript(function () { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75 } })); }); return { c: c, p: p }; }
  async function cacheNames(p) { return (await p.evaluate(function () { return caches.keys(); })).filter(function (k) { return /^coach-masse-v/.test(k); }); }
  var U = await uCtx();
  await U.p.goto(url); await U.p.waitForSelector('#nav'); await U.p.evaluate(function () { return navigator.serviceWorker.ready.then(function () { return true; }); }); await U.p.waitForTimeout(1000);
  SWV = { cache: '99-0', version: '99.0' };
  await U.p.evaluate(function () { return navigator.serviceWorker.getRegistration().then(function (r) { return r.update(); }); });
  await U.p.waitForSelector('#modal:not([hidden])', { timeout: 8000 });
  var m1 = await U.p.textContent('#modal');
  t('mise à jour : 1re fenêtre annonce les nouveautés', m1.includes('Nouvelle version disponible') && m1.includes('Test nouveauté A') && m1.includes('99.0'), m1.slice(0, 160));
  await U.p.click('#modal [data-act=updnext]');
  var m2 = await U.p.textContent('#modal');
  t('mise à jour : 2e fenêtre propose mettre à jour ou ignorer', m2.includes('Mettre à jour et recharger') && m2.includes('Ignorer et garder cette version'), m2.slice(0, 160));
  var ctl0 = await U.p.evaluate(function () { return navigator.serviceWorker.controller && navigator.serviceWorker.controller.scriptURL; });
  await U.p.click('#modal [data-act=updignore]'); await U.p.waitForTimeout(500);
  t('mise à jour : ignorer ferme la fenêtre', await U.p.evaluate(function () { return document.querySelector('#modal').hidden; }));
  var cn1 = await cacheNames(U.p);
  t('mise à jour : ignorer garde l\'ancienne version (ancien cache toujours là, nouvelle en attente)', cn1.some(function (k) { return k.indexOf('v17-1') > 0 || /v\d+-\d+$/.test(k); }) && cn1.indexOf('coach-masse-v99-0') >= 0 && cn1.length === 2, cn1);
  await U.p.reload(); await U.p.waitForSelector('#nav'); await U.p.waitForTimeout(1200);
  t('mise à jour : après ignorer, plus de fenêtre au prochain lancement', await U.p.evaluate(function () { return document.querySelector('#modal').hidden; }));
  await U.p.click('#nav [data-v=more]');
  t('mise à jour : carte "Mise à jour disponible" dans Plus', (await U.p.textContent('#view')).includes('Mise à jour disponible'));
  await U.p.click('[data-act=updopen]'); await U.p.click('#modal [data-act=updnext]');
  await Promise.all([U.p.waitForEvent('load', { timeout: 10000 }), U.p.click('#modal [data-act=updgo]')]);
  await U.p.waitForSelector('#nav'); await U.p.waitForTimeout(800);
  var cn2 = await cacheNames(U.p);
  t('mise à jour : accepter active la nouvelle version et supprime l\'ancien cache', cn2.length === 1 && cn2[0] === 'coach-masse-v99-0', cn2);
  t('aucune erreur (17.1)', U.p.errs.length === 0, U.p.errs);
  await U.c.close(); SWV = null;
  /* même numéro de version que l'application : bascule silencieuse (cas de la première mise à jour vers 17.1) */
  var U2 = await uCtx();
  await U2.p.goto(url); await U2.p.waitForSelector('#nav'); await U2.p.evaluate(function () { return navigator.serviceWorker.ready.then(function () { return true; }); }); await U2.p.waitForTimeout(1000);
  SWV = { cache: '98-0', version: VJ.version };
  await U2.p.evaluate(function () { return navigator.serviceWorker.getRegistration().then(function (r) { return r.update(); }); });
  await U2.p.waitForTimeout(3500);
  var cn3 = await cacheNames(U2.p);
  t('mise à jour : même version = bascule silencieuse, sans fenêtre', cn3.length === 1 && cn3[0] === 'coach-masse-v98-0' && await U2.p.evaluate(function () { return document.querySelector('#modal').hidden; }), cn3);
  await U2.c.close(); SWV = null;

  /* 17.0 : politique de confidentialité alignée */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=confid]');
  var cf = await pg.textContent('#view');
  t('confidentialité : QR = adresse seulement', cf.includes('seulement l\'adresse de l\'application') && !cf.includes('contient les informations que tu choisis de partager'));
  t('confidentialité : tabac, douleurs et photos mentionnés', cf.includes('suivi du tabac') && cf.includes('douleurs') && cf.includes('photos de progression'));
  t('confidentialité : export des photos et image du bilan', cf.includes('Export des photos') && cf.includes('Image du bilan de la semaine'));
  t('confidentialité : voix du coach', cf.includes('Voix du coach') && cf.includes('synthèse vocale'));
  t('confidentialité : effacement total des photos', cf.includes('supprime aussi les photos de progression'));
  await pg.context().close();

  /* 16.9 : J'ai mal partout, accessibilité des photos */
  var xc = await br.newContext({ viewport: { width: 390, height: 800 } }), xp = await xc.newPage(); xp.errs = []; xp.on('pageerror', function (e) { xp.errs.push(e.message); });
  await xp.addInitScript(function () { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75 }, logs: {}, sessions: [] })); });
  await xp.goto(url); await xp.waitForSelector('#nav'); await xp.click('#nav [data-v=train]'); await xp.click('[data-act=start]');
  t('douleur : bouton présent pendant l\'échauffement', /Échauffement/.test(await xp.textContent('#runner')) && await xp.isVisible('#runner [data-act=pain]'));
  await xp.click('#runner [data-act=pain]');
  t('douleur : le focus va sur l\'écran d\'arrêt', await xp.evaluate(function () { return document.activeElement && document.activeElement.getAttribute('data-act') === 'painskip'; }));
  await xp.click('#runner [data-act=painskip]'); await xp.waitForTimeout(250);
  t('douleur : passer saute seulement ce mouvement d\'échauffement', /Échauffement/.test(await xp.textContent('#runner')) && !(await xp.textContent('#runner')).includes('Arrête et respire'));
  await xp.click('#runner [data-act=pain]'); await xp.click('#runner [data-act=painend]'); await xp.waitForTimeout(300);
  var xd = await dataOf(xp);
  t('douleur : échauffement noté, séance incomplète', xd.sessions.length === 1 && xd.sessions[0].partial === true && xd.sessions[0].pain.length === 2, xd.sessions);
  await xp.click('#runner [data-act=stretch]'); await xp.waitForTimeout(250);
  await xp.click('#runner [data-act=pain]'); await xp.click('#runner [data-act=painend]'); await xp.waitForTimeout(300);
  var xe = await dataOf(xp);
  t('douleur : pendant les étirements, retour à l\'écran de fin sans nouvelle séance', xe.sessions.length === 1 && xe.sessions[0].pain.length === 3 && await xp.isVisible('#runner [data-act=closerun]'), xe.sessions[0].pain);
  await xp.click('#runner [data-act=closerun]');
  await xp.click('#nav [data-v=track]');
  var pngx = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await xp.setInputFiles('[data-ph=add]', { name: 'a.png', mimeType: 'image/png', buffer: pngx }); await xp.waitForTimeout(600);
  t('photos : miniature annoncée avec sa date', await xp.evaluate(function () { var b = document.querySelector('.phth'); return !!b && /^Photo du .+/.test(b.getAttribute('aria-label') || ''); }));
  t('aucune erreur (16.9)', xp.errs.length === 0, xp.errs);
  await xc.close();

  /* 16.8 : service worker, installation tout ou rien et erreurs serveur */
  async function swCtx() { return await br.newContext({ viewport: { width: 390, height: 800 }, serviceWorkers: 'allow' }); }
  async function swReady(pg) { await pg.evaluate(function () { return navigator.serviceWorker.ready.then(function () { return true; }); }); }
  var sc = await swCtx(), sp = await sc.newPage(); sp.errs = []; sp.on('pageerror', function (e) { sp.errs.push(e.message); });
  await sp.addInitScript(function () { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75 } })); });
  await sp.goto(url); await sp.waitForSelector('#nav'); await swReady(sp); await sp.waitForTimeout(800);
  var keys1 = await sp.evaluate(function () { return caches.keys(); });
  t('sw : cache créé après installation complète', keys1.some(function (k) { return /^coach-masse-v/.test(k); }), keys1);
  BREAK = '/app.js'; await sp.reload(); await sp.waitForTimeout(1500);
  t('sw : une erreur serveur ne casse pas l\'appli (copie en cache utilisée)', (await sp.evaluate(function () { return !!window.__coach; })) && (await sp.textContent('#view')).length > 20, sp.errs);
  BREAK = null; await sc.close();
  BREAK = '/styles.css';
  var sc2 = await swCtx(), sp2 = await sc2.newPage();
  await sp2.goto(url); await sp2.waitForTimeout(2500);
  var keys2 = await sp2.evaluate(function () { return caches.keys(); });
  t('sw : installation refusée si un fichier indispensable manque (pas de cache partiel)', !keys2.some(function (k) { return /^coach-masse-v/.test(k); }), keys2);
  BREAK = null; await sp2.reload(); await sp2.waitForTimeout(2500);
  var keys3 = await sp2.evaluate(function () { return caches.keys(); });
  t('sw : installation réussie dès que les fichiers sont disponibles', keys3.some(function (k) { return /^coach-masse-v/.test(k); }), keys3);
  await sc2.close();

  /* 16.7 : séance express, effets */
  var qc = await br.newContext({ viewport: { width: 390, height: 800 } }), qp = await qc.newPage(); qp.errs = []; qp.on('pageerror', function (e) { qp.errs.push(e.message); });
  await qp.addInitScript(function () { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75, days: [0, 1, 2, 3, 4, 5, 6] }, logs: {}, sessions: [] })); });
  await qp.goto(url); await qp.waitForSelector('#nav'); await qp.click('#nav [data-v=train]'); await qp.click('[data-act=quick]');
  for (var zq = 0; zq < 12 && /Échauffement/.test(await qp.textContent('#runner')); zq++) { await qp.click('#runner [data-act=skip]'); await qp.waitForTimeout(120); }
  await qp.click('#runner [data-act=begin]'); await qp.waitForTimeout(300);
  await qp.evaluate(function () { var D = JSON.parse(localStorage.getItem('coach-masse-v1')); localStorage.setItem('coach-masse-v1', JSON.stringify(D)); });
  for (var zr = 0; zr < 40 && !(await qp.isVisible('#runner [data-act=closerun]')); zr++) {
    if (await qp.isVisible('#runner [data-act=stopwork]')) await qp.click('#runner [data-act=stopwork]');
    else if (await qp.isVisible('#runner [data-act=skip]')) await qp.click('#runner [data-act=skip]');
    else if (await qp.isVisible('#runner [data-act=begin]')) await qp.click('#runner [data-act=begin]');
    await qp.waitForTimeout(120);
  }
  var qd = await qp.textContent('#runner');
  t('express : écran de fin avec explication, sans question d\'effort', qd.includes('ne compte pas pour la montée de niveau') && !qd.includes('Effort ressenti'), qd.slice(0, 160));
  var qdata = await dataOf(qp);
  t('express : séance marquée quick et complète', qdata.sessions.length === 1 && qdata.sessions[0].quick === true && qdata.sessions[0].partial === false, qdata.sessions);
  await qp.click('#runner [data-act=closerun]'); await qp.click('#nav [data-v=today]');
  t('express : la séance complète reste proposée le même jour', await qp.isVisible('#view [data-act=start]'));
  await qp.click('#nav [data-v=history]');
  t('express : pastille dans l\'historique', (await qp.textContent('#view')).includes('express'));
  t('aucune erreur (16.7)', qp.errs.length === 0, qp.errs);
  await qc.close();

  /* 16.6 : rappel des repas et heures de repas */
  var mc = await br.newContext({ viewport: { width: 390, height: 800 } }), mp = await mc.newPage(); mp.errs = []; mp.on('pageerror', function (e) { mp.errs.push(e.message); });
  await mp.clock.install({ time: new Date(2026, 10, 21, 19, 0, 0) });
  await mp.addInitScript(function () { localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75, rmOn: true, rmW: '07:00', rmM: '18:00', mt1: '07:30', mt2: '10:30', mt3: '13:00', mt4: '16:30', mt5: '20:00' }, logs: { '2026-11-21': { weight: 75 } }, sessions: [] })); });
  await mp.goto(url); await mp.clock.runFor(3000);
  var m1 = await dataOf(mp);
  t('repas : pas de rappel à 19 h (dernier repas à 20 h)', m1.profile.rmLm !== '2026-11-21', m1.profile.rmLm);
  await mp.clock.fastForward(95 * 60 * 1000); await mp.clock.runFor(35000);
  var m2 = await dataOf(mp);
  t('repas : rappel envoyé après 20 h 30', m2.profile.rmLm === '2026-11-21', m2.profile.rmLm);
  t('aucune erreur (16.6)', mp.errs.length === 0, mp.errs);
  await mc.close();

  /* 16.5 : records justes */
  async function recRun(prevName, fix) {
    var rc = await br.newContext({ viewport: { width: 390, height: 800 } }), rp = await rc.newPage(); rp.errs = []; rp.on('pageerror', function (e) { rp.errs.push(e.message); });
    await rp.addInitScript(function (a) { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, count: false, w0: 75 }, logs: {}, sessions: [{ date: '2026-01-01', min: 20, sets: 1, partial: false, light: false, week: 1, logs: [{ id: 'pompes', name: a.pn, hi: 12, sn: 1, reps: 5 }] }] })); }, { pn: prevName });
    await rp.goto(url); await rp.waitForSelector('#nav'); await rp.click('#nav [data-v=train]');
    await rp.click('[data-ex=pompes] details.cfg >> nth=0 >> summary'); await rp.click('[data-act=exsolo][data-id=pompes]');
    await rp.click('#runner [data-act=begin]'); await rp.waitForTimeout(400);
    await rp.click('#runner [data-act=stopwork]'); await rp.waitForTimeout(300);
    if (fix) await rp.click('#runner [data-act=repp]');
    await rp.click('#runner [data-act=quit]'); await rp.click('#runner [data-act=quit]'); await rp.waitForTimeout(300);
    var tx = (await rp.textContent('#runner')).replace(/\s+/g, ''); await rc.close(); return tx;
  }
  var r1 = await recRun('Pompes', false), r2 = await recRun('Pompes', true), r3 = await recRun('Pompes pieds surélevés (chaise)', true);
  t('records : sans comptage ni correction, aucun record', !r1.includes('Nouveaurecord'), r1.slice(0, 120));
  t('records : valeur corrigée à la main = vrai record exact (13, ancien 5, objectif 14)', r2.includes('Nouveaurecord') && r2.includes('Pompes:13(5)Prochainobjectif14'), r2.slice(0, 200));
  t('records : autre variante = pas de comparaison', !r3.includes('Nouveaurecord'), r3.slice(0, 120));

  /* 16.4 : moyenne du tabac */
  var tc4 = await br.newContext({ viewport: { width: 390, height: 800 } }), tp4 = await tc4.newPage(); tp4.errs = []; tp4.on('pageerror', function (e) { tp4.errs.push(e.message); });
  await tp4.addInitScript(function () {
    if (localStorage.getItem('coach-masse-v1')) return;
    function ds(n) { var d = new Date(); d.setDate(d.getDate() - n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    var lg = {}; lg[ds(3)] = { cig: 7 };
    localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75, tabac: true, tabacFrom: ds(10) }, logs: lg, sessions: [] }));
  });
  await tp4.goto(url); await tp4.waitForSelector('#nav');
  var tt4 = await tp4.textContent('#view');
  t('tabac : jours sans saisie comptés (7 cig sur 6 jours = 1,2)', tt4.includes('1,2') && !tt4.includes('7,0'), tt4.slice(tt4.indexOf('Tabac'), tt4.indexOf('Tabac') + 120));
  t('tabac : explication affichée', tt4.includes('sans saisie compte pour 0'));
  t('tabac : date d\'activation enregistrée', !!(await dataOf(tp4)).profile.tabacFrom);
  t('aucune erreur (16.4)', tp4.errs.length === 0, tp4.errs);
  await tc4.close();

  /* 16.3 : alerte d'échec d'enregistrement */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  t('enregistrement : pas de bandeau au départ', !(await pg.$('#savefail')));
  await pg.evaluate(function () { window.__setItem = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new DOMException('full', 'QuotaExceededError'); }; });
  await pg.click('[data-act=water][data-n="250"]'); await pg.waitForTimeout(200);
  t('enregistrement : bandeau d\'alerte si le stockage échoue', await pg.isVisible('#savefail'));
  t('enregistrement : bouton de sauvegarde proposé', await pg.isVisible('#savefail [data-act=bkexport]'));
  await pg.evaluate(function () { Storage.prototype.setItem = window.__setItem; });
  await pg.click('[data-act=water][data-n="250"]'); await pg.waitForTimeout(200);
  t('enregistrement : bandeau retiré dès que ça réussit', !(await pg.$('#savefail')));
  await pg.context().close();

  /* 16.2 : effacement total et photos */
  var rc2 = await br.newContext({ viewport: { width: 390, height: 800 } }), rp2 = await rc2.newPage(); rp2.errs = []; rp2.on('pageerror', function (e) { rp2.errs.push(e.message); });
  await rp2.addInitScript(function () { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75 }, logs: {}, sessions: [] })); });
  await rp2.goto(url); await rp2.waitForSelector('#nav'); await rp2.click('#nav [data-v=track]');
  var png2 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await rp2.setInputFiles('[data-ph=add]', { name: 'a.png', mimeType: 'image/png', buffer: png2 }); await rp2.waitForTimeout(600);
  async function phCount(pp) { return await pp.evaluate(function () { return new Promise(function (r) { var q = indexedDB.open('coach-masse-ph', 1); q.onsuccess = function () { var g = q.result.transaction('p').objectStore('p').count(); g.onsuccess = function () { r(g.result); }; }; }); }); }
  t('effacement : la photo est bien enregistrée avant', (await phCount(rp2)) === 1);
  await rp2.reload(); await rp2.waitForSelector('#nav');
  await rp2.click('#nav [data-v=more]'); await rp2.click('[data-act=tab][data-v=settings]');
  await rp2.evaluate(function () { document.querySelectorAll('details').forEach(function (d) { d.open = true; }); });
  await rp2.click('[data-act=reset]'); await rp2.click('[data-act=reset]'); await rp2.waitForTimeout(600);
  t('effacement : photos supprimées sans avoir ouvert Suivi', (await phCount(rp2)) === 0);
  t('aucune erreur (16.2)', rp2.errs.length === 0, rp2.errs);
  await rc2.close();

  /* 16.0 : bilan en image */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=track]');
  t('bilan image : bouton présent', await pg.isVisible('[data-act=weekimg]'));
  t('bilan image : poids non inclus par défaut', !(await pg.isChecked('[data-wki=w]')));
  var [dlw] = await Promise.all([pg.waitForEvent('download', { timeout: 6000 }), pg.click('[data-act=weekimg]')]);
  var dlp = await dlw.path(), dsz = require('fs').statSync(dlp).size, dhd = require('fs').readFileSync(dlp).slice(1, 4).toString();
  t('bilan image : PNG téléchargé', /^bilan-semaine-\d+\.png$/.test(dlw.suggestedFilename()) && dsz > 2000 && dhd === 'PNG', [dlw.suggestedFilename(), dsz, dhd]);
  await pg.context().close();

  /* 15.9 : étirements */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=train]'); await pg.click('[data-act=start]');
  for (var z9 = 0; z9 < 12 && /Échauffement/.test(await pg.textContent('#runner')); z9++) { await pg.click('#runner [data-act=skip]'); await pg.waitForTimeout(120); }
  await pg.click('#runner [data-act=pain]'); await pg.click('#runner [data-act=painend]'); await pg.waitForTimeout(300);
  t('étirements : carte sur l\'écran de fin', await pg.isVisible('#runner [data-act=stretch]'));
  var ns0 = (await dataOf(pg)).sessions.length;
  await pg.click('#runner [data-act=stretch]'); await pg.waitForTimeout(300);
  var stt = await pg.textContent('#runner');
  t('étirements : écran d\'étirement', stt.includes('Étirements') && stt.includes('pectoraux'), stt.slice(0, 120));
  for (var zz = 0; zz < 5 && !(await pg.isVisible('#runner [data-act=closerun]')); zz++) { await pg.click('#runner [data-act=skip]'); await pg.waitForTimeout(150); }
  t('étirements : retour à l\'écran de fin sans nouvelle séance', (await pg.isVisible('#runner [data-act=closerun]')) && (await dataOf(pg)).sessions.length === ns0 && !(await pg.isVisible('#runner [data-act=stretch]')));
  await pg.click('#runner [data-act=closerun]');
  await pg.context().close();
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=train]'); await pg.click('[data-act=start]');
  for (var z8 = 0; z8 < 12 && /Échauffement/.test(await pg.textContent('#runner')); z8++) { await pg.click('#runner [data-act=skip]'); await pg.waitForTimeout(120); }
  await pg.click('#runner [data-act=pain]'); await pg.click('#runner [data-act=painend]'); await pg.waitForTimeout(300);
  var ns1 = (await dataOf(pg)).sessions.length;
  await pg.click('#runner [data-act=stretch]'); await pg.waitForTimeout(200);
  await pg.click('#runner [data-act=quit]'); await pg.click('#runner [data-act=quit]'); await pg.waitForTimeout(250);
  t('étirements : quitter ne crée pas de séance et revient à la fin', (await dataOf(pg)).sessions.length === ns1 && await pg.isVisible('#runner [data-act=closerun]'));
  await pg.context().close();

  /* 15.8 : reprise après une pause */
  async function absRun(days, extra) {
    var ac = await br.newContext({ viewport: { width: 390, height: 800 } }), ap = await ac.newPage(); ap.errs = []; ap.on('pageerror', function (e) { ap.errs.push(e.message); });
    await ap.addInitScript(function (a) {
      if (localStorage.getItem('coach-masse-v1')) return;
      var dt = new Date(); dt.setDate(dt.getDate() - a.days);
      var ds = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
      localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75, start: '2025-01-01' }, logs: {}, sessions: a.days < 0 ? [] : [{ date: ds, min: 20, sets: 4, partial: false, light: false, week: 1, logs: [{ id: 'pompes', name: 'Pompes', hi: 12, sn: 1, reps: 12 }] }] }));
    }, { days: days });
    await ap.goto(url); await ap.waitForSelector('#nav');
    return { p: ap, c: ac };
  }
  var a1 = await absRun(12), a1t = await a1.p.textContent('#view');
  t('reprise : carte après 12 jours', a1t.includes('Content de te revoir'), a1t.slice(0, 80));
  await a1.p.click('[data-act=absgo]'); d = await dataOf(a1.p);
  t('reprise : en douceur active l\'allègement 7 jours', !!d.profile.deloadUntil, d.profile.deloadUntil);
  t('reprise : carte disparue', !(await a1.p.textContent('#view')).includes('Content de te revoir'));
  await a1.c.close();
  var a2 = await absRun(12); await a2.p.click('[data-act=absskip]'); d = await dataOf(a2.p);
  t('reprise : normalement = pas d\'allègement, carte masquée', !d.profile.deloadOn && !(await a2.p.textContent('#view')).includes('Content de te revoir'));
  await a2.c.close();
  var a3 = await absRun(5);
  t('reprise : pas de carte après 5 jours', !(await a3.p.textContent('#view')).includes('Content de te revoir'));
  await a3.c.close();
  var a4 = await absRun(-1);
  t('reprise : pas de carte sans séance', !(await a4.p.textContent('#view')).includes('Content de te revoir'));
  await a4.c.close();

  /* 15.7 : bouton J'ai mal */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=train]'); await pg.click('[data-act=start]');
  for (var z7 = 0; z7 < 12 && /Échauffement/.test(await pg.textContent('#runner')); z7++) { await pg.click('#runner [data-act=skip]'); await pg.waitForTimeout(150); }
  t('douleur : bouton présent hors échauffement', await pg.isVisible('#runner [data-act=pain]'));
  await pg.click('#runner [data-act=pain]');
  t('douleur : écran d\'arrêt', (await pg.textContent('#runner')).includes('Arrête et respire'));
  await pg.click('#runner [data-act=painno]');
  t('douleur : reprendre revient à la séance', !(await pg.textContent('#runner')).includes('Arrête et respire'));
  await pg.click('#runner [data-act=pain]'); await pg.click('#runner [data-act=painskip]'); await pg.waitForTimeout(300);
  t('douleur : passer l\'exercice mène à un autre exercice', /Exercice 2\//.test(await pg.textContent('#runner')), (await pg.textContent('#runner')).slice(0, 80));
  await pg.click('#runner [data-act=pain]'); await pg.click('#runner [data-act=painend]'); await pg.waitForTimeout(300);
  var dt = await pg.textContent('#runner');
  t('douleur : fin de séance avec carte Douleur signalée', dt.includes('Douleur signalée') && dt.includes('Séance incomplète'), dt.slice(0, 160));
  d = await dataOf(pg);
  t('douleur : notée dans la séance, séance incomplète', d.sessions.length === 1 && d.sessions[0].partial === true && d.sessions[0].pain.length === 2, d.sessions);
  await pg.click('#runner [data-act=closerun]'); await pg.click('#nav [data-v=train]');
  t('douleur : rappel dans l\'onglet Séance', (await pg.textContent('#view')).includes('Douleur signalée récemment'));
  await pg.context().close();

  /* 15.6 : suivi du tabac */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  t('tabac : désactivé par défaut (aucune carte)', !(await pg.$('[data-act=cig]')));
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await pg.click('[data-set=tabac]'); await pg.click('#nav [data-v=today]');
  t('tabac : carte visible une fois activé', await pg.isVisible('[data-act=cig][data-n="1"]'));
  await pg.click('[data-act=cig][data-n="1"]'); await pg.click('[data-act=cig][data-n="1"]'); await pg.click('[data-act=cig][data-n="-1"]');
  d = await dataOf(pg); var cg = d.logs[Object.keys(d.logs)[0]];
  t('tabac : compteur 2 - 1 = 1', Object.keys(d.logs).some(function (k) { return d.logs[k].cig === 1; }), d.logs);
  await pg.click('[data-act=cig][data-n="-1"]'); await pg.click('[data-act=cig][data-n="-1"]');
  d = await dataOf(pg); t('tabac : jamais négatif', Object.keys(d.logs).every(function (k) { return !(d.logs[k].cig < 0); }));
  t('tabac : message sans jugement', (await pg.textContent('#view')).includes('sans te juger'));
  await pg.context().close();

  /* 15.5 : voix multilingue */
  async function voiceRun(lg, vfr) {
    var vc = await br.newContext({ viewport: { width: 390, height: 800 } }), vp = await vc.newPage(); vp.errs = []; vp.on('pageerror', function (e) { vp.errs.push(e.message); });
    await vp.addInitScript(function (a) {
      window.__sp = [];
      window.SpeechSynthesisUtterance = function (t) { this.text = t; };
      Object.defineProperty(window, 'speechSynthesis', { value: { speak: function (u) { window.__sp.push([u.lang, u.text]); }, cancel: function () {}, getVoices: function () { return []; } }, configurable: true });
      if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75, lang: a.lg, voice: true, voiceFr: a.vfr }, logs: {}, sessions: [] }));
    }, { lg: lg, vfr: vfr });
    await vp.goto(url); await vp.waitForSelector('#nav');
    await vp.click('#nav [data-v=train]'); await vp.click('[data-act=start]'); await vp.waitForTimeout(300);
    await vp.waitForTimeout(600);
    for (var z = 0; z < 8 && !(await vp.evaluate(function () { return window.__sp.length; })); z++) { await vp.click('#runner [data-act=skip]').catch(function () {}); await vp.waitForTimeout(400); }
    var sp = await vp.evaluate(function () { return window.__sp; });
    var er = vp.errs.slice(); await vc.close(); return { sp: sp, er: er };
  }
  var v0 = await voiceRun('fr', false), v1 = await voiceRun('en', false), v2 = await voiceRun('ar', false), v3 = await voiceRun('en', true);
  t('voix : français inchangé', v0.sp.length > 0 && v0.sp.every(function (x) { return x[0] === 'fr-FR'; }), v0.sp.slice(0, 3));
  t('voix : anglais quand l\'appli est en anglais', v1.sp.some(function (x) { return x[0] === 'en-US'; }), v1.sp.slice(0, 3));
  t('voix : arabe quand l\'appli est en arabe', v2.sp.some(function (x) { return x[0] === 'ar-SA'; }), v2.sp.slice(0, 3));
  t('voix : toujours en français si demandé', v3.sp.length > 0 && v3.sp.every(function (x) { return x[0] === 'fr-FR'; }), v3.sp.slice(0, 3));
  t('aucune erreur (15.5)', !v0.er.length && !v1.er.length && !v2.er.length && !v3.er.length, v1.er);

  /* 15.4 : photos de progression */
  var phc = await br.newContext({ viewport: { width: 390, height: 800 } }), ph = await phc.newPage(); ph.errs = []; ph.on('pageerror', function (e) { ph.errs.push(e.message); });
  await ph.addInitScript(function () { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, w0: 75 }, logs: {}, sessions: [] })); });
  await ph.goto(url); await ph.waitForSelector('#nav');
  await ph.click('#nav [data-v=track]');
  t('photos : carte présente', await ph.isVisible('#phcard'));
  var png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await ph.setInputFiles('[data-ph=add]', { name: 'a.png', mimeType: 'image/png', buffer: png }); await ph.waitForTimeout(600);
  await ph.setInputFiles('[data-ph=add]', { name: 'b.png', mimeType: 'image/png', buffer: png }); await ph.waitForTimeout(600);
  t('photos : 2 miniatures', (await ph.$$('.phth')).length === 2);
  var phb = await ph.evaluate(function () { return JSON.stringify(localStorage); });
  t('photos : rien dans le stockage des données', phb.indexOf('blob') < 0 && phb.indexOf('image/jpeg') < 0);
  await ph.click('.phth >> nth=0'); await ph.click('.phth >> nth=1');
  t('photos : comparaison Avant / Après', (await ph.textContent('.phcmp')).includes('Avant') && (await ph.textContent('.phcmp')).includes('Après'));
  await ph.reload(); await ph.waitForSelector('#nav'); await ph.click('#nav [data-v=track]'); await ph.waitForTimeout(500);
  t('photos : conservées après rechargement', (await ph.$$('.phth')).length === 2);
  await ph.click('.phth >> nth=0'); await ph.click('[data-act=phdel]'); await ph.click('[data-act=phdel]'); await ph.waitForTimeout(500);
  t('photos : suppression', (await ph.$$('.phth')).length === 1);
  t('photos : avertissement visible', (await ph.textContent('#phcard')).includes('les photos disparaissent'));
  var [phd] = await Promise.all([ph.waitForEvent('download', { timeout: 6000 }), ph.click('[data-act=phexp]')]);
  var phpath = await phd.path(), phj = JSON.parse(require('fs').readFileSync(phpath, 'utf8'));
  t('photos : export JSON valide', phj.app === 'coach-masse-photos' && phj.items.length === 1 && phj.items[0].data.indexOf('data:image/jpeg;base64,') === 0, [phd.suggestedFilename(), phj.items.length]);
  t('photos : date du dernier export', !(await ph.textContent('#phcard')).includes('Jamais exporté'));
  await ph.click('.phth >> nth=0'); await ph.click('[data-act=phdel]'); await ph.click('[data-act=phdel]'); await ph.waitForTimeout(400);
  t('photos : plus aucune photo avant import', (await ph.$$('.phth')).length === 0);
  await ph.setInputFiles('[data-ph=imp]', phpath); await ph.waitForTimeout(600);
  t('photos : import restaure la photo', (await ph.$$('.phth')).length === 1);
  await ph.setInputFiles('[data-ph=imp]', phpath); await ph.waitForTimeout(500);
  t('photos : import sans doublon', (await ph.$$('.phth')).length === 1);
  await ph.setInputFiles('[data-ph=imp]', { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"a":1}') }); await ph.waitForTimeout(300);
  t('photos : fichier invalide refusé', (await ph.$$('.phth')).length === 1);
  t('aucune erreur (15.4)', ph.errs.length === 0, ph.errs);
  await phc.close();

  /* 15.3 : séance express */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=train]');
  t('express : bouton présent', await pg.isVisible('[data-act=quick]'));
  await pg.click('[data-act=quick]');
  async function warmSkips() { var n = 0; while (n < 12 && /Échauffement/.test(await pg.textContent('#runner'))) { await pg.click('#runner [data-act=skip]'); await pg.waitForTimeout(150); n++; } return { n: n, txt: await pg.textContent('#runner') }; }
  async function closeAll() { for (var q3 = 0; q3 < 6 && await pg.isVisible('#runner'); q3++) { await pg.click('#runner [data-act=quit], #runner [data-act=closerun]'); await pg.waitForTimeout(250); } }
  var qw = await warmSkips();
  var qm = qw.txt.match(/Exercice 1\/(\d+)/);
  t('express : arrive aux exercices', !!qm && +qm[1] >= 1, qw.txt.slice(0, 100));
  await closeAll();
  await pg.click('[data-act=start]'); var fw = await warmSkips(), fm = fw.txt.match(/Exercice 1\/(\d+)/);
  t('express : échauffement plus court et pas plus d\'exercices', !!fm && !!qm && qw.n < fw.n && +qm[1] <= +fm[1], [qw.n, fw.n, qm && qm[1], fm && fm[1]]);
  await closeAll();
  await pg.context().close();

  /* 15.2 : records personnels */
  var pc = await br.newContext({ viewport: { width: 390, height: 800 } }), pp = await pc.newPage(); pp.errs = []; pp.on('pageerror', function (e) { pp.errs.push(e.message); });
  await pp.addInitScript(function () { if (!localStorage.getItem('coach-masse-v1')) localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, count: false, w0: 75 }, logs: {}, sessions: [{ date: '2026-01-01', min: 20, sets: 1, partial: false, light: false, week: 1, logs: [{ id: 'pompes', name: 'Pompes', hi: 12, sn: 1, reps: 5 }] }] })); });
  await pp.goto(url); await pp.waitForSelector('#nav');
  await pp.click('#nav [data-v=train]');
  await pp.click('[data-ex=pompes] details.cfg >> nth=0 >> summary');
  await pp.click('[data-act=exsolo][data-id=pompes]');
  await pp.click('#runner [data-act=begin]'); await pp.waitForTimeout(400);
  await pp.click('#runner [data-act=stopwork]'); await pp.waitForTimeout(300);
  await pp.click('#runner [data-act=quit]'); await pp.click('#runner [data-act=quit]'); await pp.waitForTimeout(300);
  var prt = await pp.textContent('#runner');
  t('record : sans comptage, la cible n\'est pas un record', !prt.includes('Nouveau record'), prt.slice(0, 120));
  t('aucune erreur (15.2)', pp.errs.length === 0, pp.errs);
  await pc.close();

  /* 15.1 : rappel d'eau */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  t('rappel eau : case présente', await pg.isVisible('[data-rm=water]'));
  var rc = await br.newContext({ viewport: { width: 390, height: 800 } }), rp = await rc.newPage(); rp.errs = []; rp.on('pageerror', function (e) { rp.errs.push(e.message); });
  await rp.clock.install({ time: new Date(2026, 10, 20, 14, 5, 0) });
  await rp.addInitScript(function () { localStorage.setItem('coach-masse-v1', JSON.stringify({ profile: { onboarded: true, healthOk: true, rmOn: true, rmWater: true, w0: 75 }, logs: {} })); });
  await rp.goto(url); await rp.clock.runFor(3000);
  var rtoast = await rp.textContent('body');
  t('rappel eau : prévenu à 14 h si en retard', rtoast.includes('Pense à boire'), rtoast.slice(0, 60));
  d = await dataOf(rp); t('rappel eau : un seul rappel par créneau', /#14$/.test(d.profile.rmLe || ''), d.profile.rmLe);
  await rp.clock.runFor(35000); d = await dataOf(rp); t('rappel eau : pas de répétition', /#14$/.test(d.profile.rmLe || ''));
  t('aucune erreur (15.1)', rp.errs.length === 0 && pg.errs.length === 0, rp.errs.concat(pg.errs));
  await rc.close();
  await pg.context().close();

  /* 15.0 : eau personnalisée */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.evaluate(function () { var d = JSON.parse(localStorage.getItem('coach-masse-v1')); d.profile.w0 = 75; d.profile.obj = 'masse'; localStorage.setItem('coach-masse-v1', JSON.stringify(d)); });
  await pg.reload(); await pg.waitForSelector('#nav');
  var wtxt = await pg.textContent('#view');
  t('eau : objectif calculé (pas 2,5 L fixe)', /\/ 2,(25|75) L/.test(wtxt) && wtxt.includes('30 ml par kg'), wtxt.slice(0, 60));
  await pg.click('[data-act=water][data-n="250"]'); d = await dataOf(pg);
  t('eau : +250 ml enregistré', Object.keys(d.logs).some(function (k) { return d.logs[k].water === 250; }));
  t('eau : message du coach', /Tu es dans le rythme|En retard|Objectif atteint/.test(await pg.textContent('#view')));
  t('aucune erreur (15.0)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.9 : carte Légal en liste */
  pg = await newPage(br); await pg.goto(url); await pg.click('#nav [data-v=more]');
  t('légal : 3 lignes de liste, sous À propos', await pg.evaluate(function () {
    var cs = [].slice.call(document.querySelectorAll('#view .card')), l = cs.filter(function (c) { return c.querySelector('h2') && c.querySelector('h2').textContent === 'Légal'; })[0], a = cs.filter(function (c) { return c.querySelector('h2') && c.querySelector('h2').textContent === 'À propos'; })[0];
    return !!l && !!a && l.querySelectorAll('.linkrow').length === 3 && cs.indexOf(l) > cs.indexOf(a) && !l.querySelector('.btn');
  }));
  t('aucune erreur (14.9)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.7 : dernier repas avant 20 h 30 */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=meals]'); var e0 = await pg.textContent('#view');
  t('dernier repas : 21 h 30 par défaut', e0.includes('21 h 30') && !e0.includes('20 h 30'));
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]'); await pg.check('[data-early="1"]');
  d = await dataOf(pg); t('dernier repas : option enregistrée', d.profile.early === true);
  await pg.click('#nav [data-v=meals]'); e0 = await pg.textContent('#view');
  t('dernier repas : ramené à 20 h 30', e0.includes('20 h 30') && !e0.includes('21 h 30'));
  await pg.evaluate(function () { var d = JSON.parse(localStorage.getItem('coach-masse-v1')); d.profile.mt4 = '19:00'; d.profile.mt5 = '22:30'; localStorage.setItem('coach-masse-v1', JSON.stringify(d)); });
  await pg.reload(); await pg.waitForSelector('#nav'); await pg.click('#nav [data-v=meals]'); e0 = await pg.textContent('#view');
  t('dernier repas : décale le précédent (2 h d\'écart)', e0.includes('18 h 30') && e0.includes('20 h 30'), e0.slice(0, 200));
  t('aucune erreur (14.7)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.6 : menus par objectif */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=meals]'); var mm = await pg.textContent('#view');
  t('menus : prise de masse garde ses menus riches', mm.includes('lait au chocolat') && !mm.includes('grande portion de légumes'));
  for (var ob of ['perte', 'tonif', 'maintien']) {
    await pg.evaluate(function (o) { var d = JSON.parse(localStorage.getItem('coach-masse-v1')); d.profile.obj = o; d.profile.height = 179; d.profile.w0 = 75; d.profile.goal = 75; d.profile.age = 41; d.profile.gender = 'h'; localStorage.setItem('coach-masse-v1', JSON.stringify(d)); }, ob);
    await pg.reload(); await pg.waitForSelector('#nav'); await pg.click('#nav [data-v=meals]'); mm = await pg.textContent('#view');
    t('menus : ' + ob + ' plus léger', mm.includes('légumes') && !mm.includes('lait au chocolat'), mm.slice(0, 120));
  }
  await pg.evaluate(function () { var d = JSON.parse(localStorage.getItem('coach-masse-v1')); d.profile.obj = 'perte'; d.profile.noEgg = true; d.profile.noMilk = true; d.profile.noGluten = true; d.profile.noNuts = true; d.profile.veg = true; localStorage.setItem('coach-masse-v1', JSON.stringify(d)); });
  await pg.reload(); await pg.waitForSelector('#nav'); await pg.click('#nav [data-v=meals]'); mm = await pg.textContent('#view');
  t('menus : régime strict (sans œuf, lait, gluten, noix, viande) reste complet', mm.includes('lentilles') && !mm.includes('2 œufs') && !mm.includes('Omelette') && !mm.includes('150 g de poulet') && !mm.includes('yaourt nature'), mm.slice(0, 160));
  t('aucune erreur (14.6)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.5 : fruits */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=meals]');
  t('fruits : dans les repas du jour', (await pg.textContent('#view')).includes('1 orange') && (await pg.textContent('#view')).includes('fruit de saison'));
  t('aucune erreur (14.5)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.4 : heures des repas */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  t('heures : valeurs par défaut', (await pg.inputValue('[data-mt="0"]')) === '09:30' && (await pg.inputValue('[data-mt="4"]')) === '21:30');
  await pg.fill('[data-mt="0"]', '08:00'); await pg.dispatchEvent('[data-mt="0"]', 'change');
  d = await dataOf(pg); t('heures : repas 1 modifié', d.profile.mt1 === '08:00', d.profile.mt1);
  await pg.fill('[data-mt="1"]', '08:30'); await pg.dispatchEvent('[data-mt="1"]', 'change');
  d = await dataOf(pg); t('heures : écart < 2 h refusé', d.profile.mt2 !== '08:30', d.profile.mt2);
  await pg.fill('[data-mt="4"]', '22:30'); await pg.dispatchEvent('[data-mt="4"]', 'change');
  t('heures : conseil dîner tardif', (await pg.textContent('#view')).includes('après 21 h 30'));
  await pg.click('#nav [data-v=meals]');
  t('heures : affichées dans Repas', (await pg.textContent('#view')).includes('8 h'));
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]'); await pg.click('[data-act=mtreset]');
  d = await dataOf(pg); t('heures : remises par défaut', !d.profile.mt1 && !d.profile.mt5);
  t('aucune erreur (14.4)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.3 : page Comment le programme s'adapte */
  pg = await newPage(br); await pg.goto(url); await pg.click('#nav [data-v=more]');
  await pg.click('[data-act=tab][data-v=adapt]'); var at = await pg.textContent('#view');
  t('page adaptation', at.includes('Ce qui s\'adapte automatiquement') && at.includes('Ce qui reste fixe') && at.includes('Menus : plus légers'));
  t('aucune erreur (14.3)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.2 : effort ressenti et semaine d'allègement */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.evaluate(function () {
    var d = JSON.parse(localStorage.getItem('coach-masse-v1')), n = new Date(), f = function (k) { var x = new Date(n); x.setDate(x.getDate() - k); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
    d.profile.start = f(40); d.profile.parq = 'ok';
    d.sessions = [1, 2, 3].map(function (k) { return { date: f(k), min: 40, sets: 12, partial: false, light: false, week: 6, rpe: 5, logs: [] }; });
    localStorage.setItem('coach-masse-v1', JSON.stringify(d));
  });
  await pg.reload(); await pg.waitForSelector('#nav');
  t('allègement : proposé après plusieurs semaines', (await pg.textContent('#view')).includes('Semaine d\'allègement conseillée'));
  await pg.click('[data-act=deloadon]'); d = await dataOf(pg);
  t('allègement : activé pour la semaine', d.profile.deloadOn !== '' && (await pg.textContent('#view')).includes('Semaine d\'allègement en cours'), d.profile.deloadOn);
  await pg.click('#nav [data-v=train]'); t('allègement : séance allégée', (await pg.textContent('#view')).includes('(allégée)'));
  await pg.click('#nav [data-v=today]');
  await pg.click('[data-act=deloadstop]'); d = await dataOf(pg);
  t('allègement : arrêté', d.profile.deloadOn === '');
  await pg.click('#nav [data-v=track]');
  var tt = await pg.textContent('#view');
  t('effort ressenti : moyenne dans le bilan', tt.includes('effort moy.') && tt.includes('5,0/5') && tt.includes('très dures'), tt.slice(0, 80));
  t('aucune erreur (14.2)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.1 : questionnaire de santé et garde-fou du poids */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  t('questionnaire : carte sur Aujourd\'hui', (await pg.textContent('#view')).includes('Questionnaire de santé'));
  await pg.click('[data-act=parqopen]'); await pg.click('[data-act=parqsave]'); await pg.waitForTimeout(200);
  d = await dataOf(pg); t('questionnaire : aucune case = ok', d.profile.parq === 'ok' && !(await pg.textContent('#view')).includes('Avis médical conseillé'), d.profile.parq);
  await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]'); await pg.click('[data-act=parqopen]');
  await pg.check('[data-parq="1"]'); await pg.click('[data-act=parqsave]'); await pg.waitForTimeout(200);
  t('questionnaire : une case = avis médical', (await pg.textContent('#modal')).includes('Parle à un médecin'));
  await pg.click('[data-act=modalclose]'); await pg.click('#nav [data-v=today]');
  t('questionnaire : carte avis médical', (await pg.textContent('#view')).includes('Avis médical conseillé'));
  await pg.click('[data-act=parqdone]'); d = await dataOf(pg); t('questionnaire : consulté', d.profile.parq === 'consulte');
  await pg.evaluate(function () { var d = JSON.parse(localStorage.getItem('coach-masse-v1')); d.profile.height = 179; d.profile.obj = 'masse'; d.profile.w0 = 75; d.profile.goal = 80; localStorage.setItem('coach-masse-v1', JSON.stringify(d)); });
  await pg.reload(); await pg.waitForSelector('#nav'); await pg.click('#nav [data-v=more]'); await pg.click('[data-act=tab][data-v=settings]');
  await pg.fill('[data-set=goal]', '95'); await pg.dispatchEvent('[data-set=goal]', 'change');
  d = await dataOf(pg); t('poids visé : 95 kg refusé (écart > 15 %)', d.profile.goal === 80, d.profile.goal);
  await pg.fill('[data-set=goal]', '82'); await pg.dispatchEvent('[data-set=goal]', 'change');
  d = await dataOf(pg); t('poids visé : 82 kg accepté', d.profile.goal === 82, d.profile.goal);
  t('aucune erreur (14.1)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* 14.0 : accessibilité */
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  t('a11y : main sans aria-live', (await pg.getAttribute('#view', 'aria-live')) === null);
  await pg.click('#nav [data-v=meals]');
  t('a11y : onglet actif annoncé (aria-current)', (await pg.getAttribute('#nav [data-v=meals]', 'aria-current')) === 'page' && (await pg.getAttribute('#nav [data-v=today]', 'aria-current')) === null);
  t('a11y : le titre reçoit le focus au changement d\'onglet', await pg.evaluate(function () { return document.activeElement && document.activeElement.tagName === 'H1'; }));
  await pg.evaluate(function () { window.__coach.setTab('sante'); });
  await pg.evaluate(function () { document.querySelector('#modal').hidden = true; });
  await pg.context().close();
  pg = await newPage(br); await pg.goto(url); await pg.waitForSelector('#nav');
  await pg.click('#nav [data-v=more]'); await pg.evaluate(function () { document.querySelector('#modal').innerHTML = '<div class="mbox"><button data-act="modalclose">x</button></div>'; document.querySelector('#modal').hidden = false; });
  await pg.keyboard.press('Escape');
  t('a11y : Échap ferme une fenêtre fermable', await pg.evaluate(function () { return document.querySelector('#modal').hidden; }));
  await pg.context().close();

  /* 13.9 : pages légales */
  pg = await newPage(br); await pg.goto(url); await pg.click('#nav [data-v=more]');
  for (var lg of [['sante', 'Avertissement santé', '15 pour le SAMU'], ['confid', 'Politique de confidentialité', 'loi marocaine 09-08'], ['cond', 'Conditions d\'utilisation', 'Casablanca']]) {
    await pg.click('[data-act=tab][data-v=' + lg[0] + ']'); var lt = await pg.textContent('#view');
    t('page légale ' + lg[0], lt.includes(lg[1]) && lt.toLowerCase().includes(lg[2].toLowerCase()) && lt.includes('Dernière mise à jour'));
    await pg.click('#nav [data-v=more]');
  }
  t('page Plus : carte Légal', (await pg.textContent('#view')).includes('Légal'));
  t('aucune erreur (13.9)', pg.errs.length === 0, pg.errs);
  await pg.context().close();

  /* langues : aucune phrase française ne doit rester visible en anglais ni en arabe (écrans principaux) */
  var FRW = /[éèàêçùô]|\b(le|la|les|des|du|tu|ton|ta|tes|pas|une|dans|avec|pour|séance|séries|répétitions)\b/i;
  for (var L of ['en', 'ar']) {
    pg = await newPage(br); await pg.goto(url);
    await pg.evaluate(function (l) { var d = JSON.parse(localStorage.getItem('coach-masse-v1')); d.profile.lang = l; d.profile.advOn = true; localStorage.setItem('coach-masse-v1', JSON.stringify(d)); }, L);
    await pg.reload(); await pg.waitForSelector('#nav');
    var seen = new Set();
    async function scan() { (await pg.evaluate(function () { var o = [], w = document.createTreeWalker(document.querySelector('main, #view') || document.body, NodeFilter.SHOW_TEXT), n; while ((n = w.nextNode())) { var x = n.nodeValue.trim(); if (x) o.push(x); } return o; })).forEach(function (x) { seen.add(x); }); }
    for (var tb of ['today', 'train', 'meals', 'track', 'history', 'more']) { await pg.click('#nav [data-v=' + tb + ']'); await scan(); }
    await pg.click('#nav [data-v=more]');
    for (var sub of ['settings', 'sources', 'player', 'avis', 'sante', 'confid', 'cond', 'adapt']) { await pg.click('[data-act=tab][data-v=' + sub + ']'); await scan(); await pg.click('#nav [data-v=more]'); }
    var leftFr = Array.from(seen).filter(function (x) { return FRW.test(x) && x !== 'Français'; });
    t('langue ' + L + ' : aucune phrase française restante (écrans principaux)', leftFr.length === 0, leftFr);
    await pg.context().close();
  }

  /* sauvegarde : export puis restauration sur un second appareil, données identiques */
  pg = await newPage(br); await pg.goto(url);
  await pg.evaluate(function () { var d = JSON.parse(localStorage.getItem('coach-masse-v1')); d.profile.goal = 82; d.logs = { '2026-11-10': { weight: 76.4, sleep: 7, energy: 4, water: 1500 } }; localStorage.setItem('coach-masse-v1', JSON.stringify(d)); });
  await pg.reload(); await pg.waitForTimeout(400);
  var srcData = await dataOf(pg); fs.writeFileSync(path.join(TMP, 'sauvegarde.json'), JSON.stringify(srcData));
  await pg.context().close();
  pg = await newPage(br, { onb: true }); await pg.goto(url); await pg.waitForTimeout(400);
  await pg.setInputFiles('#importFile', path.join(TMP, 'sauvegarde.json')); await pg.waitForTimeout(600);
  var dstData = await dataOf(pg);
  t('restauration : poids, journal et objectif retrouvés sur un autre appareil', dstData && dstData.profile.goal === 82 && dstData.logs['2026-11-10'] && dstData.logs['2026-11-10'].weight === 76.4, dstData && dstData.profile);
  await pg.context().close();

  await br.close(); server.close();
  console.log(ok + ' vérifications réussies, ' + fails + ' échec(s)');
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
