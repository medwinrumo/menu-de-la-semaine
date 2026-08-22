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
- Vercel — URL : https://menus.namour.eu
- DNS géré par Squarespace (domaine Google Workspace)
- ⚠️ **Déploiement automatique CASSÉ depuis le 21/07/2026** (constaté le 15/08/2026) : `gh api repos/medwinrumo/menu-de-la-semaine/hooks` renvoie `[]`, aucun webhook GitHub → Vercel. La prod est restée bloquée sur le build du 21/07 pendant 24 jours malgré plusieurs push (fix note recette, photo presse-papier, etc.), aucun n'était live jusqu'au déploiement manuel du 15/08. Reconnexion à faire dans le dashboard Vercel → Settings → Git (OAuth, pas faisable en CLI).
- **Tant que non reconnecté : redéployer manuellement après chaque push**, via CLI (`vercel --prod`, nécessite `vercel login` puis `vercel link` une fois) ou dashboard Vercel → projet → bouton "Redeploy"

## Structure des fichiers
- `index.html` : application complète (HTML + CSS + JS en un seul fichier)
- `CLAUDE.md` : ce fichier de contexte permanent
- `package.json` : dépendance `@anthropic-ai/sdk ^0.39.0`
- `api/_skills.js` : compétences centralisées de NutriCoach (calendrier saisonnier, profil santé, schéma nutritionnel, sites ressources)
- `api/recette.js` : remplacement d'une recette individuelle (claude-opus-4-6, max_tokens 1500)
- `api/menus.js` : génération de la semaine complète (claude-sonnet-4-6, max_tokens 8000)
- `api/chat.js` : assistant NutriCoach + actions sur les menus (claude-sonnet-4-6, max_tokens 1500)
- `api/import.js` : import de fichiers recettes (PDF, images, texte/markdown) via Claude vision/document (claude-sonnet-4-6, max_tokens 3000)
- `api/scrape.js` : import de recettes depuis une URL — extrait JSON-LD schema.org/Recipe en priorité, enrichit avec claude-haiku-4-5 (tags, astuces), fallback claude-sonnet-4-6 si JSON-LD absent
- `api/preparation.js` : plan de préparation optimisé (bouton 🍳 Détails) — chronologie des étapes, tâches parallélisables (claude-sonnet-4-6)
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

### Fix — 21 juillet 2026 ✅ TERMINÉ
- **Note recette (Mes Recettes) : boutons Enregistrer/Fermer ne fermaient pas l'éditeur** (iOS + Mac)
  - Cause : `fermerNoteRecette()` réassigne `el.onclick` (via `renderNoteEl`) pendant le dispatch du clic ; l'event bubblait ensuite jusqu'à `#rnote-k` qui venait de récupérer le nouvel `onclick` (`editerNoteRecette`), rouvrant l'éditeur instantanément
  - Fix : `event.stopPropagation()` sur les deux boutons (pattern déjà utilisé ligne du bouton ✕ effacer-note), `editerNoteRecette` / `sauvegarderNote` / `fermerNoteRecette`

### Feat + Fix — 15 août 2026 ✅ TERMINÉ — Photo recette sur tablette/téléphone
- **Ajout** : sur pointeur "coarse" (`matchMedia('(pointer: coarse)')`), le bouton 📷 d'une carte recette ouvre directement le sélecteur de fichier natif (`#photoRecetteInput`, `accept="image/*"`) au lieu d'attendre un collage Ctrl+V — impossible sans clavier/clic droit sur écran tactile. Desktop inchangé (pointeur fin → collage Ctrl+V).
  - `ajouterPhotoRecette(k)`, `onPhotoRecetteFileChange(input)`
- **Fix 1** : `traiterImageBlob()` n'avait aucune gestion d'erreur (ni `FileReader.onerror`, ni `Image.onerror`, ni `try/catch`) — un décodage échoué restait totalement silencieux, aucun toast, aucune trace console.
- **Fix 2 (cause réelle du bug rapporté)** : `photoRecetteInput.click()` déclenche un clic synthétique qui bulle jusqu'à `document`. Le listener global "clic hors de la carte annule l'attente photo" (ligne ~1941) le captait — l'input caché n'étant pas dans `#rcard-k` — et effaçait `_photoTargetKey` avant même l'ouverture du sélecteur natif. Résultat : "cible perdue, retape sur 📷" à chaque tentative. Fix : le listener ignore désormais les clics dont `target.id === 'photoRecetteInput'`.
  - Testé et confirmé fonctionnel sur Chrome iPad.

