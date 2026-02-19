const Anthropic = require('@anthropic-ai/sdk');
const { getContexteSaisonnier, getInstructionsSaisonnieres, PROFIL_SANTE, SCHEMA_NUTRITIONNEL, CONTRAINTES_PRATIQUES } = require('./_skills');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { jours, dateDebut, dateFin } = req.body;
    const ctx = getContexteSaisonnier();

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `Tu es un nutritionniste expert en cuisine française saine.

MISSION : Générer un programme de menus complet pour la semaine du ${dateDebut} au ${dateFin}.

JOURS À COUVRIR (dans cet ordre) :
${jours.map((j, i) => `Jour ${i + 1} : ${j}`).join('\n')}

${getInstructionsSaisonnieres(ctx)}

${PROFIL_SANTE}

${SCHEMA_NUTRITIONNEL}

${CONTRAINTES_PRATIQUES}

SITES DE RÉFÉRENCE (inspire-toi de ces sources) :
- cuisineigbas.com — IG bas, plats mijotés
- lanutrition.fr — recettes scientifiquement validées IG bas
- santemagazine.fr — menus anti-cholestérol
- primevere.com — plats plaisir adaptés cholestérol
- jow.fr — IG bas accessible
- cuisineaz.com — recettes IG bas variées
- marieclaire.fr/cuisine — anti-cholestérol méditerranéen

CONTRAINTES DE VARIÉTÉ (obligatoire) :
- Pas la même protéine deux jours consécutifs
- Au moins 2 dîners végétariens (légumineuses ou œufs)
- Au moins 2 dîners poisson
- Au moins 1 volaille
- Recettes différentes des classiques habituels (pas tajine, pas curry lentilles, pas poulet rôti citron)

STRUCTURE PETIT-DÉJEUNER (léger, IG bas, varie chaque jour) :
- Eau citronnée + [fruit de saison] + [oléagineux] + [fromage blanc OU yaourt OU œufs + pain seigle]

STRUCTURE COLLATION MIDI (cru et rapide, varie chaque jour) :
- Crudités + [houmous OU tzatziki OU guacamole]
- OU fruits + oléagineux
- OU smoothie vert (épinards, banane, lait végétal)
- OU radis + œuf dur

RÉPONDS UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{
  "semaine": "Semaine du ${dateDebut} au ${dateFin}",
  "jours": [
    {
      "id": 0,
      "nom": "${jours[0]}",
      "pdj": "Eau citronnée • Fromage blanc 3% + miel • 1 pomme • 6 amandes",
      "col": "Bâtonnets carottes et concombre • Houmous",
      "din": "Description planning max 10 mots • Féculent • Légume",
      "dn": "Nom court 3 mots max",
      "recette": {
        "nom": "Nom complet de la recette",
        "emoji": "🥘",
        "prepTime": "20 min",
        "cookTime": "30 min",
        "ingredients": ["400g filet de saumon", "2 poireaux émincés", "..."],
        "etapes": ["Étape 1 détaillée.", "Étape 2 détaillée.", "Étape 3 détaillée."],
        "coursesAAjouter": [
          {"nom": "400g filet de saumon", "rayon": "viandes"},
          {"nom": "2 poireaux", "rayon": "legumes"}
        ]
      }
    }
  ]
}

Génère les 7 jours en respectant exactement cette structure JSON.
Rayons disponibles : legumes, fruits, viandes, laitier, feculents, boulangerie, epicerie, herbes, oleagineux, traiteur, boissons, surgeles, entretien, sante, corps, divers`;

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
