
/* ====================== données fixes ====================== */
var KEY = 'coach-masse-v1';
var JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

var VERSION = '8';
var WARM = [
  { l: 'Sauts légers sur place', s: 60, fig: 'jump', period: 0.9 },
  { l: 'Rotations des épaules et des hanches', s: 60, fig: 'arms', period: 2.4 },
  { l: '10 squats lents, sans effort', s: 60, fig: 'squats', period: 3 },
  { l: '10 pompes lentes, mains sur une table', s: 60, fig: 'pompes', period: 3 }
];

var EX = [
  { id: 'pompes', name: 'Pompes', lo: 8, hi: 12, rest: 60, grow: true,
    levels: ['Pompes', 'Pompes pieds surélevés (chaise)', 'Pompes pieds surélevés + descente 3 s', 'Pompes archer'],
    tip: 'Corps droit de la tête aux talons, coudes à 45°. Poitrine près du sol.',
    a: { paths: [[[30,97],[140,57]], [[140,57],[140,98]]], head: [153,48] },
    b: { paths: [[[30,97],[140,84]], [[140,84],[119,92],[140,98]]], head: [154,80] }, la: 'Haut', lb: 'Bas' },
  { id: 'squats', name: 'Squats', lo: 12, hi: 15, rest: 60, grow: true,
    levels: ['Squats', 'Squats avec sac à dos chargé', 'Squat bulgare (pied arrière sur chaise)', 'Squat bulgare + sac à dos'],
    tip: 'Talons au sol, genoux dans l\'axe des pieds. Cuisses parallèles au sol.',
    a: { paths: [[[100,98],[102,70],[100,46]], [[100,46],[100,22]], [[100,26],[126,32]], [[100,98],[116,98]]], head: [100,11] },
    b: { paths: [[[105,98],[135,74],[85,72]], [[85,72],[98,44]], [[98,48],[128,52]], [[105,98],[121,98]]], head: [103,32] }, la: 'Départ', lb: 'Bas' },
  { id: 'tirage', name: 'Tirage sous table', lo: 8, hi: 12, rest: 75, grow: true,
    levels: ['Tirage sous table, genoux fléchis', 'Tirage sous table, jambes tendues', 'Tirage sous table, pieds sur une chaise'],
    tip: 'Table très stable (teste-la). Corps gainé, tire la poitrine vers le bord.',
    a: { props: [[[100,34],[195,34]], [[190,34],[190,100]]], paths: [[[20,97],[115,72]], [[115,72],[112,36]]], head: [128,70] },
    b: { props: [[[100,34],[195,34]], [[190,34],[190,100]]], paths: [[[20,97],[115,52]], [[115,52],[124,44],[112,36]]], head: [128,46] }, la: 'Bras tendus', lb: 'Poitrine au bord' },
  { id: 'pike', name: 'Pompes pike', lo: 6, hi: 10, rest: 75, grow: false,
    levels: ['Pompes pike', 'Pompes pike pieds surélevés', 'Pompes pike pieds très surélevés'],
    tip: 'Hanches hautes en V inversé. Tête vers le sol entre les mains, puis pousse.',
    a: { paths: [[[35,98],[85,34],[125,70]], [[125,70],[130,98]]], head: [136,80] },
    b: { paths: [[[35,98],[85,38],[122,84]], [[122,84],[106,92],[130,98]]], head: [139,93] }, la: 'Haut', lb: 'Bas' },
  { id: 'fentes', name: 'Fentes marchées', lo: 10, hi: 12, rest: 60, grow: true,
    levels: ['Fentes marchées', 'Fentes marchées + sac à dos', 'Fentes marchées + sac à dos lourd'],
    tip: 'Grand pas, buste droit, genou arrière près du sol. Reps par jambe.',
    a: { paths: [[[118,98],[112,75],[105,52]], [[92,98],[98,75],[105,52]], [[105,52],[105,26]], [[105,30],[100,52]], [[118,98],[128,98]], [[92,98],[82,98]]], head: [105,14] },
    b: { paths: [[[135,98],[133,72],[105,70]], [[48,97],[72,90],[105,70]], [[105,70],[105,42]], [[105,46],[112,66]], [[135,98],[148,98]], [[48,97],[38,97]]], head: [105,30] }, la: 'Debout', lb: 'Bas de la fente' },
  { id: 'pont', name: 'Pont fessier', lo: 12, hi: 15, rest: 45, grow: false,
    levels: ['Pont fessier', 'Pont fessier sur une jambe', 'Pont une jambe, pied surélevé'],
    tip: 'Monte les hanches en serrant les fessiers, pause 1 s en haut.',
    a: { paths: [[[45,96],[95,96]], [[95,96],[125,68],[140,96]], [[45,96],[72,97]]], head: [30,90] },
    b: { paths: [[[45,96],[95,66]], [[95,66],[128,72],[140,96]], [[45,96],[72,97]]], head: [30,90] }, la: 'Départ', lb: 'Haut' },
  { id: 'mollets', name: 'Montées sur pointes', lo: 15, hi: 20, rest: 45, grow: false,
    levels: ['Montées sur pointes', 'Montées sur une jambe', 'Une jambe + sac à dos'],
    tip: 'Monte haut, pause, redescends lentement. Bord d\'une marche si possible.',
    a: { paths: [[[100,96],[100,62]], [[100,62],[100,36]], [[100,40],[104,62]], [[88,98],[112,98]]], head: [100,24] },
    b: { paths: [[[96,86],[100,52]], [[100,52],[100,26]], [[100,30],[104,52]], [[92,88],[112,98]]], head: [100,14] }, la: 'Talons au sol', lb: 'Sur les pointes' },
  { id: 'gainage', name: 'Gainage avant-bras', lo: 30, hi: 45, rest: 45, grow: false, timed: true,
    levels: ['Gainage sur les avant-bras', 'Gainage avec levée de jambe alternée', 'Gainage bras tendus, épaules qui touchent'],
    tip: 'Coudes sous les épaules, corps aligné, fessiers et ventre serrés. Respire.',
    a: { paths: [[[35,97],[130,70]], [[130,70],[128,97],[152,97]]], head: [144,62] },
    b: { paths: [[[35,97],[100,90],[130,70]], [[130,70],[128,97],[152,97]]], head: [144,62] }, la: 'À tenir', lb: 'À éviter : hanches basses', bad2: true }
];

