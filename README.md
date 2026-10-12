# gabrielhalus.com

Site vitrine sous **Payload CMS 3** + **Next.js 16**, base **PostgreSQL**, styles **Tailwind CSS v4**.
Design : « Vellum, édition Halus » (encre `#101010`, papier `#EFEFEF`, citron `#DBF54C`, Schibsted Grotesk + JetBrains Mono).

## Démarrer

Postgres est requis, y compris en local (commande `docker run` dans `.env.example`).

```bash
pnpm install
cp .env.example .env        # puis renseigner PAYLOAD_SECRET
pnpm seed                   # contenu des maquettes, placeholders « […] » à personnaliser
pnpm dev                    # http://localhost:3000 — admin sur /admin
```

Au premier passage sur `/admin`, Payload demande de créer le compte administrateur.

## Pages

| Route | Source du contenu |
| --- | --- |
| `/` | Global **Accueil** + collections Projets et Offres métier |
| `/[slug]` (ex. `/traiteurs`) | Collection **Offres métier** (statut « En ligne ») |
| `/contact` | Global **Page Contact** ; les envois arrivent dans **Demandes de contact** |
| `/guides`, `/guides/[slug]` | Collection **Guides** (sommaire généré depuis les H2, JSON-LD Article/FAQ) |
| `/projets/[slug]` | Collection **Projets** (étude de cas) |
| `/mentions-legales`, `/cookies` | Globals **Mentions légales** et **Cookies** ; identité légale dans **Réglages du site** |

Projets, offres et guides ont des brouillons : seuls les documents publiés apparaissent sur le site.
Toute modification dans l'admin invalide le cache Next (`src/hooks/revalidate.ts`).

Suivi des QR codes : chaque QR code imprimé pointe vers `/q/{code}` (ex. `/q/nqwrsv` pour les cartes de visite).
La route compte le scan (date et type d'appareil, sans IP ni cookie, robots d'aperçu exclus) puis redirige vers la
destination réglée dans **Suivi › QR codes**, modifiable sans réimprimer. Un code inconnu ou inactif renvoie à l'accueil.

Images de partage : `/og` (accueil et pages fixes) et `/og/{offers|guides|projects}/[slug]` sont générées
d'après la maquette, avec Curso. Une image choisie dans l'onglet SEO d'un document, ou « Image de partage »
dans **Réglages du site**, prend le dessus.

## Organisation

- `src/collections`, `src/globals` : modèle de contenu
- `src/blocks` : blocs insérables dans le contenu riche des guides (encadré, CTA offre, étapes, liste à coches, figure)
- `src/app/(frontend)/styles.css` : tokens du design system (`@theme`)
- `src/components/Curso.tsx` : la mascotte (tons, expressions, effets glitch et transparence)
- `src/og` : gabarit et polices des images de partage
- `src/components/ui.tsx` : primitives (boutons pilule, blocs, eyebrow, tags, FAQ…)
- `src/seed` : contenu de démonstration

## Déploiement (Dokploy)

`docker-compose.yml` construit l'image (`Dockerfile`, sortie `standalone`) et lance Postgres ; aucun port n'est publié,
Traefik joint le service `payload` sur le port 3000 (domaine à déclarer dans Dokploy). Variables à renseigner :
`POSTGRES_PASSWORD`, `PAYLOAD_SECRET`, et éventuellement `POSTGRES_USER`, `POSTGRES_DB`, `CONTACT_NOTIFICATION_EMAIL`.
Les médias vont dans le volume `media`, la base dans `pgdata`.

Les migrations de `src/migrations` s'appliquent au démarrage. Sur une base vierge (Réglages jamais enregistrés),
le contenu des maquettes est ensuite chargé automatiquement, une seule fois (`SEED_ON_INIT=false` pour l'empêcher). Après une modification du schéma :
`pnpm payload migrate:create nom_du_changement` (en local, le mode dev synchronise la base tout seul).
Le site public est rendu à la demande : la base n'est pas joignable pendant le build de l'image.

## À brancher

- **E-mails** : sans adaptateur, Payload écrit les e-mails dans la console. Ajouter un adaptateur (Resend, Nodemailer…) dans `payload.config.ts` pour la notification et l'accusé de réception du formulaire.
- **Mesure d'audience** : le consentement est lu via `src/lib/consent.ts` (cookie `gh_consent`, évènement `gh:consent-change`) ; charger l'outil uniquement si `analytics` est accepté.
- **Médias** : stockés dans le volume Docker `media` ; à sauvegarder avec la base, ou passer à un stockage objet (S3…) si besoin.
