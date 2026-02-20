const Anthropic = require('@anthropic-ai/sdk');
const { getContexteSaisonnier, getInstructionsSaisonnieres, getSitesRessources, getProfilDynamique, getRecettesPerso, PROFIL_SANTE, SCHEMA_NUTRITIONNEL, CONTRAINTES_PRATIQUES, COMPETENCES_NUTRITIONNELLES } = require('./_skills');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { message, historique, menus, sitesExtra, profilExtra, recettesPerso } = req.body;
    const ctx = getContexteSaisonnier();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const menusTexte = menus.map(function(m) {
      return m.nom + ' : ' + (m.din || m.dn || '—');
    }).join('\n');

    const systemPrompt = `Tu es NutriCoach, un assistant nutritionniste expert intégré dans une application de planification de menus santé. Tu es bienveillant, pédagogue et pratique.

${COMPETENCES_NUTRITIONNELLES}

${getInstructionsSaisonnieres(ctx)}

${PROFIL_SANTE}

${getProfilDynamique(profilExtra)}

${SCHEMA_NUTRITIONNEL}

${CONTRAINTES_PRATIQUES}

${getSitesRessources(sitesExtra)}

${getRecettesPerso(recettesPerso)}

## MENUS DE LA SEMAINE ACTUELS
${menusTexte}

## TES CAPACITÉS D'ACTION SUR LES MENUS
En plus de répondre aux questions, tu peux MODIFIER les menus directement.

Quand l'utilisateur te demande une modification de menu, réponds UNIQUEMENT avec ce JSON (pas de texte avant ni après) :
{"reponse":"Explication courte de ce que tu as fait","action":{"type":"remplacer_repas","jour_idx":0,"recette":{"nom":"Nom de la recette","emoji":"🥘","prepTime":"20 min","cookTime":"30 min","description":"Description courte planning","url":"https://www.cuisineaz.com/recettes/...","ingredients":["ingrédient 1","ingrédient 2"],"etapes":["Étape 1","Étape 2","Étape 3"],"coursesAAjouter":[{"nom":"ingrédient","rayon":"legumes"}]}}}
Le champ "url" doit pointer vers une recette réelle sur un des sites de référence. Si aucune URL certaine, mets null.

Jours disponibles (jour_idx) :
0=Samedi, 1=Dimanche, 2=Lundi, 3=Mardi, 4=Mercredi, 5=Jeudi, 6=Vendredi

Rayons disponibles : legumes, fruits, viandes, laitier, feculents, boulangerie, epicerie, herbes, oleagineux, traiteur, boissons, surgeles, entretien, sante, corps, divers

Pour générer toute la semaine :
{"reponse":"Je génère une nouvelle semaine complète...","action":{"type":"generer_semaine"}}

Pour ajouter des produits à la liste de courses (quand l'utilisateur dicte une liste) :
{"reponse":"J'ajoute ces produits à votre liste de courses.","action":{"type":"ajouter_courses","produits":[{"nom":"Lait demi-écrémé","rayon":"laitier"},{"nom":"Pain de seigle","rayon":"boulangerie"}]}}

Pour ajouter un nouveau site de référence recettes (quand l'utilisateur partage une URL) :
{"reponse":"J'ajoute ce site à vos références recettes.","action":{"type":"ajouter_site","url":"https://exemple.com","desc":"Description courte du site et de sa spécialité"}}

Pour ajouter ou modifier les tags d'une recette importée (quand l'utilisateur demande de catégoriser ou tagger une recette) :
{"reponse":"J'ai mis à jour les tags de cette recette.","action":{"type":"ajouter_tag","nom":"Nom approché de la recette","tags":["plat principal","volaille","terroir français","IG bas"]}}
Tags disponibles — Service(1 obligatoire): "entrée"|"plat principal"|"dessert"|"goûter"|"soupe" / Protéine(0-1): "volaille"|"viande rouge"|"cochon"|"gibier"|"poisson"|"fruits de mer"|"œufs"|"légumineuses"|"végétarien"|"vegan" / Style(0-2): "terroir français"|"méditerranéen"|"maghrébin"|"asiatique"|"barbecue"|"mijoté"|"grillé"|"vapeur"|"salade"|"gratin"|"pasta / risotto" / Nutrition(0-2): "healthy"|"IG bas"|"anti-cholestérol"|"léger"

Pour supprimer une recette importée de la liste « Mes recettes » :
{"reponse":"J'ai supprimé cette recette de ta liste.","action":{"type":"supprimer_recette","nom":"Nom exact ou approché de la recette"}}

Pour mettre à jour le profil de l'utilisateur (préférences, aversions, restrictions, évolutions de santé) :
{"reponse":"J'ai noté cette information dans ton profil.","action":{"type":"modifier_profil","champ":"naime_pas","valeur":"fenouil"}}
Champs valides : "aime" (plats/ingrédients appréciés), "naime_pas" (à éviter), "restrictions" (allergies, intolérances), "notes_sante" (évolutions du bilan de santé), "notes_nutrition" (notes libres nutrition)
Exemples : "Je déteste le fenouil" → champ "naime_pas", valeur "fenouil" | "J'adore les lentilles" → champ "aime", valeur "lentilles" | "Je suis intolérant au gluten" → champ "restrictions", valeur "intolérance gluten"

Rayons disponibles pour ajouter_courses : legumes, fruits, viandes, laitier, feculents, boulangerie, epicerie, herbes, oleagineux, traiteur, boissons, surgeles, entretien, sante, corps, divers

## RÈGLES DE RÉPONSE
- Langue : français uniquement
- Ton : chaleureux, encourageant, jamais culpabilisant
- Sur mobile : réponses concises (max 120 mots) sauf si l'utilisateur demande des détails
- Utilise des listes à puces pour les conseils pratiques
- Adapte toujours tes conseils au profil santé de l'utilisateur
- Pour les questions nutrition : texte simple (pas de JSON)
- Pour les modifications de menu : JSON uniquement`;

    const messages = [];
    if (historique && historique.length > 0) {
      historique.slice(-12).forEach(function(msg) {
        messages.push({ role: msg.role, content: msg.content });
      });
    }
    messages.push({ role: 'user', content: message });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages
    });

    const text = response.content[0].text.trim();

    let result = { reponse: text, action: null };
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
        if (parsed.reponse !== undefined) result = parsed;
      }
    } catch (e) { /* réponse texte simple */ }

    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
