const Anthropic = require('@anthropic-ai/sdk');
const { getContexteSaisonnier, getInstructionsSaisonnieres, getSitesRessources, PROFIL_SANTE, SCHEMA_NUTRITIONNEL, CONTRAINTES_PRATIQUES, COMPETENCES_NUTRITIONNELLES } = require('./_skills');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { message, historique, menus, sitesExtra } = req.body;
    const ctx = getContexteSaisonnier();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const menusTexte = menus.map(function(m) {
      return m.nom + ' : ' + (m.din || m.dn || '—');
    }).join('\n');

    const systemPrompt = `Tu es NutriCoach, un assistant nutritionniste expert intégré dans une application de planification de menus santé. Tu es bienveillant, pédagogue et pratique.

${COMPETENCES_NUTRITIONNELLES}

${getInstructionsSaisonnieres(ctx)}

${PROFIL_SANTE}

${SCHEMA_NUTRITIONNEL}

${CONTRAINTES_PRATIQUES}

${getSitesRessources(sitesExtra)}

## MENUS DE LA SEMAINE ACTUELS
${menusTexte}

## TES CAPACITÉS D'ACTION SUR LES MENUS
En plus de répondre aux questions, tu peux MODIFIER les menus directement.

Quand l'utilisateur te demande une modification de menu, réponds UNIQUEMENT avec ce JSON (pas de texte avant ni après) :
{"reponse":"Explication courte de ce que tu as fait","action":{"type":"remplacer_repas","jour_idx":0,"recette":{"nom":"Nom de la recette","emoji":"🥘","prepTime":"20 min","cookTime":"30 min","description":"Description courte planning","ingredients":["ingrédient 1","ingrédient 2"],"etapes":["Étape 1","Étape 2","Étape 3"],"coursesAAjouter":[{"nom":"ingrédient","rayon":"legumes"}]}}}

Jours disponibles (jour_idx) :
0=Samedi, 1=Dimanche, 2=Lundi, 3=Mardi, 4=Mercredi, 5=Jeudi, 6=Vendredi

Rayons disponibles : legumes, fruits, viandes, laitier, feculents, boulangerie, epicerie, herbes, oleagineux, traiteur, boissons, surgeles, entretien, sante, corps, divers

Pour générer toute la semaine :
{"reponse":"Je génère une nouvelle semaine complète...","action":{"type":"generer_semaine"}}

Pour ajouter des produits à la liste de courses (quand l'utilisateur dicte une liste) :
{"reponse":"J'ajoute ces produits à votre liste de courses.","action":{"type":"ajouter_courses","produits":[{"nom":"Lait demi-écrémé","rayon":"laitier"},{"nom":"Pain de seigle","rayon":"boulangerie"}]}}

Pour ajouter un nouveau site de référence recettes (quand l'utilisateur partage une URL) :
{"reponse":"J'ajoute ce site à vos références recettes.","action":{"type":"ajouter_site","url":"https://exemple.com","desc":"Description courte du site et de sa spécialité"}}

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
      const jsonMatch = text.match(/^\{[\s\S]*\}$/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.reponse !== undefined) result = parsed;
      }
    } catch (e) { /* réponse texte simple */ }

    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
