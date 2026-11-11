/* ====================== rendu des onglets ====================== */
var tab = 'today';
var view = $('#view');

function nextTrainLabel() {
  var d = new Date();
  for (var i = 0; i < 8; i++) {
    var x = new Date(); x.setDate(d.getDate() + i);
    if (isTrainDay(x.getDay()) && !(i === 0 && doneToday())) return i === 0 ? 'aujourd\'hui' : (i === 1 ? 'demain' : JOURS[x.getDay()].toLowerCase());
  }
  return '—';
}

function viewToday() {
  var l = log(), m = coachMsg(), sug = suggestion();
  var energy = [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="energy" data-n="' + n + '" class="' + (+l.energy === n ? 'on' : '') + '">' + n + '</button>'; }).join('');
  var water = +l.water || 0;
  var h = '<div class="card coach"><span class="head">Le coach · ' + m[0] + '</span><p class="msg">' + m[1] + '</p></div>';
  h += bkBanner();
  if (isTrainDay(new Date().getDay()) && !doneToday()) h += '<button class="btn go" data-act="start">Lancer la séance' + (isLight() ? ' (allégée)' : '') + '</button>';
  else h += '<p class="small">Prochaine séance : ' + nextTrainLabel() + '. Tu peux en lancer une quand même dans l\'onglet Séance.</p>';
  h += '<div class="card"><h2>Bilan du jour</h2><div class="grid2">' +
    '<label class="f">Poids (kg, à jeun)<input type="number" inputmode="decimal" step="0.1" data-log="weight" value="' + (l.weight || '') + '" placeholder="' + fmt(currentWeight()) + '"></label>' +
    '<label class="f">Sommeil (heures)<input type="number" inputmode="decimal" step="0.5" data-log="sleep" value="' + (l.sleep || '') + '" placeholder="7"></label>' +
    '<label class="f">Pas (montre ou téléphone)<input type="number" inputmode="numeric" data-log="steps" value="' + (l.steps || '') + '" placeholder="6000"></label>' +
    (P.cigs ? '<label class="f">Cigarettes fumées<input type="number" inputmode="numeric" data-log="cigs" value="' + (l.cigs === undefined ? '' : l.cigs) + '" placeholder="20"></label>' : '<span></span>') +
    '</div><label class="f">Énergie (1 = à plat, 5 = au top)</label><div class="seg">' + energy + '</div></div>';
  h += '<div class="card"><div class="row"><h2 class="grow">Eau</h2><b>' + fmt(water / 1000, 2) + ' / 2,5 L</b></div><div class="bar"><i class="' + (water >= 2500 ? 'ok' : '') + '" style="width:' + Math.min(100, water / 25) + '%"></i></div>' +
    '<div class="row"><button class="btn alt sm grow" data-act="water" data-n="250">+ 250 ml</button><button class="btn alt sm" data-act="water" data-n="-250">− 250</button></div></div>';
  var eaten = eatenKcal(), tg = kcalTarget();
  h += '<div class="card"><div class="row"><h2 class="grow">Repas validés</h2><b>' + eaten + ' / ' + tg + ' kcal</b></div><div class="bar"><i class="' + (eaten >= tg * 0.95 ? 'ok' : '') + '" style="width:' + Math.min(100, eaten / tg * 100) + '%"></i></div></div>';
  if (sug) {
    h += '<div class="card"><h2>Ajustement conseillé</h2><p>' + (sug.up
      ? 'Ton poids monte de ' + fmt(sug.s, 2) + ' kg par semaine : trop lent. Ajoute 300 kcal par jour (un repas en plus avant de dormir).'
      : 'Ton poids monte de ' + fmt(sug.s, 2) + ' kg par semaine : trop vite. Retire 200 kcal par jour.') +
      '</p><div class="row"><button class="btn sm grow" data-act="adj" data-v="' + (sug.up ? 300 : -200) + '">Appliquer</button><button class="btn alt sm" data-act="adjno">Plus tard</button></div></div>';
  }
  return h;
}

function viewTrain() {
  var h = '<h1>Séance corps entier</h1><p class="small">Semaine ' + wkNo() + ' · ' + (wkNo() <= 2 ? '3 séries' : '4 séries') + ' sur les exercices principaux. Jours prévus : ' + P.days.slice().sort().map(function (d) { return JOURS[d]; }).join(', ') + '.</p>';
  h += '<button class="btn go" data-act="start">Lancer la séance' + (isLight() ? ' (allégée)' : '') + '</button>';
  h += '<div class="cards2">';
  EX.forEach(function (e) {
    var L = lv(e.id), names = levelsFor(e), li = Math.min(L.level, names.length - 1);
    var tgt = e.timed ? (e.lo + L.off) + '–' + (e.hi + L.off) + ' s' : (e.lo + L.off) + '–' + (e.hi + L.off) + ' reps';
    h += '<div class="card"><div class="row"><h3 class="grow">' + esc(names[li]) + '</h3><span class="pill on">' + tgt + '</span></div>' + animBlock(e.id) + '<p class="small">' + esc(e.tip) + '</p>' + mtHtml(e, e.hi + L.off) + '</div>';
  });
  h += '</div>';
  var last = D.sessions.slice(-5).reverse();
  if (last.length) h += '<div class="card"><h2>Dernières séances</h2><ul class="list">' + last.map(function (s) {
    return '<li><span>' + s.date + (s.free ? ' · libre' : s.partial ? ' · incomplète' : '') + '</span><span>' + (s.free ? '' : s.min + ' min · ') + s.sets + ' série' + (s.sets > 1 ? 's' : '') + '</span></li>';
  }).join('') + '</ul></div>';
  return h;
}

function viewMeals() {
  var l = log(), m = mealsList(), c = l.meals || [];
  var h = '<h1>Repas du jour</h1><p class="small">Cible : environ ' + kcalTarget() + ' kcal et 135 g de protéines. Coche chaque repas quand tu l\'as fini.</p><div class="card">';
  m.forEach(function (x, i) {
    h += '<label class="meal"><input type="checkbox" data-act="meal" data-i="' + i + '"' + (c[i] ? ' checked' : '') + '><span><span class="t">' + x.t + '</span><br>' + esc(x.x) + '</span><span class="k">' + x.k + ' kcal<br>' + x.p + ' g</span></label>';
  });
  h += '</div><div class="card"><h2>Variantes</h2><ul class="list"><li><span>Pas de poulet</span><span>4 sardines ou 200 g de lentilles</span></li><li><span>Peu d\'appétit</span><span>Bois le smoothie en plus</span></li><li><span>Budget serré</span><span>Œufs, légumineuses, sardines</span></li></ul></div>';
  h += shopCard();
  return h;
}

