# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Planificateur Menus Santé — Fichier de contexte projet

## Description du projet
Application web de planification de menus hebdomadaires (samedi → vendredi)
avec liste de courses partagée en temps réel entre plusieurs appareils.
Assistant nutritionnel (NutriCoach) intégré, génération de recettes par IA.
Projet conçu pour un utilisateur débutant en développement.
Toutes les instructions doivent être en français, simples et pas à pas.

## Dépôt GitHub
https://github.com/medwinrumo/menu-de-la-semaine

## Hébergement
- Vercel (connecté au dépôt GitHub, déploiement automatique à chaque push)
- URL : https://menus.namour.eu
- DNS géré par Squarespace (domaine Google Workspace)
- Pour redéployer manuellement : dashboard Vercel → projet → bouton "Redeploy"

## Structure des fichiers
- `index.html` : application complète (HTML + CSS + JS en un seul fichier)
- `CLAUDE.md` : ce fichier de contexte permanent
- `package.json` : dépendance `@anthropic-ai/sdk ^0.39.0`
- `api/_skills.js` : compétences centralisées de NutriCoach (calendrier saisonnier, profil santé, schéma nutritionnel, sites ressources)
- `api/recette.js` : remplacement d'une recette individuelle (claude-opus-4-6, max_tokens 1500)
- `api/menus.js` : génération de la semaine complète (claude-sonnet-4-6, max_tokens 8000)
- `api/chat.js` : assistant NutriCoach + actions sur les menus (claude-sonnet-4-6, max_tokens 1500)
- `api/import.js` : import de fichiers recettes (PDF, images, texte/markdown) via Claude vision/document (claude-sonnet-4-6, max_tokens 1500)
- `api/scrape.js` : import de recettes depuis une URL — extrait JSON-LD schema.org/Recipe en priorité, enrichit avec claude-haiku-4-5 (tags, astuces), fallback claude-sonnet-4-6 si JSON-LD absent
- `mon profil santé.md` : profil complet utilisateur (âge, activité, habitudes alimentaires)
- `Schéma nutritionnel personnalisé.md` : schéma nutritionnel détaillé avec stratégies de transition
- `Compte Rendu analyse sanguine medwin` : résultats sanguins (glycémie, cholestérol LDL/HDL)
- `Site ressources menu healthy .md` : 14 sites de référence recettes IG bas et anti-cholestérol

---

## État actuel du projet — Phases terminées

### Phase 1 — CLAUDE.md ✅ TERMINÉ
Création du fichier de contexte projet.

### Phase 2 — Firebase ✅ TERMINÉ
- Persistance et synchronisation temps réel (Firebase Realtime Database)
- Projet Firebase : `menu-de-la-semaine-9bed7` (Europe West)
- Listener sur `db.ref('/')` pour synchronisation complète de l'état
- Fonctions : `bascule()`, `deb()`, `ajP()` écrivent dans Firebase
- Fonction `appliquerDepuisFirebase(data)` : applique l'état Firebase à l'UI
- Bug connu à tester : comportement des cases à cocher et synchronisation multi-appareils

### Phase 2b — Navigation Menu → Recette ✅ TERMINÉ
- Dîners cliquables dans l'onglet Semaine (`goRecette(idx)`)
- Bouton "← Retour au menu" sur chaque recette (`goMenu()`)
- CSS : `.meal-din`, `.lien-din`, `.btn-back`

### Phase 4 — Remplacement de recette ✅ TERMINÉ
- Bouton "↺ Autre recette" sur chaque carte de jour
- Modal de prévisualisation avant acceptation
- Mise à jour de la liste de courses automatique
- Fonctions : `changerRecette(idx, btn)`, `afficherModal()`, `fermerModal()`, `accepterRecette()`, `chercherAutre()`
- CSS : `.btn-swap`, `.modal-overlay`, `.modal`, `.btn-accept`, `.btn-reject`
- Variable globale : `recetteEnCours`

