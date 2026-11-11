/* ====================== coach (messages) ====================== */
function pick(a) { var d = new Date(); return a[(d.getDate() + d.getHours()) % a.length]; }
function coachMsg() {
  var l = D.logs[today()] || {}, d = new Date(), h = d.getHours(), dow = d.getDay();
  var train = isTrainDay(dow), done = doneToday(), left = kcalTarget() - eatenKcal(), miss = missedThisWeek();
  if (!l.weight && !l.sleep && !l.energy && h < 12) return ['Bilan du matin', pick(['Bilan du jour. Sommeil, énergie, poids si c\'est dimanche. Deux minutes, maintenant.', 'Pas de bilan, pas de progrès. Remplis-le avant ton premier repas.'])];
  if (done) return ['Séance faite', left > 400 ? 'Séance validée. Maintenant tu manges : il te reste environ ' + left + ' kcal. Ne saute rien.' : 'Séance validée et repas presque complets. Bien. Dors tes 7 heures.'];
  if (train) {
    if (isLight()) return ['Séance allégée', 'Tu as peu dormi ou peu d\'énergie. Séance allégée aujourd\'hui, mais elle est faite. Une série en moins, pas d\'excuses.'];
    return ['Jour de séance', pick(['Aujourd\'hui, séance. Une heure, pas de négociation. Lance-la quand tu es prêt.', 'C\'est jour de séance. Mange ta collation, mets tes écouteurs et commence.'])];
  }
  if (miss > 0) return ['Séance manquée', 'Tu as raté ' + miss + ' séance' + (miss > 1 ? 's' : '') + ' cette semaine. Rattrape-en une aujourd\'hui si tu es en forme. Sinon, tiens la prochaine sans faute.'];
  return ['Jour de récupération', pick(['Récupération. 30 minutes de marche, tes 5 repas, 2,5 litres d\'eau. Rien de plus, rien de moins.', 'Pas de séance. Le muscle se construit maintenant : mange, bois, dors.'])];
}

