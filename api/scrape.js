const Anthropic = require('@anthropic-ai/sdk');

const TAG_RULES = `Tags (règles strictes) :
- Service (1 OBLIGATOIRE) : "entrée" | "plat principal" | "dessert" | "goûter" | "soupe"
- Protéine/Base (0-1) : "volaille" | "viande rouge" | "cochon" | "gibier" | "poisson" | "fruits de mer" | "œufs" | "légumineuses" | "végétarien" | "vegan"
- Style (0-2) : "terroir français" | "méditerranéen" | "maghrébin" | "asiatique" | "barbecue" | "mijoté" | "grillé" | "vapeur" | "salade" | "gratin" | "pasta / risotto"
- Nutrition (0-2) : "healthy" | "IG bas" | "anti-cholestérol" | "léger"
Exemples :
- Tajine poulet pois chiches → ["plat principal","volaille","maghrébin","mijoté","IG bas"]
- Curry lentilles corail → ["plat principal","légumineuses","asiatique","IG bas","anti-cholestérol"]
- Salade niçoise au thon → ["plat principal","poisson","salade","méditerranéen","anti-cholestérol"]
- Soupe légumes hiver → ["soupe","végétarien","IG bas","léger"]
- Omelette champignons → ["plat principal","œufs","terroir français","léger"]`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL manquante' });

    // 1. Récupérer la page
    const pageRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9'
      },
      redirect: 'follow'
    });
    if (!pageRes.ok) throw new Error('Page inaccessible (erreur ' + pageRes.status + ')');
    const html = await pageRes.text();

    // 2. Image principale (og:image ou twitter:image)
    const ogImage = extractOgImage(html);

    // 3. Tentative JSON-LD schema.org/Recipe
    const recipeJsonLd = extractJsonLd(html);
    if (recipeJsonLd) {
      const recipe = formatRecipe(recipeJsonLd, url, ogImage);
      // Enrichissement Claude : tags + astuces + infosSante
      const enrichment = await enrichirAvecClaude(recipe);
      recipe.tags = enrichment.tags || [];
      recipe.astuces = enrichment.astuces || [];
      recipe.infosSante = enrichment.infosSante || [];
      recipe.favoris = false;
      return res.status(200).json(recipe);
    }

    // 4. Fallback : Claude Sonnet extrait tout depuis le HTML structuré
    const recipe = await extractWithClaude(html, url, ogImage);
    recipe.favoris = false;
    return res.status(200).json(recipe);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── Image principale ─────────────────────────────────────────────────────────

function extractOgImage(html) {
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
           || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  return m ? m[1] : null;
}

function extractImageFromJsonLd(r) {
  if (!r.image) return null;
  if (typeof r.image === 'string') return r.image;
  if (Array.isArray(r.image)) {
    const first = r.image[0];
    if (typeof first === 'string') return first;
    if (first && first.url) return first.url;
  }
  if (typeof r.image === 'object' && r.image.url) return r.image.url;
  return null;
}

// ── Nettoyage HTML structuré ──────────────────────────────────────────────────

function cleanHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => '\n\n=== ' + t.replace(/<[^>]+>/g, '').trim() + ' ===\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/  +/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .substring(0, 12000);
}

// ── JSON-LD ──────────────────────────────────────────────────────────────────

function extractJsonLd(html) {
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const recipe = findRecipeInData(data);
      if (recipe) return recipe;
    } catch (e) { /* JSON invalide, on continue */ }
  }
  return null;
}

function findRecipeInData(data) {
  if (!data) return null;
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeInData(item);
      if (found) return found;
    }
    return null;
  }
  const type = data['@type'];
  if (type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'))) return data;
  if (data['@graph']) return findRecipeInData(data['@graph']);
  return null;
}

function normalizeArr(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  if (typeof x === 'string') return x.split('\n').map(s => s.trim()).filter(Boolean);
  return Object.values(x);
}