### Phase 5 — Modification d'ingrédient ✅ TERMINÉ
- Ingrédients cliquables dans les recettes (inline editor)
- Pattern : IDs uniques (`ing-1`, `ing-2`...) + `ingData{}` object + inline onclick
- Fonctions : `initIngredients()`, `ingOk(id)`, `ingAnnuler(id)`, `ingKey(e, id)`
- CSS : `.ing-item`, `.ing-edit`, `.ing-btn-ok`, `.ing-btn-cancel`, `.ing-changed`, `.ing-hint`

### Phase 6 — NutriCoach Chat ✅ TERMINÉ + enrichi
- Onglet "💬 NutriCoach" avec chat mobile-first
- 2 rôles : réponses nutrition + actions sur les menus
- Historique conservé : `chatHisto[]` (12 derniers échanges)
- Fonctions : `envoyerChat()`, `ajouterMsg()`, `afficherTyping()`, `retirerTyping()`, `executerActionChat()`
- Enter = envoyer, Shift+Enter = nouvelle ligne
- Actions disponibles (toutes gérées dans `executerActionChat()`) :
  - `remplacer_repas` (jour_idx 0-6 = Sam→Ven)
  - `generer_semaine`
  - `ajouter_courses`
  - `ajouter_site`
  - `ajouter_tag` / `supprimer_tag`
  - `supprimer_recette`
  - `modifier_profil` (champs : aime, naime_pas, restrictions, notes_sante, notes_nutrition)
  - `creer_recette` → crée une recette et l'ajoute à "Mes Recettes"
  - `creer_et_planifier` → crée + ajoute à la biblio + place dans le menu (avec `jour_idx`)

### Phase 7 — Génération semaine complète ✅ TERMINÉ
- Bouton "🗓️ Générer la semaine" dans l'en-tête
- Calcule la prochaine semaine Samedi → Vendredi automatiquement
- Fonctions : `genererSemaine(skipConfirm)`, `appliquerNouveauxMenus(data)`
- `skipConfirm = true` quand appelé depuis le chat
- Met à jour : J[], header, vue semaine, recettes, liste de courses, Firebase

### Skills NutriCoach ✅ TERMINÉ + enrichi
- Fichier `api/_skills.js` centralisé
- Calendrier saisonnier France, mois par mois (12 mois) avec liste interdite dynamique
- `getContexteSaisonnier()` : utilise `new Date()` côté serveur (date réelle)
- `getInstructionsSaisonnieres(ctx)` : liste autorisée + liste interdite générée dynamiquement
- `getSitesRessources(sitesExtra)` : 14 sites de référence + sites ajoutés par l'utilisateur
- Profil complet intégré : résultats sanguins réels, préférences culinaires, ordre de priorité des protéines
- Poisson : max 0-1 fois/semaine (habitude à construire, pas une priorité)
- Légumineuses : priorité absolue (3-4 fois/semaine)
- Cuisine terroir française uniquement sauf demande spécifique via chat
- Injecté dans les 3 APIs : recette.js, menus.js, chat.js

---

## Phases restantes à développer

### Phase 3 — Refonte complète du design ❌ ABANDONNÉE DÉFINITIVEMENT
- Design actuel conservé tel quel. Application restera single-file (index.html).

### Phase 8 — Profil santé ✅ INTÉGRÉ (statique)
- Profil complet intégré dans `api/_skills.js` depuis les fichiers Markdown fournis
- Résultats sanguins réels : glycémie 1,13 g/L, LDL 1,57, HDL 0,54
- Sites ressources : 14 sites, extensibles via le chat NutriCoach (sauvegardés Firebase)
- Mise à jour du profil via chat : action `modifier_profil` → Firebase `profil/`

### Phase 9 — Améliorations UX liste de courses ✅ TERMINÉ
- Filtre "✏️ Ajouté manuellement" : uniquement dans le menu "📍 Navigation par rayon"
- Cliquer un rayon désactive automatiquement le filtre manuel (`sTo()`)
- Le menu nav reste ouvert lors du toggle filtre (pas de fermeture automatique)
- Date `#courses-sub` calculée dynamiquement au chargement (JS, pas hardcodée)

