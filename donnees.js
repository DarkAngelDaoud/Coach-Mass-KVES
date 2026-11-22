/* © KVES · Coach-Mass-KVES : données du programme (exercices et figures animées, repas, courses, zones, précautions).
   Fichier lisible, non minifié, chargé avant app.js. C'est le contenu à faire valider par un professionnel (sport, nutrition) avant la publication publique. */
window.CM_DATA = (function () {
'use strict';
var STRETCH = [
  { l: 'Étire les pectoraux : avant-bras contre un mur, tourne doucement le buste', s: 30, fig: 'stChest', period: 4 },
  { l: 'Étire les cuisses : debout, talon vers la fesse, une jambe puis l\'autre', s: 40, fig: 'stQuad', period: 5 },
  { l: 'Étire l\'arrière des cuisses : assis, une jambe tendue, penche-toi sans forcer', s: 40, fig: 'stHam', period: 5 },
  { l: 'Posture de l\'enfant : assis sur les talons, bras devant, dos détendu', s: 30, fig: 'stChild', period: 6 },
  { l: 'Respire lentement : cinq grandes respirations, épaules relâchées', s: 30, fig: 'stBreath', period: 6 }
];
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
    b: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[90,16],[84,2]], [[100,32],[110,16],[116,2]]], head: [100,16] } },
  stChest: { name: 'Étirement des pectoraux', la: 'Avant-bras contre le mur', lb: 'Tourne le buste',
    a: { props: [[[142,8],[142,100]]], paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[92,44],[90,58]], [[102,32],[132,32],[132,12]]], head: [100,16] },
    b: { props: [[[142,8],[142,100]]], paths: [LEGS[0], LEGS[1], [[100,50],[94,26]], [[94,32],[86,44],[84,58]], [[96,32],[132,32],[132,12]]], head: [90,16] } },
  stQuad: { name: 'Étirement des cuisses', la: 'Debout, jambes tendues', lb: 'Talon vers la fesse',
    a: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[92,44],[90,58]], [[100,32],[108,44],[110,58]]], head: [100,16] },
    b: { paths: [LEGS[0], [[100,50],[102,74],[84,62]], [[100,50],[100,26]], [[100,32],[90,46],[84,62]], [[100,32],[108,44],[110,58]]], head: [100,16] } },
  stHam: { name: 'Étirement arrière des cuisses', la: 'Assis, dos droit', lb: 'Penche-toi sans forcer',
    a: { paths: [[[60,96],[60,66]], [[60,96],[122,96]], [[122,96],[126,86]], [[60,96],[80,80],[76,96]], [[60,72],[82,82]]], head: [60,54] },
    b: { paths: [[[60,96],[84,74]], [[60,96],[122,96]], [[122,96],[126,86]], [[60,96],[80,80],[76,96]], [[84,78],[112,90],[122,92]]], head: [96,66] } },
  stChild: { name: 'Posture de l\'enfant', la: 'Assis sur les talons', lb: 'Bras devant, front vers le sol',
    a: { paths: [[[68,98],[100,98]], [[100,98],[72,86]], [[72,86],[72,50]], [[72,56],[80,74],[84,84]]], head: [72,38] },
    b: { paths: [[[68,98],[100,98]], [[100,98],[72,86]], [[72,86],[112,92]], [[108,92],[140,96],[164,97]]], head: [124,91] } },
  stBreath: { name: 'Respiration lente', la: 'Inspire, bras levés', lb: 'Expire, bras baissés',
    a: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[90,16],[84,2]], [[100,32],[110,16],[116,2]]], head: [100,16] },
    b: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[92,44],[90,58]], [[100,32],[108,44],[110,58]]], head: [100,16] } }
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

