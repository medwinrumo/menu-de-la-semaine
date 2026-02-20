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
- URL actuelle : https://menus.medwinrumo.fr
- URL finale souhaitée : https://menus.hebdo.fr
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

### Phase 6 — NutriCoach Chat ✅ TERMINÉ
- Onglet "💬 NutriCoach" avec chat mobile-first
- 2 rôles : réponses nutrition + actions sur les menus
- Historique conservé : `chatHisto[]` (12 derniers échanges)
- Actions : `remplacer_repas` (jour_idx 0-6 = Sam→Ven) et `generer_semaine`
- Fonctions : `envoyerChat()`, `ajouterMsg()`, `afficherTyping()`, `retirerTyping()`, `executerActionChat()`
- Enter = envoyer, Shift+Enter = nouvelle ligne

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

### Phase 3 — Refonte complète du design 🔴 À FAIRE EN DERNIER
- Design créé dans Google Stitch puis exporté en .zip
- Le design Stitch remplace totalement le HTML/CSS
- La logique JavaScript (Firebase, recettes, chat) est conservée
- Éléments à prévoir dans Stitch :
  * 4 onglets : Semaine / Recettes / Courses / NutriCoach
  * Cartes journalières cliquables (7 jours)
  * Cartes recettes avec ingrédients et étapes
  * Liste de courses avec cases à cocher + section caddie
  * Zone de chat nutritionnel

### Phase 8 — Profil santé ✅ INTÉGRÉ (statique)
- Profil complet intégré dans `api/_skills.js` depuis les fichiers Markdown fournis
- Résultats sanguins réels : glycémie 1,13 g/L, LDL 1,57, HDL 0,54
- Sites ressources : 14 sites, extensibles via le chat NutriCoach (sauvegardés Firebase)
- Actions chat : `remplacer_repas`, `generer_semaine`, `ajouter_courses`, `ajouter_site`
- Évolution possible : permettre mise à jour du profil via l'interface (Phase 8b)

---

## Prochaine session — Tests à effectuer

Au début de la prochaine session, effectuer des tests complets de toutes les fonctionnalités :

1. **Firebase / Base de données** ← bugs signalés par l'utilisateur
   - Synchronisation multi-appareils (ouvrir sur 2 appareils simultanément)
   - Persistance des cases cochées après fermeture/réouverture
   - Persistance des produits ajoutés manuellement
   - Suppression d'un produit du caddie (`deb()`)
   - Comportement après `genererSemaine()` : la liste de courses se remet-elle à zéro proprement ?

2. **Navigation**
   - Cliquer sur un dîner → recette correspondante s'affiche
   - Bouton retour → retour à l'onglet Semaine
   - Navigation entre les 4 onglets

3. **Remplacement de recette (Phase 4)**
   - Bouton "↺" sur chaque jour
   - Modal s'affiche avec la nouvelle recette
   - "Accepter" → recette mise à jour dans le planning
   - "Non merci" → cherche une autre alternative
   - La liste de courses est mise à jour

4. **Modification d'ingrédient (Phase 5)**
   - Cliquer sur un ingrédient → champ éditable apparaît
   - Modifier + valider → ingrédient mis à jour
   - Annuler → retour à l'original

5. **Génération semaine (Phase 7)**
   - Bouton "🗓️ Générer la semaine"
   - 7 jours générés avec légumes de saison (février = poireaux, carottes, navets...)
   - Liste de courses mise à jour
   - Firebase mis à jour

6. **NutriCoach Chat (Phase 6)**
   - Question nutrition → réponse texte
   - Commande "Change le dîner de lundi" → action remplacer_repas
   - Commande "Génère une nouvelle semaine" → action generer_semaine
   - Vérifier que les légumes suggérés sont de saison

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
- Application single-file (tout dans index.html) jusqu'à la Phase 3
- Anthropic SDK `@anthropic-ai/sdk ^0.39.0`
- Variable globale `J[]` : tableau de 7 objets (un par jour, index 0=Sam → 6=Ven)

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

### 🔵 Codées — en attente de validation
- **#2** Sélecteur type service (Plat/Entrée/Accomp.) dans zone jour des cartes Mes Recettes
- **#6** Chat NutriCoach : recette appliquée au planning (regex JSON robuste dans api/chat.js)
- **#7** Bouton ✕ service : onglet Recettes affiche "Aucun dîner planifié" quand tout est supprimé
- **#8** Liste de courses : label raccourci "Sam — Poulet…" (sans emoji, sans date)
- Suppression plat : ne réapparaît plus sans label
- accepterRecette() / executerActionChat : label PLAT + bouton ✕ présents
- Chat NutriCoach : scroll fonctionnel, question visible
- Champignons autorisés toute l'année
- Liste de courses : ingrédients persistants + label "Jour — Recette" correct
- Bouton ✕ présent sur menus générés par API
- Modification ingrédient : bon rayon, update en place (pas de doublon)

### 🟡 À faire (priorité basse)
- **#5** Qualité des recettes générées par Claude → retravailler prompt api/menus.js
