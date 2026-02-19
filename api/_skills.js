// ============================================================
// _skills.js — Compétences centralisées de NutriCoach
// Modifier CE fichier pour enrichir les connaissances de Claude
// ============================================================

const MOIS_FR = ['janvier','février','mars','avril','mai','juin',
                 'juillet','août','septembre','octobre','novembre','décembre'];

// Tableau maître : chaque légume/fruit avec ses mois de disponibilité en France
// Mois : 1=janvier ... 12=décembre
const LEGUMES_SAISON = {
  'poireaux':           [1,2,3,11,12],
  'carottes':           [1,2,3,9,10,11,12],
  'navets':             [1,2,3,10,11,12],
  'céleri-rave':        [1,2,10,11,12],
  'panais':             [1,2,3,10,11,12],
  'butternut':          [1,2,9,10,11,12],
  'potimarron':         [9,10,11,12],
  'chou blanc':         [1,2,10,11,12],
  'chou rouge':         [1,10,11,12],
  'chou de Bruxelles':  [1,2,11,12],
  'chou frisé':         [1,2,11,12],
  'chou-fleur':         [3,9,10,11],
  'brocolis':           [3,9,10,11],
  'endives':            [1,2,3,11,12],
  'mâche':              [1,2,3,11,12],
  'betterave':          [1,2,9,10,11,12],
  'topinambour':        [1,2,10,11,12],
  'salsifis':           [1,12],
  'épinards':           [1,2,3,4,5,9,10,11,12],
  'oignon':             [1,2,3,4,5,6,7,8,9,10,11,12],
  'ail':                [1,2,6,7,9,10,11,12],
  'radis':              [3,4,5],
  'asperges':           [4,5],
  'petits pois':        [4,5,6],
  'artichaut':          [4,5,6,9],
  'laitue':             [4,5,6,7,8],
  'roquette':           [4,5,6],
  'bette':              [4,5,6,7,8],
  'oignon nouveau':     [4,5,6],
  'fèves':              [5,6],
  'courgettes':         [5,6,7,8,9],
  'tomates':            [6,7,8,9],
  'poivrons':           [6,7,8,9],
  'haricots verts':     [6,7,8,9],
  'concombre':          [6,7,8],
  'fenouil':            [6,7,8,9],
  'basilic frais':      [6,7,8],
  'aubergines':         [7,8,9],
  'maïs':               [7,8,9],
  'courges':            [9,10,11,12],
  'champignons frais':  [9,10,11],
};

const FRUITS_SAISON = {
  'pommes':         [1,2,3,9,10,11,12],
  'poires':         [1,2,3,9,10,11,12],
  'clémentines':    [1,2,11,12],
  'oranges':        [1,2,3,11,12],
  'kiwi':           [1,2,3,4,11,12],
  'citrons':        [1,2,3,4,5,6,7,8,9,10,11,12],
  'pamplemousse':   [1,2,3,11,12],
  'banane':         [1,2,3,4,5,6,7,8,9,10,11,12],
  'fraises':        [3,4,5,6],
  'rhubarbe':       [4,5,6],
  'cerises':        [5,6],
  'framboises':     [6,7,8,9],
  'abricots':       [6,7,8],
  'melon':          [6,7,8,9],
  'pêches':         [6,7,8,9],
  'nectarines':     [6,7,8,9],
  'pastèque':       [7,8],
  'figues':         [8,9,10],
  'raisins':        [9,10],
  'prunes':         [7,8,9],
  'coings':         [10,11],
  'châtaignes':     [10,11,12],
  'mûres':          [8,9],
  'myrtilles':      [7,8],
};

