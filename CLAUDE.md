# Planificateur Menus Santé — Fichier de contexte projet

## Description du projet
Mini-site web hébergé sur GitHub Pages.
Application de planification de menus hebdomadaires (samedi → vendredi)
avec liste de courses partagée en temps réel entre plusieurs appareils.
Projet conçu pour un utilisateur débutant en développement.
Toutes les instructions doivent être en français, simples et pas à pas.

## Dépôt GitHub
https://github.com/medwinrumo/menu-de-la-semaine

## Fichiers du projet
- index.html : application complète (HTML + CSS + JS en un seul fichier)
- CLAUDE.md : ce fichier de contexte permanent

---

## État actuel du projet

### Ce qui existe (V3 fonctionnel)
- Menus statiques sur 7 jours avec 3 repas/jour
- 7 recettes détaillées avec ingrédients et étapes
- Liste de courses organisée par rayon avec système caddie
- Cases à cocher (produit coché → passe dans le caddie)
- Ajout manuel de produits
- Échange de dîners entre jours
- Mode sombre automatique
- Responsive mobile
- Impression optimisée

### Problèmes identifiés à résoudre
- Liste de courses non persistante (se vide à chaque fermeture du navigateur)
- Pas de synchronisation entre appareils (téléphone utilisateur / téléphone compagne)
- Produits ajoutés manuellement non mémorisés dans leur rayon
- Pas de navigation possible entre un dîner et sa recette

---

## Feuille de route — Phases de développement

### Phase 1 — CLAUDE.md ✅ TERMINÉ
Création du fichier de contexte projet.

### Phase 2 — Firebase 🔴 À FAIRE
Objectif : persistance et synchronisation temps réel.
- Mémoriser l'état des cases cochées entre sessions
- Synchroniser en temps réel entre tous les appareils
- Mémoriser les produits ajoutés manuellement avec leur rayon
- Outil : Firebase Realtime Database (gratuit, Google)
- Hébergement : GitHub Pages

### Phase 2b — Navigation Menu → Recette 🔴 À FAIRE
- Dans l'onglet Semaine, chaque dîner affiché est cliquable
- Cliquer sur un dîner ouvre directement la recette dans l'onglet Recettes
- Bouton retour "← Retour au menu" visible sur chaque recette

### Phase 3 — Refonte complète du design 🔴 À FAIRE
- Design créé dans Google Stitch puis exporté en .zip
- Le design Stitch remplace totalement le HTML/CSS du V3
- La logique JavaScript (Firebase, liste de courses, recettes) est conservée
- Sera intégré APRÈS que Firebase soit fonctionnel
- Éléments à prévoir dans Stitch :
  * 3 onglets : Semaine / Recettes / Courses
  * Cartes journalières cliquables (7 jours)
  * Cartes recettes avec ingrédients et étapes
  * Liste de courses avec cases à cocher
  * Section caddie
  * Champ ajout produit manuel
  * Zone de chat nutritionnel

### Phase 4 — Remplacement de recette 🔴 À FAIRE
- Bouton "Cette recette ne me convient pas" sur chaque jour
- Recherche automatique d'une recette alternative via les sites de référence
- La nouvelle recette respecte le schéma nutritionnel et le profil santé
- La liste de courses se met à jour automatiquement

### Phase 5 — Modification d'ingrédient 🔴 À FAIRE
- Cliquer sur un ingrédient dans une recette pour le sélectionner
- Saisir l'ingrédient de remplacement (ex : blancs de poulet → blancs de dinde)
- La recette et la liste de courses se mettent à jour automatiquement

### Phase 6 — Chat nutritionnel intégré 🔴 À FAIRE (à construire)
Un assistant nutritionnel directement dans le site avec deux rôles :

Rôle 1 — Répondre aux questions nutrition
- L'utilisateur pose des questions sur sa santé, ses aliments, ses apports
- Claude répond en tenant compte du profil santé et du schéma nutritionnel

Rôle 2 — Intervenir dans la composition des menus
- Exemples de commandes possibles dans le chat :
  * "Pour le menu de la semaine, prévois du lapin"
  * "Je veux moins de viande cette semaine"
  * "Propose un dîner sans gluten pour mercredi"
