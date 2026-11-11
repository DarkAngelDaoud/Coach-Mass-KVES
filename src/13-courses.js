/* liste de courses */
function qG(g) { return g >= 1000 ? (Math.round(g / 100) / 10).toString().replace('.', ',') + ' kg' : g + ' g'; }
function qL(l) { return (Math.ceil(l * 2) / 2).toString().replace('.', ',') + ' L'; }
function shopList() {
  var d = P.shopDays || 7, ex = P.kcalAdj >= 300 ? d : 0;
  var a3 = P.shopM3 === 'poulet' ? d : P.shopM3 === 'sardines' ? 0 : Math.ceil(d / 2), s3 = d - a3;
  var a5 = P.shopM5 === 'lentilles' ? d : P.shopM5 === 'pois' ? 0 : Math.ceil(d / 2), p5 = d - a5;
  var L = [
    ['oeufs', 'Œufs', String(d * 5)], ['pain', 'Pain', String(d * 3 + ex)],
    ['lait', 'Lait', qL(d * 0.55 + ex * 0.25)], ['cacao', 'Cacao en poudre (lait au chocolat)', d + ' verres'],
    ['bananes', 'Bananes', String(d * 2)], ['flocons', 'Flocons d\'avoine', qG(d * 40)],
    ['amlou', 'Amlou ou beurre de cacahuète', qG(d * 30 + ex * 15)], ['huile', 'Huile d\'olive', Math.round(d * 30 + 0) + ' ml'],
    ['yaourts', 'Yaourts', String(d)], ['riz', 'Riz', qG(d * 80)], ['legumes', 'Légumes de saison (environ)', qG(d * 200)]
  ];
  if (a3) L.push(['poulet', 'Poulet', qG(a3 * 150)]);
  if (s3) L.push(['sardines', 'Sardines', s3 * 4 + ' pièces']);
  if (a5) L.push(['lentilles', 'Lentilles sèches', qG(a5 * 60)]);
  if (p5) L.push(['pois', 'Pois chiches secs', qG(p5 * 60)]);
  return L;
}
function shopSeg(act, cur, opts) {
  return '<div class="seg" role="group">' + opts.map(function (o) { return '<button data-act="' + act + '" data-v="' + o[0] + '" class="' + (String(cur) === String(o[0]) ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>';
}
function shopCard() {
  var done = P.shopDone || {}, L = shopList(), n = 0;
  var h = '<div class="card"><h2>Liste de courses</h2><p class="small">Choisis tes variantes : la liste se calcule toute seule, d\'après les repas ci-dessus.</p>' +
    '<label class="f">Pour combien de jours</label>' + shopSeg('shopdays', P.shopDays, [[3, '3 jours'], [7, '7 jours'], [14, '14 jours']]) +
    '<label class="f">Repas de 14 h 30</label>' + shopSeg('shopm3', P.shopM3, [['poulet', 'Poulet'], ['sardines', 'Sardines'], ['mix', 'Alterné']]) +
    '<label class="f">Repas de 21 h 30</label>' + shopSeg('shopm5', P.shopM5, [['lentilles', 'Lentilles'], ['pois', 'Pois chiches'], ['mix', 'Alterné']]) + '<div class="shop">';
  L.forEach(function (x) {
    if (done[x[0]]) n++;
    h += '<label class="meal"><input type="checkbox" data-shop="' + x[0] + '"' + (done[x[0]] ? ' checked' : '') + '><span>' + esc(x[1]) + '</span><span class="k">' + esc(x[2]) + '</span></label>';
  });
  return h + '</div><p class="small">Quantités par jour : voir les repas. Légumes estimés, lentilles et pois chiches comptés secs (60 g secs pour 150 g cuits). Les prix varient : aucun coût n\'est affiché.</p>' +
    '<div class="row"><button class="btn sm grow" data-act="shopcopy">Copier la liste</button><button class="btn alt sm" data-act="shopreset">Tout décocher</button></div></div>';
}
function shopText() {
  return 'Courses (' + P.shopDays + ' jours)\n' + shopList().map(function (x) { return '- ' + x[1] + ' : ' + x[2]; }).join('\n');
}