// Calendrier saisonnier (liste positive par mois, pour affichage)
const CALENDRIER = {
  1:  {
    legumes: 'poireaux, carottes, navets, céleri-rave, panais, butternut, potimarron, chou blanc, chou rouge, chou de Bruxelles, chou frisé, endives, mâche, betterave, topinambour, salsifis, épinards, ail, oignon',
    fruits:  'pommes (reinette, gala, golden), poires, clémentines, oranges, kiwi, citrons, pamplemousse, mandarine'
  },
  2:  {
    legumes: 'poireaux, carottes, navets, céleri-rave, panais, butternut, chou blanc, chou de Bruxelles, chou frisé, endives, mâche, épinards, betterave, topinambour, ail, oignon',
    fruits:  'pommes, poires, oranges, kiwi, citrons, pamplemousse, clémentines (fin saison)'
  },
  3:  {
    legumes: 'poireaux, carottes, navets, épinards, radis, mâche, endives, chou-fleur, brocolis, ail, oignon — asperges et petits pois arrivent fin mars',
    fruits:  'pommes, poires, oranges, kiwi, fraises (toute fin mars uniquement)'
  },
  4:  {
    legumes: 'asperges vertes et blanches, petits pois, artichaut, radis, épinards, roquette, carottes nouvelles, laitue, bette, oignon nouveau, ciboulette',
    fruits:  'fraises, rhubarbe, kiwi'
  },
  5:  {
    legumes: 'asperges, petits pois, fèves, artichaut, courgettes (début), radis, laitue, bette, épinards, roquette, oignon nouveau',
    fruits:  'fraises, cerises, rhubarbe, melon (début fin mai)'
  },
  6:  {
    legumes: 'courgettes, tomates, poivrons, haricots verts, concombre, petits pois, bette, artichaut, fenouil, basilic, ail nouveau',
    fruits:  'fraises, cerises, framboises, abricots, melon, pêches, nectarines (début)'
  },
  7:  {
    legumes: 'tomates, courgettes, aubergines, poivrons, haricots verts, concombre, maïs, fenouil, oignons, bette, basilic, persil',
    fruits:  'pêches, nectarines, abricots, framboises, myrtilles, melon, pastèque, cerises, prunes (début)'
  },
  8:  {
    legumes: 'tomates, courgettes, aubergines, poivrons, haricots verts, maïs, fenouil, concombre, courges (début), basilic',
    fruits:  'pêches, nectarines, prunes, figues, raisins, melon, pastèque, framboises, mûres'
  },
  9:  {
    legumes: 'courges, potimarron, butternut, champignons (cèpes, girolles), poireaux, carottes, brocolis, chou-fleur, choux, haricots verts, poivrons, fenouil, épinards (retour)',
    fruits:  'raisins, pommes, poires, figues, prunes, coings, mûres, framboises (fin)'
  },
  10: {
    legumes: 'courges, potimarron, butternut, champignons, poireaux, carottes, navets, brocolis, chou-fleur, céleri, choux, épinards, betterave, panais, topinambour',
    fruits:  'pommes, poires, raisins, coings, châtaignes, figues (fin)'
  },
  11: {
    legumes: 'poireaux, carottes, navets, céleri, panais, butternut, potimarron, chou, chou de Bruxelles, chou frisé, endives, mâche, betterave, champignons, épinards, topinambour',
    fruits:  'pommes, poires, coings, clémentines, oranges, châtaignes, kiwi'
  },
  12: {
    legumes: 'poireaux, carottes, navets, céleri-rave, panais, butternut, chou blanc, chou rouge, chou de Bruxelles, endives, mâche, betterave, topinambour, salsifis, ail, oignon',
    fruits:  'pommes, poires, clémentines, oranges, kiwi, citrons, pamplemousse'
  }
};

/**
 * Retourne le contexte date + saison actuel
 */
function getContexteSaisonnier() {
  const now = new Date();
  const mois = now.getMonth() + 1;
  const jour = now.getDate();
  const annee = now.getFullYear();
  const nomMois = MOIS_FR[mois - 1];
  const saison = mois >= 3 && mois <= 5 ? 'printemps' :
                 mois >= 6 && mois <= 8 ? 'été' :
                 mois >= 9 && mois <= 11 ? 'automne' : 'hiver';

  return {
    dateStr: `${jour} ${nomMois} ${annee}`,
    mois: nomMois,
    moisNum: mois,
    annee,
    saison,
    legumes: CALENDRIER[mois].legumes,
    fruits: CALENDRIER[mois].fruits
  };
}

/**
 * Génère le bloc "instructions saisonnières" à injecter dans les prompts.
 * Inclut la liste positive (autorisés) ET la liste interdite dynamique (tout le reste).
 */
