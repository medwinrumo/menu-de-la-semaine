const Anthropic = require('@anthropic-ai/sdk');
const { getContexteSaisonnier, getInstructionsSaisonnieres, getSitesRessources, getProfilDynamique, getRecettesPerso, getHistoriqueRecettes, PROFIL_SANTE, SCHEMA_NUTRITIONNEL, CONTRAINTES_PRATIQUES, COMPETENCES_NUTRITIONNELLES, COMPETENCES_CULINAIRES } = require('./_skills');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { jours, dateDebut, dateFin, sitesExtra, profilExtra, recettesPerso, historiqueRecettes, mode } = req.body;
    const isPdjCol = mode === 'pdj_col';
    const ctx = getContexteSaisonnier();

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // ── Mode Matin & Midi uniquement ─────────────────────────────────────────
    if (isPdjCol) {
      const promptPdjCol = `Tu es un nutritionniste expert spécialisé en alimentation IG bas et anti-cholestérol.
Ta mission : proposer des petits-déjeuners et collations de midi variés et adaptés au profil santé.

SEMAINE DU ${dateDebut} AU ${dateFin}
JOURS À COUVRIR :
${jours.map((j, i) => `Jour ${i + 1} : ${j}`).join('\n')}

${getInstructionsSaisonnieres(ctx)}

${PROFIL_SANTE}

${getProfilDynamique(profilExtra)}

STRUCTURE PETIT-DÉJEUNER (léger, IG bas, varie chaque jour) :
- Eau citronnée + [fruit de saison] + [oléagineux] + [fromage blanc OU yaourt OU 2 œufs + pain seigle]

STRUCTURE COLLATION MIDI (rapide, cru, varie chaque jour) :
- Bâtonnets légumes + houmous OU fruits + noix OU smoothie vert OU radis + œuf dur

RÉPONDS UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{
  "semaine": "Semaine du ${dateDebut} au ${dateFin}",
  "jours": [
    {"id": 0, "nom": "${jours[0]}", "pdj": "Eau citronnée • Fromage blanc 3% + miel • 1 pomme • 6 amandes", "col": "Bâtonnets carottes et concombre • Houmous maison"}
  ]
}

Génère les 7 jours. Varie les petits-déjeuners et collations chaque jour, ne répète pas deux fois le même.`;

      const msgPdjCol = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: promptPdjCol }]
      });
      const textPdjCol = msgPdjCol.content[0].text;
      const matchPdjCol = textPdjCol.match(/\{[\s\S]*\}/);
      if (!matchPdjCol) throw new Error('Format de réponse invalide');
      return res.status(200).json(JSON.parse(matchPdjCol[0]));
    }

    // ── Mode complet (3 repas) ───────────────────────────────────────────────
    const prompt = `Tu es à la fois un chef cuisinier français et un nutritionniste expert.
Ta mission : créer des menus savoureux, gastronomiquement cohérents ET adaptés au profil santé.

SEMAINE DU ${dateDebut} AU ${dateFin}
JOURS À COUVRIR :
${jours.map((j, i) => `Jour ${i + 1} : ${j}`).join('\n')}

${COMPETENCES_CULINAIRES}

${COMPETENCES_NUTRITIONNELLES}

${getInstructionsSaisonnieres(ctx)}

${PROFIL_SANTE}

${getProfilDynamique(profilExtra)}

${SCHEMA_NUTRITIONNEL}

${CONTRAINTES_PRATIQUES}

${getRecettesPerso(recettesPerso)}

${getHistoriqueRecettes(historiqueRecettes)}

━━━ RÈGLES DE COMPOSITION DES MENUS ━━━

VARIÉTÉ PROTÉINES (obligatoire) :
- Pas la même protéine deux jours consécutifs
- 3 à 4 dîners légumineuses — PRIORITÉ ABSOLUE
- 2 dîners volaille MAXIMUM (pas plus, pas un jour sur deux)
- 1 à 2 dîners œufs
- Poisson : 0 ou 1 maximum, uniquement si pertinent

QUALITÉ CULINAIRE (obligatoire) :
- Partir TOUJOURS d'un plat du terroir français du répertoire ci-dessus et l'adapter au profil santé
- Chaque recette doit avoir une base aromatique (mirepoix, soffritto, fondue d'oignons...)
- Toujours un élément acide (citron, vinaigre de cidre, tomate) pour équilibrer
- Herbes fraîches ajoutées EN FIN de cuisson
- Les étapes doivent être précises et détaillées (4 à 6 étapes minimum)
- Les ingrédients doivent former un plat cohérent et appétissant, pas une addition nutritive

STRUCTURE PETIT-DÉJEUNER (léger, IG bas, varie chaque jour) :
- Eau citronnée + [fruit de saison] + [oléagineux] + [fromage blanc OU yaourt OU 2 œufs + pain seigle]

STRUCTURE COLLATION MIDI (rapide, cru, varie chaque jour) :
- Bâtonnets légumes + houmous OU fruits + noix OU smoothie vert OU radis + œuf dur

RÉPONDS UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{
  "semaine": "Semaine du ${dateDebut} au ${dateFin}",
  "jours": [
    {
      "id": 0,
      "nom": "${jours[0]}",
      "pdj": "Eau citronnée • Fromage blanc 3% + miel • 1 pomme • 6 amandes",
      "col": "Bâtonnets carottes et concombre • Houmous maison",
      "din": "Blanquette de poulet légère aux poireaux • riz basmati",
      "dn": "Blanquette poulet",
      "recette": {
        "nom": "Blanquette de poulet légère aux poireaux et champignons",
        "emoji": "🍲",
        "prepTime": "20 min",
        "cookTime": "35 min",
        "url": null,
        "ingredients": ["2 cuisses de poulet (sans peau)", "2 poireaux émincés", "200g champignons de Paris", "1 carotte en rondelles", "1 oignon", "1 bouquet garni", "20cl bouillon de volaille", "2 cs crème légère 15%", "1 cs jus de citron", "persil plat frais"],
        "etapes": ["Faire revenir l'oignon émincé dans l'huile d'olive à feu doux 5 min.", "Ajouter le poulet et dorer légèrement sur toutes les faces.", "Ajouter poireaux, carotte, champignons et bouquet garni. Couvrir de bouillon.", "Mijoter à couvert 30 min à feu doux.", "Retirer le poulet, réduire le bouillon de moitié à feu vif.", "Hors du feu, incorporer la crème légère et le citron. Parsemer de persil frais."],
        "coursesAAjouter": [
          {"nom": "2 cuisses de poulet", "rayon": "viandes"},
          {"nom": "2 poireaux", "rayon": "legumes"},
          {"nom": "200g champignons de Paris", "rayon": "legumes"},
          {"nom": "2 cs crème légère 15%", "rayon": "laitier"}
        ]
      }
    }
  ]
}

Génère les 7 jours. Le champ "url" doit être null sauf si tu es certain à 100% que l'URL existe.
Rayons disponibles : legumes, fruits, viandes, laitier, feculents, boulangerie, epicerie, herbes, oleagineux, traiteur, boissons, surgeles, entretien, sante, corps, divers

RÈGLE coursesAAjouter :
- N'inclure QUE les ingrédients à acheter — exclure les produits du placard (sel, poivre, huile, sucre, vinaigre, herbes sèches, épices courantes, farine blanche, moutarde, sauce soja...)
- Le champ "nom" DOIT TOUJOURS inclure la quantité exacte. Ex: "400g de cabillaud", "2 poireaux", "20cl crème légère 15%", "1 bouquet de persil plat". Jamais juste "cabillaud" ou "crème".`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Format de réponse invalide');

    const menus = JSON.parse(jsonMatch[0]);
    res.status(200).json(menus);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