### Feat — 19 août 2026 — Renommer une recette depuis « Mes Recettes »
- **Ajout** : bouton ✏️ sur chaque carte de « Mes Recettes » (stock), même comportement que le crayon déjà présent dans la vue semaine (nom cliquable → input inline → Entrée valide, Échap annule).
  - Nouvelle fonction `editerNomRecettePerso(k, btn)` — `editRecetteTitre()` existant ne pouvait pas être réutilisé tel quel : `_rmpInfo()` ne résout que les clés de la semaine (`r{idx}_main|gou|N}`), pas les clés de `recettesPersoMap`. Écrit `nom` dans `recettes_perso/{fbKey}/nom`.
  - CSS : nouvelle classe `.recette-card-nom-edit` qui reproduit le `order`/`flex-basis` responsive de `.recette-card-nom` (ligne séparée en mobile, inline dès 600px), pour que le crayon et l'input d'édition restent collés au nom dans les deux dispositions.
  - Non testé sur appareil au moment du commit.

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

### 🔴 Sécurité — à traiter en priorité
- **#10** **La base Firebase est lisible par n'importe qui, sans authentification.** Vérifié le 22/08/2026 : `curl "https://menu-de-la-semaine-9bed7-default-rtdb.europe-west1.firebasedatabase.app/menus.json?shallow=true"` répond `200` avec les données, depuis une machine non connectée au compte. L'URL de la base est en clair dans le source de `menus.namour.eu`, donc publiquement connue. Sont exposés : menus, liste de courses, recettes perso, et le profil santé (`profil/`) — données de santé. **Droit d'écriture non testé** (un test aurait modifié la prod, pas fait sans accord) ; les règles par défaut de Firebase couplent lecture et écriture, donc à considérer comme ouvert en écriture tant que non vérifié. Correction : console Firebase → Realtime Database → Règles. Décision à prendre d'abord — l'app n'a aucune authentification, verrouiller la base impose donc d'en ajouter une (Firebase Anonymous Auth au minimum).

### 🟡 À faire (priorité basse)
- **#5** Qualité des recettes générées par Claude → retravailler prompt api/menus.js
- **#6** Reconnecter le déploiement automatique GitHub → Vercel (dashboard Vercel → Settings → Git). Voir section Hébergement.
- **#7** `ANTHROPIC_API_KEY` marquée "Non-sensitive" dans les variables d'environnement Vercel → repasser en "Sensitive" (dashboard Vercel → Settings → Environment Variables). Pas exposée publiquement mais visible en clair dans le dashboard.
- **#8** `.gen-group` (bouton « 🗓️ Générer la semaine ») porte `z-index:400`, au-dessus de `.modal-overlay` (`z-index:300`) : il s'affiche par-dessus la modale « Autre recette » quand elle n'est pas en mode `fullscreen`. Repéré le 22/08/2026 pendant la feature « recette manuelle ». Contournement local : `#manuel-modal{z-index:500}`. Correction de fond non faite (baisser `.gen-group`, ou remonter `.modal-overlay`) — risque de régression sur `.gen-popup`.
- **#9** `accepterRecette()` écrit `db.ref('menus/'+date).set({nom,din,dn,recette,dinerItems,enCourses})` sans `gou` ni `recetteGou` : comme c'est un `.set()` et pas un `.update()`, adopter une recette efface le goûter du jour. `supprimerService()` et `enregistrerRecetteManuelle()` écrivent, eux, le jeu de champs complet. Repéré le 22/08/2026, non corrigé.

### 🔵 À valider sur appareil
- **Recette manuelle depuis la vue Semaine (22/08/2026)** — bouton ✍️ sur chaque carte de jour, modale `#manuel-modal`, `ouvrirRecetteManuelle()` / `enregistrerRecetteManuelle()`. Testé dans Chrome avec Firebase neutralisé (`db = null`) : création, remplacement par type de service, alimentation de la liste de courses, rendu mobile 375 px, relecture d'une recette sans `ingredients`/`etapes` (RTDB ne stocke pas les tableaux vides). **Persistance Firebase réelle et synchro multi-appareils non vérifiées.**