function getInstructionsSaisonnieres(ctx) {
  const moisNum = ctx.moisNum;

  // Construire dynamiquement la liste des produits interdits ce mois-ci
  const legumesForbids = Object.keys(LEGUMES_SAISON)
    .filter(l => !LEGUMES_SAISON[l].includes(moisNum))
    .join(', ');

  const fruitsForbids = Object.keys(FRUITS_SAISON)
    .filter(f => !FRUITS_SAISON[f].includes(moisNum))
    .join(', ');

  return `
━━━ DATE ET SAISON ━━━
Aujourd'hui : ${ctx.dateStr} — ${ctx.saison} en France
Pays : France (climat tempéré, 4 saisons)

━━━ LÉGUMES AUTORISÉS EN ${ctx.mois.toUpperCase()} ━━━
${ctx.legumes}

━━━ FRUITS AUTORISÉS EN ${ctx.mois.toUpperCase()} ━━━
${ctx.fruits}

⛔ INTERDITS EN ${ctx.mois.toUpperCase()} — NE JAMAIS UTILISER CES PRODUITS :
Légumes hors saison : ${legumesForbids}
Fruits hors saison : ${fruitsForbids}

⚠️ RÈGLE ABSOLUE SAISONNALITÉ :
- Utiliser UNIQUEMENT les légumes et fruits de la liste AUTORISÉS ci-dessus
- Aucune recette ne doit contenir un seul légume ou fruit de la liste INTERDITS
- Les légumineuses (lentilles, pois chiches, haricots SECS) et les céréales (quinoa, riz, boulgour) sont disponibles toute l'année
- En cas de doute sur un produit, ne pas l'utiliser`.trim();
}

// Profil santé de l'utilisateur
const PROFIL_SANTE = `
━━━ PROFIL SANTÉ DE L'UTILISATEUR ━━━
Localisation : France
Objectif 1 : Réduire le cholestérol LDL de 10-15% en 3 mois
Objectif 2 : Améliorer la glycémie à jeun
Objectif 3 : Perdre 2-3 kg de graisse abdominale en 6 mois
Suivi médical : bilan sanguin à 3 mois et 6 mois
Régime actuel : transition vers alimentation IG bas + anti-cholestérol`.trim();

// Schéma nutritionnel quotidien
const SCHEMA_NUTRITIONNEL = `
━━━ SCHÉMA NUTRITIONNEL OBLIGATOIRE ━━━
Petit-déjeuner : eau citronnée + 1 fruit de saison + oléagineux + [fromage blanc 0-3% OU yaourt nature OU 2 œufs + pain seigle]
Collation midi : [crudités de saison + houmous/tzatziki] OU [fruits + noix] OU [smoothie vert épinards-banane]
Dîner : 1/2 légumes de saison + 1/4 protéines maigres + 1/4 féculents complets
Hydratation : eau citronnée le matin, 1,5L eau par jour

Aliments AUTORISÉS :
- Légumineuses SÈCHES : lentilles, pois chiches, haricots secs (2×/semaine min)
- Poisson : cabillaud, colin, saumon, sardines, maquereau (2×/semaine min)
- Volailles : poulet, dinde sans peau
- Œufs : max 1/jour
- Céréales complètes : riz basmati, quinoa, boulgour, pain seigle/complet
- Graisses : huile d'olive, huile de colza, noix, amandes, noisettes, graines de lin
- Produits laitiers allégés : fromage blanc 0-3%, yaourt nature

Aliments À ÉVITER :
- Viande rouge, charcuterie, saucisses
- Beurre en excès, crème fraîche épaisse, fromages gras
- Farine blanche T45, pain blanc, viennoiseries
- Sucres rapides, sodas, jus de fruits industriels
- Alcool (max 2-3 verres de vin/semaine)`.trim();

// Contraintes de préparation
const CONTRAINTES_PRATIQUES = `
━━━ CONTRAINTES PRATIQUES ━━━
- Temps de préparation : max 30 minutes
- Temps de cuisson : max 45 minutes
- Quantité : pour 2 personnes
- Budget : raisonnable (pas d'ingrédients exotiques coûteux)
- Équipement : cuisine standard (pas de matériel professionnel)`.trim();

module.exports = {
  getContexteSaisonnier,
  getInstructionsSaisonnieres,
  PROFIL_SANTE,
  SCHEMA_NUTRITIONNEL,
  CONTRAINTES_PRATIQUES
};
