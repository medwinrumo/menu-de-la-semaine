# Journal pédagogique — Planificateur Menus Santé

Ce que la session a appris, expliqué simplement. Créé le 22/08/2026.
Le déroulé factuel est dans `menu-de-la-semaine.log.md`, les décisions et le
backlog dans `CLAUDE.md`.

---

## Jour 1 — 22/08/2026

### Session 1 — Pourquoi ton petit-déjeuner disparaissait

#### La leçon principale : `.set()` remplace tout, il n'ajoute rien

C'est le vrai enseignement de la session, et il explique un bug que tu subissais
sans le savoir.

Quand l'application enregistre une journée dans Firebase, elle utilisait une
commande qui veut dire **« remplace toute la journée par ceci »**. Pas
« ajoute ceci », pas « modifie ceci ». **Remplace tout.**

Concrètement, imagine une fiche cartonnée par jour :

```
SAMEDI 22 AOÛT
  Petit-déjeuner : porridge
  Midi           : salade de lentilles
  Goûter         : compote
  Dîner          : brochettes
  → courses      : oui
```

Le code prenait une fiche vierge, y recopiait à la main les lignes à conserver,
puis remplaçait l'ancienne fiche par la nouvelle. Tant qu'on recopie tout, aucun
problème. Mais **sept endroits différents du code faisaient cette recopie**, et
quatre oubliaient des lignes.

Résultat, quand tu demandais à NutriCoach de remplacer un repas :

```
SAMEDI 22 AOÛT
  Dîner          : nouveau plat
  → courses      : oui
```

Le petit-déjeuner, le midi et le goûter n'avaient pas été recopiés. Ils étaient
effacés. **Sans message d'erreur** — l'opération avait parfaitement réussi, elle
avait juste enregistré une fiche incomplète.

#### Pourquoi personne ne le voyait

Trois raisons qui valent pour beaucoup de bugs :

1. **Une écriture réussie n'est pas une écriture correcte.** Firebase confirmait
   l'enregistrement à chaque fois. Il n'avait aucun moyen de savoir que trois
   lignes manquaient.
2. **Le défaut n'est visible dans aucun des sept endroits pris isolément.**
   Chacun, lu seul, paraît correct. Le problème est dans **l'écart entre eux** —
   et on ne lit jamais sept bouts de code côte à côte.
3. **La perte est différée.** Tu ne perds pas le petit-déjeuner en le créant, tu
   le perds plus tard, en faisant tout autre chose. Le lien de cause à effet est
   invisible.

#### La correction : un seul endroit qui sait

Plutôt que de corriger les quatre fautifs, j'ai supprimé la possibilité même de
la faute. Il existe maintenant **une seule fonction** qui sait de quoi une
journée est faite (`objetJour`), et les sept endroits l'appellent.

Pour ajouter demain une nouvelle information au menu, on la déclare à un seul
endroit. Aucun code ne peut plus « oublier » de la recopier, puisque plus aucun
code ne recopie.

> **Le principe à retenir :** quand la même liste est écrite à plusieurs endroits,
> elle finira par diverger. Ce n'est pas une question de sérieux, c'est
> mécanique. La solution n'est pas de faire attention, c'est de n'avoir qu'un
> seul exemplaire.

#### Le même principe, vu à l'envers : le rayon qui revient en arrière

Ton deuxième bug de la session illustre la même idée sous un autre angle.

Tu déplaçais l'aneth de « Boucherie » vers « Légumes ». Ça marchait. Au clic
suivant, il repartait en boucherie.

J'ai d'abord vérifié le plus probable : **est-ce que ta correction est
enregistrée ?** Elle l'était. J'ai retrouvé `"aneth frais": "legumes"` dans
Firebase. L'écriture n'était pas en cause.

Le problème était à la **relecture**. À chaque clic dans la page, l'application
reconstruit la liste de courses de zéro. Et pour reconstruire, elle demandait au
code de deviner le rayon de chaque ingrédient — sans jamais consulter tes
corrections manuelles. Ta correction existait, personne ne la lisait.

> **Le principe :** quand quelque chose « ne tient pas », il y a deux hypothèses
> distinctes — ce n'est pas enregistré, ou c'est enregistré mais pas relu. Ce
> sont deux bugs différents, dans deux parties différentes du code. Vérifier
> laquelle des deux est vraie coûte une minute et évite de chercher au mauvais
> endroit.

#### Une méthode de test que tu peux réutiliser

Pour tester sans risquer tes vraies données, j'ai coupé la connexion Firebase
dans la page de test (`db = null`). Tout le reste de l'application fonctionne,
mais plus rien ne part vers le serveur.

**Avantage :** aucun risque d'abîmer tes menus.
**Limite, et elle est réelle :** ça ne teste pas l'aller-retour vers Firebase.
Un enregistrement peut marcher en apparence et échouer à la relecture — c'est
exactement le bug de l'aneth.

C'est pour ça que je te dis systématiquement ce qui reste à valider sur un vrai
appareil. Ce n'est pas une précaution de forme : c'est la moitié du chemin que
mes tests ne parcourent pas.

#### Ce que tu m'as appris cette session

Tu m'as repris sur ma façon de travailler : j'attendais ton feu vert pour
enregistrer, publier et déployer le code. Ta remarque était juste — sans
déploiement, tu ne peux rien tester, donc je ne t'avais rien livré. Ces trois
étapes font désormais partie du travail, sans te les demander. C'est écrit dans
`CLAUDE.md`, section « Boucle de livraison ».

Le raisonnement à retenir, valable au-delà de ce projet : **avant de poser une
question, écrire les deux réponses possibles.** Si l'une des deux n'a aucun sens
(« non, garde le travail invisible sur ton disque »), ce n'est pas une décision à
prendre, c'est une évidence à exécuter.