function parseDuration(iso) {
  if (!iso) return '—';
  if (typeof iso === 'number') return iso + ' min';
  const str = String(iso);
  const timePart = str.includes('T') ? str.split('T')[1] : str;
  const h = (timePart.match(/(\d+)H/) || [])[1];
  const m = (timePart.match(/(\d+)M/) || [])[1];
  if (h && parseInt(h) > 0 && m && parseInt(m) > 0) return h + 'h' + m;
  if (h && parseInt(h) > 0) return h + 'h';
  if (m && parseInt(m) > 0) return m + ' min';
  if (/\d/.test(str) && !/^P/i.test(str)) return str;
  return '—';
}

function formatRecipe(r, url, ogImage) {
  const instructions = r.recipeInstructions || [];
  const etapes = instructions.map(function(step) {
    if (typeof step === 'string') return step.trim();
    return (step.text || step.name || '').trim();
  }).filter(Boolean);

  // Chercher les temps manquants dans cookTime/totalTime
  let cookTime = parseDuration(r.cookTime);
  if (cookTime === '—') cookTime = parseDuration(r.totalTime);

  return {
    nom: r.name || 'Recette importée',
    emoji: '🥘',
    description: r.description ? r.description.replace(/<[^>]+>/g, '').substring(0, 180) : '',
    ingredients: normalizeArr(r.recipeIngredient),
    etapes: etapes,
    prepTime: parseDuration(r.prepTime),
    cookTime: cookTime,
    image: extractImageFromJsonLd(r) || ogImage || null,
    astuces: [],
    infosSante: [],
    tags: [],
    source: url,
    url: url
  };
}

// ── Enrichissement Claude (JSON-LD déjà extrait → tags + astuces) ─────────────

async function enrichirAvecClaude(recipe) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const desc = `"${recipe.nom}" — ${recipe.description} — Ingrédients principaux : ${recipe.ingredients.slice(0, 7).join(', ')}`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Recette : ${desc}

${TAG_RULES}

Génère pour cette recette :
1. Les tags appropriés (tableau JSON)
2. 2-3 astuces pratiques de cuisine (tableau JSON)
3. 2 points santé/nutrition pertinents (IG, cholestérol, protéines, fibres...) (tableau JSON)

Réponds UNIQUEMENT avec ce JSON : {"tags":["plat principal","volaille"],"astuces":["Conseil 1","Conseil 2"],"infosSante":["Info 1","Info 2"]}`
    }]
  });

  try {
    const j = JSON.parse(response.content[0].text.trim().match(/\{[\s\S]*\}/)[0]);
    return j;
  } catch(e) { return { tags: [], astuces: [], infosSante: [] }; }
}

// ── Fallback Claude Sonnet (extraction complète depuis HTML) ──────────────────

async function extractWithClaude(html, url, ogImage) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const texte = cleanHtml(html);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    messages: [{
      role: 'user',
      content: `Extrais TOUTES les informations de cette recette de cuisine.
URL : ${url}
Image og:image détectée : ${ogImage || 'non trouvée'}

Réponds UNIQUEMENT avec ce JSON valide :
{"nom":"Nom complet","emoji":"🥘","description":"Description 1-2 phrases","prepTime":"20 min","cookTime":"30 min","ingredients":["200g de poulet","1 c.s. huile olive"],"etapes":["Étape 1 complète","Étape 2 complète"],"astuces":["Conseil pratique","Variante possible"],"infosSante":["Riche en fibres","Faible IG"],"image":"${ogImage || 'null'}","source":"${url}","url":"${url}","tags":["plat principal","volaille","terroir français"]}

RÈGLES CRITIQUES :
- Extrais TOUS les ingrédients avec leurs quantités exactes (ne saute aucun)
- Extrais TOUTES les étapes dans l'ordre (ne les fusionne pas en une seule)
- Recherche les sections "Astuces", "Conseils", "Le petit plus", "Variantes", "Info santé", "À savoir", "Notre conseil"
- Pour l'image : utilise "${ogImage || 'null'}" ou null si non disponible
- Pour les tags : ${TAG_RULES}
- Si le contenu n'est pas une recette : {"erreur":"Explication"}

Texte de la page :
${texte}`
    }]
  });

  const text = response.content[0].text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Impossible d\'extraire la recette');
  const result = JSON.parse(jsonMatch[0]);
  if (result.erreur) throw new Error(result.erreur);
  return result;
}
