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

// Profil complet de l'utilisateur
const PROFIL_SANTE = `
━━━ PROFIL DE L'UTILISATEUR ━━━
Homme, 52 ans, 175 cm, 68 kg — France
Ex-fumeur (30 ans, arrêt il y a 5 ans)
Sédentaire depuis 1 an (télétravail) — embonpoint ceinture abdominale
Seule activité physique : aviron le week-end (actuellement en pause — douleur épaule)

━━━ RÉSULTATS SANGUINS (à améliorer) ━━━
- Glycémie à jeun : 1,13 g/L (norme 0,74–1,06) → HORS NORME — risque pré-diabète
- Cholestérol total : 2,29 g/L (souhaité <2,00) → ÉLEVÉ
- LDL : 1,57 g/L (cible entre 1,00 et 0,70 selon risque) → ÉLEVÉ
- HDL : 0,54 g/L (souhaité >0,62) → BAS
- Non-HDL : 1,74 g/L (souhaité <1,30) → ÉLEVÉ
- Triglycérides : 0,87 g/L → OK
- Fonction rénale, foie, thyroïde : normales

━━━ OBJECTIFS SANTÉ ━━━
1. Réduire LDL de 10-15% en 3 mois (via fibres solubles, graisses insaturées, réduction graisses saturées)
2. Améliorer la glycémie à jeun (IG bas strict, protéines + fibres à chaque repas)
3. Perdre 2-3 kg de graisse abdominale en 6 mois
4. Améliorer le HDL (via activité physique et alimentation)
5. Bilan sanguin de contrôle à 3 mois et 6 mois`.trim();

// Schéma nutritionnel quotidien
const SCHEMA_NUTRITIONNEL = `
━━━ SCHÉMA NUTRITIONNEL DE L'UTILISATEUR ━━━

PETIT-DÉJEUNER (nouvelle habitude en cours d'installation) :
- Eau citronnée + 1 fruit de saison + oléagineux (amandes, noix, noisettes)
- + fromage blanc 0-3% avec miel OU yaourt nature OU 2 œufs + pain seigle

COLLATION MIDI (habitude de ne pas déjeuner — on adapte, pas on impose) :
- Rapide, frais, cru, préparation max 5 minutes, mangeable au bureau
- Option 1 : bâtonnets carottes/concombre + houmous ou tzatziki
- Option 2 : 1 fruit + poignée de noix
- Option 3 : smoothie vert (épinards, banane, lait amande, graines lin)
- Option 4 : radis + œuf dur + huile de colza
- Option 5 : salade de fruits de saison + yaourt + graines de courge
- PAS de repas cuisiné le midi, PAS de plat chaud

DÎNER (repas principal, apports nutritionnels majeurs) :
- 1/2 assiette : légumes de saison (cuits ou crus en entrée)
- 1/4 assiette : protéines (volailles, légumineuses, œufs — poisson très occasionnel)
- 1/4 assiette : féculents complets (quinoa, riz basmati, boulgour, lentilles)
- 1 cuillère à soupe : bonnes graisses (huile d'olive ou colza)
- Style cuisine : FRANÇAIS TERROIR — plats mijotés, soupes, gratins allégés, poêlées

━━━ RÈGLES PROTÉINES (ordre de priorité) ━━━
1. Légumineuses (lentilles, pois chiches, haricots secs) : PRIORITÉ ABSOLUE — 3 à 4 fois/semaine
2. Volailles (poulet, dinde sans peau) : 2 à 3 fois/semaine
3. Œufs : 1 à 2 fois/semaine
4. Poisson blanc ou gras : MAXIMUM 1 FOIS TOUTES LES 2 SEMAINES (habitude à construire progressivement, pas une priorité)
5. Viande rouge/charcuterie : JAMAIS dans les recettes proposées

━━━ OMÉGA-3 : SOURCES VÉGÉTALES PRIORITAIRES ━━━
Les oméga-3 sont couverts par les végétaux, pas besoin de forcer le poisson :
- Huile de colza : systématiquement dans les vinaigrettes et cuissons douces
- Noix (5-6 par jour dans les collations)
- Graines de lin moulues : 1 cuillère à soupe dans yaourt/salade/soupe
- Graines de chia dans smoothies et fromage blanc

━━━ ALIMENTS À ÉVITER DANS LES RECETTES ━━━
- Charcuterie (saucisson, rillettes, pâtés, lardons)
- Fromages gras >45% MG en quantité importante
- Beurre en cuisson (acceptable en finition, max 10g)
- Crème fraîche épaisse (remplacer par crème légère 15% ou fromage blanc)
- Farine blanche T45, pain blanc
- Sucres rapides, miel en grande quantité
- Fritures`.trim();

