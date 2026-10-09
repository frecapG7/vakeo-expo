# Plan — Deep linking https (Universal Links / App Links)

Objectif : les liens de partage sont des `https://<domaine>/token/<jwt>`.
Tapés depuis n'importe où (WhatsApp, SMS, mail, QR), ils ouvrent l'app si elle est
installée, sinon une page web de fallback qui propose l'App Store / le Play Store.

Contraintes posées :
- Le package name ne change pas (`com.frecapg7.olyne` prod / `com.frecapg7.vakeoexpo`
  dev) — l'historique prime sur la cohérence du nom.
- Le scheme custom (`olyne://` prod, `vakeoexpo://` dev) reste lisible par l'app,
  mais il **n'est plus le lien distribué** : trop de surfaces ne linkifient pas les
  schemes custom, et sans app installée c'est un cul-de-sac.
- À faire valider avec le back en même temps que la fix encodedId (même spec share).

---

## 1. Back / infra — le gros du travail

### 1.1 Domaine

- Choisir le domaine des liens (ex. `join.<marque>.app`, ou un sous-domaine du
  domaine existant). Il doit servir du HTTPS valide, sans redirect 301 sur les
  fichiers well-known.
- Le domaine du lien et le domaine qui sert les fichiers de vérification doivent
  être **exactement les mêmes** (sous-domaine compris).

### 1.2 Page de fallback `GET /token/:value` (web)

Page minimale servie quand l'app n'est pas installée :

- Ne pas résoudre le token côté serveur pour l'affichage — le JWT est une
  credential bearer ; afficher au maximum le nom du voyage, pas plus
  (le resolve complet reste dans l'app).
- Détection plateforme via User-Agent :
  - iOS : bouton « Ouvrir dans l'app » → `olyne://token/<jwt>` (tentative
    d'ouverture, fallback store après ~1 s) + lien App Store direct.
  - Android : bouton « Ouvrir dans l'app » → intent `olyne://token/<jwt>` ou
    lien https (l'App Link intercepte avant la page) + lien Play Store.
  - Desktop : liens store uniquement.
- URLs store à fournir : App Store (id Apple) + Play Store (`com.frecapg7.olyne`).

### 1.3 Android App Links — `/.well-known/assetlinks.json`

Servi en `application/json`, HTTPS, aucun redirect, sur le même domaine :

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.frecapg7.olyne",
    "sha256_cert_fingerprints": ["<SHA-256 de la clé de signature>"]
  }
}]
```

- Avec Play App Signing : c'est l'empreinte de la **clé de signature d'app**
  (Play Console → Setup → App signing), pas celle de l'upload key.
- Dev client : ajouter une deuxième entrée avec le package dev
  (`com.frecapg7.vakeoexpo`) et l'empreinte du keystore de debug/EAS.
- Vérification : https://developers.google.com/digital-asset-links/resources/generator-generator

### 1.4 iOS Universal Links — `/.well-known/apple-app-site-association`

Servi en `application/json` (chemin **sans** extension `.json`), HTTPS, aucun redirect :

```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "<TEAMID>.com.frecapg7.olyne",
      "components": [{ "/": "/token/*" }]
    }]
  }
}
```

- `<TEAMID>` : identifiant d'équipe Apple Developer (celui de Sentry/certificats).
- iOS ne télécharge l'AASA qu'à l'install/update de l'app : après chaque modif du
  fichier, re-tester sur un vrai device (relink suffit parfois, pas toujours).

---

## 2. Front — config Expo

- `app.config.js` : `ios.associatedDomains: ["applinks:<domaine>"]`
  (entitlement natif → **rebuild du dev client obligatoire**).
- Android : rien à déclarer côté app ; c'est l'assetlinks.json qui fait le lien
  package + empreinte.
- Récupérer l'empreinte du keystore : `eas credentials` (si keystore EAS)
  ou `keytool -list -v -keystore <keystore>` en local.

## 3. Front — share page (`app/[id]/share.tsx`)

- Construire et distribuer le lien https : `https://<domaine>/token/<jwt>`
  (QR, bouton copier, WhatsApp `wa.me/?text=<lien>` — enfin cliquable).
- Le bouton Messenger actuel (`m.me/?link=…`) ne partage rien (param ignoré) :
  à remplacer par le share sheet natif (`Share.share`) ou un simple copier.
- Au passage, finir de remplacer le scheme en dur : `vakeoexpo://` est codé en
  littéral alors que le scheme prod est `olyne://` — le QR/copié actuel est mort
  en prod. Construire le scheme depuis la config (`expo-linking`), pas un
  littéral.

## 4. Front — réception

- Expo-router matche `https://<domaine>/token/x` sur `/token/[token]`
  automatiquement (matching sur le pathname, le host est ignoré) — la page token
  n'a rien à changer.
- Le pattern du champ join (`app/join.tsx`) accepte déjà les liens https
  (`https?://[^/\s]+/token/…`) : le coller-coller d'un lien https fonctionne.
- Vérifier le cold start : lien tapé app fermée → resolve → seat picker, sans
  passage par la home.

## 5. Validation device

- Android : `adb shell am start -a android.intent.action.VIEW -d "https://<domaine>/token/<jwt>"`
  → ouvre l'app ; app désinstallée → page fallback → Play Store.
- iOS : taper le lien dans Notes/Mail → ouvre l'app ; long-press → « Ouvrir dans
  <app> » ; Safari : coller dans la barre d'adresse n'ouvre pas l'app (comportement
  Apple attendu), c'est le bouton fallback qui prend le relais.
- QR : scanner avec l'appareil photo → lien https → app ou fallback.
- Valider l'AASA : https://branch.io/resources/aasa-validator/ ou équivalent.

---

## Répartition

| Acteur | Charge | Étape |
|---|---|---|
| Back/infra | le gros | domaine, page fallback, 2 fichiers well-known |
| Front | ~½ journée | associatedDomains + rebuild, share page sur lien https, fin du scheme en dur |
| Test | ½ journée | 2 plateformes x (installé / non installé / QR / cold start) |

## Pièges connus

- Redirect 301 sur un well-known = vérification silencieusement en échec.
- Play App Signing : mauvaise empreinte = App Link jamais vérifié (le lien
  s'ouvre dans le navigateur à chaque fois).
- iOS met l'AASA en cache longtemps : tester sur device, pas seulement en simulateur.
- Le lien https vit plus longtemps que le JWT (`exp`) : la page fallback doit
  gérer le token expiré (l'app affiche déjà son état « lien invalide ou expiré »
  via le 404 du resolve).
