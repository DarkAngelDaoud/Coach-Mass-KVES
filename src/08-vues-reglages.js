function tog(key, label, hint) {
  return '<label class="meal"><input type="checkbox" data-set="' + key + '"' + (P[key] ? ' checked' : '') + '><span><b>' + label + '</b>' + (hint ? '<br><span class="small">' + hint + '</span>' : '') + '</span></label>';
}
function viewSettings() {
  var h = '<button class="btn alt sm back" data-act="tab" data-v="more">← Plus</button><h1>Réglages</h1><div class="card"><h2>Jours de séance</h2><div class="seg">' +
    [1, 2, 3, 4, 5, 6, 0].map(function (d) { return '<button data-act="day" data-d="' + d + '" class="' + (isTrainDay(d) ? 'on' : '') + '">' + JOURS[d] + '</button>'; }).join('') + '</div></div>';
  h += '<div class="card"><h2>Coach</h2>' + tog('voice', 'Voix du coach', 'Parle en français dans tes écouteurs') + tog('vib', 'Vibrations') + '<label class="f">Intensité des vibrations</label><div class="seg" role="group">' + [[1, 'Normale'], [2, 'Forte'], [3, 'Très forte']].map(function (x) { return '<button data-act="vibpow" data-v="' + x[0] + '" class="' + ((P.vibLevel || 2) === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' + tog('count', 'Compter les répétitions à voix haute', 'Le coach donne le rythme') + tog('auto', 'Enchaînement automatique', 'Mains libres : le coach relance après le repos') +
    '<div class="grid2"><label class="f">Secondes par répétition<input type="number" inputmode="numeric" min="2" max="6" data-set="tempo" value="' + P.tempo + '"></label>' +
    '<label class="f">Repos en plus (secondes)<input type="number" inputmode="numeric" min="0" max="60" step="5" data-set="restBonus" value="' + P.restBonus + '"></label></div>' +
    '<div class="row"><button class="btn alt sm" data-act="testvoice">Tester la voix</button><button class="btn alt sm" data-act="testvib">Tester la vibration</button></div></div>';
  h += '<div class="card"><h2>Signaux sonores</h2>' + tog('sound', 'Sons activés', 'Bips de fin de série, d\'exercice et de repos') + tog('metro', 'Métronome de cadence', 'Bip grave à la descente, bip aigu à la montée') + tog('warn10', 'Alerte 10 secondes avant la fin du repos') +
    '<label class="f">Volume : ' + P.vol + ' sur 10<input type="range" min="1" max="10" step="1" data-set="vol" value="' + P.vol + '" aria-label="Volume des sons"></label>' +
    '<p class="small">Teste chaque signal :</p><div class="chips">' + [['setend', 'Fin de série'], ['exend', 'Fin d\'exercice'], ['go', 'Fin du repos'], ['warn', 'Alerte 10 s'], ['count', 'Compte à rebours'], ['beat', 'Cadence'], ['fanfare', 'Fin de séance']].map(function (x) {
      return '<button class="chip" data-act="testsnd" data-v="' + x[0] + '">' + x[1] + '</button>';
    }).join('') + '</div></div>';
  h += '<div class="card"><h2>Profil et objectif</h2><div class="grid2">' +
    '<label class="f">Poids de départ (kg)<input type="number" inputmode="decimal" step="0.1" data-set="w0" value="' + P.w0 + '"></label>' +
    '<label class="f">Objectif (kg)<input type="number" inputmode="decimal" step="0.5" data-set="goal" value="' + P.goal + '"></label>' +
    '<label class="f">Date de départ<input type="text" data-set="start" value="' + P.start + '"></label></div>' +
    tog('hasBar', 'J\'ai une barre de traction', 'Ajoute les tractions au tirage') + tog('cigs', 'Suivre mes cigarettes', 'Un compteur dans le bilan du jour') + '</div>';
  h += rmCard();
  h += '<div class="card"><h2>Affichage</h2>' + themeCard() + tog('rotate', 'Forcer la rotation de l\'écran', 'À activer si l\'application reste bloquée en portrait. Elle suit alors le capteur du téléphone.') + '</div>';
  h += bkCard();
  h += '<div class="card"><h2>Données</h2><button class="btn bad sm" data-act="reset">' + (resetArmed ? 'Confirmer : tout effacer' : 'Effacer toutes les données') + '</button><p class="small">Version ' + VERSION + '</p></div>';
  return h;
}
var resetArmed = false;

function render() {
  $('#weekTag').textContent = 'Semaine ' + wkNo() + ' · ' + fmt(currentWeight()) + ' kg → ' + P.goal;
  var map = { today: viewToday, train: viewTrain, meals: viewMeals, track: viewTrack, history: viewHistory, settings: viewSettings, more: viewMore, avis: viewAvis, owner: viewOwner };
  view.innerHTML = map[tab]();
  document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === (({ avis: 'more', settings: 'more', owner: 'more' })[tab] || tab)); });
}

