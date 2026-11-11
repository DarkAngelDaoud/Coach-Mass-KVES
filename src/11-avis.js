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
  var out = 'Avis reçus - Coach Masse (export du ' + today() + ')\n\n';
  OW.items.slice().reverse().forEach(function (x) {
    var d = x.data;
    if (!d) return;
    out += '[' + (d.d || x.rec.added) + '] ' + d.n + ' <' + d.e + '> | ' + TYPE_LABEL[d.t] + (d.r ? ' | note ' + d.r + '/5' : '') + ' | v' + d.a + ' | ' + d.s + ' | statut : ' + ST_LABEL[x.rec.st || 'new'] + '\n' + d.m + '\n\n';
  });
  return out;
}

/* envoi par l'utilisateur */
function avText(code) { return 'Avis pour Coach Masse (chiffré : seul le propriétaire peut le lire)\n' + code; }
function avValidate() {
  var n = AV.name.trim(), e = AV.email.trim(), m = AV.msg.trim();
  if (n.length < 2) return 'Écris ton nom.';
  if (!EMAIL_RE.test(e)) return 'Écris une adresse e-mail valide.';
  if (m.length < 5) return 'Écris ton message (5 caractères minimum).';
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
    mark(); window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent('Avis Coach Masse') + '&body=' + encodeURIComponent(text);
  } else if (via === 'wa' && CFG.whatsapp) {
    mark(); window.open('https://wa.me/' + String(CFG.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(text), '_blank');
  } else if (navigator.share) {
    navigator.share({ title: 'Avis Coach Masse', text: text }).then(mark).catch(function () {});
  } else { copyText(text); }
}

/* vues */
function backBtn() { return '<button class="btn alt sm back" data-act="tab" data-v="more">← Plus</button>'; }
function viewMore() {
  return '<h1>Plus</h1>' +
    '<div class="card"><h2>Boîte à avis</h2><p class="small">Une idée, un problème, un merci ? Ton avis est chiffré sur ton téléphone avant l\'envoi : seul le propriétaire de l\'application peut le lire.</p><button class="btn" data-act="tab" data-v="avis">Donner mon avis</button></div>' +
    '<div class="card"><h2>Réglages</h2><p class="small">Jours de séance, voix, sons, objectif de poids, rotation de l\'écran.</p><button class="btn alt" data-act="tab" data-v="settings">Ouvrir les réglages</button></div>' +
    '<div class="card"><h2>À propos</h2><p class="small">Coach Masse · version ' + VERSION + '. Tes données restent sur ton téléphone.</p><button class="btn alt sm back" data-act="tab" data-v="owner">Espace propriétaire</button></div>';
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
      (okMail ? '<a class="btn alt sm linkbtn" href="mailto:' + esc(d.e) + '?subject=' + encodeURIComponent('Re : ton avis sur Coach Masse') + '">Répondre</a>' : '') +
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
  if (a === 'owexportkey') { var rec = ownerRec(); if (rec) download('coach-masse-cle-proprietaire.json', JSON.stringify(rec), 'application/json'); return; }
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
  if (a === 'owexport') { if (OW.items) download('coach-masse-avis.txt', owReadable(), 'text/plain'); return; }
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