var LEGS = [[[92,98],[98,74],[100,50]], [[108,98],[102,74],[100,50]]];
var FIG = {
  jump: { name: 'Sauts légers', la: 'Pieds joints', lb: 'Jambes et bras écartés',
    a: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[92,44],[90,58]], [[100,32],[108,44],[110,58]]], head: [100,16] },
    b: { paths: [[[78,92],[90,68],[100,46]], [[122,92],[110,68],[100,46]], [[100,46],[100,22]], [[100,28],[86,20],[76,8]], [[100,28],[114,20],[124,8]]], head: [100,12] } },
  arms: { name: 'Rotations des épaules', la: 'Bras bas', lb: 'Bras hauts',
    a: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[84,40],[70,50]], [[100,32],[116,40],[130,50]]], head: [100,16] },
    b: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[90,16],[84,2]], [[100,32],[110,16],[116,2]]], head: [100,16] } }
};
var FIGS = {};
EX.forEach(function (e) { FIGS[e.id] = e; });
Object.keys(FIG).forEach(function (k) { FIGS[k] = FIG[k]; });

var MEALS = [
  { t: '9 h 30', x: 'Omelette de 3 œufs, 1 pain, 1 c. à soupe d\'huile d\'olive, 1 verre de lait au chocolat', k: 660, p: 32 },
  { t: '12 h', x: 'Smoothie : 300 ml de lait, 2 bananes, 40 g de flocons d\'avoine, 1 c. à soupe d\'amlou ou de beurre de cacahuète', k: 650, p: 21 },
  { t: '14 h 30', x: '150 g de poulet ou 4 sardines, 80 g de riz (cru), légumes, 1 c. à soupe d\'huile d\'olive', k: 670, p: 40 },
  { t: '18 h', x: '1 pain avec 1 c. à soupe d\'amlou, 1 yaourt', k: 330, p: 12 },
  { t: '21 h 30', x: '150 g de lentilles ou de pois chiches cuits, 2 œufs, 1 pain', k: 475, p: 31 }
];
var EXTRA = { t: 'Avant de dormir', x: 'Verre de lait + 1 pain à l\'amlou (ajout de 300 kcal)', k: 300, p: 10 };
var BASE_KCAL = MEALS.reduce(function (a, m) { return a + m.k; }, 0);

