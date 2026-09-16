# Compagnie Jizo — site Astro

Reprise du site VitePress sous Astro, avec une section Agenda alimentée par des
fichiers Markdown.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
npm run preview  # prévisualise dist/
```

## Ajouter un spectacle et ses dates

Tout se passe dans `src/content/spectacles/`. Un fichier `.md` par spectacle, le
nom du fichier devient l’URL (`les-vivants.md` → `/spectacles/les-vivants`).

```yaml
---
titre: Les Vivants
accroche: Une veillée pour chant, masque et récit.
resume: Trois acteurs racontent leurs morts et leurs vivants.
annee: 2026
duree: 55 min
ordre: 2 # position sur la page Spectacles
distribution:
  - Avec Prénom Nom
dates:
  - date: 2026-11-08 # obligatoire, format AAAA-MM-JJ
    heure: 18h30
    lieu: Salle des fêtes
    ville: Guérande
    billetterie: https://…  # facultatif
    complet: false          # facultatif
    note: Séance scolaire   # facultatif
---
Le texte de présentation, en Markdown.
```

Rien d’autre à faire : la page `/agenda` lit les dates de **tous** les
spectacles, les trie par ordre chronologique, et sépare automatiquement les
dates à venir des dates passées. Les trois prochaines apparaissent aussi sur la
page d’accueil.

Règles de comportement des dates :

| Cas                       | Ce qui s’affiche      |
| ------------------------- | --------------------- |
| `billetterie` renseignée  | bouton « Réserver »   |
| `complet: true`           | mention « Complet »   |
| pas de `billetterie`      | « Billetterie à venir » |
| date passée               | bascule dans l’archive dépliable |

Une date reste affichée comme « à venir » jusqu’à la fin de sa journée.

## Spectacles et artistes : le même format

Les deux pages listes (`/spectacles` et `/artistes`) partagent le même
composant d'aperçu, `src/components/Vignette.astro` : image tirée du
frontmatter, titre, une ligne de contexte, une ou deux phrases. Un clic mène à
la page détail. Modifier ce composant change les deux grilles d'un coup.

## Ajouter un artiste

Un fichier par artiste dans `src/content/artistes/`. La page `/artistes` affiche
une grille d'aperçus (photo, nom, rôle, extrait) et chaque aperçu mène à la page
détail `/artistes/<nom-du-fichier>`.

```yaml
---
nom: Prénom Nom
role: Comédienne, masque
extrait: Formée au jeu masqué, elle mène les stages de la compagnie depuis 2018.
portrait: ./images/prenom-nom.jpg
ordre: 1
---
La biographie complète, en Markdown : elle n'apparaît que sur la page détail.
```

`extrait` est du texte simple, une ou deux phrases, uniquement pour l'aperçu.
`portrait` est la même photo aux deux endroits : Astro en génère une version
recadrée en 4/5 pour la grille et une plus grande pour la fiche. Sans photo,
l'aperçu réserve simplement l'emplacement.

La page détail liste aussi les spectacles où le nom de l'artiste apparaît dans
la `distribution` — rien à saisir en double.

## Écrire un article du journal

Un fichier par article dans `src/content/blog/`. Le nom du fichier fait l'URL
(`stage-de-masque-avril.md` → `/blog/stage-de-masque-avril`).

```yaml
---
titre: Un stage de masque, et la limite qui tombe
description: Le résumé affiché dans la liste, le flux RSS et les partages.
date: 2026-04-02
maj: 2026-04-10        # facultatif
auteur: Compagnie Jizo # facultatif
image: ./images/stage-masque.jpg # facultatif
tags:
  - stage
  - transmission
