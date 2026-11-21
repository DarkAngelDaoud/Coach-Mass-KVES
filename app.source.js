/* © KVES · Coach-Mass-KVES. FICHIER GÉNÉRÉ par build.js à partir de src/. Ne le modifie pas à la main : modifie src/ puis lance : node build.js */
(function () {
'use strict';

/* © KVES · Coach-Mass-KVES */

/* ====================== données fixes ====================== */
var KEY = 'coach-masse-v1';
var JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

var VERSION = '16.3';
var NOM = 'Coach-Mass-KVES', AUTEUR = 'KVES';
var NOTES = ['Si ton téléphone ne peut plus enregistrer tes données (stockage plein ou bloqué), un bandeau t\'avertit et te propose de sauvegarder tout de suite.'];
var STRETCH = [
  { l: 'Étire les pectoraux : avant-bras contre un mur, tourne doucement le buste', s: 30 },
  { l: 'Étire les cuisses : debout, talon vers la fesse, une jambe puis l\'autre', s: 40 },
  { l: 'Étire l\'arrière des cuisses : assis, une jambe tendue, penche-toi sans forcer', s: 40 },
  { l: 'Posture de l\'enfant : assis sur les talons, bras devant, dos détendu', s: 30 },
  { l: 'Respire lentement : cinq grandes respirations, épaules relâchées', s: 30 }
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
function advOk() { return !!P.advOn || (lv('pompes').level >= 2 && lv('squats').level >= 1); }
function exLocked(e) { return !!e.adv && !advOk(); }
function selected(e) { return !exLocked(e) && (e.core ? (P.sessOff || []).indexOf(e.id) < 0 : (P.extras || []).indexOf(e.id) >= 0); }
function inSession(e) { return selected(e); }
/* surbrillance des muscles sur le corps de profil : [numéro du tracé, début, fin] en fraction de sa longueur */
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
/* © KVES · Coach-Mass-KVES */
/* ====================== état ====================== */
function pad(n) { return String(n).padStart(2, '0'); }
function dstr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function today() { return dstr(new Date()); }
function dnum(s) { return Math.round(new Date(s + 'T00:00:00').getTime() / 864e5); }

function defaults() {
  return {
    profile: { start: today(), w0: 75, goal: 80, height: 179, age: 41, days: [1, 3, 5], tempo: 3, voice: true, voiceFr: false, tabac: false, absSkip: '', phExp: '', deloadUntil: '', vib: true,
      count: true, auto: true, restBonus: 15, sound: true, rotate: false, metro: true, warn10: true, vol: 7, hasBar: false, cigs: false, kcalAdj: 0, lastAdj: '', bkLast: '', bkEvery: 7, vibLevel: 2, exCfg: {}, seenVersion: '', gender: 'n', obj: 'masse', onboarded: false, healthOk: false, early: false, rmWater: false, rmLe: '', mt1: '', mt2: '', mt3: '', mt4: '', mt5: '', deloadOn: '', deloadLast: 0, deloadSkip: 0, parq: '', parqDate: '', extras: [], sessOff: [], advOn: false, avisName: '', avisEmail: '', theme: 'auto', rmOn: false, rmW: '07:30', rmM: '22:00', rmLw: '', rmLm: '', lang: 'fr', noEgg: false, noMilk: false, noNuts: false, noGluten: false, veg: false, budget: 'normal', shopDays: 7, shopM3: 'mix', shopM5: 'mix', shopDone: {} },
    logs: {}, measures: [], sessions: [], levels: {}, avis: { sent: [], inbox: [] }
  };
}
/* nettoyage strict des données lues (stockage local, sauvegarde importée) : types forcés, clés sûres, tailles limitées */
var DATE_RE = /^\d{4}-\d{2}-\d{2}$/, KEY_RE = /^[A-Za-z0-9_.:-]{1,60}$/;
function numOr(v, dflt) { if (typeof v === 'string' && v.trim() !== '') v = Number(v); return typeof v === 'number' && isFinite(v) ? v : dflt; }
function cleanV(v, depth, cap) {
  if (typeof v === 'string') return v.slice(0, cap || 2000);
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  if (typeof v === 'boolean') return v;
  if (depth > 5 || !v || typeof v !== 'object') return null;
  var i, o;
  if (Array.isArray(v)) { var a = []; for (i = 0; i < v.length && i < 3000; i++) a.push(cleanV(v[i], depth + 1, cap)); return a; }
  o = {}; var ks = Object.keys(v);
  for (i = 0; i < ks.length && i < 400; i++) if (KEY_RE.test(ks[i]) && ks[i] !== '__proto__' && ks[i] !== 'constructor' && ks[i] !== 'prototype') o[ks[i]] = cleanV(v[ks[i]], depth + 1, cap);
  return o;
}
function cleanProfile(p, d) {
  var out = {}, k, dv, v;
  p = p && typeof p === 'object' && !Array.isArray(p) ? p : {};
  for (k in d) {
    dv = d[k]; v = Object.prototype.hasOwnProperty.call(p, k) ? p[k] : undefined;
    if (v === undefined || v === null) out[k] = dv;
    else if (typeof dv === 'number') out[k] = numOr(v, dv);
    else if (typeof dv === 'boolean') out[k] = !!v;
    else if (typeof dv === 'string') out[k] = typeof v === 'string' ? v.slice(0, 200) : dv;
    else if (Array.isArray(dv) && typeof dv[0] === 'number') out[k] = Array.isArray(v) ? v.slice(0, 20).map(function (x) { return numOr(x, null); }).filter(function (x) { return x !== null; }) : dv;
    else if (Array.isArray(dv)) out[k] = Array.isArray(v) ? v.slice(0, 100).map(function (x) { return typeof x === 'number' ? (isFinite(x) ? x : 0) : typeof x === 'string' ? x.slice(0, 60) : null; }).filter(function (x) { return x !== null; }) : dv;
    else if (dv && typeof dv === 'object' && k !== 'exCfg') out[k] = v && typeof v === 'object' && !Array.isArray(v) ? cleanV(v, 1) : dv;
    else if (dv && typeof dv === 'object') {
      var o2 = {};
      if (typeof v === 'object' && !Array.isArray(v)) Object.keys(v).slice(0, 100).forEach(function (kk) {
        var x = v[kk];
        if (KEY_RE.test(kk) && kk !== '__proto__' && x && typeof x === 'object') { var y = {}; Object.keys(x).slice(0, 20).forEach(function (k3) { var q = numOr(x[k3], null); if (q !== null && KEY_RE.test(k3) && k3 !== '__proto__') y[k3] = q; }); o2[kk] = y; }
      });
      out[k] = o2;
    } else out[k] = v;
  }
  for (k in p) if (!(k in d) && KEY_RE.test(k) && k !== '__proto__' && (typeof p[k] === 'string' || typeof p[k] === 'number' || typeof p[k] === 'boolean')) out[k] = typeof p[k] === 'string' ? p[k].slice(0, 200) : p[k];
  return out;
}
function normalize(o) {
  var d = defaults(), i, k, r;
  o = o && typeof o === 'object' ? o : {};
  var logs = {}, lg = o.logs && typeof o.logs === 'object' && !Array.isArray(o.logs) ? o.logs : {};
  Object.keys(lg).slice(0, 5000).forEach(function (dk) { if (DATE_RE.test(dk) && lg[dk] && typeof lg[dk] === 'object') logs[dk] = cleanV(lg[dk], 1); });
  var measures = [];
  (Array.isArray(o.measures) ? o.measures : []).slice(0, 3000).forEach(function (m) {
    if (!m || typeof m !== 'object' || !DATE_RE.test(m.date)) return;
    r = { date: m.date }; Object.keys(m).forEach(function (mk) { if (mk !== 'date' && KEY_RE.test(mk) && mk !== '__proto__') { var q = numOr(m[mk], null); if (q !== null) r[mk] = q; } });
    measures.push(r);
  });
  var sessions = [];
  (Array.isArray(o.sessions) ? o.sessions : []).slice(0, 5000).forEach(function (s) {
    if (!s || typeof s !== 'object' || !DATE_RE.test(s.date)) return;
    r = cleanV(s, 1); r.date = s.date; r.min = numOr(s.min, 0); r.sets = numOr(s.sets, 0); r.rpe = Math.max(0, Math.min(5, Math.round(numOr(s.rpe, 0)))); sessions.push(r);
  });
  var levels = {}, lv0 = o.levels && typeof o.levels === 'object' && !Array.isArray(o.levels) ? o.levels : {};
  Object.keys(lv0).slice(0, 200).forEach(function (id) { if (KEY_RE.test(id) && id !== '__proto__' && lv0[id] && typeof lv0[id] === 'object') levels[id] = { level: numOr(lv0[id].level, 0), off: numOr(lv0[id].off, 0) }; });
  var av = o.avis && typeof o.avis === 'object' ? o.avis : {};
  return { profile: cleanProfile(o.profile, d.profile), logs: logs, measures: measures, sessions: sessions, levels: levels,
    avis: { sent: Array.isArray(av.sent) ? cleanV(av.sent, 2, 20000) : [], inbox: Array.isArray(av.inbox) ? cleanV(av.inbox, 2, 20000) : [] } };
}
var D;
try { D = normalize(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch (e) { D = defaults(); try { window.__cmCorrupt = localStorage.getItem(KEY); } catch (e2) {} }
var P = D.profile;
function applyRotate() {
  try {
    var so = window.screen && window.screen.orientation;
    if (!so) return;
    if (P.rotate) { var r = so.lock && so.lock('any'); if (r && r.catch) r.catch(function () {}); }
    else if (so.unlock) so.unlock();
  } catch (e) {}
}
function saveFlag(ok) {
  var b = document.getElementById('savefail');
  if (ok) { if (b) b.remove(); return; }
  if (b) return;
  b = document.createElement('div'); b.id = 'savefail'; b.className = 'savefail'; b.setAttribute('role', 'alert');
  var t = document.createElement('p'); t.textContent = trText('Enregistrement impossible : stockage plein ou bloqué. Sauvegarde tes données maintenant.');
  var k = document.createElement('button'); k.className = 'btn sm'; k.setAttribute('data-act', 'bkexport'); k.textContent = trText('Sauvegarder maintenant');
  b.appendChild(t); b.appendChild(k); document.body.appendChild(b);
}
function save() { var ok = true; try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { ok = false; } try { saveFlag(ok); } catch (e) {} try { syncRemind(); } catch (e) {} }

function log(d) { return D.logs[d || today()] || (D.logs[d || today()] = {}); }
function lv(id) { return D.levels[id] || (D.levels[id] = { level: 0, off: 0 }); }
function levelsFor(e) { return e.id === 'tirage' && P.hasBar ? e.levels.concat(['Tractions (barre)']) : e.levels; }
function wkNo() { return Math.max(1, Math.floor((dnum(today()) - dnum(P.start)) / 7) + 1); }
function isTrainDay(dow) { return P.days.indexOf(dow) >= 0; }
function doneToday() { return D.sessions.some(function (s) { return s.date === today() && !s.partial; }); }
function deloadActive() { return (!!P.deloadOn && P.deloadOn === weekStartStr()) || (!!P.deloadUntil && today() <= P.deloadUntil); }
function rpeLast3() {
  var a = D.sessions.filter(function (x) { return !x.partial && !x.free && +x.rpe > 0; }).slice(-3);
  return a.length === 3 ? (a[0].rpe + a[1].rpe + a[2].rpe) / 3 : null;
}
function deloadDue() {
  if (!P.onboarded || deloadActive()) return false;
  var wk = wkNo(), r = rpeLast3();
  if (P.deloadSkip === wk) return false;
  return (wk >= 5 && wk - P.deloadLast >= 5) || (r !== null && r >= 4.5 && wk - P.deloadLast >= 2);
}
function lastSessDate() { var m = ''; D.sessions.forEach(function (x) { if (x.date > m) m = x.date; }); return m; }
function absenceDays() {
  var l = lastSessDate(); if (!l) return 0;
  return Math.floor((new Date(today() + 'T00:00:00') - new Date(l + 'T00:00:00')) / 86400000);
}
function absenceDue() { return !!P.onboarded && !deloadActive() && absenceDays() >= 10 && P.absSkip !== lastSessDate(); }
function absenceCard() {
  return '<div class="card coach"><h2>Content de te revoir</h2><p class="small"><span>Dernière séance il y a</span> <b>' + absenceDays() + '</b> <span>jours</span></p><p class="small">Reprends en douceur : 7 jours allégés, puis retour au programme normal. Ton corps te remerciera.</p><button class="btn go" data-act="absgo">Reprendre en douceur</button><button class="btn alt" data-act="absskip">Reprendre normalement</button></div>';
}
function deloadCard() {
  if (absenceDue()) return absenceCard();
  if (deloadActive()) return '<div class="card coach"><h2>Semaine d\'allègement en cours</h2><p class="small">' + (P.deloadUntil && today() <= P.deloadUntil && P.deloadOn !== weekStartStr() ? 'Les séances sont allégées pendant 7 jours.' : 'Les séances sont allégées jusqu\'à dimanche.') + '</p><button class="btn alt sm" data-act="deloadstop">Arrêter l\'allègement</button></div>';
  if (deloadDue()) return '<div class="card"><h2>Semaine d\'allègement conseillée</h2><p class="small">Après plusieurs semaines d\'effort, ou si tes séances sont très dures, une semaine plus légère aide à récupérer et à progresser ensuite.</p><button class="btn alt" data-act="deloadon">Activer cette semaine</button><button class="btn alt sm" data-act="deloadskip">Pas maintenant</button></div>';
  return '';
}
function isLight() { var l = D.logs[today()] || {}; return deloadActive() || (l.sleep && +l.sleep < 6) || (l.energy && +l.energy <= 2); }
function weekStartStr() { var d = new Date(); var off = (d.getDay() + 6) % 7; d.setDate(d.getDate() - off); return dstr(d); }
function sessionsThisWeek() { var w = weekStartStr(); return D.sessions.filter(function (s) { return !s.partial && s.date >= w; }).length; }
function missedThisWeek() {
  var n = 0, d = new Date(), t = today(), off = (d.getDay() + 6) % 7;
  for (var i = 0; i < off; i++) {
    var x = new Date(); x.setDate(x.getDate() - (off - i));
    var s = dstr(x);
    if (isTrainDay(x.getDay()) && s >= P.start && !D.sessions.some(function (q) { return q.date === s && !q.partial; })) n++;
  }
  return n;
}
/* objectif, calories et repas */
var OBJ = { masse: 'Prise de masse', perte: 'Perte de poids', tonif: 'Tonification', maintien: 'Maintien' };
function obj() { return OBJ[P.obj] ? P.obj : 'masse'; }
function bmr() { var s = P.gender === 'h' ? 5 : P.gender === 'f' ? -161 : -78; return 10 * currentWeight() + 6.25 * (+P.height || 170) - 5 * (+P.age || 30) + s; }
function tdee() { return Math.round(bmr() * 1.4); }
function kcalFloor() { return P.gender === 'h' ? 1500 : P.gender === 'f' ? 1200 : 1350; }
function round10(x) { return Math.round(x / 10) * 10; }
/* calories des repas types (avant tout ajout) */
function kcalCore() {
  var o = obj(), t = tdee(), c;
  if (o === 'masse') return P.onboarded ? Math.max(1600, Math.min(3400, round10(t + 400))) : BASE_KCAL;
  if (o === 'perte') { c = Math.max(kcalFloor(), Math.round(t - Math.min(500, 0.2 * t))) + P.kcalAdj; return round10(Math.min(t, Math.max(kcalFloor(), Math.round(t * 0.75), c))); }
  return round10(Math.max(kcalFloor(), t + P.kcalAdj));
}
/* exclusions alimentaires du profil */
function dietEx() {
  var e = [];
  if (P.noEgg) e.push('oeuf'); if (P.noMilk) e.push('lait'); if (P.noNuts) e.push('noix'); if (P.noGluten) e.push('gluten');
  if (P.veg) { e.push('viande'); e.push('poisson'); }
  return e;
}
function okOpt(o) { var ex = dietEx(); if (o.lt && obj() === 'masse') return false; return !o.has.some(function (h) { return ex.indexOf(h) >= 0; }); }
function slotOpts(s) { var c = s.opts.filter(okOpt); if (obj() !== 'masse') { var l = c.filter(function (o) { return o.lt; }); if (l.length) return l; } return c; }
/* choix du jour pour un créneau : liste de [option, nombre de jours sur d] (variantes alternées si besoin) */
function slotChoices(s) {
  var comp = slotOpts(s), withV = comp.filter(function (o) { return o.v; });
  if (!withV.length) return [comp[0] || s.opts[s.opts.length - 1]];
  var first = withV[0], same = withV.filter(function (o) { return o.x.length >= 0; });
  /* variantes possibles = une option par clé v, la première compatible de chaque clé */
  var seen = {}, vs = [];
  withV.forEach(function (o) { if (!seen[o.v]) { seen[o.v] = 1; vs.push(o); } });
  if (P.budget === 'serre' && s.id === 'm3') { var nb = vs.filter(function (o) { return o.v !== 'poulet'; }); if (nb.length) vs = nb; }
  var pref = s.pref ? P[s.pref] : 'mix';
  if (pref !== 'mix') { var f = vs.filter(function (o) { return o.v === pref; }); if (f.length) return f; }
  return vs;
}
function slotVariants(s) { var seen = {}, n = []; slotOpts(s).forEach(function (o) { if (o.v && !seen[o.v]) { seen[o.v] = 1; n.push(o.v); } }); return n; }
var MT_DEF = ['09:30', '12:00', '14:30', '18:00', '21:30'];
function fmtT(m) { var h = Math.floor(m / 60), n = m % 60; return h + ' h' + (n ? ' ' + (n < 10 ? '0' : '') + n : ''); }
function mealMin(i) { var v = hm(P['mt' + (i + 1)]); return v !== null ? v : hm(MT_DEF[i]); }
function mealEff(i) {
  var a = [0, 1, 2, 3, 4].map(mealMin);
  if (P.early && a[4] > 20 * 60 + 30) { a[4] = 20 * 60 + 30; for (var j = 3; j >= 0; j--) if (a[j] > a[j + 1] - 120) a[j] = a[j + 1] - 120; }
  return a[i];
}
function mealT(s) { var i = +s.id.slice(1) - 1, v = hm(P['mt' + (i + 1)]); return P.early ? fmtT(mealEff(i)) : v !== null ? fmtT(v) : s.t; }
function mealTimesOk(a) { for (var i = 1; i < a.length; i++) if (a[i] - a[i - 1] < 120) return false; return true; }
function mealTimesCard() {
  var lab = ['Repas 1', 'Repas 2', 'Repas 3', 'Repas 4', 'Repas 5'];
  var h = '<div class="card"><h2>Heures des repas</h2><p class="small">Choisis l\'heure de chaque repas. Les repas non proposés pour ton objectif n\'apparaissent pas dans l\'onglet Repas. Garde au moins 2 h entre deux repas.</p><div class="grid2">';
  for (var i = 0; i < 5; i++) { var m = mealMin(i); h += '<label class="f">' + lab[i] + '<input type="time" data-mt="' + i + '" value="' + (m < 600 ? '0' : '') + Math.floor(m / 60) + ':' + (m % 60 < 10 ? '0' : '') + (m % 60) + '"></label>'; }
  h += '</div>';
  h += '<label class="meal"><input type="checkbox" data-early="1"' + (P.early ? ' checked' : '') + '><span>Dernier repas avant 20 h 30</span></label><p class="small">Le dernier repas est ramené à 20 h 30 au plus tard ; les repas précédents se décalent si besoin (2 h d\'écart minimum).</p>';
  if (!P.early && mealMin(4) > 21 * 60 + 30) h += '<p class="small">Un dernier repas après 21 h 30 peut gêner le sommeil et la digestion : garde-le léger.</p>';
  return h + '<button class="btn alt sm" data-act="mtreset">Heures par défaut</button></div>';
}
document.addEventListener('change', function (ev) {
  var t = ev.target; if (t && t.getAttribute && t.getAttribute('data-early') !== null) { P.early = !!t.checked; save(); render(); return; }
  if (!t || !t.getAttribute || t.getAttribute('data-mt') === null) return;
  var i = +t.getAttribute('data-mt'), v = hm(t.value);
  if (v === null) { render(); return; }
  var a = []; for (var k = 0; k < 5; k++) a.push(k === i ? v : mealMin(k));
  if (!mealTimesOk(a)) { toast('Les heures doivent rester dans l\'ordre, avec au moins 2 h d\'écart.'); render(); return; }
  P['mt' + (i + 1)] = t.value; save(); render();
});
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act=mtreset]');
  if (t) { for (var i = 1; i <= 5; i++) P['mt' + i] = ''; save(); render(); }
});
function slotMeal(s) {
  var ch = slotChoices(s), o = ch[0];
  var ob = { t: mealT(s), x: ch.length > 1 && o.mx ? o.mx : o.x, k: o.k, p: o.p, slot: s.id };
  return ob;
}
/* sous-ensemble de créneaux : tous, sans le smoothie, ou sans smoothie ni collation, selon la cible */
function planSlots() {
  var all = SLOTS, cand = [all, all.filter(function (s) { return s.id !== 'm2'; }), all.filter(function (s) { return s.id !== 'm2' && s.id !== 'm4'; })];
  var target = kcalCore();
  function base(l) { return l.reduce(function (a, s) { return a + slotMeal(s).k; }, 0); }
  if (obj() === 'masse') return all;
  var best = all, bd = 9;
  cand.forEach(function (l) { var f = target / base(l), d = Math.abs(Math.log(f)); if (f >= 0.7 && f <= 1.25 && d < bd) { bd = d; best = l; } });
  return best;
}
function planBase() { return planSlots().reduce(function (a, s) { return a + slotMeal(s).k; }, 0); }
function mealFactor() { return P.onboarded || obj() !== 'masse' ? kcalCore() / planBase() : 1; }
function kcalTarget() { return Math.max(1200, kcalCore() + (obj() === 'masse' ? P.kcalAdj : 0)); }
function protTarget() { var k = (obj() === 'masse' || obj() === 'perte') ? 1.8 : 1.6; return obj() === 'masse' && !P.onboarded ? 135 : Math.round(k * currentWeight() / 5) * 5; }
function extraMeal() { var o = EXTRA_OPTS.filter(okOpt)[0] || EXTRA_OPTS[1]; return { t: P.early ? 'Avec le dîner' : 'Avant de dormir', x: o.x, k: o.k, p: o.p, extra: true, shop: o.shop }; }
function mealsList() {
  var l = planSlots().map(slotMeal);
  if (obj() === 'masse' && P.kcalAdj >= 300) l.push(extraMeal());
  return l;
}
function mealK(m) { return m.extra ? m.k : round10(m.k * mealFactor()); }
function mealP(m) { return m.extra ? m.p : Math.round(m.p * mealFactor()); }
function eatenKcal() {
  var l = log(), m = mealsList(), s = 0;
  (l.meals || []).forEach(function (c, i) { if (c && m[i]) s += mealK(m[i]); });
  return s;
}

/* poids et tendance */
function weights() {
  var a = [];
  Object.keys(D.logs).sort().forEach(function (k) { if (D.logs[k].weight) a.push({ d: k, w: +D.logs[k].weight }); });
  return a;
}
function currentWeight() { var a = weights(); return a.length ? a[a.length - 1].w : +P.w0; }
function slopeWeek(days) {
  var t = dnum(today());
  var a = weights().filter(function (x) { return t - dnum(x.d) <= days; });
  if (a.length < 3) return null;
  var x0 = dnum(a[0].d);
  if (dnum(a[a.length - 1].d) - x0 < 10) return null;
  var n = a.length, sx = 0, sy = 0, sxy = 0, sxx = 0;
  a.forEach(function (p) { var x = dnum(p.d) - x0; sx += x; sy += p.w; sxy += x * p.w; sxx += x * x; });
  var den = n * sxx - sx * sx;
  return den ? ((n * sxy - sx * sy) / den) * 7 : null;
}
function suggestion() {
  var s = slopeWeek(28), o = obj();
  if (s === null) return null;
  if (P.lastAdj && dnum(today()) - dnum(P.lastAdj) < 14) return null;
  if (o === 'masse') {
    if (s < 0.15 && P.kcalAdj < 900) return { v: 300, msg: 'Ton poids monte de ' + fmt(s, 2) + ' kg par semaine : trop lent. Ajoute 300 kcal par jour (un repas en plus avant de dormir).' };
    if (s > 0.7 && P.kcalAdj > -300) return { v: -200, msg: 'Ton poids monte de ' + fmt(s, 2) + ' kg par semaine : trop vite. Retire 200 kcal par jour.' };
    return null;
  }
  var low = Math.max(kcalFloor(), o === 'perte' ? Math.round(tdee() * 0.75) : 0);
  if (o === 'perte') {
    if (s > -0.15 && kcalTarget() - 150 >= low) return { v: -150, msg: 'Ton poids ne baisse que de ' + fmt(-s, 2) + ' kg par semaine (cible saine : 0,25 à 0,5). Retire 150 kcal par jour.' };
    if (s < -0.7) return { v: 200, msg: 'Tu perds ' + fmt(-s, 2) + ' kg par semaine : trop vite, tu risques de perdre du muscle. Ajoute 200 kcal par jour.' };
    return null;
  }
  if (s > 0.3) return { v: -150, msg: 'Ton poids monte de ' + fmt(s, 2) + ' kg par semaine alors que tu vises la stabilité. Retire 150 kcal par jour.' };
  if (s < -0.3) return { v: 150, msg: 'Ton poids baisse de ' + fmt(-s, 2) + ' kg par semaine alors que tu vises la stabilité. Ajoute 150 kcal par jour.' };
  return null;
}
/* © KVES · Coach-Mass-KVES */
/* ====================== utilitaires UI ====================== */
function $(s, r) { return (r || document).querySelector(s); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function fmt(n, d) { return n === null || n === undefined || isNaN(n) ? '—' : Number(n).toFixed(d === undefined ? 1 : d).replace('.', ','); }
function pts(p) { return p.map(function (q) { return q[0] + ',' + q[1]; }).join(' '); }
function figure(d, dx, label, bad) {
  var o = '<g transform="translate(' + dx + ',0)"><line class="ground" x1="6" y1="101" x2="194" y2="101"/>';
  (d.props || []).forEach(function (p) { o += '<polyline class="prop" points="' + pts(p) + '"/>'; });
  d.paths.forEach(function (p) { o += '<polyline class="fig' + (bad ? ' bad' : '') + '" points="' + pts(p) + '"/>'; });
  o += '<circle class="fig head' + (bad ? ' bad' : '') + '" cx="' + d.head[0] + '" cy="' + d.head[1] + '" r="8"/>';
  o += '<text class="lbl" x="100" y="121" text-anchor="middle">' + label + '</text></g>';
  return o;
}
function drawEx(e, single) {
  return '<div class="draw"><svg viewBox="0 0 ' + (single ? 200 : 420) + ' 128" role="img" aria-label="' + esc(e.name) + '">' +
    figure(e.a, 0, e.la) + (single ? '' : figure(e.b, 220, e.lb, e.bad2)) + '</svg></div>';
}

/* © KVES · Coach-Mass-KVES */
/* ====================== animations ====================== */
var REDUCED = false;
try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
function lerp(a, b, t) { return a + (b - a) * t; }
function resample(p, n) {
  if (p.length === n) return p;
  var d = [0], i, k;
  for (i = 1; i < p.length; i++) d.push(d[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  var tot = d[d.length - 1] || 1, out = [];
  for (k = 0; k < n; k++) {
    var x = tot * k / (n - 1), j = 0;
    while (j < p.length - 2 && d[j + 1] < x) j++;
    var seg = (d[j + 1] - d[j]) || 1, f = Math.min(1, Math.max(0, (x - d[j]) / seg));
    out.push([lerp(p[j][0], p[j + 1][0], f), lerp(p[j][1], p[j + 1][1], f)]);
  }
  return out;
}
function prepFig(f) {
  if (f._P) return f._P;
  f._P = f.a.paths.map(function (pa, i) {
    var pb = f.b.paths[i], n = Math.max(pa.length, pb.length);
    return { a: resample(pa, n), b: resample(pb, n) };
  });
  return f._P;
}
function ptsAt(P, t) {
  return P.a.map(function (q, j) { return lerp(q[0], P.b[j][0], t).toFixed(1) + ',' + lerp(q[1], P.b[j][1], t).toFixed(1); }).join(' ');
}
/* les muscles sollicités du mannequin de face se contractent au rythme du mouvement */
var EFF_B = ['tirage', 'pont', 'mollets', 'lateral', 'superman', 'rowing', 'curl', 'crunch', 'releves', 'mountain', 'saute'];
function pulseFront(sv, f, t) {
  var box = sv.parentNode && sv.parentNode.querySelector ? sv.parentNode.querySelector('.mfront') : null;
  if (!box) return;
  var e = f.timed ? 1 : (EFF_B.indexOf(f.id) >= 0 ? t : 1 - t), els = box.querySelectorAll('.mu.on'), i;
  for (i = 0; i < els.length; i++) { els[i].style.opacity = (0.45 + 0.55 * e).toFixed(2); els[i].style.transform = 'scale(' + (1 + 0.14 * e).toFixed(3) + ')'; }
}
function subPoly(Pp, t, f0, f1) {
  var a = Pp.a.map(function (q, j) { return [lerp(q[0], Pp.b[j][0], t), lerp(q[1], Pp.b[j][1], t)]; }), d = [0], i;
  for (i = 1; i < a.length; i++) d.push(d[i - 1] + Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]));
  var tot = d[d.length - 1] || 1, out = [], x0 = tot * f0, x1 = tot * f1;
  function at(x) { var j = 0; while (j < a.length - 2 && d[j + 1] < x) j++; var sg = (d[j + 1] - d[j]) || 1, f = Math.min(1, Math.max(0, (x - d[j]) / sg)); return [lerp(a[j][0], a[j + 1][0], f), lerp(a[j][1], a[j + 1][1], f)]; }
  out.push(at(x0));
  for (i = 1; i < a.length - 1; i++) if (d[i] > x0 && d[i] < x1) out.push(a[i]);
  out.push(at(x1));
  return out.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
}
function animSvg(id, mode, period) {
  var f = FIGS[id], P = prepFig(f);
  var o = '<svg class="anim" viewBox="0 0 200 128" role="img" aria-label="' + esc(f.name || id) + '" data-fig="' + id + '" data-mode="' + mode + '" data-period="' + period + '" data-origin="' + Math.round(performance.now()) + '" data-t="0">';
  o += '<line class="ground" x1="6" y1="101" x2="194" y2="101"/>';
  (f.a.props || []).forEach(function (q) { o += '<polyline class="prop" points="' + pts(q) + '"/>'; });
  P.forEach(function (q) { o += '<polyline class="fig" points="' + ptsAt(q, 0) + '"/>'; });
  (f.hl || []).forEach(function (h) { o += '<polyline class="fig hl" data-p="' + h[0] + '" data-a="' + h[1] + '" data-b="' + h[2] + '" points=""/>'; });
  o += '<circle class="fig head" cx="' + f.a.head[0] + '" cy="' + f.a.head[1] + '" r="8"/>';
  o += '<text class="lbl" x="100" y="121" text-anchor="middle">' + esc(f.la) + '</text></svg>';
  return o;
}
/* animation de profil avec muscles qui s'illuminent + mannequin de face à côté */
function drawBox(id, mode, period) {
  var f = FIGS[id];
  return '<div class="draw' + (f.mus ? ' dual' : '') + '">' + animSvg(id, mode, period) + (f.mus ? '<div class="mfront">' + mannequinSvg(f.mus, 'face') + '</div>' : '') + '</div>';
}
function animBlock(id) {
  var f = FIGS[id], manual = !!f.timed;
  return drawBox(id, manual ? 'manual' : 'loop', Math.max(2, +P.tempo || 3)) + (f.mus ? '<p class="small mulbl">Muscles qui travaillent : ' + esc(muscleNames(f.mus)) + '</p>' : '') +
    '<div class="scrub"><button class="btn alt sm" data-act="animtoggle">' + (manual ? 'Animer' : 'Figer') + '</button>' +
    '<input type="range" min="0" max="100" value="0" data-scrub aria-label="Décomposer le mouvement"></div>';
}
function applyPose(sv, f, t) {
  var P = prepFig(f), pl = sv.querySelectorAll('polyline.fig:not(.hl)'), i;
  for (i = 0; i < P.length && i < pl.length; i++) pl[i].setAttribute('points', ptsAt(P[i], t));
  pulseFront(sv, f, t);
  sv.querySelectorAll('polyline.hl').forEach(function (h) {
    var q = P[+h.getAttribute('data-p')];
    if (q) h.setAttribute('points', subPoly(q, t, +h.getAttribute('data-a'), +h.getAttribute('data-b')));
  });
  var c = sv.querySelector('circle.head');
  c.setAttribute('cx', lerp(f.a.head[0], f.b.head[0], t).toFixed(1));
  c.setAttribute('cy', lerp(f.a.head[1], f.b.head[1], t).toFixed(1));
  var bad = !!(f.bad2 && t > 0.5);
  for (i = 0; i < pl.length; i++) pl[i].classList.toggle('bad', bad);
  c.classList.toggle('bad', bad);
  var tx = sv.querySelector('text.lbl'), lab = t < 0.5 ? f.la : f.lb;
  if (tx && tx.textContent !== lab) tx.textContent = lab;
}
var lastF = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  if (ts - lastF < 33) return;
  lastF = ts;
  var list = document.querySelectorAll('svg.anim');
  for (var i = 0; i < list.length; i++) {
    var sv = list[i], f = FIGS[sv.getAttribute('data-fig')];
    if (!f) continue;
    var mode = sv.getAttribute('data-mode'), t = 0;
    if (mode === 'manual') t = parseFloat(sv.getAttribute('data-t')) || 0;
    else if (mode === 'loop' && !REDUCED) {
      var per = parseFloat(sv.getAttribute('data-period')) || 3, org = parseFloat(sv.getAttribute('data-origin')) || 0;
      t = 0.5 - 0.5 * Math.cos(2 * Math.PI * ((ts - org) / 1000 / per));
    }
    sv._t = t;
    applyPose(sv, f, t);
  }
}

/* © KVES · Coach-Mass-KVES */
/* ====================== mannequin : face + profil, muscles colorés ====================== */
function mannequinSvg(mus, view) {
  mus = mus || [];
  var only = view === 'face';
  function on(id) { return mus.indexOf(id) >= 0 ? ' on' : ''; }
  function el(id, cx, cy, rx, ry, rot) {
    return '<ellipse class="mu' + on(id) + '" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"' + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + '/>';
  }
  var s = '<svg class="mq" viewBox="0 0 230 208" role="img" aria-label="Mannequin de face et de profil, muscles sollicités : ' + esc(mus.map(function (m) { return MUSCLE_NAMES[m]; }).join(', ')) + '">';
  /* vue de face */
  s += '<circle class="bd" cx="55" cy="16" r="10"/><rect class="bd" x="51" y="25" width="8" height="8" rx="2"/>' +
    '<path class="bd" d="M38 33 L72 33 L75 60 L66 100 L44 100 L35 60 Z"/>' +
    '<ellipse class="bd" cx="25" cy="86" rx="4.5" ry="14"/><ellipse class="bd" cx="85" cy="86" rx="4.5" ry="14"/>' +
    '<rect class="bd" x="42" y="98" width="12" height="62" rx="6"/><rect class="bd" x="56" y="98" width="12" height="62" rx="6"/>' +
    '<ellipse class="bd" cx="46" cy="190" rx="8" ry="3.5"/><ellipse class="bd" cx="64" cy="190" rx="8" ry="3.5"/>';
  s += el('shoulders', 34, 40, 8, 7) + el('shoulders', 76, 40, 8, 7) +
    el('chest', 46, 52, 10, 9) + el('chest', 64, 52, 10, 9) +
    '<rect class="mu' + on('abs') + '" x="47" y="64" width="16" height="30" rx="5"/>' +
    el('biceps', 28, 58, 4.5, 12) + el('biceps', 82, 58, 4.5, 12) +
    el('quads', 47, 124, 8, 22) + el('quads', 63, 124, 8, 22) +
    el('calves', 46, 168, 5.5, 15) + el('calves', 64, 168, 5.5, 15);
  if (only) return s.replace('<svg class="mq" viewBox="0 0 230 208"', '<svg class="mq mqf" viewBox="14 0 82 208"') + '<text class="mqt" x="55" y="205" text-anchor="middle">Face</text></svg>';
  /* vue de profil (regarde à droite) */
  s += '<circle class="bd" cx="172" cy="16" r="10"/><rect class="bd" x="164" y="25" width="9" height="8" rx="2"/>' +
    '<path class="bd" d="M148 33 L188 33 L190 62 L186 100 L148 100 L146 60 Z"/>' +
    '<ellipse class="bd" cx="168" cy="88" rx="5" ry="15"/>' +
    '<rect class="bd" x="149" y="98" width="38" height="62" rx="12"/><ellipse class="bd" cx="170" cy="190" rx="14" ry="3.5"/>';
  s += el('back', 154, 52, 4.5, 13) + el('lowback', 154, 84, 4.5, 9) + el('chest', 183, 52, 4, 10) + el('abs', 183, 82, 3.8, 14) +
    el('shoulders', 168, 40, 7, 8) + el('triceps', 164, 64, 3.5, 11) + el('biceps', 172, 64, 3.5, 11) +
    el('glutes', 156, 106, 8, 9) + el('hams', 158, 134, 6, 20) + el('quads', 180, 132, 5.5, 18) + el('calves', 163, 170, 6, 14);
  s += '<text class="mqt" x="55" y="205" text-anchor="middle">Face</text><text class="mqt" x="168" y="205" text-anchor="middle">Profil</text></svg>';
  return s;
}
function muscleNames(mus) { return mus.map(function (m) { return MUSCLE_NAMES[m]; }).join(', '); }
function mannequinHtml(e) {
  return '<details class="cfg"><summary>Muscles : ' + esc(muscleNames(e.mus)) + '</summary><div class="draw mqbox">' + mannequinSvg(e.mus) + '</div></details>';
}
/* © KVES · Coach-Mass-KVES */
/* ====================== coach (messages) ====================== */
function pick(a) { var d = new Date(); return a[(d.getDate() + d.getHours()) % a.length]; }
function coachMsg() {
  var l = D.logs[today()] || {}, d = new Date(), h = d.getHours(), dow = d.getDay();
  var train = isTrainDay(dow), done = doneToday(), left = kcalTarget() - eatenKcal(), miss = missedThisWeek();
  if (!l.weight && !l.sleep && !l.energy && h < 12) return ['Bilan du matin', pick(['Bilan du jour. Sommeil, énergie, poids si c\'est dimanche. Deux minutes, maintenant.', 'Pas de bilan, pas de progrès. Remplis-le avant ton premier repas.'])];
  if (done) return ['Séance faite', left > 400 ? (obj() === 'masse' ? 'Séance validée. Maintenant tu manges : il te reste environ ' + left + ' kcal. Ne saute rien.' : 'Séance validée. Il te reste environ ' + left + ' kcal à manger aujourd\'hui : ni plus, ni moins.') : 'Séance validée et repas presque complets. Bien. Dors tes 7 heures.'];
  if (train) {
    if (deloadActive()) return ['Semaine d\'allègement', 'Cette semaine, les séances sont allégées. Fais-les quand même : récupérer fait partie du programme.'];
    if (isLight()) return ['Séance allégée', 'Tu as peu dormi ou peu d\'énergie. Séance allégée aujourd\'hui, mais elle est faite. Une série en moins, pas d\'excuses.'];
    return ['Jour de séance', pick(['Aujourd\'hui, séance. Une heure, pas de négociation. Lance-la quand tu es prêt.', 'C\'est jour de séance. Mange ta collation, mets tes écouteurs et commence.'])];
  }
  if (miss > 0) return ['Séance manquée', 'Tu as raté ' + miss + ' séance' + (miss > 1 ? 's' : '') + ' cette semaine. Rattrape-en une aujourd\'hui si tu es en forme. Sinon, tiens la prochaine sans faute.'];
  return ['Jour de récupération', pick(['Récupération. 30 minutes de marche, tes 5 repas, 2,5 litres d\'eau. Rien de plus, rien de moins.', 'Pas de séance. Le muscle se construit maintenant : mange, bois, dors.'])];
}

/* © KVES · Coach-Mass-KVES */
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

function waterTarget() {
  var ml = 30 * currentWeight() + (isTrainDay(new Date().getDay()) ? 500 : 0);
  return Math.round(Math.max(2000, Math.min(3500, ml)) / 50) * 50;
}
function waterNote(water, target) {
  var h = new Date().getHours() + new Date().getMinutes() / 60, exp = target * Math.max(0, Math.min(1, (h - 8) / 13));
  if (water >= target) return 'Objectif atteint, bravo.';
  if (h >= 11 && water < exp - 500) return 'En retard sur ton objectif : bois un verre maintenant.';
  return 'Tu es dans le rythme.';
}
function cigAvg(from, n) {
  var tot = 0, c = 0, i, d, v;
  for (i = from; i < from + n; i++) { d = new Date(); d.setDate(d.getDate() - i); v = (D.logs[dstr(d)] || {}).cig; if (v !== undefined && v !== null && !isNaN(+v)) { tot += +v; c++; } }
  return c ? tot / c : null;
}
function tabacCard() {
  if (!P.tabac) return '';
  var l = D.logs[today()] || {}, a = cigAvg(0, 7), b = cigAvg(7, 7);
  var h = '<div class="card"><div class="row"><h2 class="grow">Tabac</h2><b>' + (+l.cig || 0) + '</b></div>' +
    '<div class="row"><button class="btn alt sm grow" data-act="cig" data-n="1">+ 1 cigarette</button><button class="btn alt sm" data-act="cig" data-n="-1">− 1</button></div>';
  if (a !== null) h += '<div class="stats"><div class="stat"><b>' + fmt(a, 1) + '</b><span>par jour, 7 derniers jours</span></div>' + (b !== null ? '<div class="stat"><b>' + fmt(b, 1) + '</b><span>par jour, 7 jours d\'avant</span></div>' : '') + '</div>';
  return h + '<p class="small">Noter sans te juger. Chaque jour compte. Pour être aidé à arrêter, parles-en à un médecin ou à un pharmacien.</p></div>';
}
function viewToday() {
  var l = log(), m = coachMsg(), sug = suggestion();
  var energy = [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="energy" data-n="' + n + '" class="' + (+l.energy === n ? 'on' : '') + '">' + n + '</button>'; }).join('');
  var water = +l.water || 0;
  var h = '<div class="card coach"><span class="head">Le coach · ' + m[0] + '</span><p class="msg">' + m[1] + '</p></div>';
  h += bkBanner();
  h += deloadCard();
  h += parqCard();
  if (isTrainDay(new Date().getDay()) && !doneToday()) h += '<button class="btn go" data-act="start">Lancer la séance' + (isLight() ? ' (allégée)' : '') + '</button>';
  else h += '<p class="small">Prochaine séance : ' + nextTrainLabel() + '. Tu peux en lancer une quand même dans l\'onglet Séance.</p>';
  h += '<div class="card"><h2>Bilan du jour</h2><div class="grid2">' +
    '<label class="f">Poids (kg, à jeun)<input type="number" inputmode="decimal" step="0.1" data-log="weight" value="' + (l.weight || '') + '" placeholder="' + fmt(currentWeight()) + '"></label>' +
    '<label class="f">Sommeil (heures)<input type="number" inputmode="decimal" step="0.5" data-log="sleep" value="' + (l.sleep || '') + '" placeholder="7"></label>' +
    '<label class="f">Pas (montre ou téléphone)<input type="number" inputmode="numeric" data-log="steps" value="' + (l.steps || '') + '" placeholder="6000"></label>' +
    (P.cigs ? '<label class="f">Cigarettes fumées<input type="number" inputmode="numeric" data-log="cigs" value="' + (l.cigs === undefined ? '' : l.cigs) + '" placeholder="20"></label>' : '<span></span>') +
    '</div><label class="f">Énergie (1 = à plat, 5 = au top)</label><div class="seg">' + energy + '</div></div>';
  var wt = waterTarget();
  h += '<div class="card"><div class="row"><h2 class="grow">Eau</h2><b>' + fmt(water / 1000, 2) + ' / ' + fmt(wt / 1000, 2) + ' L</b></div><div class="bar"><i class="' + (water >= wt ? 'ok' : '') + '" style="width:' + Math.min(100, water * 100 / wt) + '%"></i></div><p class="small">' + waterNote(water, wt) + ' Objectif calculé : 30 ml par kg, plus 500 ml les jours de séance.</p>' +
    '<div class="row"><button class="btn alt sm grow" data-act="water" data-n="250">+ 250 ml</button><button class="btn alt sm" data-act="water" data-n="-250">− 250</button></div></div>' + tabacCard();
  var eaten = eatenKcal(), tg = kcalTarget();
  h += '<div class="card"><div class="row"><h2 class="grow">Repas validés</h2><b>' + eaten + ' / ' + tg + ' kcal</b></div><div class="bar"><i class="' + (eaten >= tg * 0.95 ? 'ok' : '') + '" style="width:' + Math.min(100, eaten / tg * 100) + '%"></i></div></div>';
  if (sug) {
    h += '<div class="card"><h2>Ajustement conseillé</h2><p>' + sug.msg +
      '</p><div class="row"><button class="btn sm grow" data-act="adj" data-v="' + sug.v + '">Appliquer</button><button class="btn alt sm" data-act="adjno">Plus tard</button></div></div>';
  }
  if (!P.onboarded) h += '<div class="card"><h2>Complète ton profil</h2><p class="small">Genre, objectif (prise de masse, perte de poids, tonification, maintien), âge et mensurations : l\'application adapte les calories et les conseils.</p><button class="btn alt" data-act="obopen">Compléter mon profil</button></div>';
  return h;
}

function riskHtml(e) {
  return '<div class="warn"><b>⚠ Précautions.</b> ' + esc(e.risk[0]) + ' ' + esc(e.risk[1]) + '<br><b>Arrête-toi si :</b> ' + esc(e.risk[2]) + '</div>';
}
function exCard(e) {
  var L = lv(e.id), names = levelsFor(e), li = Math.min(L.level, names.length - 1), lock = exLocked(e);
  var tgt = e.timed ? (e.lo + L.off) + '–' + (e.hi + L.off) + ' s' : (e.lo + L.off) + '–' + (e.hi + L.off) + ' reps';
  var h = '<div class="card' + (lock ? ' locked' : '') + '" data-ex="' + e.id + '"><div class="row"><h3 class="grow">' + esc(names[li]) + '</h3>' + (e.adv ? '<span class="pill">avancé</span>' : '') + '<span class="pill on">' + tgt + '</span></div>' + animBlock(e.id) + '<p class="small">' + esc(e.tip) + '</p>';
  if (e.risk) h += riskHtml(e);
  if (lock) return h + '<p class="small"><b>Réservé aux niveaux avancés.</b> Il se débloque quand tes pompes et tes squats ont bien progressé, ou dans Réglages (Débloquer les exercices avancés).</p>' + '</div>';
  h += '<label class="meal"><input type="checkbox" data-act="extra" data-id="' + e.id + '"' + (selected(e) ? ' checked' : '') + '><span><b>Dans ma séance complète</b><br><span class="small">Décoche pour le retirer (3 exercices minimum). Il reste disponible en « Lancer seul ».</span></span></label>';
  return h + mtHtml(e, e.hi + L.off) + exCfgHtml(e) + '</div>';
}
function viewTrain() {
  var n = EX.filter(inSession).length;
  var h = '<h1>Séance</h1><p class="small">Semaine ' + wkNo() + ' · ' + (wkNo() <= 2 ? '3 séries' : '4 séries') + ' sur les exercices principaux · ' + n + ' exercices dans la séance complète. Jours prévus : ' + P.days.slice().sort().map(function (d) { return JOURS[d]; }).join(', ') + '.</p>';
  h += painCard();
  h += '<button class="btn go" data-act="start">Lancer la séance' + (isLight() ? ' (allégée)' : '') + '</button>';
  h += '<button class="btn" data-act="quick">Séance express</button><p class="small">Environ 15 minutes : échauffement court, 2 séries par exercice. Pas de montée de niveau avec cette version.</p>';
  ZONES.forEach(function (z) {
    var list = EX.filter(function (e) { return e.zone === z.id; });
    if (!list.length) return;
    h += '<div class="zonehead"><h2>' + z.name + '</h2><span class="pill">' + list.length + '</span></div><div class="cards2">' + list.map(exCard).join('') + '</div>';
  });
  var last = D.sessions.slice(-5).reverse();
  if (last.length) h += '<div class="card"><h2>Dernières séances</h2><ul class="list">' + last.map(function (s) {
    return '<li><span>' + s.date + (s.free ? ' · libre' : s.partial ? ' · incomplète' : '') + '</span><span>' + (s.free ? '' : s.min + ' min · ') + s.sets + ' série' + (s.sets > 1 ? 's' : '') + '</span></li>';
  }).join('') + '</ul></div>';
  return h;
}

function dietCard() {
  var T = [['noEgg', 'Sans œufs'], ['noMilk', 'Sans lait'], ['noNuts', 'Sans fruits à coque / cacahuètes'], ['noGluten', 'Sans gluten'], ['veg', 'Végétarien (sans viande ni poisson)']];
  var h = '<div class="card"><h2>Régime et budget</h2><p class="small">Les repas et les courses s\'adaptent. Halal : le poulet et les sardines du plan conviennent, choisis-les halal chez ton boucher.</p>';
  T.forEach(function (x) { h += '<label class="meal"><input type="checkbox" data-act="diet" data-k="' + x[0] + '"' + (P[x[0]] ? ' checked' : '') + '><span>' + x[1] + '</span></label>'; });
  return h + '<label class="f">Budget</label>' + shopSeg('budget', P.budget, [['normal', 'Normal'], ['serre', 'Serré (moins de viande)']]) + '</div>';
}
function viewMeals() {
  var l = log(), m = mealsList(), c = l.meals || [];
  var h = '<h1>Repas du jour</h1><p class="small">' + OBJ[obj()] + ' · cible : environ ' + kcalTarget() + ' kcal et ' + protTarget() + ' g de protéines. Coche chaque repas quand tu l\'as fini.</p><div class="card">';
  m.forEach(function (x, i) {
    h += '<label class="meal"><input type="checkbox" data-act="meal" data-i="' + i + '"' + (c[i] ? ' checked' : '') + '><span><span class="t">' + x.t + '</span><br>' + esc(x.x) + '</span><span class="k">' + mealK(x) + ' kcal<br>' + mealP(x) + ' g</span></label>';
  });
  if (obj() !== 'masse' || (P.onboarded && Math.abs(mealFactor() - 1) > 0.05)) h += '<p class="small">Portions ajustées à ton objectif (environ ' + Math.round(mealFactor() * 100) + ' % du plan de base) : réduis surtout le riz, le pain, l\'huile et le beurre de cacahuète ou d\'amlou, garde les œufs, le poulet et les légumes. Plancher : ' + kcalFloor() + ' kcal.</p>';
  h += '</div><div class="card"><h2>Variantes</h2><ul class="list"><li><span>Pas de poulet</span><span>4 sardines ou 200 g de lentilles</span></li><li><span>Peu d\'appétit</span><span>Bois le smoothie en plus</span></li><li><span>Budget serré</span><span>Œufs, légumineuses, sardines</span></li></ul></div>';
  h += dietCard() + shopCard();
  return h;
}

/* © KVES · Coach-Mass-KVES */
/* ====================== bilan de la semaine (7 derniers jours) ====================== */
function weekReview() {
  var t = dnum(today()), days = [], i, x, s, r = { planned: 0, done: 0, sl: [], en: [], mealPct: [], kc: [], w: [] };
  for (i = 6; i >= 0; i--) { x = new Date(); x.setDate(x.getDate() - i); days.push({ s: dstr(x), dow: x.getDay() }); }
  var ml = mealsList();
  days.forEach(function (d) {
    var l = D.logs[d.s] || {};
    if (isTrainDay(d.dow) && d.s >= P.start) { r.planned++; if (D.sessions.some(function (q) { return q.date === d.s && !q.partial; })) r.done++; }
    if (+l.sleep) r.sl.push(+l.sleep);
    if (+l.energy) r.en.push(+l.energy);
    if (+l.weight) r.w.push(+l.weight);
    if (l.meals && l.meals.some(function (c) { return c; })) {
      var k = 0, n = 0; ml.forEach(function (m, j) { if (l.meals[j]) { n++; k += mealK(m); } });
      r.mealPct.push(Math.round(100 * n / ml.length)); r.kc.push(k);
    }
  });
  function avg(a) { return a.length ? a.reduce(function (p, c) { return p + c; }, 0) / a.length : null; }
  r.sleep = avg(r.sl); r.energy = avg(r.en); r.meals = avg(r.mealPct); r.kcal = avg(r.kc);
  r.dw = r.w.length >= 2 ? r.w[r.w.length - 1] - r.w[0] : null;
  r.rpe = avg(D.sessions.filter(function (q) { return !q.partial && !q.free && +q.rpe > 0 && q.date >= days[0].s; }).map(function (q) { return +q.rpe; }));
  r.advice = weekAdvice(r);
  return r;
}
function weekAdvice(r) {
  var o = obj();
  if (r.rpe !== null && r.rpe >= 4.5) return 'Tes séances sont ressenties très dures : allège ou prévois une semaine d\'allègement.';
  if (r.planned && r.done < r.planned) return 'Il manque ' + (r.planned - r.done) + ' séance(s). Cette semaine : place-les à l\'avance dans ton agenda, même en version légère.';
  if (r.sleep !== null && r.sleep < 6.5) return 'Ton sommeil moyen est court. Gagne une heure de coucher avant de chercher plus de charge : c\'est là que le muscle se construit.';
  if (r.meals !== null && r.meals < 70) return 'Tu as coché moins de 70 % de tes repas. Prépare tes repas du lendemain la veille.';
  if (r.dw !== null) {
    if (o === 'masse' && r.dw < -0.3) return 'Ton poids baisse alors que tu veux prendre de la masse : ajoute un repas ou une collation.';
    if (o === 'perte' && r.dw > 0.3) return 'Ton poids monte alors que tu veux perdre : surveille le riz, le pain et l\'huile.';
  }
  if (r.rpe !== null && r.rpe <= 2 && r.planned && r.done === r.planned) return 'Tes séances te paraissent faciles : ajoute une répétition par série ou passe à la variante suivante.';
  if (r.planned && r.done === r.planned) return 'Semaine complète. Tiens le même rythme et vise une répétition de plus par série.';
  return 'Continue : coche tes repas, pèse-toi chaque dimanche et note ton sommeil.';
}
function weekText(r) {
  return 'Bilan de la semaine (Coach-Mass-KVES)\nSéances : ' + r.done + ' sur ' + r.planned + '\nRepas cochés : ' + (r.meals === null ? '—' : Math.round(r.meals) + ' %') +
    '\nSommeil moyen : ' + (r.sleep === null ? '—' : fmt(r.sleep) + ' h') + '\nÉnergie moyenne : ' + (r.energy === null ? '—' : fmt(r.energy) + ' / 5') +
    '\nPoids : ' + (r.dw === null ? '—' : (r.dw > 0 ? '+' : '') + fmt(r.dw) + ' kg') + '\nConseil : ' + r.advice;
}
var WKI = { w: false };
function weekImage(cb) {
  var r = weekReview(), W = 1080, H = 1350, c = document.createElement('canvas'), x = c.getContext('2d'), L = [], y = 620;
  c.width = W; c.height = H;
  x.fillStyle = '#12151b'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#ff9a4d'; x.fillRect(0, 0, W, 14);
  x.textAlign = 'center'; x.fillStyle = '#ffffff';
  x.font = 'bold 64px system-ui, sans-serif'; x.fillText(trText('Ma semaine'), W / 2, 150);
  x.fillStyle = '#9aa3b2'; x.font = '40px system-ui, sans-serif'; x.fillText(trText('Semaine') + ' ' + wkNo(), W / 2, 215);
  x.fillStyle = '#ff9a4d'; x.font = 'bold 260px system-ui, sans-serif'; x.fillText(r.done + '/' + r.planned, W / 2, 470);
  x.fillStyle = '#ffffff'; x.font = '48px system-ui, sans-serif'; x.fillText(trText('séances'), W / 2, 575);
  if (r.meals !== null) L.push([trText('repas cochés'), Math.round(r.meals) + ' %']);
  if (r.sleep !== null) L.push([trText('sommeil moy.'), fmt(r.sleep) + ' h']);
  if (r.energy !== null) L.push([trText('énergie moy.'), fmt(r.energy) + '/5']);
  if (r.rpe !== null) L.push([trText('effort moy.'), fmt(r.rpe) + '/5']);
  if (WKI.w && r.dw !== null) L.push([trText('poids'), (r.dw > 0 ? '+' : '') + fmt(r.dw) + ' kg']);
  L.forEach(function (it) {
    y += 100;
    x.textAlign = 'left'; x.fillStyle = '#9aa3b2'; x.font = '44px system-ui, sans-serif'; x.fillText(it[0], 150, y);
    x.textAlign = 'right'; x.fillStyle = '#ffffff'; x.font = 'bold 52px system-ui, sans-serif'; x.fillText(it[1], W - 150, y);
  });
  x.textAlign = 'center'; x.fillStyle = '#9aa3b2'; x.font = '34px system-ui, sans-serif'; x.fillText('Coach-Mass-KVES · © KVES', W / 2, H - 70);
  c.toBlob(function (b) { cb(b); }, 'image/png');
}
document.addEventListener('change', function (ev) { var t = ev.target; if (t && t.getAttribute && t.getAttribute('data-wki') === 'w') { WKI.w = !!t.checked; } });
document.addEventListener('click', function (ev) {
  var t = ev.target && ev.target.closest ? ev.target.closest('[data-act="weekimg"]') : null;
  if (!t) return;
  weekImage(function (b) {
    if (!b) return;
    var name = 'bilan-semaine-' + wkNo() + '.png', f = null;
    function dl() { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
    try { f = new File([b], name, { type: 'image/png' }); } catch (e) { f = null; }
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: 'Coach-Mass-KVES' }).catch(function (e) { if (!e || e.name !== 'AbortError') dl(); });
    else dl();
  });
});
function weekCard() {
  var r = weekReview();
  function st(v, u) { return '<div class="stat"><b>' + v + '</b><span>' + u + '</span></div>'; }
  return '<div class="card"><h2>Bilan de la semaine</h2><p class="small">Les 7 derniers jours.</p><div class="stats">' +
    st(r.done + '/' + r.planned, 'séances') + st(r.meals === null ? '—' : Math.round(r.meals) + ' %', 'repas cochés') + st(r.sleep === null ? '—' : fmt(r.sleep) + ' h', 'sommeil moy.') + '</div><div class="stats">' +
    st(r.energy === null ? '—' : fmt(r.energy) + '/5', 'énergie moy.') + st(r.kcal === null ? '—' : Math.round(r.kcal / 10) * 10, 'kcal/jour (cochés)') + st(r.dw === null ? '—' : (r.dw > 0 ? '+' : '') + fmt(r.dw), 'kg') + '</div>' +
    (r.rpe === null ? '' : '<div class="stats">' + st(fmt(r.rpe) + '/5', 'effort moy.') + '</div>') +
    '<p><b>Conseil du coach :</b> ' + esc(r.advice) + '</p><button class="btn alt sm" data-act="weekcopy">Copier le bilan</button> <button class="btn alt sm" data-act="weekimg">Partager en image</button><label class="meal"><input type="checkbox" data-wki="w"' + (WKI.w ? ' checked' : '') + '><span>Inclure l\'évolution du poids dans l\'image</span></label></div>';
}
/* © KVES · Coach-Mass-KVES */
var CH = { range: 56, ex: 'total', mk: 'taille' };
var MKEYS = ['poitrine', 'taille', 'hanches', 'bras', 'cuisse', 'mollet'], MLAB = { poitrine: 'Poitrine', taille: 'Taille', hanches: 'Hanches', bras: 'Bras', cuisse: 'Cuisse', mollet: 'Mollet' };
function exUsed(e) { return e.core || D.sessions.some(function (s) { return (s.logs || []).some(function (l) { return l.id === e.id; }); }); }
function measChart(k) {
  var pts = D.measures.filter(function (m) { return m[k]; }).map(function (m) { return { d: m.date, v: +m[k] }; });
  if (pts.length < 2) return '<p class="small">Courbe : enregistre au moins 2 mesures de « ' + MLAB[k].toLowerCase() + ' ».</p>';
  var W = 340, H = 130, ml = 34, mr = 10, mt = 12, mb = 22, vs = pts.map(function (p) { return p.v; }), lo = Math.floor(Math.min.apply(null, vs) - 1), hi = Math.ceil(Math.max.apply(null, vs) + 1);
  var x0 = dnum(pts[0].d), x1 = Math.max(dnum(pts[pts.length - 1].d), x0 + 1);
  function X(d) { return ml + (dnum(d) - x0) / (x1 - x0) * (W - ml - mr); }
  function Y(v) { return mt + (hi - v) / (hi - lo) * (H - mt - mb); }
  var s = '<svg class="minichart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Courbe : ' + MLAB[k] + '">';
  s += '<text x="' + (ml - 4) + '" y="' + (mt + 4) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + hi + '</text><text x="' + (ml - 4) + '" y="' + (H - mb) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + lo + '</text>';
  s += '<polyline fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" points="' + pts.map(function (p) { return X(p.d).toFixed(1) + ',' + Y(p.v).toFixed(1); }).join(' ') + '"/>';
  pts.forEach(function (p) { s += '<circle cx="' + X(p.d).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="3" fill="var(--accent)"/>'; });
  s += '<text x="' + ml + '" y="' + (H - 6) + '" fill="var(--muted)" font-size="10">' + sdate(pts[0].d) + '</text><text x="' + (W - mr) + '" y="' + (H - 6) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + sdate(pts[pts.length - 1].d) + '</text></svg>';
  return s;
}
var delArmed = -1;
function sdate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
function ldate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); }
function inRange(d) { return !CH.range || dnum(today()) - dnum(d) <= CH.range; }
function niceMax(v) {
  if (!(v > 0)) return 10;
  var pw = Math.pow(10, Math.floor(Math.log10(v))), n = v / pw;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pw;
}
function tickStr(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }

function weightChart() {
  var a = weights();
  if (!a.some(function (x) { return x.d === P.start; })) a.unshift({ d: P.start, w: +P.w0 });
  a.sort(function (x, y) { return x.d < y.d ? -1 : 1; });
  a = a.filter(function (x) { return inRange(x.d); });
  if (a.length < 2) return { svg: '<p class="small">Pas assez de pesées sur cette période. Note ton poids dans le bilan du jour.</p>', pts: a };
  var W = 340, H = 170, ml = 38, mr = 10, mt = 18, mb = 26, goal = +P.goal;
  var ws = a.map(function (x) { return x.w; });
  var lo = Math.floor(Math.min.apply(null, ws.concat([goal])) - 1), hi = Math.ceil(Math.max.apply(null, ws.concat([goal])) + 1);
  var step = Math.max(1, Math.ceil((hi - lo) / 3)); hi = lo + 3 * step;
  var x0 = dnum(a[0].d), x1 = Math.max(dnum(a[a.length - 1].d), x0 + 7);
  function X(d) { return ml + (dnum(d) - x0) / (x1 - x0) * (W - ml - mr); }
  function Y(w) { return mt + (hi - w) / (hi - lo) * (H - mt - mb); }
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img" aria-label="Évolution du poids">', k;
  for (k = 0; k <= 3; k++) {
    var v = lo + k * step, y = Y(v).toFixed(1);
    s += '<line x1="' + ml + '" y1="' + y + '" x2="' + (W - mr) + '" y2="' + y + '" stroke="var(--line)"/><text x="' + (ml - 5) + '" y="' + (+y + 3.5) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + v + '</text>';
  }
  var gy = Y(goal).toFixed(1);
  s += '<line x1="' + ml + '" y1="' + gy + '" x2="' + (W - mr) + '" y2="' + gy + '" stroke="var(--ok)" stroke-width="1.5" stroke-dasharray="5 4"/>';
  s += '<text x="' + (W - mr) + '" y="' + (+gy - 4) + '" text-anchor="end" fill="var(--ok)" font-size="10">objectif ' + tickStr(goal) + ' kg</text>';
  s += '<polyline points="' + a.map(function (p) { return X(p.d).toFixed(1) + ',' + Y(p.w).toFixed(1); }).join(' ') + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>';
  a.forEach(function (p, i) { s += '<circle cx="' + X(p.d).toFixed(1) + '" cy="' + Y(p.w).toFixed(1) + '" r="' + (i === a.length - 1 ? 4.5 : 2.5) + '" fill="var(--accent)"/>'; });
  var last = a[a.length - 1], lx = X(last.d);
  s += '<text x="' + (lx > W - 50 ? lx : lx).toFixed(1) + '" y="' + (Y(last.w) - 9).toFixed(1) + '" text-anchor="' + (lx > W - 50 ? 'end' : 'middle') + '" fill="var(--fg)" font-size="11" font-weight="700">' + tickStr(last.w) + ' kg</text>';
  s += '<text x="' + ml + '" y="' + (H - 8) + '" fill="var(--muted)" font-size="10">' + sdate(a[0].d) + '</text>';
  s += '<text x="' + (W - mr) + '" y="' + (H - 8) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + sdate(a[a.length - 1].d) + '</text></svg>';
  return { svg: s, pts: a };
}

function barChart(items, unit) {
  if (!items.length) return '<p class="small">Aucune séance terminée sur cette période. Fais une séance pour voir ta courbe.</p>';
  var W = 340, H = 170, ml = 38, mr = 10, mt = 18, mb = 26, n = items.length;
  var mx = niceMax(Math.max.apply(null, items.map(function (x) { return x.v; })) * 1.08);
  var iw = (W - ml - mr) / n, bw = Math.min(30, iw * 0.7);
  function Y(v) { return mt + (1 - v / mx) * (H - mt - mb); }
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img" aria-label="Performance par séance">', k;
  for (k = 0; k <= 2; k++) {
    var v = mx * k / 2, y = Y(v).toFixed(1);
    s += '<line x1="' + ml + '" y1="' + y + '" x2="' + (W - mr) + '" y2="' + y + '" stroke="var(--line)"/><text x="' + (ml - 5) + '" y="' + (+y + 3.5) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + tickStr(v) + '</text>';
  }
  items.forEach(function (it, i) {
    var cx = ml + (i + 0.5) * iw, y = Y(it.v), isLast = i === n - 1;
    s += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(1, H - mb - y).toFixed(1) + '" rx="3" fill="var(--accent)" opacity="' + (isLast ? 1 : 0.55) + '"/>';
    if (n <= 10 || isLast) s += '<text x="' + cx.toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" text-anchor="middle" fill="var(--fg)" font-size="10" font-weight="700">' + it.v + '</text>';
  });
  s += '<text x="' + ml + '" y="' + (H - 8) + '" fill="var(--muted)" font-size="10">' + sdate(items[0].d) + '</text>';
  if (n > 1) s += '<text x="' + (W - mr) + '" y="' + (H - 8) + '" text-anchor="end" fill="var(--muted)" font-size="10">' + sdate(items[n - 1].d) + '</text>';
  return s + '</svg>';
}

function perfItems() {
  var out = [];
  D.sessions.forEach(function (s) {
    if (s.partial || !inRange(s.date)) return;
    var v = 0, has = false;
    (s.logs || []).forEach(function (l) {
      var e = FIGS[l.id];
      if (!e) return;
      if (CH.ex === 'total') { if (!e.timed) { v += l.reps; has = true; } }
      else if (l.id === CH.ex) { v += l.reps; has = true; }
    });
    if (has) out.push({ d: s.date, v: v });
  });
  return out;
}

function weekRows() {
  var cw = wkNo(), wk = {};
  function slot(w) { return wk[w] || (wk[w] = { n: 0, reps: 0, ws: [] }); }
  D.sessions.forEach(function (s) {
    var w = Math.max(1, Math.floor((dnum(s.date) - dnum(P.start)) / 7) + 1), o = slot(w);
    if (!s.partial) o.n++;
    (s.logs || []).forEach(function (l) { var e = FIGS[l.id]; if (e && !e.timed) o.reps += l.reps; });
  });
  Object.keys(D.logs).forEach(function (d) {
    if (!D.logs[d].weight) return;
    var w = Math.max(1, Math.floor((dnum(d) - dnum(P.start)) / 7) + 1);
    slot(w).ws.push(+D.logs[d].weight);
  });
  var from = Math.max(1, CH.range ? cw - Math.ceil(CH.range / 7) + 1 : 1, cw - 25), rows = [], w;
  for (w = cw; w >= from; w--) {
    var o = wk[w] || { n: 0, reps: 0, ws: [] };
    rows.push('<tr><th scope="row">S' + w + (w === cw ? ' · en cours' : '') + '</th><td class="n">' + o.n + ' / ' + P.days.length + '</td><td class="n">' + o.reps + '</td><td class="n">' + (o.ws.length ? fmt(o.ws.reduce(function (a, b) { return a + b; }, 0) / o.ws.length) + ' kg' : '—') + '</td></tr>');
  }
  return rows.join('');
}

function viewTrack() {
  var cur = currentWeight(), sl = slopeWeek(28), goal = +P.goal;
  var toward = goal >= cur ? sl : (sl === null ? null : -sl), eta = toward && toward > 0.05 && Math.abs(goal - cur) > 0.05 ? Math.ceil(Math.abs(goal - cur) / toward) + ' sem.' : '—';
  var h = '<h1>Suivi</h1><div class="card"><div class="stats"><div class="stat"><b>' + fmt(cur) + '</b><span>kg actuel</span></div><div class="stat"><b>' + fmt(Math.abs(goal - cur)) + '</b><span>kg restants</span></div><div class="stat"><b>' + eta + '</b><span>estimation</span></div></div>' +
    '<p class="small">Rythme mesuré : ' + (sl === null ? 'pas assez de pesées (3 sur 10 jours minimum)' : fmt(sl, 2) + ' kg par semaine') + '. ' + (obj() === 'masse' ? 'Cible saine : 0,25 à 0,5 kg par semaine.' : obj() === 'perte' ? 'Perte saine : 0,25 à 0,5 kg par semaine, jamais plus.' : 'Vise un poids stable (moins de 0,3 kg par semaine).') + '</p></div>';
  h += weekCard();
  h += '<div class="seg" role="group" aria-label="Période">' + [[28, '4 sem.'], [56, '8 sem.'], [182, '6 mois'], [0, 'Tout']].map(function (r) {
    return '<button data-act="range" data-v="' + r[0] + '" class="' + (CH.range === r[0] ? 'on' : '') + '">' + r[1] + '</button>';
  }).join('') + '</div>';
  var wc = weightChart(), dw = '';
  if (wc.pts.length >= 2) { var df = wc.pts[wc.pts.length - 1].w - wc.pts[0].w; dw = '<p class="small">Sur la période : ' + (df > 0 ? '+' : '') + fmt(df) + ' kg (de ' + fmt(wc.pts[0].w) + ' à ' + fmt(wc.pts[wc.pts.length - 1].w) + ' kg).</p>'; }
  h += '<div class="card"><h2>Évolution du poids</h2>' + wc.svg + dw + '</div>';
  var chips = '<button class="chip' + (CH.ex === 'total' ? ' on' : '') + '" data-act="exsel" data-v="total">Total</button>' + EX.filter(exUsed).map(function (e) {
    return '<button class="chip' + (CH.ex === e.id ? ' on' : '') + '" data-act="exsel" data-v="' + e.id + '">' + esc(e.name) + '</button>';
  }).join('');
  var it = perfItems(), ex = FIGS[CH.ex], unit = ex && ex.timed ? 's' : 'reps', pd = '';
  if (it.length >= 2) { var d2 = it[it.length - 1].v - it[0].v; pd = '<p class="small">Du début à la dernière séance de la période : ' + it[0].v + ' → ' + it[it.length - 1].v + ' ' + unit + ' (' + (d2 > 0 ? '+' : '') + d2 + ').</p>'; }
  h += '<div class="card"><h2>Performance par séance</h2><div class="chips">' + chips + '</div><p class="small">' + (CH.ex === 'total' ? 'Total des répétitions (hors gainage)' : esc(ex.name) + ' : ' + (ex.timed ? 'secondes tenues' : 'répétitions') + ' cumulées sur la séance') + '</p>' + barChart(it, unit) + pd + '</div>';
  h += '<div class="card"><h2>Semaine par semaine</h2><div class="table-wrap"><table><thead><tr><th>Semaine</th><th class="n">Séances</th><th class="n">Reps</th><th class="n">Poids moy.</th></tr></thead><tbody>' + weekRows() + '</tbody></table></div></div>';
  h += '<div class="card"><h2>Mensurations</h2><p class="small">Toutes les 2 semaines, matin à jeun, en cm.</p><div class="grid2">' +
    MKEYS.map(function (k) { return '<label class="f">' + MLAB[k] + '<input type="number" inputmode="decimal" step="0.5" id="m_' + k + '"></label>'; }).join('') +
    '</div><button class="btn sm" data-act="measure">Enregistrer</button>';
  if (D.measures.length) {
    var f = D.measures[0], z = D.measures[D.measures.length - 1];
    h += '<ul class="list">' + MKEYS.map(function (k) {
      var vals = D.measures.filter(function (m) { return m[k]; }), dd = vals.length > 1 ? vals[vals.length - 1][k] - vals[0][k] : null, last = vals.length ? vals[vals.length - 1][k] : null;
      return '<li><span>' + MLAB[k] + '</span><span>' + (last || '—') + ' cm' + (dd !== null ? ' (' + (dd > 0 ? '+' : '') + fmt(dd) + ')' : '') + '</span></li>';
    }).join('') + '</ul><p class="small">Dernière mesure : ' + z.date + '</p>';
    h += '<div class="chips">' + MKEYS.map(function (k) { return '<button class="chip' + (CH.mk === k ? ' on' : '') + '" data-act="mksel" data-v="' + k + '">' + MLAB[k] + '</button>'; }).join('') + '</div>' + measChart(CH.mk);
  }
  h += '</div>' + phCard() + '<div class="card"><h2>Sauvegarde</h2><p class="small">Tes données restent sur ce téléphone. Exporte-les de temps en temps.</p><div class="row"><button class="btn alt sm grow" data-act="export">Exporter</button><button class="btn alt sm grow" data-act="import">Importer</button></div></div>';
  return h;
}

function viewHistory() {
  var ss = D.sessions, h = '<h1>Historique</h1>';
  if (!ss.length) return h + '<div class="card"><p>Aucune séance enregistrée pour le moment. Chaque série que tu fais est conservée ici, avec la date, la variante et tes répétitions.</p></div>';
  var done = ss.filter(function (x) { return !x.partial; }), mins = 0, reps = 0;
  ss.forEach(function (x) { mins += x.min || 0; (x.logs || []).forEach(function (l) { var e = FIGS[l.id]; if (e && !e.timed) reps += l.reps; }); });
  h += '<div class="card"><div class="stats"><div class="stat"><b>' + done.length + '</b><span>séances</span></div><div class="stat"><b>' + Math.round(mins / 60 * 10) / 10 + '</b><span>heures</span></div><div class="stat"><b>' + reps + '</b><span>répétitions</span></div></div></div>';
  var rec = '';
  EX.forEach(function (e) {
    var best = null, first = null, lastv = null;
    ss.forEach(function (x) {
      var tot = 0, has = false;
      (x.logs || []).forEach(function (l) {
        if (l.id !== e.id) return;
        has = true; tot += l.reps;
        if (!best || l.reps > best.v) best = { v: l.reps, d: x.date };
      });
      if (has && !x.partial) { if (first === null) first = tot; lastv = tot; }
    });
    if (!best) return;
    var u = e.timed ? ' s' : '';
    rec += '<li><span>' + esc(e.name) + '</span><span>meilleure série ' + best.v + u + ' · ' + sdate(best.d) + (first !== null && lastv !== null && first !== lastv ? '<br>total par séance : ' + first + ' → ' + lastv + u : '') + '</span></li>';
  });
  if (rec) h += '<div class="card"><h2>Records et progression</h2><ul class="list">' + rec + '</ul></div>';
  h += '<h2>Toutes les séances</h2>';
  for (var i = ss.length - 1; i >= 0; i--) {
    var s = ss[i], g = {}, rows = '', tot = 0;
    (s.logs || []).forEach(function (l) { (g[l.id] = g[l.id] || []).push(l); var e = FIGS[l.id]; if (e && !e.timed) tot += l.reps; });
    EX.forEach(function (e) {
      if (!g[e.id]) return;
      var arr = g[e.id].slice().sort(function (a, b) { return a.sn - b.sn; });
      rows += '<li><span>' + esc(arr[0].name || e.name) + '</span><span>' + arr.map(function (l) { return l.reps; }).join(' · ') + (e.timed ? ' s' : '') + '</span></li>';
    });
    h += '<details class="card"' + (delArmed === i ? ' open' : '') + '><summary><span class="grow">' + esc(ldate(s.date)) + '</span>' +
      (s.free ? '<span class="pill">libre</span>' : s.partial ? '<span class="pill">incomplète</span>' : '') + (s.light ? '<span class="pill">allégée</span>' : '') + '</summary>' +
      '<p class="small">' + s.min + ' min · ' + s.sets + ' séries · ' + tot + ' répétitions · semaine ' + (s.week || '—') + '</p>' +
      '<ul class="list">' + (rows || '<li><span>Aucune série enregistrée</span></li>') + '</ul>' +
      '<button class="btn bad sm" data-act="delsession" data-i="' + i + '">' + (delArmed === i ? 'Confirmer la suppression' : 'Supprimer cette séance') + '</button></details>';
  }
  return h;
}

/* © KVES · Coach-Mass-KVES */
function tog(key, label, hint) {
  return '<label class="meal"><input type="checkbox" data-set="' + key + '"' + (P[key] ? ' checked' : '') + '><span><b>' + label + '</b>' + (hint ? '<br><span class="small">' + hint + '</span>' : '') + '</span></label>';
}
function settingsRaw() {
  var h = '<button class="btn alt sm back" data-act="tab" data-v="more">← Plus</button><h1>Réglages</h1><div class="card"><h2>Jours de séance</h2><div class="seg">' +
    [1, 2, 3, 4, 5, 6, 0].map(function (d) { return '<button data-act="day" data-d="' + d + '" class="' + (isTrainDay(d) ? 'on' : '') + '">' + JOURS[d] + '</button>'; }).join('') + '</div></div>';
  h += '<div class="card"><h2>Tabac</h2>' + tog('tabac', 'Suivre ma consommation de tabac', 'Facultatif, privé, sans jugement : un simple compteur par jour') + '</div>';
  h += '<div class="card"><h2>Coach</h2>' + tog('voice', 'Voix du coach', 'Parle dans tes écouteurs') + tog('voiceFr', 'Voix toujours en français', 'Même si l\'application est dans une autre langue') + tog('vib', 'Vibrations') + '<label class="f">Intensité des vibrations</label><div class="seg" role="group">' + [[1, 'Normale'], [2, 'Forte'], [3, 'Très forte']].map(function (x) { return '<button data-act="vibpow" data-v="' + x[0] + '" class="' + ((P.vibLevel || 2) === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' + tog('count', 'Compter les répétitions à voix haute', 'Le coach donne le rythme') + tog('auto', 'Enchaînement automatique', 'Mains libres : le coach relance après le repos') +
    '<div class="grid2"><label class="f">Secondes par répétition<input type="number" inputmode="numeric" min="2" max="6" data-set="tempo" value="' + P.tempo + '"></label>' +
    '<label class="f">Repos en plus (secondes)<input type="number" inputmode="numeric" min="0" max="60" step="5" data-set="restBonus" value="' + P.restBonus + '"></label></div>' +
    '<div class="row"><button class="btn alt sm" data-act="testvoice">Tester la voix</button><button class="btn alt sm" data-act="testvib">Tester la vibration</button></div></div>';
  h += '<div class="card"><h2>Signaux sonores</h2>' + tog('sound', 'Sons activés', 'Bips de fin de série, d\'exercice et de repos') + tog('metro', 'Métronome de cadence', 'Bip grave à la descente, bip aigu à la montée') + tog('warn10', 'Alerte 10 secondes avant la fin du repos') +
    '<label class="f">Volume : ' + P.vol + ' sur 10<input type="range" min="1" max="10" step="1" data-set="vol" value="' + P.vol + '" aria-label="Volume des sons"></label>' +
    '<p class="small">Teste chaque signal :</p><div class="chips">' + [['setend', 'Fin de série'], ['exend', 'Fin d\'exercice'], ['go', 'Fin du repos'], ['warn', 'Alerte 10 s'], ['count', 'Compte à rebours'], ['beat', 'Cadence'], ['fanfare', 'Fin de séance']].map(function (x) {
      return '<button class="chip" data-act="testsnd" data-v="' + x[0] + '">' + x[1] + '</button>';
    }).join('') + '</div></div>';
  h += '<div class="card"><h2>Profil et objectif</h2><p class="small">' + OBJ[obj()] + ' · ' + GEN[P.gender || 'n'] + ' · ' + P.age + ' ans · ' + P.height + ' cm</p><button class="btn alt sm" data-act="obopen">Modifier mon profil</button><button class="btn alt sm" data-act="parqopen">Questionnaire de santé</button><div class="grid2">' +
    '<label class="f">Poids de départ (kg)<input type="number" inputmode="decimal" step="0.1" data-set="w0" value="' + P.w0 + '"></label>' +
    '<label class="f">Objectif (kg)<input type="number" inputmode="decimal" step="0.5" data-set="goal" value="' + P.goal + '"></label>' +
    '<label class="f">Date de départ<input type="text" data-set="start" value="' + P.start + '"></label></div>' +
    tog('hasBar', 'J\'ai une barre de traction', 'Ajoute les tractions au tirage') + tog('advOn', 'Débloquer les exercices avancés', 'Pompes diamant, dips, squat sauté : à n\'activer que si tu es à l\'aise') + tog('cigs', 'Suivre mes cigarettes', 'Un compteur dans le bilan du jour') + '</div>';
  h += mealTimesCard();
  h += rmCard();
  h += '<div class="card"><h2>Langue</h2>' + shopSeg('lang', lang(), Object.keys(LANGS).map(function (k) { return [k, LANGS[k]]; })) + '</div>';
  h += '<div class="card"><h2>Affichage</h2>' + themeCard() + tog('rotate', 'Forcer la rotation de l\'écran', 'À activer si l\'application reste bloquée en portrait. Elle suit alors le capteur du téléphone.') + '</div>';
  h += bkCard();
  h += '<div class="card"><h2>Données</h2><button class="btn bad sm" data-act="reset">' + (resetArmed ? 'Confirmer : tout effacer' : 'Effacer toutes les données') + '</button><p class="small">Version ' + VERSION + '</p></div>';
  return h;
}
var resetArmed = false;
/* 13.8 : chaque carte de Réglages devient une section repliable (état gardé pendant la session) */
var SEC = { 'Jours de séance': true };
function viewSettings() {
  var raw = settingsRaw(), out = '', depth = 0, start = -1, re = /<div\b|<\/div>/g, m, i, last = 0;
  while ((m = re.exec(raw))) {
    if (m[0] === '</div>') { depth--; if (depth === 0 && start >= 0) { out += secWrap(raw.slice(start, m.index + 6)); start = -1; last = m.index + 6; } }
    else { if (depth === 0) { if (start < 0) { out += raw.slice(last, m.index); } start = m.index; } depth++; }
  }
  return out + raw.slice(last);
}
function secWrap(card) {
  var m = card.match(/^<div class="card"><h2>([^<]*)<\/h2>([\s\S]*)<\/div>$/);
  if (!m) return card;
  return '<details class="card" data-sec="' + m[1].replace(/"/g, '') + '"' + (SEC[m[1]] ? ' open' : '') + '><summary><h2>' + m[1] + '</h2></summary>' + m[2] + '</details>';
}
document.addEventListener('toggle', function (ev) { var d = ev.target; if (d && d.getAttribute && d.hasAttribute('data-sec')) SEC[d.getAttribute('data-sec')] = d.open; }, true);

function render() {
  $('#weekTag').textContent = 'Semaine ' + wkNo() + ' · ' + fmt(currentWeight()) + ' kg → ' + P.goal;
  var map = { today: viewToday, train: viewTrain, meals: viewMeals, track: viewTrack, history: viewHistory, settings: viewSettings, more: viewMore, avis: viewAvis, owner: viewOwner, sources: viewSources, player: viewPlayer, sante: viewSante, confid: viewConfid, cond: viewCond, adapt: viewAdapt };
  view.innerHTML = map[tab]();
  if (render._tab !== undefined && render._tab !== tab) { var h1 = view.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); try { h1.focus({ preventScroll: true }); } catch (e) {} } }
  render._tab = tab;
  document.querySelectorAll('#nav button').forEach(function (b) { if (b.getAttribute('data-v') === (({ avis: 'more', settings: 'more', owner: 'more', sources: 'more', player: 'more', sante: 'more', confid: 'more', cond: 'more', adapt: 'more' })[tab] || tab)) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === (({ avis: 'more', settings: 'more', owner: 'more', sources: 'more', player: 'more', sante: 'more', confid: 'more', cond: 'more', adapt: 'more' })[tab] || tab)); });
  document.body.setAttribute('data-tab', ({ avis: 'more', settings: 'more', owner: 'more', sources: 'more', player: 'more', sante: 'more', confid: 'more', cond: 'more', adapt: 'more' })[tab] || tab);
}

/* © KVES · Coach-Mass-KVES */
/* ====================== audio, voix, vibration ====================== */
var actx = null;
function unlockAudio() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
  } catch (e) {}
}
function tone(f, dur, delay, type, vol) {
  if (!P.sound) return;
  try {
    unlockAudio();
    if (!actx) return;
    var t0 = actx.currentTime + (delay || 0), o = actx.createOscillator(), g = actx.createGain();
    var v = (vol || 1) * Math.pow((+P.vol || 7) / 10, 2) * 0.5;
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  } catch (e) {}
}
var SND = {
  tick: function () { tone(1200, 0.04, 0, 'square', 0.35); },
  down: function () { tone(520, 0.1, 0, 'triangle', 1); },
  up: function () { tone(780, 0.1, 0, 'triangle', 1); },
  beat: function () { tone(520, 0.1, 0, 'triangle', 1); tone(780, 0.1, 0.5, 'triangle', 1); },
  count: function () { tone(700, 0.1, 0, 'sine', 1); },
  start: function () { tone(1000, 0.25, 0, 'sine', 1); },
  warn: function () { tone(900, 0.09, 0, 'square', 0.5); tone(900, 0.09, 0.16, 'square', 0.5); },
  setend: function () { tone(880, 0.16, 0, 'sine', 1); tone(660, 0.16, 0.18, 'sine', 1); tone(440, 0.3, 0.36, 'sine', 1); },
  exend: function () { SND.setend(); tone(660, 0.14, 0.75, 'triangle', 0.9); tone(990, 0.3, 0.9, 'triangle', 0.9); },
  go: function () { tone(523, 0.12, 0, 'triangle', 1); tone(659, 0.12, 0.14, 'triangle', 1); tone(784, 0.3, 0.28, 'triangle', 1); },
  newex: function () { tone(392, 0.14, 0, 'triangle', 1); tone(523, 0.14, 0.16, 'triangle', 1); tone(659, 0.14, 0.32, 'triangle', 1); tone(784, 0.35, 0.48, 'triangle', 1); },
  chime: function () { tone(988, 0.14, 0, 'sine', 0.8); tone(1318, 0.26, 0.12, 'sine', 0.8); },
  fanfare: function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.2, i * 0.18, 'triangle', 1); }); tone(1046, 0.5, 0.8, 'triangle', 1); }
};
function play(n) { if (SND[n]) SND[n](); }
function beep(f, ms) { tone(f || 880, (ms || 120) / 1000, 0, 'sine', 1); }
function flash() {
  try { runner.classList.add('flash'); setTimeout(function () { runner.classList.remove('flash'); }, 450); } catch (e) {}
}
/* Voix : suit la langue de l'appli (EN -> anglais, AR et darija -> arabe). Si la phrase n'a pas de traduction connue, le coach parle français. */
function voiceFor(t) {
  var L = lang(), o = P.lang;
  if (P.voiceFr || L === 'fr') return { t: t, l: 'fr-FR' };
  var code = L === 'en' ? 'en' : 'ar', out = t;
  try { P.lang = code; out = trText(t); } catch (e) { out = t; } finally { P.lang = o; }
  if (out === t) return { t: t, l: 'fr-FR' };
  return { t: out, l: code === 'en' ? 'en-US' : 'ar-SA' };
}
function say(t) {
  if (!P.voice) return;
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var vl = voiceFor(t), u = new SpeechSynthesisUtterance(vl.t); u.lang = vl.l; u.rate = 1.05;
    mDuckSay(u);
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
/* Intensité : 1 = normale (impulsions telles quelles), 2 = forte (impulsions allongées, mini 90 ms), 3 = très forte (mini 160 ms).
   Les impulsions de 30-40 ms sont trop brèves pour être senties sur beaucoup de téléphones. */
function vibScale(p) {
  var lv = P.vibLevel || 2, mini = lv >= 3 ? 160 : lv === 2 ? 90 : 0, k = lv >= 3 ? 3 : lv === 2 ? 2 : 1;
  var a = Array.isArray(p) ? p : [p];
  return a.map(function (v, i) { return i % 2 === 0 ? Math.max(mini, Math.round(v * k)) : v; });
}
function vib(p) { if (P.vib) { try { return navigator.vibrate ? navigator.vibrate(vibScale(p)) : null; } catch (e) { return false; } } return null; }
var wl = null;
function wake() { try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (s) { wl = s; }).catch(function () {}); } catch (e) {} }
function unwake() { try { wl && wl.release(); } catch (e) {} wl = null; }
document.addEventListener('visibilitychange', function () { if (R && document.visibilityState === 'visible') wake(); });

/* © KVES · Coach-Mass-KVES */
/* ====================== séance guidée ====================== */
var R = null;
var runner = $('#runner');

function startSession(opts) {
  var solo = opts && opts.only ? opts.only : null;
  var light = !solo && !!isLight(), w = wkNo();
  var list = solo ? EX.filter(function (e) { return e.id === solo; }) : EX.filter(inSession);
  var quick = !solo && !!(opts && opts.quick);
  if (!list.length) return;
  if (quick) {
    var tot = 1.5, keep = [];
    list.forEach(function (e) { var c = (P.exCfg && P.exCfg[e.id]) || {}, est = 2 * (40 + (c.rest || exDef(e).rest)) / 60; if (tot + est <= 15.5) { keep.push(e); tot += est; } });
    list = keep.length ? keep : list.slice(0, 1);
  }
  var plan = list.map(function (e) {
    var L = lv(e.id), names = levelsFor(e), li = Math.min(L.level, names.length - 1), c = (P.exCfg && P.exCfg[e.id]) || {}, d = exDef(e);
    var base = (w <= 2 || !e.grow) ? 3 : 4;
    var step = e.timed ? 5 : 1;
    var hi = solo && c.reps ? c.reps : e.hi + L.off;
    return { e: e, name: names[li], sets: solo ? (c.sets || d.sets) : quick ? 2 : Math.max(2, base - (light ? 1 : 0)), lo: Math.min(e.lo + L.off, hi), hi: hi, rest: c.rest || d.rest, step: step };
  });
  var steps = [];
  if (!solo) WARM.slice(0, quick ? 2 : WARM.length).forEach(function (x) { steps.push({ k: 'warm', label: x.l, sec: x.s, fig: x.fig, period: x.period }); });
  plan.forEach(function (p, i) { for (var s = 1; s <= p.sets; s++) steps.push({ k: 'set', pi: i, sn: s }); });
  R = { sess: null, plan: plan, steps: steps, i: -1, phase: 'intro', t0: Date.now(), logs: [], light: light, quick: quick, solo: !!solo, paused: false, timer: null, endAt: 0, remain: 0, last: -1, count: 0, reps: 0, quit: false };
  runner.hidden = false; document.body.style.overflow = 'hidden';
  unlockAudio();
  wake();
  if (!solo) say(light ? 'Séance allégée aujourd\'hui. Échauffement.' : 'Séance. Échauffement d\'abord.');
  advance();
}

function clearTimer() { if (R) { if (R.timer) { clearInterval(R.timer); R.timer = null; } R.last = -1; } }
function setTimer(sec, onTick, onEnd, onFine) {
  clearTimer();
  R.endAt = performance.now() + sec * 1000; R.last = -1;
  R.timer = setInterval(function () {
    if (!R || R.paused) return;
    var rem = R.endAt - performance.now(), left = Math.ceil(rem / 1000);
    if (onFine) onFine(rem);
    if (left !== R.last) { R.last = left; onTick(Math.max(0, left)); }
    if (left <= 0) { clearTimer(); onEnd(); }
  }, 100);
}
function setTxt(id, t) { var n = $('#' + id); if (n) n.textContent = t; }

function cur() { return R.steps[R.i]; }
function startStretch() {
  clearTimer();
  R.stretch = true; R.steps = STRETCH.map(function (x) { return { k: 'warm', label: x.l, sec: x.s }; });
  R.i = -1; R.paused = false; R.quit = false; R.painOpen = false; R.phase = 'warm';
  wake(); advance();
}
function endStretch() {
  clearTimer(); R.stretch = false; R.stretched = true; R.phase = 'done'; unwake();
  play('chime'); drawDone();
}
function advance() {
  clearTimer();
  R.i++;
  if (R.i >= R.steps.length) return R.stretch ? endStretch() : finish(false);
  var s = cur();
  if (s.k === 'warm') {
    R.phase = 'warm'; draw();
    say(s.label);
    setTimer(s.sec, function (left) { setTxt('tmr', left); if (left > 0 && left <= 3) { play('count'); vib(40); } }, function () { play('chime'); vib([120]); flash(); advance(); });
  } else {
    prep();
  }
}

function setInfo() { var s = cur(), p = R.plan[s.pi]; return { s: s, p: p }; }
function prep() {
  var o = setInfo(), p = o.p, s = o.s;
  R.phase = 'prep'; R.count = 0; draw();
  var unit = p.e.timed ? p.hi + ' secondes' : p.hi + ' répétitions';
  say((s.sn === 1 ? 'Exercice : ' + p.name + '. ' : 'Série ' + s.sn + '. ') + unit + '. Position.');
  if (P.auto) {
    setTimer(6, function (left) { setTxt('tmr', left); if (left > 0 && left <= 3) { play('count'); vib(40); } }, work);
  }
}
function metroFn(totalSec, tempo, maxBeat) {
  return function (rem) {
    if (!P.metro) return;
    var h = Math.floor((totalSec * 1000 - rem) / (tempo * 500));
    if (h > R.beat && h <= maxBeat) { R.beat = h; if (h % 2 === 1) SND.up(); else SND.down(); }
  };
}
function work() {
  var o = setInfo(), p = o.p, tempo = Math.max(2, Math.round(+P.tempo || 3));
  clearTimer(); R.phase = 'work'; R.count = 0; R.beat = 0; draw();
  play('start'); vib([200]); flash();
  if (p.e.timed) {
    var half = Math.floor(p.hi / 2);
    setTimer(p.hi, function (left) {
      setTxt('tmr', left);
      var el = p.hi - left;
      if (left === half) { say('Tiens. Moitié.'); play('chime'); }
      else if (left === 10) { say('Dix secondes. Ne lâche pas.'); play('warn'); }
      else if (left > 3 && P.metro && el > 0 && el % 5 === 0) play('tick');
      if (left > 0 && left <= 3) { play('count'); vib(40); }
    }, function () { finishSet(p.hi); });
  } else if (P.count) {
    var total = p.hi * tempo;
    setTimer(total, function (left) {
      var c = Math.floor((total - left) / tempo);
      if (c > R.count && c <= p.hi) { R.count = c; setTxt('cnt', c); say(c === p.hi ? c + '. Terminé.' : String(c)); vib(30); }
    }, function () { finishSet(p.hi); }, metroFn(total, tempo, 2 * p.hi - 1));
  } else if (P.metro) {
    setTimer(900, function () {}, function () {}, metroFn(900, tempo, 99999));
  }
}
function stopWork() {
  var p = setInfo().p;
  if (p.e.timed) { var el = Math.max(0, p.hi - Math.max(0, R.last)); finishSet(el); }
  else finishSet(P.count ? R.count : p.hi);
}
function finishSet(reps) {
  var o = setInfo(), p = o.p;
  clearTimer();
  R.logs.push({ id: p.e.id, name: p.name, hi: p.hi, sn: o.s.sn, reps: reps });
  R.reps = reps;
  if (R.i + 1 >= R.steps.length) return finish(false);
  var nx = R.steps[R.i + 1], np = R.plan[nx.pi];
  play(nx.sn === 1 ? 'exend' : 'setend'); vib([300, 80, 300]); flash();
  R.phase = 'rest'; draw();
  say('Repos. Prochain : ' + (nx.sn === 1 ? np.name : 'série ' + nx.sn) + '. Sois honnête sur tes répétitions.');
  setTimer(p.rest, function (left) {
    setTxt('tmr', left);
    if (P.warn10 && left === 10 && p.rest > 15) { play('warn'); vib([60, 60, 60]); }
    if (left > 0 && left <= 3) { play('count'); vib(40); }
  }, function () { play(nx.sn === 1 ? 'newex' : 'go'); vib([100, 60, 100]); flash(); advance(); });
}

function findPrs(logs) {
  var prev = {}, cur = {}, out = [];
  D.sessions.forEach(function (x) { (x.logs || []).forEach(function (l) { if (+l.reps > (prev[l.id] || 0)) prev[l.id] = +l.reps; }); });
  logs.forEach(function (l) { if (+l.reps > (cur[l.id] ? cur[l.id].v : 0)) cur[l.id] = { v: +l.reps, name: l.name }; });
  Object.keys(cur).forEach(function (id) {
    var e = EX.filter(function (x) { return x.id === id; })[0];
    if (prev[id] > 0 && cur[id].v > prev[id]) out.push({ name: cur[id].name, v: cur[id].v, old: prev[id], nx: cur[id].v + (e && e.timed ? 5 : 1), timed: !!(e && e.timed) });
  });
  return out;
}
function finish(partial) {
  clearTimer();
  if (R.painSkip) partial = true;
  R.prs = findPrs(R.logs);
  var min = Math.max(1, Math.round((Date.now() - R.t0) / 60000));
  var ups = [];
  if (!partial && !R.solo && !R.quick) ups = applyProgress(R.logs);
  var hasPain = !!(R.pain && R.pain.length);
  if ((R.logs.length || hasPain) && R.solo) {
    var fs = null;
    D.sessions.forEach(function (x) { if (x.free && x.date === today()) fs = x; });
    if (!fs) { fs = { date: today(), min: 0, sets: 0, partial: true, free: true, light: false, week: wkNo(), logs: [] }; D.sessions.push(fs); }
    R.logs.forEach(function (l) { fs.logs.push(l); });
    (R.pain || []).forEach(function (n) { fs.pain = fs.pain || []; if (fs.pain.indexOf(n) < 0) fs.pain.push(n); });
    fs.sets = fs.logs.length; fs.min += min;
  } else if (R.logs.length || hasPain) { R.sess = { date: today(), min: min, sets: R.logs.length, partial: !!partial, light: R.light, quick: !!R.quick, week: wkNo(), logs: R.logs }; if (R.pain && R.pain.length) R.sess.pain = R.pain.slice(); ; D.sessions.push(R.sess); }
  save();
  R.phase = 'done'; R.ups = ups; R.min = min; R.partial = partial;
  unwake(); drawDone();
  if (!partial) { play('fanfare'); say(R.solo ? 'Exercice terminé.' : 'Séance terminée. ' + min + ' minutes. Maintenant, tu manges.'); vib([300, 100, 300]); flash(); }
}
function applyProgress(logs) {
  var ups = [];
  EX.forEach(function (e) {
    var ss = logs.filter(function (s) { return s.id === e.id; });
    var pl = R.plan.filter(function (p) { return p.e.id === e.id; })[0];
    if (!pl) return;
    var need = pl.sets;
    if (ss.length < need) return;
    var hi = ss[0].hi;
    if (ss.every(function (s) { return s.reps >= hi; })) {
      var L = lv(e.id), max = levelsFor(e).length - 1;
      if (L.level < max) { L.level++; L.off = 0; ups.push(levelsFor(e)[L.level]); }
      else { L.off += e.timed ? 5 : 2; ups.push(e.name + ' : objectif augmenté'); }
    }
  });
  return ups;
}

function closeRunner() {
  clearTimer(); unwake(); R = null; runner.hidden = true; document.body.style.overflow = '';
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
  render();
}

function drawPain() {
  var pn = new DOMParser().parseFromString('<div class="rtop"><span class="small">Douleur</span></div><div class="rbody"><div class="rl"><p class="title">Arrête et respire</p><p class="small">Ne force pas à travers une douleur. Si elle est vive, brutale ou si elle dure, consulte un médecin ou un kinésithérapeute.</p></div><div class="rr"><button class="btn go" data-act="painskip">Passer cet exercice</button><button class="btn alt" data-act="painend">Terminer la séance</button><button class="btn alt" data-act="painno">Reprendre</button></div></div>', 'text/html');
  runner.replaceChildren.apply(runner, Array.prototype.slice.call(pn.body.childNodes));
}
function painMark() {
  var s = cur(); if (!s || s.k === 'warm') return;
  var p = R.plan[s.pi]; R.pain = R.pain || [];
  if (R.pain.indexOf(p.name) < 0) R.pain.push(p.name);
}
function painRecent() {
  var d30 = new Date(), d7 = new Date(), lim, wk; d30.setDate(d30.getDate() - 30); d7.setDate(d7.getDate() - 7); lim = dstr(d30); wk = dstr(d7);
  var cnt = {}, rec = {};
  D.sessions.forEach(function (x) { if (x.date >= lim) (x.pain || []).forEach(function (n) { cnt[n] = (cnt[n] || 0) + 1; if (x.date >= wk) rec[n] = 1; }); });
  return { rec: Object.keys(rec), again: Object.keys(cnt).filter(function (n) { return cnt[n] >= 2; }) };
}
function painCard() {
  var r = painRecent();
  if (!r.rec.length) return '';
  return '<div class="card"><h2>Douleur signalée récemment</h2><p class="small"><b>' + r.rec.map(esc).join(', ') + '</b></p><p class="small">Va doucement sur cet exercice, ou passe-le si ça fait mal.</p>' + (r.again.length ? '<p class="small">Elle est revenue plusieurs fois : parles-en à un médecin ou à un kinésithérapeute.</p>' : '') + '</div>';
}
function draw() {
  if (R.painOpen) { drawPain(); return; }
  var s = cur(), h = '', pr = Math.round(R.i / R.steps.length * 100);
  h += '<div class="rtop"><span class="small">' + (s.k === 'warm' ? (R.stretch ? 'Étirements' : 'Échauffement') : 'Exercice ' + (s.pi + 1) + '/' + R.plan.length + ' · série ' + s.sn + '/' + R.plan[s.pi].sets) + '</span>' +
    '<span class="row">' + (s.k === 'warm' ? '' : '<button class="btn alt sm" data-act="pain">J\'ai mal</button>') + '<button class="btn alt sm" data-act="pause">' + (R.paused ? 'Reprendre' : 'Pause') + '</button><button class="btn alt sm" data-act="quit">' + (R.quit ? 'Confirmer' : 'Quitter') + '</button></span></div>';
  h += '<div class="bar"><i style="width:' + pr + '%"></i></div>' + mMiniHtml();
  if (s.k === 'warm') {
    h += '<div class="rbody"><div class="rl"><p class="title">' + esc(s.label) + '</p>' + (s.fig ? drawBox(s.fig, R.paused ? 'hold' : 'loop', s.period) : '') + '</div><div class="rr"><div class="big" id="tmr">' + s.sec + '</div><p class="sub">secondes</p><button class="btn alt" data-act="skip">Passer</button></div></div>';
  } else {
    var p = R.plan[s.pi], e = p.e, unit = e.timed ? 'secondes' : 'répétitions';
    var ds = R.phase === 'rest' && R.steps[R.i + 1] ? R.plan[R.steps[R.i + 1].pi] : p;
    h += '<div class="rbody"><div class="rl"><p class="title">' + esc(ds.name) + '</p>' + drawBox(ds.e.id, (R.paused || ds.e.timed) ? 'hold' : 'loop', Math.max(2, +P.tempo || 3)) + '</div><div class="rr">';
    if (R.phase === 'prep') {
      h += '<p class="sub">Vise ' + p.hi + ' ' + unit + (e.timed ? '' : ' (minimum ' + p.lo + ')') + '</p>';
      h += P.auto ? '<div class="big" id="tmr">6</div><p class="sub">Prépare-toi</p><button class="btn go" data-act="begin">Commencer maintenant</button>' : '<button class="btn go" data-act="begin">Commencer</button>';
    } else if (R.phase === 'work') {
      if (e.timed) h += '<div class="big pulse" id="tmr">' + p.hi + '</div><p class="sub">secondes à tenir</p>';
      else if (P.count) h += '<div class="big pulse" id="cnt">0</div><p class="sub">sur ' + p.hi + '</p>';
      else h += '<p class="sub">Fais tes répétitions, puis valide.</p>';
      h += '<button class="btn go" data-act="stopwork">' + (e.timed || P.count ? 'Arrêter ici' : 'Terminé') + '</button>';
    } else if (R.phase === 'rest') {
      var nx = R.steps[R.i + 1], np = R.plan[nx.pi];
      h += '<p class="sub">Repos</p><div class="big" id="tmr">' + p.rest + '</div>';
      if (!e.timed) h += '<p class="sub">Répétitions réussies (corrige si besoin)</p><div class="stepper"><button data-act="repm">−</button><b id="reps">' + R.reps + '</b><button data-act="repp">+</button></div>';
      h += '<p class="sub">Ensuite : ' + esc(nx.sn === 1 ? np.name : 'série ' + nx.sn + ' · ' + np.name) + '</p><div class="row"><button class="btn alt grow" data-act="plus">+ 15 s</button><button class="btn go grow" data-act="skip">Passer</button></div>';
    }
    h += '</div></div>';
  }
  runner.innerHTML = h;
  if (R.last >= 0) setTxt('tmr', R.last);
  if (R.phase === 'work' && R.count) setTxt('cnt', R.count);
}
function drawDone() {
  var h = '<div class="rtop"><span class="small">' + (R.partial ? (R.solo ? 'Exercice interrompu' : 'Séance interrompue') : (R.solo ? 'Exercice terminé' : 'Séance terminée')) + '</span></div>';
  h += '<div class="rbody"><div class="rl"><p class="title">' + (R.solo ? 'Enregistré dans l\'historique (libre)' : R.partial ? 'Séance incomplète enregistrée' : 'Séance validée') + '</p><div class="stats"><div class="stat"><b>' + R.min + '</b><span>minutes</span></div><div class="stat"><b>' + R.logs.length + '</b><span>séries</span></div><div class="stat"><b>' + R.logs.reduce(function (a, x) { return a + (R.plan.filter(function (p) { return p.e.id === x.id; })[0].e.timed ? 0 : x.reps); }, 0) + '</b><span>répétitions</span></div></div></div><div class="rr">';
  if (R.ups && R.ups.length) h += '<div class="card"><h2>Tu passes au niveau supérieur</h2><ul class="list">' + R.ups.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul></div>';
  if (R.prs && R.prs.length) h += '<div class="card"><h2>Nouveau record</h2><ul class="list">' + R.prs.map(function (r) { var u = r.timed ? ' s' : ''; return '<li><b>' + esc(r.name) + '</b> : <span>' + r.v + u + '</span> <span class="small">(<span>' + r.old + u + '</span>)</span><br><span class="small">Prochain objectif</span> <span>' + r.nx + u + '</span></li>'; }).join('') + '</ul></div>';
  if (R.pain && R.pain.length) h += '<div class="card"><h2>Douleur signalée</h2><p class="small"><b>' + R.pain.map(esc).join(', ') + '</b></p><p class="small">Repose-toi. Si la douleur revient ou dure, consulte un médecin ou un kinésithérapeute.</p></div>';
  h += '<div class="card coach"><span class="head">Le coach</span><p class="msg">' + (R.solo ? 'Bien joué. Une série de plus chaque semaine, c\'est comme ça qu\'on progresse.' : R.partial ? 'Tu as arrêté en route. La prochaine fois, tu vas au bout.' : 'Mange dans l\'heure, hydrate-toi, dors tes 7 heures. La séance ne compte que si la récupération suit.') + '</p></div>';
  if (R.sess && !R.partial && !R.solo) h += '<div class="card"><h2>Effort ressenti (1 = très facile, 5 = très dur)</h2><div class="seg">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-act="rpe" data-n="' + n + '" class="' + (+R.sess.rpe === n ? 'on' : '') + '" aria-pressed="' + (+R.sess.rpe === n) + '">' + n + '</button>'; }).join('') + '</div></div>';
  if (!R.stretched) h += '<div class="card"><h2>Étirements</h2><p class="small">3 minutes pour détendre les muscles. Sans forcer, sans rebondir.</p><button class="btn alt" data-act="stretch">Faire les étirements</button></div>';
  h += '<button class="btn go" data-act="closerun">Fermer</button></div></div>';
  runner.innerHTML = h;
}

/* © KVES · Coach-Mass-KVES */
/* ====================== photos de progression (locales) ====================== */
/* Stockées dans IndexedDB (base « coach-masse-ph ») sur l'appareil, jamais envoyées, hors sauvegarde. */
var PH = { list: null, urls: {}, sel: [], armed: '', db: null };
function phDb() {
  if (!PH.db) PH.db = new Promise(function (res, rej) {
    try {
      var q = indexedDB.open('coach-masse-ph', 1);
      q.onupgradeneeded = function () { q.result.createObjectStore('p', { keyPath: 'id' }); };
      q.onsuccess = function () { res(q.result); };
      q.onerror = function () { rej(q.error); };
    } catch (e) { rej(e); }
  });
  return PH.db;
}
function phTx(mode, fn) {
  return phDb().then(function (db) {
    return new Promise(function (res, rej) {
      var tx = db.transaction('p', mode), out = fn(tx.objectStore('p'));
      tx.oncomplete = function () { res(out && out.result !== undefined ? out.result : undefined); };
      tx.onerror = tx.onabort = function () { rej(tx.error); };
    });
  });
}
function phLoad() {
  if (PH.list) return;
  PH.list = [];
  phTx('readonly', function (st) { return st.getAll(); }).then(function (a) {
    PH.list = (a || []).sort(function (x, y) { return x.date < y.date ? -1 : x.date > y.date ? 1 : (x.id < y.id ? -1 : 1); });
    if (PH.list.length && tab === 'track') render();
  }).catch(function () {});
}
function phUrl(it) { if (!PH.urls[it.id]) PH.urls[it.id] = URL.createObjectURL(it.blob); return PH.urls[it.id]; }
function phResize(file, cb) {
  var img = new Image(), u = URL.createObjectURL(file);
  img.onload = function () {
    var k = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(u);
    c.toBlob(function (b) { cb(b); }, 'image/jpeg', 0.8);
  };
  img.onerror = function () { URL.revokeObjectURL(u); cb(null); };
  img.src = u;
}
function phDel(ids) {
  return Promise.all(ids.map(function (id) { return phTx('readwrite', function (st) { return st.delete(id); }); })).then(function () {
    ids.forEach(function (id) { if (PH.urls[id]) { URL.revokeObjectURL(PH.urls[id]); delete PH.urls[id]; } });
    PH.list = (PH.list || []).filter(function (x) { return ids.indexOf(x.id) < 0; });
    PH.sel = PH.sel.filter(function (x) { return ids.indexOf(x) < 0; }); PH.armed = '';
    render();
  }).catch(function () {});
}
function phWipe() {
  Object.keys(PH.urls).forEach(function (k) { try { URL.revokeObjectURL(PH.urls[k]); } catch (e) {} });
  PH.urls = {}; PH.list = []; PH.sel = []; PH.armed = '';
  return phTx('readwrite', function (st) { return st.clear(); }).catch(function () {});
}
function phCard() {
  phLoad();
  var L = PH.list || [], h = '<div class="card" id="phcard"><h2>Photos de progression</h2><p class="small">Tes photos restent uniquement sur ce téléphone, jamais envoyées. Elles ne sont pas dans la sauvegarde.</p>';
  h += '<p class="small"><b>Attention :</b> si tu effaces les données du site dans Chrome, les photos disparaissent. Exporte-les de temps en temps.</p>';
  h += '<div class="row"><label class="btn alt sm">Ajouter une photo<input type="file" accept="image/*" data-ph="add" hidden></label><label class="btn alt sm">Importer des photos<input type="file" accept=".json,application/json" data-ph="imp" hidden></label>' + (L.length ? '<button class="btn alt sm" data-act="phexp">Exporter les photos</button>' : '') + '</div>';
  if (L.length) h += '<p class="small">' + (P.phExp ? '<span>Dernier export :</span> ' + esc(sdate(P.phExp)) : 'Jamais exporté') + '</p>';
  if (!L.length) return h + '<p class="small">Aucune photo pour l\'instant.</p></div>';
  h += '<p class="small">Touche deux photos pour les comparer.</p><div class="phgrid">' + L.map(function (it) {
    return '<button class="phth' + (PH.sel.indexOf(it.id) >= 0 ? ' on' : '') + '" data-act="phsel" data-id="' + esc(it.id) + '" aria-pressed="' + (PH.sel.indexOf(it.id) >= 0) + '"><img src="' + phUrl(it) + '" alt=""><span>' + esc(sdate(it.date)) + '</span></button>';
  }).join('') + '</div>';
  if (PH.sel.length === 2) {
    var a = L.filter(function (x) { return PH.sel.indexOf(x.id) >= 0; });
    h += '<div class="phcmp">' + a.map(function (it, i) { return '<figure><img src="' + phUrl(it) + '" alt=""><figcaption><span>' + (i ? 'Après' : 'Avant') + '</span> · ' + esc(sdate(it.date)) + '</figcaption></figure>'; }).join('') + '</div>';
  }
  if (PH.sel.length) h += '<button class="btn bad sm" data-act="phdel">' + (PH.armed ? 'Confirmer : supprimer' : 'Supprimer') + '</button>';
  return h + '</div>';
}
function phToData(b) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsDataURL(b); }); }
function phExport() {
  var L = PH.list || [];
  Promise.all(L.map(function (it) { return phToData(it.blob).then(function (d) { return { id: it.id, date: it.date, data: d }; }); })).then(function (items) {
    var b = new Blob([JSON.stringify({ app: 'coach-masse-photos', v: 1, items: items })], { type: 'application/json' }), name = 'photos-coach-mass-' + today() + '.json', f = null;
    function dl() { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
    P.phExp = today(); save(); render();
    try { f = new File([b], name, { type: 'application/json' }); } catch (e) { f = null; }
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: 'Photos Coach-Mass-KVES' }).catch(function (e) { if (!e || e.name !== 'AbortError') dl(); });
    else dl();
  }).catch(function () { toast('Photo illisible'); });
}
function phImport(file) {
  var r = new FileReader();
  r.onload = function () {
    var j, add = [], have = {};
    try { j = JSON.parse(r.result); } catch (e) { j = null; }
    if (!j || j.app !== 'coach-masse-photos' || !Array.isArray(j.items)) { toast('Fichier non reconnu'); return; }
    (PH.list || []).forEach(function (x) { have[x.id] = 1; });
    j.items.slice(0, 300).forEach(function (it) {
      if (!it || typeof it.id !== 'string' || it.id.length > 40 || have[it.id] || !/^\d{4}-\d{2}-\d{2}$/.test(it.date) || typeof it.data !== 'string' || it.data.indexOf('data:image/jpeg;base64,') !== 0 || it.data.length > 4000000) return;
      try {
        var bin = atob(it.data.slice(23)), u = new Uint8Array(bin.length), k;
        for (k = 0; k < bin.length; k++) u[k] = bin.charCodeAt(k);
        add.push({ id: it.id, date: it.date, blob: new Blob([u], { type: 'image/jpeg' }) });
      } catch (e) {}
    });
    if (!add.length) { toast('Aucune nouvelle photo'); return; }
    Promise.all(add.map(function (it) { return phTx('readwrite', function (st) { return st.put(it); }); })).then(function () {
      PH.list = (PH.list || []).concat(add).sort(function (x, y) { return x.date < y.date ? -1 : x.date > y.date ? 1 : (x.id < y.id ? -1 : 1); }); render(); toast('Photos importées');
    }).catch(function () { toast('Photo illisible'); });
  };
  r.readAsText(file);
}
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t && t.getAttribute && t.getAttribute('data-ph') === 'imp') { var fi = t.files && t.files[0]; t.value = ''; if (fi) phImport(fi); return; }
  if (!t || !t.getAttribute || t.getAttribute('data-ph') !== 'add') return;
  var f = t.files && t.files[0]; t.value = '';
  if (!f) return;
  phResize(f, function (b) {
    if (!b) { toast('Photo illisible'); return; }
    var it = { id: Date.now() + '-' + Math.floor(Math.random() * 1e6), date: today(), blob: b };
    phTx('readwrite', function (st) { return st.put(it); }).then(function () {
      PH.list = (PH.list || []).concat([it]); PH.armed = ''; render();
    }).catch(function () { toast('Photo illisible'); });
  });
});
document.addEventListener('click', function (ev) {
  var t = ev.target && ev.target.closest ? ev.target.closest('[data-act]') : null;
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'phsel') {
    var id = t.getAttribute('data-id'), i = PH.sel.indexOf(id);
    if (i >= 0) PH.sel.splice(i, 1); else { PH.sel.push(id); if (PH.sel.length > 2) PH.sel.shift(); }
    PH.armed = ''; render();
  } else if (a === 'phexp') { phExport(); }
  else if (a === 'phdel') {
    if (!PH.armed) { PH.armed = '1'; render(); return; }
    phDel(PH.sel.slice());
  }
});
/* © KVES · Coach-Mass-KVES */
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
  var out = 'Avis reçus - Coach-Mass-KVES (export du ' + today() + ')\n\n';
  OW.items.slice().reverse().forEach(function (x) {
    var d = x.data;
    if (!d) return;
    out += '[' + (d.d || x.rec.added) + '] ' + d.n + ' <' + d.e + '> | ' + TYPE_LABEL[d.t] + (d.r ? ' | note ' + d.r + '/5' : '') + ' | v' + d.a + ' | ' + d.s + ' | statut : ' + ST_LABEL[x.rec.st || 'new'] + '\n' + d.m + '\n\n';
  });
  return out;
}

/* envoi par l'utilisateur */
function avText(code) { return 'Avis pour Coach-Mass-KVES (chiffré : seul le propriétaire peut le lire)\n' + code; }
function avValidate() {
  var n = AV.name.trim(), e = AV.email.trim(), m = AV.msg.trim();
  if (n.length < 2) return 'Écris ton nom.';
  if (!EMAIL_RE.test(e)) return 'Écris une adresse e-mail valide.';
  if (m.length < 5) return 'Écris ton message (5 caractères minimum).';
  if (/CM[01]\.[A-Za-z0-9_-]{40,}/.test(m) || /^Avis pour Coach/i.test(m)) return 'Ton message contient un code d\'avis déjà chiffré. Efface-le et écris ton texte à la main.';
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
    mark(); window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent('Avis Coach-Mass-KVES') + '&body=' + encodeURIComponent(text);
  } else if (via === 'wa' && CFG.whatsapp) {
    mark(); window.open('https://wa.me/' + String(CFG.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  } else if (navigator.share) {
    navigator.share({ title: 'Avis Coach-Mass-KVES', text: text }).then(mark).catch(function () {});
  } else { copyText(text); }
}

/* vues */
function backBtn() { return '<button class="btn alt sm back" data-act="tab" data-v="more">← Plus</button>'; }
var LEGAL = {"sante": [["t", "Avertissement santé"], ["p", "Coach-Mass-KVES est un outil d'entraînement et de suivi à usage personnel. Ce n'est pas un dispositif médical et il ne remplace pas l'avis d'un médecin, d'un kinésithérapeute ou d'un diététicien."], ["h", "Avant de commencer"], ["li", "Si tu as une maladie (cœur, tension, articulations, dos, diabète…), une blessure, ou si tu es sous traitement, demande l'avis d'un médecin avant de t'entraîner ou de changer ton alimentation."], ["li", "Si tu fumes, si tu as été longtemps sédentaire ou si tu reprends le sport, commence doucement. Le coach te le rappellera, mais c'est à toi de t'écouter."], ["li", "Cette application est destinée aux adultes (18 ans et plus). Elle n'est pas faite pour les femmes enceintes sans avis médical."], ["h", "Pendant l'entraînement"], ["li", "Arrête immédiatement en cas de douleur vive, vertige, malaise, gêne dans la poitrine, essoufflement anormal ou douleur articulaire. Ne « force » pas à travers une douleur."], ["li", "Échauffe-toi toujours. Respecte les temps de repos."], ["li", "Les exercices marqués « à risque » demandent une attention particulière : lis les précautions avant de les lancer."], ["li", "En cas de symptôme grave, appelle les secours (au Maroc : 15 pour le SAMU, 150 pour la Protection civile)."], ["h", "Alimentation et poids"], ["li", "Les calories et protéines proposées sont des estimations générales calculées à partir de ce que tu saisis. Elles ne tiennent pas compte de ton état de santé."], ["li", "L'application ne propose pas de régime en dessous d'un seuil de sécurité, et ne remplace pas un suivi nutritionnel."], ["h", "Responsabilité"], ["li", "Tu t'entraînes sous ta propre responsabilité. Les auteurs ne peuvent pas être tenus responsables d'une blessure ou d'un problème de santé lié à l'usage de l'application, dans la mesure permise par la loi."]], "confid": [["t", "Politique de confidentialité"], ["p", "En bref : tes données restent sur ton téléphone. Nous n'avons pas de serveur, pas de compte, pas de publicité, pas de traceur."], ["h", "Quelles données ?"], ["li", "Ton profil (âge, taille, poids, objectif, régime, allergies déclarées), tes séances, tes mesures, tes réglages."], ["li", "Ces données peuvent concerner ta santé : elles sont donc sensibles. Tu les saisis volontairement."], ["h", "Où sont-elles ?"], ["li", "Uniquement dans le stockage local de ton navigateur/appli (sur ton appareil). Elles ne sont envoyées nulle part automatiquement."], ["li", "Si tu supprimes les données du site ou désinstalles l'application, elles disparaissent, sauf si tu as fait une sauvegarde."], ["h", "Ce que tu choisis de partager"], ["li", "Sauvegarde : le fichier est créé sur ton appareil. Tu décides où le ranger. Il n'est pas chiffré à ce stade : garde-le en lieu sûr."], ["li", "Lien/QR de partage : il contient les informations que tu choisis de partager. Toute personne qui a le lien peut les lire."], ["li", "Boîte à avis : ton message est chiffré de bout en bout avec la clé publique du propriétaire. Seul le propriétaire peut le lire. Ne mets pas d'informations de santé ou personnelles dont tu n'as pas besoin."], ["li", "Rappels / calendrier (.ics) : le fichier est créé sur ton appareil, puis traité par ton application de calendrier."], ["h", "Musique"], ["li", "Les fichiers audio que tu choisis restent sur ton appareil. Ils ne sont ni copiés ni envoyés."], ["h", "Hébergement"], ["li", "L'application est hébergée sur GitHub Pages. GitHub peut enregistrer des données techniques de connexion (adresse IP, par exemple) selon sa propre politique. L'application elle-même n'y envoie rien."], ["h", "Tes droits"], ["li", "Accès, modification, suppression : tout se fait dans l'application (Réglages > Données). Tu peux tout effacer à tout moment."], ["li", "Pour une question ou une demande : utilise la boîte à avis."], ["h", "Cadre légal"], ["p", "Loi marocaine 09-08 sur la protection des données personnelles (CNDP) et, pour les utilisateurs concernés, RGPD."], ["p", "Mineurs : l'application est réservée aux 18 ans et plus."], ["p", "Changements : cette politique peut évoluer. La date de dernière mise à jour est indiquée en bas de page."]], "cond": [["t", "Conditions d'utilisation"], ["li", "Objet : Coach-Mass-KVES est une application gratuite de coaching sportif et de suivi, © KVES."], ["li", "Usage : personnel et non commercial. Tu dois avoir 18 ans ou plus."], ["li", "Santé : tu as lu l'avertissement santé et tu t'entraînes sous ta responsabilité."], ["li", "Pas de garantie : l'application est fournie « telle quelle », sans promesse de résultat (prise de poids, de muscle) ni de disponibilité continue. Les résultats dépendent de toi, de ton alimentation, de ton sommeil et de ta santé."], ["li", "Données : tu es responsable de tes sauvegardes. Les données sont locales (voir la politique de confidentialité)."], ["li", "Contenus : textes, illustrations, logo, nom et signature KVES sont protégés. Copie et redistribution interdites sans accord, sauf licence indiquée."], ["li", "Conduite : n'essaie pas de détourner l'application ni de nuire à d'autres utilisateurs (par exemple via la boîte à avis)."], ["li", "Évolution : l'application peut changer ou s'arrêter. Les conditions peuvent être mises à jour, la version en vigueur est celle affichée dans l'application."], ["li", "Droit applicable : droit marocain. Tribunaux compétents : Casablanca."], ["li", "Contact : via la boîte à avis."]]};
LEGAL.adapt = [["t", "Comment le programme s'adapte"], ["p", "Le programme se calibre selon ton profil et ton objectif. Voici ce qui change tout seul, et ce qui reste fixe pour l'instant."], ["h", "Ce qui s'adapte automatiquement"], ["li", "Calories et protéines : calculées selon ton objectif, ton âge, ta taille, ton poids et ton genre, avec un plancher de sécurité en perte de poids."], ["li", "Portions des repas : ajustées à ta cible de calories."], ["li", "Horaires des repas : tu les choisis dans Réglages > Heures des repas, avec l'option « dernier repas avant 20 h 30 »."], ["li", "Menus : plus légers pour la perte de poids, la tonification et le maintien (yaourt nature, fruits, plus de légumes) ; la prise de masse garde ses menus riches."], ["li", "Fruits : une orange au petit-déjeuner et un fruit de saison à la collation de 18 h, comptés dans la liste de courses."], ["li", "Menus : filtrés selon tes allergies, ton régime végétarien, ton budget et tes variantes choisies. La liste de courses suit."], ["li", "Séances : allégées si tu dors peu ou si ton énergie est basse. Plus difficiles quand tu réussis tes séries."], ["li", "Effort et récupération : l'effort ressenti et la semaine d'allègement règlent la charge."], ["li", "Poids visé : refusé s'il est trop éloigné ou dangereux pour ta taille."], ["h", "Ce qui reste fixe pour l'instant"], ["h", "À retenir"], ["p", "Ces repères sont généraux et ne remplacent pas un diététicien. En cas de doute, demande un avis professionnel."]];
var LEGAL_DATE = 'Dernière mise à jour : 19 novembre 2026';
function viewLegal(k) {
  var it = LEGAL[k], h = backBtn() + '<h1>' + esc(it[0][1]) + '</h1><div class="card">', ul = false;
  it.slice(1).forEach(function (x) {
    if (x[0] === 'li' && !ul) { h += '<ul class="list">'; ul = true; }
    if (x[0] !== 'li' && ul) { h += '</ul>'; ul = false; }
    h += x[0] === 'h' ? '<h2>' + esc(x[1]) + '</h2>' : x[0] === 'p' ? '<p>' + esc(x[1]) + '</p>' : '<li>' + esc(x[1]) + '</li>';
  });
  if (ul) h += '</ul>';
  if (k === 'adapt') return h + '</div>';
  return h + '<p class="small">' + LEGAL_DATE + '</p><p class="small">Brouillon à faire relire par un professionnel avant publication publique.</p></div>';
}
function viewSante() { return viewLegal('sante'); }
function viewConfid() { return viewLegal('confid'); }
function viewCond() { return viewLegal('cond'); }
function viewAdapt() { return viewLegal('adapt'); }
function viewMore() {
  return '<h1>Plus</h1>' +
    '<div class="card"><h2>Boîte à avis</h2><p class="small">Une idée, un problème, un merci ? Ton avis est chiffré sur ton téléphone avant l\'envoi : seul le propriétaire de l\'application peut le lire.</p><button class="btn" data-act="tab" data-v="avis">Donner mon avis</button></div>' +
    '<div class="card"><h2>Réglages</h2><p class="small">Jours de séance, voix, sons, objectif de poids, rotation de l\'écran.</p><button class="btn alt" data-act="tab" data-v="settings">Ouvrir les réglages</button></div>' +
    '<div class="card"><h2>Lecteur de musique</h2><p class="small">Écoute la musique de ton téléphone (MP3, M4A). Rien n\'est copié ni envoyé.</p><button class="btn alt" data-act="tab" data-v="player">Ouvrir le lecteur</button></div>' +
    '<div class="card"><h2>Sources et limites</h2><p class="small">D\'où viennent les repères du programme, et les précautions à connaître.</p><button class="btn alt" data-act="tab" data-v="sources">Lire</button></div>' +
    '<div class="card"><h2>Comment le programme s\'adapte</h2><p class="small">Ce qui change selon ton objectif, et ce qui reste fixe.</p><button class="btn alt" data-act="tab" data-v="adapt">Lire</button></div>' +
    shareCard() +
    '<div class="card"><h2>À propos</h2><img class="banner" src="banner.jpg" alt="' + NOM + '" width="1200" height="593"><p class="small">' + NOM + ' · version ' + VERSION + ' · © ' + AUTEUR + '. Tes données restent sur ton téléphone.</p><button class="btn alt sm back" data-act="tab" data-v="owner">Espace propriétaire</button></div>' +
    '<div class="card"><h2>Légal</h2><div class="links"><button class="linkrow" data-act="tab" data-v="sante">Avertissement santé</button><button class="linkrow" data-act="tab" data-v="confid">Politique de confidentialité</button><button class="linkrow" data-act="tab" data-v="cond">Conditions d\'utilisation</button></div></div>';
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
      (okMail ? '<a class="btn alt sm linkbtn" href="mailto:' + esc(d.e) + '?subject=' + encodeURIComponent('Re : ton avis sur Coach-Mass-KVES') + '">Répondre</a>' : '') +
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
  if (a === 'owexportkey') { var rec = ownerRec(); if (rec) download('coach-mass-kves-cle-proprietaire.json', JSON.stringify(rec), 'application/json'); return; }
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
  if (a === 'owexport') { if (OW.items) download('coach-mass-kves-avis.txt', owReadable(), 'text/plain'); return; }
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

/* © KVES · Coach-Mass-KVES */
/* ====================== v7 : thème, courses, rappels, mini-compteurs ====================== */
/* thème */
function applyTheme() {
  var th = P.theme || 'auto', r = document.documentElement;
  if (th === 'light' || th === 'dark') r.setAttribute('data-theme', th); else r.removeAttribute('data-theme');
  var light = th === 'light' || (th === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.removeAttribute('media'); m.setAttribute('content', light ? '#F2F4F3' : '#0C1318'); });
}
if (window.matchMedia) {
  try { window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { if ((P.theme || 'auto') === 'auto') applyTheme(); }); } catch (e) {}
}
applyTheme();
function themeCard() {
  var th = P.theme || 'auto';
  return '<div class="seg" role="group" aria-label="Thème">' + [['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']].map(function (x) { return '<button data-act="theme" data-v="' + x[0] + '" class="' + (th === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div><p class="small">Auto suit le mode clair ou sombre d\'Android. Le fond, la barre d\'état et les graphiques suivent ton choix.</p>';
}

/* © KVES · Coach-Mass-KVES */
/* liste de courses */
function qG(g) { return g >= 1000 ? (Math.round(g / 100) / 10).toString().replace('.', ',') + ' kg' : g + ' g'; }
function qL(l) { return (Math.ceil(l * 2) / 2).toString().replace('.', ',') + ' L'; }
var SHOP_SCALE = { pain: 1, riz: 1, huile: 1, amlou: 1, flocons: 1, miel: 1, dattes: 1, lait: 1 };
function shopFmt(k, q) {
  var u = SHOPN[k][1];
  if (u === 'g') return qG(Math.round(q / 10) * 10);
  if (u === 'L') return qL(q);
  if (u === 'ml') return Math.round(q / 10) * 10 + ' ml';
  if (u === 'p') return Math.round(q) + ' pièces';
  if (u === 'v') return Math.round(q) + ' verres';
  return String(Math.max(1, Math.round(q)));
}
/* liste calculée d'après les repas réels : objectif, régime, budget et variantes choisies */
function shopList() {
  var d = P.shopDays || 7, f = mealFactor(), tot = {};
  function add(o, days) {
    Object.keys(o.shop || {}).forEach(function (k) { tot[k] = (tot[k] || 0) + o.shop[k] * days * (SHOP_SCALE[k] ? f : 1); });
  }
  planSlots().forEach(function (s) {
    var ch = slotChoices(s), n = ch.length, left = d;
    ch.forEach(function (o, i) { var dd = i === n - 1 ? left : Math.ceil(d / n); left -= dd; if (dd > 0) add(o, dd); });
  });
  if (obj() === 'masse' && P.kcalAdj >= 300) add(extraMeal(), d);
  return SHOP_ORDER.filter(function (k) { return tot[k] > 0; }).map(function (k) { return [k, SHOPN[k][0], shopFmt(k, tot[k])]; });
}
function shopSeg(act, cur, opts) {
  return '<div class="seg" role="group">' + opts.map(function (o) { return '<button data-act="' + act + '" data-v="' + o[0] + '" class="' + (String(cur) === String(o[0]) ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>';
}
function shopCard() {
  var done = P.shopDone || {}, L = shopList(), n = 0;
  var h = '<div class="card"><h2>Liste de courses</h2><p class="small">Choisis tes variantes : la liste se calcule toute seule, d\'après les repas ci-dessus.</p>' +
    '<label class="f">Pour combien de jours</label>' + shopSeg('shopdays', P.shopDays, [[3, '3 jours'], [7, '7 jours'], [14, '14 jours']]) +
    '<label class="f">Déjeuner</label>' + shopSeg('shopm3', P.shopM3, [['poulet', 'Poulet'], ['sardines', 'Sardines'], ['mix', 'Alterné']]) +
    '<label class="f">Dîner</label>' + shopSeg('shopm5', P.shopM5, [['lentilles', 'Lentilles'], ['pois', 'Pois chiches'], ['mix', 'Alterné']]) + '<div class="shop">';
  L.forEach(function (x) {
    if (done[x[0]]) n++;
    h += '<label class="meal"><input type="checkbox" data-shop="' + x[0] + '"' + (done[x[0]] ? ' checked' : '') + '><span>' + esc(x[1]) + '</span><span class="k">' + esc(x[2]) + '</span></label>';
  });
  return h + '</div><p class="small">Quantités calculées d\'après tes repas, ton objectif, ton régime et ton budget. Légumes estimés, lentilles et pois chiches comptés secs (60 g secs pour 150 g cuits). Les prix varient : aucun coût n\'est affiché.</p>' +
    '<div class="row"><button class="btn sm grow" data-act="shopcopy">Copier la liste</button><button class="btn alt sm" data-act="shopreset">Tout décocher</button></div></div>';
}
function shopText() {
  return 'Courses (' + P.shopDays + ' jours)\n' + shopList().map(function (x) { return '- ' + x[1] + ' : ' + x[2]; }).join('\n');
}

/* © KVES · Coach-Mass-KVES */
/* rappels */
function hm(s) { var m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; }
function mealsAllDone() { var c = (D.logs[today()] || {}).meals || []; return mealsList().every(function (_, i) { return c[i]; }); }
function waterSlot(d) { var h = d.getHours() + d.getMinutes() / 60, r = -1; [10, 12, 14, 16, 18].forEach(function (x) { if (h >= x && h < 20.5) r = x; }); return r; }
function rmDue() {
  var out = [];
  if (!P.rmOn) return out;
  var d = new Date(), n = d.getHours() * 60 + d.getMinutes(), w = hm(P.rmW), m = hm(P.rmM), l = D.logs[today()] || {};
  if (w !== null && n >= w && !l.weight && P.rmLw !== today()) out.push('w');
  if (m !== null && n >= m && !mealsAllDone() && P.rmLm !== today()) out.push('m');
  var sl = waterSlot(d);
  if (P.rmWater && sl > 0 && P.rmLe !== today() + '#' + sl && (+l.water || 0) < waterTarget() * Math.max(0, Math.min(1, (sl - 8) / 13))) out.push('e');
  return out;
}
function syncRemind() {
  if (!window.caches || !P.rmOn) return;
  var l = D.logs[today()] || {};
  var o = { on: !!P.rmOn, w: P.rmW, m: P.rmM, wd: l.weight ? today() : '', md: mealsAllDone() ? today() : '', lw: P.rmLw || '', lm: P.rmLm || '', we: !!P.rmWater, ww: +l.water || 0, wt: waterTarget(), le: P.rmLe || '' };
  caches.open('coach-masse-remind').then(function (c) { return c.put('remind.json', new Response(JSON.stringify(o))); }).catch(function () {});
}
function sysNotify(txt, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted' || !navigator.serviceWorker) return false;
  navigator.serviceWorker.ready.then(function (reg) { reg.showNotification('Coach-Mass-KVES', { body: txt, tag: tag, icon: 'icon-192.png', badge: 'icon-192.png', vibrate: [200, 100, 200] }); }).catch(function () {});
  return true;
}
function rmNotify(kind) {
  var txt = kind === 'w' ? 'Pèse-toi à jeun et note ton poids.' : kind === 'e' ? 'Pense à boire : un verre d\'eau maintenant.' : 'Valide tes repas du jour.';
  if (kind === 'w') P.rmLw = today(); else if (kind === 'e') P.rmLe = today() + '#' + waterSlot(new Date()); else P.rmLm = today();
  save();
  if (document.visibilityState === 'visible') { toast('Rappel : ' + txt); vib([200, 100, 200]); } else sysNotify(txt, 'cm-' + kind);
}
function rmCheck() { rmDue().forEach(rmNotify); syncRemind(); }
function regPeriodic() {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker.ready.then(function (reg) { if (reg.periodicSync) return reg.periodicSync.register('cm-remind', { minInterval: 3600000 }); }).catch(function () {});
}
function rmEnable() {
  P.rmOn = true; save();
  function go() { regPeriodic(); render(); rmCheck(); }
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(function (p) { if (p !== 'granted') toast('Notifications refusées : rappels seulement quand l\'application est ouverte.'); go(); }).catch(go);
  } else go();
}
/* Calendrier : fichier .ics avec deux événements quotidiens et alerte (poids, repas). */
function icsText() {
  var d = new Date(), day = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  var stamp = day + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
  function ev(uid, hhmm, title, desc) {
    var m = hm(hhmm), e = (m + 15) % 1440;
    return ['BEGIN:VEVENT', 'UID:' + uid + '@coach-mass-kves', 'DTSTAMP:' + stamp, 'DTSTART:' + day + 'T' + pad(Math.floor(m / 60)) + pad(m % 60) + '00', 'DTEND:' + day + 'T' + pad(Math.floor(e / 60)) + pad(e % 60) + '00',
      'RRULE:FREQ=DAILY', 'SUMMARY:' + title, 'DESCRIPTION:' + desc, 'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:' + title, 'END:VALARM', 'END:VEVENT'];
  }
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KVES//Coach-Mass-KVES//FR', 'CALSCALE:GREGORIAN']
    .concat(ev('poids', P.rmW, 'Coach-Mass-KVES : note ton poids', 'Pese-toi a jeun puis note ton poids dans l application.'))
    .concat(ev('repas', P.rmM, 'Coach-Mass-KVES : valide tes repas', 'Valide les repas du jour dans l application.'))
    .concat(['END:VCALENDAR']).join('\r\n') + '\r\n';
}
function rmCard() {
  var np = 'Notification' in window ? Notification.permission : 'none';
  return '<div class="card"><h2>Rappels</h2><label class="meal"><input type="checkbox" data-rm="on"' + (P.rmOn ? ' checked' : '') + '><span><b>Rappels quotidiens</b><br><span class="small">Poids le matin, validation des repas le soir. Rien n\'est envoyé si c\'est déjà fait.</span></span></label>' +
    '<div class="grid2"><label class="f">Poids à<input type="time" data-rm="w" value="' + esc(P.rmW) + '"></label><label class="f">Repas à<input type="time" data-rm="m" value="' + esc(P.rmM) + '"></label></div>' +
    '<label class="meal"><input type="checkbox" data-rm="water"' + (P.rmWater ? ' checked' : '') + '><span><b>Rappel d\'eau</b><br><span class="small">Toutes les 2 h entre 10 h et 18 h, seulement si tu es en retard sur ton objectif.</span></span></label>' +
    '<p class="small">' + (np === 'granted' ? 'Notifications autorisées. ' : np === 'denied' ? 'Notifications bloquées : autorise-les dans les réglages Android de Chrome. ' : np === 'none' ? 'Notifications non disponibles ici. ' : '') +
    'Application fermée, Android peut retarder ou ignorer le rappel. Pour être sûr de l\'heure, ajoute-les aussi à ton calendrier.</p>' +
    '<div class="row"><button class="btn alt sm" data-act="rmtest">Tester</button><button class="btn alt sm grow" data-act="rmics">Ajouter au calendrier</button></div>' +
    '<p class="small">Crée deux événements quotidiens avec alerte (poids et repas). Si tu changes les heures, supprime les anciens événements puis ajoute-les de nouveau.</p></div>';
}

document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act="rmics"]');
  if (!t) return;
  if (hm(P.rmW) === null || hm(P.rmM) === null) { toast('Règle d\'abord les deux heures.'); return; }
  download('coach-mass-kves-rappels.ics', icsText(), 'text/calendar');
  toast('Fichier créé : ouvre-le pour l\'ajouter à ton calendrier.');
});
/* © KVES · Coach-Mass-KVES */
/* mini compteur et minuteur par exercice */
var MT = {}, MT_I = null;
function mt(id) { return MT[id] || (MT[id] = { c: 0, ms: 0, run: false, t0: 0, beeped: false }); }
function mtMs(m) { return m.ms + (m.run ? Date.now() - m.t0 : 0); }
function mtFmt(ms) { var s = Math.floor(ms / 1000); return pad(Math.floor(s / 60)) + ':' + pad(s % 60); }
function mtFind(id) { for (var i = 0; i < EX.length; i++) if (EX[i].id === id) return EX[i]; return null; }
function mtHtml(e, tgt) {
  var m = mt(e.id), id = e.id;
  return '<div class="mt">' + (e.timed ? '' :
    '<div class="mtrow"><button class="btn alt round" data-act="mtdec" data-id="' + id + '" aria-label="Moins une répétition">−</button><b class="mtv" id="mt_c_' + id + '">' + m.c + '</b><button class="btn round" data-act="mtinc" data-id="' + id + '" aria-label="Plus une répétition">+</button><span class="small grow">répétitions</span></div>') +
    '<div class="mtrow"><b class="mtv wide" id="mt_t_' + id + '">' + mtFmt(mtMs(m)) + '</b><button class="btn alt sm" id="mt_b_' + id + '" data-act="mttoggle" data-id="' + id + '">' + (m.run ? 'Pause' : 'Minuteur') + '</button><button class="btn alt sm" data-act="mtreset" data-id="' + id + '">Zéro</button>' + (e.timed ? '<span class="small">objectif ' + tgt + ' s</span>' : '') + '</div>' +
    '<button class="btn alt sm" data-act="mtsave" data-id="' + id + '">Enregistrer la série</button></div>';
}
function mtTick() {
  var any = false;
  Object.keys(MT).forEach(function (id) {
    var m = MT[id];
    if (!m.run) return;
    any = true;
    var n = $('#mt_t_' + id);
    if (n) n.textContent = mtFmt(mtMs(m));
    var e = mtFind(id);
    if (e && e.timed && !m.beeped) {
      var tg = e.hi + lv(id).off;
      if (mtMs(m) >= tg * 1000) { m.beeped = true; if (P.sound) play('setend'); vib([300, 100, 300]); toast('Objectif atteint : ' + tg + ' s'); }
    }
  });
  if (!any && MT_I) { clearInterval(MT_I); MT_I = null; }
}
function mtSave(id) {
  var e = mtFind(id), m = mt(id);
  if (!e) return;
  var L = lv(id), names = levelsFor(e), val = e.timed ? Math.round(mtMs(m) / 1000) : m.c;
  if (!(val > 0)) { toast(e.timed ? 'Lance le minuteur d\'abord.' : 'Compte au moins une répétition.'); return; }
  var s = null;
  D.sessions.forEach(function (x) { if (x.free && x.date === today()) s = x; });
  if (!s) { s = { date: today(), min: 0, sets: 0, partial: true, free: true, light: false, week: wkNo(), logs: [] }; D.sessions.push(s); }
  var sn = s.logs.filter(function (l) { return l.id === id; }).length + 1;
  s.logs.push({ id: id, name: names[Math.min(L.level, names.length - 1)], hi: e.hi + L.off, sn: sn, reps: val });
  s.sets = s.logs.length;
  m.c = 0; m.ms = 0; m.run = false; m.beeped = false;
  save(); render(); toast('Série enregistrée dans l\'historique : ' + val + (e.timed ? ' s' : ' répétitions'));
}

document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act'), id = t.getAttribute('data-id'), v = t.getAttribute('data-v');
  if (a === 'theme') { P.theme = v; save(); applyTheme(); render(); return; }
  if (a === 'lang') { if (LANGS[v]) { P.lang = v; save(); location.reload(); } return; }
  if (a === 'budget') { P.budget = v === 'serre' ? 'serre' : 'normal'; save(); render(); return; }
  if (a === 'diet') { var dk = t.getAttribute('data-k'); if (/^(noEgg|noMilk|noNuts|noGluten|veg)$/.test(dk)) { P[dk] = !P[dk]; save(); render(); } return; }
  if (a === 'shopdays') { P.shopDays = +v; save(); render(); return; }
  if (a === 'shopm3') { P.shopM3 = v; save(); render(); return; }
  if (a === 'shopm5') { P.shopM5 = v; save(); render(); return; }
  if (a === 'shopreset') { P.shopDone = {}; save(); render(); return; }
  if (a === 'weekcopy') { copyText(weekText(weekReview())); return; }
  if (a === 'shopcopy') { copyText(shopText()); return; }
  if (a === 'rmtest') {
    var go = function () { if (!sysNotify('Test : tes rappels fonctionnent.', 'cm-test')) toast('Notifications non autorisées sur cet appareil.'); else toast('Notification envoyée. Ferme l\'écran pour la voir.'); };
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission().then(go).catch(go); else go();
    return;
  }
  if (a.indexOf('mt') !== 0 || !id) return;
  unlockAudio();
  var m = mt(id), e = mtFind(id);
  if (a === 'mtinc' || a === 'mtdec') {
    m.c = Math.max(0, Math.min(999, m.c + (a === 'mtinc' ? 1 : -1)));
    var c = $('#mt_c_' + id); if (c) c.textContent = m.c;
    if (a === 'mtinc') { vib(15); if (P.sound) beep(m.c % 5 === 0 ? 990 : 660, 40); }
    return;
  }
  if (a === 'mttoggle') {
    if (m.run) { m.ms = mtMs(m); m.run = false; }
    else { m.t0 = Date.now(); m.run = true; if (!MT_I) MT_I = setInterval(mtTick, 250); }
    t.textContent = m.run ? 'Pause' : 'Minuteur';
    return;
  }
  if (a === 'mtreset') {
    m.ms = 0; m.run = false; m.c = 0; m.beeped = false;
    var tn = $('#mt_t_' + id), cn = $('#mt_c_' + id), bn = $('#mt_b_' + id);
    if (tn) tn.textContent = '00:00'; if (cn) cn.textContent = '0'; if (bn) bn.textContent = 'Minuteur';
    return;
  }
  if (a === 'mtsave') { if (m.run) { m.ms = mtMs(m); m.run = false; } mtSave(id); return; }
});
document.addEventListener('change', function (ev) {
  var t = ev.target, k;
  if (!t.getAttribute) return;
  if (t.hasAttribute('data-shop')) {
    k = t.getAttribute('data-shop'); P.shopDone = P.shopDone || {};
    if (t.checked) P.shopDone[k] = 1; else delete P.shopDone[k];
    save(); return;
  }
  k = t.getAttribute('data-rm');
  if (!k) return;
  if (k === 'on') { if (t.checked) rmEnable(); else { P.rmOn = false; save(); render(); } return; }
  if (k === 'water') { P.rmWater = !!t.checked; save(); if (t.checked && !P.rmOn) rmEnable(); else { render(); rmCheck(); } return; }
  if (hm(t.value) !== null) { if (k === 'w') P.rmW = t.value; else P.rmM = t.value; save(); render(); rmCheck(); }
});
setInterval(rmCheck, 30000);
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') rmCheck(); });
if (P.rmOn) { regPeriodic(); setTimeout(rmCheck, 1500); }


/* © KVES · Coach-Mass-KVES */
/* ====================== sauvegarde : copies automatiques, rappel, export, restauration ====================== */
/* Les copies automatiques sont gardées dans IndexedDB (autre espace que le stockage principal) : elles protègent
   contre une erreur (effacement, import raté, données abîmées), pas contre un « Effacer les données » de Chrome.
   Seul un fichier exporté hors du téléphone protège de tout : d'où le rappel régulier. */
var BK_LIST = null, BK_ARM = '', BK_DB = null, PERSIST = null;

function bkDb() {
  if (!BK_DB) BK_DB = new Promise(function (res, rej) {
    try {
      var q = indexedDB.open('coach-masse-bk', 1);
      q.onupgradeneeded = function () { q.result.createObjectStore('snaps', { keyPath: 'id' }); };
      q.onsuccess = function () { res(q.result); };
      q.onerror = function () { rej(q.error); };
    } catch (e) { rej(e); }
  });
  return BK_DB;
}
function bkTx(mode, fn) {
  return bkDb().then(function (db) {
    return new Promise(function (res, rej) {
      var tx = db.transaction('snaps', mode), out = fn(tx.objectStore('snaps'));
      tx.oncomplete = function () { res(out && out.result !== undefined ? out.result : undefined); };
      tx.onerror = tx.onabort = function () { rej(tx.error); };
    });
  });
}
function bkAll() { return bkTx('readonly', function (s) { return s.getAll(); }).then(function (a) { return (a || []).sort(function (x, y) { return x.at < y.at ? 1 : -1; }); }); }
function hasData(d) {
  if (!d) return false;
  var logs = d.logs || {};
  return !!((d.sessions && d.sessions.length) || (d.measures && d.measures.length) || Object.keys(logs).some(function (k) { return logs[k] && Object.keys(logs[k]).length; }));
}
function bkPrune() {
  return bkAll().then(function (all) {
    var keep = { auto: 7, avant: 4, corrompu: 2 }, n = {}, del = [];
    all.forEach(function (r) { n[r.kind] = (n[r.kind] || 0) + 1; if (n[r.kind] > (keep[r.kind] || 4)) del.push(r.id); });
    return Promise.all(del.map(function (id) { return bkTx('readwrite', function (s) { return s.delete(id); }); }));
  });
}
/* Prend la copie tout de suite (le texte est figé au moment de l'appel), l'écriture suit. */
function bkSnap(kind, id, json) {
  json = json || JSON.stringify(D);
  var d; try { d = JSON.parse(json); } catch (e) { if (kind !== 'corrompu') return Promise.resolve(); d = {}; }
  if (kind === 'auto' && !hasData(d)) return Promise.resolve();
  var rec = { id: id, kind: kind, at: new Date().toISOString(), sessions: (d.sessions || []).length, days: Object.keys(d.logs || {}).filter(function (k) { return d.logs[k] && Object.keys(d.logs[k]).length; }).length, json: json };
  return bkTx('readwrite', function (s) { return s.put(rec); }).then(bkPrune).then(bkRefresh).catch(function () {});
}
function bkRefresh() {
  return bkAll().then(function (a) { BK_LIST = a; if (tab === 'settings') render(); }).catch(function () { BK_LIST = false; });
}
function bkAuto() { return bkSnap('auto', 'auto-' + today()); }

/* données abîmées au démarrage : on garde le texte brut pour ne pas le perdre */
if (window.__cmCorrupt) {
  try { localStorage.setItem(KEY + '-corrompu', window.__cmCorrupt); } catch (e) {}
  bkSnap('corrompu', 'corrompu-' + Date.now(), window.__cmCorrupt);
}

/* validation d'un fichier importé */
function validData(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
  if (o.logs !== undefined && (typeof o.logs !== 'object' || o.logs === null || Array.isArray(o.logs))) return false;
  if (o.sessions !== undefined && !Array.isArray(o.sessions)) return false;
  if (o.measures !== undefined && !Array.isArray(o.measures)) return false;
  if (o.profile !== undefined && (typeof o.profile !== 'object' || o.profile === null || Array.isArray(o.profile))) return false;
  return !!(o.logs || o.sessions || o.profile);
}
function applyData(o, label) {
  bkSnap('avant', label + '-' + Date.now());
  D = normalize(o); P = D.profile; save(); applyTheme(); render();
}

/* export : partage de fichier (Drive, WhatsApp, e-mail...) ou téléchargement */
function bkMark() { P.bkLast = today(); save(); render(); toast('Sauvegarde créée.'); }
function exportData() {
  var txt = JSON.stringify({ app: NOM, auteur: AUTEUR, coachMasse: VERSION, exportedAt: new Date().toISOString(), data: D });
  var name = 'coach-mass-kves-sauvegarde-' + today() + '.json', file = null;
  function dl() {
    try {
      var b = new Blob([txt], { type: 'application/json' }), a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      bkMark();
    } catch (e) { toast('Export impossible sur cet appareil.'); }
  }
  try { file = new File([txt], name, { type: 'application/json' }); } catch (e) {}
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: 'Sauvegarde Coach-Mass-KVES' }).then(bkMark).catch(function (e) { if (!e || e.name !== 'AbortError') dl(); });
  } else dl();
}
function bkDays() { return P.bkLast ? dnum(today()) - dnum(P.bkLast) : null; }
function bkDue() {
  var ev = P.bkEvery === undefined ? 7 : P.bkEvery;
  if (!ev || !hasData(D)) return false;
  var d = bkDays();
  if (d === null) return dnum(today()) - dnum(P.start) >= Math.min(ev, 3) || Object.keys(D.logs).filter(function (k) { return Object.keys(D.logs[k]).length; }).length >= 3;
  return d >= ev;
}
function bkBanner() {
  if (!bkDue()) return '';
  var d = bkDays();
  return '<div class="card"><h2>Sauvegarde conseillée</h2><p class="small">' + (d === null ? 'Tu n\'as encore jamais sauvegardé tes données hors du téléphone.' : 'Dernière sauvegarde il y a ' + d + ' jours.') + ' Envoie le fichier sur Drive ou à toi-même par WhatsApp : si le téléphone est perdu ou réinitialisé, tout disparaît.</p><button class="btn sm" data-act="bkexport">Sauvegarder maintenant</button></div>';
}
function bkCard() {
  if (BK_LIST === null) bkRefresh();
  var d = bkDays(), ev = P.bkEvery === undefined ? 7 : P.bkEvery;
  var h = '<div class="card"><h2>Sauvegarde</h2><p class="small">Dernière sauvegarde en fichier : <b>' + (d === null ? 'jamais' : d === 0 ? 'aujourd\'hui' : 'il y a ' + d + ' jours') + '</b>. Le fichier protège de tout, même d\'un téléphone perdu. La clé du propriétaire se sauvegarde à part (Plus > Espace propriétaire).</p>' +
    '<div class="row"><button class="btn sm grow" data-act="bkexport">Sauvegarder maintenant</button><button class="btn alt sm" data-act="import">Importer</button></div>' +
    '<label class="f">Me le rappeler</label><div class="seg">' + [[3, 'Tous les 3 j'], [7, '7 jours'], [14, '14 jours'], [0, 'Jamais']].map(function (x) { return '<button data-act="bkevery" data-v="' + x[0] + '" class="' + (ev === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>';
  h += '<h3>Copies automatiques sur ce téléphone</h3>';
  if (BK_LIST === false) h += '<p class="small">Indisponibles dans ce navigateur.</p>';
  else if (!BK_LIST || !BK_LIST.length) h += '<p class="small">Aucune pour le moment. Une copie est faite chaque jour d\'utilisation.</p>';
  else {
    var NAMES = { auto: 'Copie du jour', avant: 'Avant une action', corrompu: 'Données abîmées' };
    h += '<ul class="list">' + BK_LIST.map(function (r) {
      return '<li><span>' + esc((NAMES[r.kind] || r.kind) + ' · ' + r.at.slice(0, 10) + ' ' + r.at.slice(11, 16)) + '<br><span class="small">' + r.sessions + ' séances, ' + r.days + ' jours de suivi</span></span><button class="btn alt sm" data-act="bkrestore" data-id="' + esc(r.id) + '">' + (BK_ARM === r.id ? 'Confirmer' : 'Restaurer') + '</button></li>';
    }).join('') + '</ul><p class="small">Ces copies restent dans Chrome : elles disparaissent si tu effaces les données du site. Elles protègent d\'une erreur, pas d\'un téléphone perdu.</p>';
  }
  return h + '<p class="small">Stockage protégé contre le nettoyage automatique : <b>' + (PERSIST === true ? 'oui' : PERSIST === false ? 'non accordé' : 'inconnu') + '</b>.</p></div>';
}

document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'bkexport') { exportData(); return; }
  if (a === 'bkevery') { P.bkEvery = +t.getAttribute('data-v'); save(); render(); return; }
  if (a === 'bkrestore') {
    var id = t.getAttribute('data-id');
    if (BK_ARM !== id) { BK_ARM = id; render(); return; }
    BK_ARM = '';
    var rec = (BK_LIST || []).filter(function (r) { return r.id === id; })[0];
    try { var o = JSON.parse(rec.json); if (!validData(o)) throw 0; applyData(o, 'avant-restauration'); toast('Copie restaurée.'); } catch (e) { toast('Cette copie est illisible.'); render(); }
    return;
  }
  if (BK_ARM) { BK_ARM = ''; }
});
$('#importFile').addEventListener('change', function (ev) {
  var f = ev.target.files && ev.target.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function () {
    try {
      if (String(r.result).length > 5000000) throw 0;
      var o = JSON.parse(r.result);
      if (o && o.coachMasse && o.data) o = o.data;
      if (!validData(o)) throw 0;
      applyData(o, 'avant-import'); toast('Sauvegarde importée.');
    } catch (e) { toast('Fichier invalide : rien n\'a été modifié.'); }
  };
  r.readAsText(f);
  ev.target.value = '';
});
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') bkAuto(); });
setTimeout(bkAuto, 2500);
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(function (p) { PERSIST = p; if (tab === 'settings') render(); }); } catch (e) {}

/* © KVES · Coach-Mass-KVES */
/* ====================== exercices dissociables : réglages par exercice + lancement seul ====================== */
function exDef(e) { return { sets: (wkNo() <= 2 || !e.grow) ? 3 : 4, reps: e.hi + lv(e.id).off, rest: e.rest + (+P.restBonus || 0) }; }
function exCfg(e) {
  var c = (P.exCfg && P.exCfg[e.id]) || {}, d = exDef(e);
  return { sets: c.sets || d.sets, reps: c.reps || d.reps, rest: c.rest || d.rest };
}
function exFind(id) { for (var i = 0; i < EX.length; i++) if (EX[i].id === id) return EX[i]; return null; }
function exStep(e, k, dir) {
  var c = exCfg(e), lim = k === 'sets' ? [1, 8, 1] : k === 'rest' ? [10, 300, 5] : e.timed ? [5, 300, 5] : [1, 100, 1];
  var v = Math.max(lim[0], Math.min(lim[1], c[k] + dir * lim[2]));
  P.exCfg = P.exCfg || {};
  (P.exCfg[e.id] = P.exCfg[e.id] || {})[k] = v;
  save();
  return v;
}
function exCfgHtml(e) {
  var c = exCfg(e), id = e.id;
  function row(k, label, unit) {
    return '<div class="cfgrow"><span class="grow">' + label + '</span><button class="btn alt sm round" data-act="excfg" data-id="' + id + '" data-k="' + k + '" data-d="-1" aria-label="Moins : ' + label + '">−</button><b class="cfgv" id="cfg_' + id + '_' + k + '">' + c[k] + '</b><button class="btn alt sm round" data-act="excfg" data-id="' + id + '" data-k="' + k + '" data-d="1" aria-label="Plus : ' + label + '">+</button><span class="small cfgu">' + unit + '</span></div>';
  }
  return '<details class="cfg"><summary>Réglages et lancement seul</summary>' +
    row('sets', 'Séries', '') + row('reps', e.timed ? 'Durée' : 'Répétitions', e.timed ? 's' : '') + row('rest', 'Repos', 's') +
    '<p class="small">Les séries et répétitions servent au lancement seul. Le repos s\'applique aussi à la séance complète.</p>' +
    '<div class="row"><button class="btn sm grow" data-act="exsolo" data-id="' + id + '">Lancer seul</button><button class="btn alt sm" data-act="exreset" data-id="' + id + '">Réinitialiser</button></div></details>';
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a !== 'excfg' && a !== 'exsolo' && a !== 'exreset' && a !== 'exsoloGo') return;
  var e = exFind(t.getAttribute('data-id'));
  if (!e) return;
  if (a === 'excfg') {
    var k = t.getAttribute('data-k'), v = exStep(e, k, +t.getAttribute('data-d')), n = $('#cfg_' + e.id + '_' + k);
    if (n) n.textContent = v;
    return;
  }
  if (a === 'exreset') { if (P.exCfg) delete P.exCfg[e.id]; save(); render(); toast('Réglages remis par défaut.'); return; }
  if (exLocked(e)) { toast('Exercice réservé aux niveaux avancés.'); return; }
  if (a === 'exsolo' && e.risk) {
    modal('<h2>⚠ Avant de lancer</h2><p><b>' + esc(e.name) + '</b></p><p class="small">' + esc(e.risk[0] + ' ' + e.risk[1]) + '</p><p class="small"><b>Arrête-toi si :</b> ' + esc(e.risk[2]) + '</p>' +
      '<button class="btn go" data-act="exsoloGo" data-id="' + e.id + '">Je comprends, lancer</button><button class="btn alt" data-act="modalclose">Annuler</button>');
    return;
  }
  if (a === 'exsoloGo') closeModal();
  if (!R) startSession({ only: e.id });
});
/* © KVES · Coach-Mass-KVES */
/* ====================== événements ====================== */
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a !== 'reset') resetArmed = false;
  if (a !== 'delsession') delArmed = -1;
  if (a === 'tab') { tab = t.getAttribute('data-v'); render(); window.scrollTo(0, 0); return; }
  if (a === 'start') { startSession(); return; }
  if (a === 'quick') { startSession({ quick: true }); return; }
  if (a === 'energy') { log().energy = +t.getAttribute('data-n'); save(); render(); return; }
  if (a === 'cig') { var lc = log(); lc.cig = Math.max(0, (+lc.cig || 0) + +t.getAttribute('data-n')); save(); render(); return; }
  if (a === 'water') { var l = log(); l.water = Math.max(0, (+l.water || 0) + +t.getAttribute('data-n')); save(); render(); syncRemind(); return; }
  if (a === 'meal') { var lg = log(); lg.meals = lg.meals || []; lg.meals[+t.getAttribute('data-i')] = t.checked; save(); return; }
  if (a === 'adj') { P.kcalAdj += +t.getAttribute('data-v'); P.lastAdj = today(); save(); render(); return; }
  if (a === 'adjno') { P.lastAdj = today(); save(); render(); return; }
  if (a === 'measure') {
    var m = { date: today() }, any = false;
    MKEYS.forEach(function (k) { var v = parseFloat(($('#m_' + k).value || '').replace(',', '.')); if (v) { m[k] = v; any = true; } });
    if (any) { D.measures.push(m); save(); render(); }
    return;
  }
  if (a === 'day') { var d = +t.getAttribute('data-d'), i = P.days.indexOf(d); if (i >= 0) P.days.splice(i, 1); else P.days.push(d); save(); render(); return; }
  if (a === 'range') { CH.range = +t.getAttribute('data-v'); render(); return; }
  if (a === 'mksel') { CH.mk = t.getAttribute('data-v'); render(); return; }
  if (a === 'extra') {
    var xi = t.getAttribute('data-id'), xe = exFind(xi), core = !!(xe && xe.core), ar = core ? (P.sessOff = P.sessOff || []) : (P.extras = P.extras || []), ix = ar.indexOf(xi);
    if (!t.checked && EX.filter(inSession).length <= 3) { t.checked = true; toast('La séance garde au moins 3 exercices.'); return; }
    if (core) { if (t.checked && ix >= 0) ar.splice(ix, 1); else if (!t.checked && ix < 0) ar.push(xi); }
    else { if (t.checked && ix < 0) ar.push(xi); else if (!t.checked && ix >= 0) ar.splice(ix, 1); }
    save(); render(); return;
  }
  if (a === 'exsel') { CH.ex = t.getAttribute('data-v'); render(); return; }
  if (a === 'testsnd') { unlockAudio(); play(t.getAttribute('data-v')); vib([100]); return; }
  if (a === 'delsession') {
    var di = +t.getAttribute('data-i');
    if (delArmed !== di) { delArmed = di; render(); return; }
    D.sessions.splice(di, 1); delArmed = -1; save(); render(); return;
  }
  if (a === 'animtoggle') {
    var card = t.closest('.card'), sv = card && card.querySelector('svg.anim');
    if (sv) {
      if (sv.getAttribute('data-mode') === 'loop') {
        sv.setAttribute('data-t', sv._t || 0); sv.setAttribute('data-mode', 'manual'); t.textContent = 'Animer';
        var rg = card.querySelector('[data-scrub]'); if (rg) rg.value = Math.round((sv._t || 0) * 100);
      } else { sv.setAttribute('data-origin', performance.now()); sv.setAttribute('data-mode', 'loop'); t.textContent = 'Figer'; }
    }
    return;
  }
  if (a === 'vibpow') { P.vibLevel = +t.getAttribute('data-v'); save(); render(); vib([40, 120, 40]); return; }
  if (a === 'testvib') {
    var vr = navigator.vibrate ? navigator.vibrate(vibScale([40, 150, 40, 150, 200])) : null;
    toast(!P.vib ? 'Les vibrations sont désactivées dans les réglages de l\'application.' : vr === null ? 'Ce navigateur ne gère pas la vibration.' : vr === false ? 'Chrome a bloqué la vibration. Touche l\'écran puis réessaie.' : 'Vibration envoyée. Rien senti ? Vérifie les réglages Android : Son et vibration > Vibrations et retour haptique.');
    return;
  }
  if (a === 'testvoice') { say('Je suis ton coach. Pas d\'excuses. On commence.'); beep(880, 150); vib([150]); return; }
  if (a === 'export') { exportData(); return; }
  if (a === 'import') { $('#importFile').click(); return; }
  if (a === 'reset') {
    if (!resetArmed) { resetArmed = true; render(); return; }
    bkSnap('avant', 'avant-reset-' + Date.now()); phWipe(); D = defaults(); P = D.profile; save(); applyTheme(); resetArmed = false; render(); return;
  }
  /* séance */
  if (!R) return;
  if (a === 'pause') {
    R.paused = !R.paused;
    if (R.paused) { R.remain = R.endAt - performance.now(); try { window.speechSynthesis.cancel(); } catch (e) {} }
    else R.endAt = performance.now() + R.remain;
    draw(); return;
  }
  if (a === 'pain') {
    if (R.phase === 'done' || !cur() || cur().k === 'warm') return;
    painMark(); R.painOpen = true; R.pp = !R.paused;
    if (R.pp) { R.paused = true; R.remain = R.endAt - performance.now(); try { window.speechSynthesis.cancel(); } catch (e) {} }
    draw(); return;
  }
  if (a === 'painno') { R.painOpen = false; if (R.pp) { R.paused = false; R.endAt = performance.now() + R.remain; R.pp = false; } draw(); return; }
  if (a === 'painend') { R.painOpen = false; R.pp = false; R.paused = false; finish(true); return; }
  if (a === 'painskip') {
    var ci = cur().pi, ni = -1, q;
    for (q = R.i + 1; q < R.steps.length; q++) { if (R.steps[q].k === 'set' && R.steps[q].pi !== ci) { ni = q; break; } }
    R.painOpen = false; R.pp = false; R.paused = false; R.painSkip = true; clearTimer();
    if (ni < 0) { finish(true); return; }
    R.i = ni - 1; advance(); return;
  }
  if (a === 'quit') {
    if (R.stretch && R.quit) { endStretch(); return; }
    if (!R.quit) { R.quit = true; draw(); setTimeout(function () { if (R && R.phase !== 'done') { R.quit = false; if (R.phase !== 'done') draw(); } }, 4000); return; }
    finish(true); return;
  }
  if (a === 'skip') { clearTimer(); if (R.phase === 'rest' || R.steps[R.i].k === 'warm') advance(); return; }
  if (a === 'plus') { R.endAt += 15000; R.remain += 15000; return; }
  if (a === 'begin') { work(); return; }
  if (a === 'stopwork') { stopWork(); return; }
  if (a === 'repp' || a === 'repm') {
    var lastLog = R.logs[R.logs.length - 1];
    if (lastLog) { lastLog.reps = Math.max(0, lastLog.reps + (a === 'repp' ? 1 : -1)); R.reps = lastLog.reps; setTxt('reps', lastLog.reps); }
    return;
  }
  if (a === 'stretch') { startStretch(); return; }
  if (a === 'closerun') { closeRunner(); return; }
});
document.addEventListener('input', function (ev) {
  var t = ev.target;
  if (t.hasAttribute && t.hasAttribute('data-av')) {
    var k = t.getAttribute('data-av');
    if (k === 'consent') AV.consent = t.checked; else AV[k] = t.value;
    if (k === 'msg') { var c = $('#av_cnt'); if (c) c.textContent = t.value.length + ' / 800'; }
    return;
  }
  if (!t.hasAttribute || !t.hasAttribute('data-scrub')) return;
  var card = t.closest('.card'), sv = card && card.querySelector('svg.anim');
  if (!sv) return;
  sv.setAttribute('data-mode', 'manual'); sv.setAttribute('data-t', String(t.value / 100));
  var b = card.querySelector('[data-act="animtoggle"]'); if (b) b.textContent = 'Animer';
});
document.addEventListener('change', function (ev) {
  var t = ev.target;
  if (t.hasAttribute('data-log')) {
    var k = t.getAttribute('data-log'), v = t.value.replace(',', '.');
    var l = log();
    if (v === '') delete l[k]; else l[k] = parseFloat(v);
    save(); render(); return;
  }
  if (t.hasAttribute('data-set')) {
    var key = t.getAttribute('data-set');
    if (t.type === 'checkbox') P[key] = t.checked;
    else if (key === 'start') { if (/^\d{4}-\d{2}-\d{2}$/.test(t.value)) P[key] = t.value; }
    else { var n = parseFloat(t.value.replace(',', '.')); if (key === 'goal' && !isNaN(n)) { var gm = goalCheck(obj(), P.height, currentWeight(), n); if (gm) { toast(gm); render(); return; } } if (!isNaN(n)) P[key] = n; }
    if (key === 'rotate') applyRotate();
    save(); render(); return;
  }
  if (t.getAttribute('data-act') === 'meal') {
    var lg = log(); lg.meals = lg.meals || []; lg.meals[+t.getAttribute('data-i')] = t.checked; save();
  }
});
/* © KVES · Coach-Mass-KVES */
/* ====================== mise à jour : popup « nouveautés » et « version prête » ====================== */
function modal(h) {
  var m = $('#modal');
  if (m.hidden) modal._prev = document.activeElement;
  m.innerHTML = '<div class="mbox" role="document">' + h + '</div>'; m.hidden = false;
  var b = m.querySelector('button'); if (b) b.focus();
}
function closeModal() { $('#modal').hidden = true; var p = modal._prev; modal._prev = null; if (p && p.focus && document.contains(p)) { try { p.focus({ preventScroll: true }); } catch (e) {} } }
document.addEventListener('keydown', function (ev) { var m = $('#modal'); if (ev.key === 'Escape' && m && !m.hidden && m.querySelector('[data-act=modalclose]')) closeModal(); });
function whatsNew() {
  modal('<h2>Mise à jour installée</h2><p class="small">' + esc(NOM) + ' · version ' + esc(VERSION) + '</p><ul class="list">' + NOTES.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul><button class="btn" data-act="modalclose">Compris</button>');
}
/* À appeler au démarrage : montre les nouveautés une seule fois après un changement de version.
   Première installation, ou passage depuis une version sans cette fonction : rien n'est affiché. */
function checkUpdate() {
  var seen = P.seenVersion;
  P.seenVersion = VERSION; save();
  if (seen && seen !== VERSION && !R) whatsNew();
}
if (navigator.serviceWorker) {
  var hadController = !!navigator.serviceWorker.controller, lastUpd = 0;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController) { hadController = true; return; }
    if (R) { toast('Mise à jour prête : elle s\'appliquera à la prochaine ouverture.'); return; }
    modal('<h2>Nouvelle version prête</h2><p>Une mise à jour de ' + esc(NOM) + ' vient d\'être téléchargée. Recharge pour l\'utiliser.</p><button class="btn" data-act="modalreload">Recharger maintenant</button><button class="btn alt" data-act="modalclose">Plus tard</button>');
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible' || Date.now() - lastUpd < 3600000) return;
    lastUpd = Date.now();
    navigator.serviceWorker.getRegistration().then(function (r) { if (r) return r.update(); }).catch(function () {});
  });
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'modalclose') closeModal();
  else if (a === 'modalreload') window.location.reload();
});
/* © KVES · Coach-Mass-KVES */
/* ====================== sources et limites ====================== */
function viewSources() {
  var refs = [
    ['Renforcement musculaire', 'Au moins 2 jours par semaine sur les grands groupes musculaires (OMS, Lignes directrices sur l\'activité physique et la sédentarité, 2020). L\'application propose 3 séances.'],
    ['Progression', 'Augmenter la difficulté quand toutes les séries sont réussies (American College of Sports Medicine, Position Stand « Progression models in resistance training for healthy adults », 2009).'],
    ['Protéines', 'Environ 1,6 g par kg et par jour suffisent en général pour gagner du muscle en s\'entraînant, jusqu\'à 2,2 g/kg selon les cas (Morton et coll., British Journal of Sports Medicine, 2018). La cible de 135 g correspond à 1,7 à 1,8 g/kg pour 75 à 80 kg.'],
    ['Sommeil', 'Sept heures ou plus par nuit pour un adulte (Watson et coll., consensus AASM et SRS, Journal of Clinical Sleep Medicine, 2015).'],
    ['Calories', 'Besoins estimés avec l\'équation de Mifflin-St Jeor (Mifflin et coll., American Journal of Clinical Nutrition, 1990), multipliés par 1,4 (activité légère). Perte de poids : déficit limité à 500 kcal ou 20 %, avec un plancher de 1 500 kcal (homme), 1 200 kcal (femme) et 1 350 kcal (non précisé). C\'est une estimation : ajuste avec ton poids.'],
    ['Rythme de prise de poids', 'Un gain lent de l\'ordre de 0,25 à 0,5 kg par semaine est un repère courant pour limiter la prise de graisse.']
  ];
  var lim = [
    'Ce programme est un repère général pour un adulte en bonne santé. Il ne remplace ni un médecin, ni un coach, ni un diététicien.',
    'Consulte un médecin avant de commencer si tu as une maladie cardiaque, de l\'hypertension, du diabète, une blessure, une douleur au thorax, ou un doute.',
    'Arrête l\'exercice en cas de douleur vive, de vertige, de malaise ou d\'essoufflement anormal.',
    'Les repas sont des exemples avec des valeurs indicatives. Ils ne tiennent pas compte des allergies, des intolérances ni des régimes médicaux.',
    'Les exercices avancés (pompes diamant, dips, squat sauté) sollicitent davantage les articulations : passe au niveau suivant seulement si le précédent est maîtrisé.',
    'Le tabac réduit l\'endurance et ralentit la récupération. Pour arrêter, un médecin ou un service d\'aide à l\'arrêt peut t\'accompagner.',
    'Les résultats varient d\'une personne à l\'autre et ne sont pas garantis. L\'application est prévue pour les adultes (18 ans et plus).'
  ];
  var risky = EX.filter(function (e) { return e.risk; });
  return backBtn() + '<h1>Sources et limites</h1>' +
    '<div class="card"><h2>D\'où viennent les repères</h2><ul class="list">' + refs.map(function (r) { return '<li><span><b>' + esc(r[0]) + '</b><br><span class="small">' + esc(r[1]) + '</span></span></li>'; }).join('') + '</ul></div>' +
    '<div class="card"><h2>Limites et prudence</h2><ul class="list">' + lim.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul></div>' +
    '<div class="card"><h2>Exercices à risque</h2><p class="small">Ces exercices demandent plus d\'attention. Ils portent aussi un encadré « Précautions » dans l\'onglet Séance.</p><ul class="list">' + risky.map(function (e) { return '<li><span><b>' + esc(e.name) + '</b>' + (e.adv ? ' <span class="pill">avancé</span>' : '') + '<br><span class="small">' + esc(e.risk[0] + ' ' + e.risk[1]) + '<br><b>Arrête-toi si :</b> ' + esc(e.risk[2]) + '</span></span></li>'; }).join('') + '</ul></div>' +
    '<div class="card"><h2>Tes données</h2><p class="small">Elles restent sur ton téléphone. Aucun serveur ne les reçoit. Seuls les avis que tu envoies toi-même sont transmis, chiffrés.</p></div>';
}
/* © KVES · Coach-Mass-KVES */
/* ====================== lecteur de musique locale (13.5) ======================
   Les fichiers choisis restent sur le téléphone : lus via une adresse temporaire (blob), jamais copiés ni envoyés. */
var MP = { list: [], i: -1, shuffle: false, rep: 'off', hist: [], vol: 1 };
var mAudio = new Audio();
mAudio.preload = 'metadata';
var M_EXT = /\.(mp3|m4a|aac|ogg|opus|wav|flac|weba)$/i;
function mName(f) { return String(f.name || 'Audio').replace(/\.[A-Za-z0-9]{2,5}$/, ''); }
function mFmt(s) { s = Math.max(0, Math.floor(+s || 0)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
function mAdd(files) {
  var n = 0, i, f;
  for (i = 0; i < files.length && MP.list.length < 300; i++) {
    f = files[i];
    if (!(/^audio\//.test(f.type) || M_EXT.test(f.name || ''))) continue;
    MP.list.push({ name: mName(f), url: URL.createObjectURL(f) }); n++;
  }
  if (!n) { toast('Aucun fichier audio reconnu.'); return; }
  toast(n + ' morceau(x) ajouté(s).');
  if (MP.i < 0) mPlay(0); else if (tab === 'player') render();
}
/* mini-lecteur de la séance + baisse du volume quand le coach parle (13.6) */
var mDuckN = 0;
function mDuck(on) { try { mAudio.volume = on ? MP.vol * 0.3 : MP.vol; } catch (e) {} }
function mDuckSay(u) {
  if (mAudio.paused || !MP.list.length) return;
  var id = ++mDuckN;
  function back() { if (id === mDuckN) mDuck(false); }
  mDuck(true);
  u.onend = back; u.onerror = back;
  setTimeout(back, 9000);
}
function mMiniHtml() {
  if (!MP.list.length) return '';
  var playing = MP.i >= 0 && !mAudio.paused;
  return '<div class="row mini"><button class="btn alt sm" data-act="mprev" aria-label="Précédent">⏮</button><button class="btn alt sm" id="mmtoggle" data-act="mtoggle" aria-label="' + (playing ? 'Pause' : 'Lecture') + '">' + (playing ? '⏸' : '▶') + '</button><button class="btn alt sm" data-act="mnext" aria-label="Suivant">⏭</button><span class="small grow" id="mmname">♪ ' + esc(MP.i >= 0 ? MP.list[MP.i].name : '') + '</span></div>';
}
function mMiniSync() {
  var b = document.getElementById('mmtoggle'), n = document.getElementById('mmname');
  if (b) { var pl = !mAudio.paused; b.textContent = pl ? '⏸' : '▶'; b.setAttribute('aria-label', trText(pl ? 'Pause' : 'Lecture')); }
  if (n && MP.i >= 0) n.textContent = '♪ ' + MP.list[MP.i].name;
}
function mMeta() {
  if (!('mediaSession' in navigator) || typeof MediaMetadata !== 'function' || MP.i < 0) return;
  try { navigator.mediaSession.metadata = new MediaMetadata({ title: MP.list[MP.i].name, artist: NOM, album: 'Ma musique' }); } catch (e) {}
}
function mPlay(i, noHist) {
  if (i < 0 || i >= MP.list.length) return;
  if (!noHist && MP.i >= 0 && MP.i !== i) MP.hist.push(MP.i);
  MP.i = i;
  mAudio.src = MP.list[i].url;
  mAudio.volume = MP.vol;
  var p = mAudio.play(); if (p && p.catch) p.catch(function () { toast('Lecture impossible : touche Lecture.'); });
  mMeta(); mMiniSync();
  if (tab === 'player') render();
}
function mToggle() {
  if (MP.i < 0) { if (MP.list.length) mPlay(0); return; }
  if (mAudio.paused) { var p = mAudio.play(); if (p && p.catch) p.catch(function () {}); } else mAudio.pause();
}
function mNext(auto) {
  var n = MP.list.length, j;
  if (!n) return;
  if (auto && MP.rep === 'one') { mAudio.currentTime = 0; mAudio.play(); return; }
  if (MP.shuffle && n > 1) { do { j = Math.floor(Math.random() * n); } while (j === MP.i); mPlay(j); return; }
  j = MP.i + 1;
  if (j >= n) { if (MP.rep === 'all' || !auto) j = 0; else { mAudio.pause(); mAudio.currentTime = 0; if (tab === 'player') render(); return; } }
  mPlay(j);
}
function mPrev() {
  if (!MP.list.length) return;
  if (mAudio.currentTime > 3) { mAudio.currentTime = 0; return; }
  if (MP.hist.length) { mPlay(MP.hist.pop(), true); return; }
  mPlay(MP.i > 0 ? MP.i - 1 : MP.list.length - 1, true);
}
function mClear() {
  mAudio.pause(); mAudio.removeAttribute('src'); try { mAudio.load(); } catch (e) {}
  MP.list.forEach(function (t) { try { URL.revokeObjectURL(t.url); } catch (e) {} });
  MP.list = []; MP.i = -1; MP.hist = [];
  if ('mediaSession' in navigator) { try { navigator.mediaSession.metadata = null; } catch (e) {} }
  if (tab === 'player') render();
}
mAudio.addEventListener('ended', function () { mNext(true); });
mAudio.addEventListener('play', function () { if (tab === 'player') render(); mMiniSync(); });
mAudio.addEventListener('pause', function () { if (tab === 'player') render(); mMiniSync(); });
mAudio.addEventListener('error', function () { if (MP.i >= 0) toast('Fichier illisible : ' + MP.list[MP.i].name); });
mAudio.addEventListener('timeupdate', function () {
  var s = document.getElementById('mpos'), t = document.getElementById('mtime');
  if (s && document.activeElement !== s) { s.max = Math.floor(mAudio.duration || 0) || 0; s.value = Math.floor(mAudio.currentTime); }
  if (t) t.textContent = mFmt(mAudio.currentTime) + ' / ' + mFmt(mAudio.duration);
});
if ('mediaSession' in navigator) {
  [['play', function () { mToggle(); }], ['pause', function () { mAudio.pause(); }], ['previoustrack', mPrev], ['nexttrack', function () { mNext(false); }],
   ['seekto', function (d) { if (d && typeof d.seekTime === 'number') mAudio.currentTime = d.seekTime; }]].forEach(function (a) { try { navigator.mediaSession.setActionHandler(a[0], a[1]); } catch (e) {} });
}
$('#musicFile').addEventListener('change', function (ev) { mAdd(ev.target.files || []); ev.target.value = ''; });
document.addEventListener('input', function (ev) {
  var t = ev.target;
  if (t.id === 'mpos') mAudio.currentTime = +t.value;
  else if (t.id === 'mvol') { MP.vol = Math.max(0, Math.min(1, (+t.value) / 100)); mAudio.volume = MP.vol; }
});
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'mpick') $('#musicFile').click();
  else if (a === 'mplay') mPlay(+t.getAttribute('data-i'));
  else if (a === 'mtoggle') mToggle();
  else if (a === 'mnext') mNext(false);
  else if (a === 'mprev') mPrev();
  else if (a === 'mshuf') { MP.shuffle = !MP.shuffle; render(); }
  else if (a === 'mrep') { MP.rep = MP.rep === 'off' ? 'all' : MP.rep === 'all' ? 'one' : 'off'; render(); }
  else if (a === 'mclear') mClear();
});
function viewPlayer() {
  var cur = MP.i >= 0 ? MP.list[MP.i] : null, playing = cur && !mAudio.paused;
  var repL = { off: 'Répétition : aucune', all: 'Répétition : toute la liste', one: 'Répétition : un morceau' }[MP.rep];
  var h = backBtn() + '<h1>Lecteur</h1>';
  h += '<div class="card"><h2>Ma musique</h2><p class="small">Choisis des fichiers audio de ton téléphone (MP3, M4A…). Ils ne sont ni copiés ni envoyés. À la prochaine ouverture de l\'application, il faudra les choisir de nouveau.</p><button class="btn" data-act="mpick">Choisir mes musiques</button></div>';
  h += '<div class="card' + (cur ? ' coach' : '') + '"><span class="head">' + (cur ? 'En lecture' : 'Rien en lecture') + '</span>' +
    '<p class="msg">' + (cur ? esc(cur.name) : 'Aucun morceau choisi.') + '</p>' +
    '<input type="range" id="mpos" min="0" max="' + (Math.floor(mAudio.duration || 0) || 0) + '" value="' + Math.floor(mAudio.currentTime || 0) + '" aria-label="Position"' + (cur ? '' : ' disabled') + '>' +
    '<p class="small" id="mtime">' + mFmt(mAudio.currentTime) + ' / ' + mFmt(mAudio.duration) + '</p>' +
    '<div class="row"><button class="btn alt grow" data-act="mprev" aria-label="Précédent">⏮</button><button class="btn go grow" data-act="mtoggle" aria-label="' + (playing ? 'Pause' : 'Lecture') + '">' + (playing ? '⏸' : '▶') + '</button><button class="btn alt grow" data-act="mnext" aria-label="Suivant">⏭</button></div>' +
    '<div class="row"><button class="btn ' + (MP.shuffle ? '' : 'alt ') + 'sm grow" data-act="mshuf" aria-pressed="' + MP.shuffle + '">Aléatoire : ' + (MP.shuffle ? 'oui' : 'non') + '</button><button class="btn ' + (MP.rep === 'off' ? 'alt ' : '') + 'sm grow" data-act="mrep">' + repL + '</button></div>' +
    '<label class="f">Volume</label><input type="range" id="mvol" min="0" max="100" value="' + Math.round(MP.vol * 100) + '" aria-label="Volume"></div>';
  if (MP.list.length) {
    h += '<div class="card"><h2>' + MP.list.length + ' morceau(x)</h2><ul class="list">' + MP.list.map(function (t, i) {
      return '<li><button class="btn ' + (i === MP.i ? '' : 'alt ') + 'sm grow" data-act="mplay" data-i="' + i + '">' + (i === MP.i ? '▶ ' : '') + esc(t.name) + '</button></li>';
    }).join('') + '</ul><button class="btn alt sm" data-act="mclear">Vider la liste</button></div>';
  }
  return h;
}
/* © KVES · Coach-Mass-KVES */
/* ====================== profil : genre, objectif, âge, mensurations ====================== */
var OB = { gender: 'n', obj: 'masse', fresh: false };
var GEN = { h: 'Homme', f: 'Femme', n: 'Ne pas préciser' };
function userHasData() { return hasData(D); }
function needOnboarding() { return !P.onboarded && !userHasData(); }
function segHtml(act, cur, map) {
  return '<div class="seg wrap" role="group">' + Object.keys(map).map(function (k) { return '<button type="button" data-act="' + act + '" data-v="' + k + '" class="' + (cur === k ? 'on' : '') + '">' + map[k] + '</button>'; }).join('') + '</div>';
}
var PARQ = ["Un médecin t'a-t-il déjà parlé d'un problème de cœur ou de tension trop élevée ?", "Ressens-tu une douleur dans la poitrine, au repos ou à l'effort ?", "As-tu des vertiges, des pertes d'équilibre ou des malaises ?", "As-tu un problème d'os, d'articulations ou de dos qui peut s'aggraver avec l'exercice ?", "Prends-tu un médicament pour le cœur, la tension ou le diabète ?", "Es-tu enceinte ou as-tu accouché récemment ?", "Connais-tu une autre raison pour laquelle tu ne devrais pas faire d'effort physique ?"];
function showParq() {
  modal('<h2>Questionnaire de santé</h2><p class="small">Coche ce qui te concerne. Si tu ne coches rien, tu peux commencer.</p>' + PARQ.map(function (q, i) { return '<label class="meal"><input type="checkbox" data-parq="' + i + '"><span>' + esc(q) + '</span></label>'; }).join('') + '<button class="btn" data-act="parqsave">Valider mes réponses</button><button class="btn alt" data-act="modalclose">Plus tard</button>');
}
function goalCheck(o, h, w, goal) {
  if (!(h > 0 && w > 0 && goal > 0)) return '';
  if (o === 'masse' && goal / Math.pow(h / 100, 2) > 27) return 'Ce poids visé est trop élevé pour ta taille (IMC au-dessus de 27). Choisis un objectif plus bas ou parle à un médecin.';
  if (Math.abs(goal - w) / w > 0.15) return 'Objectif trop éloigné (plus de 15 % de ton poids actuel). Fixe une première étape plus proche : tu pourras la relever ensuite.';
  return '';
}
function parqCard() {
  if (!P.onboarded) return '';
  if (!P.parq) return '<div class="card"><h2>Questionnaire de santé</h2><p class="small">7 questions, 1 minute, pour savoir si tu dois voir un médecin avant de commencer.</p><button class="btn alt" data-act="parqopen">Faire le questionnaire</button></div>';
  if (P.parq === 'avis') return '<div class="card"><h2>Avis médical conseillé</h2><p class="small">Tes réponses indiquent qu\'un avis médical est conseillé avant de t\'entraîner.</p><button class="btn alt" data-act="parqdone">J\'ai consulté un médecin</button><button class="btn alt sm" data-act="parqopen">Refaire le questionnaire</button></div>';
  return '';
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'rpe') { if (R && R.sess) { R.sess.rpe = +t.getAttribute('data-n'); save(); drawDone(); } }
  else if (a === 'deloadon') { P.deloadOn = weekStartStr(); P.deloadLast = wkNo(); save(); render(); }
  else if (a === 'absgo') { var u7 = new Date(); u7.setDate(u7.getDate() + 6); P.deloadUntil = dstr(u7); P.deloadLast = wkNo(); save(); render(); }
  else if (a === 'absskip') { P.absSkip = lastSessDate(); save(); render(); }
  else if (a === 'deloadskip') { P.deloadSkip = wkNo(); save(); render(); }
  else if (a === 'deloadstop') { P.deloadOn = ''; P.deloadUntil = ''; save(); render(); }
  else if (a === 'parqopen') showParq();
  else if (a === 'parqdone') { P.parq = 'consulte'; save(); render(); }
  else if (a === 'parqsave') {
    var n = document.querySelectorAll('#modal [data-parq]:checked').length;
    P.parq = n ? 'avis' : 'ok'; P.parqDate = today(); save(); render();
    if (n) modal('<h2>Parle à un médecin avant de commencer</h2><p>Au moins une réponse demande un avis médical. Montre ces réponses à ton médecin avant de t\'entraîner ou de changer ton alimentation. Ce questionnaire ne remplace pas une consultation.</p><button class="btn" data-act="modalclose">Compris</button>');
    else { closeModal(); toast('Questionnaire enregistré : aucune alerte.'); }
  }
});
function showOnboarding() {
  OB.fresh = !userHasData();
  OB.gender = P.gender || 'n'; OB.obj = obj();
  function v(x) { return OB.fresh ? '' : x; }
  var h = '<div class="onb"><h2>Ton profil</h2><p class="small">Pour adapter les calories et les conseils. Tout reste sur ton téléphone. Application réservée aux personnes de 18 ans et plus.</p>' +
    '<label class="f">Genre</label>' + segHtml('obg', OB.gender, GEN) +
    '<label class="f">Objectif</label>' + segHtml('obo', OB.obj, OBJ) +
    '<div class="grid2"><label class="f">Âge<input type="number" inputmode="numeric" id="ob_age" value="' + v(P.age) + '" placeholder="25"></label>' +
    '<label class="f">Taille (cm)<input type="number" inputmode="numeric" id="ob_h" value="' + v(P.height) + '" placeholder="175"></label>' +
    '<label class="f">Poids actuel (kg)<input type="number" inputmode="decimal" step="0.1" id="ob_w" value="' + v(fmt(currentWeight()).replace(',', '.')) + '" placeholder="70"></label>' +
    '<label class="f">Poids visé (kg)<input type="number" inputmode="decimal" step="0.5" id="ob_goal" value="' + v(P.goal) + '" placeholder="75"></label></div>' +
    '<details class="cfg"><summary>Mensurations (facultatif, en cm)</summary><div class="grid2">' + MKEYS.map(function (k) { return '<label class="f">' + MLAB[k] + '<input type="number" inputmode="decimal" step="0.5" id="ob_m_' + k + '"></label>'; }).join('') + '</div></details>' +
    '<p class="small">Repères généraux, pas un avis médical. En cas de maladie, de traitement, de grossesse ou de doute, parle à un médecin avant de changer ton alimentation ou ton sport.</p>' +
    (P.healthOk ? '' : '<label class="meal"><input type="checkbox" id="ob_health"><span>J\'ai lu l\'avertissement santé et les conditions d\'utilisation (Plus > Légal).</span></label>') +
    '<p class="small bad" id="obErr" role="alert" hidden></p>' +
    '<button class="btn go" data-act="obsave">Valider</button>' +
    (OB.fresh ? '<button class="btn alt" data-act="import">J\'ai déjà une sauvegarde : l\'importer</button>' : '<button class="btn alt" data-act="modalclose">Plus tard</button>') + '</div>';
  modal(h);
}
function obErr(t) { var n = $('#obErr'); if (n) { n.textContent = t; n.hidden = !t; if (t) n.scrollIntoView({ block: 'nearest' }); } return false; }
function num(id) { var n = $('#' + id); return n ? parseFloat((n.value || '').replace(',', '.')) : NaN; }
function saveOnboarding() {
  var age = num('ob_age'), h = num('ob_h'), w = num('ob_w'), goal = num('ob_goal'), o = OB.obj;
  if (!(age >= 1)) return obErr('Indique ton âge.');
  if (age < 18) return obErr('Cette application est réservée aux personnes de 18 ans et plus. Reviens à tes 18 ans ou demande conseil à un professionnel.');
  if (age > 99) return obErr('Âge invalide.');
  if (!(h >= 120 && h <= 230)) return obErr('Taille invalide (entre 120 et 230 cm).');
  if (!(w >= 35 && w <= 250)) return obErr('Poids actuel invalide (entre 35 et 250 kg).');
  if (o === 'tonif' || o === 'maintien') { if (!(goal >= 35 && goal <= 250)) goal = w; }
  if (!(goal >= 35 && goal <= 250)) return obErr('Indique ton poids visé.');
  if (o === 'masse' && goal <= w) return obErr('Pour une prise de masse, ton poids visé doit être supérieur à ton poids actuel.');
  if (o === 'perte' && goal >= w) return obErr('Pour perdre du poids, ton poids visé doit être inférieur à ton poids actuel.');
  var imc = goal / Math.pow(h / 100, 2);
  if (o === 'perte' && imc < 18.5) return obErr('Ce poids visé est trop bas pour ta taille (IMC sous 18,5). Choisis un objectif plus haut ou parle à un médecin.');
  if (!P.healthOk) { var hc = $('#ob_health'); if (!hc || !hc.checked) return obErr('Coche la case pour confirmer que tu as lu l\'avertissement santé.'); }
  var gc = goalCheck(o, h, w, goal); if (gc) return obErr(gc);
  var fresh = !userHasData(), changed = obj() !== o;
  P.gender = OB.gender; P.obj = o; P.age = Math.round(age); P.height = Math.round(h); P.goal = goal; P.onboarded = true; P.healthOk = true;
  if (fresh) { P.w0 = w; P.start = today(); }
  else if (Math.abs(w - currentWeight()) >= 0.05) log().weight = w;
  if (changed) { P.kcalAdj = 0; P.lastAdj = ''; }
  var m = { date: today() }, any = false;
  MKEYS.forEach(function (k) { var x = num('ob_m_' + k); if (x > 0) { m[k] = x; any = true; } });
  if (any) D.measures.push(m);
  save(); closeModal(); render(); toast('Profil enregistré.');
  return true;
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'obopen') showOnboarding();
  else if (a === 'obg' || a === 'obo') {
    OB[a === 'obg' ? 'gender' : 'obj'] = t.getAttribute('data-v');
    Array.prototype.forEach.call(t.parentNode.children, function (b) { b.classList.toggle('on', b === t); });
  } else if (a === 'obsave') saveOnboarding();
});
/* © KVES · Coach-Mass-KVES */
/* ====================== partager l'application : message, lien, QR code ====================== */
var APP_URL = 'https://darkangeldaoud.github.io/Coach-Mass-KVES/';
var SHARE_TEXT = NOM + ' : ton coach de musculation à la maison. Séances guidées à la voix, repas adaptés à ton objectif, suivi du poids et des mensurations. Sans matériel, hors ligne, 100 % privé.';
function shareCard() {
  return '<div class="card"><h2>Partager l\'application</h2><p class="small">Envoie ' + esc(NOM) + ' à un ami pour qu\'il l\'essaie : le lien affiche le logo et les fonctionnalités clés.</p>' +
    '<div class="row"><button class="btn grow" data-act="appshare">Partager</button><button class="btn alt" data-act="appcopy">Copier le lien</button></div>' +
    '<details class="cfg"><summary>Afficher le QR code</summary><div class="qrbox">' + QR.svg(APP_URL) + '</div><p class="small">Ton ami scanne ce code avec l\'appareil photo de son téléphone.</p></details></div>';
}
document.addEventListener('click', function (ev) {
  var t = ev.target.closest('[data-act]');
  if (!t) return;
  var a = t.getAttribute('data-act');
  if (a === 'appcopy') copyText(trText(SHARE_TEXT) + ' ' + APP_URL);
  else if (a === 'appshare') {
    if (navigator.share) navigator.share({ title: NOM, text: trText(SHARE_TEXT), url: APP_URL }).catch(function () {});
    else copyText(trText(SHARE_TEXT) + ' ' + APP_URL);
  }
});
/* © KVES · Coach-Mass-KVES */
/* ====================== QR code (hors ligne : versions 1 à 4 correction L, version 6 correction H pour le logo central) ====================== */
var QR = (function () {
  var CAP = [null, [19, 7], [34, 10], [55, 15], [80, 20]];   /* [mots de données, mots de correction] */
  var EXP = [], LOG = [];
  (function () { var x = 1; for (var i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; } for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  function mul(a, b) { return a && b ? EXP[LOG[a] + LOG[b]] : 0; }
  function ecc(data, deg) {
    var div = [], i, j, root = 1;
    for (i = 0; i < deg - 1; i++) div.push(0); div.push(1);
    for (i = 0; i < deg; i++) {
      for (j = 0; j < deg; j++) { div[j] = mul(div[j], root); if (j + 1 < deg) div[j] ^= div[j + 1]; }
      root = mul(root, 2);
    }
    var rem = []; for (i = 0; i < deg; i++) rem.push(0);
    data.forEach(function (bt) {
      var f = bt ^ rem.shift(); rem.push(0);
      for (var k = 0; k < deg; k++) rem[k] ^= mul(div[k], f);
    });
    return rem;
  }
  function bytes(txt) { return unescape(encodeURIComponent(txt)).split('').map(function (c) { return c.charCodeAt(0); }); }
  function build(txt, hi) {
    var b = bytes(txt), v = 0, i;
    if (hi) { if (b.length > 58) return null; v = 6; } else { for (i = 1; i <= 4; i++) if (b.length <= CAP[i][0] - 2) { v = i; break; } }
    if (!v) return null;
    var bits = [];
    function put(val, n) { for (var k = n - 1; k >= 0; k--) bits.push((val >> k) & 1); }
    put(4, 4); put(b.length, 8); b.forEach(function (x) { put(x, 8); });
    var dcw = hi ? 60 : CAP[v][0], total = dcw * 8;
    for (i = 0; i < 4 && bits.length < total; i++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var cw = [];
    for (i = 0; i < bits.length; i += 8) { var w = 0; for (var k = 0; k < 8; k++) w = (w << 1) | bits[i + k]; cw.push(w); }
    for (i = 0; cw.length < dcw; i++) cw.push(i % 2 ? 0x11 : 0xec);
    if (hi) {                                           /* version 6, niveau H : 4 blocs de 15 mots de données + 28 mots de correction */
      var blocks = [], ecs = [];
      for (i = 0; i < 4; i++) { blocks.push(cw.slice(i * 15, i * 15 + 15)); ecs.push(ecc(blocks[i], 28)); }
      cw = [];
      for (i = 0; i < 15; i++) blocks.forEach(function (bl) { cw.push(bl[i]); });
      for (i = 0; i < 28; i++) ecs.forEach(function (ec) { cw.push(ec[i]); });
    } else cw = cw.concat(ecc(cw, CAP[v][1]));
    var n = 17 + 4 * v, M = [], F = [], r, c;
    for (r = 0; r < n; r++) { M.push(new Array(n).fill(0)); F.push(new Array(n).fill(false)); }
    function set(r, c, val) { M[r][c] = val ? 1 : 0; F[r][c] = true; }
    function finder(r0, c0) {
      for (var y = -1; y <= 7; y++) for (var x = -1; x <= 7; x++) {
        var rr = r0 + y, cc = c0 + x; if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        set(rr, cc, (y >= 0 && y <= 6 && (x === 0 || x === 6)) || (x >= 0 && x <= 6 && (y === 0 || y === 6)) || (y >= 2 && y <= 4 && x >= 2 && x <= 4));
      }
    }
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);
    for (i = 8; i < n - 8; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    if (v >= 2) { var ap = n - 7; for (var y = -2; y <= 2; y++) for (var x = -2; x <= 2; x++) set(ap + y, ap + x, Math.max(Math.abs(x), Math.abs(y)) !== 1); }
    set(n - 8, 8, true);
    for (i = 0; i < 9; i++) { if (!F[8][i]) { M[8][i] = 0; F[8][i] = true; } if (!F[i][8]) { M[i][8] = 0; F[i][8] = true; } }
    for (i = 0; i < 8; i++) { if (!F[8][n - 1 - i]) { M[8][n - 1 - i] = 0; F[8][n - 1 - i] = true; } if (!F[n - 1 - i][8]) { M[n - 1 - i][8] = 0; F[n - 1 - i][8] = true; } }
    var all = []; cw.forEach(function (x) { for (var k = 7; k >= 0; k--) all.push((x >> k) & 1); });
    var pos = [], up = true, col, k2 = 0;
    for (col = n - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      for (i = 0; i < n; i++) { r = up ? n - 1 - i : i; for (var dc = 0; dc < 2; dc++) { c = col - dc; if (!F[r][c]) pos.push([r, c]); } }
      up = !up;
    }
    function fmtBits(mask) {
      var d = ((hi ? 2 : 1) << 3) | mask, rem = d, j;
      for (j = 0; j < 10; j++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      return ((d << 10) | rem) ^ 0x5412;
    }
    function maskFn(m, r, c) { return [(r + c) % 2 === 0, r % 2 === 0, c % 3 === 0, (r + c) % 3 === 0, (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0, (r * c) % 2 + (r * c) % 3 === 0, ((r * c) % 2 + (r * c) % 3) % 2 === 0, ((r + c) % 2 + (r * c) % 3) % 2 === 0][m]; }
    function penalty(G) {
      var p = 0, y, x, run, cnt;
      for (y = 0; y < n; y++) { run = 1; for (x = 1; x < n; x++) { if (G[y][x] === G[y][x - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (x = 0; x < n; x++) { run = 1; for (y = 1; y < n; y++) { if (G[y][x] === G[y - 1][x]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (y = 0; y < n - 1; y++) for (x = 0; x < n - 1; x++) if (G[y][x] === G[y][x + 1] && G[y][x] === G[y + 1][x] && G[y][x] === G[y + 1][x + 1]) p += 3;
      cnt = 0; for (y = 0; y < n; y++) for (x = 0; x < n; x++) cnt += G[y][x];
      p += Math.floor(Math.abs(cnt * 100 / (n * n) - 50) / 5) * 10;
      return p;
    }
    var best = null, bp = 1e9, m;
    for (m = 0; m < 8; m++) {
      var G = M.map(function (row) { return row.slice(); });
      pos.forEach(function (q, idx) { var bit = idx < all.length ? all[idx] : 0; G[q[0]][q[1]] = maskFn(m, q[0], q[1]) ? bit ^ 1 : bit; });
      var f = fmtBits(m), bit;
      for (i = 0; i < 15; i++) {
        bit = (f >>> i) & 1;
        if (i <= 5) G[i][8] = bit; else if (i === 6) G[7][8] = bit; else if (i === 7) G[8][8] = bit; else if (i === 8) G[8][7] = bit; else G[8][14 - i] = bit;
        if (i < 8) G[8][n - 1 - i] = bit; else G[n - 15 + i][8] = bit;
      }
      G[n - 8][8] = 1;
      var pe = penalty(G); if (pe < bp) { bp = pe; best = G; }
    }
    return best;
  }
  /* QR stylisé : points arrondis bleus, repères carrés orange, logo (haltère) au centre, nom en dessous */
  function svg(txt) {
    var G = build(txt, true); if (!G) return '';
    var n = G.length, q = 4, T = n + 2 * q, H = T + 3.4, cx = n / 2, half = n * 0.115, y, x, o = '', blue = '#1d3fb8', or = '#e8590c';
    function fin(r, c) { return (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8); }
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
      if (!G[y][x] || fin(y, x)) continue;
      if (Math.abs(x + 0.5 - cx) < half + 0.6 && Math.abs(y + 0.5 - cx) < half + 0.6) continue;
      o += '<rect x="' + (x + q - 0.02) + '" y="' + (y + q - 0.02) + '" width="1.04" height="1.04" rx="0.32"/>';
    }
    var f = '';
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(function (p) {
      var fx = p[1] + q, fy = p[0] + q;
      f += '<rect x="' + fx + '" y="' + fy + '" width="7" height="7" rx="0.5" fill="' + or + '"/><rect x="' + (fx + 1) + '" y="' + (fy + 1) + '" width="5" height="5" fill="#fff"/><rect x="' + (fx + 2) + '" y="' + (fy + 2) + '" width="3" height="3" rx="0.4" fill="' + blue + '"/>';
    });
    var a = cx + q, s = 2 * half;
    var logo = '<rect x="' + (a - half) + '" y="' + (a - half) + '" width="' + s + '" height="' + s + '" rx="1.3" fill="#0f1a21"/><g stroke-linecap="round" fill="none">' +
      '<path d="M' + (a - half * 0.5) + ' ' + a + ' L' + (a + half * 0.5) + ' ' + a + '" stroke-width="0.55" stroke="#5b8cff"/>' +
      '<path d="M' + (a - half * 0.6) + ' ' + (a - half * 0.4) + ' V' + (a + half * 0.4) + ' M' + (a + half * 0.6) + ' ' + (a - half * 0.4) + ' V' + (a + half * 0.4) + '" stroke-width="0.95" stroke="#ff9a4d"/>' +
      '<path d="M' + (a - half * 0.8) + ' ' + (a - half * 0.22) + ' V' + (a + half * 0.22) + ' M' + (a + half * 0.8) + ' ' + (a - half * 0.22) + ' V' + (a + half * 0.22) + '" stroke-width="0.7" stroke="#5b8cff"/></g>';
    return '<svg viewBox="0 0 ' + T + ' ' + H + '" shape-rendering="geometricPrecision" role="img" aria-label="QR code du lien de l\'application Coach-Mass-KVES"><rect width="' + T + '" height="' + H + '" rx="2.2" fill="#fff"/><g fill="' + blue + '">' + o + '</g>' + f + logo +
      '<text x="' + (T / 2) + '" y="' + (T + 1.7) + '" text-anchor="middle" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="1.9" fill="' + blue + '">Coach-Mass-KVES</text></svg>';
  }
  return { svg: svg, build: build };
})();
/* © KVES · Coach-Mass-KVES */
/* ====================== langues : traduction de l'affichage ======================
   Le texte de l'application est écrit en français. Pour une autre langue, un dictionnaire (LANG_DATA)
   remplace les textes affichés (phrases exactes + modèles avec {1}, {2}...). Un texte absent reste en français. */
var LANGS = { fr: 'Français', en: 'English' };
var LANG_DATA = {};
function lang() { return LANGS[P.lang] ? P.lang : 'fr'; }
function PT(fr, en) {
  var parts = fr.split(/\{\d+\}/), keys = (fr.match(/\{\d+\}/g) || []), src = '^';
  parts.forEach(function (p, i) { src += p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); if (i < keys.length) src += '(.+?)'; });
  return { re: new RegExp(src + '$'), en: en };
}
function trText(s) {
  var d = LANG_DATA[lang()];
  if (!d) return s;
  var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), core = m[2], i, r, o;
  if (!core) return s;
  if (Object.prototype.hasOwnProperty.call(d.w, core)) return m[1] + d.w[core] + m[3];
  for (i = 0; i < d.p.length; i++) {
    r = core.match(d.p[i].re);
    if (r) { o = d.p[i].en.replace(/\{(\d+)\}/g, function (_, n) { var v = r[+n]; return Object.prototype.hasOwnProperty.call(d.w, v) ? d.w[v] : v.indexOf(', ') > 0 ? v.split(', ').map(function (x) { return Object.prototype.hasOwnProperty.call(d.w, x) ? d.w[x] : x; }).join(', ') : v; }); return m[1] + o + m[3]; }
  }
  var sn = core.split(/(?<=[.!?]) /);
  if (sn.length > 1) {
    var out = [], j = 0, k, hit = false, seg, found;
    while (j < sn.length) {
      found = false;
      for (k = sn.length; k > j; k--) { seg = sn.slice(j, k).join(' '); if (Object.prototype.hasOwnProperty.call(d.w, seg)) { out.push(d.w[seg]); j = k; found = true; hit = true; break; } }
      if (!found) { out.push(sn[j]); j++; }
    }
    if (hit) return m[1] + out.join(' ') + m[3];
  }
  return s;
}
var trMem = typeof WeakMap === 'function' ? new WeakMap() : null;
function trNode(n) {
  var rec = trMem.get(n), cur = n.nodeValue;
  if (rec && rec.out === cur) return;
  var out = trText(cur);
  trMem.set(n, { out: out });
  if (out !== cur) n.nodeValue = out;
}
var TR_ATTR = ['placeholder', 'aria-label', 'title', 'alt'];
function trTree(root) {
  if (!root) return;
  if (root.nodeType === 3) { trNode(root); return; }
  if (root.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(root.nodeName)) return;
  var w = document.createTreeWalker(root, 4 | 1), n = root;
  while (n) {
    if (n.nodeType === 3) { if (!/^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) trNode(n); }
    else TR_ATTR.forEach(function (a) { var v = n.getAttribute && n.getAttribute(a); if (v) { var o = trText(v); if (o !== v) n.setAttribute(a, o); } });
    n = w.nextNode();
  }
}
function startI18n() {
  if (!trMem || lang() === 'fr' || !LANG_DATA[lang()]) return;
  document.documentElement.lang = lang() === 'ma' ? 'ary-Latn' : lang(); if (lang() === 'ar') document.documentElement.dir = 'rtl';
  var busy = false, mo = new MutationObserver(function (list) {
    if (busy) return; busy = true; mo.disconnect();
    try { list.forEach(function (m) { if (m.type === 'characterData') trNode(m.target); else m.addedNodes.forEach(trTree); }); } catch (e) {}
    mo.observe(document.body, { childList: true, subtree: true, characterData: true }); busy = false;
  });
  trTree(document.body);
  mo.observe(document.body, { childList: true, subtree: true, characterData: true });
}
/* © KVES · Coach-Mass-KVES */
/* ====================== anglais (13.0 : écrans principaux) ====================== */
(function () {
  var W = {
    "Navigation": "Navigation", "Aujourd'hui": "Today", "Séance": "Workout", "Repas": "Meals", "Suivi": "Progress", "Historique": "History", "Plus": "More",
    "Le coach · Bilan du matin": "Coach · Morning check-in", "Bilan du jour": "Daily check-in",
    "Pas de bilan, pas de progrès. Remplis-le avant ton premier repas.": "No check-in, no progress. Fill it in before your first meal.",
    "Poids (kg, à jeun)": "Weight (kg, fasting)", "Sommeil (heures)": "Sleep (hours)", "Pas (montre ou téléphone)": "Steps (watch or phone)",
    "Énergie (1 = à plat, 5 = au top)": "Energy (1 = flat, 5 = great)", "Eau": "Water", "Repas validés": "Meals eaten",
    "Complète ton profil": "Complete your profile", "Compléter mon profil": "Complete my profile",
    "Genre, objectif (prise de masse, perte de poids, tonification, maintien), âge et mensurations : l'application adapte les calories et les conseils.": "Gender, goal (muscle gain, weight loss, toning, maintenance), age and measurements: the app adapts calories and advice.",
    "Lancer la séance": "Start workout",
    "Pectoraux": "Chest", "Épaules": "Shoulders", "Dos": "Back", "Bras": "Arms", "Abdominaux": "Abs", "Jambes": "Legs", "Fessiers et mollets": "Glutes and calves",
    "Haut": "Top", "Face": "Front", "Figer": "Freeze", "Animer": "Animate", "À tenir": "Hold", "répétitions": "reps", "Minuteur": "Timer", "Zéro": "Reset", "Enregistrer la série": "Save set",
    "Dans ma séance complète": "In my full workout", "Décoche pour le retirer (3 exercices minimum). Il reste disponible en « Lancer seul ».": "Untick to remove it (3 exercises minimum). It stays available with “Start alone”.",
    "Réglages et lancement seul": "Settings and solo start", "Séries": "Sets", "Répétitions": "Reps", "Repos": "Rest", "Durée": "Duration",
    "Les séries et répétitions servent au lancement seul. Le repos s'applique aussi à la séance complète.": "Sets and reps are used for solo start. Rest also applies to the full workout.",
    "Lancer seul": "Start alone", "Réinitialiser": "Reset", "avancé": "advanced", "Réservé aux niveaux avancés.": "Reserved for advanced levels.",
    "⚠ Précautions.": "⚠ Precautions.", "Arrête-toi si :": "Stop if:",
    "Il se débloque quand tes pompes et tes squats ont bien progressé, ou dans Réglages (Débloquer les exercices avancés).": "It unlocks when your push-ups and squats have progressed, or in Settings (Unlock advanced exercises).",
    "Pompes": "Push-ups", "Pompes diamant": "Diamond push-ups", "Pompes mains sur une chaise": "Hands-on-chair push-ups", "Pompes pike": "Pike push-ups",
    "Élévations latérales, sac à dos léger": "Lateral raises, light backpack", "Tirage sous table, genoux fléchis": "Under-table row, knees bent", "Superman, pause 1 s": "Superman, 1 s pause",
    "Rowing au sol, genoux fléchis": "Floor row, knees bent", "Dips sur chaise, genoux fléchis": "Chair dips, knees bent", "Curl, sac à dos léger": "Curl, light backpack",
    "Gainage sur les avant-bras": "Forearm plank", "Crunchs, mains sur les cuisses": "Crunches, hands on thighs", "Relevés de jambes fléchies": "Bent-leg raises", "Mountain climbers lents": "Slow mountain climbers",
    "Squats": "Squats", "Fentes marchées": "Walking lunges", "Squat bulgare": "Bulgarian split squat", "Squat sauté": "Jump squat", "Pont fessier": "Glute bridge", "Montées sur pointes": "Calf raises",
    "Bras le long du corps": "Arms by your sides", "Bras tendus": "Arms extended", "Bras tendu": "Arm extended", "À plat": "Flat", "Allongé": "Lying", "Jambes basses": "Low legs", "Jambe tendue": "Leg extended",
    "Départ": "Start", "Debout": "Standing", "Bas du squat": "Bottom of squat", "Talons au sol": "Heels down",
    "pectoraux": "chest", "triceps": "triceps", "épaules": "shoulders", "biceps": "biceps", "dos": "back", "lombaires": "lower back", "fessiers": "glutes", "abdominaux": "abs", "cuisses": "thighs", "mollets": "calves", "arrière des cuisses": "hamstrings",
    "Repas du jour": "Today's meals", "Variantes": "Alternatives", "Pas de poulet": "No chicken", "4 sardines ou 200 g de lentilles": "4 sardines or 200 g of lentils",
    "Peu d'appétit": "Low appetite", "Bois le smoothie en plus": "Drink the smoothie as well", "Budget serré": "Tight budget", "Œufs, légumineuses, sardines": "Eggs, legumes, sardines",
    "Omelette de 3 œufs, 1 pain, 1 c. à soupe d'huile d'olive, 1 verre de lait au chocolat": "3-egg omelette, 1 bread, 1 tbsp olive oil, 1 glass of chocolate milk",
    "Omelette de 3 œufs, 2 bananes, 50 g de riz cuit, 1 c. à soupe d'huile d'olive": "3-egg omelette, 2 bananas, 50 g cooked rice, 1 tbsp olive oil",
    "Flocons d'avoine (60 g) cuits dans 250 ml de lait, 1 banane, 1 c. à soupe d'amlou": "Oats (60 g) cooked in 250 ml milk, 1 banana, 1 tbsp amlou",
    "1 pain, 100 g de pois chiches cuits écrasés avec 1 c. à soupe d'huile d'olive, 1 banane": "1 bread, 100 g mashed cooked chickpeas with 1 tbsp olive oil, 1 banana",
    "80 g de riz (cru) cuit, 100 g de pois chiches cuits, 2 bananes, 1 c. à soupe d'huile d'olive": "80 g (raw) cooked rice, 100 g cooked chickpeas, 2 bananas, 1 tbsp olive oil",
    "Smoothie : 300 ml de lait, 2 bananes, 40 g de flocons d'avoine, 1 c. à soupe d'amlou ou de beurre de cacahuète": "Smoothie: 300 ml milk, 2 bananas, 40 g oats, 1 tbsp amlou or peanut butter",
    "Smoothie : 300 ml de lait, 2 bananes, 40 g de flocons d'avoine, 1 c. à soupe de miel": "Smoothie: 300 ml milk, 2 bananas, 40 g oats, 1 tbsp honey",
    "Smoothie : 300 ml de lait, 2 bananes, 1 c. à soupe d'amlou ou de beurre de cacahuète": "Smoothie: 300 ml milk, 2 bananas, 1 tbsp amlou or peanut butter",
    "2 bananes écrasées avec 40 g de flocons d'avoine et 1 c. à soupe d'amlou, 200 ml d'eau": "2 mashed bananas with 40 g oats and 1 tbsp amlou, 200 ml water",
    "3 bananes et 2 dattes": "3 bananas and 2 dates",
    "150 g de poulet ou 4 sardines, 80 g de riz (cru), légumes, 1 c. à soupe d'huile d'olive": "150 g chicken or 4 sardines, 80 g (raw) rice, vegetables, 1 tbsp olive oil",
    "150 g de poulet, 80 g de riz (cru), légumes, 1 c. à soupe d'huile d'olive": "150 g chicken, 80 g (raw) rice, vegetables, 1 tbsp olive oil",
    "4 sardines, 80 g de riz (cru), légumes, 1 c. à soupe d'huile d'olive": "4 sardines, 80 g (raw) rice, vegetables, 1 tbsp olive oil",
    "200 g de lentilles cuites, 80 g de riz (cru), légumes, 1 c. à soupe d'huile d'olive": "200 g cooked lentils, 80 g (raw) rice, vegetables, 1 tbsp olive oil",
    "1 pain avec 1 c. à soupe d'amlou, 1 yaourt": "1 bread with 1 tbsp amlou, 1 yogurt", "1 pain avec 1 c. à soupe de miel, 1 yaourt": "1 bread with 1 tbsp honey, 1 yogurt",
    "1 yaourt, 2 bananes, 1 c. à soupe d'amlou": "1 yogurt, 2 bananas, 1 tbsp amlou", "1 yaourt, 2 bananes, 2 dattes": "1 yogurt, 2 bananas, 2 dates", "2 bananes, 3 dattes": "2 bananas, 3 dates",
    "150 g de lentilles ou de pois chiches cuits, 2 œufs, 1 pain": "150 g cooked lentils or chickpeas, 2 eggs, 1 bread",
    "150 g de lentilles cuites, 2 œufs, 1 pain": "150 g cooked lentils, 2 eggs, 1 bread", "150 g de pois chiches cuits, 2 œufs, 1 pain": "150 g cooked chickpeas, 2 eggs, 1 bread",
    "150 g de lentilles ou de pois chiches cuits, 2 œufs, 60 g de riz (cru)": "150 g cooked lentils or chickpeas, 2 eggs, 60 g (raw) rice",
    "150 g de lentilles cuites, 2 œufs, 60 g de riz (cru)": "150 g cooked lentils, 2 eggs, 60 g (raw) rice", "150 g de pois chiches cuits, 2 œufs, 60 g de riz (cru)": "150 g cooked chickpeas, 2 eggs, 60 g (raw) rice",
    "200 g de lentilles ou de pois chiches cuits, 1 pain, 1 yaourt": "200 g cooked lentils or chickpeas, 1 bread, 1 yogurt",
    "200 g de lentilles cuites, 1 pain, 1 yaourt": "200 g cooked lentils, 1 bread, 1 yogurt", "200 g de pois chiches cuits, 1 pain, 1 yaourt": "200 g cooked chickpeas, 1 bread, 1 yogurt",
    "200 g de lentilles ou de pois chiches cuits, 60 g de riz (cru), 1 c. à soupe d'huile d'olive": "200 g cooked lentils or chickpeas, 60 g (raw) rice, 1 tbsp olive oil",
    "200 g de lentilles cuites, 60 g de riz (cru), 1 c. à soupe d'huile d'olive": "200 g cooked lentils, 60 g (raw) rice, 1 tbsp olive oil", "200 g de pois chiches cuits, 60 g de riz (cru), 1 c. à soupe d'huile d'olive": "200 g cooked chickpeas, 60 g (raw) rice, 1 tbsp olive oil",
    "Avant de dormir": "Before bed", "Verre de lait + 1 pain à l'amlou (ajout de 300 kcal)": "Glass of milk + 1 bread with amlou (adds 300 kcal)", "2 bananes et 4 dattes (ajout de 300 kcal)": "2 bananas and 4 dates (adds 300 kcal)",
    "Régime et budget": "Diet and budget", "Les repas et les courses s'adaptent. Halal : le poulet et les sardines du plan conviennent, choisis-les halal chez ton boucher.": "Meals and shopping adapt. Halal: the chicken and sardines in the plan are fine, buy them halal from your butcher.",
    "Sans œufs": "No eggs", "Sans lait": "No milk", "Sans fruits à coque / cacahuètes": "No tree nuts / peanuts", "Sans gluten": "No gluten", "Végétarien (sans viande ni poisson)": "Vegetarian (no meat or fish)",
    "Budget": "Budget", "Normal": "Normal", "Serré (moins de viande)": "Tight (less meat)",
    "Liste de courses": "Shopping list", "Choisis tes variantes : la liste se calcule toute seule, d'après les repas ci-dessus.": "Pick your options: the list calculates itself from the meals above.",
    "Pour combien de jours": "For how many days", "3 jours": "3 days", "7 jours": "7 days", "14 jours": "14 days", "Repas de 14 h 30": "2:30 pm meal", "Repas de 21 h 30": "9:30 pm meal",
    "Poulet": "Chicken", "Sardines": "Sardines", "Alterné": "Alternate", "Lentilles": "Lentils", "Pois chiches": "Chickpeas",
    "Œufs": "Eggs", "Pain": "Bread", "Lait": "Milk", "Cacao en poudre (lait au chocolat)": "Cocoa powder (chocolate milk)", "Bananes": "Bananas", "Flocons d'avoine": "Oats",
    "Amlou ou beurre de cacahuète": "Amlou or peanut butter", "Miel": "Honey", "Dattes": "Dates", "Huile d'olive": "Olive oil", "Yaourts": "Yogurts", "Riz": "Rice", "Légumes de saison (environ)": "Seasonal vegetables (approx.)",
    "Lentilles sèches": "Dry lentils", "Pois chiches secs": "Dry chickpeas",
    "Quantités calculées d'après tes repas, ton objectif, ton régime et ton budget. Légumes estimés, lentilles et pois chiches comptés secs (60 g secs pour 150 g cuits). Les prix varient : aucun coût n'est affiché.": "Quantities are calculated from your meals, goal, diet and budget. Vegetables are estimated; lentils and chickpeas are counted dry (60 g dry for 150 g cooked). Prices vary: no cost is shown.",
    "Copier la liste": "Copy the list", "Tout décocher": "Untick all",
    "kg actuel": "kg now", "kg restants": "kg to go", "estimation": "estimate",
    "Bilan de la semaine": "Weekly review", "Les 7 derniers jours.": "The last 7 days.", "séances": "workouts", "repas cochés": "meals ticked", "sommeil moy.": "avg sleep", "énergie moy.": "avg energy", "kcal/jour (cochés)": "kcal/day (ticked)", "kg": "kg",
    "Conseil du coach :": "Coach's advice:", "Copier le bilan": "Copy the review",
    "Cette semaine : place-les à l'avance dans ton agenda, même en version légère.": "This week: schedule them ahead in your calendar, even in a light version.",
    "Ton sommeil moyen est court. Gagne une heure de coucher avant de chercher plus de charge : c'est là que le muscle se construit.": "Your average sleep is short. Go to bed an hour earlier before adding more load: that is where muscle is built.",
    "Tu as coché moins de 70 % de tes repas. Prépare tes repas du lendemain la veille.": "You ticked fewer than 70% of your meals. Prepare tomorrow's meals the day before.",
    "Ton poids baisse alors que tu veux prendre de la masse : ajoute un repas ou une collation.": "Your weight is dropping while you want to gain mass: add a meal or a snack.",
    "Ton poids monte alors que tu veux perdre : surveille le riz, le pain et l'huile.": "Your weight is rising while you want to lose: watch the rice, bread and oil.",
    "Semaine complète. Tiens le même rythme et vise une répétition de plus par série.": "Full week. Keep the same pace and aim for one more rep per set.",
    "Continue : coche tes repas, pèse-toi chaque dimanche et note ton sommeil.": "Keep going: tick your meals, weigh yourself every Sunday and log your sleep.",
    "4 sem.": "4 wks", "8 sem.": "8 wks", "6 mois": "6 months", "Tout": "All", "Période": "Period", "Évolution du poids": "Weight trend",
    "Pas assez de pesées sur cette période. Note ton poids dans le bilan du jour.": "Not enough weigh-ins in this period. Log your weight in the daily check-in.",
    "Performance par séance": "Performance per workout", "Total": "Total", "Total des répétitions (hors gainage)": "Total reps (excluding planks)",
    "Aucune séance terminée sur cette période. Fais une séance pour voir ta courbe.": "No workout finished in this period. Do a workout to see your curve.",
    "Semaine par semaine": "Week by week", "Semaine": "Week", "Séances": "Workouts", "Reps": "Reps", "Poids moy.": "Avg weight",
    "Mensurations": "Measurements", "Toutes les 2 semaines, matin à jeun, en cm.": "Every 2 weeks, fasting in the morning, in cm.", "Poitrine": "Chest", "Taille": "Waist", "Hanches": "Hips", "Cuisse": "Thigh", "Mollet": "Calf",
    "Enregistrer": "Save", "Sauvegarde": "Backup", "Tes données restent sur ce téléphone. Exporte-les de temps en temps.": "Your data stays on this phone. Export it from time to time.", "Exporter": "Export", "Importer": "Import",
    "Aucune séance enregistrée pour le moment. Chaque série que tu fais est conservée ici, avec la date, la variante et tes répétitions.": "No workout recorded yet. Every set you do is kept here, with the date, the variant and your reps.",
    "Boîte à avis": "Feedback box", "Une idée, un problème, un merci ? Ton avis est chiffré sur ton téléphone avant l'envoi : seul le propriétaire de l'application peut le lire.": "An idea, a problem, a thank-you? Your feedback is encrypted on your phone before sending: only the app owner can read it.",
    "Donner mon avis": "Give feedback", "Réglages": "Settings", "Jours de séance, voix, sons, objectif de poids, rotation de l'écran.": "Workout days, voice, sounds, weight goal, screen rotation.", "Ouvrir les réglages": "Open settings",
    "Sources et limites": "Sources and limits", "D'où viennent les repères du programme, et les précautions à connaître.": "Where the program's guidelines come from, and the precautions to know.", "Lire": "Read",
    "Partager l'application": "Share the app", "Envoie Coach-Mass-KVES à un ami pour qu'il l'essaie : le lien affiche le logo et les fonctionnalités clés.": "Send Coach-Mass-KVES to a friend to try it: the link shows the logo and key features.",
    "Partager": "Share", "Copier le lien": "Copy the link", "Afficher le QR code": "Show the QR code", "Ton ami scanne ce code avec l'appareil photo de son téléphone.": "Your friend scans this code with their phone camera.",
    "À propos": "About", "Espace propriétaire": "Owner area",
    "Ton profil": "Your profile", "Pour adapter les calories et les conseils. Tout reste sur ton téléphone. Application réservée aux personnes de 18 ans et plus.": "To adapt calories and advice. Everything stays on your phone. App for people aged 18 and over.",
    "Genre": "Gender", "Homme": "Male", "Femme": "Female", "Ne pas préciser": "Prefer not to say", "Objectif": "Goal", "Prise de masse": "Muscle gain", "Perte de poids": "Weight loss", "Tonification": "Toning", "Maintien": "Maintenance",
    "Âge": "Age", "Taille (cm)": "Height (cm)", "Poids actuel (kg)": "Current weight (kg)", "Poids visé (kg)": "Target weight (kg)", "Mensurations (facultatif, en cm)": "Measurements (optional, in cm)",
    "Repères généraux, pas un avis médical. En cas de maladie, de traitement, de grossesse ou de doute, parle à un médecin avant de changer ton alimentation ou ton sport.": "General guidelines, not medical advice. If you have an illness, treatment, pregnancy or any doubt, talk to a doctor before changing your diet or sport.",
    "Valider": "Confirm", "J'ai déjà une sauvegarde : l'importer": "I already have a backup: import it", "Plus tard": "Later",
    "← Plus": "← More", "Jours de séance": "Workout days", "Lun": "Mon", "Mar": "Tue", "Mer": "Wed", "Jeu": "Thu", "Ven": "Fri", "Sam": "Sat", "Dim": "Sun",
    "Coach": "Coach", "Voix du coach": "Coach voice", "Parle en français dans tes écouteurs": "Speaks in French in your earphones", "Vibrations": "Vibrations", "Intensité des vibrations": "Vibration strength",
    "Normale": "Normal", "Forte": "Strong", "Très forte": "Very strong", "Compter les répétitions à voix haute": "Count reps out loud", "Le coach donne le rythme": "The coach sets the pace",
    "Enchaînement automatique": "Automatic sequencing", "Mains libres : le coach relance après le repos": "Hands-free: the coach restarts after rest", "Secondes par répétition": "Seconds per rep", "Repos en plus (secondes)": "Extra rest (seconds)",
    "Tester la voix": "Test the voice", "Tester la vibration": "Test the vibration", "Signaux sonores": "Sound signals", "Sons activés": "Sounds on", "Bips de fin de série, d'exercice et de repos": "Beeps at the end of a set, an exercise and rest",
    "Métronome de cadence": "Cadence metronome", "Bip grave à la descente, bip aigu à la montée": "Low beep going down, high beep going up", "Alerte 10 secondes avant la fin du repos": "Alert 10 seconds before rest ends",
    "Teste chaque signal :": "Test each signal:", "Fin de série": "End of set", "Fin d'exercice": "End of exercise", "Fin du repos": "End of rest", "Alerte 10 s": "10 s alert", "Compte à rebours": "Countdown", "Cadence": "Cadence", "Fin de séance": "End of workout",
    "Profil et objectif": "Profile and goal", "Modifier mon profil": "Edit my profile", "Poids de départ (kg)": "Starting weight (kg)", "Objectif (kg)": "Goal (kg)", "Date de départ": "Start date",
    "J'ai une barre de traction": "I have a pull-up bar", "Ajoute les tractions au tirage": "Adds pull-ups to the row", "Débloquer les exercices avancés": "Unlock advanced exercises",
    "Pompes diamant, dips, squat sauté : à n'activer que si tu es à l'aise": "Diamond push-ups, dips, jump squats: only turn on if you are comfortable", "Suivre mes cigarettes": "Track my cigarettes", "Un compteur dans le bilan du jour": "A counter in the daily check-in",
    "Rappels": "Reminders", "Rappels quotidiens": "Daily reminders", "Poids le matin, validation des repas le soir. Rien n'est envoyé si c'est déjà fait.": "Weight in the morning, meal check in the evening. Nothing is sent if already done.",
    "Poids à": "Weight at", "Repas à": "Meals at", "Tester": "Test", "Ajouter au calendrier": "Add to calendar",
    "Notifications bloquées : autorise-les dans les réglages Android de Chrome. Application fermée, Android peut retarder ou ignorer le rappel. Pour être sûr de l'heure, ajoute-les aussi à ton calendrier.": "Notifications blocked: allow them in Chrome's Android settings. With the app closed, Android may delay or ignore the reminder. To be sure of the time, also add them to your calendar.",
    "Crée deux événements quotidiens avec alerte (poids et repas). Si tu changes les heures, supprime les anciens événements puis ajoute-les de nouveau.": "Creates two daily events with an alert (weight and meals). If you change the times, delete the old events then add them again.",
    "Affichage": "Display", "Auto": "Auto", "Clair": "Light", "Sombre": "Dark", "Thème": "Theme",
    "Auto suit le mode clair ou sombre d'Android. Le fond, la barre d'état et les graphiques suivent ton choix.": "Auto follows Android's light or dark mode. The background, status bar and charts follow your choice.",
    "Forcer la rotation de l'écran": "Force screen rotation", "À activer si l'application reste bloquée en portrait. Elle suit alors le capteur du téléphone.": "Turn on if the app stays stuck in portrait. It then follows the phone's sensor.",
    "Sauvegarder maintenant": "Back up now", "Me le rappeler": "Remind me", "Tous les 3 j": "Every 3 days", "Jamais": "Never", "jamais": "never",
    "Copies automatiques sur ce téléphone": "Automatic copies on this phone", "Aucune pour le moment. Une copie est faite chaque jour d'utilisation.": "None yet. A copy is made every day you use the app.",
    "non accordé": "not granted", "Données": "Data", "Effacer toutes les données": "Erase all data", "Langue": "Language",
    "Aucun avis trouvé dans ce texte.": "No feedback found in this text.", "Copié.": "Copied.", "Profil enregistré.": "Profile saved.", "Réglages remis par défaut.": "Settings reset to default.",
    "Exercice réservé aux niveaux avancés.": "Exercise reserved for advanced levels.", "La séance garde au moins 3 exercices.": "The workout keeps at least 3 exercises.", "Sauvegarde créée.": "Backup created.", "Sauvegarde importée.": "Backup imported.",
    "Fichier invalide : rien n'a été modifié.": "Invalid file: nothing was changed.", "Copie restaurée.": "Copy restored.", "Règle d'abord les deux heures.": "Set both times first.",
    "Copie impossible : sélectionne le texte à la main.": "Copy failed: select the text by hand.", "Export impossible sur cet appareil.": "Export is not possible on this device.",
    "Téléchargement impossible sur cet appareil. Utilise Copier.": "Download not possible on this device. Use Copy.", "Mise à jour prête : elle s'appliquera à la prochaine ouverture.": "Update ready: it will apply the next time you open the app.",
    "Notifications non autorisées sur cet appareil.": "Notifications are not allowed on this device.", "Fichier créé : ouvre-le pour l'ajouter à ton calendrier.": "File created: open it to add it to your calendar.",
    "La boîte à avis n'est pas encore activée.": "The feedback box is not activated yet.", "Colle d'abord un avis.": "Paste feedback first.", "Avis chiffré. Choisis comment l'envoyer.": "Feedback encrypted. Choose how to send it.",
    "Mise à jour installée": "Update installed", "Compris": "Got it", "Nouvelle version prête": "New version ready", "Recharger maintenant": "Reload now",
    "Une mise à jour de Coach-Mass-KVES vient d'être téléchargée. Recharge pour l'utiliser.": "An update of Coach-Mass-KVES has just been downloaded. Reload to use it.",
    "⚠ Avant de lancer": "⚠ Before you start", "Je comprends, lancer": "I understand, start", "Annuler": "Cancel",
    "Cible saine : 0,25 à 0,5 kg par semaine.": "Healthy target: 0.25 to 0.5 kg per week.", "Perte saine : 0,25 à 0,5 kg par semaine, jamais plus.": "Healthy loss: 0.25 to 0.5 kg per week, never more.",
    "Vise un poids stable (moins de 0,3 kg par semaine).": "Aim for a stable weight (less than 0.3 kg per week).", "demain": "tomorrow", "aujourd'hui": "today",
    "Décomposer le mouvement": "Break the movement down", "Moins une répétition": "One rep less", "Plus une répétition": "One rep more", "Pompes inclinées (mains sur une chaise)": "Incline push-ups (hands on a chair)",
    "Élévations latérales (sac à dos)": "Lateral raises (backpack)", "Tirage sous table": "Under-table row", "Rowing au sol avec serviette": "Floor row with towel", "Dips sur chaise": "Chair dips", "Curl biceps avec sac à dos": "Biceps curl with backpack",
    "Gainage avant-bras": "Forearm plank", "Crunchs": "Crunches", "Relevés de jambes": "Leg raises", "Stockage protégé contre le nettoyage automatique :": "Storage protected from automatic cleanup:",
    "Régime": "Diet", "Lancer": "Start"
  };
  var P_ = [
    PT("Semaine {1} · {2} kg → {3}", "Week {1} · {2} kg → {3}"),
    PT("Semaine {1} · {2} séries sur les exercices principaux · {3} exercices dans la séance complète. Jours prévus : {4}.", "Week {1} · {2} sets on the main exercises · {3} exercises in the full workout. Planned days: {4}."),
    PT("Prochaine séance : {1}. Tu peux en lancer une quand même dans l'onglet Séance.", "Next workout: {1}. You can still start one from the Workout tab."),
    PT("{1} séries", "{1} sets"), 
    PT("{1} verres", "{1} glasses"), PT("{1} pièces", "{1} pieces"), PT("{1} séance(s)", "{1} workout(s)"),
    PT("Muscles qui travaillent : {1}", "Muscles worked: {1}"),
    PT("{1} · cible : environ {2} kcal et {3} g de protéines. Coche chaque repas quand tu l'as fini.", "{1} · target: about {2} kcal and {3} g of protein. Tick each meal when you finish it."),
    PT("Portions ajustées à ton objectif (environ {1} % du plan de base) : réduis surtout le riz, le pain, l'huile et le beurre de cacahuète ou d'amlou, garde les œufs, le poulet et les légumes. Plancher : {2} kcal.", "Portions adjusted to your goal (about {1}% of the base plan): mainly reduce rice, bread, oil and peanut or amlou butter; keep eggs, chicken and vegetables. Floor: {2} kcal."),
    PT("Il manque {1} séance(s). Cette semaine : place-les à l'avance dans ton agenda, même en version légère.", "{1} workout(s) missing. This week: schedule them ahead in your calendar, even in a light version."),
    PT("Rythme mesuré : pas assez de pesées (3 sur 10 jours minimum). {1}", "Measured pace: not enough weigh-ins (3 over 10 days minimum). {1}"),
    PT("Rythme mesuré : {1} kg par semaine. {2}", "Measured pace: {1} kg per week. {2}"),
    PT("objectif {1} s", "target {1} s"),
    PT("Moins : {1}", "Less: {1}"), PT("Plus : {1}", "More: {1}"),
    PT("{1} · {2} · {3} ans · {4} cm", "{1} · {2} · {3} years · {4} cm"),
    PT("Volume : {1} sur 10", "Volume: {1} out of 10"),
    PT("Version {1}", "Version {1}"),
    PT("S{1} · en cours", "W{1} · in progress"),
    PT("Coach-Mass-KVES · version {1} · © KVES. Tes données restent sur ton téléphone.", "Coach-Mass-KVES · version {1} · © KVES. Your data stays on your phone."),
    PT("Dernière sauvegarde en fichier :", "Last backup to file:"),
    PT("Mannequin de face et de profil, muscles sollicités : {1}", "Front and side mannequin, muscles worked: {1}")
  ];
  LANG_DATA.en = { w: W, p: P_ };
})();
/* © KVES · Coach-Mass-KVES */
/* ====================== arabe (13.1 : écrans principaux) · traductions à faire relire avant le public ======================
   Clé = texte anglais (voir 25-lang-en.js) ; la clé française est retrouvée par l'anglais. */
(function () {
  var A = {
    "Navigation": "التنقل", "Today": "اليوم", "Workout": "التمرين", "Meals": "الوجبات", "Progress": "التقدم", "History": "السجل", "More": "المزيد",
    "Coach · Morning check-in": "المدرب · حصيلة الصباح", "Daily check-in": "حصيلة اليوم",
    "No check-in, no progress. Fill it in before your first meal.": "بلا حصيلة لا يوجد تقدم. املأها قبل وجبتك الأولى.",
    "Weight (kg, fasting)": "الوزن (كغ، على الريق)", "Sleep (hours)": "النوم (ساعات)", "Steps (watch or phone)": "الخطوات (ساعة أو هاتف)",
    "Energy (1 = flat, 5 = great)": "الطاقة (1 = منهك، 5 = ممتاز)", "Water": "الماء", "Meals eaten": "الوجبات المنجزة",
    "Complete your profile": "أكمل ملفك الشخصي", "Complete my profile": "إكمال ملفي",
    "Gender, goal (muscle gain, weight loss, toning, maintenance), age and measurements: the app adapts calories and advice.": "الجنس والهدف (زيادة الكتلة، إنقاص الوزن، شد الجسم، الحفاظ)، والعمر والقياسات: يكيّف التطبيق السعرات والنصائح.",
    "Start workout": "ابدأ التمرين",
    "Chest": "الصدر", "Shoulders": "الأكتاف", "Back": "الظهر", "Arms": "الذراعان", "Abs": "البطن", "Legs": "الساقان", "Glutes and calves": "الأرداف والسمانتان",
    "Top": "أعلى", "Front": "أمام", "Freeze": "إيقاف", "Animate": "تحريك", "Hold": "ثبّت", "reps": "تكرارات", "Timer": "المؤقت", "Reset": "إعادة", "Save set": "حفظ المجموعة",
    "In my full workout": "ضمن تمريني الكامل", "Untick to remove it (3 exercises minimum). It stays available with “Start alone”.": "ألغِ التحديد لحذفه (3 تمارين على الأقل). يبقى متاحًا عبر «ابدأ منفردًا».",
    "Settings and solo start": "الإعدادات والبدء المنفرد", "Sets": "المجموعات", "Reps": "التكرارات", "Rest": "الراحة", "Duration": "المدة",
    "Sets and reps are used for solo start. Rest also applies to the full workout.": "المجموعات والتكرارات للبدء المنفرد. أما الراحة فتنطبق أيضًا على التمرين الكامل.",
    "Start alone": "ابدأ منفردًا", "advanced": "متقدم", "Reserved for advanced levels.": "مخصص للمستويات المتقدمة.",
    "⚠ Precautions.": "⚠ احتياطات.", "Stop if:": "توقف إذا:",
    "It unlocks when your push-ups and squats have progressed, or in Settings (Unlock advanced exercises).": "يُفتح عندما يتحسن أداؤك في الضغط والقرفصاء، أو من الإعدادات (فتح التمارين المتقدمة).",
    "Push-ups": "تمرين الضغط", "Diamond push-ups": "ضغط الألماس", "Hands-on-chair push-ups": "ضغط اليدين على كرسي", "Pike push-ups": "ضغط البايك",
    "Lateral raises, light backpack": "رفع جانبي بحقيبة ظهر خفيفة", "Under-table row, knees bent": "سحب تحت الطاولة، الركبتان مثنيتان", "Superman, 1 s pause": "سوبرمان، توقف ثانية",
    "Floor row, knees bent": "سحب على الأرض، الركبتان مثنيتان", "Chair dips, knees bent": "غطس على كرسي، الركبتان مثنيتان", "Curl, light backpack": "تمرين البايسبس بحقيبة خفيفة",
    "Forearm plank": "بلانك على الساعدين", "Crunches, hands on thighs": "كرنش، اليدان على الفخذين", "Bent-leg raises": "رفع الساقين المثنيتين", "Slow mountain climbers": "متسلق الجبل البطيء",
    "Squats": "القرفصاء", "Walking lunges": "الطعنات المتحركة", "Bulgarian split squat": "القرفصاء البلغاري", "Jump squat": "القرفصاء القفز", "Glute bridge": "جسر الأرداف", "Calf raises": "رفع السمانة",
    "Arms by your sides": "الذراعان بجانب الجسم", "Arms extended": "الذراعان ممدودتان", "Arm extended": "الذراع ممدودة", "Flat": "مسطح", "Lying": "مستلقٍ", "Low legs": "الساقان منخفضتان", "Leg extended": "الساق ممدودة",
    "Start": "البداية", "Standing": "واقف", "Bottom of squat": "أسفل القرفصاء", "Heels down": "الكعبان على الأرض",
    "chest": "الصدر", "triceps": "الترايسبس", "shoulders": "الأكتاف", "biceps": "البايسبس", "back": "الظهر", "lower back": "أسفل الظهر", "glutes": "الأرداف", "abs": "البطن", "thighs": "الفخذان", "calves": "السمانتان", "hamstrings": "خلف الفخذين",
    "Today's meals": "وجبات اليوم", "Alternatives": "بدائل", "No chicken": "بدون دجاج", "4 sardines or 200 g of lentils": "4 سردين أو 200 غ عدس",
    "Low appetite": "قلة الشهية", "Drink the smoothie as well": "اشرب العصير المخفوق أيضًا", "Tight budget": "ميزانية ضيقة", "Eggs, legumes, sardines": "بيض، بقوليات، سردين",
    "3-egg omelette, 1 bread, 1 tbsp olive oil, 1 glass of chocolate milk": "أومليت 3 بيضات، خبزة، ملعقة كبيرة زيت زيتون، كأس حليب بالشوكولاتة",
    "3-egg omelette, 2 bananas, 50 g cooked rice, 1 tbsp olive oil": "أومليت 3 بيضات، موزتان، 50 غ أرز مطبوخ، ملعقة كبيرة زيت زيتون",
    "Oats (60 g) cooked in 250 ml milk, 1 banana, 1 tbsp amlou": "شوفان (60 غ) مطبوخ في 250 مل حليب، موزة، ملعقة كبيرة أملو",
    "1 bread, 100 g mashed cooked chickpeas with 1 tbsp olive oil, 1 banana": "خبزة، 100 غ حمص مطبوخ مهروس مع ملعقة كبيرة زيت زيتون، موزة",
    "80 g (raw) cooked rice, 100 g cooked chickpeas, 2 bananas, 1 tbsp olive oil": "80 غ أرز (نيء) مطبوخ، 100 غ حمص مطبوخ، موزتان، ملعقة كبيرة زيت زيتون",
    "Smoothie: 300 ml milk, 2 bananas, 40 g oats, 1 tbsp amlou or peanut butter": "عصير مخفوق: 300 مل حليب، موزتان، 40 غ شوفان، ملعقة كبيرة أملو أو زبدة الفول السوداني",
    "Smoothie: 300 ml milk, 2 bananas, 40 g oats, 1 tbsp honey": "عصير مخفوق: 300 مل حليب، موزتان، 40 غ شوفان، ملعقة كبيرة عسل",
    "Smoothie: 300 ml milk, 2 bananas, 1 tbsp amlou or peanut butter": "عصير مخفوق: 300 مل حليب، موزتان، ملعقة كبيرة أملو أو زبدة الفول السوداني",
    "2 mashed bananas with 40 g oats and 1 tbsp amlou, 200 ml water": "موزتان مهروستان مع 40 غ شوفان وملعقة كبيرة أملو، 200 مل ماء",
    "3 bananas and 2 dates": "3 موزات وتمرتان",
    "150 g chicken or 4 sardines, 80 g (raw) rice, vegetables, 1 tbsp olive oil": "150 غ دجاج أو 4 سردين، 80 غ أرز (نيء)، خضر، ملعقة كبيرة زيت زيتون",
    "150 g chicken, 80 g (raw) rice, vegetables, 1 tbsp olive oil": "150 غ دجاج، 80 غ أرز (نيء)، خضر، ملعقة كبيرة زيت زيتون",
    "4 sardines, 80 g (raw) rice, vegetables, 1 tbsp olive oil": "4 سردين، 80 غ أرز (نيء)، خضر، ملعقة كبيرة زيت زيتون",
    "200 g cooked lentils, 80 g (raw) rice, vegetables, 1 tbsp olive oil": "200 غ عدس مطبوخ، 80 غ أرز (نيء)، خضر، ملعقة كبيرة زيت زيتون",
    "1 bread with 1 tbsp amlou, 1 yogurt": "خبزة مع ملعقة كبيرة أملو، زبادي", "1 bread with 1 tbsp honey, 1 yogurt": "خبزة مع ملعقة كبيرة عسل، زبادي",
    "1 yogurt, 2 bananas, 1 tbsp amlou": "زبادي، موزتان، ملعقة كبيرة أملو", "1 yogurt, 2 bananas, 2 dates": "زبادي، موزتان، تمرتان", "2 bananas, 3 dates": "موزتان، 3 تمرات",
    "150 g cooked lentils or chickpeas, 2 eggs, 1 bread": "150 غ عدس أو حمص مطبوخ، بيضتان، خبزة",
    "150 g cooked lentils, 2 eggs, 1 bread": "150 غ عدس مطبوخ، بيضتان، خبزة", "150 g cooked chickpeas, 2 eggs, 1 bread": "150 غ حمص مطبوخ، بيضتان، خبزة",
    "150 g cooked lentils or chickpeas, 2 eggs, 60 g (raw) rice": "150 غ عدس أو حمص مطبوخ، بيضتان، 60 غ أرز (نيء)",
    "150 g cooked lentils, 2 eggs, 60 g (raw) rice": "150 غ عدس مطبوخ، بيضتان، 60 غ أرز (نيء)", "150 g cooked chickpeas, 2 eggs, 60 g (raw) rice": "150 غ حمص مطبوخ، بيضتان، 60 غ أرز (نيء)",
    "200 g cooked lentils or chickpeas, 1 bread, 1 yogurt": "200 غ عدس أو حمص مطبوخ، خبزة، زبادي",
    "200 g cooked lentils, 1 bread, 1 yogurt": "200 غ عدس مطبوخ، خبزة، زبادي", "200 g cooked chickpeas, 1 bread, 1 yogurt": "200 غ حمص مطبوخ، خبزة، زبادي",
    "200 g cooked lentils or chickpeas, 60 g (raw) rice, 1 tbsp olive oil": "200 غ عدس أو حمص مطبوخ، 60 غ أرز (نيء)، ملعقة كبيرة زيت زيتون",
    "200 g cooked lentils, 60 g (raw) rice, 1 tbsp olive oil": "200 غ عدس مطبوخ، 60 غ أرز (نيء)، ملعقة كبيرة زيت زيتون", "200 g cooked chickpeas, 60 g (raw) rice, 1 tbsp olive oil": "200 غ حمص مطبوخ، 60 غ أرز (نيء)، ملعقة كبيرة زيت زيتون",
    "Before bed": "قبل النوم", "Glass of milk + 1 bread with amlou (adds 300 kcal)": "كأس حليب + خبزة بالأملو (إضافة 300 سعرة)", "2 bananas and 4 dates (adds 300 kcal)": "موزتان و4 تمرات (إضافة 300 سعرة)",
    "Diet and budget": "النظام الغذائي والميزانية", "Meals and shopping adapt. Halal: the chicken and sardines in the plan are fine, buy them halal from your butcher.": "تتكيف الوجبات والمشتريات. حلال: الدجاج والسردين في الخطة مناسبان، اشترِهما حلالًا من الجزار.",
    "No eggs": "بدون بيض", "No milk": "بدون حليب", "No tree nuts / peanuts": "بدون مكسرات / فول سوداني", "No gluten": "بدون غلوتين", "Vegetarian (no meat or fish)": "نباتي (بدون لحم أو سمك)",
    "Budget": "الميزانية", "Normal": "عادية", "Tight (less meat)": "ضيقة (لحم أقل)",
    "Shopping list": "قائمة المشتريات", "Pick your options: the list calculates itself from the meals above.": "اختر خياراتك: تُحسب القائمة تلقائيًا من الوجبات أعلاه.",
    "For how many days": "لكم يومًا", "3 days": "3 أيام", "7 days": "7 أيام", "14 days": "14 يومًا", "2:30 pm meal": "وجبة 14:30", "9:30 pm meal": "وجبة 21:30",
    "Chicken": "دجاج", "Sardines": "سردين", "Alternate": "بالتناوب", "Lentils": "عدس", "Chickpeas": "حمص",
    "Eggs": "بيض", "Bread": "خبز", "Milk": "حليب", "Cocoa powder (chocolate milk)": "مسحوق الكاكاو (حليب بالشوكولاتة)", "Bananas": "موز", "Oats": "شوفان",
    "Amlou or peanut butter": "أملو أو زبدة الفول السوداني", "Honey": "عسل", "Dates": "تمر", "Olive oil": "زيت الزيتون", "Yogurts": "زبادي", "Rice": "أرز", "Seasonal vegetables (approx.)": "خضر الموسم (تقريبًا)",
    "Dry lentils": "عدس جاف", "Dry chickpeas": "حمص جاف",
    "Quantities are calculated from your meals, goal, diet and budget. Vegetables are estimated; lentils and chickpeas are counted dry (60 g dry for 150 g cooked). Prices vary: no cost is shown.": "تُحسب الكميات من وجباتك وهدفك ونظامك وميزانيتك. الخضر تقديرية؛ العدس والحمص محسوبان جافين (60 غ جاف لكل 150 غ مطبوخ). الأسعار تتغير: لا يُعرض أي سعر.",
    "Copy the list": "نسخ القائمة", "Untick all": "إلغاء تحديد الكل",
    "kg now": "كغ حاليًا", "kg to go": "كغ متبقية", "estimate": "تقدير",
    "Weekly review": "حصيلة الأسبوع", "The last 7 days.": "آخر 7 أيام.", "workouts": "تمارين", "meals ticked": "وجبات منجزة", "avg sleep": "متوسط النوم", "avg energy": "متوسط الطاقة", "kcal/day (ticked)": "سعرة/يوم (المنجزة)", "kg": "كغ",
    "Coach's advice:": "نصيحة المدرب:", "Copy the review": "نسخ الحصيلة",
    "This week: schedule them ahead in your calendar, even in a light version.": "هذا الأسبوع: حدّد مواعيدها مسبقًا في جدولك، ولو بنسخة خفيفة.",
    "Your average sleep is short. Go to bed an hour earlier before adding more load: that is where muscle is built.": "متوسط نومك قصير. نم قبل ساعة قبل أن تزيد الحمل: ففي النوم تُبنى العضلات.",
    "You ticked fewer than 70% of your meals. Prepare tomorrow's meals the day before.": "أنجزت أقل من 70% من وجباتك. حضّر وجبات الغد في اليوم السابق.",
    "Your weight is dropping while you want to gain mass: add a meal or a snack.": "وزنك ينقص وأنت تريد زيادة الكتلة: أضف وجبة أو وجبة خفيفة.",
    "Your weight is rising while you want to lose: watch the rice, bread and oil.": "وزنك يرتفع وأنت تريد إنقاصه: انتبه للأرز والخبز والزيت.",
    "Full week. Keep the same pace and aim for one more rep per set.": "أسبوع كامل. حافظ على الوتيرة نفسها واستهدف تكرارًا إضافيًا في كل مجموعة.",
    "Keep going: tick your meals, weigh yourself every Sunday and log your sleep.": "واصل: حدّد وجباتك، وزن نفسك كل أحد، وسجّل نومك.",
    "4 wks": "4 أسابيع", "8 wks": "8 أسابيع", "6 months": "6 أشهر", "All": "الكل", "Period": "الفترة", "Weight trend": "تطور الوزن",
    "Not enough weigh-ins in this period. Log your weight in the daily check-in.": "لا توجد قياسات وزن كافية في هذه الفترة. سجّل وزنك في حصيلة اليوم.",
    "Performance per workout": "الأداء في كل تمرين", "Total": "المجموع", "Total reps (excluding planks)": "مجموع التكرارات (دون البلانك)",
    "No workout finished in this period. Do a workout to see your curve.": "لا يوجد تمرين منجز في هذه الفترة. قم بتمرين لترى منحناك.",
    "Week by week": "أسبوعًا بأسبوع", "Week": "الأسبوع", "Workouts": "التمارين", "Avg weight": "متوسط الوزن",
    "Measurements": "القياسات", "Every 2 weeks, fasting in the morning, in cm.": "كل أسبوعين، صباحًا على الريق، بالسنتيمتر.", "Waist": "الخصر", "Hips": "الوركان", "Thigh": "الفخذ", "Calf": "السمانة",
    "Save": "حفظ", "Backup": "نسخة احتياطية", "Your data stays on this phone. Export it from time to time.": "بياناتك تبقى على هذا الهاتف. صدّرها من حين لآخر.", "Export": "تصدير", "Import": "استيراد",
    "No workout recorded yet. Every set you do is kept here, with the date, the variant and your reps.": "لا يوجد تمرين مسجل بعد. تُحفظ هنا كل مجموعة تنجزها مع التاريخ والنوع والتكرارات.",
    "Feedback box": "صندوق الآراء", "An idea, a problem, a thank-you? Your feedback is encrypted on your phone before sending: only the app owner can read it.": "فكرة أو مشكلة أو شكر؟ يُشفَّر رأيك على هاتفك قبل الإرسال: لا يستطيع قراءته سوى صاحب التطبيق.",
    "Give feedback": "إبداء رأيي", "Settings": "الإعدادات", "Workout days, voice, sounds, weight goal, screen rotation.": "أيام التمرين، الصوت، النغمات، هدف الوزن، تدوير الشاشة.", "Open settings": "فتح الإعدادات",
    "Sources and limits": "المصادر والحدود", "Where the program's guidelines come from, and the precautions to know.": "من أين تأتي مراجع البرنامج، والاحتياطات الواجب معرفتها.", "Read": "قراءة",
    "Share the app": "مشاركة التطبيق", "Send Coach-Mass-KVES to a friend to try it: the link shows the logo and key features.": "أرسل Coach-Mass-KVES إلى صديق ليجربه: يعرض الرابط الشعار والمزايا الأساسية.",
    "Share": "مشاركة", "Copy the link": "نسخ الرابط", "Show the QR code": "عرض رمز QR", "Your friend scans this code with their phone camera.": "يمسح صديقك هذا الرمز بكاميرا هاتفه.",
    "About": "حول", "Owner area": "فضاء المالك",
    "Your profile": "ملفك الشخصي", "To adapt calories and advice. Everything stays on your phone. App for people aged 18 and over.": "لتكييف السعرات والنصائح. كل شيء يبقى على هاتفك. التطبيق لمن بلغ 18 سنة فأكثر.",
    "Gender": "الجنس", "Male": "ذكر", "Female": "أنثى", "Prefer not to say": "أفضل عدم التحديد", "Goal": "الهدف", "Muscle gain": "زيادة الكتلة", "Weight loss": "إنقاص الوزن", "Toning": "شد الجسم", "Maintenance": "الحفاظ",
    "Age": "العمر", "Height (cm)": "الطول (سم)", "Current weight (kg)": "الوزن الحالي (كغ)", "Target weight (kg)": "الوزن المستهدف (كغ)", "Measurements (optional, in cm)": "القياسات (اختياري، بالسنتيمتر)",
    "General guidelines, not medical advice. If you have an illness, treatment, pregnancy or any doubt, talk to a doctor before changing your diet or sport.": "إرشادات عامة وليست رأيًا طبيًا. في حال المرض أو العلاج أو الحمل أو أي شك، استشر طبيبًا قبل تغيير نظامك الغذائي أو رياضتك.",
    "Confirm": "تأكيد", "I already have a backup: import it": "لدي نسخة احتياطية: استيرادها", "Later": "لاحقًا",
    "← More": "← المزيد", "Workout days": "أيام التمرين", "Mon": "الإثنين", "Tue": "الثلاثاء", "Wed": "الأربعاء", "Thu": "الخميس", "Fri": "الجمعة", "Sat": "السبت", "Sun": "الأحد",
    "Coach": "المدرب", "Coach voice": "صوت المدرب", "Speaks in French in your earphones": "يتحدث بالفرنسية في سماعاتك", "Vibrations": "الاهتزازات", "Vibration strength": "قوة الاهتزاز",
    "Strong": "قوية", "Very strong": "قوية جدًا", "Count reps out loud": "عدّ التكرارات بصوت عالٍ", "The coach sets the pace": "المدرب يحدد الإيقاع",
    "Automatic sequencing": "التتابع التلقائي", "Hands-free: the coach restarts after rest": "دون لمس: يستأنف المدرب بعد الراحة", "Seconds per rep": "ثوانٍ لكل تكرار", "Extra rest (seconds)": "راحة إضافية (ثوانٍ)",
    "Test the voice": "اختبار الصوت", "Test the vibration": "اختبار الاهتزاز", "Sound signals": "الإشارات الصوتية", "Sounds on": "تشغيل الأصوات", "Beeps at the end of a set, an exercise and rest": "صافرات عند نهاية المجموعة والتمرين والراحة",
    "Cadence metronome": "مترونوم الإيقاع", "Low beep going down, high beep going up": "صافرة غليظة عند النزول وحادة عند الصعود", "Alert 10 seconds before rest ends": "تنبيه قبل 10 ثوانٍ من نهاية الراحة",
    "Test each signal:": "اختبر كل إشارة:", "End of set": "نهاية المجموعة", "End of exercise": "نهاية التمرين", "End of rest": "نهاية الراحة", "10 s alert": "تنبيه 10 ث", "Countdown": "العد التنازلي", "Cadence": "الإيقاع", "End of workout": "نهاية التمرين الكامل",
    "Profile and goal": "الملف والهدف", "Edit my profile": "تعديل ملفي", "Starting weight (kg)": "وزن البداية (كغ)", "Goal (kg)": "الهدف (كغ)", "Start date": "تاريخ البداية",
    "I have a pull-up bar": "لدي عقلة", "Adds pull-ups to the row": "تضيف تمرين العقلة إلى السحب", "Unlock advanced exercises": "فتح التمارين المتقدمة",
    "Diamond push-ups, dips, jump squats: only turn on if you are comfortable": "ضغط الألماس والغطس والقرفصاء القفز: فعّلها فقط إذا كنت مرتاحًا", "Track my cigarettes": "تتبع سجائري", "A counter in the daily check-in": "عداد في حصيلة اليوم",
    "Reminders": "التذكيرات", "Daily reminders": "تذكيرات يومية", "Weight in the morning, meal check in the evening. Nothing is sent if already done.": "الوزن صباحًا وتأكيد الوجبات مساءً. لا يُرسل شيء إن كان منجزًا.",
    "Weight at": "الوزن عند", "Meals at": "الوجبات عند", "Test": "اختبار", "Add to calendar": "إضافة إلى التقويم",
    "Notifications blocked: allow them in Chrome's Android settings. With the app closed, Android may delay or ignore the reminder. To be sure of the time, also add them to your calendar.": "الإشعارات محظورة: اسمح بها في إعدادات أندرويد الخاصة بكروم. والتطبيق مغلق قد يؤخر أندرويد التذكير أو يتجاهله. للتأكد من الوقت، أضفها أيضًا إلى تقويمك.",
    "Creates two daily events with an alert (weight and meals). If you change the times, delete the old events then add them again.": "ينشئ حدثين يوميين مع تنبيه (الوزن والوجبات). إذا غيّرت الأوقات فاحذف الأحداث القديمة ثم أضفها من جديد.",
    "Display": "العرض", "Auto": "تلقائي", "Light": "فاتح", "Dark": "داكن", "Theme": "المظهر",
    "Auto follows Android's light or dark mode. The background, status bar and charts follow your choice.": "التلقائي يتبع وضع أندرويد الفاتح أو الداكن. تتبع الخلفية وشريط الحالة والرسوم اختيارك.",
    "Force screen rotation": "فرض تدوير الشاشة", "Turn on if the app stays stuck in portrait. It then follows the phone's sensor.": "فعّله إذا بقي التطبيق عالقًا في الوضع العمودي. فيتبع حينها مستشعر الهاتف.",
    "Back up now": "احتفظ بنسخة الآن", "Remind me": "ذكّرني", "Every 3 days": "كل 3 أيام", "Never": "أبدًا", "never": "أبدًا",
    "Automatic copies on this phone": "نسخ تلقائية على هذا الهاتف", "None yet. A copy is made every day you use the app.": "لا شيء بعد. تُنشأ نسخة كل يوم تستعمل فيه التطبيق.",
    "not granted": "غير ممنوح", "Data": "البيانات", "Erase all data": "مسح كل البيانات", "Language": "اللغة",
    "No feedback found in this text.": "لم يوجد رأي في هذا النص.", "Copied.": "تم النسخ.", "Profile saved.": "تم حفظ الملف.", "Settings reset to default.": "أُعيدت الإعدادات إلى الافتراضي.",
    "Exercise reserved for advanced levels.": "تمرين مخصص للمستويات المتقدمة.", "The workout keeps at least 3 exercises.": "يحتفظ التمرين بثلاثة تمارين على الأقل.", "Backup created.": "تم إنشاء النسخة الاحتياطية.", "Backup imported.": "تم استيراد النسخة الاحتياطية.",
    "Invalid file: nothing was changed.": "ملف غير صالح: لم يتغير شيء.", "Copy restored.": "تمت استعادة النسخة.", "Set both times first.": "اضبط الوقتين أولًا.",
    "Copy failed: select the text by hand.": "تعذر النسخ: حدّد النص يدويًا.", "Export is not possible on this device.": "التصدير غير ممكن على هذا الجهاز.",
    "Download not possible on this device. Use Copy.": "التنزيل غير ممكن على هذا الجهاز. استعمل النسخ.", "Update ready: it will apply the next time you open the app.": "التحديث جاهز: سيُطبَّق عند فتح التطبيق في المرة القادمة.",
    "Notifications are not allowed on this device.": "الإشعارات غير مسموحة على هذا الجهاز.", "File created: open it to add it to your calendar.": "تم إنشاء الملف: افتحه لإضافته إلى تقويمك.",
    "The feedback box is not activated yet.": "صندوق الآراء غير مفعّل بعد.", "Paste feedback first.": "الصق رأيًا أولًا.", "Feedback encrypted. Choose how to send it.": "تم تشفير الرأي. اختر طريقة إرساله.",
    "Update installed": "تم تثبيت التحديث", "Got it": "فهمت", "New version ready": "إصدار جديد جاهز", "Reload now": "إعادة التحميل الآن",
    "An update of Coach-Mass-KVES has just been downloaded. Reload to use it.": "تم تنزيل تحديث لـ Coach-Mass-KVES. أعد التحميل لاستعماله.",
    "⚠ Before you start": "⚠ قبل أن تبدأ", "I understand, start": "فهمت، ابدأ", "Cancel": "إلغاء",
    "Break the movement down": "تفكيك الحركة", "One rep less": "تكرار أقل", "One rep more": "تكرار أكثر", "Incline push-ups (hands on a chair)": "ضغط مائل (اليدان على كرسي)",
    "Lateral raises (backpack)": "رفع جانبي (حقيبة ظهر)", "Under-table row": "سحب تحت الطاولة", "Floor row with towel": "سحب على الأرض بمنشفة", "Chair dips": "غطس على كرسي", "Biceps curl with backpack": "بايسبس بحقيبة ظهر",
    "Crunches": "كرنش", "Leg raises": "رفع الساقين", "Storage protected from automatic cleanup:": "التخزين محمي من التنظيف التلقائي:",
    "Diet": "النظام الغذائي", "Healthy target: 0.25 to 0.5 kg per week.": "الهدف الصحي: من 0.25 إلى 0.5 كغ في الأسبوع.", "Healthy loss: 0.25 to 0.5 kg per week, never more.": "النقص الصحي: من 0.25 إلى 0.5 كغ في الأسبوع، وليس أكثر.",
    "Aim for a stable weight (less than 0.3 kg per week).": "استهدف وزنًا ثابتًا (أقل من 0.3 كغ في الأسبوع).", "tomorrow": "غدًا", "today": "اليوم"
  };
  var AP = {
    "Week {1} · {2} kg → {3}": "الأسبوع {1} · {2} كغ ← {3}",
    "Week {1} · {2} sets on the main exercises · {3} exercises in the full workout. Planned days: {4}.": "الأسبوع {1} · {2} مجموعات في التمارين الأساسية · {3} تمارين في التمرين الكامل. الأيام المقررة: {4}.",
    "Next workout: {1}. You can still start one from the Workout tab.": "التمرين القادم: {1}. يمكنك مع ذلك بدء تمرين من تبويب التمرين.",
    "{1} sets": "{1} مجموعات", "{1} glasses": "{1} كؤوس", "{1} pieces": "{1} قطع", "{1} workout(s)": "{1} تمرين",
    "Muscles worked: {1}": "العضلات العاملة: {1}",
    "{1} · target: about {2} kcal and {3} g of protein. Tick each meal when you finish it.": "{1} · الهدف: حوالي {2} سعرة و{3} غ بروتين. حدّد كل وجبة عند الانتهاء منها.",
    "Portions adjusted to your goal (about {1}% of the base plan): mainly reduce rice, bread, oil and peanut or amlou butter; keep eggs, chicken and vegetables. Floor: {2} kcal.": "الحصص مكيّفة مع هدفك (حوالي {1}% من الخطة الأساسية): قلّل خصوصًا الأرز والخبز والزيت وزبدة الفول السوداني أو الأملو، وأبقِ البيض والدجاج والخضر. الحد الأدنى: {2} سعرة.",
    "{1} workout(s) missing. This week: schedule them ahead in your calendar, even in a light version.": "ينقصك {1} تمرين. هذا الأسبوع: حدّد مواعيدها مسبقًا في جدولك، ولو بنسخة خفيفة.",
    "Measured pace: not enough weigh-ins (3 over 10 days minimum). {1}": "الوتيرة المقاسة: قياسات الوزن غير كافية (3 على الأقل خلال 10 أيام). {1}",
    "Measured pace: {1} kg per week. {2}": "الوتيرة المقاسة: {1} كغ في الأسبوع. {2}",
    "target {1} s": "الهدف {1} ث", "Less: {1}": "أقل: {1}", "More: {1}": "أكثر: {1}",
    "{1} · {2} · {3} years · {4} cm": "{1} · {2} · {3} سنة · {4} سم",
    "Volume: {1} out of 10": "الصوت: {1} من 10", "Version {1}": "الإصدار {1}", "W{1} · in progress": "أ{1} · جارٍ",
    "Coach-Mass-KVES · version {1} · © KVES. Your data stays on your phone.": "Coach-Mass-KVES · الإصدار {1} · © KVES. بياناتك تبقى على هاتفك.",
    "Last backup to file:": "آخر نسخة احتياطية في ملف:",
    "Front and side mannequin, muscles worked: {1}": "مجسّم من الأمام والجانب، العضلات العاملة: {1}"
  };
  var en = LANG_DATA.en, w = {}, p = [];
  Object.keys(en.w).forEach(function (fr) { if (Object.prototype.hasOwnProperty.call(A, en.w[fr])) w[fr] = A[en.w[fr]]; });
  en.p.forEach(function (x) { if (Object.prototype.hasOwnProperty.call(AP, x.en)) p.push({ re: x.re, en: AP[x.en] }); });
  LANG_DATA.ar = { w: w, p: p };
  LANGS.ar = 'العربية';
})();
/* © KVES · Coach-Mass-KVES */
/* ====================== darija marocaine, écriture latine (13.2) · à faire relire avant le public ======================
   Clé = texte anglais (voir 25-lang-en.js). Chiffres : 3 = ع, 7 = ح, 9 = ق, 5 = خ, 2 = ء. */
(function () {
  var A = {
    "Navigation": "Tanqel", "Today": "Lyoum", "Workout": "Tmrin", "Meals": "L-wajabat", "Progress": "Taqaddum", "History": "Tarikh", "More": "Ktar",
    "Coach · Morning check-in": "Coach · Bilan dyal sbah", "Daily check-in": "Bilan dyal lyoum",
    "No check-in, no progress. Fill it in before your first meal.": "Bla bilan, ma kayn 7ta taqaddum.3mmrou qbel awel wajba.",
    "Weight (kg, fasting)": "L-wazn (kg, 3la rouwa9)", "Sleep (hours)": "Nnoum (sa3at)", "Steps (watch or phone)": "L-khatawat (montre wla tilifon)",
    "Energy (1 = flat, 5 = great)": "T-taqa (1 = mtaffi, 5 = zwina bzzaf)", "Water": "L-ma", "Meals eaten": "L-wajabat li klit",
    "Complete your profile": "Kammel profil dyalek", "Complete my profile": "Kammel profil dyali",
    "Gender, goal (muscle gain, weight loss, toning, maintenance), age and measurements: the app adapts calories and advice.": "Jens, hadaf (tzyad d l3adal, nqass dyal l-wazn, tona9a, l7ifad), l3mor w l9yasat: l-application kat3awed les calories w n-nsa2i7.",
    "Start workout": "Bda t-tmrin",
    "Chest": "S-sder", "Shoulders": "L-ktaf", "Back": "D-dhar", "Arms": "L-driyi3at", "Abs": "L-kerch", "Legs": "Rjliin", "Glutes and calves": "L-warek w l-sma9",
    "Top": "Foq", "Front": "L9eddam", "Freeze": "Wa99ef", "Animate": "7errek", "Hold": "Tbet", "reps": "3awdat", "Timer": "Minuteur", "Reset": "3awd men lwel", "Save set": "Sjjel s-serie",
    "In my full workout": "F tmrin dyali l-kamel", "Untick to remove it (3 exercises minimum). It stays available with “Start alone”.": "Na99es 3lih bach t7iydo (3 tmarin 3la l9ell). Kay b9a kayn b « Bda wa7do ».",
    "Settings and solo start": "Reglages w bdaya wa7da", "Sets": "Series", "Reps": "3awdat", "Rest": "R-ra7a", "Duration": "L-mudda",
    "Sets and reps are used for solo start. Rest also applies to the full workout.": "Series w 3awdat kaykhdmo f l-bdaya wa7da. R-ra7a kat khdem 7ta f t-tmrin l-kamel.",
    "Start alone": "Bda wa7do", "advanced": "mtaqqdem", "Reserved for advanced levels.": "Khass b l-mustawayat l-mtaqddma.",
    "⚠ Precautions.": "⚠ L-i7tiyatat.", "Stop if:": "Wa99ef ila:",
    "It unlocks when your push-ups and squats have progressed, or in Settings (Unlock advanced exercises).": "Kaytfta7 melli t-tmrin dyal pompes w squats yt7assnou, wla mn Reglages (Ftah t-tmarin l-mtaqddma).",
    "Push-ups": "Pompes", "Diamond push-ups": "Pompes diamant", "Hands-on-chair push-ups": "Pompes w ydik 3la kursi", "Pike push-ups": "Pompes pike",
    "Lateral raises, light backpack": "Rf3 jenbi, sak khfif", "Under-table row, knees bent": "Jbed men ta7t t-tabla, rkab mt-niyin", "Superman, 1 s pause": "Superman, wa99ef tanya",
    "Floor row, knees bent": "Jbed f l-ard, rkab mt-niyin", "Chair dips, knees bent": "Dips 3la kursi, rkab mt-niyin", "Curl, light backpack": "Curl, sak khfif",
    "Forearm plank": "Planche 3la s-sa3dayn", "Crunches, hands on thighs": "Crunchs, ydik 3la l-fkhad", "Bent-leg raises": "Rf3 d rjlin mt-niyin", "Slow mountain climbers": "Mountain climbers b-buTe2",
    "Squats": "Squats", "Walking lunges": "Fentes m-mashyin", "Bulgarian split squat": "Squat bulgare", "Jump squat": "Squat m3a n-nat", "Glute bridge": "Pont dyal l-warek", "Calf raises": "Rf3 3la rwas s-sba3",
    "Arms by your sides": "Ydik 3la jnab j-jism", "Arms extended": "Ydik mmdoudin", "Arm extended": "Yed mmdouda", "Flat": "MseTT7", "Lying": "Mt-lli", "Low legs": "Rjliin l-ta7t", "Leg extended": "Rjl mmdouda",
    "Start": "Bdaya", "Standing": "Wa9ef", "Bottom of squat": "T-ta7t dyal squat", "Heels down": "L-3qeb f l-ard",
    "chest": "s-sder", "triceps": "triceps", "shoulders": "l-ktaf", "biceps": "biceps", "back": "d-dhar", "lower back": "asfel d-dhar", "glutes": "l-warek", "abs": "l-kerch", "thighs": "l-fkhad", "calves": "s-sma9", "hamstrings": "wra l-fkhad",
    "Today's meals": "L-wajabat dyal lyoum", "Alternatives": "Bdayel", "No chicken": "Bla djaj", "4 sardines or 200 g of lentils": "4 sardin wla 200 g d l3dess",
    "Low appetite": "Ma-fiyach chhiya", "Drink the smoothie as well": "Chrab smoothie zyada", "Tight budget": "Budget dayq", "Eggs, legumes, sardines": "L-bid, l-9ouliyat, sardin",
    "3-egg omelette, 1 bread, 1 tbsp olive oil, 1 glass of chocolate milk": "Omelette dyal 3 d l-bid, khobza, m3elqa kbira d zit z-zitoun, kass d l7lib b chocolat",
    "3-egg omelette, 2 bananas, 50 g cooked rice, 1 tbsp olive oil": "Omelette dyal 3 d l-bid, 2 banan, 50 g d r-rouz m-tyyeb, m3elqa kbira d zit z-zitoun",
    "Oats (60 g) cooked in 250 ml milk, 1 banana, 1 tbsp amlou": "Avoine (60 g) m-tyyba f 250 ml d l7lib, banana, m3elqa kbira d amlou",
    "1 bread, 100 g mashed cooked chickpeas with 1 tbsp olive oil, 1 banana": "Khobza, 100 g d l-7ommos m-tyyeb m-3ssour m3a m3elqa kbira d zit z-zitoun, banana",
    "80 g (raw) cooked rice, 100 g cooked chickpeas, 2 bananas, 1 tbsp olive oil": "80 g (nay) d r-rouz m-tyyeb, 100 g d l-7ommos m-tyyeb, 2 banan, m3elqa kbira d zit z-zitoun",
    "Smoothie: 300 ml milk, 2 bananas, 40 g oats, 1 tbsp amlou or peanut butter": "Smoothie: 300 ml d l7lib, 2 banan, 40 g d avoine, m3elqa kbira d amlou wla beurre d cacahuète",
    "Smoothie: 300 ml milk, 2 bananas, 40 g oats, 1 tbsp honey": "Smoothie: 300 ml d l7lib, 2 banan, 40 g d avoine, m3elqa kbira d l3sel",
    "Smoothie: 300 ml milk, 2 bananas, 1 tbsp amlou or peanut butter": "Smoothie: 300 ml d l7lib, 2 banan, m3elqa kbira d amlou wla beurre d cacahuète",
    "2 mashed bananas with 40 g oats and 1 tbsp amlou, 200 ml water": "2 banan m-3ssourin m3a 40 g d avoine w m3elqa kbira d amlou, 200 ml d l-ma",
    "3 bananas and 2 dates": "3 banan w 2 tmrat",
    "150 g chicken or 4 sardines, 80 g (raw) rice, vegetables, 1 tbsp olive oil": "150 g d djaj wla 4 sardin, 80 g (nay) d r-rouz, khodra, m3elqa kbira d zit z-zitoun",
    "150 g chicken, 80 g (raw) rice, vegetables, 1 tbsp olive oil": "150 g d djaj, 80 g (nay) d r-rouz, khodra, m3elqa kbira d zit z-zitoun",
    "4 sardines, 80 g (raw) rice, vegetables, 1 tbsp olive oil": "4 sardin, 80 g (nay) d r-rouz, khodra, m3elqa kbira d zit z-zitoun",
    "200 g cooked lentils, 80 g (raw) rice, vegetables, 1 tbsp olive oil": "200 g d l3dess m-tyyeb, 80 g (nay) d r-rouz, khodra, m3elqa kbira d zit z-zitoun",
    "1 bread with 1 tbsp amlou, 1 yogurt": "Khobza b m3elqa kbira d amlou, yaourt", "1 bread with 1 tbsp honey, 1 yogurt": "Khobza b m3elqa kbira d l3sel, yaourt",
    "1 yogurt, 2 bananas, 1 tbsp amlou": "Yaourt, 2 banan, m3elqa kbira d amlou", "1 yogurt, 2 bananas, 2 dates": "Yaourt, 2 banan, 2 tmrat", "2 bananas, 3 dates": "2 banan, 3 tmrat",
    "150 g cooked lentils or chickpeas, 2 eggs, 1 bread": "150 g d l3dess wla l-7ommos m-tyyeb, 2 d l-bid, khobza",
    "150 g cooked lentils, 2 eggs, 1 bread": "150 g d l3dess m-tyyeb, 2 d l-bid, khobza", "150 g cooked chickpeas, 2 eggs, 1 bread": "150 g d l-7ommos m-tyyeb, 2 d l-bid, khobza",
    "150 g cooked lentils or chickpeas, 2 eggs, 60 g (raw) rice": "150 g d l3dess wla l-7ommos m-tyyeb, 2 d l-bid, 60 g (nay) d r-rouz",
    "150 g cooked lentils, 2 eggs, 60 g (raw) rice": "150 g d l3dess m-tyyeb, 2 d l-bid, 60 g (nay) d r-rouz", "150 g cooked chickpeas, 2 eggs, 60 g (raw) rice": "150 g d l-7ommos m-tyyeb, 2 d l-bid, 60 g (nay) d r-rouz",
    "200 g cooked lentils or chickpeas, 1 bread, 1 yogurt": "200 g d l3dess wla l-7ommos m-tyyeb, khobza, yaourt",
    "200 g cooked lentils, 1 bread, 1 yogurt": "200 g d l3dess m-tyyeb, khobza, yaourt", "200 g cooked chickpeas, 1 bread, 1 yogurt": "200 g d l-7ommos m-tyyeb, khobza, yaourt",
    "200 g cooked lentils or chickpeas, 60 g (raw) rice, 1 tbsp olive oil": "200 g d l3dess wla l-7ommos m-tyyeb, 60 g (nay) d r-rouz, m3elqa kbira d zit z-zitoun",
    "200 g cooked lentils, 60 g (raw) rice, 1 tbsp olive oil": "200 g d l3dess m-tyyeb, 60 g (nay) d r-rouz, m3elqa kbira d zit z-zitoun", "200 g cooked chickpeas, 60 g (raw) rice, 1 tbsp olive oil": "200 g d l-7ommos m-tyyeb, 60 g (nay) d r-rouz, m3elqa kbira d zit z-zitoun",
    "Before bed": "Qbel ma tnam", "Glass of milk + 1 bread with amlou (adds 300 kcal)": "Kass d l7lib + khobza b amlou (kat zid 300 kcal)", "2 bananas and 4 dates (adds 300 kcal)": "2 banan w 4 tmrat (kat zid 300 kcal)",
    "Diet and budget": "Regime w budget", "Meals and shopping adapt. Halal: the chicken and sardines in the plan are fine, buy them halal from your butcher.": "L-wajabat w l-mchtariyat kay t3awdo. Halal: d-djaj w s-sardin li f l-plan mzyanin, chrihom halal 3and l-jezzar dyalek.",
    "No eggs": "Bla bid", "No milk": "Bla l7lib", "No tree nuts / peanuts": "Bla l-ma3kssarat / cacahuète", "No gluten": "Bla gluten", "Vegetarian (no meat or fish)": "Vegetarien (bla l7em wla 7out)",
    "Budget": "Budget", "Normal": "3adi", "Tight (less meat)": "Dayq (l7em a9ell)",
    "Shopping list": "Lista dyal l-mchtariyat", "Pick your options: the list calculates itself from the meals above.": "Khtar l-khayarat dyalek: l-lista kat t7seb wa7dha mn l-wajabat li foq.",
    "For how many days": "L-ch7al mn nhar", "3 days": "3 iyam", "7 days": "7 iyam", "14 days": "14 nhar", "2:30 pm meal": "Wajba dyal 2:30", "9:30 pm meal": "Wajba dyal 9:30 d l-lil",
    "Chicken": "Djaj", "Sardines": "Sardin", "Alternate": "Bdel", "Lentils": "L3dess", "Chickpeas": "L-7ommos",
    "Eggs": "L-bid", "Bread": "Khobz", "Milk": "L7lib", "Cocoa powder (chocolate milk)": "Cacao (l7lib b chocolat)", "Bananas": "Banan", "Oats": "Avoine",
    "Amlou or peanut butter": "Amlou wla beurre d cacahuète", "Honey": "L3sel", "Dates": "Tmr", "Olive oil": "Zit z-zitoun", "Yogurts": "Yaourt", "Rice": "R-rouz", "Seasonal vegetables (approx.)": "Khodra d l-mousem (t9riban)",
    "Dry lentils": "L3dess nachef", "Dry chickpeas": "L-7ommos nachef",
    "Quantities are calculated from your meals, goal, diet and budget. Vegetables are estimated; lentils and chickpeas are counted dry (60 g dry for 150 g cooked). Prices vary: no cost is shown.": "L-kmiyat kat t7seb mn l-wajabat, l-hadaf, r-regime w l-budget dyalek. L-khodra t9diriya; l3dess w l-7ommos m7subin nachfin (60 g nachef = 150 g m-tyyeb). L-as3ar kat tbddel: ma kayn 7ta taman m3rdoud.",
    "Copy the list": "Nsakh l-lista", "Untick all": "Na99es 3la koulchi",
    "kg now": "kg daba", "kg to go": "kg li b9aw", "estimate": "t9dir",
    "Weekly review": "Bilan dyal s-simana", "The last 7 days.": "Akhir 7 iyam.", "workouts": "tmarin", "meals ticked": "wajabat m3lmin", "avg sleep": "moyenne dyal nnoum", "avg energy": "moyenne dyal t-taqa", "kcal/day (ticked)": "kcal/nhar (m3lmin)", "kg": "kg",
    "Coach's advice:": "Nsi7a dyal coach:", "Copy the review": "Nsakh l-bilan",
    "This week: schedule them ahead in your calendar, even in a light version.": "Had s-simana: 7eddhom mn qbel f calendrier dyalek, wlaw b noskha khfifa.",
    "Your average sleep is short. Go to bed an hour earlier before adding more load: that is where muscle is built.": "Moyenne dyal nnoum dyalek qasira. Nad 3la saa3a bakri 9bel ma tzid l-7aml: hna fin kat tebna l-3adala.",
    "You ticked fewer than 70% of your meals. Prepare tomorrow's meals the day before.": "3lemti a9all mn 70% mn l-wajabat. 7ddr l-wajabat dyal ghedda l-barah.",
    "Your weight is dropping while you want to gain mass: add a meal or a snack.": "L-wazn dyalek kay nqass w nta bghiti tzid: zid wajba wla snack.",
    "Your weight is rising while you want to lose: watch the rice, bread and oil.": "L-wazn dyalek kayzid w nta bghiti tnqess: dir balek mn r-rouz, l-khobz w z-zit.",
    "Full week. Keep the same pace and aim for one more rep per set.": "Simana kamla. B9a 3la nafs l-iqa3 w 7awel tzid 3awda wa7da f kol serie.",
    "Keep going: tick your meals, weigh yourself every Sunday and log your sleep.": "Kemmel: 3lem l-wajabat, wzen rassek koll l-had w sjjel nnoum dyalek.",
    "4 wks": "4 smayen", "8 wks": "8 smayen", "6 months": "6 chhor", "All": "Koulchi", "Period": "L-fatra", "Weight trend": "Tatawwor l-wazn",
    "Not enough weigh-ins in this period. Log your weight in the daily check-in.": "Ma kaynch bzzaf d l-wazn f had l-fatra. Sjjel l-wazn dyalek f bilan dyal lyoum.",
    "Performance per workout": "L-ada2 f kol tmrin", "Total": "L-majmou3", "Total reps (excluding planks)": "Majmou3 d 3awdat (bla planche)",
    "No workout finished in this period. Do a workout to see your curve.": "Ma kayn 7ta tmrin kmel f had l-fatra. Dir tmrin bach tchouf l-courbe dyalek.",
    "Week by week": "Simana b simana", "Week": "Simana", "Workouts": "Tmarin", "Avg weight": "Moyenne d l-wazn",
    "Measurements": "L9yasat", "Every 2 weeks, fasting in the morning, in cm.": "Koll jouj d smayen, sbah 3la rouwa9, b cm.", "Waist": "Lkhsr", "Hips": "L-warek", "Thigh": "L-fkhad", "Calf": "S-sma9",
    "Save": "Sjjel", "Backup": "Sauvegarde", "Your data stays on this phone. Export it from time to time.": "L-ma3lomat dyalek kay b9aw f had t-tilifon. Sdder-hom mn waqt l-akhor.", "Export": "Sdder", "Import": "Jib",
    "No workout recorded yet. Every set you do is kept here, with the date, the variant and your reps.": "Ma kayn 7ta tmrin msjjel tal daba. Kol serie kat dir kat b9a hna, m3a t-tarikh, n-naw3 w l-3awdat.",
    "Feedback box": "Sandouq d l-ara2", "An idea, a problem, a thank-you? Your feedback is encrypted on your phone before sending: only the app owner can read it.": "Fekra, mochkil, wla chokran? R-ray dyalek kay t-cheffer f t-tilifon dyalek qbel ma yt-sift: ghir mol l-application li y9der y9rah.",
    "Give feedback": "3ti ray", "Settings": "Reglages", "Workout days, voice, sounds, weight goal, screen rotation.": "Iyam d t-tmrin, s-sout, l-aswat, hadaf l-wazn, dawran l-ecran.", "Open settings": "Fta7 l-reglages",
    "Sources and limits": "L-masadir w l-7doud", "Where the program's guidelines come from, and the precautions to know.": "Mnin jaw l-marji3at dyal l-programme, w l-i7tiyatat li khassek t3ref.", "Read": "9ra",
    "Share the app": "Cherek l-application", "Send Coach-Mass-KVES to a friend to try it: the link shows the logo and key features.": "Sift Coach-Mass-KVES l-sa7bek bach yjerrbo: r-rabit kay ban fih l-logo w l-mizat l-asasiya.",
    "Share": "Cherek", "Copy the link": "Nsakh r-rabit", "Show the QR code": "Werri QR code", "Your friend scans this code with their phone camera.": "Sa7bek kay scanni had l-code b camera d t-tilifon dyalo.",
    "About": "3la", "Owner area": "Espace d mol l-application",
    "Your profile": "Profil dyalek", "To adapt calories and advice. Everything stays on your phone. App for people aged 18 and over.": "Bach n-3awdo l-calories w n-nsa2i7. Koulchi kay b9a f t-tilifon dyalek. L-application l-nass li 3mrhom 18 3am wla ktar.",
    "Gender": "Jens", "Male": "Rajel", "Female": "Mra", "Prefer not to say": "Ma bghitch n9ol", "Goal": "L-hadaf", "Muscle gain": "Tzyad d l3adal", "Weight loss": "Nqass d l-wazn", "Toning": "Tona9a", "Maintenance": "L7ifad 3la l-wazn",
    "Age": "L3mor", "Height (cm)": "T-toul (cm)", "Current weight (kg)": "L-wazn d daba (kg)", "Target weight (kg)": "L-wazn l-matlob (kg)", "Measurements (optional, in cm)": "L9yasat (ikhtiyari, b cm)",
    "General guidelines, not medical advice. If you have an illness, treatment, pregnancy or any doubt, talk to a doctor before changing your diet or sport.": "Marji3at 3amma, machi nsi7a tibbiya. Ila kan 3andek merd, 3ilaj, 7mal wla ay chekk, hder m3a tbib qbel ma tbddel l-akl wla r-riyada dyalek.",
    "Confirm": "2akked", "I already have a backup: import it": "3andi sauvegarde: jib-ha", "Later": "Moura",
    "← More": "← Ktar", "Workout days": "Iyam d t-tmrin", "Mon": "Tnin", "Tue": "Tlata", "Wed": "Larba3", "Thu": "Khmis", "Fri": "Jem3a", "Sat": "Sebt", "Sun": "L-had",
    "Coach": "Coach", "Coach voice": "Sout d coach", "Speaks in French in your earphones": "Kayhder b l-fransawiya f l-couteurs dyalek", "Vibrations": "Ihtizazat", "Vibration strength": "9uwwat l-ihtizaz",
    "Strong": "9wiya", "Very strong": "9wiya bzzaf", "Count reps out loud": "3dd l-3awdat b sout 3ali", "The coach sets the pace": "Coach howa li kay 7ded l-iqa3",
    "Automatic sequencing": "Tsalsol automatiki", "Hands-free: the coach restarts after rest": "Bla ma tlems: coach kay bda mn jdid men b3d r-ra7a", "Seconds per rep": "Tawani l-kol 3awda", "Extra rest (seconds)": "Ra7a zayda (tawani)",
    "Test the voice": "Jerreb s-sout", "Test the vibration": "Jerreb l-ihtizaz", "Sound signals": "Icharat sawtiya", "Sounds on": "Chghel l-aswat", "Beeps at the end of a set, an exercise and rest": "Bip f lkhir d serie, tmrin w ra7a",
    "Cadence metronome": "Metronome d l-iqa3", "Low beep going down, high beep going up": "Bip ghlid f n-nzoul, bip rfi3 f s-s3oud", "Alert 10 seconds before rest ends": "Tanbih 10 tawani qbel ma tsali r-ra7a",
    "Test each signal:": "Jerreb kol icharat:", "End of set": "Lkhir d serie", "End of exercise": "Lkhir d tmrin", "End of rest": "Lkhir d r-ra7a", "10 s alert": "Tanbih 10 s", "Countdown": "3add tanazuli", "Cadence": "L-iqa3", "End of workout": "Lkhir d s-seance",
    "Profile and goal": "Profil w hadaf", "Edit my profile": "Bddel profil dyali", "Starting weight (kg)": "L-wazn d l-bdaya (kg)", "Goal (kg)": "L-hadaf (kg)", "Start date": "Tarikh l-bdaya",
    "I have a pull-up bar": "3andi barre d traction", "Adds pull-ups to the row": "Kat zid tractions m3a l-jbed", "Unlock advanced exercises": "Fta7 t-tmarin l-mtaqddma",
    "Diamond push-ups, dips, jump squats: only turn on if you are comfortable": "Pompes diamant, dips, squat m3a n-nat: ma tchghelhomch ila ma kontich mrte7", "Track my cigarettes": "Tbe3 s-sijar dyali", "A counter in the daily check-in": "Compteur f bilan dyal lyoum",
    "Reminders": "Tadkirat", "Daily reminders": "Tadkirat yawmiya", "Weight in the morning, meal check in the evening. Nothing is sent if already done.": "L-wazn f s-sbah, t2kid l-wajabat f l-3chiya. Ma kayt-sift walou ila kan deja dayr.",
    "Weight at": "L-wazn f", "Meals at": "L-wajabat f", "Test": "Tjrib", "Add to calendar": "Zid l calendrier",
    "Notifications blocked: allow them in Chrome's Android settings. With the app closed, Android may delay or ignore the reminder. To be sure of the time, also add them to your calendar.": "Notifications mbloukin: sme7 bihom f reglages Android d Chrome. Melli l-application tkoun msdoda, Android y9der y-3tter wla ma ydirch t-tadkir. Bach tkoun mt2kked mn l-waqt, zid-hom 7ta l calendrier.",
    "Creates two daily events with an alert (weight and meals). If you change the times, delete the old events then add them again.": "Kay sawb jouj d l-event yawmiyin m3a tanbih (l-wazn w l-wajabat). Ila bddelti s-sa3at, msse7 l-event l-qdam w zid-hom mn jdid.",
    "Display": "L-3ard", "Auto": "Auto", "Light": "Fatih", "Dark": "Ghamiq", "Theme": "Thème",
    "Auto follows Android's light or dark mode. The background, status bar and charts follow your choice.": "Auto kay tbe3 mode fatih wla ghamiq d Android. L-khalfiya w courbes kay tbe3o khtiyar dyalek.",
    "Force screen rotation": "Frod dawran l-ecran", "Turn on if the app stays stuck in portrait. It then follows the phone's sensor.": "Chghlo ila b9at l-application 3alqa f portrait. Wakha kat tbe3 capteur d t-tilifon.",
    "Back up now": "Dir sauvegarde daba", "Remind me": "Fakkarni", "Every 3 days": "Koll 3 iyam", "Never": "Abadan", "never": "abadan",
    "Automatic copies on this phone": "Noskhat automatikiya f had t-tilifon", "None yet. A copy is made every day you use the app.": "Walou tal daba. Kat tdar noskha koll nhar kat khdem l-application.",
    "not granted": "ma tmnaht", "Data": "L-ma3lomat", "Erase all data": "Msse7 koulchi", "Language": "Lougha",
    "No feedback found in this text.": "Ma tlqa 7ta ray f had n-nass.", "Copied.": "Tnsakh.", "Profile saved.": "Tsjjel l-profil.", "Settings reset to default.": "Rj3o l-reglages l-par defaut.",
    "Exercise reserved for advanced levels.": "Tmrin khass b l-mustawayat l-mtaqddma.", "The workout keeps at least 3 exercises.": "T-tmrin kay b9a fih 3la l9ell 3 d t-tmarin.", "Backup created.": "Tsawbat s-sauvegarde.", "Backup imported.": "Tjabet s-sauvegarde.",
    "Invalid file: nothing was changed.": "Fichier machi s7i7: ma tbddel walou.", "Copy restored.": "Tsterj3at n-noskha.", "Set both times first.": "7ded s-sa3tin lwel.",
    "Copy failed: select the text by hand.": "Ma tnsakhch: khtar n-nass b yeddik.", "Export is not possible on this device.": "T-tsdir ma mmkinch f had l-jihaz.",
    "Download not possible on this device. Use Copy.": "T-tn7mil ma mmkinch f had l-jihaz. St3mel Nsakh.", "Update ready: it will apply the next time you open the app.": "L-mise à jour wajda: ghadi tkhdem melli tfta7 l-application l-merra jaya.",
    "Notifications are not allowed on this device.": "Notifications ma msmou7inch f had l-jihaz.", "File created: open it to add it to your calendar.": "Tsawb l-fichier: fta7o bach tzidou l calendrier.",
    "The feedback box is not activated yet.": "Sandouq d l-ara2 mazal ma tfa3ch.", "Paste feedback first.": "Lsa9 ray lwel.", "Feedback encrypted. Choose how to send it.": "R-ray tcheffer. Khtar kifach tsifto.",
    "Update installed": "Tinstala l-mise à jour", "Got it": "Fhemt", "New version ready": "Version jdida wajda", "Reload now": "3awd chargi daba",
    "An update of Coach-Mass-KVES has just been downloaded. Reload to use it.": "Tn7mlat mise à jour d Coach-Mass-KVES. 3awd chargi bach tst3mlha.",
    "⚠ Before you start": "⚠ Qbel ma tbda", "I understand, start": "Fhemt, bda", "Cancel": "Lghi",
    "Break the movement down": "Fekk l-7araka", "One rep less": "3awda a9ell", "One rep more": "3awda ktar", "Incline push-ups (hands on a chair)": "Pompes mayla (ydik 3la kursi)",
    "Lateral raises (backpack)": "Rf3 jenbi (sak)", "Under-table row": "Jbed men ta7t t-tabla", "Floor row with towel": "Jbed f l-ard b serviette", "Chair dips": "Dips 3la kursi", "Biceps curl with backpack": "Curl biceps b sak",
    "Crunches": "Crunchs", "Leg raises": "Rf3 d r-rjlin", "Storage protected from automatic cleanup:": "L-khzin m7mi mn t-tandhif l-automatiki:",
    "Diet": "Regime", "Healthy target: 0.25 to 0.5 kg per week.": "L-hadaf s-sa7i: mn 0,25 l 0,5 kg f s-simana.", "Healthy loss: 0.25 to 0.5 kg per week, never more.": "Nqass sa7i: mn 0,25 l 0,5 kg f s-simana, machi ktar.",
    "Aim for a stable weight (less than 0.3 kg per week).": "7awel tb9a f wazn tabet (a9ell mn 0,3 kg f s-simana).", "tomorrow": "ghedda", "today": "lyoum"
  };
  var AP = {
    "Week {1} · {2} kg → {3}": "Simana {1} · {2} kg → {3}",
    "Week {1} · {2} sets on the main exercises · {3} exercises in the full workout. Planned days: {4}.": "Simana {1} · {2} series f t-tmarin l-asasiya · {3} tmarin f s-seance kamla. L-iyam l-mkhttata: {4}.",
    "Next workout: {1}. You can still start one from the Workout tab.": "S-seance j-jaya: {1}. T9der tbda wa7da mn onglet Tmrin.",
    "{1} sets": "{1} series", "{1} glasses": "{1} kiyas", "{1} pieces": "{1} 7bat", "{1} workout(s)": "{1} d s-seances",
    "Muscles worked: {1}": "L-3adalat li kat khdem: {1}",
    "{1} · target: about {2} kcal and {3} g of protein. Tick each meal when you finish it.": "{1} · l-hadaf: t9riban {2} kcal w {3} g d l-protéine. 3lem 3la kol wajba melli tkmel-ha.",
    "Portions adjusted to your goal (about {1}% of the base plan): mainly reduce rice, bread, oil and peanut or amlou butter; keep eggs, chicken and vegetables. Floor: {2} kcal.": "L-kmiyat m3awda 7sab l-hadaf dyalek (t9riban {1}% mn l-plan l-asasi): na99es khassatan r-rouz, l-khobz, z-zit w beurre d cacahuète wla amlou, w khalli l-bid, d-djaj w l-khodra. L-7edd l-adna: {2} kcal.",
    "{1} workout(s) missing. This week: schedule them ahead in your calendar, even in a light version.": "Nqass lik {1} d s-seances. Had s-simana: 7eddhom mn qbel f calendrier dyalek, wlaw b noskha khfifa.",
    "Measured pace: not enough weigh-ins (3 over 10 days minimum). {1}": "L-iqa3 l-m9is: ma kaynch bzzaf d l-wzan (3 3la l9ell f 10 d iyam). {1}",
    "Measured pace: {1} kg per week. {2}": "L-iqa3 l-m9is: {1} kg f s-simana. {2}",
    "target {1} s": "l-hadaf {1} s", "Less: {1}": "A9ell: {1}", "More: {1}": "Ktar: {1}",
    "{1} · {2} · {3} years · {4} cm": "{1} · {2} · {3} 3am · {4} cm",
    "Volume: {1} out of 10": "S-sout: {1} mn 10", "Version {1}": "Version {1}", "W{1} · in progress": "S{1} · jarya",
    "Coach-Mass-KVES · version {1} · © KVES. Your data stays on your phone.": "Coach-Mass-KVES · version {1} · © KVES. L-ma3lomat dyalek kay b9aw f t-tilifon dyalek.",
    "Last backup to file:": "Akhir sauvegarde f fichier:",
    "Front and side mannequin, muscles worked: {1}": "Mannequin mn l9eddam w mn l-jnab, l-3adalat li kat khdem: {1}"
  };
  var en = LANG_DATA.en, w = {}, p = [];
  Object.keys(en.w).forEach(function (fr) { if (Object.prototype.hasOwnProperty.call(A, en.w[fr])) w[fr] = A[en.w[fr]]; });
  en.p.forEach(function (x) { if (Object.prototype.hasOwnProperty.call(AP, x.en)) p.push({ re: x.re, en: AP[x.en] }); });
  LANG_DATA.ma = { w: w, p: p };
  LANGS.ma = 'Darija';
})();
/* © KVES · Coach-Mass-KVES */
/* ====================== 13.3 : textes des exercices et précautions (EN, AR, darija) · à faire relire avant le public ====================== */
(function () {
  var X = {
 "en": {
  "Corps droit de la tête aux talons, coudes à 45°. Poitrine près du sol.": "Body straight from head to heels, elbows at 45°. Chest close to the floor.",
  "Mains rapprochées sous la poitrine, pouces et index en losange. Coudes près du corps. Exercice avancé : arrête-toi si le poignet ou le coude tire.": "Hands close together under the chest, thumbs and index fingers in a diamond. Elbows close to the body. Advanced exercise: stop if your wrist or elbow pulls.",
  "Poignets et coudes sollicités. Maîtrise d'abord les pompes classiques. Coudes près du corps, poignets alignés, monte progressivement.": "Wrists and elbows are loaded. Master classic push-ups first. Elbows close to the body, wrists aligned, build up gradually.",
  "douleur au poignet ou au coude, picotements dans les mains.": "pain in the wrist or elbow, tingling in the hands.",
  "Chaise bloquée contre un mur. Corps droit, poitrine vers le bord de la chaise. Plus la prise est haute, plus c'est facile.": "Chair braced against a wall. Body straight, chest toward the edge of the chair. The higher your hands, the easier it is.",
  "Hanches hautes en V inversé. Tête vers le sol entre les mains, puis pousse.": "Hips high in an inverted V. Head toward the floor between your hands, then push.",
  "Épaules, poignets et nuque sollicités. Échauffe épaules et poignets. Dirige la tête vers le sol entre les mains sans la poser et sans forcer sur la nuque.": "Shoulders, wrists and neck are loaded. Warm up your shoulders and wrists. Lower your head toward the floor between your hands without resting it and without straining your neck.",
  "douleur à l'épaule, au poignet ou à la nuque, vertige.": "pain in the shoulder, wrist or neck, dizziness.",
  "Tiens le sac à dos par ses sangles, bras presque tendus. Monte jusqu'à l'horizontale, pas plus haut. Pas d'élan.": "Hold the backpack by its straps, arms almost straight. Raise to horizontal, no higher. No swinging.",
  "Table très stable (teste-la). Corps gainé, tire la poitrine vers le bord.": "Very stable table (test it). Body braced, pull your chest toward the edge.",
  "Allongé sur le ventre, lève bras et jambes en même temps, regard au sol. Monte sans cambrer fort, redescends lentement.": "Lying on your stomach, lift arms and legs at the same time, eyes on the floor. Rise without arching hard, lower slowly.",
  "Bas du dos sollicité. Monte sans cambrer fort ni à-coups, regard au sol, redescends lentement. À éviter en cas de douleur lombaire.": "Lower back is loaded. Rise without arching hard or jerking, eyes on the floor, lower slowly. Avoid if you have lower-back pain.",
  "douleur ou pincement dans le bas du dos.": "pain or pinching in the lower back.",
  "ATTENTION : fixe la serviette à un point TRÈS solide (porte fermée à clé, serviette coincée). Au moindre doute, ne fais pas cet exercice. Tire en serrant les omoplates.": "WARNING: attach the towel to a VERY solid point (locked door, towel wedged in). If in the slightest doubt, do not do this exercise. Pull while squeezing your shoulder blades.",
  "Risque de chute si le point d'ancrage cède. Ancre la serviette dans une porte fermée à clé, solide, et teste en tirant doucement avant la série. Au moindre doute, ne fais pas cet exercice.": "Risk of falling if the anchor point gives way. Anchor the towel in a solid, locked door and test by pulling gently before the set. If in the slightest doubt, do not do this exercise.",
  "l'ancrage bouge, douleur à l'épaule ou au dos.": "the anchor moves, pain in the shoulder or back.",
  "Chaise bloquée contre un mur. Descends seulement à 90° aux coudes, épaules loin des oreilles. Exercice avancé : stoppe au moindre pincement à l'épaule.": "Chair braced against a wall. Go down only to 90° at the elbows, shoulders away from your ears. Advanced exercise: stop at the slightest pinch in the shoulder.",
  "Épaules et poignets sollicités. Chaise bloquée contre un mur. Descends à 90° aux coudes au maximum, épaules loin des oreilles, dos proche de la chaise.": "Shoulders and wrists are loaded. Chair braced against a wall. Go down to 90° at the elbows at most, shoulders away from your ears, back close to the chair.",
  "pincement ou douleur à l'épaule, mains qui s'engourdissent, craquement douloureux.": "pinching or pain in the shoulder, hands going numb, painful cracking.",
  "Coudes collés au corps, sac à dos tenu par la sangle. Monte sans balancer le buste, redescends lentement.": "Elbows glued to your body, backpack held by the strap. Curl up without swinging your torso, lower slowly.",
  "Coudes sous les épaules, corps aligné, fessiers et ventre serrés. Respire.": "Elbows under your shoulders, body aligned, glutes and belly tight. Breathe.",
  "Dos au sol, genoux fléchis. Décolle seulement les épaules en expirant, sans tirer sur la nuque.": "Back on the floor, knees bent. Lift only your shoulders while breathing out, without pulling on your neck.",
  "Mains sous les fessiers, bas du dos plaqué au sol. Descends sans toucher le sol. Si le dos se creuse, fléchis les genoux.": "Hands under your glutes, lower back pressed to the floor. Lower without touching the floor. If your back arches, bend your knees.",
  "Bas du dos et hanches sollicités. Bas du dos plaqué au sol, fléchis les genoux si le dos se creuse, descends lentement sans balancer.": "Lower back and hips are loaded. Keep your lower back on the floor, bend your knees if your back arches, lower slowly without swinging.",
  "douleur lombaire, tiraillement à l'aine ou à la hanche.": "lower-back pain, pulling in the groin or hip.",
  "Position de pompe, mains sous les épaules. Ramène un genou vers la poitrine puis alterne. Compte chaque montée de genou.": "Push-up position, hands under your shoulders. Bring one knee toward your chest then alternate. Count each knee drive.",
  "Talons au sol, genoux dans l'axe des pieds. Cuisses parallèles au sol.": "Heels on the floor, knees in line with your feet. Thighs parallel to the floor.",
  "Grand pas, buste droit, genou arrière près du sol. Reps par jambe.": "Long step, torso upright, back knee close to the floor. Reps per leg.",
  "Genoux sollicités. Grand pas, genou avant dans l'axe du pied, buste droit, sol antidérapant.": "Knees are loaded. Long step, front knee in line with your foot, torso upright, non-slip floor.",
  "douleur au genou, déséquilibre, craquement douloureux.": "knee pain, loss of balance, painful cracking.",
  "Pied arrière sur une chaise bloquée, buste droit. Descends jusqu'à ce que la cuisse avant soit parallèle au sol. Reps par jambe.": "Back foot on a braced chair, torso upright. Go down until your front thigh is parallel to the floor. Reps per leg.",
  "Genou avant et équilibre sollicités. Chaise bloquée contre un mur, appui d'une main sur un mur au début. Genou avant dans l'axe du pied, buste droit.": "Front knee and balance are loaded. Chair braced against a wall, rest one hand on a wall at first. Front knee in line with your foot, torso upright.",
  "douleur au genou avant, perte d'équilibre, chaise qui bouge.": "pain in the front knee, loss of balance, chair moving.",
  "Descends en squat, saute en poussant fort, retombe en douceur sur la pointe puis le talon, genoux fléchis. Exercice avancé : évite si les genoux ou les chevilles te font mal.": "Go down into a squat, jump by pushing hard, land softly on the ball of the foot then the heel, knees bent. Advanced exercise: avoid it if your knees or ankles hurt.",
  "Genoux, chevilles et tendons d'Achille sollicités. Sol plat, non glissant et dégagé, chaussures de sport. Réception souple sur la pointe puis le talon, genoux dans l'axe. À éviter en cas de douleur articulaire.": "Knees, ankles and Achilles tendons are loaded. Flat, non-slip, clear floor, sports shoes. Land softly on the ball of the foot then the heel, knees in line. Avoid if you have joint pain.",
  "douleur au genou ou à la cheville, réception instable ou bruyante, vertige, essoufflement anormal.": "pain in the knee or ankle, unstable or noisy landing, dizziness, abnormal breathlessness.",
  "Monte les hanches en serrant les fessiers, pause 1 s en haut.": "Raise your hips while squeezing your glutes, pause 1 s at the top.",
  "Monte haut, pause, redescends lentement. Bord d'une marche si possible.": "Rise high, pause, lower slowly. On the edge of a step if possible.",
  "Position de pompe, mains sous les épaules.": "Push-up position, hands under your shoulders."
 },
 "ar": {
  "Corps droit de la tête aux talons, coudes à 45°. Poitrine près du sol.": "الجسم مستقيم من الرأس إلى الكعبين، المرفقان بزاوية 45°. الصدر قريب من الأرض.",
  "Mains rapprochées sous la poitrine, pouces et index en losange. Coudes près du corps. Exercice avancé : arrête-toi si le poignet ou le coude tire.": "اليدان متقاربتان تحت الصدر، الإبهامان والسبابتان على شكل معين. المرفقان قرب الجسم. تمرين متقدم: توقف إذا شعرت بشد في المعصم أو المرفق.",
  "Poignets et coudes sollicités. Maîtrise d'abord les pompes classiques. Coudes près du corps, poignets alignés, monte progressivement.": "المعصمان والمرفقان مضغوطان. أتقن أولًا الضغط العادي. المرفقان قرب الجسم، المعصمان في خط مستقيم، وتدرّج في الصعود.",
  "douleur au poignet ou au coude, picotements dans les mains.": "ألم في المعصم أو المرفق، وخز في اليدين.",
  "Chaise bloquée contre un mur. Corps droit, poitrine vers le bord de la chaise. Plus la prise est haute, plus c'est facile.": "كرسي مثبّت إلى الحائط. الجسم مستقيم، والصدر نحو حافة الكرسي. كلما ارتفعت يداك كان التمرين أسهل.",
  "Hanches hautes en V inversé. Tête vers le sol entre les mains, puis pousse.": "الوركان مرتفعان على شكل V مقلوب. الرأس نحو الأرض بين اليدين، ثم ادفع.",
  "Épaules, poignets et nuque sollicités. Échauffe épaules et poignets. Dirige la tête vers le sol entre les mains sans la poser et sans forcer sur la nuque.": "الكتفان والمعصمان والرقبة مضغوطة. سخّن الكتفين والمعصمين. وجّه الرأس نحو الأرض بين اليدين دون أن تضعه ودون إجهاد الرقبة.",
  "douleur à l'épaule, au poignet ou à la nuque, vertige.": "ألم في الكتف أو المعصم أو الرقبة، دوار.",
  "Tiens le sac à dos par ses sangles, bras presque tendus. Monte jusqu'à l'horizontale, pas plus haut. Pas d'élan.": "أمسك حقيبة الظهر من حزامها، والذراعان شبه ممدودتين. ارفع حتى الأفقي لا أعلى. دون تأرجح.",
  "Table très stable (teste-la). Corps gainé, tire la poitrine vers le bord.": "طاولة ثابتة جدًا (اختبرها). الجسم مشدود، اسحب الصدر نحو الحافة.",
  "Allongé sur le ventre, lève bras et jambes en même temps, regard au sol. Monte sans cambrer fort, redescends lentement.": "استلقِ على بطنك، ارفع الذراعين والساقين معًا والنظر إلى الأرض. ارتفع دون تقوّس شديد وانزل ببطء.",
  "Bas du dos sollicité. Monte sans cambrer fort ni à-coups, regard au sol, redescends lentement. À éviter en cas de douleur lombaire.": "أسفل الظهر مضغوط. ارتفع دون تقوّس شديد أو حركات مفاجئة، والنظر إلى الأرض، وانزل ببطء. تجنّبه عند وجود ألم في أسفل الظهر.",
  "douleur ou pincement dans le bas du dos.": "ألم أو وخز في أسفل الظهر.",
  "ATTENTION : fixe la serviette à un point TRÈS solide (porte fermée à clé, serviette coincée). Au moindre doute, ne fais pas cet exercice. Tire en serrant les omoplates.": "تنبيه: ثبّت المنشفة في نقطة صلبة جدًا (باب مغلق بالمفتاح، منشفة عالقة). عند أدنى شك لا تقم بهذا التمرين. اسحب مع ضمّ لوحَي الكتف.",
  "Risque de chute si le point d'ancrage cède. Ancre la serviette dans une porte fermée à clé, solide, et teste en tirant doucement avant la série. Au moindre doute, ne fais pas cet exercice.": "خطر السقوط إذا انفلتت نقطة التثبيت. ثبّت المنشفة في باب صلب مغلق بالمفتاح، واختبرها بسحب لطيف قبل المجموعة. عند أدنى شك لا تقم بهذا التمرين.",
  "l'ancrage bouge, douleur à l'épaule ou au dos.": "تحرّك نقطة التثبيت، ألم في الكتف أو الظهر.",
  "Chaise bloquée contre un mur. Descends seulement à 90° aux coudes, épaules loin des oreilles. Exercice avancé : stoppe au moindre pincement à l'épaule.": "كرسي مثبّت إلى الحائط. انزل فقط حتى 90° عند المرفقين، والكتفان بعيدان عن الأذنين. تمرين متقدم: توقف عند أدنى وخز في الكتف.",
  "Épaules et poignets sollicités. Chaise bloquée contre un mur. Descends à 90° aux coudes au maximum, épaules loin des oreilles, dos proche de la chaise.": "الكتفان والمعصمان مضغوطان. كرسي مثبّت إلى الحائط. انزل إلى 90° عند المرفقين كحد أقصى، والكتفان بعيدان عن الأذنين، والظهر قريب من الكرسي.",
  "pincement ou douleur à l'épaule, mains qui s'engourdissent, craquement douloureux.": "وخز أو ألم في الكتف، تنميل في اليدين، طقطقة مؤلمة.",
  "Coudes collés au corps, sac à dos tenu par la sangle. Monte sans balancer le buste, redescends lentement.": "المرفقان ملتصقان بالجسم، وحقيبة الظهر ممسوكة من الحزام. ارفع دون تأرجح الجذع وانزل ببطء.",
  "Coudes sous les épaules, corps aligné, fessiers et ventre serrés. Respire.": "المرفقان تحت الكتفين، الجسم في خط مستقيم، الأرداف والبطن مشدودان. تنفّس.",
  "Dos au sol, genoux fléchis. Décolle seulement les épaules en expirant, sans tirer sur la nuque.": "الظهر على الأرض والركبتان مثنيتان. ارفع الكتفين فقط أثناء الزفير دون شدّ الرقبة.",
  "Mains sous les fessiers, bas du dos plaqué au sol. Descends sans toucher le sol. Si le dos se creuse, fléchis les genoux.": "اليدان تحت الأرداف، وأسفل الظهر ملتصق بالأرض. انزل دون لمس الأرض. إذا تقوّس ظهرك فاثنِ الركبتين.",
  "Bas du dos et hanches sollicités. Bas du dos plaqué au sol, fléchis les genoux si le dos se creuse, descends lentement sans balancer.": "أسفل الظهر والوركان مضغوطان. أبقِ أسفل الظهر على الأرض، اثنِ الركبتين إذا تقوّس الظهر، وانزل ببطء دون تأرجح.",
  "douleur lombaire, tiraillement à l'aine ou à la hanche.": "ألم في أسفل الظهر، شدّ في الفخذ الداخلي أو الورك.",
  "Position de pompe, mains sous les épaules. Ramène un genou vers la poitrine puis alterne. Compte chaque montée de genou.": "وضع الضغط، اليدان تحت الكتفين. قرّب ركبة نحو الصدر ثم بدّل. عدّ كل رفعة ركبة.",
  "Talons au sol, genoux dans l'axe des pieds. Cuisses parallèles au sol.": "الكعبان على الأرض، والركبتان في اتجاه القدمين. الفخذان موازيان للأرض.",
  "Grand pas, buste droit, genou arrière près du sol. Reps par jambe.": "خطوة واسعة، الجذع منتصب، والركبة الخلفية قريبة من الأرض. التكرارات لكل ساق.",
  "Genoux sollicités. Grand pas, genou avant dans l'axe du pied, buste droit, sol antidérapant.": "الركبتان مضغوطتان. خطوة واسعة، الركبة الأمامية في اتجاه القدم، الجذع منتصب، أرض غير زلقة.",
  "douleur au genou, déséquilibre, craquement douloureux.": "ألم في الركبة، فقدان التوازن، طقطقة مؤلمة.",
  "Pied arrière sur une chaise bloquée, buste droit. Descends jusqu'à ce que la cuisse avant soit parallèle au sol. Reps par jambe.": "القدم الخلفية على كرسي مثبّت، الجذع منتصب. انزل حتى يصبح الفخذ الأمامي موازيًا للأرض. التكرارات لكل ساق.",
  "Genou avant et équilibre sollicités. Chaise bloquée contre un mur, appui d'une main sur un mur au début. Genou avant dans l'axe du pied, buste droit.": "الركبة الأمامية والتوازن مضغوطان. كرسي مثبّت إلى الحائط، ضع يدًا على الحائط في البداية. الركبة الأمامية في اتجاه القدم، الجذع منتصب.",
  "douleur au genou avant, perte d'équilibre, chaise qui bouge.": "ألم في الركبة الأمامية، فقدان التوازن، تحرّك الكرسي.",
  "Descends en squat, saute en poussant fort, retombe en douceur sur la pointe puis le talon, genoux fléchis. Exercice avancé : évite si les genoux ou les chevilles te font mal.": "انزل في وضع القرفصاء، اقفز بدفع قوي، وانزل بلطف على مقدمة القدم ثم الكعب، والركبتان مثنيتان. تمرين متقدم: تجنّبه إذا كانت ركبتاك أو كاحلاك تؤلمانك.",
  "Genoux, chevilles et tendons d'Achille sollicités. Sol plat, non glissant et dégagé, chaussures de sport. Réception souple sur la pointe puis le talon, genoux dans l'axe. À éviter en cas de douleur articulaire.": "الركبتان والكاحلان ووتر أخيل مضغوطة. أرض مستوية غير زلقة وخالية، حذاء رياضي. هبوط لطيف على مقدمة القدم ثم الكعب، والركبتان في الاتجاه الصحيح. تجنّبه عند وجود ألم في المفاصل.",
  "douleur au genou ou à la cheville, réception instable ou bruyante, vertige, essoufflement anormal.": "ألم في الركبة أو الكاحل، هبوط غير مستقر أو مدوٍّ، دوار، ضيق تنفس غير عادي.",
  "Monte les hanches en serrant les fessiers, pause 1 s en haut.": "ارفع الوركين مع شدّ الأرداف، وتوقف ثانية في الأعلى.",
  "Monte haut, pause, redescends lentement. Bord d'une marche si possible.": "ارتفع عاليًا، توقف، وانزل ببطء. على حافة درجة إن أمكن.",
  "Position de pompe, mains sous les épaules.": "وضع الضغط، اليدان تحت الكتفين."
 },
 "ma": {
  "Corps droit de la tête aux talons, coudes à 45°. Poitrine près du sol.": "L-jism mstqim mn r-ras l l-3qeb, l-mrafi9 b zawya 45°. S-sder qrib mn l-ard.",
  "Mains rapprochées sous la poitrine, pouces et index en losange. Coudes près du corps. Exercice avancé : arrête-toi si le poignet ou le coude tire.": "Ydin mqarbin ta7t s-sder, l-ibham w s-sabbaba f chekl losange. L-mrafi9 qrab mn j-jism. Tmrin mtaqdem: wa99ef ila b9iti kat tjbed lik l-mi3sem wla l-mirfa9.",
  "Poignets et coudes sollicités. Maîtrise d'abord les pompes classiques. Coudes près du corps, poignets alignés, monte progressivement.": "L-m3asem w l-mrafi9 kay t-3awnou. Tqen l-pompes l-3adiya lwel. L-mrafi9 qrab mn j-jism, l-m3asem f nafs l-khat, w tdarraj.",
  "douleur au poignet ou au coude, picotements dans les mains.": "alam f l-mi3sem wla l-mirfa9, nmnim f l-ydin.",
  "Chaise bloquée contre un mur. Corps droit, poitrine vers le bord de la chaise. Plus la prise est haute, plus c'est facile.": "Kursi mt-bbet 3la l-7it. L-jism mstqim, s-sder nha7iyat 7afat l-kursi. Kol ma tla3o ydin, kol ma kan ashal.",
  "Hanches hautes en V inversé. Tête vers le sol entre les mains, puis pousse.": "L-warek 3alyin f chekl V m9loub. R-ras nha7iyat l-ard bin ydin, mn b3d dfe3.",
  "Épaules, poignets et nuque sollicités. Échauffe épaules et poignets. Dirige la tête vers le sol entre les mains sans la poser et sans forcer sur la nuque.": "L-ktaf, l-m3asem w r-ra9ba kay t-3awnou. S5en l-ktaf w l-m3asem. Wejjeh r-ras nha7iyat l-ard bin ydin bla ma t7to w bla ma t-3ayyef r-ra9ba.",
  "douleur à l'épaule, au poignet ou à la nuque, vertige.": "alam f l-ketf, l-mi3sem wla r-ra9ba, dawkha.",
  "Tiens le sac à dos par ses sangles, bras presque tendus. Monte jusqu'à l'horizontale, pas plus haut. Pas d'élan.": "Mse7 s-sak mn l-7azam dyalo, d-driyi3at tqriban mmdoudin. Rfe3 7ta l-ofoqi, machi ktar. Bla ma tdfe3 b jism.",
  "Table très stable (teste-la). Corps gainé, tire la poitrine vers le bord.": "Tabla tabta bzzaf (jerrebha). L-jism mchdoud, jbed s-sder nha7iyat l-7afa.",
  "Allongé sur le ventre, lève bras et jambes en même temps, regard au sol. Monte sans cambrer fort, redescends lentement.": "Tlla 3la kerrchek, rfe3 d-driyi3at w r-rjlin m3a b3d, l-3in l-l-ard. Tla3 bla ma t-9ews bzzaf, w nzel b-buTe2.",
  "Bas du dos sollicité. Monte sans cambrer fort ni à-coups, regard au sol, redescends lentement. À éviter en cas de douleur lombaire.": "Asfel d-dhar kay t-3awn. Tla3 bla ma t-9ews bzzaf wla b-harkat mfaj2a, l-3in l-l-ard, w nzel b-buTe2. T-jennebo ila kan 3andek alam f asfel d-dhar.",
  "douleur ou pincement dans le bas du dos.": "alam wla 9ors f asfel d-dhar.",
  "ATTENTION : fixe la serviette à un point TRÈS solide (porte fermée à clé, serviette coincée). Au moindre doute, ne fais pas cet exercice. Tire en serrant les omoplates.": "TANBIH: tbbet s-serviette f noqta s-sa3ba bzzaf (bab msdoud b l-clé, serviette 3alqa). F ay chekk, ma dirch had t-tmrin. Jbed w d3em l-ktaf.",
  "Risque de chute si le point d'ancrage cède. Ancre la serviette dans une porte fermée à clé, solide, et teste en tirant doucement avant la série. Au moindre doute, ne fais pas cet exercice.": "Khatar t-t7ayyod ila t7alla l-ankrage. Tbbet s-serviette f bab s-sa3b msdoud b l-clé, w jerreb b jbed khfif qbel s-serie. F ay chekk, ma dirch had t-tmrin.",
  "l'ancrage bouge, douleur à l'épaule ou au dos.": "l-ankrage kay t7errek, alam f l-ketf wla d-dhar.",
  "Chaise bloquée contre un mur. Descends seulement à 90° aux coudes, épaules loin des oreilles. Exercice avancé : stoppe au moindre pincement à l'épaule.": "Kursi mt-bbet 3la l-7it. Nzel ghir 7ta 90° f l-mrafi9, l-ktaf b3id mn l-wdnin. Tmrin mtaqdem: wa99ef f ay 9ors f l-ketf.",
  "Épaules et poignets sollicités. Chaise bloquée contre un mur. Descends à 90° aux coudes au maximum, épaules loin des oreilles, dos proche de la chaise.": "L-ktaf w l-m3asem kay t-3awnou. Kursi mt-bbet 3la l-7it. Nzel 7ta 90° f l-mrafi9 ka7edd a9sa, l-ktaf b3id mn l-wdnin, d-dhar qrib mn l-kursi.",
  "pincement ou douleur à l'épaule, mains qui s'engourdissent, craquement douloureux.": "9ors wla alam f l-ketf, ydin kay ttmenmou, tqarqi3 m2lim.",
  "Coudes collés au corps, sac à dos tenu par la sangle. Monte sans balancer le buste, redescends lentement.": "L-mrafi9 ltaqin b j-jism, s-sak mmsouk mn l-7azam. Tla3 bla ma t-hezz l-jedh3, w nzel b-buTe2.",
  "Coudes sous les épaules, corps aligné, fessiers et ventre serrés. Respire.": "L-mrafi9 ta7t l-ktaf, j-jism f nafs l-khat, l-warek w l-kerch mchdoudin. Tnefes.",
  "Dos au sol, genoux fléchis. Décolle seulement les épaules en expirant, sans tirer sur la nuque.": "D-dhar f l-ard, r-rkab mt-niyin. Rfe3 ghir l-ktaf melli tkherrej n-nafas, bla ma tjbed r-ra9ba.",
  "Mains sous les fessiers, bas du dos plaqué au sol. Descends sans toucher le sol. Si le dos se creuse, fléchis les genoux.": "Ydin ta7t l-warek, asfel d-dhar ltaq b l-ard. Nzel bla ma tlems l-ard. Ila t-9ews d-dhar, tni r-rkab.",
  "Bas du dos et hanches sollicités. Bas du dos plaqué au sol, fléchis les genoux si le dos se creuse, descends lentement sans balancer.": "Asfel d-dhar w l-warek kay t-3awnou. Khalli asfel d-dhar f l-ard, tni r-rkab ila t-9ews d-dhar, nzel b-buTe2 bla ma t-hezz.",
  "douleur lombaire, tiraillement à l'aine ou à la hanche.": "alam f asfel d-dhar, jbad f l-ingha wla l-werk.",
  "Position de pompe, mains sous les épaules. Ramène un genou vers la poitrine puis alterne. Compte chaque montée de genou.": "Wad3iyat pompe, ydin ta7t l-ktaf. Jib rokba nha7iyat s-sder w mn b3d bdel. 3dd koll tla3 d r-rokba.",
  "Talons au sol, genoux dans l'axe des pieds. Cuisses parallèles au sol.": "L-3qeb f l-ard, r-rkab f nafs 7ed l-qdam. L-fkhad mwazyin l-l-ard.",
  "Grand pas, buste droit, genou arrière près du sol. Reps par jambe.": "Khtwa wasa3a, j-jedh3 wa9ef, r-rokba l-wra qriba mn l-ard. L-3awdat l-kol rjl.",
  "Genoux sollicités. Grand pas, genou avant dans l'axe du pied, buste droit, sol antidérapant.": "R-rkab kay t-3awnou. Khtwa wasa3a, r-rokba l-9eddamiya f 7ed l-qdam, j-jedh3 wa9ef, l-ard ma kat-zleqch.",
  "douleur au genou, déséquilibre, craquement douloureux.": "alam f r-rokba, ma 9derch tb9a mtwazen, tqarqi3 m2lim.",
  "Pied arrière sur une chaise bloquée, buste droit. Descends jusqu'à ce que la cuisse avant soit parallèle au sol. Reps par jambe.": "L-qdam l-wra 3la kursi mt-bbet, j-jedh3 wa9ef. Nzel 7ta y-wlli l-fkhed l-9eddami mwazi l-l-ard. L-3awdat l-kol rjl.",
  "Genou avant et équilibre sollicités. Chaise bloquée contre un mur, appui d'une main sur un mur au début. Genou avant dans l'axe du pied, buste droit.": "R-rokba l-9eddamiya w t-twazon kay t-3awnou. Kursi mt-bbet 3la l-7it, 7et yed 3la l-7it f l-bdaya. R-rokba l-9eddamiya f 7ed l-qdam, j-jedh3 wa9ef.",
  "douleur au genou avant, perte d'équilibre, chaise qui bouge.": "alam f r-rokba l-9eddamiya, ma 9derch tb9a mtwazen, l-kursi kay t7errek.",
  "Descends en squat, saute en poussant fort, retombe en douceur sur la pointe puis le talon, genoux fléchis. Exercice avancé : évite si les genoux ou les chevilles te font mal.": "Nzel f squat, nnet b dfe3 qawi, w 7ett b-lotf 3la ras s-sba3 w mn b3d l-3qeb, r-rkab mt-niyin. Tmrin mtaqdem: t-jennebo ila kano r-rkab wla l-k3ab kay t-2lmouk.",
  "Genoux, chevilles et tendons d'Achille sollicités. Sol plat, non glissant et dégagé, chaussures de sport. Réception souple sur la pointe puis le talon, genoux dans l'axe. À éviter en cas de douleur articulaire.": "R-rkab, l-k3ab w watar Achille kay t-3awnou. Ard mstwiya ma kat-zleqch w khawya, sabbat riyadi. 7ett b-lotf 3la ras s-sba3 w mn b3d l-3qeb, r-rkab f l-khat s-s7i7. T-jennebo ila kan 3andek alam f l-mafasel.",
  "douleur au genou ou à la cheville, réception instable ou bruyante, vertige, essoufflement anormal.": "alam f r-rokba wla l-ka3b, 7ott ma tabet wla m-3ayyet, dawkha, d-dyq n-nafas ghir 3adi.",
  "Monte les hanches en serrant les fessiers, pause 1 s en haut.": "Rfe3 l-warek w nti 3la l-warek, wa99ef tanya foq.",
  "Monte haut, pause, redescends lentement. Bord d'une marche si possible.": "Tla3 3ali, wa99ef, w nzel b-buTe2. 3la 7afat derja ila mmkin.",
  "Position de pompe, mains sous les épaules.": "Wad3iyat pompe, ydin ta7t l-ktaf."
 }
};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { LANG_DATA[l].w[k] = X[l][k]; }); });
  var Y = {"en": {"Échauffement": "Warm-up", "Pause": "Pause", "Quitter": "Quit", "Passer": "Skip", "Fermer": "Close", "Commencer": "Begin", "Commencer maintenant": "Begin now", "Prépare-toi": "Get ready", "Reprendre": "Resume", "Terminé": "Done", "Confirmer": "Confirm", "Arrêter ici": "Stop here", "secondes": "seconds", "minutes": "minutes", "répétitions": "reps", "séries": "sets", "secondes à tenir": "seconds to hold", "Le coach": "The coach", "Séance terminée": "Workout finished", "Séance interrompue": "Workout interrupted", "Exercice terminé": "Exercise finished", "Fais tes répétitions, puis valide.": "Do your reps, then confirm.", "Répétitions réussies (corrige si besoin)": "Reps completed (correct if needed)", "Dix secondes. Ne lâche pas.": "Ten seconds. Don't give up.", "Tiens. Moitié.": "Hold on. Halfway.", "Sauts légers sur place": "Light jumps in place", "Jambes et bras écartés": "Legs and arms apart", "Sauts légers": "Light jumps"}, "ar": {"Échauffement": "الإحماء", "Pause": "إيقاف مؤقت", "Quitter": "خروج", "Passer": "تخطّي", "Fermer": "إغلاق", "Commencer": "ابدأ", "Commencer maintenant": "ابدأ الآن", "Prépare-toi": "استعد", "Reprendre": "استئناف", "Terminé": "انتهى", "Confirmer": "تأكيد", "Arrêter ici": "التوقف هنا", "secondes": "ثوانٍ", "minutes": "دقائق", "répétitions": "تكرارات", "séries": "مجموعات", "secondes à tenir": "ثوانٍ للثبات", "Le coach": "المدرب", "Séance terminée": "انتهى التمرين", "Séance interrompue": "تم إيقاف التمرين", "Exercice terminé": "انتهى التمرين", "Fais tes répétitions, puis valide.": "أنجز تكراراتك ثم أكّد.", "Répétitions réussies (corrige si besoin)": "التكرارات المنجزة (صحّح إن لزم)", "Dix secondes. Ne lâche pas.": "عشر ثوانٍ. لا تستسلم.", "Tiens. Moitié.": "اثبت. نصف المدة.", "Sauts légers sur place": "قفزات خفيفة في المكان", "Jambes et bras écartés": "الساقان والذراعان متباعدتان", "Sauts légers": "قفزات خفيفة"}, "ma": {"Échauffement": "Skhana", "Pause": "Pause", "Quitter": "Khrouj", "Passer": "Fouta", "Fermer": "Sedd", "Commencer": "Bda", "Commencer maintenant": "Bda daba", "Prépare-toi": "7ddar rassek", "Reprendre": "Kemmel", "Terminé": "Kmel", "Confirmer": "2akked", "Arrêter ici": "Wa99ef hna", "secondes": "tawani", "minutes": "d9ayeq", "répétitions": "3awdat", "séries": "series", "secondes à tenir": "tawani bach tbqa tabet", "Le coach": "Coach", "Séance terminée": "S-seance kmlat", "Séance interrompue": "S-seance twa99fat", "Exercice terminé": "T-tmrin kmel", "Fais tes répétitions, puis valide.": "Dir l-3awdat dyalek, mn b3d 2akked.", "Répétitions réussies (corrige si besoin)": "L-3awdat li dar-ti (s7i7 ila khass)", "Dix secondes. Ne lâche pas.": "3chr tawani. Ma t7ebbesch.", "Tiens. Moitié.": "Tbet. N-nuss.", "Sauts légers sur place": "N-nat khfifa f nafs l-blasa", "Jambes et bras écartés": "Rjlin w ydin mfrqin", "Sauts légers": "N-nat khfifa"}};
  Object.keys(Y).forEach(function (l) { if (LANG_DATA[l]) Object.keys(Y[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = Y[l][k]; }); });
})();
/* © KVES · Coach-Mass-KVES */
/* ====================== 13.4 : page Sources, messages du coach, fin de séance, partage (EN, AR, darija) · à faire relire avant le public ====================== */
(function () {
  var X = {
 "en": {
  "Sources et limites": "Sources and limits",
  "D'où viennent les repères": "Where the guidelines come from",
  "Renforcement musculaire": "Muscle strengthening",
  "Au moins 2 jours par semaine sur les grands groupes musculaires (OMS, Lignes directrices sur l'activité physique et la sédentarité, 2020). L'application propose 3 séances.": "At least 2 days a week on the major muscle groups (WHO, Guidelines on physical activity and sedentary behaviour, 2020). The app offers 3 workouts.",
  "Progression": "Progression",
  "Augmenter la difficulté quand toutes les séries sont réussies (American College of Sports Medicine, Position Stand « Progression models in resistance training for healthy adults », 2009).": "Increase the difficulty when all sets are completed (American College of Sports Medicine, Position Stand “Progression models in resistance training for healthy adults”, 2009).",
  "Protéines": "Protein",
  "Environ 1,6 g par kg et par jour suffisent en général pour gagner du muscle en s'entraînant, jusqu'à 2,2 g/kg selon les cas (Morton et coll., British Journal of Sports Medicine, 2018). La cible de 135 g correspond à 1,7 à 1,8 g/kg pour 75 à 80 kg.": "About 1.6 g per kg per day is generally enough to gain muscle when training, up to 2.2 g/kg in some cases (Morton et al., British Journal of Sports Medicine, 2018). The 135 g target equals 1.7 to 1.8 g/kg for 75 to 80 kg.",
  "Sommeil": "Sleep",
  "Sept heures ou plus par nuit pour un adulte (Watson et coll., consensus AASM et SRS, Journal of Clinical Sleep Medicine, 2015).": "Seven hours or more per night for an adult (Watson et al., AASM and SRS consensus, Journal of Clinical Sleep Medicine, 2015).",
  "Calories": "Calories",
  "Besoins estimés avec l'équation de Mifflin-St Jeor (Mifflin et coll., American Journal of Clinical Nutrition, 1990), multipliés par 1,4 (activité légère). Perte de poids : déficit limité à 500 kcal ou 20 %, avec un plancher de 1 500 kcal (homme), 1 200 kcal (femme) et 1 350 kcal (non précisé). C'est une estimation : ajuste avec ton poids.": "Needs estimated with the Mifflin-St Jeor equation (Mifflin et al., American Journal of Clinical Nutrition, 1990), multiplied by 1.4 (light activity). Weight loss: deficit limited to 500 kcal or 20%, with a floor of 1,500 kcal (male), 1,200 kcal (female) and 1,350 kcal (unspecified). This is an estimate: adjust with your weight.",
  "Rythme de prise de poids": "Pace of weight gain",
  "Un gain lent de l'ordre de 0,25 à 0,5 kg par semaine est un repère courant pour limiter la prise de graisse.": "A slow gain of about 0.25 to 0.5 kg per week is a common guideline to limit fat gain.",
  "Limites et prudence": "Limits and caution",
  "Ce programme est un repère général pour un adulte en bonne santé. Il ne remplace ni un médecin, ni un coach, ni un diététicien.": "This program is a general guideline for a healthy adult. It does not replace a doctor, a coach or a dietitian.",
  "Consulte un médecin avant de commencer si tu as une maladie cardiaque, de l'hypertension, du diabète, une blessure, une douleur au thorax, ou un doute.": "See a doctor before starting if you have heart disease, high blood pressure, diabetes, an injury, chest pain, or any doubt.",
  "Arrête l'exercice en cas de douleur vive, de vertige, de malaise ou d'essoufflement anormal.": "Stop exercising in case of sharp pain, dizziness, discomfort or abnormal breathlessness.",
  "Les repas sont des exemples avec des valeurs indicatives. Ils ne tiennent pas compte des allergies, des intolérances ni des régimes médicaux.": "Meals are examples with indicative values. They do not take allergies, intolerances or medical diets into account.",
  "Les exercices avancés (pompes diamant, dips, squat sauté) sollicitent davantage les articulations : passe au niveau suivant seulement si le précédent est maîtrisé.": "Advanced exercises (diamond push-ups, dips, jump squats) put more load on the joints: move to the next level only if the previous one is mastered.",
  "Le tabac réduit l'endurance et ralentit la récupération. Pour arrêter, un médecin ou un service d'aide à l'arrêt peut t'accompagner.": "Tobacco reduces endurance and slows recovery. To quit, a doctor or a quit-smoking service can support you.",
  "Les résultats varient d'une personne à l'autre et ne sont pas garantis. L'application est prévue pour les adultes (18 ans et plus).": "Results vary from person to person and are not guaranteed. The app is meant for adults (18 and over).",
  "Exercices à risque": "Higher-risk exercises",
  "Ces exercices demandent plus d'attention. Ils portent aussi un encadré « Précautions » dans l'onglet Séance.": "These exercises need more attention. They also carry a “Precautions” box in the Workout tab.",
  "Arrête-toi si :": "Stop if:",
  "Tes données": "Your data",
  "Elles restent sur ton téléphone. Aucun serveur ne les reçoit. Seuls les avis que tu envoies toi-même sont transmis, chiffrés.": "They stay on your phone. No server receives them. Only the feedback you send yourself is transmitted, encrypted.",
  "Bilan du matin": "Morning check-in",
  "Séance faite": "Workout done",
  "Séance allégée": "Light workout",
  "Jour de séance": "Workout day",
  "Séance manquée": "Missed workout",
  "Jour de récupération": "Recovery day",
  "Bilan du jour. Sommeil, énergie, poids si c'est dimanche. Deux minutes, maintenant.": "Daily check-in. Sleep, energy, weight if it's Sunday. Two minutes, now.",
  "Séance validée et repas presque complets. Bien. Dors tes 7 heures.": "Workout validated and meals almost complete. Good. Get your 7 hours of sleep.",
  "Tu as peu dormi ou peu d'énergie. Séance allégée aujourd'hui, mais elle est faite. Une série en moins, pas d'excuses.": "You slept little or have little energy. Light workout today, but it gets done. One set fewer, no excuses.",
  "Aujourd'hui, séance. Une heure, pas de négociation. Lance-la quand tu es prêt.": "Today, workout. One hour, no negotiation. Start when you are ready.",
  "C'est jour de séance. Mange ta collation, mets tes écouteurs et commence.": "It's workout day. Eat your snack, put in your earphones and start.",
  "Récupération. 30 minutes de marche, tes 5 repas, 2,5 litres d'eau. Rien de plus, rien de moins.": "Recovery. 30 minutes of walking, your 5 meals, 2.5 liters of water. Nothing more, nothing less.",
  "Pas de séance. Le muscle se construit maintenant : mange, bois, dors.": "No workout. Muscle is built now: eat, drink, sleep.",
  "Enregistré dans l'historique (libre)": "Saved in the history (free)",
  "Séance incomplète enregistrée": "Incomplete workout saved",
  "Séance validée": "Workout validated",
  "Tu passes au niveau supérieur": "You are moving up a level",
  "Exercice interrompu": "Exercise interrupted",
  "Bien joué. Une série de plus chaque semaine, c'est comme ça qu'on progresse.": "Well done. One more set each week, that is how you progress.",
  "Tu as arrêté en route. La prochaine fois, tu vas au bout.": "You stopped along the way. Next time, you go all the way.",
  "Mange dans l'heure, hydrate-toi, dors tes 7 heures. La séance ne compte que si la récupération suit.": "Eat within the hour, hydrate, sleep your 7 hours. The workout only counts if recovery follows.",
  "lundi": "Monday",
  "mardi": "Tuesday",
  "mercredi": "Wednesday",
  "jeudi": "Thursday",
  "vendredi": "Friday",
  "samedi": "Saturday",
  "dimanche": "Sunday",
  "Coach-Mass-KVES : ton coach de musculation à la maison. Séances guidées à la voix, repas adaptés à ton objectif, suivi du poids et des mensurations. Sans matériel, hors ligne, 100 % privé.": "Coach-Mass-KVES: your home bodyweight coach. Voice-guided workouts, meals adapted to your goal, weight and measurement tracking. No equipment, offline, 100% private."
 },
 "ar": {
  "Sources et limites": "المصادر والحدود",
  "D'où viennent les repères": "من أين تأتي المراجع",
  "Renforcement musculaire": "تقوية العضلات",
  "Au moins 2 jours par semaine sur les grands groupes musculaires (OMS, Lignes directrices sur l'activité physique et la sédentarité, 2020). L'application propose 3 séances.": "يومان على الأقل في الأسبوع لمجموعات العضلات الكبرى (منظمة الصحة العالمية، توجيهات النشاط البدني والخمول، 2020). يقترح التطبيق 3 حصص.",
  "Progression": "التدرج",
  "Augmenter la difficulté quand toutes les séries sont réussies (American College of Sports Medicine, Position Stand « Progression models in resistance training for healthy adults », 2009).": "زِد الصعوبة عندما تنجز كل المجموعات (الكلية الأمريكية للطب الرياضي، موقف رسمي «نماذج التدرج في تدريب المقاومة للبالغين الأصحاء»، 2009).",
  "Protéines": "البروتين",
  "Environ 1,6 g par kg et par jour suffisent en général pour gagner du muscle en s'entraînant, jusqu'à 2,2 g/kg selon les cas (Morton et coll., British Journal of Sports Medicine, 2018). La cible de 135 g correspond à 1,7 à 1,8 g/kg pour 75 à 80 kg.": "حوالي 1.6 غ لكل كغ في اليوم تكفي عمومًا لبناء العضلات مع التمرين، وحتى 2.2 غ/كغ حسب الحالات (Morton وآخرون، المجلة البريطانية للطب الرياضي، 2018). هدف 135 غ يعادل 1.7 إلى 1.8 غ/كغ لوزن 75 إلى 80 كغ.",
  "Sommeil": "النوم",
  "Sept heures ou plus par nuit pour un adulte (Watson et coll., consensus AASM et SRS, Journal of Clinical Sleep Medicine, 2015).": "سبع ساعات أو أكثر في الليلة للبالغ (Watson وآخرون، إجماع AASM وSRS، Journal of Clinical Sleep Medicine، 2015).",
  "Calories": "السعرات",
  "Besoins estimés avec l'équation de Mifflin-St Jeor (Mifflin et coll., American Journal of Clinical Nutrition, 1990), multipliés par 1,4 (activité légère). Perte de poids : déficit limité à 500 kcal ou 20 %, avec un plancher de 1 500 kcal (homme), 1 200 kcal (femme) et 1 350 kcal (non précisé). C'est une estimation : ajuste avec ton poids.": "تُقدَّر الاحتياجات بمعادلة Mifflin-St Jeor (Mifflin وآخرون، American Journal of Clinical Nutrition، 1990) مضروبة في 1.4 (نشاط خفيف). إنقاص الوزن: عجز محدود بـ500 سعرة أو 20%، مع حد أدنى 1500 سعرة (رجل) و1200 (امرأة) و1350 (غير محدد). هذا تقدير: عدّله بحسب وزنك.",
  "Rythme de prise de poids": "وتيرة زيادة الوزن",
  "Un gain lent de l'ordre de 0,25 à 0,5 kg par semaine est un repère courant pour limiter la prise de graisse.": "زيادة بطيئة بحدود 0.25 إلى 0.5 كغ في الأسبوع مرجع شائع للحد من اكتساب الدهون.",
  "Limites et prudence": "الحدود والحذر",
  "Ce programme est un repère général pour un adulte en bonne santé. Il ne remplace ni un médecin, ni un coach, ni un diététicien.": "هذا البرنامج مرجع عام لشخص بالغ يتمتع بصحة جيدة. لا يغني عن الطبيب أو المدرب أو أخصائي التغذية.",
  "Consulte un médecin avant de commencer si tu as une maladie cardiaque, de l'hypertension, du diabète, une blessure, une douleur au thorax, ou un doute.": "استشر طبيبًا قبل البدء إذا كان لديك مرض في القلب أو ارتفاع في الضغط أو سكري أو إصابة أو ألم في الصدر أو أي شك.",
  "Arrête l'exercice en cas de douleur vive, de vertige, de malaise ou d'essoufflement anormal.": "أوقف التمرين عند ألم حاد أو دوار أو وعكة أو ضيق تنفس غير عادي.",
  "Les repas sont des exemples avec des valeurs indicatives. Ils ne tiennent pas compte des allergies, des intolérances ni des régimes médicaux.": "الوجبات أمثلة بقيم تقريبية. لا تراعي الحساسية ولا عدم التحمل ولا الأنظمة الطبية.",
  "Les exercices avancés (pompes diamant, dips, squat sauté) sollicitent davantage les articulations : passe au niveau suivant seulement si le précédent est maîtrisé.": "التمارين المتقدمة (ضغط الألماس، الغطس، القرفصاء القفز) تضغط أكثر على المفاصل: انتقل إلى المستوى التالي فقط إذا أتقنت السابق.",
  "Le tabac réduit l'endurance et ralentit la récupération. Pour arrêter, un médecin ou un service d'aide à l'arrêt peut t'accompagner.": "التبغ يقلل التحمل ويبطئ التعافي. للإقلاع، يمكن لطبيب أو لخدمة مساعدة على الإقلاع أن ترافقك.",
  "Les résultats varient d'une personne à l'autre et ne sont pas garantis. L'application est prévue pour les adultes (18 ans et plus).": "تختلف النتائج من شخص لآخر وليست مضمونة. التطبيق مخصص للبالغين (18 سنة فأكثر).",
  "Exercices à risque": "التمارين الأعلى خطورة",
  "Ces exercices demandent plus d'attention. Ils portent aussi un encadré « Précautions » dans l'onglet Séance.": "هذه التمارين تتطلب انتباهًا أكبر. وفيها أيضًا إطار «احتياطات» في تبويب التمرين.",
  "Arrête-toi si :": "توقف إذا:",
  "Tes données": "بياناتك",
  "Elles restent sur ton téléphone. Aucun serveur ne les reçoit. Seuls les avis que tu envoies toi-même sont transmis, chiffrés.": "تبقى على هاتفك. لا يستقبلها أي خادم. فقط الآراء التي ترسلها بنفسك تُنقل مشفّرة.",
  "Bilan du matin": "حصيلة الصباح",
  "Séance faite": "التمرين منجز",
  "Séance allégée": "تمرين مخفف",
  "Jour de séance": "يوم تمرين",
  "Séance manquée": "تمرين فائت",
  "Jour de récupération": "يوم تعافٍ",
  "Bilan du jour. Sommeil, énergie, poids si c'est dimanche. Deux minutes, maintenant.": "حصيلة اليوم. النوم والطاقة والوزن إن كان الأحد. دقيقتان، الآن.",
  "Séance validée et repas presque complets. Bien. Dors tes 7 heures.": "تم اعتماد التمرين والوجبات شبه مكتملة. جيد. نم سبع ساعات.",
  "Tu as peu dormi ou peu d'énergie. Séance allégée aujourd'hui, mais elle est faite. Une série en moins, pas d'excuses.": "نمت قليلًا أو طاقتك ضعيفة. تمرين مخفف اليوم لكنه يُنجز. مجموعة أقل دون أعذار.",
  "Aujourd'hui, séance. Une heure, pas de négociation. Lance-la quand tu es prêt.": "اليوم تمرين. ساعة واحدة دون مفاوضات. ابدأ عندما تكون جاهزًا.",
  "C'est jour de séance. Mange ta collation, mets tes écouteurs et commence.": "اليوم يوم تمرين. تناول وجبتك الخفيفة وضع سماعاتك وابدأ.",
  "Récupération. 30 minutes de marche, tes 5 repas, 2,5 litres d'eau. Rien de plus, rien de moins.": "تعافٍ. 30 دقيقة مشي، وجباتك الخمس، 2.5 لتر ماء. لا أكثر ولا أقل.",
  "Pas de séance. Le muscle se construit maintenant : mange, bois, dors.": "لا تمرين. العضلة تُبنى الآن: كل، اشرب، نم.",
  "Enregistré dans l'historique (libre)": "تم الحفظ في السجل (حر)",
  "Séance incomplète enregistrée": "تم حفظ تمرين غير مكتمل",
  "Séance validée": "تم اعتماد التمرين",
  "Tu passes au niveau supérieur": "ترتقي إلى مستوى أعلى",
  "Exercice interrompu": "تم إيقاف التمرين",
  "Bien joué. Une série de plus chaque semaine, c'est comme ça qu'on progresse.": "أحسنت. مجموعة إضافية كل أسبوع، هكذا يكون التقدم.",
  "Tu as arrêté en route. La prochaine fois, tu vas au bout.": "توقفت في منتصف الطريق. في المرة القادمة ستكمل حتى النهاية.",
  "Mange dans l'heure, hydrate-toi, dors tes 7 heures. La séance ne compte que si la récupération suit.": "كل خلال ساعة، اشرب الماء، نم سبع ساعات. لا يُحتسب التمرين إلا إذا تبعه التعافي.",
  "lundi": "الإثنين",
  "mardi": "الثلاثاء",
  "mercredi": "الأربعاء",
  "jeudi": "الخميس",
  "vendredi": "الجمعة",
  "samedi": "السبت",
  "dimanche": "الأحد",
  "Coach-Mass-KVES : ton coach de musculation à la maison. Séances guidées à la voix, repas adaptés à ton objectif, suivi du poids et des mensurations. Sans matériel, hors ligne, 100 % privé.": "Coach-Mass-KVES: مدربك للياقة في البيت. حصص بإرشاد صوتي، ووجبات تناسب هدفك، وتتبع للوزن والقياسات. دون معدات، دون إنترنت، وخصوصية 100%."
 },
 "ma": {
  "Sources et limites": "L-masadir w l-7doud",
  "D'où viennent les repères": "Mnin jaw l-marji3at",
  "Renforcement musculaire": "Taqwiyat l-3adalat",
  "Au moins 2 jours par semaine sur les grands groupes musculaires (OMS, Lignes directrices sur l'activité physique et la sédentarité, 2020). L'application propose 3 séances.": "3la l9ell jouj d l-iyam f s-simana l-majmou3at l-3adaliya l-kbira (OMS, Lignes directrices sur l'activité physique et la sédentarité, 2020). L-application kat9tre7 3 d s-seances.",
  "Progression": "Tdarroj",
  "Augmenter la difficulté quand toutes les séries sont réussies (American College of Sports Medicine, Position Stand « Progression models in resistance training for healthy adults », 2009).": "Zid s-so3ouba melli tkmel koll s-series (American College of Sports Medicine, Position Stand « Progression models in resistance training for healthy adults », 2009).",
  "Protéines": "L-protéines",
  "Environ 1,6 g par kg et par jour suffisent en général pour gagner du muscle en s'entraînant, jusqu'à 2,2 g/kg selon les cas (Morton et coll., British Journal of Sports Medicine, 2018). La cible de 135 g correspond à 1,7 à 1,8 g/kg pour 75 à 80 kg.": "7ewali 1,6 g l kol kg f nhar kafya f l-3ada bach tzid l3adal m3a t-tmrin, 7ta 2,2 g/kg 7sab l-7alat (Morton et coll., British Journal of Sports Medicine, 2018). L-hadaf d 135 g kay3adel 1,7 l 1,8 g/kg l 75 l 80 kg.",
  "Sommeil": "Nnoum",
  "Sept heures ou plus par nuit pour un adulte (Watson et coll., consensus AASM et SRS, Journal of Clinical Sleep Medicine, 2015).": "Sb3a d s-sa3at wla ktar f l-lil l-kbir (Watson et coll., consensus AASM w SRS, Journal of Clinical Sleep Medicine, 2015).",
  "Calories": "L-calories",
  "Besoins estimés avec l'équation de Mifflin-St Jeor (Mifflin et coll., American Journal of Clinical Nutrition, 1990), multipliés par 1,4 (activité légère). Perte de poids : déficit limité à 500 kcal ou 20 %, avec un plancher de 1 500 kcal (homme), 1 200 kcal (femme) et 1 350 kcal (non précisé). C'est une estimation : ajuste avec ton poids.": "L-7ajat kat t9dar b m3adala d Mifflin-St Jeor (Mifflin et coll., American Journal of Clinical Nutrition, 1990), m-d3fa b 1,4 (nachat khfif). Nqass d l-wazn: l-3ajz m7dod f 500 kcal wla 20 %, m3a 7edd adna d 1 500 kcal (rajel), 1 200 kcal (mra) w 1 350 kcal (ma tbaynch). Hada t9dir: 3dlo b l-wazn dyalek.",
  "Rythme de prise de poids": "Iqa3 tzyad l-wazn",
  "Un gain lent de l'ordre de 0,25 à 0,5 kg par semaine est un repère courant pour limiter la prise de graisse.": "Tzyad bti2 d 7ewali 0,25 l 0,5 kg f s-simana howa marji3 m3ruf bach n9ellel tzyad d d-dhn.",
  "Limites et prudence": "L-7doud w l-7ada",
  "Ce programme est un repère général pour un adulte en bonne santé. Il ne remplace ni un médecin, ni un coach, ni un diététicien.": "Had l-programme howa marji3 3am l-kbir sa7i. Ma kay3awedch tbib, ma coach, ma diététicien.",
  "Consulte un médecin avant de commencer si tu as une maladie cardiaque, de l'hypertension, du diabète, une blessure, une douleur au thorax, ou un doute.": "Chouf tbib qbel ma tbda ila kan 3andek merd l-qalb, d-dght l-3ali, s-soukkar, jar7, alam f s-sder, wla ay chekk.",
  "Arrête l'exercice en cas de douleur vive, de vertige, de malaise ou d'essoufflement anormal.": "Wa99ef t-tmrin ila kan alam 9wi, dawkha, malaise wla d-dyq n-nafas ghir 3adi.",
  "Les repas sont des exemples avec des valeurs indicatives. Ils ne tiennent pas compte des allergies, des intolérances ni des régimes médicaux.": "L-wajabat hiya ghir mital b qiyam t9ribiya. Ma kat7sebch l-7assasiya, l-intolérances wla r-régimes tibbiya.",
  "Les exercices avancés (pompes diamant, dips, squat sauté) sollicitent davantage les articulations : passe au niveau suivant seulement si le précédent est maîtrisé.": "T-tmarin l-mtaqddma (pompes diamant, dips, squat m3a n-nat) kay t-3awnou ktar l-mafasel: douz l l-mustawa j-jay ghir ila tqenti li 9bel.",
  "Le tabac réduit l'endurance et ralentit la récupération. Pour arrêter, un médecin ou un service d'aide à l'arrêt peut t'accompagner.": "Duxan kay n9es t-t7mmol w kay bti2 r-recupération. Bach twa99ef, tbib wla service d l-mousa3ada y9der y3awnek.",
  "Les résultats varient d'une personne à l'autre et ne sont pas garantis. L'application est prévue pour les adultes (18 ans et plus).": "N-nata2ij kat khtalef mn wa7ed l wa7ed w ma d-manach. L-application mkhssssa l-kbar (18 3am wla ktar).",
  "Exercices à risque": "T-tmarin l-khatira",
  "Ces exercices demandent plus d'attention. Ils portent aussi un encadré « Précautions » dans l'onglet Séance.": "Had t-tmarin kat7tej ktar ntibah. 3ndhom 7ta cadre « L-i7tiyatat » f onglet Tmrin.",
  "Arrête-toi si :": "Wa99ef ila:",
  "Tes données": "L-ma3lomat dyalek",
  "Elles restent sur ton téléphone. Aucun serveur ne les reçoit. Seuls les avis que tu envoies toi-même sont transmis, chiffrés.": "Kay b9aw f t-tilifon dyalek. Ma kayn 7ta serveur kay tsslemhom. Ghir l-ara2 li katsift nta b rassek kayt-sifto, mcheffrin.",
  "Bilan du matin": "Bilan dyal sbah",
  "Séance faite": "S-seance tdart",
  "Séance allégée": "S-seance khfifa",
  "Jour de séance": "Nhar d s-seance",
  "Séance manquée": "S-seance fatet",
  "Jour de récupération": "Nhar d r-recupération",
  "Bilan du jour. Sommeil, énergie, poids si c'est dimanche. Deux minutes, maintenant.": "Bilan dyal lyoum. Nnoum, t-taqa, l-wazn ila kan l-had. D9i9tin, daba.",
  "Séance validée et repas presque complets. Bien. Dors tes 7 heures.": "S-seance tsa77at w l-wajabat t9riban kamlin. Mzyan. Nam 7 d s-sa3at.",
  "Tu as peu dormi ou peu d'énergie. Séance allégée aujourd'hui, mais elle est faite. Une série en moins, pas d'excuses.": "Nmti 9lil wla t-taqa dyalek d3ifa. S-seance khfifa lyoum, walakin ghadi tdar. Serie a9ell, bla 3dar.",
  "Aujourd'hui, séance. Une heure, pas de négociation. Lance-la quand tu es prêt.": "Lyoum, seance. Sa3a wa7da, bla mfawadat. Bda melli tkoun wajed.",
  "C'est jour de séance. Mange ta collation, mets tes écouteurs et commence.": "Lyoum nhar d s-seance. Kol l-collation dyalek, 7et l-couteurs w bda.",
  "Récupération. 30 minutes de marche, tes 5 repas, 2,5 litres d'eau. Rien de plus, rien de moins.": "Récupération. 30 d9i9a d l-mchi, 5 d l-wajabat, 2,5 litr d l-ma. La ktar la a9ell.",
  "Pas de séance. Le muscle se construit maintenant : mange, bois, dors.": "Ma kayn seance. L-3adala kat tebna daba: kol, chrab, nam.",
  "Enregistré dans l'historique (libre)": "Tsjjel f t-tarikh (7orr)",
  "Séance incomplète enregistrée": "S-seance ghir kamla tsjjlat",
  "Séance validée": "S-seance tsa77at",
  "Tu passes au niveau supérieur": "Ghadi douz l mustawa a3la",
  "Exercice interrompu": "T-tmrin twa99ef",
  "Bien joué. Une série de plus chaque semaine, c'est comme ça qu'on progresse.": "Mzyan. Serie zayda koll simana, hakka kayt9eddem l-wa7ed.",
  "Tu as arrêté en route. La prochaine fois, tu vas au bout.": "Wa99eft f t-triq. L-merra j-jaya ghadi tkemmel l-lekhr.",
  "Mange dans l'heure, hydrate-toi, dors tes 7 heures. La séance ne compte que si la récupération suit.": "Kol f s-sa3a, chrab l-ma, nam 7 d s-sa3at. S-seance ma kat7seb ila ma tb3athach r-récupération.",
  "lundi": "tnin",
  "mardi": "tlata",
  "mercredi": "larba3",
  "jeudi": "khmis",
  "vendredi": "jem3a",
  "samedi": "sebt",
  "dimanche": "l-had",
  "Coach-Mass-KVES : ton coach de musculation à la maison. Séances guidées à la voix, repas adaptés à ton objectif, suivi du poids et des mensurations. Sans matériel, hors ligne, 100 % privé.": "Coach-Mass-KVES: coach dyalek d l-musculation f d-dar. Seances b s-sout, wajabat m-3awda 3la l-hadaf dyalek, tbe3 l-wazn w l-9yasat. Bla matériel, bla internet, 100 % khass."
 }
};
  var Q = {
 "en": [
  [
   "Le coach · {1}",
   "Coach · {1}"
  ],
  [
   "Séance validée. Maintenant tu manges : il te reste environ {1} kcal. Ne saute rien.",
   "Workout validated. Now you eat: about {1} kcal left. Skip nothing."
  ],
  [
   "Séance validée. Il te reste environ {1} kcal à manger aujourd'hui : ni plus, ni moins.",
   "Workout validated. You have about {1} kcal left to eat today: no more, no less."
  ],
  [
   "Tu as raté {1} séance cette semaine. Rattrape-en une aujourd'hui si tu es en forme. Sinon, tiens la prochaine sans faute.",
   "You missed {1} workout this week. Catch one up today if you feel fit. Otherwise, hold the next one without fail."
  ],
  [
   "Tu as raté {1} séances cette semaine. Rattrape-en une aujourd'hui si tu es en forme. Sinon, tiens la prochaine sans faute.",
   "You missed {1} workouts this week. Catch one up today if you feel fit. Otherwise, hold the next one without fail."
  ],
  [
   "Exercice {1}/{2} · série {3}/{4}",
   "Exercise {1}/{2} · set {3}/{4}"
  ],
  [
   "Vise {1} {2} (minimum {3})",
   "Aim for {1} {2} (minimum {3})"
  ],
  [
   "Vise {1} {2}",
   "Aim for {1} {2}"
  ],
  [
   "Ensuite : série {1} · {2}",
   "Next: set {1} · {2}"
  ],
  [
   "Ensuite : {1}",
   "Next: {1}"
  ],
  [
   "{1} : objectif augmenté",
   "{1}: target raised"
  ],
  [
   "{1} minutes. Maintenant, tu manges.",
   "{1} minutes. Now you eat."
  ]
 ],
 "ar": [
  [
   "Le coach · {1}",
   "المدرب · {1}"
  ],
  [
   "Séance validée. Maintenant tu manges : il te reste environ {1} kcal. Ne saute rien.",
   "تم اعتماد التمرين. الآن تأكل: بقي حوالي {1} سعرة. لا تتخطَّ شيئًا."
  ],
  [
   "Séance validée. Il te reste environ {1} kcal à manger aujourd'hui : ni plus, ni moins.",
   "تم اعتماد التمرين. بقي لك حوالي {1} سعرة لتأكلها اليوم: لا أكثر ولا أقل."
  ],
  [
   "Tu as raté {1} séance cette semaine. Rattrape-en une aujourd'hui si tu es en forme. Sinon, tiens la prochaine sans faute.",
   "فاتتك {1} حصة هذا الأسبوع. عوّض واحدة اليوم إن كنت بحال جيدة. وإلا فلا تفوّت القادمة."
  ],
  [
   "Tu as raté {1} séances cette semaine. Rattrape-en une aujourd'hui si tu es en forme. Sinon, tiens la prochaine sans faute.",
   "فاتتك {1} حصص هذا الأسبوع. عوّض واحدة اليوم إن كنت بحال جيدة. وإلا فلا تفوّت القادمة."
  ],
  [
   "Exercice {1}/{2} · série {3}/{4}",
   "التمرين {1}/{2} · المجموعة {3}/{4}"
  ],
  [
   "Vise {1} {2} (minimum {3})",
   "استهدف {1} {2} (الحد الأدنى {3})"
  ],
  [
   "Vise {1} {2}",
   "استهدف {1} {2}"
  ],
  [
   "Ensuite : série {1} · {2}",
   "بعد ذلك: المجموعة {1} · {2}"
  ],
  [
   "Ensuite : {1}",
   "بعد ذلك: {1}"
  ],
  [
   "{1} : objectif augmenté",
   "{1}: تم رفع الهدف"
  ],
  [
   "{1} minutes. Maintenant, tu manges.",
   "{1} دقيقة. الآن تأكل."
  ]
 ],
 "ma": [
  [
   "Le coach · {1}",
   "Coach · {1}"
  ],
  [
   "Séance validée. Maintenant tu manges : il te reste environ {1} kcal. Ne saute rien.",
   "S-seance tsa77at. Daba kat akol: b9a lik 7ewali {1} kcal. Ma t-fouti walou."
  ],
  [
   "Séance validée. Il te reste environ {1} kcal à manger aujourd'hui : ni plus, ni moins.",
   "S-seance tsa77at. B9a lik 7ewali {1} kcal bach takol lyoum: la ktar la a9ell."
  ],
  [
   "Tu as raté {1} séance cette semaine. Rattrape-en une aujourd'hui si tu es en forme. Sinon, tiens la prochaine sans faute.",
   "Fatek {1} seance had s-simana. 3awwed wa7da lyoum ila kont mzyan. Ila la, ma t-fouthach l-jaya."
  ],
  [
   "Tu as raté {1} séances cette semaine. Rattrape-en une aujourd'hui si tu es en forme. Sinon, tiens la prochaine sans faute.",
   "Fatek {1} d s-seances had s-simana. 3awwed wa7da lyoum ila kont mzyan. Ila la, ma t-fouthach l-jaya."
  ],
  [
   "Exercice {1}/{2} · série {3}/{4}",
   "Tmrin {1}/{2} · serie {3}/{4}"
  ],
  [
   "Vise {1} {2} (minimum {3})",
   "7awel {1} {2} (3la l9ell {3})"
  ],
  [
   "Vise {1} {2}",
   "7awel {1} {2}"
  ],
  [
   "Ensuite : série {1} · {2}",
   "Mn b3d: serie {1} · {2}"
  ],
  [
   "Ensuite : {1}",
   "Mn b3d: {1}"
  ],
  [
   "{1} : objectif augmenté",
   "{1}: l-hadaf tzad"
  ],
  [
   "{1} minutes. Maintenant, tu manges.",
   "{1} d9ayeq. Daba kat akol."
  ]
 ]
};
  Object.keys(X).forEach(function (l) { if (!LANG_DATA[l]) return; Object.keys(X[l]).forEach(function (k) { LANG_DATA[l].w[k] = X[l][k]; }); });
  var Z = {"en": {"Rotations des épaules et des hanches": "Shoulder and hip rotations", "Rotations des épaules": "Shoulder rotations", "10 squats lents, sans effort": "10 slow squats, no strain", "10 pompes lentes, mains sur une table": "10 slow push-ups, hands on a table", "Poitrine près de la chaise": "Chest close to the chair", "Bras à l'horizontale": "Arms horizontal", "Poitrine au bord": "Chest at the edge", "Bras et jambes levés": "Arms and legs raised", "Coudes en arrière": "Elbows back", "Coudes à 90°": "Elbows at 90°", "Bras fléchi": "Arm bent", "Épaules décollées": "Shoulders lifted", "Jambes à la verticale": "Legs vertical", "Genou vers la poitrine": "Knee toward chest", "Bas de la fente": "Bottom of the lunge", "Cuisse avant parallèle": "Front thigh parallel", "Sur les pointes": "On tiptoes", "Bras bas": "Arms down", "Bras hauts": "Arms up", "Bas": "Bottom", "Pieds joints": "Feet together", "À éviter : hanches basses": "Avoid: low hips", "Haut": "Top"}, "ar": {"Rotations des épaules et des hanches": "دوران الكتفين والوركين", "Rotations des épaules": "دوران الكتفين", "10 squats lents, sans effort": "10 قرفصاء بطيئة دون جهد", "10 pompes lentes, mains sur une table": "10 ضغطات بطيئة، اليدان على طاولة", "Poitrine près de la chaise": "الصدر قرب الكرسي", "Bras à l'horizontale": "الذراعان أفقيتان", "Poitrine au bord": "الصدر عند الحافة", "Bras et jambes levés": "الذراعان والساقان مرفوعة", "Coudes en arrière": "المرفقان إلى الخلف", "Coudes à 90°": "المرفقان بزاوية 90°", "Bras fléchi": "الذراع مثنية", "Épaules décollées": "الكتفان مرفوعان", "Jambes à la verticale": "الساقان عموديتان", "Genou vers la poitrine": "الركبة نحو الصدر", "Bas de la fente": "أسفل الطعنة", "Cuisse avant parallèle": "الفخذ الأمامي موازٍ", "Sur les pointes": "على رؤوس الأصابع", "Bras bas": "الذراعان إلى الأسفل", "Bras hauts": "الذراعان إلى الأعلى", "Bas": "أسفل", "Pieds joints": "القدمان متلاصقتان", "À éviter : hanches basses": "تجنّب: الوركان المنخفضان", "Haut": "أعلى"}, "ma": {"Rotations des épaules et des hanches": "Dawran l-ktaf w l-warek", "Rotations des épaules": "Dawran l-ktaf", "10 squats lents, sans effort": "10 squats b-buTe2, bla ma t-3ayyef", "10 pompes lentes, mains sur une table": "10 pompes b-buTe2, ydin 3la tabla", "Poitrine près de la chaise": "S-sder qrib mn l-kursi", "Bras à l'horizontale": "D-driyi3at ofoqiyin", "Poitrine au bord": "S-sder f l-7afa", "Bras et jambes levés": "D-driyi3at w r-rjlin mrfou3in", "Coudes en arrière": "L-mrafi9 l l-wra", "Coudes à 90°": "L-mrafi9 f 90°", "Bras fléchi": "Yed mtniya", "Épaules décollées": "L-ktaf mrfou3in", "Jambes à la verticale": "Rjlin 3amoudiyin", "Genou vers la poitrine": "R-rokba nha7iyat s-sder", "Bas de la fente": "T-ta7t dyal fente", "Cuisse avant parallèle": "L-fkhed l-9eddami mwazi", "Sur les pointes": "3la ras s-sba3", "Bras bas": "Ydin l-ta7t", "Bras hauts": "Ydin foq", "Bas": "Ta7t", "Pieds joints": "L-qdam mjm3in", "À éviter : hanches basses": "T-jennebo: l-warek hbatin", "Haut": "Foq"}};
  Object.keys(Z).forEach(function (l) { if (LANG_DATA[l]) Object.keys(Z[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = Z[l][k]; }); });
  Object.keys(Q).forEach(function (l) { if (LANG_DATA[l]) Q[l].slice().reverse().forEach(function (x) { LANG_DATA[l].p.unshift({ re: PT(x[0], '').re, en: x[1] }); }); });
})();
/* © KVES · Coach-Mass-KVES */
/* ====================== 13.5 : lecteur de musique (EN, AR, darija) · à faire relire ====================== */
(function () {
  var X = {
 "en": {
  "Lecteur": "Player",
  "Ma musique": "My music",
  "Choisis des fichiers audio de ton téléphone (MP3, M4A…). Ils ne sont ni copiés ni envoyés. À la prochaine ouverture de l'application, il faudra les choisir de nouveau.": "Choose audio files from your phone (MP3, M4A…). They are neither copied nor sent. The next time you open the app, you will need to choose them again.",
  "Choisir mes musiques": "Choose my music",
  "En lecture": "Now playing",
  "Rien en lecture": "Nothing playing",
  "Aucun morceau choisi.": "No track chosen.",
  "Précédent": "Previous",
  "Suivant": "Next",
  "Lecture": "Play",
  "Position": "Position",
  "Volume": "Volume",
  "Aléatoire : oui": "Shuffle: on",
  "Aléatoire : non": "Shuffle: off",
  "Répétition : aucune": "Repeat: off",
  "Répétition : toute la liste": "Repeat: all",
  "Répétition : un morceau": "Repeat: one track",
  "Vider la liste": "Clear the list",
  "Lecteur de musique": "Music player",
  "Écoute la musique de ton téléphone (MP3, M4A). Rien n'est copié ni envoyé.": "Listen to the music on your phone (MP3, M4A). Nothing is copied or sent.",
  "Ouvrir le lecteur": "Open the player",
  "Aucun fichier audio reconnu.": "No audio file recognised.",
  "Lecture impossible : touche Lecture.": "Playback failed: tap Play."
 },
 "ar": {
  "Lecteur": "المشغّل",
  "Ma musique": "موسيقاي",
  "Choisis des fichiers audio de ton téléphone (MP3, M4A…). Ils ne sont ni copiés ni envoyés. À la prochaine ouverture de l'application, il faudra les choisir de nouveau.": "اختر ملفات صوتية من هاتفك (MP3، M4A…). لا تُنسخ ولا تُرسل. عند فتح التطبيق مرة أخرى ستحتاج إلى اختيارها من جديد.",
  "Choisir mes musiques": "اختيار موسيقاي",
  "En lecture": "قيد التشغيل",
  "Rien en lecture": "لا شيء قيد التشغيل",
  "Aucun morceau choisi.": "لم يتم اختيار أي مقطع.",
  "Précédent": "السابق",
  "Suivant": "التالي",
  "Lecture": "تشغيل",
  "Position": "الموضع",
  "Volume": "الصوت",
  "Aléatoire : oui": "عشوائي: نعم",
  "Aléatoire : non": "عشوائي: لا",
  "Répétition : aucune": "التكرار: بلا",
  "Répétition : toute la liste": "التكرار: كل القائمة",
  "Répétition : un morceau": "التكرار: مقطع واحد",
  "Vider la liste": "إفراغ القائمة",
  "Lecteur de musique": "مشغّل الموسيقى",
  "Écoute la musique de ton téléphone (MP3, M4A). Rien n'est copié ni envoyé.": "استمع إلى موسيقى هاتفك (MP3، M4A). لا يُنسخ ولا يُرسل شيء.",
  "Ouvrir le lecteur": "فتح المشغّل",
  "Aucun fichier audio reconnu.": "لم يُتعرَّف على أي ملف صوتي.",
  "Lecture impossible : touche Lecture.": "تعذّر التشغيل: المس تشغيل."
 },
 "ma": {
  "Lecteur": "Lecteur",
  "Ma musique": "L-mousiqa dyali",
  "Choisis des fichiers audio de ton téléphone (MP3, M4A…). Ils ne sont ni copiés ni envoyés. À la prochaine ouverture de l'application, il faudra les choisir de nouveau.": "Khtar fichiers audio mn t-tilifon dyalek (MP3, M4A…). Ma kay tnsakhou w ma kay tsifto. F l-merra j-jaya li kat fta7 l-application, khassek t-khtarhom mn jdid.",
  "Choisir mes musiques": "Khtar l-mousiqa dyali",
  "En lecture": "Kat tkhdem daba",
  "Rien en lecture": "Walou kay tkhdem",
  "Aucun morceau choisi.": "Ma khtarti 7ta ghnia.",
  "Précédent": "L-li 9bel",
  "Suivant": "L-li moura",
  "Lecture": "Chghel",
  "Position": "L-blasa",
  "Volume": "S-sout",
  "Aléatoire : oui": "3chwa2i: iyyeh",
  "Aléatoire : non": "3chwa2i: la",
  "Répétition : aucune": "Tikrar: walou",
  "Répétition : toute la liste": "Tikrar: l-lista kamla",
  "Répétition : un morceau": "Tikrar: ghnia wa7da",
  "Vider la liste": "Khwi l-lista",
  "Lecteur de musique": "Lecteur d l-mousiqa",
  "Écoute la musique de ton téléphone (MP3, M4A). Rien n'est copié ni envoyé.": "Sme3 l-mousiqa li f t-tilifon dyalek (MP3, M4A). Ma kayn walou kaytnsakh wla kaytsift.",
  "Ouvrir le lecteur": "Fta7 l-lecteur",
  "Aucun fichier audio reconnu.": "Ma tl9a 7ta fichier audio.",
  "Lecture impossible : touche Lecture.": "Ma khdemch: dghat 3la Chghel."
 }
};
  var Q = {
 "en": [
  [
   "{1} morceau(x) ajouté(s).",
   "{1} track(s) added."
  ],
  [
   "{1} morceau(x)",
   "{1} track(s)"
  ],
  [
   "Fichier illisible : {1}",
   "Unreadable file: {1}"
  ]
 ],
 "ar": [
  [
   "{1} morceau(x) ajouté(s).",
   "تمت إضافة {1} مقطع."
  ],
  [
   "{1} morceau(x)",
   "{1} مقطع"
  ],
  [
   "Fichier illisible : {1}",
   "ملف غير قابل للقراءة: {1}"
  ]
 ],
 "ma": [
  [
   "{1} morceau(x) ajouté(s).",
   "Tzadou {1} d l-ghnaya."
  ],
  [
   "{1} morceau(x)",
   "{1} d l-ghnaya"
  ],
  [
   "Fichier illisible : {1}",
   "Fichier ma tqrach: {1}"
  ]
 ]
};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { LANG_DATA[l].w[k] = X[l][k]; }); });
  var Y = {"en": {". Le fichier protège de tout, même d'un téléphone perdu. La clé du propriétaire se sauvegarde à part (Plus > Espace propriétaire).": ". The file protects against everything, even a lost phone. The owner's key is backed up separately (More > Owner area).", "Dis-moi ce qui marche, ce qui manque, ce qui te gêne. Ton message est chiffré avant de quitter ton téléphone.": "Tell me what works, what is missing, what bothers you. Your message is encrypted before it leaves your phone.", "Ton avis": "Your feedback", "Ton nom": "Your name", "Ton e-mail (pour te répondre)": "Your e-mail (so I can reply)", "Idée": "Idea", "Problème": "Problem", "Ton message": "Your message", "J'accepte que le propriétaire lise mon nom, mon e-mail et mon message pour me répondre et améliorer l'application. Ces informations sont chiffrées avec l'avis.": "I agree that the owner reads my name, e-mail and message to reply to me and improve the app. This information is encrypted with the feedback.", "Préparer l'envoi": "Prepare to send", "Tu choisis ensuite toi-même comment l'envoyer (partage, e-mail, messagerie). Ton identité n'est pas vérifiée.": "You then choose yourself how to send it (share, e-mail, messaging). Your identity is not verified."}, "ar": {". Le fichier protège de tout, même d'un téléphone perdu. La clé du propriétaire se sauvegarde à part (Plus > Espace propriétaire).": ". الملف يحميك من كل شيء حتى من ضياع الهاتف. يُحفظ مفتاح المالك على حدة (المزيد > فضاء المالك).", "Dis-moi ce qui marche, ce qui manque, ce qui te gêne. Ton message est chiffré avant de quitter ton téléphone.": "قل لي ما الذي يعمل وما الذي ينقص وما الذي يزعجك. تُشفَّر رسالتك قبل أن تغادر هاتفك.", "Ton avis": "رأيك", "Ton nom": "اسمك", "Ton e-mail (pour te répondre)": "بريدك الإلكتروني (للرد عليك)", "Idée": "فكرة", "Problème": "مشكلة", "Ton message": "رسالتك", "J'accepte que le propriétaire lise mon nom, mon e-mail et mon message pour me répondre et améliorer l'application. Ces informations sont chiffrées avec l'avis.": "أوافق على أن يقرأ المالك اسمي وبريدي ورسالتي للرد علي وتحسين التطبيق. هذه المعلومات مشفّرة مع الرأي.", "Préparer l'envoi": "تحضير الإرسال", "Tu choisis ensuite toi-même comment l'envoyer (partage, e-mail, messagerie). Ton identité n'est pas vérifiée.": "ثم تختار بنفسك طريقة الإرسال (مشاركة، بريد، رسائل). لا يتم التحقق من هويتك."}, "ma": {". Le fichier protège de tout, même d'un téléphone perdu. La clé du propriétaire se sauvegarde à part (Plus > Espace propriétaire).": ". L-fichier kay 7mik mn koulchi, 7ta mn tilifon d-dayea3. Mfta7 mol l-application kay t-sjjel b 7dou (Ktar > Espace d mol l-application).", "Dis-moi ce qui marche, ce qui manque, ce qui te gêne. Ton message est chiffré avant de quitter ton téléphone.": "9ol liya ach khddam, ach nqss, ach kayz3ejek. R-risala dyalek kat-cheffer qbel ma tkhroj mn t-tilifon dyalek.", "Ton avis": "R-ray dyalek", "Ton nom": "Smitek", "Ton e-mail (pour te répondre)": "E-mail dyalek (bach njawbek)", "Idée": "Fekra", "Problème": "Mochkil", "Ton message": "Risalatek", "J'accepte que le propriétaire lise mon nom, mon e-mail et mon message pour me répondre et améliorer l'application. Ces informations sont chiffrées avec l'avis.": "Kan wafeq bli mol l-application y9ra smiti, e-mail dyali w risalti bach yjawbni w y7essen l-application. Had l-ma3lomat mcheffrin m3a r-ray.", "Préparer l'envoi": "7ddar l-irsal", "Tu choisis ensuite toi-même comment l'envoyer (partage, e-mail, messagerie). Ton identité n'est pas vérifiée.": "Mn b3d nta li katkhtar kifach tsifto (partage, e-mail, messagerie). L-hawiya dyalek ma kat t2kkedch."}};
  Object.keys(Y).forEach(function (l) { if (LANG_DATA[l]) Object.keys(Y[l]).forEach(function (k) { LANG_DATA[l].w[k] = Y[l][k]; }); });
  Object.keys(Q).forEach(function (l) { if (LANG_DATA[l]) Q[l].slice().reverse().forEach(function (x) { LANG_DATA[l].p.push({ re: PT(x[0], '').re, en: x[1] }); }); });
})();

(function(){
  var X = {"en": {"Avertissement santé": "Health warning", "Coach-Mass-KVES est un outil d'entraînement et de suivi à usage personnel. Ce n'est pas un dispositif médical et il ne remplace pas l'avis d'un médecin, d'un kinésithérapeute ou d'un diététicien.": "Coach-Mass-KVES is a personal training and tracking tool. It is not a medical device and does not replace the advice of a doctor, physiotherapist or dietitian.", "Avant de commencer": "Before you start", "Si tu as une maladie (cœur, tension, articulations, dos, diabète…), une blessure, ou si tu es sous traitement, demande l'avis d'un médecin avant de t'entraîner ou de changer ton alimentation.": "If you have an illness (heart, blood pressure, joints, back, diabetes…), an injury, or you are on treatment, ask a doctor before training or changing your diet.", "Si tu fumes, si tu as été longtemps sédentaire ou si tu reprends le sport, commence doucement. Le coach te le rappellera, mais c'est à toi de t'écouter.": "If you smoke, have been inactive for a long time or are returning to sport, start gently. The coach will remind you, but it is up to you to listen to your body.", "Cette application est destinée aux adultes (18 ans et plus). Elle n'est pas faite pour les femmes enceintes sans avis médical.": "This app is for adults (18 and over). It is not meant for pregnant women without medical advice.", "Pendant l'entraînement": "During training", "Arrête immédiatement en cas de douleur vive, vertige, malaise, gêne dans la poitrine, essoufflement anormal ou douleur articulaire. Ne « force » pas à travers une douleur.": "Stop immediately if you feel sharp pain, dizziness, faintness, chest discomfort, abnormal breathlessness or joint pain. Do not push through pain.", "Échauffe-toi toujours. Respecte les temps de repos.": "Always warm up. Respect the rest times.", "Les exercices marqués « à risque » demandent une attention particulière : lis les précautions avant de les lancer.": "Exercises marked \"at risk\" need special care: read the precautions before starting them.", "En cas de symptôme grave, appelle les secours (au Maroc : 15 pour le SAMU, 150 pour la Protection civile).": "In case of a serious symptom, call emergency services (in Morocco: 15 for SAMU, 150 for Civil Protection).", "Alimentation et poids": "Diet and weight", "Les calories et protéines proposées sont des estimations générales calculées à partir de ce que tu saisis. Elles ne tiennent pas compte de ton état de santé.": "The calories and proteins shown are general estimates calculated from what you enter. They do not take your health condition into account.", "L'application ne propose pas de régime en dessous d'un seuil de sécurité, et ne remplace pas un suivi nutritionnel.": "The app does not propose a diet below a safety threshold, and does not replace nutritional follow-up.", "Responsabilité": "Responsibility", "Tu t'entraînes sous ta propre responsabilité. Les auteurs ne peuvent pas être tenus responsables d'une blessure ou d'un problème de santé lié à l'usage de l'application, dans la mesure permise par la loi.": "You train at your own risk. The authors cannot be held liable for an injury or health problem linked to using the app, to the extent permitted by law.", "Politique de confidentialité": "Privacy policy", "En bref : tes données restent sur ton téléphone. Nous n'avons pas de serveur, pas de compte, pas de publicité, pas de traceur.": "In short: your data stays on your phone. We have no server, no account, no advertising, no tracker.", "Quelles données ?": "Which data?", "Ton profil (âge, taille, poids, objectif, régime, allergies déclarées), tes séances, tes mesures, tes réglages.": "Your profile (age, height, weight, goal, diet, declared allergies), your sessions, your measurements, your settings.", "Ces données peuvent concerner ta santé : elles sont donc sensibles. Tu les saisis volontairement.": "This data can relate to your health, so it is sensitive. You enter it voluntarily.", "Où sont-elles ?": "Where is it stored?", "Uniquement dans le stockage local de ton navigateur/appli (sur ton appareil). Elles ne sont envoyées nulle part automatiquement.": "Only in the local storage of your browser/app (on your device). Nothing is sent anywhere automatically.", "Si tu supprimes les données du site ou désinstalles l'application, elles disparaissent, sauf si tu as fait une sauvegarde.": "If you delete the site data or uninstall the app, it disappears, unless you made a backup.", "Ce que tu choisis de partager": "What you choose to share", "Sauvegarde : le fichier est créé sur ton appareil. Tu décides où le ranger. Il n'est pas chiffré à ce stade : garde-le en lieu sûr.": "Backup: the file is created on your device. You decide where to keep it. It is not encrypted at this stage: keep it in a safe place.", "Lien/QR de partage : il contient les informations que tu choisis de partager. Toute personne qui a le lien peut les lire.": "Share link/QR: it contains the information you choose to share. Anyone who has the link can read it.", "Boîte à avis : ton message est chiffré de bout en bout avec la clé publique du propriétaire. Seul le propriétaire peut le lire. Ne mets pas d'informations de santé ou personnelles dont tu n'as pas besoin.": "Feedback box: your message is end-to-end encrypted with the owner's public key. Only the owner can read it. Do not include health or personal information you do not need to.", "Rappels / calendrier (.ics) : le fichier est créé sur ton appareil, puis traité par ton application de calendrier.": "Reminders / calendar (.ics): the file is created on your device, then handled by your calendar app.", "Musique": "Music", "Les fichiers audio que tu choisis restent sur ton appareil. Ils ne sont ni copiés ni envoyés.": "The audio files you choose stay on your device. They are neither copied nor sent.", "Hébergement": "Hosting", "L'application est hébergée sur GitHub Pages. GitHub peut enregistrer des données techniques de connexion (adresse IP, par exemple) selon sa propre politique. L'application elle-même n'y envoie rien.": "The app is hosted on GitHub Pages. GitHub may record technical connection data (an IP address, for example) under its own policy. The app itself sends nothing there.", "Tes droits": "Your rights", "Accès, modification, suppression : tout se fait dans l'application (Réglages > Données). Tu peux tout effacer à tout moment.": "Access, correction, deletion: everything is done in the app (Settings > Data). You can erase everything at any time.", "Pour une question ou une demande : utilise la boîte à avis.": "For a question or request: use the feedback box.", "Cadre légal": "Legal framework", "Loi marocaine 09-08 sur la protection des données personnelles (CNDP) et, pour les utilisateurs concernés, RGPD.": "Moroccan law 09-08 on personal data protection (CNDP) and, for users concerned, the GDPR.", "Mineurs : l'application est réservée aux 18 ans et plus.": "Minors: the app is reserved for people aged 18 and over.", "Changements : cette politique peut évoluer. La date de dernière mise à jour est indiquée en bas de page.": "Changes: this policy may change. The date of the last update is shown at the bottom of the page.", "Conditions d'utilisation": "Terms of use", "Objet : Coach-Mass-KVES est une application gratuite de coaching sportif et de suivi, © KVES.": "Purpose: Coach-Mass-KVES is a free sports coaching and tracking app, © KVES.", "Usage : personnel et non commercial. Tu dois avoir 18 ans ou plus.": "Use: personal and non-commercial. You must be 18 or over.", "Santé : tu as lu l'avertissement santé et tu t'entraînes sous ta responsabilité.": "Health: you have read the health warning and you train at your own risk.", "Pas de garantie : l'application est fournie « telle quelle », sans promesse de résultat (prise de poids, de muscle) ni de disponibilité continue. Les résultats dépendent de toi, de ton alimentation, de ton sommeil et de ta santé.": "No warranty: the app is provided \"as is\", with no promise of results (weight or muscle gain) or continuous availability. Results depend on you, your diet, your sleep and your health.", "Données : tu es responsable de tes sauvegardes. Les données sont locales (voir la politique de confidentialité).": "Data: you are responsible for your backups. Data is local (see the privacy policy).", "Contenus : textes, illustrations, logo, nom et signature KVES sont protégés. Copie et redistribution interdites sans accord, sauf licence indiquée.": "Content: texts, illustrations, logo, name and KVES signature are protected. Copying and redistribution are forbidden without permission, unless a licence says otherwise.", "Conduite : n'essaie pas de détourner l'application ni de nuire à d'autres utilisateurs (par exemple via la boîte à avis).": "Conduct: do not try to misuse the app or harm other users (for example through the feedback box).", "Évolution : l'application peut changer ou s'arrêter. Les conditions peuvent être mises à jour, la version en vigueur est celle affichée dans l'application.": "Changes: the app may change or stop. These terms may be updated; the version in force is the one shown in the app.", "Droit applicable : droit marocain. Tribunaux compétents : Casablanca.": "Governing law: Moroccan law. Competent courts: Casablanca.", "Contact : via la boîte à avis.": "Contact: via the feedback box.", "Légal": "Legal", "Avertissement santé, confidentialité et conditions d'utilisation.": "Health warning, privacy and terms of use.", "Dernière mise à jour : 19 novembre 2026": "Last updated: 19 November 2026", "Brouillon à faire relire par un professionnel avant publication publique.": "Draft to be reviewed by a professional before public release.", "J'ai lu l'avertissement santé et les conditions d'utilisation (Plus > Légal).": "I have read the health warning and the terms of use (More > Legal).", "Coche la case pour confirmer que tu as lu l'avertissement santé.": "Tick the box to confirm you have read the health warning."}, "ar": {"Avertissement santé": "تنبيه صحي", "Coach-Mass-KVES est un outil d'entraînement et de suivi à usage personnel. Ce n'est pas un dispositif médical et il ne remplace pas l'avis d'un médecin, d'un kinésithérapeute ou d'un diététicien.": "Coach-Mass-KVES أداة تدريب ومتابعة للاستعمال الشخصي. ليست جهازا طبيا ولا تغني عن رأي الطبيب أو أخصائي العلاج الطبيعي أو أخصائي التغذية.", "Avant de commencer": "قبل البدء", "Si tu as une maladie (cœur, tension, articulations, dos, diabète…), une blessure, ou si tu es sous traitement, demande l'avis d'un médecin avant de t'entraîner ou de changer ton alimentation.": "إذا كنت تعاني من مرض (القلب، الضغط، المفاصل، الظهر، السكري…) أو إصابة أو تتناول علاجا، فاسأل طبيبا قبل التمرين أو تغيير نظامك الغذائي.", "Si tu fumes, si tu as été longtemps sédentaire ou si tu reprends le sport, commence doucement. Le coach te le rappellera, mais c'est à toi de t'écouter.": "إذا كنت تدخن أو كنت خاملا لفترة طويلة أو تعود إلى الرياضة، فابدأ بهدوء. سيذكّرك المدرب، لكن عليك أن تنصت لجسمك.", "Cette application est destinée aux adultes (18 ans et plus). Elle n'est pas faite pour les femmes enceintes sans avis médical.": "هذا التطبيق موجه للبالغين (18 سنة فما فوق). ليس مخصصا للحوامل دون رأي طبي.", "Pendant l'entraînement": "أثناء التمرين", "Arrête immédiatement en cas de douleur vive, vertige, malaise, gêne dans la poitrine, essoufflement anormal ou douleur articulaire. Ne « force » pas à travers une douleur.": "توقف فورا عند ألم حاد أو دوار أو إغماء أو ضيق في الصدر أو ضيق تنفس غير عادي أو ألم في المفاصل. لا تتحمل الألم بالقوة.", "Échauffe-toi toujours. Respecte les temps de repos.": "سخّن جسمك دائما. احترم أوقات الراحة.", "Les exercices marqués « à risque » demandent une attention particulière : lis les précautions avant de les lancer.": "التمارين المعلَّمة «خطرة» تتطلب انتباها خاصا: اقرأ الاحتياطات قبل بدئها.", "En cas de symptôme grave, appelle les secours (au Maroc : 15 pour le SAMU, 150 pour la Protection civile).": "في حالة أعراض خطيرة، اتصل بالإسعاف (في المغرب: 15 للسامو، 150 للوقاية المدنية).", "Alimentation et poids": "التغذية والوزن", "Les calories et protéines proposées sont des estimations générales calculées à partir de ce que tu saisis. Elles ne tiennent pas compte de ton état de santé.": "السعرات والبروتينات المقترحة تقديرات عامة محسوبة مما تدخله. لا تأخذ حالتك الصحية بعين الاعتبار.", "L'application ne propose pas de régime en dessous d'un seuil de sécurité, et ne remplace pas un suivi nutritionnel.": "لا يقترح التطبيق نظاما غذائيا تحت حد الأمان، ولا يغني عن متابعة غذائية.", "Responsabilité": "المسؤولية", "Tu t'entraînes sous ta propre responsabilité. Les auteurs ne peuvent pas être tenus responsables d'une blessure ou d'un problème de santé lié à l'usage de l'application, dans la mesure permise par la loi.": "تتمرن على مسؤوليتك الخاصة. لا يتحمل المؤلفون مسؤولية أي إصابة أو مشكل صحي مرتبط باستعمال التطبيق، في حدود ما يسمح به القانون.", "Politique de confidentialité": "سياسة الخصوصية", "En bref : tes données restent sur ton téléphone. Nous n'avons pas de serveur, pas de compte, pas de publicité, pas de traceur.": "باختصار: بياناتك تبقى في هاتفك. لا خادم ولا حساب ولا إعلانات ولا متتبعات.", "Quelles données ?": "أي بيانات؟", "Ton profil (âge, taille, poids, objectif, régime, allergies déclarées), tes séances, tes mesures, tes réglages.": "ملفك (العمر، الطول، الوزن، الهدف، النظام الغذائي، الحساسية المصرح بها)، حصصك، قياساتك، إعداداتك.", "Ces données peuvent concerner ta santé : elles sont donc sensibles. Tu les saisis volontairement.": "قد تتعلق هذه البيانات بصحتك، لذلك فهي حساسة. أنت تدخلها طوعا.", "Où sont-elles ?": "أين توجد؟", "Uniquement dans le stockage local de ton navigateur/appli (sur ton appareil). Elles ne sont envoyées nulle part automatiquement.": "فقط في التخزين المحلي لمتصفحك/تطبيقك (على جهازك). لا يُرسل شيء إلى أي مكان تلقائيا.", "Si tu supprimes les données du site ou désinstalles l'application, elles disparaissent, sauf si tu as fait une sauvegarde.": "إذا حذفت بيانات الموقع أو ألغيت تثبيت التطبيق فستختفي، ما لم تكن قد أنجزت نسخة احتياطية.", "Ce que tu choisis de partager": "ما تختار مشاركته", "Sauvegarde : le fichier est créé sur ton appareil. Tu décides où le ranger. Il n'est pas chiffré à ce stade : garde-le en lieu sûr.": "النسخة الاحتياطية: يُنشأ الملف على جهازك وأنت تقرر أين تحفظه. هو غير مشفر في هذه المرحلة: احتفظ به في مكان آمن.", "Lien/QR de partage : il contient les informations que tu choisis de partager. Toute personne qui a le lien peut les lire.": "رابط/رمز QR للمشاركة: يحتوي على المعلومات التي تختار مشاركتها. يمكن لأي شخص يملك الرابط قراءتها.", "Boîte à avis : ton message est chiffré de bout en bout avec la clé publique du propriétaire. Seul le propriétaire peut le lire. Ne mets pas d'informations de santé ou personnelles dont tu n'as pas besoin.": "صندوق الآراء: رسالتك مشفرة من الطرف إلى الطرف بالمفتاح العام للمالك. وحده المالك يستطيع قراءتها. لا تضع معلومات صحية أو شخصية لا حاجة لها.", "Rappels / calendrier (.ics) : le fichier est créé sur ton appareil, puis traité par ton application de calendrier.": "التذكيرات / التقويم (.ics): يُنشأ الملف على جهازك ثم يعالجه تطبيق التقويم لديك.", "Musique": "الموسيقى", "Les fichiers audio que tu choisis restent sur ton appareil. Ils ne sont ni copiés ni envoyés.": "الملفات الصوتية التي تختارها تبقى على جهازك. لا تُنسخ ولا تُرسل.", "Hébergement": "الاستضافة", "L'application est hébergée sur GitHub Pages. GitHub peut enregistrer des données techniques de connexion (adresse IP, par exemple) selon sa propre politique. L'application elle-même n'y envoie rien.": "التطبيق مستضاف على GitHub Pages. قد يسجل GitHub بيانات اتصال تقنية (مثل عنوان IP) وفق سياسته الخاصة. التطبيق نفسه لا يرسل إليه شيئا.", "Tes droits": "حقوقك", "Accès, modification, suppression : tout se fait dans l'application (Réglages > Données). Tu peux tout effacer à tout moment.": "الاطلاع والتعديل والحذف: كل شيء يتم داخل التطبيق (الإعدادات > البيانات). يمكنك مسح كل شيء في أي وقت.", "Pour une question ou une demande : utilise la boîte à avis.": "لسؤال أو طلب: استعمل صندوق الآراء.", "Cadre légal": "الإطار القانوني", "Loi marocaine 09-08 sur la protection des données personnelles (CNDP) et, pour les utilisateurs concernés, RGPD.": "القانون المغربي 09-08 المتعلق بحماية المعطيات الشخصية (CNDP)، وبالنسبة للمستخدمين المعنيين، اللائحة الأوروبية GDPR.", "Mineurs : l'application est réservée aux 18 ans et plus.": "القاصرون: التطبيق مخصص لمن بلغ 18 سنة فما فوق.", "Changements : cette politique peut évoluer. La date de dernière mise à jour est indiquée en bas de page.": "التغييرات: قد تتطور هذه السياسة. تاريخ آخر تحديث مذكور أسفل الصفحة.", "Conditions d'utilisation": "شروط الاستعمال", "Objet : Coach-Mass-KVES est une application gratuite de coaching sportif et de suivi, © KVES.": "الموضوع: Coach-Mass-KVES تطبيق مجاني للتدريب الرياضي والمتابعة، © KVES.", "Usage : personnel et non commercial. Tu dois avoir 18 ans ou plus.": "الاستعمال: شخصي وغير تجاري. يجب أن يكون عمرك 18 سنة أو أكثر.", "Santé : tu as lu l'avertissement santé et tu t'entraînes sous ta responsabilité.": "الصحة: قرأت التنبيه الصحي وتتمرن على مسؤوليتك.", "Pas de garantie : l'application est fournie « telle quelle », sans promesse de résultat (prise de poids, de muscle) ni de disponibilité continue. Les résultats dépendent de toi, de ton alimentation, de ton sommeil et de ta santé.": "لا ضمان: يُقدَّم التطبيق «كما هو» دون وعد بنتيجة (زيادة الوزن أو العضلات) أو بتوفر دائم. النتائج تعتمد عليك وعلى غذائك ونومك وصحتك.", "Données : tu es responsable de tes sauvegardes. Les données sont locales (voir la politique de confidentialité).": "البيانات: أنت مسؤول عن نسخك الاحتياطية. البيانات محلية (انظر سياسة الخصوصية).", "Contenus : textes, illustrations, logo, nom et signature KVES sont protégés. Copie et redistribution interdites sans accord, sauf licence indiquée.": "المحتوى: النصوص والرسوم والشعار والاسم وتوقيع KVES محمية. النسخ وإعادة التوزيع ممنوعان دون إذن، إلا إذا نصت رخصة على غير ذلك.", "Conduite : n'essaie pas de détourner l'application ni de nuire à d'autres utilisateurs (par exemple via la boîte à avis).": "السلوك: لا تحاول إساءة استعمال التطبيق أو الإضرار بمستخدمين آخرين (مثلا عبر صندوق الآراء).", "Évolution : l'application peut changer ou s'arrêter. Les conditions peuvent être mises à jour, la version en vigueur est celle affichée dans l'application.": "التطور: قد يتغير التطبيق أو يتوقف. قد تُحدَّث الشروط، والنسخة السارية هي المعروضة في التطبيق.", "Droit applicable : droit marocain. Tribunaux compétents : Casablanca.": "القانون المطبق: القانون المغربي. المحاكم المختصة: الدار البيضاء.", "Contact : via la boîte à avis.": "التواصل: عبر صندوق الآراء.", "Légal": "قانوني", "Avertissement santé, confidentialité et conditions d'utilisation.": "تنبيه صحي، الخصوصية وشروط الاستعمال.", "Dernière mise à jour : 19 novembre 2026": "آخر تحديث: 19 نونبر 2026", "Brouillon à faire relire par un professionnel avant publication publique.": "مسودة تُراجَع من مختص قبل النشر العام.", "J'ai lu l'avertissement santé et les conditions d'utilisation (Plus > Légal).": "قرأت التنبيه الصحي وشروط الاستعمال (المزيد > قانوني).", "Coche la case pour confirmer que tu as lu l'avertissement santé.": "ضع علامة في الخانة لتأكيد أنك قرأت التنبيه الصحي."}, "ma": {"Avertissement santé": "Tanbih s-seha", "Coach-Mass-KVES est un outil d'entraînement et de suivi à usage personnel. Ce n'est pas un dispositif médical et il ne remplace pas l'avis d'un médecin, d'un kinésithérapeute ou d'un diététicien.": "Coach-Mass-KVES hiya wsila d t-tmrin u l-mutaba3a l-istiimal shakhsi. Ma-hiyach jihaz tibbi u ma-katsta3ni-ch 3la ra2i t-tbib wla l-kiné wla khobir t-taghdiya.", "Avant de commencer": "Qbel ma tbda", "Si tu as une maladie (cœur, tension, articulations, dos, diabète…), une blessure, ou si tu es sous traitement, demande l'avis d'un médecin avant de t'entraîner ou de changer ton alimentation.": "Ila 3ndek mard (qalb, t-tension, l-mafasil, d-dahr, s-skkar…), jorh, wla katakhod dwa, sewwel t-tbib qbel ma tt-tmren wla tbddel l-akl dyalek.", "Si tu fumes, si tu as été longtemps sédentaire ou si tu reprends le sport, commence doucement. Le coach te le rappellera, mais c'est à toi de t'écouter.": "Ila katdekhhen, wla knti khamel bzzaf wla rjeti l-riyada, bda b-shwiya. L-coach ghadi y-fekkrek, walakin nta li khassek tsma3 l-jsmek.", "Cette application est destinée aux adultes (18 ans et plus). Elle n'est pas faite pour les femmes enceintes sans avis médical.": "Had t-tatbiq l-lkbar (18 3am w tal3). Ma-mkhellsch l-nsa l-7wamel bla ra2i tibbi.", "Pendant l'entraînement": "F-wqt t-tmrin", "Arrête immédiatement en cas de douleur vive, vertige, malaise, gêne dans la poitrine, essoufflement anormal ou douleur articulaire. Ne « force » pas à travers une douleur.": "Wqef f-hal 3la tawwa ila 7ssiti b-wja3 qwi, dwar, ghashyan, dyq f-s-sder, ntfas ghayr 3adi wla wja3 f-l-mafasil. Ma-tkarhch rassek 3la l-wja3.", "Échauffe-toi toujours. Respecte les temps de repos.": "Dima skhhen jsmek. 7tarem wqt r-raha.", "Les exercices marqués « à risque » demandent une attention particulière : lis les précautions avant de les lancer.": "L-tmarin li m3elmin \"khatir\" khassom intibah khass: qra l-ihtiyatat qbel ma tbda.", "En cas de symptôme grave, appelle les secours (au Maroc : 15 pour le SAMU, 150 pour la Protection civile).": "F-hal 3ard khatir, 3ayyet l-ist3af (f l-Maghrib: 15 l-SAMU, 150 l-7imaya l-madaniya).", "Alimentation et poids": "L-akl u l-wzn", "Les calories et protéines proposées sont des estimations générales calculées à partir de ce que tu saisis. Elles ne tiennent pas compte de ton état de santé.": "Les calories w l-protein li kay-tqtrah homa taqdirat 3amma m7subin mn li kat-dkhel. Ma-kay-akhdoch 7altek s-seh7iya f 3in l-i3tibar.", "L'application ne propose pas de régime en dessous d'un seuil de sécurité, et ne remplace pas un suivi nutritionnel.": "T-tatbiq ma-kay-qtrah-ch regime taht had l-aman, u ma-kay-3awwed-ch l-mutaba3a t-taghdawiya.", "Responsabilité": "L-mas2uliya", "Tu t'entraînes sous ta propre responsabilité. Les auteurs ne peuvent pas être tenus responsables d'une blessure ou d'un problème de santé lié à l'usage de l'application, dans la mesure permise par la loi.": "Nta li mas2ul 3la t-tmrin dyalek. L-mu2ellifin ma-kay-tahmlosh mas2uliyat jorh wla mushkil seh7i mrtbt b-istimal t-tatbiq, f-7udud li kay-sm7 bih l-qanun.", "Politique de confidentialité": "Siyasat l-khososiya", "En bref : tes données restent sur ton téléphone. Nous n'avons pas de serveur, pas de compte, pas de publicité, pas de traceur.": "B-ikhtisar: l-bayanat dyalek kat-bqa f-tilifon dyalek. Ma-3ndna la serveur la compte la shiharat la traceur.", "Quelles données ?": "Achmen bayanat?", "Ton profil (âge, taille, poids, objectif, régime, allergies déclarées), tes séances, tes mesures, tes réglages.": "Profil dyalek (l-3mer, t-tul, l-wzn, l-hadaf, r-regime, l-7asasiya li srr7ti biha), l-7essas, l-qyasat, u l-i3dadat.", "Ces données peuvent concerner ta santé : elles sont donc sensibles. Tu les saisis volontairement.": "Had l-bayanat momkin ykunu mrtbtin b-s-seha, donc hssassin. Nta li kat-dkhelhom b-ikhtiyarek.", "Où sont-elles ?": "Fin kaynin?", "Uniquement dans le stockage local de ton navigateur/appli (sur ton appareil). Elles ne sont envoyées nulle part automatiquement.": "Ghir f-stockage l-mahalli dyal navigateur/application (f jihazek). Ma-kat-t3at l-ta ma-kan automatiquement.", "Si tu supprimes les données du site ou désinstalles l'application, elles disparaissent, sauf si tu as fait une sauvegarde.": "Ila mseh7ti l-bayanat dyal site wla desinstalliti t-tatbiq, kat-tmshi, ila ma-dritish sauvegarde.", "Ce que tu choisis de partager": "Li kat-khtar t-partagi", "Sauvegarde : le fichier est créé sur ton appareil. Tu décides où le ranger. Il n'est pas chiffré à ce stade : garde-le en lieu sûr.": "Sauvegarde: l-fichier kay-t3mel f-jihazek, nta li kat-qrrer fin t-7ettu. Mashi mshaffer daba: khbbih f-blasa mamuna.", "Lien/QR de partage : il contient les informations que tu choisis de partager. Toute personne qui a le lien peut les lire.": "Lien/QR dyal l-partage: fih l-ma3lumat li khtariti t-partagi. Ay wa7ed 3ndu l-lien y-9dr yqrahom.", "Boîte à avis : ton message est chiffré de bout en bout avec la clé publique du propriétaire. Seul le propriétaire peut le lire. Ne mets pas d'informations de santé ou personnelles dont tu n'as pas besoin.": "Boite l-avis: risalatek m-shaffra mn tarf l-tarf b-l-meftah l-3am dyal s-sahib. Ghir s-sahib y-qdr yqraha. Ma-t7ett-sh ma3lumat seh7iya wla shakhsiya ma-khassek-hom-sh.", "Rappels / calendrier (.ics) : le fichier est créé sur ton appareil, puis traité par ton application de calendrier.": "Tadkirat / calendrier (.ics): l-fichier kay-t3mel f-jihazek, morra kay-3alejo application d l-calendrier dyalek.", "Musique": "L-musiqa", "Les fichiers audio que tu choisis restent sur ton appareil. Ils ne sont ni copiés ni envoyés.": "L-fichiers audio li khtariti kay-b9aw f-jihazek. Ma-kay-t-nsakhosh wla kay-t3atow.", "Hébergement": "L-istidafa", "L'application est hébergée sur GitHub Pages. GitHub peut enregistrer des données techniques de connexion (adresse IP, par exemple) selon sa propre politique. L'application elle-même n'y envoie rien.": "T-tatbiq mst9bel f GitHub Pages. GitHub momkin y-sjjel bayanat tiqniya dyal l-ittisal (3unwan IP mathalan) 7essab siyasto. T-tatbiq b-rasso ma-kay-sift lih walo.", "Tes droits": "7qoqek", "Accès, modification, suppression : tout se fait dans l'application (Réglages > Données). Tu peux tout effacer à tout moment.": "L-wsul, t-t3dil, l-7adhf: koulshi kay-t3mel f t-tatbiq (Réglages > Données). T-qdr tms7 koulshi f ay wqt.", "Pour une question ou une demande : utilise la boîte à avis.": "L-ay su2al wla talab: stkhdem boite l-avis.", "Cadre légal": "L-itar l-qanuni", "Loi marocaine 09-08 sur la protection des données personnelles (CNDP) et, pour les utilisateurs concernés, RGPD.": "L-qanun l-maghribi 09-08 dyal 7imayat l-mu3tayat sh-shakhsiya (CNDP) u, l-l-mustakhdimin l-m3niyin, RGPD.", "Mineurs : l'application est réservée aux 18 ans et plus.": "L-qasrin: t-tatbiq mkhsus l-nass li 3ndhom 18 3am w tal3.", "Changements : cette politique peut évoluer. La date de dernière mise à jour est indiquée en bas de page.": "T-tghyirat: had s-siyasa momkin t-tbddel. Tarikh akhir mise à jour kayn f-lta7t dyal s-sf7a.", "Conditions d'utilisation": "Shurut l-istimal", "Objet : Coach-Mass-KVES est une application gratuite de coaching sportif et de suivi, © KVES.": "L-mawdu3: Coach-Mass-KVES application mjjaniya l-coaching riyadi u l-mutaba3a, © KVES.", "Usage : personnel et non commercial. Tu dois avoir 18 ans ou plus.": "L-istimal: shakhsi u mashi tijari. Khassek ykun 3merek 18 wla zyada.", "Santé : tu as lu l'avertissement santé et tu t'entraînes sous ta responsabilité.": "S-seha: qrit t-tanbih s-seh7i u kat-tmren 3la mas2uliytek.", "Pas de garantie : l'application est fournie « telle quelle », sans promesse de résultat (prise de poids, de muscle) ni de disponibilité continue. Les résultats dépendent de toi, de ton alimentation, de ton sommeil et de ta santé.": "Bla damana: t-tatbiq mqdm \"kima huwa\", bla w3d b-nata2ij (zyadat l-wzn wla l-3adal) wla b-twaffur dayim. N-nata2ij katt3tmed 3lik, 3la l-akl, n-n3as u s-seha dyalek.", "Données : tu es responsable de tes sauvegardes. Les données sont locales (voir la politique de confidentialité).": "L-bayanat: nta mas2ul 3la s-sauvegardat dyalek. L-bayanat m7alliya (shuf siyasat l-khososiya).", "Contenus : textes, illustrations, logo, nom et signature KVES sont protégés. Copie et redistribution interdites sans accord, sauf licence indiquée.": "L-mu7tawa: n-nsus, r-rusum, l-logo, l-ism u tawqi3 KVES m7miyin. N-nsakh u i3adat t-twzi3 mamnu3in bla idn, ila ma kanatsh licence kat-qul 3aks dalik.", "Conduite : n'essaie pas de détourner l'application ni de nuire à d'autres utilisateurs (par exemple via la boîte à avis).": "S-suluk: ma-t7awelsh t-st3ml t-tatbiq b-tariqa ghalat wla t-drr b-mustakhdimin akhrin (mathalan b boite l-avis).", "Évolution : l'application peut changer ou s'arrêter. Les conditions peuvent être mises à jour, la version en vigueur est celle affichée dans l'application.": "T-tatawwur: t-tatbiq momkin yt-bddel wla yw9ef. Sh-shurut momkin t-tbddel, n-nuskha s-sariya hiya li dahra f t-tatbiq.", "Droit applicable : droit marocain. Tribunaux compétents : Casablanca.": "L-qanun l-mutabbaq: l-qanun l-maghribi. L-ma7akim l-mukhtassa: d-dar l-bayda.", "Contact : via la boîte à avis.": "L-ittisal: 3ber boite l-avis.", "Légal": "Qanuni", "Avertissement santé, confidentialité et conditions d'utilisation.": "Tanbih s-seha, l-khososiya u shurut l-istimal.", "Dernière mise à jour : 19 novembre 2026": "Akhir mise à jour: 19 nowanbir 2026", "Brouillon à faire relire par un professionnel avant publication publique.": "Brouillon khassu y-t3awd mn professionnel qbel n-nashr l-3am.", "J'ai lu l'avertissement santé et les conditions d'utilisation (Plus > Légal).": "Qrit t-tanbih s-seh7i u shurut l-istimal (Plus > Légal).", "Coche la case pour confirmer que tu as lu l'avertissement santé.": "Dir 3lama f l-khana bach t-akked belli qrit t-tanbih s-seh7i."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Questionnaire de santé": "Health questionnaire", "7 questions, 1 minute, pour savoir si tu dois voir un médecin avant de commencer.": "7 questions, 1 minute, to know whether you should see a doctor before starting.", "Faire le questionnaire": "Take the questionnaire", "Avis médical conseillé": "Medical advice recommended", "Tes réponses indiquent qu'un avis médical est conseillé avant de t'entraîner.": "Your answers suggest medical advice is recommended before you train.", "J'ai consulté un médecin": "I have seen a doctor", "Refaire le questionnaire": "Redo the questionnaire", "Coche ce qui te concerne. Si tu ne coches rien, tu peux commencer.": "Tick what applies to you. If you tick nothing, you can start.", "Valider mes réponses": "Confirm my answers", "Plus tard": "Later", "Parle à un médecin avant de commencer": "Talk to a doctor before starting", "Au moins une réponse demande un avis médical. Montre ces réponses à ton médecin avant de t'entraîner ou de changer ton alimentation. Ce questionnaire ne remplace pas une consultation.": "At least one answer calls for medical advice. Show these answers to your doctor before training or changing your diet. This questionnaire does not replace a consultation.", "Questionnaire enregistré : aucune alerte.": "Questionnaire saved: no alert.", "Ce poids visé est trop élevé pour ta taille (IMC au-dessus de 27). Choisis un objectif plus bas ou parle à un médecin.": "This target weight is too high for your height (BMI above 27). Choose a lower goal or talk to a doctor.", "Objectif trop éloigné (plus de 15 % de ton poids actuel). Fixe une première étape plus proche : tu pourras la relever ensuite.": "Goal too far (more than 15% of your current weight). Set a closer first step: you can raise it later.", "Un médecin t'a-t-il déjà parlé d'un problème de cœur ou de tension trop élevée ?": "Have you ever been told by a doctor that you have a heart problem or high blood pressure?", "Ressens-tu une douleur dans la poitrine, au repos ou à l'effort ?": "Do you feel chest pain, at rest or during effort?", "As-tu des vertiges, des pertes d'équilibre ou des malaises ?": "Do you have dizziness, loss of balance or fainting spells?", "As-tu un problème d'os, d'articulations ou de dos qui peut s'aggraver avec l'exercice ?": "Do you have a bone, joint or back problem that exercise could make worse?", "Prends-tu un médicament pour le cœur, la tension ou le diabète ?": "Do you take medication for the heart, blood pressure or diabetes?", "Es-tu enceinte ou as-tu accouché récemment ?": "Are you pregnant or have you recently given birth?", "Connais-tu une autre raison pour laquelle tu ne devrais pas faire d'effort physique ?": "Do you know of any other reason why you should not do physical effort?"}, "ar": {"Questionnaire de santé": "استبيان صحي", "7 questions, 1 minute, pour savoir si tu dois voir un médecin avant de commencer.": "7 أسئلة، دقيقة واحدة، لمعرفة هل يجب أن ترى طبيبا قبل البدء.", "Faire le questionnaire": "أجب عن الاستبيان", "Avis médical conseillé": "يُنصح باستشارة طبية", "Tes réponses indiquent qu'un avis médical est conseillé avant de t'entraîner.": "تشير إجاباتك إلى أن استشارة طبية مستحسنة قبل التمرين.", "J'ai consulté un médecin": "استشرت طبيبا", "Refaire le questionnaire": "أعد الاستبيان", "Coche ce qui te concerne. Si tu ne coches rien, tu peux commencer.": "ضع علامة على ما ينطبق عليك. إن لم تضع شيئا يمكنك البدء.", "Valider mes réponses": "تأكيد إجاباتي", "Plus tard": "لاحقا", "Parle à un médecin avant de commencer": "تحدث إلى طبيب قبل البدء", "Au moins une réponse demande un avis médical. Montre ces réponses à ton médecin avant de t'entraîner ou de changer ton alimentation. Ce questionnaire ne remplace pas une consultation.": "إجابة واحدة على الأقل تتطلب رأيا طبيا. اعرض هذه الإجابات على طبيبك قبل التمرين أو تغيير غذائك. هذا الاستبيان لا يغني عن الاستشارة.", "Questionnaire enregistré : aucune alerte.": "تم حفظ الاستبيان: لا تنبيه.", "Ce poids visé est trop élevé pour ta taille (IMC au-dessus de 27). Choisis un objectif plus bas ou parle à un médecin.": "هذا الوزن المستهدف مرتفع جدا بالنسبة لطولك (مؤشر كتلة الجسم فوق 27). اختر هدفا أقل أو تحدث إلى طبيب.", "Objectif trop éloigné (plus de 15 % de ton poids actuel). Fixe une première étape plus proche : tu pourras la relever ensuite.": "هدف بعيد جدا (أكثر من 15 % من وزنك الحالي). ضع مرحلة أولى أقرب: يمكنك رفعه لاحقا.", "Un médecin t'a-t-il déjà parlé d'un problème de cœur ou de tension trop élevée ?": "هل أخبرك طبيب يوما بأن لديك مشكلة في القلب أو ارتفاعا في الضغط؟", "Ressens-tu une douleur dans la poitrine, au repos ou à l'effort ?": "هل تشعر بألم في الصدر، أثناء الراحة أو الجهد؟", "As-tu des vertiges, des pertes d'équilibre ou des malaises ?": "هل تعاني من دوار أو فقدان توازن أو إغماء؟", "As-tu un problème d'os, d'articulations ou de dos qui peut s'aggraver avec l'exercice ?": "هل لديك مشكلة في العظام أو المفاصل أو الظهر قد يزيدها التمرين سوءا؟", "Prends-tu un médicament pour le cœur, la tension ou le diabète ?": "هل تتناول دواء للقلب أو الضغط أو السكري؟", "Es-tu enceinte ou as-tu accouché récemment ?": "هل أنت حامل أو وضعت مؤخرا؟", "Connais-tu une autre raison pour laquelle tu ne devrais pas faire d'effort physique ?": "هل تعرف سببا آخر يمنعك من بذل مجهود بدني؟"}, "ma": {"Questionnaire de santé": "Questionnaire d s-seha", "7 questions, 1 minute, pour savoir si tu dois voir un médecin avant de commencer.": "7 d s-swal, daqiqa, bach t3ref wach khassek tshuf t-tbib qbel ma tbda.", "Faire le questionnaire": "Dir l-questionnaire", "Avis médical conseillé": "Ra2i tibbi mnasab", "Tes réponses indiquent qu'un avis médical est conseillé avant de t'entraîner.": "L-ajwiba dyalek kat-qul belli mnasab tshuf t-tbib qbel ma tt-tmren.", "J'ai consulté un médecin": "Shft t-tbib", "Refaire le questionnaire": "3awd l-questionnaire", "Coche ce qui te concerne. Si tu ne coches rien, tu peux commencer.": "Dir 3lama 3la li kay-khussek. Ila ma-dirti walo, t-qdr tbda.", "Valider mes réponses": "Akked l-ajwiba dyali", "Plus tard": "Moraha", "Parle à un médecin avant de commencer": "Hder m3a t-tbib qbel ma tbda", "Au moins une réponse demande un avis médical. Montre ces réponses à ton médecin avant de t'entraîner ou de changer ton alimentation. Ce questionnaire ne remplace pas une consultation.": "Jwab wa7ed 3la l-aqell kay-talab ra2i tibbi. Werri had l-ajwiba l-t-tbib dyalek qbel ma tt-tmren wla tbddel l-akl. Had l-questionnaire ma-kay-3awwed-sh l-konsultasyon.", "Questionnaire enregistré : aucune alerte.": "Questionnaire t-sjjel: ma-kayn ta tanbih.", "Ce poids visé est trop élevé pour ta taille (IMC au-dessus de 27). Choisis un objectif plus bas ou parle à un médecin.": "Had l-wzn l-mustahdaf 3ali bzzaf 3la tulek (IMC fuq 27). Khtar hadaf aqell wla hder m3a t-tbib.", "Objectif trop éloigné (plus de 15 % de ton poids actuel). Fixe une première étape plus proche : tu pourras la relever ensuite.": "Hadaf b3id bzzaf (aktar mn 15 % mn wzn dyalek daba). 7ett marhala loula qrib: mn ba3d t-qdr t-3elli.", "Un médecin t'a-t-il déjà parlé d'un problème de cœur ou de tension trop élevée ?": "Wach t-tbib qal lik 3emmru belli 3ndek mushkil f-l-qalb wla t-tension 3aliya?", "Ressens-tu une douleur dans la poitrine, au repos ou à l'effort ?": "Wach kat-7ess b-wja3 f s-sder, f-r-raha wla f-l-mjhud?", "As-tu des vertiges, des pertes d'équilibre ou des malaises ?": "Wach kat-3ani mn dwar, ghyab t-twazun wla ghashyan?", "As-tu un problème d'os, d'articulations ou de dos qui peut s'aggraver avec l'exercice ?": "Wach 3ndek mushkil f l-3adm, l-mafasil wla d-dahr li t-tmrin momkin y-zid fih?", "Prends-tu un médicament pour le cœur, la tension ou le diabète ?": "Wach katakhod dwa l-l-qalb, t-tension wla s-skkar?", "Es-tu enceinte ou as-tu accouché récemment ?": "Wach 7amla wla wldti m2akhran?", "Connais-tu une autre raison pour laquelle tu ne devrais pas faire d'effort physique ?": "Wach 3arf shi sabab akhor kay-mna3k mn l-mjhud l-badani?"}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Effort ressenti (1 = très facile, 5 = très dur)": "Perceived effort (1 = very easy, 5 = very hard)", "effort moy.": "avg effort", "Tes séances sont ressenties très dures : allège ou prévois une semaine d'allègement.": "Your workouts feel very hard: ease off or plan a lighter week.", "Tes séances te paraissent faciles : ajoute une répétition par série ou passe à la variante suivante.": "Your workouts feel easy: add one rep per set or move to the next variant.", "Semaine d'allègement en cours": "Light week in progress", "Les séances sont allégées jusqu'à dimanche.": "Workouts are lighter until Sunday.", "Arrêter l'allègement": "Stop the light week", "Semaine d'allègement conseillée": "Light week recommended", "Après plusieurs semaines d'effort, ou si tes séances sont très dures, une semaine plus légère aide à récupérer et à progresser ensuite.": "After several weeks of effort, or if your workouts are very hard, a lighter week helps you recover and progress afterwards.", "Activer cette semaine": "Turn on for this week", "Pas maintenant": "Not now", "Semaine d'allègement": "Light week", "Cette semaine, les séances sont allégées. Fais-les quand même : récupérer fait partie du programme.": "This week, workouts are lighter. Do them anyway: recovery is part of the programme."}, "ar": {"Effort ressenti (1 = très facile, 5 = très dur)": "الجهد المحسوس (1 = سهل جدا، 5 = صعب جدا)", "effort moy.": "متوسط الجهد", "Tes séances sont ressenties très dures : allège ou prévois une semaine d'allègement.": "تمارينك تبدو صعبة جدا: خفّف أو خطط لأسبوع تخفيف.", "Tes séances te paraissent faciles : ajoute une répétition par série ou passe à la variante suivante.": "تمارينك تبدو سهلة: أضف تكرارا في كل سلسلة أو انتقل إلى النسخة التالية.", "Semaine d'allègement en cours": "أسبوع التخفيف جارٍ", "Les séances sont allégées jusqu'à dimanche.": "الحصص مخففة حتى يوم الأحد.", "Arrêter l'allègement": "إيقاف التخفيف", "Semaine d'allègement conseillée": "يُنصح بأسبوع تخفيف", "Après plusieurs semaines d'effort, ou si tes séances sont très dures, une semaine plus légère aide à récupérer et à progresser ensuite.": "بعد عدة أسابيع من الجهد، أو إذا كانت حصصك صعبة جدا، يساعدك أسبوع أخف على التعافي ثم التقدم.", "Activer cette semaine": "فعّل هذا الأسبوع", "Pas maintenant": "ليس الآن", "Semaine d'allègement": "أسبوع التخفيف", "Cette semaine, les séances sont allégées. Fais-les quand même : récupérer fait partie du programme.": "هذا الأسبوع الحصص مخففة. أنجزها مع ذلك: التعافي جزء من البرنامج."}, "ma": {"Effort ressenti (1 = très facile, 5 = très dur)": "L-mjhud li 7ssiti (1 = sahl bzzaf, 5 = s3ib bzzaf)", "effort moy.": "moyenne dyal l-mjhud", "Tes séances sont ressenties très dures : allège ou prévois une semaine d'allègement.": "L-7ssas dyalek 7asshom s3ib bzzaf: khffef wla 7ddd simana khfifa.", "Tes séances te paraissent faciles : ajoute une répétition par série ou passe à la variante suivante.": "L-7ssas dyalek sahlin: zid tkrar wa7ed f kol serie wla douz l-variante li morha.", "Semaine d'allègement en cours": "Simana khfifa jariya", "Les séances sont allégées jusqu'à dimanche.": "L-7ssas khfifin tal nhar l-7ad.", "Arrêter l'allègement": "Wqqef t-takhfif", "Semaine d'allègement conseillée": "Simana khfifa mnasba", "Après plusieurs semaines d'effort, ou si tes séances sont très dures, une semaine plus légère aide à récupérer et à progresser ensuite.": "Mn ba3d bzzaf d s-sbu3 d l-mjhud, wla ila l-7ssas s3abin, simana akhaff kat-3awnek tr-tah u t-tqdm morha.", "Activer cette semaine": "Fa33el had s-simana", "Pas maintenant": "Mashi daba", "Semaine d'allègement": "Simana khfifa", "Cette semaine, les séances sont allégées. Fais-les quand même : récupérer fait partie du programme.": "Had s-simana l-7ssas khfifin. Dirhom 3la kol 7al: r-raha jouz2 mn l-programme."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Comment le programme s'adapte": "How the programme adapts", "Le programme se calibre selon ton profil et ton objectif. Voici ce qui change tout seul, et ce qui reste fixe pour l'instant.": "The programme is calibrated to your profile and goal. Here is what changes on its own, and what stays fixed for now.", "Ce qui s'adapte automatiquement": "What adapts automatically", "Calories et protéines : calculées selon ton objectif, ton âge, ta taille, ton poids et ton genre, avec un plancher de sécurité en perte de poids.": "Calories and protein: calculated from your goal, age, height, weight and gender, with a safety floor for weight loss.", "Portions des repas : ajustées à ta cible de calories.": "Meal portions: adjusted to your calorie target.", "Menus : filtrés selon tes allergies, ton régime végétarien, ton budget et tes variantes choisies. La liste de courses suit.": "Menus: filtered by your allergies, vegetarian diet, budget and chosen variants. The shopping list follows.", "Séances : allégées si tu dors peu ou si ton énergie est basse. Plus difficiles quand tu réussis tes séries.": "Workouts: lighter if you sleep little or your energy is low. Harder when you complete your sets.", "Effort et récupération : l'effort ressenti et la semaine d'allègement règlent la charge.": "Effort and recovery: perceived effort and the light week adjust the load.", "Poids visé : refusé s'il est trop éloigné ou dangereux pour ta taille.": "Target weight: refused if too far away or unsafe for your height.", "Ce qui reste fixe pour l'instant": "What stays fixed for now", "Les horaires des repas (modifiables dans une prochaine version).": "Meal times (editable in a coming version).", "Le choix des plats : le menu de base est un menu de prise de masse ; pour les autres objectifs, seules les quantités changent (des menus adaptés sont prévus).": "The choice of dishes: the base menu is a mass-gain menu; for other goals only quantities change (adapted menus are planned).", "Les fruits sont peu variés (bananes, dattes) : d'autres sont prévus.": "Fruits are limited (bananas, dates): more are planned.", "À retenir": "Keep in mind", "Ces repères sont généraux et ne remplacent pas un diététicien. En cas de doute, demande un avis professionnel.": "These guidelines are general and do not replace a dietitian. If in doubt, ask a professional.", "Ce qui change selon ton objectif, et ce qui reste fixe.": "What changes with your goal, and what stays fixed."}, "ar": {"Comment le programme s'adapte": "كيف يتكيف البرنامج", "Le programme se calibre selon ton profil et ton objectif. Voici ce qui change tout seul, et ce qui reste fixe pour l'instant.": "يُضبط البرنامج حسب ملفك وهدفك. إليك ما يتغير تلقائيا وما يبقى ثابتا حاليا.", "Ce qui s'adapte automatiquement": "ما يتكيف تلقائيا", "Calories et protéines : calculées selon ton objectif, ton âge, ta taille, ton poids et ton genre, avec un plancher de sécurité en perte de poids.": "السعرات والبروتين: تُحسب حسب هدفك وعمرك وطولك ووزنك وجنسك، مع حد أدنى للأمان عند إنقاص الوزن.", "Portions des repas : ajustées à ta cible de calories.": "حصص الوجبات: تُعدَّل حسب هدفك من السعرات.", "Menus : filtrés selon tes allergies, ton régime végétarien, ton budget et tes variantes choisies. La liste de courses suit.": "القوائم: تُصفّى حسب حساسيتك ونظامك النباتي وميزانيتك والبدائل التي اخترتها. وتتبعها لائحة المشتريات.", "Séances : allégées si tu dors peu ou si ton énergie est basse. Plus difficiles quand tu réussis tes séries.": "الحصص: تُخفَّف إذا نمت قليلا أو كانت طاقتك منخفضة، وتصعب عندما تنجح في سلاسلك.", "Effort et récupération : l'effort ressenti et la semaine d'allègement règlent la charge.": "الجهد والتعافي: الجهد المحسوس وأسبوع التخفيف يضبطان الحِمل.", "Poids visé : refusé s'il est trop éloigné ou dangereux pour ta taille.": "الوزن المستهدف: يُرفض إن كان بعيدا جدا أو خطرا بالنسبة لطولك.", "Ce qui reste fixe pour l'instant": "ما يبقى ثابتا حاليا", "Les horaires des repas (modifiables dans une prochaine version).": "مواعيد الوجبات (قابلة للتعديل في نسخة قادمة).", "Le choix des plats : le menu de base est un menu de prise de masse ; pour les autres objectifs, seules les quantités changent (des menus adaptés sont prévus).": "اختيار الأطباق: القائمة الأساسية قائمة لزيادة الكتلة؛ وللأهداف الأخرى تتغير الكميات فقط (قوائم ملائمة مبرمجة).", "Les fruits sont peu variés (bananes, dattes) : d'autres sont prévus.": "الفواكه قليلة التنوع (موز، تمر): سيُضاف غيرها.", "À retenir": "للتذكير", "Ces repères sont généraux et ne remplacent pas un diététicien. En cas de doute, demande un avis professionnel.": "هذه مؤشرات عامة ولا تغني عن أخصائي تغذية. عند الشك اسأل مختصا.", "Ce qui change selon ton objectif, et ce qui reste fixe.": "ما يتغير حسب هدفك وما يبقى ثابتا."}, "ma": {"Comment le programme s'adapte": "Kifash l-programme kay-t3awd", "Le programme se calibre selon ton profil et ton objectif. Voici ce qui change tout seul, et ce qui reste fixe pour l'instant.": "L-programme kay-t3ayer 7essab profil u l-hadaf dyalek. Hna li kay-tbddel b-rasso u li kay-b9a tabit daba.", "Ce qui s'adapte automatiquement": "Li kay-t3awd automatiquement", "Calories et protéines : calculées selon ton objectif, ton âge, ta taille, ton poids et ton genre, avec un plancher de sécurité en perte de poids.": "Calories w protein: m7subin 7essab l-hadaf, l-3mer, t-tul, l-wzn u j-jins, m3a 7add adna dyal l-aman f nqs l-wzn.", "Portions des repas : ajustées à ta cible de calories.": "L-kmiyat dyal l-wajabat: m3dlin 7essab hadaf calories dyalek.", "Menus : filtrés selon tes allergies, ton régime végétarien, ton budget et tes variantes choisies. La liste de courses suit.": "Les menus: m-fltrin 7essab l-7asasiya, r-regime nabati, l-budget u l-varyant li khtariti. L-liste d l-courses katbe3 hom.", "Séances : allégées si tu dors peu ou si ton énergie est basse. Plus difficiles quand tu réussis tes séries.": "L-7ssas: kay-khfaf ila nssti qlil wla t-taqa dyalek d3ifa. Kay-s3ab ila njjhti f s-series.", "Effort et récupération : l'effort ressenti et la semaine d'allègement règlent la charge.": "L-mjhud u r-raha: l-mjhud li kat-7ess u simana khfifa kay-d7ebto l-7aml.", "Poids visé : refusé s'il est trop éloigné ou dangereux pour ta taille.": "L-wzn l-mustahdaf: kay-t-rfed ila kan b3id bzzaf wla khatir 3la tulek.", "Ce qui reste fixe pour l'instant": "Li kay-b9a tabit daba", "Les horaires des repas (modifiables dans une prochaine version).": "W9at l-wajabat (mt-bddlin f version jaya).", "Le choix des plats : le menu de base est un menu de prise de masse ; pour les autres objectifs, seules les quantités changent (des menus adaptés sont prévus).": "L-akla: l-menu d l-asas dyal zyadat l-kutla; l-ahdaf lokhrin ghir l-kmiyat li kat-tbddel (menus mnasbin mbrmjin).", "Les fruits sont peu variés (bananes, dattes) : d'autres sont prévus.": "L-fwakih qlal (banan, tmr): ghadi nzidu khrin.", "À retenir": "Khlli f balek", "Ces repères sont généraux et ne remplacent pas un diététicien. En cas de doute, demande un avis professionnel.": "Had l-mu2ashirat 3amma u ma-kay-3awwdo-sh khobir t-taghdiya. Ila shkkiti, sewwel mukhtass.", "Ce qui change selon ton objectif, et ce qui reste fixe.": "Li kay-tbddel 7essab l-hadaf u li kay-b9a tabit."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Heures des repas": "Meal times", "Choisis l'heure de chaque repas. Les repas non proposés pour ton objectif n'apparaissent pas dans l'onglet Repas. Garde au moins 2 h entre deux repas.": "Choose the time of each meal. Meals not offered for your goal do not appear in the Meals tab. Keep at least 2 h between meals.", "Repas 1": "Meal 1", "Repas 2": "Meal 2", "Repas 3": "Meal 3", "Repas 4": "Meal 4", "Repas 5": "Meal 5", "Un dernier repas après 21 h 30 peut gêner le sommeil et la digestion : garde-le léger.": "A last meal after 9:30 pm can disturb sleep and digestion: keep it light.", "Heures par défaut": "Default times", "Les heures doivent rester dans l'ordre, avec au moins 2 h d'écart.": "Times must stay in order, at least 2 h apart.", "Déjeuner": "Lunch", "Dîner": "Dinner", "Horaires des repas : tu les choisis dans Réglages > Heures des repas.": "Meal times: you choose them in Settings > Meal times."}, "ar": {"Heures des repas": "مواعيد الوجبات", "Choisis l'heure de chaque repas. Les repas non proposés pour ton objectif n'apparaissent pas dans l'onglet Repas. Garde au moins 2 h entre deux repas.": "اختر وقت كل وجبة. الوجبات غير المقترحة لهدفك لا تظهر في تبويب الوجبات. اترك ساعتين على الأقل بين وجبتين.", "Repas 1": "الوجبة 1", "Repas 2": "الوجبة 2", "Repas 3": "الوجبة 3", "Repas 4": "الوجبة 4", "Repas 5": "الوجبة 5", "Un dernier repas après 21 h 30 peut gêner le sommeil et la digestion : garde-le léger.": "وجبة أخيرة بعد 21:30 قد تزعج النوم والهضم: اجعلها خفيفة.", "Heures par défaut": "المواعيد الافتراضية", "Les heures doivent rester dans l'ordre, avec au moins 2 h d'écart.": "يجب أن تبقى المواعيد مرتبة وبفارق ساعتين على الأقل.", "Déjeuner": "الغداء", "Dîner": "العشاء", "Horaires des repas : tu les choisis dans Réglages > Heures des repas.": "مواعيد الوجبات: تختارها في الإعدادات > مواعيد الوجبات."}, "ma": {"Heures des repas": "W9at l-wajabat", "Choisis l'heure de chaque repas. Les repas non proposés pour ton objectif n'apparaissent pas dans l'onglet Repas. Garde au moins 2 h entre deux repas.": "Khtar l-wqt dyal kol wajba. L-wajabat li ma-mqtr7ach l-l-hadaf dyalek ma-kat-dhersh f tab l-wajabat. Khlli sa3tin 3la l-aqell bin wajba u wajba.", "Repas 1": "Wajba 1", "Repas 2": "Wajba 2", "Repas 3": "Wajba 3", "Repas 4": "Wajba 4", "Repas 5": "Wajba 5", "Un dernier repas après 21 h 30 peut gêner le sommeil et la digestion : garde-le léger.": "Akhir wajba mn ba3d 21:30 momkin t-3tl n-n3as u l-hadm: khlliha khfifa.", "Heures par défaut": "L-w9at l-iftiradiya", "Les heures doivent rester dans l'ordre, avec au moins 2 h d'écart.": "L-w9at khassha tb9a mrttba, b-fariq sa3tin 3la l-aqell.", "Déjeuner": "L-ghda", "Dîner": "L-3sha", "Horaires des repas : tu les choisis dans Réglages > Heures des repas.": "W9at l-wajabat: nta li kat-khtarhom f Réglages > W9at l-wajabat."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Omelette de 3 œufs, 1 pain, 1 c. à soupe d'huile d'olive, 1 verre de lait au chocolat, 1 orange": "3-egg omelette, 1 bread, 1 tbsp olive oil, 1 glass of chocolate milk, 1 orange", "1 pain avec 1 c. à soupe d'amlou, 1 yaourt, 1 fruit de saison (pomme, orange…)": "1 bread with 1 tbsp amlou, 1 yogurt, 1 seasonal fruit (apple, orange…)", "1 pain avec 1 c. à soupe de miel, 1 yaourt, 1 fruit de saison (pomme, orange…)": "1 bread with 1 tbsp honey, 1 yogurt, 1 seasonal fruit (apple, orange…)", "Fruits (orange, pomme, fruit de saison)": "Fruit (orange, apple, seasonal fruit)", "Fruits : une orange au petit-déjeuner et un fruit de saison à la collation de 18 h, comptés dans la liste de courses.": "Fruit: an orange at breakfast and a seasonal fruit at the 6 pm snack, counted in the shopping list."}, "ar": {"Omelette de 3 œufs, 1 pain, 1 c. à soupe d'huile d'olive, 1 verre de lait au chocolat, 1 orange": "عجة من 3 بيضات، خبزة، ملعقة كبيرة زيت زيتون، كأس حليب بالشوكولاتة، برتقالة", "1 pain avec 1 c. à soupe d'amlou, 1 yaourt, 1 fruit de saison (pomme, orange…)": "خبزة مع ملعقة كبيرة أملو، زبادي، فاكهة موسمية (تفاحة، برتقالة…)", "1 pain avec 1 c. à soupe de miel, 1 yaourt, 1 fruit de saison (pomme, orange…)": "خبزة مع ملعقة كبيرة عسل، زبادي، فاكهة موسمية (تفاحة، برتقالة…)", "Fruits (orange, pomme, fruit de saison)": "فواكه (برتقال، تفاح، فاكهة موسمية)", "Fruits : une orange au petit-déjeuner et un fruit de saison à la collation de 18 h, comptés dans la liste de courses.": "الفواكه: برتقالة عند الفطور وفاكهة موسمية في وجبة الخامسة مساء، محسوبة في لائحة المشتريات."}, "ma": {"Omelette de 3 œufs, 1 pain, 1 c. à soupe d'huile d'olive, 1 verre de lait au chocolat, 1 orange": "Omlet d 3 d l-bid, khobza, ma3la9a kbira d zit z-zitun, kas d l7lib b-chocolat, litshin", "1 pain avec 1 c. à soupe d'amlou, 1 yaourt, 1 fruit de saison (pomme, orange…)": "Khobza m3a ma3la9a kbira d amlou, yaourt, fakiha mawsimiya (tfa7a, litshin…)", "1 pain avec 1 c. à soupe de miel, 1 yaourt, 1 fruit de saison (pomme, orange…)": "Khobza m3a ma3la9a kbira d l3sal, yaourt, fakiha mawsimiya (tfa7a, litshin…)", "Fruits (orange, pomme, fruit de saison)": "Fwakih (litshin, tfa7, fakiha mawsimiya)", "Fruits : une orange au petit-déjeuner et un fruit de saison à la collation de 18 h, comptés dans la liste de courses.": "Fwakih: litshina f l-ftur u fakiha mawsimiya f l-gouter d 18h, m7subin f l-liste d l-courses."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Omelette de 3 œufs, 1 pain, 1 fruit de saison, 1 c. à café d'huile d'olive": "3-egg omelette, 1 bread, 1 seasonal fruit, 1 tsp olive oil", "Flocons d'avoine (50 g) cuits dans 200 ml de lait, 1 pomme, 1 c. à soupe de miel": "Oats (50 g) cooked in 200 ml milk, 1 apple, 1 tbsp honey", "2 yaourts nature, 40 g de flocons d'avoine, 1 fruit de saison": "2 plain yogurts, 40 g oats, 1 seasonal fruit", "1 pain, 100 g de pois chiches cuits écrasés avec 1 c. à café d'huile d'olive, 1 orange": "1 bread, 100 g cooked chickpeas mashed with 1 tsp olive oil, 1 orange", "60 g de riz (cru) cuit, 100 g de pois chiches cuits, 1 fruit de saison": "60 g rice (raw weight), cooked, 100 g cooked chickpeas, 1 seasonal fruit", "1 yaourt nature, 1 fruit de saison, 2 dattes": "1 plain yogurt, 1 seasonal fruit, 2 dates", "2 fruits de saison, 3 dattes": "2 seasonal fruits, 3 dates", "150 g de poulet, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "150 g chicken, 70 g rice (raw weight), large portion of vegetables, 1 tsp olive oil", "150 g de poulet ou 4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "150 g chicken or 4 sardines, 70 g rice (raw weight), large portion of vegetables, 1 tsp olive oil", "4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "4 sardines, 70 g rice (raw weight), large portion of vegetables, 1 tsp olive oil", "200 g de lentilles cuites, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "200 g cooked lentils, 70 g rice (raw weight), large portion of vegetables, 1 tsp olive oil", "1 fruit de saison, 1 pain avec 1 c. à café de miel": "1 seasonal fruit, 1 bread with 1 tsp honey", "150 g de lentilles cuites, 2 œufs, grande portion de légumes": "150 g cooked lentils, 2 eggs, large portion of vegetables", "150 g de lentilles ou de pois chiches cuits, 2 œufs, grande portion de légumes": "150 g cooked lentils or chickpeas, 2 eggs, large portion of vegetables", "150 g de pois chiches cuits, 2 œufs, grande portion de légumes": "150 g cooked chickpeas, 2 eggs, large portion of vegetables", "200 g de lentilles cuites, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 g cooked lentils, 1 yogurt, large portion of vegetables, 1 tsp olive oil", "200 g de lentilles ou de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 g cooked lentils or chickpeas, 1 yogurt, large portion of vegetables, 1 tsp olive oil", "200 g de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 g cooked chickpeas, 1 yogurt, large portion of vegetables, 1 tsp olive oil", "200 g de lentilles cuites, 60 g de riz (cru), grande portion de légumes": "200 g cooked lentils, 60 g rice (raw weight), large portion of vegetables", "200 g de lentilles ou de pois chiches cuits, 60 g de riz (cru), grande portion de légumes": "200 g cooked lentils or chickpeas, 60 g rice (raw weight), large portion of vegetables", "200 g de pois chiches cuits, 60 g de riz (cru), grande portion de légumes": "200 g cooked chickpeas, 60 g rice (raw weight), large portion of vegetables", "Menus adaptés": "Adapted menus", "Menus : plus légers pour la perte de poids, la tonification et le maintien (yaourt nature, fruits, plus de légumes) ; la prise de masse garde ses menus riches.": "Menus: lighter for weight loss, toning and maintenance (plain yogurt, fruit, more vegetables); mass gain keeps its richer menus."}, "ar": {"Omelette de 3 œufs, 1 pain, 1 fruit de saison, 1 c. à café d'huile d'olive": "عجة من 3 بيضات، خبزة، فاكهة موسمية، ملعقة صغيرة زيت زيتون", "Flocons d'avoine (50 g) cuits dans 200 ml de lait, 1 pomme, 1 c. à soupe de miel": "شوفان (50 غ) مطبوخ في 200 مل حليب، تفاحة، ملعقة كبيرة عسل", "2 yaourts nature, 40 g de flocons d'avoine, 1 fruit de saison": "زبادي طبيعي اثنان، 40 غ شوفان، فاكهة موسمية", "1 pain, 100 g de pois chiches cuits écrasés avec 1 c. à café d'huile d'olive, 1 orange": "خبزة، 100 غ حمص مطبوخ مهروس مع ملعقة صغيرة زيت زيتون، برتقالة", "60 g de riz (cru) cuit, 100 g de pois chiches cuits, 1 fruit de saison": "60 غ أرز (نيء) مطبوخ، 100 غ حمص مطبوخ، فاكهة موسمية", "1 yaourt nature, 1 fruit de saison, 2 dattes": "زبادي طبيعي، فاكهة موسمية، تمرتان", "2 fruits de saison, 3 dattes": "فاكهتان موسميتان، 3 تمرات", "150 g de poulet, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "150 غ دجاج، 70 غ أرز (نيء)، حصة كبيرة من الخضر، ملعقة صغيرة زيت زيتون", "150 g de poulet ou 4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "150 غ دجاج أو 4 سردين، 70 غ أرز (نيء)، حصة كبيرة من الخضر، ملعقة صغيرة زيت زيتون", "4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "4 سردين، 70 غ أرز (نيء)، حصة كبيرة من الخضر، ملعقة صغيرة زيت زيتون", "200 g de lentilles cuites, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "200 غ عدس مطبوخ، 70 غ أرز (نيء)، حصة كبيرة من الخضر، ملعقة صغيرة زيت زيتون", "1 fruit de saison, 1 pain avec 1 c. à café de miel": "فاكهة موسمية، خبزة مع ملعقة صغيرة عسل", "150 g de lentilles cuites, 2 œufs, grande portion de légumes": "150 غ عدس مطبوخ، بيضتان، حصة كبيرة من الخضر", "150 g de lentilles ou de pois chiches cuits, 2 œufs, grande portion de légumes": "150 غ عدس أو حمص مطبوخ، بيضتان، حصة كبيرة من الخضر", "150 g de pois chiches cuits, 2 œufs, grande portion de légumes": "150 غ حمص مطبوخ، بيضتان، حصة كبيرة من الخضر", "200 g de lentilles cuites, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 غ عدس مطبوخ، زبادي، حصة كبيرة من الخضر، ملعقة صغيرة زيت زيتون", "200 g de lentilles ou de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 غ عدس أو حمص مطبوخ، زبادي، حصة كبيرة من الخضر، ملعقة صغيرة زيت زيتون", "200 g de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 غ حمص مطبوخ، زبادي، حصة كبيرة من الخضر، ملعقة صغيرة زيت زيتون", "200 g de lentilles cuites, 60 g de riz (cru), grande portion de légumes": "200 غ عدس مطبوخ، 60 غ أرز (نيء)، حصة كبيرة من الخضر", "200 g de lentilles ou de pois chiches cuits, 60 g de riz (cru), grande portion de légumes": "200 غ عدس أو حمص مطبوخ، 60 غ أرز (نيء)، حصة كبيرة من الخضر", "200 g de pois chiches cuits, 60 g de riz (cru), grande portion de légumes": "200 غ حمص مطبوخ، 60 غ أرز (نيء)، حصة كبيرة من الخضر", "Menus adaptés": "قوائم ملائمة", "Menus : plus légers pour la perte de poids, la tonification et le maintien (yaourt nature, fruits, plus de légumes) ; la prise de masse garde ses menus riches.": "القوائم: أخف لإنقاص الوزن والتنشيف والحفاظ على الوزن (زبادي طبيعي، فواكه، خضر أكثر)؛ وزيادة الكتلة تحتفظ بقوائمها الغنية."}, "ma": {"Omelette de 3 œufs, 1 pain, 1 fruit de saison, 1 c. à café d'huile d'olive": "Omlet d 3 d l-bid, Khobza, Fakiha mawsimiya, Ma3la9a sghira d zit z-zitun", "Flocons d'avoine (50 g) cuits dans 200 ml de lait, 1 pomme, 1 c. à soupe de miel": "Flocons d avoine (50 g) mtyybin f 200 ml d l7lib, Tfa7a, Ma3la9a kbira d l3sal", "2 yaourts nature, 40 g de flocons d'avoine, 1 fruit de saison": "Joj yaourt nature, 40 g d flocons d avoine, Fakiha mawsimiya", "1 pain, 100 g de pois chiches cuits écrasés avec 1 c. à café d'huile d'olive, 1 orange": "Khobza, 100 g d l7ommos mtyyeb m3ejjen m3a ma3la9a sghira d zit z-zitun, Litshina", "60 g de riz (cru) cuit, 100 g de pois chiches cuits, 1 fruit de saison": "60 g d rz (nay) mtyyeb, 100 g d l7ommos mtyyeb, Fakiha mawsimiya", "1 yaourt nature, 1 fruit de saison, 2 dattes": "Yaourt nature, Fakiha mawsimiya, Joj tmrat", "2 fruits de saison, 3 dattes": "Joj d l-fwakih mawsimiyin, 3 tmrat", "150 g de poulet, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "150 g d djaj, 70 g d rz (nay), Portion kbira d l-khodra, Ma3la9a sghira d zit z-zitun", "150 g de poulet ou 4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "150 g d djaj wla 4 d sardin, 70 g d rz (nay), Portion kbira d l-khodra, Ma3la9a sghira d zit z-zitun", "4 sardines, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "4 d sardin, 70 g d rz (nay), Portion kbira d l-khodra, Ma3la9a sghira d zit z-zitun", "200 g de lentilles cuites, 70 g de riz (cru), grande portion de légumes, 1 c. à café d'huile d'olive": "200 g d l3dess mtyyeb, 70 g d rz (nay), Portion kbira d l-khodra, Ma3la9a sghira d zit z-zitun", "1 fruit de saison, 1 pain avec 1 c. à café de miel": "Fakiha mawsimiya, Khobza m3a ma3la9a sghira d l3sal", "150 g de lentilles cuites, 2 œufs, grande portion de légumes": "150 g d l3dess mtyyeb, Joj d l-bid, Portion kbira d l-khodra", "150 g de lentilles ou de pois chiches cuits, 2 œufs, grande portion de légumes": "150 g d l3dess wla l7ommos mtyyeb, Joj d l-bid, Portion kbira d l-khodra", "150 g de pois chiches cuits, 2 œufs, grande portion de légumes": "150 g d l7ommos mtyyeb, Joj d l-bid, Portion kbira d l-khodra", "200 g de lentilles cuites, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 g d l3dess mtyyeb, Yaourt, Portion kbira d l-khodra, Ma3la9a sghira d zit z-zitun", "200 g de lentilles ou de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 g d l3dess wla l7ommos mtyyeb, Yaourt, Portion kbira d l-khodra, Ma3la9a sghira d zit z-zitun", "200 g de pois chiches cuits, 1 yaourt, grande portion de légumes, 1 c. à café d'huile d'olive": "200 g d l7ommos mtyyeb, Yaourt, Portion kbira d l-khodra, Ma3la9a sghira d zit z-zitun", "200 g de lentilles cuites, 60 g de riz (cru), grande portion de légumes": "200 g d l3dess mtyyeb, 60 g d rz (nay), Portion kbira d l-khodra", "200 g de lentilles ou de pois chiches cuits, 60 g de riz (cru), grande portion de légumes": "200 g d l3dess wla l7ommos mtyyeb, 60 g d rz (nay), Portion kbira d l-khodra", "200 g de pois chiches cuits, 60 g de riz (cru), grande portion de légumes": "200 g d l7ommos mtyyeb, 60 g d rz (nay), Portion kbira d l-khodra", "Menus adaptés": "Menus mnasbin", "Menus : plus légers pour la perte de poids, la tonification et le maintien (yaourt nature, fruits, plus de légumes) ; la prise de masse garde ses menus riches.": "Les menus: akhaff l-nqs l-wzn, t-tawnif u l-muhafaza (yaourt nature, fwakih, khodra aktar); zyadat l-kutla kat-bqa b-menus dyalha l-ghniyin."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Dernier repas avant 20 h 30": "Last meal before 8:30 pm", "Le dernier repas est ramené à 20 h 30 au plus tard ; les repas précédents se décalent si besoin (2 h d'écart minimum).": "The last meal is moved to 8:30 pm at the latest; earlier meals shift if needed (at least 2 h apart).", "Avec le dîner": "With dinner", "Horaires des repas : tu les choisis dans Réglages > Heures des repas, avec l'option « dernier repas avant 20 h 30 ».": "Meal times: you choose them in Settings > Meal times, with the \"last meal before 8:30 pm\" option."}, "ar": {"Dernier repas avant 20 h 30": "آخر وجبة قبل 20:30", "Le dernier repas est ramené à 20 h 30 au plus tard ; les repas précédents se décalent si besoin (2 h d'écart minimum).": "تُنقل الوجبة الأخيرة إلى 20:30 على أبعد تقدير، وتُزاح الوجبات السابقة عند الحاجة (بفارق ساعتين على الأقل).", "Avec le dîner": "مع العشاء", "Horaires des repas : tu les choisis dans Réglages > Heures des repas, avec l'option « dernier repas avant 20 h 30 ».": "مواعيد الوجبات: تختارها في الإعدادات > مواعيد الوجبات، مع خيار «آخر وجبة قبل 20:30»."}, "ma": {"Dernier repas avant 20 h 30": "Akhir wajba qbel 20:30", "Le dernier repas est ramené à 20 h 30 au plus tard ; les repas précédents se décalent si besoin (2 h d'écart minimum).": "Akhir wajba kat-t-qddem l-20:30 f akther t-tqdir; l-wajabat li qbelha kat-t7errek ila khassha (sa3tin 3la l-aqell).", "Avec le dîner": "M3a l-3sha", "Horaires des repas : tu les choisis dans Réglages > Heures des repas, avec l'option « dernier repas avant 20 h 30 ».": "W9at l-wajabat: nta li kat-khtarhom f Réglages > W9at l-wajabat, m3a l-khiyar \"akhir wajba qbel 20:30\"."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Objectif atteint, bravo.": "Goal reached, well done.", "En retard sur ton objectif : bois un verre maintenant.": "Behind your goal: drink a glass now.", "Tu es dans le rythme.": "You are on track.", "Objectif calculé : 30 ml par kg, plus 500 ml les jours de séance.": "Target calculated: 30 ml per kg, plus 500 ml on workout days."}, "ar": {"Objectif atteint, bravo.": "تم بلوغ الهدف، أحسنت.", "En retard sur ton objectif : bois un verre maintenant.": "متأخر عن هدفك: اشرب كأسا الآن.", "Tu es dans le rythme.": "أنت في الوتيرة المطلوبة.", "Objectif calculé : 30 ml par kg, plus 500 ml les jours de séance.": "الهدف محسوب: 30 مل لكل كيلوغرام، زائد 500 مل في أيام التمرين."}, "ma": {"Objectif atteint, bravo.": "Wslti l-hadaf, bravo.", "En retard sur ton objectif : bois un verre maintenant.": "Mt2khkher 3la l-hadaf dyalek: shreb kas daba.", "Tu es dans le rythme.": "Nta f r-rytm.", "Objectif calculé : 30 ml par kg, plus 500 ml les jours de séance.": "L-hadaf m7sub: 30 ml l-kol kilo, zayd 500 ml f iyyam t-tmrin."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Rappel d'eau": "Water reminder", "Toutes les 2 h entre 10 h et 18 h, seulement si tu es en retard sur ton objectif.": "Every 2 h between 10 am and 6 pm, only if you are behind your goal.", "Pense à boire : un verre d'eau maintenant.": "Remember to drink: a glass of water now.", "Rappel : Pense à boire : un verre d'eau maintenant.": "Reminder: Remember to drink: a glass of water now."}, "ar": {"Rappel d'eau": "تذكير بالماء", "Toutes les 2 h entre 10 h et 18 h, seulement si tu es en retard sur ton objectif.": "كل ساعتين بين 10 صباحا و6 مساء، فقط إذا كنت متأخرا عن هدفك.", "Pense à boire : un verre d'eau maintenant.": "تذكّر أن تشرب: كأس ماء الآن.", "Rappel : Pense à boire : un verre d'eau maintenant.": "تذكير: تذكّر أن تشرب: كأس ماء الآن."}, "ma": {"Rappel d'eau": "Tadkir d l-ma", "Toutes les 2 h entre 10 h et 18 h, seulement si tu es en retard sur ton objectif.": "Kol sa3tin bin 10 u 18, ghir ila knti mt2khkher 3la l-hadaf dyalek.", "Pense à boire : un verre d'eau maintenant.": "Tfekker tshreb: kas d l-ma daba.", "Rappel : Pense à boire : un verre d'eau maintenant.": "Tadkir: Tfekker tshreb: kas d l-ma daba."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Nouveau record": "New record", "Prochain objectif": "Next goal"}, "ar": {"Nouveau record": "رقم قياسي جديد", "Prochain objectif": "الهدف التالي"}, "ma": {"Nouveau record": "Record jdid", "Prochain objectif": "L-hadaf lli jay"}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Séance express": "Express session", "Environ 15 minutes : échauffement court, 2 séries par exercice. Pas de montée de niveau avec cette version.": "About 15 minutes: short warm-up, 2 sets per exercise. No level-up with this version."}, "ar": {"Séance express": "حصة سريعة", "Environ 15 minutes : échauffement court, 2 séries par exercice. Pas de montée de niveau avec cette version.": "حوالي 15 دقيقة: إحماء قصير، سلسلتان لكل تمرين. لا ترقية في المستوى بهذه النسخة."}, "ma": {"Séance express": "Seance express", "Environ 15 minutes : échauffement court, 2 séries par exercice. Pas de montée de niveau avec cette version.": "Taqriban 15 d l-d9ayi9: skhana qsira, 2 d series f kol tmrin. Ma kayn ta tla9i f l-mustawa b had nsskha."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Photos de progression": "Progress photos", "Tes photos restent uniquement sur ce téléphone, jamais envoyées. Elles ne sont pas dans la sauvegarde.": "Your photos stay only on this phone and are never sent. They are not in the backup.", "Ajouter une photo": "Add a photo", "Touche deux photos pour les comparer.": "Tap two photos to compare them.", "Aucune photo pour l'instant.": "No photos yet.", "Après": "After", "Avant": "Before", "Supprimer": "Delete", "Confirmer : supprimer": "Confirm: delete", "Photo illisible": "Unreadable photo"}, "ar": {"Photos de progression": "صور التقدم", "Tes photos restent uniquement sur ce téléphone, jamais envoyées. Elles ne sont pas dans la sauvegarde.": "تبقى صورك على هذا الهاتف فقط ولا تُرسل أبدا. وهي غير مشمولة في النسخة الاحتياطية.", "Ajouter une photo": "أضف صورة", "Touche deux photos pour les comparer.": "المس صورتين لمقارنتهما.", "Aucune photo pour l'instant.": "لا توجد صور بعد.", "Après": "بعد", "Avant": "قبل", "Supprimer": "حذف", "Confirmer : supprimer": "تأكيد: حذف", "Photo illisible": "صورة غير قابلة للقراءة"}, "ma": {"Photos de progression": "Suwar d t-tqddum", "Tes photos restent uniquement sur ce téléphone, jamais envoyées. Elles ne sont pas dans la sauvegarde.": "Suwar dyalk kay-bqaw ghir f had t-telifoun, ma kaytsiftu ta mra. Ma kaynin-ch f l-copie d sauvegarde.", "Ajouter une photo": "Zid tswira", "Touche deux photos pour les comparer.": "Touchi joj suwar bach tqarenhom.", "Aucune photo pour l'instant.": "Ma kayn ta tswira daba.", "Après": "Mn b3d", "Avant": "9bl", "Supprimer": "Mseh", "Confirmer : supprimer": "Akked: mseh", "Photo illisible": "Tswira ma tqrat-ch"}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Parle dans tes écouteurs": "Speaks through your headphones", "Voix toujours en français": "Voice always in French", "Même si l'application est dans une autre langue": "Even if the app is in another language"}, "ar": {"Parle dans tes écouteurs": "يتحدث في سماعاتك", "Voix toujours en français": "الصوت دائما بالفرنسية", "Même si l'application est dans une autre langue": "حتى لو كان التطبيق بلغة أخرى"}, "ma": {"Parle dans tes écouteurs": "Kay-hder f l-écouteurs dyalk", "Voix toujours en français": "Ṣ-ṣout dima b l-fransawiya", "Même si l'application est dans une autre langue": "Hta ila l-application b logha khra"}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Tabac": "Tobacco", "Suivre ma consommation de tabac": "Track my tobacco use", "Facultatif, privé, sans jugement : un simple compteur par jour": "Optional, private, no judgment: a simple daily counter", "+ 1 cigarette": "+ 1 cigarette", "par jour, 7 derniers jours": "per day, last 7 days", "par jour, 7 jours d'avant": "per day, the 7 days before", "Noter sans te juger. Chaque jour compte. Pour être aidé à arrêter, parles-en à un médecin ou à un pharmacien.": "Note it without judging yourself. Every day counts. To get help quitting, talk to a doctor or a pharmacist."}, "ar": {"Tabac": "التبغ", "Suivre ma consommation de tabac": "تتبع استهلاكي للتبغ", "Facultatif, privé, sans jugement : un simple compteur par jour": "اختياري وخاص وبدون أحكام: عداد يومي بسيط", "+ 1 cigarette": "+ 1 سيجارة", "par jour, 7 derniers jours": "في اليوم، آخر 7 أيام", "par jour, 7 jours d'avant": "في اليوم، الأيام السبعة قبلها", "Noter sans te juger. Chaque jour compte. Pour être aidé à arrêter, parles-en à un médecin ou à un pharmacien.": "سجّل دون أن تحكم على نفسك. كل يوم مهم. للحصول على مساعدة للإقلاع، تحدث مع طبيب أو صيدلي."}, "ma": {"Tabac": "Tbgha", "Suivre ma consommation de tabac": "Tbe3 l-istihlak dyali d tbgha", "Facultatif, privé, sans jugement : un simple compteur par jour": "Ikhtiyari, khass, bla7 7ok9: 3dad bsit f nhar", "+ 1 cigarette": "+ 1 cigarette", "par jour, 7 derniers jours": "f nhar, akhir 7 iyam", "par jour, 7 jours d'avant": "f nhar, 7 iyam lli 9bl", "Noter sans te juger. Chaque jour compte. Pour être aidé à arrêter, parles-en à un médecin ou à un pharmacien.": "Kteb bla ma t7kem 3la rassk. Kol nhar muhim. Bach itsa3dek tw99ef, hder m3a tbib wla saydali."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Douleur": "Pain", "J'ai mal": "I'm in pain", "Arrête et respire": "Stop and breathe", "Ne force pas à travers une douleur. Si elle est vive, brutale ou si elle dure, consulte un médecin ou un kinésithérapeute.": "Do not push through pain. If it is sharp, sudden or lasting, see a doctor or a physiotherapist.", "Passer cet exercice": "Skip this exercise", "Terminer la séance": "End the session", "Douleur signalée": "Pain reported", "Repose-toi. Si la douleur revient ou dure, consulte un médecin ou un kinésithérapeute.": "Rest. If the pain comes back or lasts, see a doctor or a physiotherapist.", "Douleur signalée récemment": "Pain reported recently", "Va doucement sur cet exercice, ou passe-le si ça fait mal.": "Go gently on this exercise, or skip it if it hurts.", "Elle est revenue plusieurs fois : parles-en à un médecin ou à un kinésithérapeute.": "It came back several times: talk to a doctor or a physiotherapist."}, "ar": {"Douleur": "ألم", "J'ai mal": "أشعر بألم", "Arrête et respire": "توقف وتنفس", "Ne force pas à travers une douleur. Si elle est vive, brutale ou si elle dure, consulte un médecin ou un kinésithérapeute.": "لا تواصل رغم الألم. إذا كان حادا أو مفاجئا أو مستمرا، استشر طبيبا أو أخصائي علاج طبيعي.", "Passer cet exercice": "تخطَّ هذا التمرين", "Terminer la séance": "أنهِ الحصة", "Douleur signalée": "ألم مُبلَّغ عنه", "Repose-toi. Si la douleur revient ou dure, consulte un médecin ou un kinésithérapeute.": "ارتح. إذا عاد الألم أو استمر، استشر طبيبا أو أخصائي علاج طبيعي.", "Douleur signalée récemment": "ألم مُبلَّغ عنه مؤخرا", "Va doucement sur cet exercice, ou passe-le si ça fait mal.": "خفف على هذا التمرين، أو تخطَّه إذا كان مؤلما.", "Elle est revenue plusieurs fois : parles-en à un médecin ou à un kinésithérapeute.": "عاد عدة مرات: تحدث مع طبيب أو أخصائي علاج طبيعي."}, "ma": {"Douleur": "Wja3", "J'ai mal": "3ndi l-wja3", "Arrête et respire": "Wqef w tnefes", "Ne force pas à travers une douleur. Si elle est vive, brutale ou si elle dure, consulte un médecin ou un kinésithérapeute.": "Ma tkemmelsh m3a l-wja3. Ila kan 9wi, mfaj2 wla dayem, shuf tbib wla kinesitirapist.", "Passer cet exercice": "Douz had tmrin", "Terminer la séance": "Sali l-seance", "Douleur signalée": "Wja3 msjjel", "Repose-toi. Si la douleur revient ou dure, consulte un médecin ou un kinésithérapeute.": "Rtah. Ila rj3 l-wja3 wla dam, shuf tbib wla kinesitirapist.", "Douleur signalée récemment": "Wja3 msjjel mukhkharan", "Va doucement sur cet exercice, ou passe-le si ça fait mal.": "Mshi b shwiya f had tmrin, wla douzu ila kan kay-weja3.", "Elle est revenue plusieurs fois : parles-en à un médecin ou à un kinésithérapeute.": "Rja3 bzzaf d l-mrat: hder m3a tbib wla kinesitirapist."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Content de te revoir": "Good to see you again", "Dernière séance il y a": "Last session", "jours": "days", "Reprends en douceur : 7 jours allégés, puis retour au programme normal. Ton corps te remerciera.": "Ease back in: one lighter week, then back to the normal program. Your body will thank you.", "Reprendre en douceur": "Ease back in", "Reprendre normalement": "Resume normally"}, "ar": {"Content de te revoir": "سعيد برؤيتك مجددا", "Dernière séance il y a": "آخر حصة قبل", "jours": "أيام", "Reprends en douceur : 7 jours allégés, puis retour au programme normal. Ton corps te remerciera.": "استأنف بلطف: أسبوع خفيف، ثم العودة إلى البرنامج العادي. جسمك سيشكرك.", "Reprendre en douceur": "استأنف بلطف", "Reprendre normalement": "استأنف بشكل عادي"}, "ma": {"Content de te revoir": "Ferhan b shufetek mn jdid", "Dernière séance il y a": "Akhir seance men", "jours": "iyam", "Reprends en douceur : 7 jours allégés, puis retour au programme normal. Ton corps te remerciera.": "Rje3 b shwiya: simana khfifa, mn b3d rje3 l-programme l3adi. Jesmek ghadi yshkerek.", "Reprendre en douceur": "Rje3 b shwiya", "Reprendre normalement": "Rje3 b tari9a 3adiya"}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Les séances sont allégées pendant 7 jours.": "Sessions are lighter for 7 days.", "Reprends en douceur : 7 jours allégés, puis retour au programme normal. Ton corps te remerciera.": "Ease back in: 7 lighter days, then back to the normal program. Your body will thank you."}, "ar": {"Les séances sont allégées pendant 7 jours.": "الحصص خفيفة لمدة 7 أيام.", "Reprends en douceur : 7 jours allégés, puis retour au programme normal. Ton corps te remerciera.": "استأنف بلطف: 7 أيام خفيفة، ثم العودة إلى البرنامج العادي. جسمك سيشكرك."}, "ma": {"Les séances sont allégées pendant 7 jours.": "Sseances khfifin l 7 iyam.", "Reprends en douceur : 7 jours allégés, puis retour au programme normal. Ton corps te remerciera.": "Rje3 b shwiya: 7 iyam khfaf, mn b3d rje3 l-programme l3adi. Jesmek ghadi yshkerek."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Étirements": "Stretching", "3 minutes pour détendre les muscles. Sans forcer, sans rebondir.": "3 minutes to relax your muscles. Don't force, don't bounce.", "Faire les étirements": "Do the stretches", "Étire les pectoraux : avant-bras contre un mur, tourne doucement le buste": "Stretch your chest: forearm against a wall, gently turn your torso", "Étire les cuisses : debout, talon vers la fesse, une jambe puis l'autre": "Stretch your thighs: standing, heel to buttock, one leg then the other", "Étire l'arrière des cuisses : assis, une jambe tendue, penche-toi sans forcer": "Stretch the back of your thighs: seated, one leg straight, lean forward without forcing", "Posture de l'enfant : assis sur les talons, bras devant, dos détendu": "Child's pose: sit on your heels, arms forward, back relaxed", "Respire lentement : cinq grandes respirations, épaules relâchées": "Breathe slowly: five deep breaths, shoulders relaxed"}, "ar": {"Étirements": "تمارين الإطالة", "3 minutes pour détendre les muscles. Sans forcer, sans rebondir.": "3 دقائق لإرخاء العضلات. بدون إجبار وبدون ارتداد.", "Faire les étirements": "قم بتمارين الإطالة", "Étire les pectoraux : avant-bras contre un mur, tourne doucement le buste": "مدّد الصدر: الساعد على الحائط، أدر جذعك ببطء", "Étire les cuisses : debout, talon vers la fesse, une jambe puis l'autre": "مدّد الفخذين: واقفا، الكعب نحو الأرداف، ساقا ثم الأخرى", "Étire l'arrière des cuisses : assis, une jambe tendue, penche-toi sans forcer": "مدّد خلف الفخذين: جالسا، ساق ممدودة، انحنِ دون إجبار", "Posture de l'enfant : assis sur les talons, bras devant, dos détendu": "وضعية الطفل: الجلوس على الكعبين، الذراعان للأمام، الظهر مسترخٍ", "Respire lentement : cinq grandes respirations, épaules relâchées": "تنفس ببطء: خمسة أنفاس عميقة، الكتفان مرتخيان"}, "ma": {"Étirements": "Tmtit", "3 minutes pour détendre les muscles. Sans forcer, sans rebondir.": "3 d l-d9ayi9 bach t-rteh l3adlat. Bla ma tkemmel b l9ouwa, bla ma tn9ez.", "Faire les étirements": "3emmer tmtit", "Étire les pectoraux : avant-bras contre un mur, tourne doucement le buste": "Mtt s-sder: s-sa3ed 3la l-7it, dewwer jesmek b shwiya", "Étire les cuisses : debout, talon vers la fesse, une jambe puis l'autre": "Mtt l-fkhad: wqef, l-ka3b l-l-mu7ayyat, rjel w mn b3d rjel khra", "Étire l'arrière des cuisses : assis, une jambe tendue, penche-toi sans forcer": "Mtt l-fkhad mn lor: gles, rjel mmdouda, tla mn ghir ma tkemmel b l9ouwa", "Posture de l'enfant : assis sur les talons, bras devant, dos détendu": "Wad3iyat t-tfel: gles 3la l-k3ab, dra3in l9dam, d-dher mrteh", "Respire lentement : cinq grandes respirations, épaules relâchées": "Tnefes b shwiya: khamsa d tnefsat 3miqin, l-ktaf mrtehin"}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Ma semaine": "My week", "Semaine": "Week", "poids": "weight", "Partager en image": "Share as image", "Inclure l'évolution du poids dans l'image": "Include weight change in the image"}, "ar": {"Ma semaine": "أسبوعي", "Semaine": "الأسبوع", "poids": "الوزن", "Partager en image": "شارك كصورة", "Inclure l'évolution du poids dans l'image": "أدرج تغير الوزن في الصورة"}, "ma": {"Ma semaine": "Simana dyali", "Semaine": "Simana", "poids": "l-wzn", "Partager en image": "Shari f tswira", "Inclure l'évolution du poids dans l'image": "Dkhel t-tghyir d l-wzn f t-tswira"}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Attention :": "Warning:", "si tu effaces les données du site dans Chrome, les photos disparaissent. Exporte-les de temps en temps.": "if you clear the site data in Chrome, the photos disappear. Export them from time to time.", "Importer des photos": "Import photos", "Exporter les photos": "Export photos", "Dernier export :": "Last export:", "Jamais exporté": "Never exported", "Fichier non reconnu": "File not recognized", "Aucune nouvelle photo": "No new photos", "Photos importées": "Photos imported"}, "ar": {"Attention :": "تنبيه:", "si tu effaces les données du site dans Chrome, les photos disparaissent. Exporte-les de temps en temps.": "إذا مسحت بيانات الموقع في كروم، تختفي الصور. صدّرها من حين لآخر.", "Importer des photos": "استيراد الصور", "Exporter les photos": "تصدير الصور", "Dernier export :": "آخر تصدير:", "Jamais exporté": "لم تُصدَّر أبدا", "Fichier non reconnu": "ملف غير معروف", "Aucune nouvelle photo": "لا توجد صور جديدة", "Photos importées": "تم استيراد الصور"}, "ma": {"Attention :": "T3ejjel:", "si tu effaces les données du site dans Chrome, les photos disparaissent. Exporte-les de temps en temps.": "ila mshti l-ma3lumat d l-site f Chrome, s-suwar katmshi. Sddrhom men w9t l-akhor.", "Importer des photos": "Jib suwar", "Exporter les photos": "Sddr s-suwar", "Dernier export :": "Akhir tsdir:", "Jamais exporté": "Mabqatsh tsddrat", "Fichier non reconnu": "Fichier ma t3rfsh", "Aucune nouvelle photo": "Ma kayn ta tswira jdida", "Photos importées": "Suwar tjabu"}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();

(function(){
  var X = {"en": {"Enregistrement impossible : stockage plein ou bloqué. Sauvegarde tes données maintenant.": "Saving failed: storage is full or blocked. Back up your data now."}, "ar": {"Enregistrement impossible : stockage plein ou bloqué. Sauvegarde tes données maintenant.": "تعذر الحفظ: التخزين ممتلئ أو محظور. احفظ نسخة احتياطية من بياناتك الآن."}, "ma": {"Enregistrement impossible : stockage plein ou bloqué. Sauvegarde tes données maintenant.": "Ma tsjjelsh: t-takhzin mmtli wla mqfoul. Dir sauvegarde l-ma3lumat dyalk daba."}};
  Object.keys(X).forEach(function (l) { if (LANG_DATA[l]) Object.keys(X[l]).forEach(function (k) { if (!(k in LANG_DATA[l].w)) LANG_DATA[l].w[k] = X[l][k]; }); });
})();
startI18n();
/* © KVES · Coach-Mass-KVES */
applyRotate();
render();
requestAnimationFrame(frame);
if (needOnboarding()) setTimeout(showOnboarding, 300); else setTimeout(checkUpdate, 700);
if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); }); }
window.__coach = { D: function () { return D; }, startSession: startSession, render: render, setTab: function (t) { tab = t; render(); } };
})();
