const Anthropic = require('@anthropic-ai/sdk');

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

    // 2. Tentative extraction JSON-LD schema.org/Recipe (rapide, sans IA)
    const recipeJsonLd = extractJsonLd(html);
    if (recipeJsonLd) {
      return res.status(200).json(formatRecipe(recipeJsonLd, url));
    }

    // 3. Fallback : Claude Haiku extrait depuis le texte brut de la page
    const recipeFromClaude = await extractWithClaude(html, url);
    return res.status(200).json(recipeFromClaude);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function normalizeArr(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  if (typeof x === 'string') return x.split('\n').map(s => s.trim()).filter(Boolean);
  return Object.values(x);
}

// ── Extraction JSON-LD ──────────────────────────────────────────────────────

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

function formatRecipe(r, url) {
  const instructions = r.recipeInstructions || [];
  const etapes = instructions.map(function (step) {
    if (typeof step === 'string') return step.trim();
    return (step.text || step.name || '').trim();
  }).filter(Boolean);

  return {
    nom: r.name || 'Recette importée',
    emoji: '🥘',
    description: r.description ? r.description.replace(/<[^>]+>/g, '').substring(0, 150) : '',
    ingredients: normalizeArr(r.recipeIngredient),
    etapes: etapes,
    prepTime: parseDuration(r.prepTime),
    cookTime: parseDuration(r.cookTime),
    source: url,
    url: url
  };
}

function parseDuration(iso) {
  if (!iso) return '—';
  const h = (iso.match(/(\d+)H/) || [])[1];
  const m = (iso.match(/(\d+)M/) || [])[1];
  if (h && m) return h + 'h' + m;
  if (h) return h + 'h';
  if (m) return m + ' min';
  return '—';
}

// ── Fallback Claude Haiku ───────────────────────────────────────────────────

async function extractWithClaude(html, url) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Nettoyer le HTML et tronquer pour limiter les tokens
  const texte = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 8000);

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Extrais la recette de cuisine de ce texte et réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après :
{"nom":"Nom de la recette","emoji":"🥘","description":"Description courte 1 ligne","prepTime":"20 min","cookTime":"30 min","ingredients":["ingrédient 1","ingrédient 2"],"etapes":["Étape 1","Étape 2"],"source":"${url}","url":"${url}"}

Si le contenu n'est pas une recette de cuisine, réponds :
{"erreur":"Pas de recette trouvée sur cette page"}

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
