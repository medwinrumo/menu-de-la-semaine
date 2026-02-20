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
  'champignons frais':  [1,2,3,4,5,6,7,8,9,10,11,12],
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
    legumes: 'poireaux, carottes, navets, céleri-rave, panais, butternut, chou blanc, chou de Bruxelles, chou frisé, endives, mâche, épinards, betterave, topinambour, champignons (de Paris, shiitake, pleurotes), ail, oignon',
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
- Quantité : pour 2 personnes (homme 52 ans + femme 41 ans)
- Budget : raisonnable (ingrédients du marché français, pas d'exotisme coûteux)
- Équipement : cuisine standard (pas de matériel professionnel)
- Style attendu : blanquette allégée, potée, gratin léger, soupe, poêlée, omelette, salade composée...`.trim();

// ============================================================
// COMPÉTENCES NUTRITIONNELLES FONDAMENTALES
// Sources : ANSES (2011, 2016, 2019), ESC/EAS Guidelines (2019),
// AHA/ACC (2018), ADA Standards of Care (2023), EFSA (2011, 2012),
// Foster-Powell et al. (Am J Clin Nutr, 2002), Atkinson et al. (2008),
// DPP Study (NEJM, 2002), Shukla et al. (Diabetes Care, 2015),
// Mozaffarian & Wu (JACC, 2011)
// ============================================================
const COMPETENCES_NUTRITIONNELLES = `
━━━ COMPÉTENCES NUTRITIONNELLES FONDAMENTALES ━━━

## 1. INDEX GLYCÉMIQUE (IG) ET CHARGE GLYCÉMIQUE (CG)
Réf : Foster-Powell (2002), Atkinson (2008), International GI Tables

Définitions :
- IG bas < 55 | IG modéré 55-70 | IG élevé > 70 (référence glucose = 100)
- Charge glycémique (CG) = (IG × glucides en g) / 100 → CG basse < 10, élevée > 20

Tableau IG des aliments courants :
FÉCULENTS ET CÉRÉALES
- Pain blanc : IG 75 | Pain complet : IG 65 | Pain seigle complet : IG 45 | Pain au levain : IG 54
- Riz blanc classique : IG 72 | Riz basmati : IG 50 | Riz complet : IG 50
- Quinoa : IG 53 | Boulgour : IG 46 | Sarrasin : IG 40
- Pâtes al dente : IG 45 | Pâtes bien cuites : IG 65
- Flocons d'avoine crus : IG 40 | Son d'avoine : IG 15
- Pomme de terre vapeur : IG 65 | Au four : IG 85 | Purée : IG 80
- Patate douce : IG 44 | Châtaigne : IG 60

LÉGUMINEUSES (toutes IG bas — priorité absolue pour ce profil)
- Lentilles vertes : IG 25 | Lentilles corail : IG 26
- Pois chiches : IG 28 | Haricots rouges : IG 24 | Haricots blancs : IG 31
- Fèves cuites : IG 40 | Pois cassés : IG 32

FRUITS
- Pomme : IG 35 | Poire : IG 38 | Agrumes : IG 35 | Cerise : IG 25
- Fraise : IG 25 | Kiwi : IG 50 | Banane mûre : IG 65 | Melon : IG 67
- Pastèque : IG 75 mais CG très basse (peu de glucides par portion)

PRODUITS LAITIERS
- Yaourt nature : IG 36 | Fromage blanc 0% : IG 30 | Lait entier : IG 31

Facteurs qui RÉDUISENT l'IG effectif d'un repas :
1. La cuisson courte (al dente) vs prolongée — toujours privilégier les pâtes/riz pas trop cuits
2. L'amidon rétrogradé : riz ou PDT cuits puis refroidis → IG -15 à -20%
3. L'acidité (citron, vinaigre de cidre) réduit l'IG du repas de 20-34% (Johnston, 2004)
4. Les fibres (légumes en début de repas forment une barrière physique)
5. Les lipides insaturés (huile d'olive, colza) ralentissent la vidange gastrique
6. Les protéines stimulent l'insuline sans élever la glycémie

Séquence optimale dans l'assiette (Shukla et al., Diabetes Care, 2015) :
→ Légumes EN PREMIER → protéines → féculents EN DERNIER
→ Réduit la glycémie post-prandiale de 37% vs ordre inverse

## 2. CHOLESTÉROL : MÉCANISMES ET LEVIERS ALIMENTAIRES
Réf : ESC/EAS Guidelines 2019, AHA/ACC 2018, ANSES 2011

Physiopathologie :
- LDL oxydé s'accumule dans les parois artérielles → plaques d'athérome
- HDL assure le transport inverse → protecteur cardiovasculaire
- Non-HDL = marqueur athérogène plus complet que LDL seul (ESC 2019)

Cibles pour ce profil (risque modéré ESC) :
- LDL cible : < 1,00 g/L | Non-HDL cible : < 1,30 g/L | HDL cible : > 0,62 g/L

LEVIERS ALIMENTAIRES ANTI-LDL (efficacité cliniquement documentée) :

Fibres solubles (réduction LDL -5 à -10% pour 5-10g/jour) :
- Bêta-glucanes d'avoine : 3g/jour = -5% LDL (EFSA 2011) → flocons d'avoine, son d'avoine
- Pectines (pommes, agrumes, légumineuses) : 6g/jour = -6% LDL
- Psyllium : 10g/jour = -7% LDL
→ Intégrer flocons d'avoine au petit-déj ou pomme en collation CHAQUE JOUR

Phytostérols (-10 à -15% LDL pour 2g/jour — ESC 2019) :
- Présents dans : huile de colza, noix, légumineuses, céréales complètes, graines
- Mécanisme : compétition avec absorption intestinale du cholestérol
→ Huile de colza comme graisse principale = effet phytostérol + oméga-3

Graisses insaturées (remplacement graisses saturées → -15% LDL) :
- AGMI (acide oléique — huile d'olive) : protège le LDL contre l'oxydation
- AGPI oméga-3 (ALA — huile colza, noix, lin) : effet anti-triglycérides + anti-inflammatoire
→ Huile d'olive pour cuisson, huile de colza pour vinaigrettes = combinaison optimale

Graisses saturées à réduire (cause principale du LDL élevé) :
- Charcuterie, fromages >45% MG, beurre en excès, crème épaisse
- Réduction <7% des calories totales → -15 à -20% LDL (AHA)
→ Remplacer crème par fromage blanc battu, beurre de cuisson par huile d'olive

Protéines végétales vs animales :
- Légumineuses : protéines + fibres solubles + phytostérols = triple effet bénéfique sur LDL
- Effet documenté : 25g protéines légumineuses/jour → -3 à -5% LDL supplémentaire

Pour remonter le HDL :
- Levier n°1 : activité physique aérobie 150 min/semaine → +5 à +10% HDL (ESC)
- Huile d'olive : protège le HDL contre l'oxydation
- Réduction du tour de taille : -5 à -10% poids → amélioration significative HDL

## 3. GLYCÉMIE PRÉ-DIABÉTIQUE : STRATÉGIES NUTRITIONNELLES
Réf : ANSES 2016, ADA Standards of Care 2023, DPP Study (NEJM 2002)

Contexte (glycémie à jeun 1,13 g/L = hyperglycémie modérée à jeun) :
- Norme : < 1,00 g/L | Pré-diabète : 1,00-1,25 g/L | Diabète : ≥ 1,26 g/L (2 mesures)
- Réversible avec changements de mode de vie dans 50-60% des cas (DPP Study, NEJM 2002)
- La perte de 5-7% du poids suffit à réduire significativement l'insulinorésistance

Mécanisme de l'insulinorésistance abdominale :
La graisse viscérale sécrète des adipokines pro-inflammatoires (TNF-α, IL-6, résistine) qui
altèrent le signal insulinique dans les cellules musculaires et hépatiques → hyperglycémie compensatoire.

Règles nutritionnelles anti-glycémie (à appliquer dans CHAQUE recette) :
1. Association systématique protéines + fibres + lipides insaturés à chaque repas
   → Protéines : ralentissent vidange gastrique, stimulent GLP-1
   → Fibres solubles : forment un gel qui piège les glucides
   → Lipides : ralentissent la vidange gastrique
   → Résultat : pic glycémique post-prandial réduit de 20-40%
2. Ne JAMAIS servir un féculent seul sans légume + protéine au même repas
3. Toujours ajouter un peu de vinaigre ou citron dans l'assaisonnement (-20% glycémie)
4. Légumes en entrée ou au début du plat (barrière glycémique physique)
5. Réduire les glucides raffinés : jamais pain blanc, farine T45, riz très cuit

Timing et repas unique le soir :
- Sensibilité à l'insuline est meilleure le matin (rythme circadien, Shapiro 2017)
- Repas unique le soir = pic glycémique maximal au mauvais moment biologique
- Mitigation : collation protéines + fibres le midi est INDISPENSABLE pour ce profil

## 4. OMÉGA-3 : SOURCES, CONVERSION ET STRATÉGIE VÉGÉTALE
Réf : ANSES 2011 (besoins en acides gras), EFSA 2012, Mozaffarian & Wu (JACC 2011)

Les 3 oméga-3 principaux :
- ALA (alpha-linolénique) — végétal, précurseur
  Sources : huile de lin (57%), graines de lin moulues (57%), noix (12%), huile de colza (9%)
  Recommandation ANSES : 2,2g/jour homme | 1,8g/jour femme
- EPA + DHA — marins, effets cardioprotecteurs directs (réduction triglycérides, anti-arythmique)
  Conversion ALA→EPA : ~5-8% homme | ~21% femme (avantage biologique féminin)
  Sources alimentaires : saumon, sardines, maquereau, hareng (2 portions/semaine pour effets optimaux)

Ratio oméga-6/oméga-3 :
- Idéal : 4:1 (ANSES/OMS) | Alimentation occidentale actuelle : 15-20:1
- Excès oméga-6 (huile de tournesol/maïs) → inhibe conversion ALA→EPA, pro-inflammatoire
→ Remplacer huile de tournesol par huile de colza = amélioration immédiate du ratio

Stratégie oméga-3 sans poisson (priorité pour ce profil) :
- 2 cc huile de colza en assaisonnement = 2,2g ALA (dose journalière homme)
- 5-6 noix = 2,6g ALA
- 1 cs graines de lin moulues dans yaourt/soupe = 2,4g ALA
→ UNE de ces sources par jour = objectif ANSES atteint

## 5. PROFIL FEMME 41 ANS — BESOINS SPÉCIFIQUES
Réf : ANSES PNNS 2019, Menopause Society 2022, EFSA 2017

Contexte hormonal :
- 41 ans = possible début de périménopause (40-45 ans)
- Fluctuations estrogènes → augmentation progressive du risque cardiovasculaire
- Estrogènes avaient un effet protecteur sur le HDL → leur déclin peut faire baisser le HDL

Besoins nutritionnels spécifiques :
- Calcium : 1000mg/jour (ossification, prévention ostéoporose future)
  Sources : yaourt 180mg, fromage blanc 100g = 120mg, sardines avec arêtes 350mg/100g,
  haricots blancs cuits 130mg/100g, brocolis 47mg/100g, kale 150mg/100g
- Vitamine D : 15µg/jour (absorption calcium, résistance insuline, immunité)
  Sources : poissons gras, jaune d'œuf, champignons — souvent carencée en France en hiver
- Fer : 16mg/jour si préménopausée (vs 11mg homme)
  Fer héminique (mieux absorbé) : volailles | Fer non-héminique : légumineuses (6mg/100g), épinards
  → Association OBLIGATOIRE : légumineuses + vitamine C (persil, poivron, citron) = absorption ×3
- Phytoestrogènes (isoflavones) : effets modérés bénéfiques sur bilan lipidique et inconfort péri-ménopausique
  Sources : soja (tofu, edamame), graines de lin (lignanes) — intégrer régulièrement
- Magnésium : 360mg/jour (résistance insuline, sommeil, humeur)
  Sources : légumineuses, oléagineux, céréales complètes, chocolat noir 70%+

Différences homme/femme pour ce profil :
- Besoins caloriques femme ~15% inférieurs → portions de féculents légèrement plus petites
- Meilleure conversion ALA→EPA chez la femme (~21% vs ~8%)
- HDL naturellement plus élevé chez la femme grâce aux estrogènes

## 6. ASSOCIATIONS ALIMENTAIRES — RÈGLES À APPLIQUER SYSTÉMATIQUEMENT

Associations BÉNÉFIQUES à intégrer dans chaque recette :
1. Légumineuses + céréales complètes = protéine végétale complète (score PDCAAS optimal)
   ex : lentilles + riz basmati | pois chiches + boulgour | haricots + pain seigle
2. Légumineuses/légumes + vitamine C = absorption fer non-héminique ×3
   ex : lentilles + persil frais | pois chiches + poivron | épinards + citron
3. Caroténoïdes + lipides = absorption antioxydants (lycopène, bêta-carotène) ×6
   ex : carottes + huile d'olive | butternut + huile de colza | tomates + olive
4. Avoine + pomme = synergie bêta-glucanes + pectines → -10% LDL documenté
5. Acide (citron, vinaigre) + féculent = réduction IG du repas de 20-34%
6. Protéine + fibre + graisse insaturée à chaque repas = stabilisation glycémique maximale
7. Calcium + vitamine D = absorption osseuse optimale (pertinent pour la femme 41 ans)

Associations DÉFAVORABLES à éviter :
- Graisses saturées + sucres rapides = combo athérogène maximal (ex : pain blanc + beurre + confiture)
- Féculent seul sans légume ni protéine = pic glycémique non amorti
- Café/thé pendant le repas si déficit en fer : réduit absorption fer non-héminique de 60%

## 7. DENSITÉ NUTRITIONNELLE — PRINCIPE DIRECTEUR

Pour ce profil (repas unique le soir + collation midi légère) :
Le dîner doit être DENSE en micronutriments. Chaque ingrédient doit apporter maximum :
- Fibres solubles (contre LDL et glycémie) : légumineuses, avoine, pommes, légumes racines
- Antioxydants (contre inflammation/oxydation LDL) : légumes colorés, herbes fraîches, huile d'olive
- Phytostérols (contre LDL) : huile de colza, légumineuses, céréales complètes
- Protéines complètes (satiété, maintien masse musculaire) : légumineuses + céréales
- Minéraux clés : magnésium (légumineuses, oléagineux), potassium (légumes verts), calcium (produits laitiers allégés)

Objectif de charge glycémique journalière (CG) :
- CG journalière cible pour ce profil : < 80 (vs 120-150 alimentation occidentale classique)
- Un dîner équilibré doit viser CG dîner < 30
- Légumineuses en protéines = avantage double (protéines + glucides IG très bas)`.trim();

// ============================================================
// COMPÉTENCES CULINAIRES — Savoir-faire d'un chef français
// Principe : partir d'un plat classique du terroir et l'adapter
// au profil santé, plutôt qu'assembler des ingrédients de zéro.
// ============================================================
const COMPETENCES_CULINAIRES = `
━━━ COMPÉTENCES CULINAIRES — CUISINER COMME UN CHEF ━━━

## PRINCIPE FONDAMENTAL
Ne jamais assembler des ingrédients au hasard.
TOUJOURS partir d'un plat du terroir français existant et l'ADAPTER aux contraintes de santé.
Exemples : Cassoulet → version légère sans saucisses grasses | Blanquette → sauce légère au bouillon sans crème épaisse | Daube → avec volaille au lieu de bœuf gras.

## RÉPERTOIRE TERROIR FRANÇAIS — PLATS DE RÉFÉRENCE PAR PROTÉINE

LÉGUMINEUSES (priorité absolue — 3 à 4 dîners/semaine) :
- Lentilles du Puy mijotées : mirepoix (oignon/carotte/céleri) + laurier + thym + vinaigre de Xérès en fin → goût profond et équilibré
- Cassoulet allégé : haricots tarbais + cuisse de poulet + tomates + bouquet garni (sans saucisses)
- Soupe de pois chiches à la provençale : pois chiches + tomates + ail + romarin + huile d'olive + citron
- Potée aux haricots blancs : haricots blancs + carottes + poireaux + navet + bouquet garni
- Dal de lentilles corail façon française : lentilles corail + curcuma + gingembre + carotte + lait de coco léger + citron
- Salade tiède de pois chiches rôtis : pois chiches + cumin + paprika fumé + poivrons + citron + persil plat
- Brandade de haricots blancs : purée haricots blancs + ail confit + huile d'olive + zeste citron
- Gratin de lentilles vertes : lentilles + champignons + échalotes + crème légère + gruyère (peu)
- Tajine de pois chiches aux légumes d'hiver : pois chiches + carottes + navets + cannelle + cumin + coriandre
- Haricots rouges mijotés façon bourguignonne : haricots rouges + oignons + carottes + concentré tomates + thym

VOLAILLES (2 à 3 dîners/semaine) :
- Blanquette de volaille légère : poulet + carottes + poireaux + champignons + fond de volaille réduit + crème légère + citron
- Poulet basquaise : cuisses de poulet + poivrons + tomates + oignons + piment d'Espelette + huile d'olive
- Poulet mijoté aux champignons : poulet + champignons de Paris + échalotes + thym + vin blanc + fond de volaille
- Émincé de dinde à la moutarde ancienne : dinde + échalotes + moutarde à l'ancienne + crème légère 15%
- Poulet rôti aux herbes de Provence : cuisse de poulet + ail + romarin + thym + huile d'olive + citron
- Poulet aux poireaux et citron : blanc de poulet + fondue de poireaux + citron + estragon
- Gratin de poulet et chou-fleur : poulet + chou-fleur + sauce béchamel légère (lait demi-écrémé + maïzena)
- Sauté de dinde aux légumes du moment : dinde + légumes de saison + sauce soja légère + gingembre
- Pot-au-feu de volaille : poulet entier + carottes + navets + poireaux + bouillon + os à moelle remplacé par noix

ŒUFS (1 à 2 dîners/semaine) :
- Frittata aux légumes de saison : œufs + légumes de saison + herbes fraîches + fromage de brebis léger
- Œufs cocotte aux champignons : champignons + ail + persil + crème légère + œuf cassé dessus
- Omelette soufflée aux herbes : œufs battés + estragon + ciboulette + fromage de brebis
- Piperade basque légère : poivrons + tomates + oignons + piment d'Espelette + œufs brouillés
- Quiche sans pâte aux légumes : œufs + lait demi-écrémé + légumes de saison + herbes

POISSON (0 à 1 fois/semaine max, uniquement si pertinent) :
- Papillote de cabillaud : cabillaud + poireaux + carottes + citron + aneth
- Truite amandine allégée : truite + amandes effilées + huile d'olive + citron + persil

## BASES AROMATIQUES FRANÇAISES (toujours utiliser l'une d'elles)
- Mirepoix : oignon + carotte + céleri (base de 80% des plats mijotés français)
- Soffritto léger : oignon + ail + tomate (cuisine du sud)
- Fondue d'oignons : oignons caramélisés à l'huile d'olive (umami végétal naturel)
- Bouquet garni : thym + laurier + persil (indispensable pour tout mijoté)

## ACCORDS SAVEURS QUI FONCTIONNENT
- Poulet + estragon + citron → fraîcheur, classique français
- Poulet + champignons + thym → profondeur umami
- Lentilles + cumin + citron + coriandre → équilibre acide/épicé
- Lentilles + laurier + vinaigre de Xérès → sophistiqué, profond
- Pois chiches + paprika fumé + citron → fumé + acidité
- Haricots blancs + ail confit + romarin → douceur + parfum
- Carottes + gingembre + coriandre → sucré + piquant
- Poireaux + citron + estragon → doux + frais
- Champignons + ail + persil plat → umami classique
- Butternut + sauge + noix → automne/hiver, doux + terreux
- Épinards + ail + noix de muscade → classique, chaud
- Betterave + orange + vinaigre balsamique → sucré-acidulé

## ACCORDS À ÉVITER
- Légumineuses + produits laitiers gras (lourd, difficile à digérer)
- Féculents × 2 dans le même plat (riz + pomme de terre = pic glycémique)
- Trop d'épices exotiques ensemble (curry + cumin + gingembre + cannelle = confusion)
- Herbes fraîches cuites longtemps (perdent leur intérêt — toujours ajouter en fin de cuisson)

## TECHNIQUES LÉGÈRES DU CHEF FRANÇAIS SAIN
1. DÉGLACER : après coloration de la viande, déglacer avec vin blanc sec ou jus de citron → concentre les sucs, crée une sauce sans matière grasse
2. RÉDUIRE LE BOUILLON : remplace la crème pour lier une sauce (réduit de moitié = sauce nappante naturelle)
3. ÉMULSIONNER : huile d'olive + moutarde + citron = vinaigrette qui "tient" sans mayonnaise
4. CARAMÉLISER LES OIGNONS : 20 min à feu doux dans l'huile d'olive → sucré naturel + umami
5. RÔTIR LES LÉGUMES : four 200°C + huile d'olive + sel + herbes → caramélisation = saveur de chef
6. BLANCHIR-RAFRAÎCHIR : légumes verts blanchis 3 min + eau glacée = couleur vive + texture croquante
7. LIAISON LÉGÈRE : 1 cs de fromage blanc battu en fin de sauce = onctuosité sans crème épaisse

## LES 5 ÉQUILIBRES D'UNE GRANDE RECETTE
1. SALÉ / ACIDE / SUCRÉ : toujours un élément acide (citron, vinaigre de cidre, tomate) pour "réveiller"
2. TEXTURE : quelque chose de fondant + quelque chose de légèrement croquant (légume al dente, oléagineux)
3. COULEUR : au moins 2 couleurs dans l'assiette (légume vert + légume orange/rouge)
4. ARÔME : herbe fraîche ajoutée EN FIN de cuisson (persil, ciboulette, estragon, coriandre)
5. UMAMI : champignons, concentré de tomates, miso léger, ou long mijotage pour la profondeur de goût`.trim();

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

/**
 * Formate le profil dynamique (mis à jour via le chat) en bloc texte pour les prompts.
 * @param {Object} profilExtra - objet Firebase profil/ avec champs aime, naime_pas, etc.
 */
function getProfilDynamique(profilExtra) {
  if (!profilExtra || !Object.keys(profilExtra).length) return '';
  const lignes = [];
  if (profilExtra.aime && profilExtra.aime.length)            lignes.push(`Préférences positives : ${profilExtra.aime.join(', ')}`);
  if (profilExtra.naime_pas && profilExtra.naime_pas.length)  lignes.push(`À éviter (préférences) : ${profilExtra.naime_pas.join(', ')}`);
  if (profilExtra.restrictions && profilExtra.restrictions.length) lignes.push(`Restrictions/allergies : ${profilExtra.restrictions.join(', ')}`);
  if (profilExtra.notes_sante && profilExtra.notes_sante.length)   lignes.push(`Évolutions santé :\n${profilExtra.notes_sante.map(n => '- ' + n).join('\n')}`);
  if (profilExtra.notes_nutrition && profilExtra.notes_nutrition.length) lignes.push(`Notes nutrition :\n${profilExtra.notes_nutrition.map(n => '- ' + n).join('\n')}`);
  if (!lignes.length) return '';
  return `━━━ PROFIL DYNAMIQUE (mis à jour via chat) ━━━\n${lignes.join('\n\n')}`;
}

/**
 * Formate les recettes personnelles importées en bloc texte pour les prompts.
 * PRIORITÉ ABSOLUE : si une recette personnelle convient au jour, l'utiliser en premier.
 * @param {Array} recettesPerso - tableau de recettes importées depuis Firebase recettes_perso/
 */
function getRecettesPerso(recettesPerso) {
  if (!recettesPerso || !recettesPerso.length) return '';
  return `━━━ RECETTES PERSONNELLES — PRIORITÉ ABSOLUE ━━━
L'utilisateur a une bibliothèque de recettes favorites importées.
RÈGLE : Pour chaque dîner, cherche D'ABORD dans cette liste si une recette convient (saison, protéine, variété). Si oui, utilise-la. Si aucune ne convient, invente une recette en t'appuyant sur le répertoire culinaire ci-dessous.
Recettes disponibles :
${recettesPerso.map(r => `- "${r.nom}"${r.description ? ' : ' + r.description : ''}${r.tags && r.tags.length ? ' [' + r.tags.join(', ') + ']' : ''}`).join('\n')}`;
}

/**
 * Formate l'historique des recettes récentes pour éviter les répétitions.
 * @param {Array} historique - tableau d'objets { nom, date } des recettes des 4 dernières semaines
 */
function getHistoriqueRecettes(historique) {
  if (!historique || !historique.length) return '';
  const cutoff = Date.now() - 28 * 24 * 60 * 60 * 1000; // 28 jours
  const recentes = historique.filter(h => new Date(h.date).getTime() > cutoff);
  if (!recentes.length) return '';
  return `━━━ RECETTES DÉJÀ SERVIES (NE PAS REPROPOSER) ━━━
Ces recettes ont été servies récemment — ne les repropose PAS cette semaine :
${recentes.map(h => `- "${h.nom}" (servi le ${h.date})`).join('\n')}
Propose des plats différents en t'inspirant du répertoire culinaire.`;
}

module.exports = {
  getContexteSaisonnier,
  getInstructionsSaisonnieres,
  getSitesRessources,
  getProfilDynamique,
  getRecettesPerso,
  getHistoriqueRecettes,
  SITES_RESSOURCES_DEFAUT,
  PROFIL_SANTE,
  SCHEMA_NUTRITIONNEL,
  CONTRAINTES_PRATIQUES,
  COMPETENCES_NUTRITIONNELLES,
  COMPETENCES_CULINAIRES
};