- Claude choisit une recette adaptée à la demande ET au profil santé
- La liste de courses se met à jour automatiquement

### Phase 7 — Génération automatique de menus 🔴 À FAIRE (à construire)
- Générer un nouveau menu complet pour la semaine suivante
- Respect strict du schéma nutritionnel personnalisé
- Préparation max 30 min, cuisson max 45 min
- Légumes de saison
- Variété assurée (pas la même recette deux semaines de suite)
- S'inspire des sites de référence fournis

### Phase 8 — Profil santé et compétences nutritionniste 🔴 À CONSTRUIRE
- Créer et stocker le profil santé complet de l'utilisateur
- Donner à Claude des compétences de nutritionniste pour :
  * Mieux sélectionner les recettes adaptées au profil
  * Répondre aux questions nutrition dans le chat
  * Ajuster les menus selon les objectifs santé
- Le profil santé alimentera toutes les autres fonctionnalités

---

## Schéma nutritionnel personnalisé

### Axes prioritaires
1. Améliorer la qualité des lipides (réduction graisses saturées)
2. Stabiliser la glycémie (IG bas)
3. Augmenter les fibres et antioxydants
4. Hydratation progressive
5. Oméga-3 végétaux quotidiens

### Structure des repas journaliers
- Petit-déjeuner : léger (eau citronnée + fruit + oléagineux ou œufs + pain seigle)
- Collation midi : cru et rapide (crudités, smoothie vert, fruits + noix)
- Dîner : 1/2 légumes + 1/4 protéines + 1/4 féculents complets + bonnes graisses

### Aliments à privilégier
- Légumes verts à volonté, légumineuses, céréales complètes
- Volailles (poulet, dinde), œufs (1/jour max), poisson
- Huile olive et colza, noix, amandes, noisettes, graines de lin
- Pain seigle, riz basmati, quinoa, boulgour, pommes de terre vapeur

### Aliments à limiter
- Graisses saturées (crème, beurre en excès, fromage gras)
- Sucres rapides, pâtisseries industrielles
- Charcuterie grasse (saucisson, rillettes, pâtés)
- Alcool (max 2-3 verres de vin/semaine)

### Objectifs santé
- Réduire le cholestérol LDL de 10-15% en 3 mois
- Améliorer la glycémie à jeun
- Perdre 2-3 kg de graisse abdominale en 6 mois
- Améliorer les marqueurs sanguins (bilan à 3 mois et 6 mois)

---

## Sites de référence recettes

1. https://cuisinerigbas.com — IG bas, plats mijotés
2. https://www.lanutrition.fr/cuisine-et-recettes/recettes-sante/index-glycemique-bas — scientifique
3. https://www.santemagazine.fr/alimentation/regime-alimentaire/regime-anti-cholesterol — anti-cholestérol
4. https://www.primevere.com/idees-recettes/plats/ — plaisir adapté cholestérol
5. https://bienvenuechezvero.fr/recettes-ig-bas-idees-menus — familial IG bas
6. https://saines-gourmandises.fr/ig-bas-forme-et-minceur/ — terroir IG bas
7. https://jow.fr/blog/posts/quest-ce-que-lalimentation-a-ig-bas — pédagogique
8. https://www.cuisineaz.com — recettes IG bas toute l'année
9. https://www.marieclaire.fr/cuisine — anti-cholestérol méditerranéen
10. https://www.passionnutrition.com/baisser-le-cholesterol/ — diététicienne expert

---

## Décisions techniques prises
- Firebase Realtime Database pour persistance et synchronisation temps réel
- Hébergement GitHub Pages
- Application single-file (tout dans index.html) jusqu'à la Phase 3
- Après Phase 3 : structure multi-fichiers possible selon complexité

## Profil utilisateur développeur
- Débutant complet en développement web
- Utilise Claude Code avec son abonnement claude.ai
- Mac avec Homebrew installé
- GitHub connecté à Claude Code
- Toujours expliquer en français simple, pas à pas
- Toujours expliquer POURQUOI avant de donner une commande
