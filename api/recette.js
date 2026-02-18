const Anthropic = require('@anthropic-ai/sdk');
const { getContexteSaisonnier, getInstructionsSaisonnieres, PROFIL_SANTE, SCHEMA_NUTRITIONNEL, CONTRAINTES_PRATIQUES } = require('./_skills');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { jour, recetteActuelle, autresRecettes } = req.body;
    const ctx = getContexteSaisonnier();

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `Tu es un nutritionniste expert en cuisine française saine.

MISSION : Proposer une recette de dîner alternative pour ${jour}.
RECETTE À REMPLACER : "${recetteActuelle}"
MENUS DÉJÀ PLANIFIÉS CETTE SEMAINE (ne pas répéter) : ${autresRecettes ? autresRecettes.join(', ') : 'aucun'}

${getInstructionsSaisonnieres(ctx)}

${PROFIL_SANTE}

${SCHEMA_NUTRITIONNEL}

${CONTRAINTES_PRATIQUES}

RÉPONDS UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{
  "nom": "Nom court de la recette",
  "emoji": "🥘",
  "prepTime": "15 min",
  "cookTime": "25 min",
  "description": "Description ultra-courte style planning (ex: Curry lentilles corail • Quinoa • Mâche)",
  "ingredients": ["400g filets de cabillaud", "3 carottes en rondelles", "2 poireaux", "..."],
  "etapes": ["Étape 1...", "Étape 2...", "Étape 3..."],
  "coursesAAjouter": [
    {"nom": "400g filets de cabillaud", "rayon": "viandes"},
    {"nom": "Aneth frais", "rayon": "herbes"}
  ]
}

Rayons disponibles : legumes, fruits, viandes, laitier, feculents, boulangerie, epicerie, herbes, oleagineux, traiteur`;

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
