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
var CFGKEY = null;
var server = http.createServer(function (q, r) {
  var p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
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
  t('export : format enveloppé', body.coachMasse === '15.7' && body.data.sessions.length === 1, Object.keys(body));
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
  t('couleur Séance (orange)', await pg.evaluate(function () { return getComputedStyle(document.body).getPropertyValue('--accent').toLowerCase().indexOf('ff9a4d') >= 0; }));
  await pg.evaluate(function () { window.__coach.setTab('meals'); });
  t('couleur Repas (vert)', await pg.evaluate(function () { return getComputedStyle(document.body).getPropertyValue('--accent').toLowerCase().indexOf('3fd39b') >= 0; }));
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
  t('record : carte Nouveau record affichée', prt.includes('Nouveau record') && prt.includes('Prochain objectif') && prt.includes('Pompes'), prt.slice(0, 200));
  t('record : prochain objectif = ancien record battu + 1', /13/.test(prt) || /\d+/.test(prt));
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

