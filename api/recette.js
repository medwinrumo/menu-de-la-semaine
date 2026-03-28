const Anthropic = require('@anthropic-ai/sdk');
const { getContexteSaisonnier, getInstructionsSaisonnieres, getSitesRessources, getProfilDynamique, getRecettesPerso, PROFIL_SANTE, SCHEMA_NUTRITIONNEL, CONTRAINTES_PRATIQUES, COMPETENCES_NUTRITIONNELLES } = require('./_skills');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { jour, recetteActuelle, autresRecettes, recettesRefusees, sitesExtra, profilExtra, recettesPerso } = req.body;
    const ctx = getContexteSaisonnier();

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const refuseesTexte = recettesRefusees && recettesRefusees.length > 0
      ? `RECETTES DÉJÀ PROPOSÉES ET REFUSÉES — NE PAS REPROPOSER : ${recettesRefusees.join(', ')}`
      : '';

    const prompt = `Tu es un nutritionniste expert en cuisine française saine.

MISSION : Proposer une recette de dîner alternative pour ${jour}.
RECETTE À REMPLACER : "${recetteActuelle}"
MENUS DÉJÀ PLANIFIÉS CETTE SEMAINE (ne pas répéter) : ${autresRecettes ? autresRecettes.join(', ') : 'aucun'}
${refuseesTexte}

${COMPETENCES_NUTRITIONNELLES}

${getInstructionsSaisonnieres(ctx)}

${PROFIL_SANTE}

${getProfilDynamique(profilExtra)}

${SCHEMA_NUTRITIONNEL}

${CONTRAINTES_PRATIQUES}

${getRecettesPerso(recettesPerso)}

RÉPONDS UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{
  "nom": "Nom court de la recette",
  "emoji": "🥘",
  "prepTime": "15 min",
  "cookTime": "25 min",
  "description": "Description ultra-courte style planning (ex: Saumon vapeur • Quinoa • Poireaux fondants)",
  "url": "https://www.cuisineaz.com/recettes/...",
  "ingredients": ["400g filets de cabillaud", "3 carottes en rondelles", "2 poireaux", "..."],
  "etapes": ["Étape 1...", "Étape 2...", "Étape 3..."],
  "coursesAAjouter": [
    {"nom": "400g filets de cabillaud", "rayon": "viandes"},
    {"nom": "1 bouquet aneth frais", "rayon": "herbes"}
  ]
}

Le champ "url" doit pointer vers une recette réelle et accessible sur l'un des sites de référence fournis. Si tu n'as pas d'URL certaine pour cette recette précise, mets null.

Rayons disponibles : legumes, fruits, viandes, laitier, feculents, boulangerie, epicerie, herbes, oleagineux, traiteur, boissons, surgeles, entretien, sante, corps, divers

RÈGLE coursesAAjouter :
- N'inclure QUE les ingrédients à acheter — exclure les produits du placard (sel, poivre, huile, sucre, vinaigre, herbes sèches, épices courantes, farine blanche, moutarde, sauce soja...)
- Le champ "nom" DOIT TOUJOURS inclure la quantité exacte. Ex: "400g de cabillaud", "2 poireaux", "20cl crème légère 15%", "1 bouquet de persil plat". Jamais juste "cabillaud" ou "crème".

${getSitesRessources(sitesExtra)}`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Format de réponse invalide');

    const recette = JSON.parse(jsonMatch[0]);
    res.status(200).json(recette);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