### Phase 10 — Système de tags ✅ TERMINÉ
- `TAG_TAXONOMY` : 4 catégories (Service, Protéine, Style, Nutrition)
- Gestion des tags via modal (ouvrirGestionTags / fermerGestionTags)
- Réorganisation par glisser-déposer : `⠿` + HTML5 DnD + touch events mobile
  - `tagDndStart/Over/Drop/End` pour desktop
  - `initTagDndTouch(content)` pour mobile (touchstart/touchmove/touchend)
- Taxonomie personnalisée sauvegardée Firebase (`tag_taxonomy_custom`)

### Améliorations UX — 22 février 2026 ✅ TERMINÉ
- **Titre recette** : `.recipe-title-link` → underline fin solide (`text-decoration-thickness:1px`) au lieu de pointillé
- **Bouton "Cuisiner cette semaine"** : `position:fixed` en bas d'écran, visible uniquement quand ≥ 1 recette cochée dans Mes Recettes
  - Fonction `majBtnCuisiner()` appelée par `toggleRecetteJour()` et `tab()`
  - `#mesrecettes.on` a `padding-bottom:70px` pour ne pas masquer la dernière recette

---

---

## Profil utilisateur et schéma nutritionnel
Voir les fichiers sources complets :
- `mon profil santé.md` — profil physique, activité, habitudes alimentaires
- `Schéma nutritionnel personnalisé.md` — schéma détaillé, stratégies, progression sur 6 mois
- `Compte Rendu analyse sanguine medwin` — résultats sanguins commentés

### Résumé des points clés pour l'IA
- Homme 52 ans, cuisine terroir française, pas de déjeuner (collation rapide seulement)
- Glycémie 1,13 g/L (pré-diabète) + LDL 1,57 (élevé) + HDL 0,54 (bas) → IG bas strict
- Protéines : légumineuses (priorité) > volailles > œufs > poisson (max 1/semaine)
- Oméga-3 via végétaux : huile colza, noix, graines de lin (pas besoin de forcer le poisson)
- Interdits dans les recettes : charcuterie, fromages gras, beurre en cuisson, fritures

## Sites de référence recettes (14 sites — voir `Site ressources menu healthy .md`)
Stockés dans `api/_skills.js` → `SITES_RESSOURCES_DEFAUT`
Extensibles via le chat NutriCoach → sauvegardés dans Firebase `sites_ressources`
- cuisineaz.com — recettes IG bas variées
- marieclaire.fr/cuisine — anti-cholestérol méditerranéen

---

## Décisions techniques prises
- Firebase Realtime Database (projet `menu-de-la-semaine-9bed7`, Europe West)
- Vercel pour les fonctions serverless (dossier `api/`)
- Les fichiers `api/_*.js` (préfixe underscore) = utilitaires, pas des routes HTTP
- Application single-file (tout dans index.html) — définitif
- Anthropic SDK `@anthropic-ai/sdk ^0.39.0`
- Variable globale `J[]` : tableau de 7 objets (un par jour, index 0=aujourd'hui → 6=aujourd'hui+6)
- `J[i].date` : clé Firebase au format YYYY-MM-DD (semaine glissante depuis aujourd'hui)

## Profil utilisateur développeur
- Débutant complet en développement web
- Utilise Claude Code avec son abonnement claude.ai
- Mac avec Homebrew installé
- GitHub + Vercel connectés, déploiement automatique
- Toujours expliquer en français simple, pas à pas
- Toujours expliquer POURQUOI avant de donner une commande

---

## Corrections — Backlog
Règle : codée ≠ validée. Une correction est supprimée de cette liste seulement quand l'utilisateur confirme qu'elle fonctionne.

### 🟡 À faire (priorité basse)
- **#5** Qualité des recettes générées par Claude → retravailler prompt api/menus.js
