# Unlimited Niger — version à plat (GitHub + Cloudflare Pages)

35 fichiers, aucun dossier.

| Fichier | Rôle |
|---|---|
| `index.html` | Application client (web mobile, installable : PWA) |
| `admin.html` | Espace partenaires et administration (adresse `/admin`, installable « Unlimited Pro ») |
| `_worker.js` | Le serveur complet : comptes, modules, paiements, porte-monnaie, base de données |
| `_headers` | Protections de sécurité du site et réglages de l'application installable |
| `manifest.webmanifest`, `admin.webmanifest` | Fiches de l'application installable (client et partenaires) |
| `sw.js` | Ouverture de l'application sans réseau (écran, logos, images ; jamais les données personnelles) |
| `icon-*.png`, `apple-touch-icon.png` (6) | Icônes de l'application installée |
| `UnlimitedNiger-logo.png` / `.svg`, `UnlimitedNiger-icone.png` | Logo et icône |
| `hero-*.jpg` (5) | Photos de l'accueil |
| `logo-*.png` (13) | Logos des compagnies, assureurs et pharmacies |
| `README.md` | Ce guide |

**Réglages Cloudflare Pages** : Framework **None** · Build command **vide** · Build output directory **vide** (racine).

**Liaison obligatoire** : Settings → Bindings → D1 database → nom **DB** → base `supappniger`, puis redéployer.

**Variables (facultatives)** : `GOOGLE_CLIENT_ID` (connexion Gmail) ; `GATEWAY_PROVIDER` (paiement automatique). La clé de l'agrégateur, `GATEWAY_SECRET` (ou `GATEWAY_KEY`), se met avec le type **Secret** (chiffré), jamais en simple variable. Aucune clé secrète ne doit être mise sur GitHub. `TRAVELPAYOUTS_TOKEN` (type **Secret**) : prix des vols en direct dans le comparateur ; sans elle, le comparateur affiche des prix de démonstration. Ne jamais mettre `GOOGLE_FAKE_TOKENS` ni `DEMO_PASSWORD` en ligne (réservés aux tests).

Première visite de `/admin` : création du compte super administrateur. La base se crée et se met à jour toute seule (version 21).

Partenaires de test : Réglages → « Ajouter les partenaires de test » (mot de passe tiré au hasard, montré une seule fois) ; « Retirer les partenaires de test » les supprime avec leurs activités de test.

`_worker.js` et `admin.html` sont fabriqués automatiquement à partir du code source :
`python3 tools/bundle-worker.py` et `python3 tools/build-admin.py tools/admin.template.html`.
