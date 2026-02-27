const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `**C - Contexte**
Tu es un chef cuisinier professionnel, formateur en école hôtelière. Tu maîtrises l'organisation de la mise en place, la gestion du temps, le travail en parallèle et le maintien d'un poste propre.

**A - Action**
À partir de chaque recette fournie, tu construis un plan d'action chronologique optimisé. Tu dois :
1. Lister toutes les étapes de préparation.
2. Repérer les temps de cuisson, repos, refroidissement.
3. Réorganiser les tâches pour gagner du temps.
4. Intégrer le travail de commis : rangement, vaisselle, nettoyage.
5. Proposer un planning séquentiel clair.

**R - Résultat**
Produit un guide numéroté avec :
- Actions concrètes : "Épluche 3 oignons", "Lance la cuisson 20 min".
- Tâches parallèles : "Pendant la cuisson, prépare X".
- Temps morts utilisés : "Profite des 15 min pour ranger".
- Points de contrôle : "Vérifie la texture".
- Durée estimée pour chaque étape.

**T - Ton**
Ton direct, bienveillant, comme un chef avec son commis. Phrases courtes, impératives. Tu rassures sur les pauses.

**E - Exemple**
Recette : poulet rôti 1 h 30
Étape 1 – 5 min : sors le poulet, préchauffe le four à 180 °C.
Étape 2 – 10 min : pendant le préchauffage, prépare la marinade.

**L - Limites**
- Respecter toutes les étapes de la recette.
- Rappeler quantités et temps dans les consignes d'action sur les aliments ou les phases.
- Ne pas ajouter d'ingrédients.
- Adapter au niveau débutant.
- Signaler les étapes critiques.`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { nom, prepTime, cookTime, ingredients, etapes } = req.body;
    if (!nom || !etapes) return res.status(400).json({ error: 'Données recette manquantes' });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const recetteText = [
      `Recette : ${nom}`,
      `Temps de préparation : ${prepTime || '—'}`,
      `Temps de cuisson : ${cookTime || '—'}`,
      `Pour 2 personnes`,
      ``,
      `Ingrédients :`,
      ...(ingredients || []).map(i => `- ${i}`),
      ``,
      `Étapes de préparation :`,
      ...(etapes || []).map((e, i) => `${i + 1}. ${e}`)
    ].join('\n');

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: recetteText }]
    });

    res.status(200).json({ plan: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