brouillon: false       # true = visible en local, absent du site publié
---
Le corps de l'article, en Markdown : titres, listes, citations, liens.
```

Les articles sont triés du plus récent au plus ancien, la navigation
précédent / suivant est automatique, et `/rss.xml` est mis à jour à chaque
build. Un article en `brouillon: true` apparaît en `npm run dev` avec une
étiquette, et disparaît du `npm run build`.

Attention à un détail YAML : si une valeur contient un deux-points suivi d'un
espace, entourez-la de guillemets doubles.

## Images

Les visuels vont à côté du contenu qui les utilise —
`src/content/spectacles/images/` et `src/content/artistes/images/` — et sont
référencés en relatif :

```yaml
affiche: ./images/cercle-de-craie.jpg
portrait: ./images/prenom-nom.jpg
```

Astro les optimise et génère les bonnes tailles. Les fichiers de
`public/` (logo, favicon) sont servis tels quels, sans traitement.

## Couleurs

Le vert de VitePress est repris. Tout part de quatre variables en haut de
`src/styles/global.css` :

```css
--vert: #3eaf7c;      /* accent : filets, survols */
--vert-lien: #1e7a55; /* liens et texte, assez foncé pour rester lisible */
--vert-plein: #1e7a55;/* fond des boutons Réserver */
--sur-plein: #ffffff; /* texte posé dessus */
```

Changez `#3eaf7c` par le vert exact de votre `.vitepress/theme/style.css` si
la teinte diffère, et ajustez `--vert-lien` en conséquence : c'est la seule
valeur qui doit rester assez sombre pour du texte sur fond blanc.

Le mode sombre suit le réglage du système (`prefers-color-scheme`), comme le
faisait le bouton « Appearance » de VitePress.

## Ce qui change par rapport à VitePress

| VitePress                        | Astro                                        |
| -------------------------------- | -------------------------------------------- |
| `.vitepress/config.mts`          | `astro.config.mjs`                            |
| Nav et sidebar dans la config    | `src/components/Header.astro`                 |
| Thème par défaut surchargé en CSS| Layouts et composants explicites              |
| `index.md` avec frontmatter hero | `src/pages/index.astro`                       |
| Pages `.md` à la racine          | `src/pages/*.astro` + collections de contenu  |
| Pas de blog intégré              | collection `blog` + `/rss.xml`                |
| `--vp-c-brand-1` dans le thème   | `--vert` dans `src/styles/global.css`         |
| `/agenda.html`                   | `/agenda` (redirections dans `public/_redirects`) |

Le contenu éditorial (spectacles, artistes) reste en Markdown : c’est le
composant `Content` d’Astro qui le rend, comme VitePress le faisait.

## Redirections des anciennes URLs

`public/_redirects` couvre Netlify et Cloudflare Pages. Pour d’autres
hébergeurs :

**nginx**

```nginx
location = /agenda.html { return 301 /agenda; }
location = /spectacles.html { return 301 /spectacles; }
location = /artistes.html { return 301 /artistes; }
location = /contact.html { return 301 /contact; }
```

**Apache** (`.htaccess` à placer dans `public/`)

```apache
RewriteEngine On
RewriteRule ^agenda\.html$ /agenda [R=301,L]
RewriteRule ^spectacles\.html$ /spectacles [R=301,L]
RewriteRule ^artistes\.html$ /artistes [R=301,L]
RewriteRule ^contact\.html$ /contact [R=301,L]
```

## Mise en ligne

`npm run build` produit un dossier `dist/` entièrement statique, à déposer sur
n’importe quel hébergement. Pensez à corriger `site:` dans `astro.config.mjs`
quand le site passera de `dev.compagniejizo.fr` au domaine définitif — c’est
cette valeur qui alimente le sitemap.

## Pistes pour la suite

- **Interface d’édition** : si l’auteur ne veut pas toucher aux fichiers,
  Decap CMS ou Sveltia CMS se branchent sur ces mêmes fichiers Markdown et
  donnent un formulaire (date, lieu, ville, lien billetterie) avec commit
  automatique sur GitHub.
- **Flux iCal** : une route `src/pages/agenda.ics.ts` peut générer un calendrier
  abonnable à partir des mêmes données.
- **Données structurées** : ajouter du JSON-LD `TheaterEvent` sur les fiches
  spectacle pour que les dates remontent dans Google.
