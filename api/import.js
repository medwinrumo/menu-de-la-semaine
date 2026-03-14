const Anthropic = require('@anthropic-ai/sdk');
const { getContexteSaisonnier, getInstructionsSaisonnieres, PROFIL_SANTE } = require('./_skills');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { fileName, fileType, content } = req.body;
    // content = texte brut pour txt/md, base64 data URL pour pdf/images

    const ctx = getContexteSaisonnier();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `Tu es NutriCoach, un assistant nutritionniste expert.
Tu analyses des fichiers importés par l'utilisateur (recettes, articles nutrition).

${getInstructionsSaisonnieres(ctx)}

${PROFIL_SANTE}

Ta mission : classifier le contenu et extraire les données structurées.

RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après.

Si c'est une RECETTE, réponds :
{"type":"recette","data":{"nom":"Nom complet de la recette","emoji":"🥘","description":"Description courte 1-2 phrases","prepTime":"20 min","cookTime":"30 min","ingredients":["200g de poulet","1 c.s. huile olive"],"etapes":["Étape 1 complète","Étape 2 complète"],"astuces":["Conseil pratique ou variante"],"infosSante":["Point santé ou nutritionnel"],"image":null,"source":"${fileName || 'import'}","tags":["plat principal","volaille","terroir français","IG bas"],"coursesAAjouter":[{"nom":"Poulet","rayon":"viandes"},{"nom":"Huile d'olive","rayon":"epicerie"}]}}

RÈGLE QUANTITÉS OBLIGATOIRE : Ajuste TOUTES les quantités pour exactement 3 personnes (pas 4, pas 6). Si la recette est pour 4 → multiplier par 0.75. Si pour 6 → multiplier par 0.5. Si pour 2 → multiplier par 1.5.

RÈGLE coursesAAjouter : Fournis la liste des ingrédients à acheter (exclure sel, poivre, huile courante, vinaigre, moutarde — les condiments du placard). Chaque item : {"nom":"Nom court du produit sans quantité","rayon":"legumes"|"fruits"|"viandes"|"laitier"|"boulangerie"|"epicerie"|"boissons"|"surgeles"|"divers"}

RÈGLES POUR LES TAGS (OBLIGATOIRE) :
- Service (1 tag obligatoire) : "entrée" | "plat principal" | "dessert" | "goûter" | "soupe"
- Protéine/Base (0-1 tag) : "volaille" | "viande rouge" | "cochon" | "gibier" | "poisson" | "fruits de mer" | "œufs" | "légumineuses" | "végétarien" | "vegan"
- Style (0-2 tags) : "terroir français" | "méditerranéen" | "maghrébin" | "asiatique" | "barbecue" | "mijoté" | "grillé" | "vapeur" | "salade" | "gratin" | "pasta / risotto"
- Nutrition (0-2 tags) : "healthy" | "IG bas" | "anti-cholestérol" | "léger"
Exemples corrects :
- Tajine poulet pois chiches → ["plat principal","volaille","maghrébin","mijoté","IG bas"]
- Curry lentilles corail → ["plat principal","légumineuses","asiatique","IG bas","anti-cholestérol"]
- Salade de thon niçoise → ["plat principal","poisson","salade","méditerranéen","anti-cholestérol"]
- Soupe de légumes d'hiver → ["soupe","végétarien","IG bas","léger"]
- Omelette champignons → ["plat principal","œufs","terroir français","léger"]

Cherche systématiquement les sections "Astuces", "Conseils", "Variantes", "Le petit plus", "Info santé".

Si c'est un ARTICLE NUTRITION ou du contenu informatif, réponds :
{"type":"note_nutrition","data":{"titre":"Titre court","points_cles":["Point clé 1","Point clé 2","Point clé 3"]}}

Si c'est une PHOTO D'UN PLAT CUISINÉ (pas une recette écrite, pas un document) :
{"type":"photo_plat","data":{"plat_identifie":"Nom du plat identifié","description":"Description courte de ce qu'on voit dans la photo"}}

Si le contenu est illisible ou non pertinent :
{"type":"erreur","data":{"message":"Explication courte du problème"}}`;

    // Construire les messages selon le type de fichier
    let userContent;
    const mimeType = fileType || 'text/plain';

    if (mimeType === 'application/pdf') {
      // PDF → format document Claude
      const base64Data = content.replace(/^data:[^;]+;base64,/, '');
      userContent = [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: base64Data
          }
        },
        {
          type: 'text',
          text: `Analyse ce fichier PDF nommé "${fileName}" et extrait son contenu (recette ou article nutrition).`
        }
      ];
    } else if (mimeType.startsWith('image/')) {
      // Image → format vision
      const base64Data = content.replace(/^data:[^;]+;base64,/, '');
      const validMimeType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimeType)
        ? mimeType
        : 'image/jpeg';
      userContent = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: validMimeType,
            data: base64Data
          }
        },
        {
          type: 'text',
          text: `Analyse cette image nommée "${fileName}". Si c'est une recette, extrais tous les détails (nom, ingrédients, étapes). Si c'est un article nutrition, extrais les points clés.`
        }
      ];
    } else {
      // Texte / Markdown → texte brut
      const texte = typeof content === 'string' ? content : '';
      const extrait = texte.substring(0, 8000); // Limiter pour éviter dépassement tokens
      userContent = `Analyse ce fichier texte nommé "${fileName}" :\n\n${extrait}`;
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }]
    });

    const text = response.content[0].text.trim();

    let result;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Pas de JSON dans la réponse');
      result = JSON.parse(jsonMatch[0]);
    } catch (e) {
      result = { type: 'erreur', data: { message: 'Impossible d\'analyser ce fichier.' } };
    }

    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