// Contraintes de préparation
const CONTRAINTES_PRATIQUES = `
━━━ CONTRAINTES PRATIQUES ━━━
- Cuisine : française terroir — plats simples du quotidien, pas de cuisine exotique imposée
- Temps de préparation : max 30 minutes
- Temps de cuisson : max 45 minutes
- Quantité : pour 2 personnes
- Budget : raisonnable (ingrédients du marché français, pas d'exotisme coûteux)
- Équipement : cuisine standard (pas de matériel professionnel)
- Style attendu : blanquette allégée, potée, gratin léger, soupe, poêlée, omelette, salade composée...`.trim();

// Sites de référence recettes (liste par défaut)
const SITES_RESSOURCES_DEFAUT = [
  { url: 'https://cuisinerigbas.com', desc: 'Cuisine IG bas quotidienne, plats mijotés, terroir adapté' },
  { url: 'https://www.lanutrition.fr/cuisine-et-recettes/recettes-sante/index-glycemique-bas', desc: 'Recettes IG bas validées scientifiquement, légumineuses, céréales complètes' },
  { url: 'https://www.santemagazine.fr/alimentation/regime-alimentaire/regime-anti-cholesterol/une-semaine-de-menus-anticholesterol-173890', desc: 'Menus anti-cholestérol cuisine familiale française, huile colza/noix' },
  { url: 'https://www.primevere.com/idees-recettes/plats/', desc: 'Plats terroir/famille allégés cholestérol (pizzas, gratins, parmentier, falafels)' },
  { url: 'https://bienvenuechezvero.fr/recettes-ig-bas-idees-menus', desc: 'Blog IG bas familial, légumineuses, bons gras, féculents complets' },
  { url: 'https://saines-gourmandises.fr/ig-bas-forme-et-minceur/', desc: 'Cuisine terroir gourmande IG bas, tartes salées, gratins, pains complets' },
  { url: 'http://www.adoptelacuisineigbas.com', desc: 'Recettes quotidiennes IG bas, légumes, légumineuses, farines complètes' },
  { url: 'https://jow.fr/blog/posts/quest-ce-que-lalimentation-a-ig-bas', desc: 'Recettes et conseils IG bas, féculents complets, association protéines/fibres/graisses' },
  { url: 'https://www.cuisineaz.com/diaporamas/15-recettes-anti-cholesterol-toujours-plus-folles-4102/interne/1.aspx', desc: 'Recettes anti-cholestérol gourmandes, poulet, légumes, féculents' },
  { url: 'https://www.marieclaire.fr/cuisine/18-recettes-anti-cholesterol-saines-et-gourmandes,1453308.asp', desc: 'Recettes anti-cholestérol cuisine française et méditerranéenne' },
  { url: 'https://www.passionnutrition.com/baisser-le-cholesterol/', desc: 'Diététicienne IG bas, recettes cholestérol, association fibres+protéines+bonnes graisses' },
  { url: 'https://www.cuisineaz.com/diaporamas/15-recettes-a-ig-bas-a-deguster-toute-l-annee-3913/interne/1.aspx', desc: 'Sélection recettes IG bas toute l\'année, féculents complets, légumes' },
  { url: 'https://www.isabellehuot.com/blogs/recettes-et-conseils/tagged/cholesterol', desc: 'Recettes santé cholestérol, petits-déjeuners protéinés, collations crues' },
];

/**
 * Génère le bloc "sites de référence" pour les prompts.
 * @param {Array} sitesExtra - sites supplémentaires ajoutés par l'utilisateur via le chat
 */
function getSitesRessources(sitesExtra) {
  const tous = [...SITES_RESSOURCES_DEFAUT, ...(sitesExtra || [])];
  return `━━━ SITES DE RÉFÉRENCE RECETTES ━━━
Inspire-toi de ces sources pour proposer des recettes adaptées au profil :
${tous.map(s => `- ${s.url} — ${s.desc}`).join('\n')}`;
}

module.exports = {
  getContexteSaisonnier,
  getInstructionsSaisonnieres,
  getSitesRessources,
  SITES_RESSOURCES_DEFAUT,
  PROFIL_SANTE,
  SCHEMA_NUTRITIONNEL,
  CONTRAINTES_PRATIQUES
};
