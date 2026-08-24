# Journal de bord — Planificateur Menus Santé

Entrées factuelles, une section par session. Créé le 22/08/2026 : le projet
documentait jusque-là uniquement dans `CLAUDE.md`, qui reste le registre des
décisions et du backlog. Ce fichier porte le déroulé, pas les décisions.

---

## Jour 1 — 22/08/2026 — Écrire une recette à la main, sans passer par l'IA

### Session 1 — Recette manuelle, extension à tous les repas, deux correctifs courses

**Livré et déployé en production** (`menus.namour.eu`), 7 commits, de `f3e7a1e` à `8557844`.

**Feature — écrire une recette à la main**
- Bouton ✍️ dans la vue Semaine, ouvrant une modale `#manuel-modal` : emoji, nom,
  repas, service, prépa/cuisson, ingrédients (un par ligne), étapes (une par ligne).
- Seul le nom est obligatoire.
- Fonctions : `ouvrirRecetteManuelle()`, `enregistrerRecetteManuelle()`,
  `fermerRecetteManuelle()`, `majServiceManuel()`, `supprimerRepasSimple()`,
  `blocRepasSimple()`, `nettoyerSaisie()`, `lignesSaisie()`.
- Position du bouton revue en cours de session à la demande de Medwin : d'abord
  dans la ligne Dîner, puis déplacé en haut à droite de la carte du jour, à gauche
  de la case à cocher — il vaut pour la journée, pas pour le seul dîner.
- Nouveaux champs `recettePdj` et `recetteCol`, sur le patron de `recetteGou` :
  le petit-déjeuner et le midi n'étaient que du texte et ne pouvaient porter
  aucune recette.

**Correctif majeur — perte de données Firebase**
- Sept appels `db.ref('menus/'+date).set({…})` recopiaient la liste des champs du
  jour à la main. Quatre en oubliaient.
- Conséquences en production : `executerActionChat()` et `accepterRecette()`
  effaçaient petit-déjeuner, midi et goûter du jour ; `supprimerService()` et
  `supprimerGouteur()` effaçaient petit-déjeuner et midi.
- Corrigé par un point d'écriture unique : `objetJour(idx)` / `ecrireJour(idx)`.
- Trois écritures partielles conservées volontairement : `/enCourses`,
  `/dinerItems`, et l'`update({pdj, col})` de la génération de semaine.
- Ferme le backlog #9, qui ne voyait qu'un des sept sites.

**Correctif — déplacement de rayon dans la liste de courses**
- Signalé par Medwin : déplacer un produit de rayon (icône 🛒) fonctionnait une
  fois puis revenait en arrière au clic suivant.
- L'écriture Firebase était correcte (`courses/rayon_overrides` contenait bien
  `"aneth frais": "legumes"`). C'est `getIngsRecette()` qui ne relisait jamais
  `rayonOverrides` et rappelait `devinerRayon()` à chaque reconstruction.
- `rayonFiable()` appliquait bien la surcharge, mais n'était appelé que sur
  `coursesAAjouter`, jamais sur `ingredients`.

**Changement de comportement demandé par Medwin**
- La modale n'envoie plus les ingrédients à la liste de courses. La case à cocher
  de la carte du jour redevient le seul déclencheur.
- Conséquence acceptée : sur un jour déjà coché, une recette écrite après coup
  demande de décocher puis recocher.

**Sécurité — constat, non corrigé**
- La base Realtime Database répond `200` à une lecture non authentifiée depuis une
  machine hors du compte. Menus, courses, recettes et profil santé exposés.
- Droit d'écriture non testé (le test aurait modifié la production).
- Medwin : « ok j'ai compris le probleme de secu. on verras plus tard. »
- Consigné en backlog #10.

**Méthode**
- Deux relances de Medwin pour obtenir commit, push puis déploiement.
- Règle inscrite dans `CLAUDE.md` (« Boucle de livraison ») et en mémoire projet.

**Non vérifié à la clôture**
- Persistance Firebase réelle et synchro multi-appareils des recettes manuelles :
  tous les tests tournaient avec Firebase neutralisé (`db = null`) pour ne pas
  écrire dans les données réelles.
- Signalement « salade verte absente de la liste de courses » non reproduit
  (backlog #11).

**Constats de clôture — signalés à Medwin, non traités**
- ~~`~/dev/wiki` porte un commit non poussé~~ — **poussé le 24/08/2026 sur
  demande de Medwin.** Le push direct a été refusé : trois lints nocturnes
  (22, 23, 24/08) étaient arrivés sur le distant, et `journal-log.md` était
  modifié des deux côtés. Résolu par `git pull --rebase` puis fusion manuelle du
  conflit, les deux contenus conservés — l'entrée `pwa-ios-session` du 21/08
  replacée avant les lints pour garder l'ordre chronologique du fichier. Commit
  rejoué en `19ad3ed`, écart avec origin ramené à 0. Lint relancé : 1566
  problèmes, chiffre identique à celui des trois lints nocturnes, donc rien
  d'introduit ; 4 axes bloquants, tous antérieurs et déjà couverts par 36 cartes
  kanban.
- Le carnet `~/.claude/observations/log.md` compte **39 observations au statut
  OUVERT** après ajout des n° 114 et 115 de cette session. L'étape 7 de `/maj`
  demande de les passer en revue avec Medwin ; le stock dépasse ce qu'une fin de
  session peut absorber. Proposé : une session dédiée au tri. Non planifié à ce
  jour — à relancer au prochain `/maj` si rien n'a bougé.