/* © KVES · Coach-Mass-KVES */
/* ====================== repas : créneaux, options adaptées, ingrédients ====================== */
/* has = ce que contient le repas (oeuf, lait, gluten, noix, viande, poisson) ; shop = quantités par jour */
var SHOPN = {
  oeufs: ['Œufs', 'n'], pain: ['Pain', 'n'], lait: ['Lait', 'L'], cacao: ['Cacao en poudre (lait au chocolat)', 'v'], bananes: ['Bananes', 'n'],
  flocons: ['Flocons d\'avoine', 'g'], amlou: ['Amlou ou beurre de cacahuète', 'g'], miel: ['Miel', 'g'], dattes: ['Dattes', 'n'], fruits: ['Fruits (orange, pomme, fruit de saison)', 'n'], huile: ['Huile d\'olive', 'ml'],
  yaourts: ['Yaourts', 'n'], riz: ['Riz', 'g'], legumes: ['Légumes de saison (environ)', 'g'], poulet: ['Poulet', 'g'], sardines: ['Sardines', 'p'],
  lentilles: ['Lentilles sèches', 'g'], pois: ['Pois chiches secs', 'g']
};
var SHOP_ORDER = ['oeufs', 'pain', 'lait', 'cacao', 'bananes', 'flocons', 'amlou', 'miel', 'dattes', 'fruits', 'huile', 'yaourts', 'riz', 'legumes', 'poulet', 'sardines', 'lentilles', 'pois'];
var SLOTS = [
  { id: 'm1', t: '9 h 30', opts: [
    { x: 'Omelette de 3 œufs, 1 pain, 1 c. à soupe d\'huile d\'olive, 1 verre de lait au chocolat, 1 orange', k: 705, p: 33, has: ['oeuf', 'gluten', 'lait'], shop: { oeufs: 3, pain: 1, huile: 15, lait: 0.25, cacao: 1, fruits: 1 } },
    { x: 'Omelette de 3 œufs, 2 bananes, 50 g de riz cuit, 1 c. à soupe d\'huile d\'olive', k: 580, p: 24, has: ['oeuf'], shop: { oeufs: 3, bananes: 2, riz: 25, huile: 15 } },
    { x: 'Flocons d\'avoine (60 g) cuits dans 250 ml de lait, 1 banane, 1 c. à soupe d\'amlou', k: 560, p: 22, has: ['lait', 'gluten', 'noix'], shop: { flocons: 60, lait: 0.25, bananes: 1, amlou: 15 } },
    { x: '1 pain, 100 g de pois chiches cuits écrasés avec 1 c. à soupe d\'huile d\'olive, 1 banane', k: 560, p: 18, has: ['gluten'], shop: { pain: 1, pois: 35, huile: 15, bananes: 1 } },
    { x: '80 g de riz (cru) cuit, 100 g de pois chiches cuits, 2 bananes, 1 c. à soupe d\'huile d\'olive', k: 640, p: 17, has: [], shop: { riz: 80, pois: 35, bananes: 2, huile: 15 } },
    { lt: 1, x: 'Omelette de 3 œufs, 1 pain, 1 fruit de saison, 1 c. à café d\'huile d\'olive', k: 480, p: 27, has: ['oeuf', 'gluten'], shop: {oeufs: 3, pain: 1, fruits: 1, huile: 5} },
    { lt: 1, x: 'Flocons d\'avoine (50 g) cuits dans 200 ml de lait, 1 pomme, 1 c. à soupe de miel', k: 420, p: 14, has: ['lait', 'gluten'], shop: {flocons: 50, lait: 0.2, fruits: 1, miel: 15} },
    { lt: 1, x: '2 yaourts nature, 40 g de flocons d\'avoine, 1 fruit de saison', k: 400, p: 20, has: ['lait', 'gluten'], shop: {yaourts: 2, flocons: 40, fruits: 1} },
    { lt: 1, x: '1 pain, 100 g de pois chiches cuits écrasés avec 1 c. à café d\'huile d\'olive, 1 orange', k: 400, p: 17, has: ['gluten'], shop: {pain: 1, pois: 35, huile: 5, fruits: 1} },
    { lt: 1, x: '60 g de riz (cru) cuit, 100 g de pois chiches cuits, 1 fruit de saison', k: 420, p: 15, has: [], shop: {riz: 60, pois: 35, fruits: 1} }
  ] },
  { id: 'm2', t: '12 h', opts: [
    { x: 'Smoothie : 300 ml de lait, 2 bananes, 40 g de flocons d\'avoine, 1 c. à soupe d\'amlou ou de beurre de cacahuète', k: 650, p: 21, has: ['lait', 'gluten', 'noix'], shop: { lait: 0.3, bananes: 2, flocons: 40, amlou: 15 } },
    { x: 'Smoothie : 300 ml de lait, 2 bananes, 40 g de flocons d\'avoine, 1 c. à soupe de miel', k: 560, p: 16, has: ['lait', 'gluten'], shop: { lait: 0.3, bananes: 2, flocons: 40, miel: 15 } },
    { x: 'Smoothie : 300 ml de lait, 2 bananes, 1 c. à soupe d\'amlou ou de beurre de cacahuète', k: 480, p: 14, has: ['lait', 'noix'], shop: { lait: 0.3, bananes: 2, amlou: 15 } },
    { x: '2 bananes écrasées avec 40 g de flocons d\'avoine et 1 c. à soupe d\'amlou, 200 ml d\'eau', k: 480, p: 9, has: ['gluten', 'noix'], shop: { bananes: 2, flocons: 40, amlou: 15 } },
    { x: '3 bananes et 2 dattes', k: 400, p: 5, has: [], shop: { bananes: 3, dattes: 2 } },
    { lt: 1, x: '1 yaourt nature, 1 fruit de saison, 2 dattes', k: 200, p: 7, has: ['lait'], shop: {yaourts: 1, fruits: 1, dattes: 2} },
    { lt: 1, x: '2 fruits de saison, 3 dattes', k: 200, p: 2, has: [], shop: {fruits: 2, dattes: 3} }
  ] },
  { id: 'm3', t: '14 h 30', pref: 'shopM3', opts: [
    { v: 'poulet', mx: '150 g de poulet ou 4 sardines, 80 g de riz (cru), légumes, 1 c. à soupe d\'huile d\'olive', x: '150 g de poulet, 80 g de riz (cru), légumes, 1 c. à soupe d\'huile d\'olive', k: 670, p: 40, has: ['viande'], shop: { poulet: 150, riz: 80, legumes: 200, huile: 15 } },
    { v: 'sardines', mx: '150 g de poulet ou 4 sardines, 80 g de riz (cru), légumes, 1 c. à soupe d\'huile d\'olive', x: '4 sardines, 80 g de riz (cru), légumes, 1 c. à soupe d\'huile d\'olive', k: 640, p: 36, has: ['poisson'], shop: { sardines: 4, riz: 80, legumes: 200, huile: 15 } },
    { v: 'lentilles', x: '200 g de lentilles cuites, 80 g de riz (cru), légumes, 1 c. à soupe d\'huile d\'olive', k: 650, p: 30, has: [], shop: { lentilles: 70, riz: 80, legumes: 200, huile: 15 } },
    { lt: 1, v: 'poulet', mx: '150 g de poulet ou 4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d\'huile d\'olive', x: '150 g de poulet, 70 g de riz (cru), grande portion de légumes, 1 c. à café d\'huile d\'olive', k: 600, p: 42, has: ['viande'], shop: {poulet: 150, riz: 70, legumes: 300, huile: 5} },
    { lt: 1, v: 'sardines', mx: '150 g de poulet ou 4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d\'huile d\'olive', x: '4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d\'huile d\'olive', k: 570, p: 37, has: ['poisson'], shop: {sardines: 4, riz: 70, legumes: 300, huile: 5} },
    { lt: 1, v: 'lentilles', x: '200 g de lentilles cuites, 70 g de riz (cru), grande portion de légumes, 1 c. à café d\'huile d\'olive', k: 580, p: 30, has: [], shop: {lentilles: 70, riz: 70, legumes: 300, huile: 5} }
  ] },
  { id: 'm4', t: '18 h', opts: [
    { x: '1 pain avec 1 c. à soupe d\'amlou, 1 yaourt, 1 fruit de saison (pomme, orange…)', k: 390, p: 13, has: ['gluten', 'noix', 'lait'], shop: { pain: 1, amlou: 15, yaourts: 1, fruits: 1 } },
    { x: '1 pain avec 1 c. à soupe de miel, 1 yaourt, 1 fruit de saison (pomme, orange…)', k: 360, p: 12, has: ['gluten', 'lait'], shop: { pain: 1, miel: 15, yaourts: 1, fruits: 1 } },
    { x: '1 yaourt, 2 bananes, 1 c. à soupe d\'amlou', k: 330, p: 11, has: ['lait', 'noix'], shop: { yaourts: 1, bananes: 2, amlou: 15 } },
    { x: '1 yaourt, 2 bananes, 2 dattes', k: 280, p: 8, has: ['lait'], shop: { yaourts: 1, bananes: 2, dattes: 2 } },
    { x: '2 bananes, 3 dattes', k: 260, p: 3, has: [], shop: { bananes: 2, dattes: 3 } },
    { lt: 1, x: '1 yaourt nature, 1 fruit de saison, 2 dattes', k: 210, p: 6, has: ['lait'], shop: {yaourts: 1, fruits: 1, dattes: 2} },
    { lt: 1, x: '1 fruit de saison, 1 pain avec 1 c. à café de miel', k: 230, p: 5, has: ['gluten'], shop: {fruits: 1, pain: 1, miel: 5} }
  ] },
  { id: 'm5', t: '21 h 30', pref: 'shopM5', opts: [
    { v: 'lentilles', mx: '150 g de lentilles ou de pois chiches cuits, 2 œufs, 1 pain', x: '150 g de lentilles cuites, 2 œufs, 1 pain', k: 475, p: 31, has: ['oeuf', 'gluten'], shop: { lentilles: 60, oeufs: 2, pain: 1 } },
    { v: 'pois', mx: '150 g de lentilles ou de pois chiches cuits, 2 œufs, 1 pain', x: '150 g de pois chiches cuits, 2 œufs, 1 pain', k: 475, p: 31, has: ['oeuf', 'gluten'], shop: { pois: 60, oeufs: 2, pain: 1 } },
    { v: 'lentilles', mx: '150 g de lentilles ou de pois chiches cuits, 2 œufs, 60 g de riz (cru)', x: '150 g de lentilles cuites, 2 œufs, 60 g de riz (cru)', k: 520, p: 29, has: ['oeuf'], shop: { lentilles: 60, oeufs: 2, riz: 60 } },
    { v: 'pois', mx: '150 g de lentilles ou de pois chiches cuits, 2 œufs, 60 g de riz (cru)', x: '150 g de pois chiches cuits, 2 œufs, 60 g de riz (cru)', k: 520, p: 29, has: ['oeuf'], shop: { pois: 60, oeufs: 2, riz: 60 } },
    { v: 'lentilles', mx: '200 g de lentilles ou de pois chiches cuits, 1 pain, 1 yaourt', x: '200 g de lentilles cuites, 1 pain, 1 yaourt', k: 460, p: 26, has: ['gluten', 'lait'], shop: { lentilles: 70, pain: 1, yaourts: 1 } },
    { v: 'pois', mx: '200 g de lentilles ou de pois chiches cuits, 1 pain, 1 yaourt', x: '200 g de pois chiches cuits, 1 pain, 1 yaourt', k: 460, p: 26, has: ['gluten', 'lait'], shop: { pois: 70, pain: 1, yaourts: 1 } },
    { v: 'lentilles', mx: '200 g de lentilles ou de pois chiches cuits, 60 g de riz (cru), 1 c. à soupe d\'huile d\'olive', x: '200 g de lentilles cuites, 60 g de riz (cru), 1 c. à soupe d\'huile d\'olive', k: 560, p: 24, has: [], shop: { lentilles: 70, riz: 60, huile: 15 } },
    { v: 'pois', mx: '200 g de lentilles ou de pois chiches cuits, 60 g de riz (cru), 1 c. à soupe d\'huile d\'olive', x: '200 g de pois chiches cuits, 60 g de riz (cru), 1 c. à soupe d\'huile d\'olive', k: 560, p: 24, has: [], shop: { pois: 70, riz: 60, huile: 15 } },
    { lt: 1, v: 'lentilles', mx: '150 g de lentilles ou de pois chiches cuits, 2 œufs, grande portion de légumes', x: '150 g de lentilles cuites, 2 œufs, grande portion de légumes', k: 400, p: 30, has: ['oeuf'], shop: {lentilles: 60, oeufs: 2, legumes: 200} },
    { lt: 1, v: 'pois', mx: '150 g de lentilles ou de pois chiches cuits, 2 œufs, grande portion de légumes', x: '150 g de pois chiches cuits, 2 œufs, grande portion de légumes', k: 400, p: 30, has: ['oeuf'], shop: {pois: 60, oeufs: 2, legumes: 200} },
    { lt: 1, v: 'lentilles', mx: '200 g de lentilles ou de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d\'huile d\'olive', x: '200 g de lentilles cuites, 1 yaourt, grande portion de légumes, 1 c. à café d\'huile d\'olive', k: 420, p: 22, has: ['lait'], shop: {lentilles: 70, yaourts: 1, legumes: 200, huile: 5} },
    { lt: 1, v: 'pois', mx: '200 g de lentilles ou de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d\'huile d\'olive', x: '200 g de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d\'huile d\'olive', k: 420, p: 22, has: ['lait'], shop: {pois: 70, yaourts: 1, legumes: 200, huile: 5} },
    { lt: 1, v: 'lentilles', mx: '200 g de lentilles ou de pois chiches cuits, 60 g de riz (cru), grande portion de légumes', x: '200 g de lentilles cuites, 60 g de riz (cru), grande portion de légumes', k: 480, p: 20, has: [], shop: {lentilles: 70, riz: 60, legumes: 200} },
    { lt: 1, v: 'pois', mx: '200 g de lentilles ou de pois chiches cuits, 60 g de riz (cru), grande portion de légumes', x: '200 g de pois chiches cuits, 60 g de riz (cru), grande portion de légumes', k: 480, p: 20, has: [], shop: {pois: 70, riz: 60, legumes: 200} }
  ] }
];
var EXTRA_OPTS = [
  { x: 'Verre de lait + 1 pain à l\'amlou (ajout de 300 kcal)', k: 300, p: 10, has: ['lait', 'gluten', 'noix'], shop: { lait: 0.25, pain: 1, amlou: 15 } },
  { x: '2 bananes et 4 dattes (ajout de 300 kcal)', k: 300, p: 4, has: [], shop: { bananes: 2, dattes: 4 } }
];
/* © KVES · Coach-Mass-KVES */
/* ====================== zones du corps, muscles, exercices ajoutés en V12 ====================== */
var ZONES = [
  { id: 'pec', name: 'Pectoraux' }, { id: 'epa', name: 'Épaules' }, { id: 'dos', name: 'Dos' }, { id: 'bra', name: 'Bras' },
  { id: 'abs', name: 'Abdominaux' }, { id: 'jam', name: 'Jambes' }, { id: 'fes', name: 'Fessiers et mollets' }
];
var MUSCLE_NAMES = { chest: 'pectoraux', shoulders: 'épaules', biceps: 'biceps', triceps: 'triceps', abs: 'abdominaux', back: 'dos', lowback: 'lombaires', glutes: 'fessiers', quads: 'cuisses', hams: 'arrière des cuisses', calves: 'mollets' };
/* exercices d'origine : zone + muscles ; core = dans la séance complète d'office */
var META = {
  pompes: ['pec', ['chest', 'triceps', 'shoulders']], squats: ['jam', ['quads', 'glutes']], tirage: ['dos', ['back', 'biceps']],
  pike: ['epa', ['shoulders', 'triceps']], fentes: ['jam', ['quads', 'glutes']], pont: ['fes', ['glutes', 'hams']],
  mollets: ['fes', ['calves']], gainage: ['abs', ['abs', 'shoulders', 'lowback']]
};
EX.forEach(function (e) { e.zone = META[e.id][0]; e.mus = META[e.id][1]; e.core = true; });

EX.push(
  { id: 'diamant', name: 'Pompes diamant', lo: 6, hi: 10, rest: 75, grow: false, adv: true, zone: 'pec', mus: ['triceps', 'chest', 'shoulders'],
    levels: ['Pompes diamant', 'Pompes diamant pieds surélevés (chaise)', 'Pompes diamant + descente 3 s'],
    tip: 'Mains rapprochées sous la poitrine, pouces et index en losange. Coudes près du corps. Exercice avancé : arrête-toi si le poignet ou le coude tire.',
    a: { paths: [[[30,97],[140,57]], [[140,57],[140,98]]], head: [153,48] },
    b: { paths: [[[30,97],[140,84]], [[140,84],[126,90],[140,98]]], head: [154,80] }, la: 'Haut', lb: 'Bas' },
  { id: 'inclinees', name: 'Pompes inclinées (mains sur une chaise)', lo: 10, hi: 15, rest: 60, grow: false, zone: 'pec', mus: ['chest', 'triceps', 'shoulders'],
    levels: ['Pompes mains sur une chaise', 'Pompes mains sur une table', 'Pompes mains sur une chaise, descente 3 s'],
    tip: 'Chaise bloquée contre un mur. Corps droit, poitrine vers le bord de la chaise. Plus la prise est haute, plus c\'est facile.',
    a: { props: [[[126,72],[172,72]], [[166,72],[166,100]]], paths: [[[30,97],[132,48]], [[132,48],[136,72]]], head: [145,40] },
    b: { props: [[[126,72],[172,72]], [[166,72],[166,100]]], paths: [[[30,97],[134,64]], [[134,64],[118,70],[136,72]]], head: [147,58] }, la: 'Haut', lb: 'Poitrine près de la chaise' },
  { id: 'lateral', name: 'Élévations latérales (sac à dos)', lo: 10, hi: 15, rest: 60, grow: false, zone: 'epa', mus: ['shoulders'],
    levels: ['Élévations latérales, sac à dos léger', 'Élévations latérales, sac à dos chargé', 'Élévations latérales, descente 4 s'],
    tip: 'Tiens le sac à dos par ses sangles, bras presque tendus. Monte jusqu\'à l\'horizontale, pas plus haut. Pas d\'élan.',
    a: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[93,48],[92,62]], [[100,32],[107,48],[108,62]]], head: [100,16] },
    b: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[84,32],[68,34]], [[100,32],[116,32],[132,34]]], head: [100,16] }, la: 'Bras le long du corps', lb: 'Bras à l\'horizontale' },
  { id: 'superman', name: 'Superman', lo: 10, hi: 15, rest: 45, grow: false, zone: 'dos', mus: ['lowback', 'back', 'glutes'],
    levels: ['Superman, pause 1 s', 'Superman, pause 3 s', 'Superman en nageur (bras et jambes alternés)'],
    tip: 'Allongé sur le ventre, lève bras et jambes en même temps, regard au sol. Monte sans cambrer fort, redescends lentement.',
    a: { paths: [[[95,97],[30,97]], [[95,97],[140,97]], [[140,97],[178,97]]], head: [150,91] },
    b: { paths: [[[95,96],[30,84]], [[95,96],[140,80]], [[140,80],[178,66]]], head: [150,74] }, la: 'À plat', lb: 'Bras et jambes levés' },
  { id: 'rowing', name: 'Rowing au sol avec serviette', lo: 8, hi: 12, rest: 75, grow: false, zone: 'dos', mus: ['back', 'biceps'],
    levels: ['Rowing au sol, genoux fléchis', 'Rowing au sol, jambes tendues', 'Rowing au sol, tirage plus lent'],
    tip: 'ATTENTION : fixe la serviette à un point TRÈS solide (porte fermée à clé, serviette coincée). Au moindre doute, ne fais pas cet exercice. Tire en serrant les omoplates.',
    a: { props: [[[176,60],[176,100]]], paths: [[[50,97],[70,72],[92,97]], [[92,97],[136,97]], [[136,97],[170,92]]], head: [148,92] },
    b: { props: [[[176,60],[176,100]]], paths: [[[50,97],[70,72],[92,97]], [[92,97],[132,97]], [[132,97],[150,82],[140,72]]], head: [144,92] }, la: 'Bras tendus', lb: 'Coudes en arrière' },
  { id: 'dips', name: 'Dips sur chaise', lo: 6, hi: 10, rest: 75, grow: false, adv: true, zone: 'bra', mus: ['triceps', 'chest', 'shoulders'],
    levels: ['Dips sur chaise, genoux fléchis', 'Dips sur chaise, jambes tendues', 'Dips, pieds surélevés'],
    tip: 'Chaise bloquée contre un mur. Descends seulement à 90° aux coudes, épaules loin des oreilles. Exercice avancé : stoppe au moindre pincement à l\'épaule.',
    a: { props: [[[112,74],[162,74]], [[156,74],[156,100]]], paths: [[[48,97],[90,84]], [[90,84],[120,52]], [[120,52],[120,74]]], head: [124,40] },
    b: { props: [[[112,74],[162,74]], [[156,74],[156,100]]], paths: [[[48,98],[90,96]], [[90,96],[120,72]], [[120,72],[136,78],[120,74]]], head: [122,60] }, la: 'Bras tendus', lb: 'Coudes à 90°' },
  { id: 'curl', name: 'Curl biceps avec sac à dos', lo: 10, hi: 15, rest: 60, grow: false, zone: 'bra', mus: ['biceps'],
    levels: ['Curl, sac à dos léger', 'Curl, sac à dos chargé', 'Curl, montée 1 s et descente 4 s'],
    tip: 'Coudes collés au corps, sac à dos tenu par la sangle. Monte sans balancer le buste, redescends lentement.',
    a: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[102,48],[104,64]]], head: [100,16] },
    b: { paths: [LEGS[0], LEGS[1], [[100,50],[100,26]], [[100,32],[104,48],[116,38]]], head: [100,16] }, la: 'Bras tendu', lb: 'Bras fléchi' },
  { id: 'crunch', name: 'Crunchs', lo: 12, hi: 20, rest: 45, grow: false, zone: 'abs', mus: ['abs'],
    levels: ['Crunchs, mains sur les cuisses', 'Crunchs, mains derrière la tête', 'Crunchs, pause 2 s en haut'],
    tip: 'Dos au sol, genoux fléchis. Décolle seulement les épaules en expirant, sans tirer sur la nuque.',
    a: { paths: [[[50,97],[68,70],[92,97]], [[92,97],[140,97]], [[140,97],[150,90]]], head: [150,92] },
    b: { paths: [[[50,97],[68,70],[92,97]], [[92,97],[132,86]], [[132,86],[142,78]]], head: [140,76] }, la: 'Allongé', lb: 'Épaules décollées' },
  { id: 'releves', name: 'Relevés de jambes', lo: 10, hi: 15, rest: 45, grow: false, zone: 'abs', mus: ['abs'],
    levels: ['Relevés de jambes fléchies', 'Relevés de jambes tendues', 'Relevés de jambes tendues, descente 4 s'],
    tip: 'Mains sous les fessiers, bas du dos plaqué au sol. Descends sans toucher le sol. Si le dos se creuse, fléchis les genoux.',
    a: { paths: [[[96,96],[34,96]], [[96,96],[150,96]]], head: [160,92] },
    b: { paths: [[[96,96],[96,40]], [[96,96],[150,96]]], head: [160,92] }, la: 'Jambes basses', lb: 'Jambes à la verticale' },
  { id: 'mountain', name: 'Mountain climbers', lo: 20, hi: 30, rest: 60, grow: false, zone: 'abs', mus: ['abs', 'quads', 'shoulders'],
    levels: ['Mountain climbers lents', 'Mountain climbers rythmés', 'Mountain climbers rapides'],
    tip: 'Position de pompe, mains sous les épaules. Ramène un genou vers la poitrine puis alterne. Compte chaque montée de genou.',
    a: { paths: [[[35,97],[130,70]], [[130,70],[130,97]], [[88,82],[56,97]]], head: [144,62] },
    b: { paths: [[[35,97],[130,70]], [[130,70],[130,97]], [[88,82],[106,92],[96,98]]], head: [144,62] }, la: 'Jambe tendue', lb: 'Genou vers la poitrine' },
  { id: 'bulgare', name: 'Squat bulgare', lo: 8, hi: 12, rest: 75, grow: false, zone: 'jam', mus: ['quads', 'glutes'],
    levels: ['Squat bulgare', 'Squat bulgare + sac à dos', 'Squat bulgare, descente 4 s'],
    tip: 'Pied arrière sur une chaise bloquée, buste droit. Descends jusqu\'à ce que la cuisse avant soit parallèle au sol. Reps par jambe.',
    a: { props: [[[50,78],[80,78]], [[56,78],[56,100]]], paths: [[[104,98],[106,72],[104,52]], [[104,52],[84,72],[70,78]], [[104,52],[104,26]], [[104,30],[116,40]]], head: [104,14] },
    b: { props: [[[50,78],[80,78]], [[56,78],[56,100]]], paths: [[[124,98],[126,76],[104,72]], [[104,72],[86,78],[72,78]], [[104,72],[106,46]], [[106,50],[118,60]]], head: [106,34] }, la: 'Debout', lb: 'Cuisse avant parallèle' },
  { id: 'saute', name: 'Squat sauté', lo: 8, hi: 12, rest: 75, grow: false, adv: true, zone: 'jam', mus: ['quads', 'glutes', 'calves'],
    levels: ['Squat sauté', 'Squat sauté, réception silencieuse', 'Squat sauté, saut plus haut'],
    tip: 'Descends en squat, saute en poussant fort, retombe en douceur sur la pointe puis le talon, genoux fléchis. Exercice avancé : évite si les genoux ou les chevilles te font mal.',
    a: { paths: [[[105,98],[135,74],[85,72]], [[85,72],[98,44]], [[98,48],[128,52]], [[105,98],[121,98]]], head: [103,32] },
    b: { paths: [[[100,82],[101,64],[100,44]], [[100,44],[100,20]], [[100,24],[114,8]], [[100,82],[110,82]]], head: [100,10] }, la: 'Bas du squat', lb: 'En l\'air' }
);
FIGS = {};
EX.forEach(function (e) { FIGS[e.id] = e; });
Object.keys(FIG).forEach(function (k) { FIGS[k] = FIG[k]; });
EX.forEach(function (e) { if (e.zone === undefined) e.zone = 'jam'; });
/* niveau avancé : débloqué par la progression (pompes niveau 3 et squats niveau 2) ou par le réglage manuel */
var HL = {
  pompes: [[0, 0.85, 1], [0, 0.4, 0.7], [1, 0.05, 0.55]], diamant: [[0, 0.85, 1], [1, 0.05, 0.55]], inclinees: [[0, 0.85, 1], [1, 0, 0.5]],
  squats: [[0, 0.4, 1]], tirage: [[0, 0.8, 1], [1, 0, 0.6]], pike: [[0, 0.85, 1], [1, 0, 0.5]], fentes: [[0, 0.4, 1], [1, 0.7, 1]],
  pont: [[0, 0.8, 1], [1, 0, 0.5]], mollets: [[0, 0, 1]], gainage: [[0, 0.3, 0.8], [0, 0.9, 1]],
  lateral: [[3, 0, 0.5], [4, 0, 0.5]], superman: [[0, 0, 0.3], [1, 0, 0.6]], rowing: [[2, 0, 0.5], [1, 0.6, 1]], dips: [[2, 0, 0.6], [1, 0.7, 1]],
  curl: [[3, 0.2, 0.8]], crunch: [[1, 0.2, 1]], releves: [[1, 0, 0.5]], mountain: [[0, 0.4, 0.8], [2, 0.2, 1]], bulgare: [[0, 0.3, 1]], saute: [[0, 0, 1]]
};
EX.forEach(function (e) { e.hl = HL[e.id] || []; });
/* précautions des exercices à risque */
var RISK = {
  dips: ['Épaules et poignets sollicités.', 'Chaise bloquée contre un mur. Descends à 90° aux coudes au maximum, épaules loin des oreilles, dos proche de la chaise.', 'pincement ou douleur à l\'épaule, mains qui s\'engourdissent, craquement douloureux.'],
  diamant: ['Poignets et coudes sollicités.', 'Maîtrise d\'abord les pompes classiques. Coudes près du corps, poignets alignés, monte progressivement.', 'douleur au poignet ou au coude, picotements dans les mains.'],
  saute: ['Genoux, chevilles et tendons d\'Achille sollicités.', 'Sol plat, non glissant et dégagé, chaussures de sport. Réception souple sur la pointe puis le talon, genoux dans l\'axe. À éviter en cas de douleur articulaire.', 'douleur au genou ou à la cheville, réception instable ou bruyante, vertige, essoufflement anormal.'],
  rowing: ['Risque de chute si le point d\'ancrage cède.', 'Ancre la serviette dans une porte fermée à clé, solide, et teste en tirant doucement avant la série. Au moindre doute, ne fais pas cet exercice.', 'l\'ancrage bouge, douleur à l\'épaule ou au dos.'],
  bulgare: ['Genou avant et équilibre sollicités.', 'Chaise bloquée contre un mur, appui d\'une main sur un mur au début. Genou avant dans l\'axe du pied, buste droit.', 'douleur au genou avant, perte d\'équilibre, chaise qui bouge.'],
  superman: ['Bas du dos sollicité.', 'Monte sans cambrer fort ni à-coups, regard au sol, redescends lentement. À éviter en cas de douleur lombaire.', 'douleur ou pincement dans le bas du dos.'],
  releves: ['Bas du dos et hanches sollicités.', 'Bas du dos plaqué au sol, fléchis les genoux si le dos se creuse, descends lentement sans balancer.', 'douleur lombaire, tiraillement à l\'aine ou à la hanche.'],
  pike: ['Épaules, poignets et nuque sollicités.', 'Échauffe épaules et poignets. Dirige la tête vers le sol entre les mains sans la poser et sans forcer sur la nuque.', 'douleur à l\'épaule, au poignet ou à la nuque, vertige.'],
  fentes: ['Genoux sollicités.', 'Grand pas, genou avant dans l\'axe du pied, buste droit, sol antidérapant.', 'douleur au genou, déséquilibre, craquement douloureux.']
};
EX.forEach(function (e) { e.risk = RISK[e.id] || null; });
return { STRETCH, WARM, EX, LEGS, FIG, FIGS, MEALS, EXTRA, BASE_KCAL, SHOPN, SHOP_ORDER, SLOTS, EXTRA_OPTS, ZONES, MUSCLE_NAMES, META, HL, RISK };
})();
