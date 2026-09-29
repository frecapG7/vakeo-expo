# Notes agent — vakeo-expo

Point d'entrée pour reprendre le contexte du projet d'une session à l'autre.
Détails : voir `docs/architecture-agent.md` (architecture) et `docs/plan-migration-v3.md` (chantier en cours).

## Contexte projet

- App mobile **Expo ~57** (SDK 57, upgrade 55→56→57 fait le 2026-09-27) + expo-router 57 (structure `app/`), **React Native 0.86.3**, React 19.2.3, TypeScript 6.0.3, Sentry, `@gorhom/bottom-sheet`, expo-image, react-hook-form, dayjs, jest-expo 57.
- **expo-router 57 n'embarque plus react-navigation** (passé sur `standard-navigation`, vendored) : `ThemeProvider`/`DefaultTheme`/`useNavigation` s'importent depuis `expo-router`. Les packages `@react-navigation/*` ne doivent plus être installés.
- Styles : **NativeWind 5.0.0-rc.0** (pin exact, prerelease — pas de `^`) + **react-native-css 3.1.0-rc.0** (pin exact, peer obligatoire de nativewind rc). Tailwind v4 via `@tailwindcss/postcss`.
- **Liquid Glass** : `expo-glass-effect` (~57) — iOS 26+ seulement. Voir `GlassSurface` ci-dessous.
- React Query v5, MMKV (`storage/`), `react-native-keyboard-controller` (peer requis par gifted-chat, installé en 57).
- i18n maison : `hooks/i18n/useI18nTime`, `useI18nNumbers`. Textes UI majoritairement en dur en français.
- Pas de AGENTS.md à la racine. Fichiers agent : `NOTES-agent.md`, `docs/architecture-agent.md`, `docs/plan-migration-v3.md`.

## Commandes

- `npm start` / `npm run android` / `npm run ios` — expo (APP_ENVIRONMENT=development). Rebuild du dev client obligatoire après chaque upgrade SDK (nouveaux modules natifs en 57 : keyboard-controller, glass-effect).
- `npm run lint` — expo lint (eslint-config-expo 57 : 27 erreurs préexistantes, voir Dette)
- `npm test` — jest (preset jest-expo 57, mode watch ; CI : `npx jest --ci`)
- `npx expo-doctor` — 16/21 (les échecs restants sont connus/acceptés, voir architecture doc)
- `npm run brand:assets` — régénère icon/splash depuis la charte (`scripts/generate-brand-assets.mjs`)

## Palette « All In » (validée, en place)

- Couleurs : ambre `#F7B74A`, ambre orangé `#EE8B33`, bleu nuit `#16265C`, encre nuit `#101736`, brume `#F6F8FD`. Plus aucun vert ni corail.
- **Déclarées dans `global.css` en tokens `@theme`** → classes `bg-amber`, `bg-amber-deep`, `bg-night`, `bg-ink`, `bg-mist` (+ variantes `dark:`, opacité `/70`).
- Les hex bruts restent utilisés dans les props `color` d'`IconSymbol` (qui prend une vraie couleur RN, pas une classe) et les couleurs de `LinearGradient`.
- `constants/Colors.ts` (themes vars) et `hooks/styles/useColors.js` contiennent encore l'ancienne palette — à migrer opportunistement sur les écrans touchés. NB : useColors a des valeurs cassées (`"#rgb(...)"`).
- Logo : wordmark « all in » seul, icône v5b, splash sans tagline. Assets dans `assets/images/` (générés `npm run brand:assets`), proposals dans `assets/brand/proposals/`.
- Renommage technique (name, scheme, bundle id) = décision à part (le scheme casse les liens de partage existants). **Outfit : `Outfit-ExtraBold` chargé via `useFonts` dans `app/_layout.tsx`** (première police de l'app) ; les autres graisses dans `assets/fonts/` au besoin. SpaceMono toujours présent dans `assets/fonts/` mais plus chargé nulle part. **Wordmark** : composant `components/brand/Wordmark.tsx` (« all » bleu nuit/blanc dark, « in » `amber-deep` en clair / `amber` en dark — l'ambre clair est illisible sur fond clair, ~1.8:1). Utilisé en `headerTitle` de la home (pattern marque-sur-l'accueil, les autres écrans gardent leur titre).

## Liquid Glass / GlassSurface (posé le 2026-09-27)

- `components/ui/GlassSurface.tsx` — surface translucide **3-tier** : `GlassView` natif si iOS 26 + `isLiquidGlassAvailable()` → `BlurView` (iOS < 26, Android 12+ via `blurMethod="dimezisBlurViewSdk31Plus"`) → `View` translucide.
- `tintColor` est respecté sur **tous les tiers** (calque semi-transparent 90% dans les fallbacks) — indispensable pour la lisibilité des chips sur Android.
- `GlassSheetBackground` : fond de BottomSheet en verre, `tintColor` **thématique** (brume en clair, encre nuit en sombre via `useColorScheme`), intensité 70 — sans ce calque, le sheet est transparent sur les fallbacks. Retire le `backgroundColor` plein du style par défaut (sinon il masque le verre).
- Règles : **jamais d'opacité < 1 sur un GlassView ou son parent** (le verre ne rend plus) ; animer via `glassEffectStyle` en config `{ style, animate }`. Piège RN : `flexShrink` vaut 0 par défaut — pour contraindre une surface dans une ligne, il faut `alignSelf: "flex-start"` + `maxWidth: "100%"` sur la surface (le `items-start` sur le parent casse la contrainte de largeur).
- Validation device Android : OK (build compile, chip/sheet/fallbacks vérifiés visuellement, 2026-09-27).
- **expo-blur 57 (2026-09-29)** : nouvelle API Android — le blur exige un lurTarget (ref d'un <BlurTargetView> enveloppant le contenu à flouter), sinon fallback `none` + warning. L'ancien blur automatique « de tout ce qu'il y a derrière » n'existe plus. GlassSurface expose donc un prop lurTarget ; sans cible sur Android, pas de blur (overlay translucide). Câblé : chip date (cible = l'image de sa carte, TripCard extrait de pp/index.tsx) et sheet Ajouter de la home (cible = la liste, SheetBackground mémorisé par useCallback). Le vrai Liquid Glass (iOS 26) reste **non validé** — pas de Mac/iOS dispo. Options : iPhone + EAS Build (compte payant) ou cloud Mac.

## Home (`app/index.tsx`) — refaite le 2026-09-27 (état final validé)

- Cartes `h-52` : photo (thèmes illustrés GCS, `components/trips/TripInfoForm.tsx`), **dégradé encre nuit** (`LinearGradient` `#10173600`→`#101736E6`, contenu calé en bas). Bloc bas unique : ligne méta (chip date + pile d'avatars) puis titre — pas de chevron (la carte est le bouton).
- Chip de date : `GlassSurface` clear + tint ambre + icône calendrier 12px, texte `xs` sur **2 lignes max**, contrainte par `flex-1 min-w-0` + `maxWidth 100%` (truncature propre, jamais de chevauchement).
- Avatars : `AvatarsGroup` (`xs`, 24px, `maxLength={3}` + « +N ») — les noms individuels ont été supprimés (bruit). Fallback initiale **à l'échelle de la taille** (`sizeToTextMap` dans `Avatar.tsx`).
- Sheet « Ajouter » : fond `GlassSheetBackground`, bouton Créer plein ambre, Rejoindre outline bleu nuit sur brume.
- Empty state : `components/trips/TripsEmptyState.tsx` — 3 branches (skeletons / erreur + Réessayer / carte de verre avec CTA Créer+Rejoindre intégrés), fond brume/encre nuit porté par le composant. `contentContainerStyle={{ flexGrow: 1 }}` sur le FlatList pour le plein écran.
- Espacement : `SafeAreaView edges={["left","right","bottom"]}` (le header gère le top), `contentContainerStyle` paddingHorizontal 12 / paddingTop 12 / paddingBottom 24, séparateur `h-4` (les marges ne fusionnent pas en RN — `my-N` sur un séparateur double l'espacement).
- **Pattern à propager** : les autres écrans ont probablement le même double-espacement (SafeAreaView edges par défaut sous header natif) — corriger opportunistement.

## Sujets en cours

1. **Migration API v1 → v3** (chantier principal, aucun code fait, plan détaillé dans `docs/plan-migration-v3.md`) :
   - `x-user-id` → `x-user-token`, trip IDs encodés en URL, base URL `/api/v3/`.
   - Phase 0 close ; premier jalon = clarification Q5 côté backend (façon de récupérer le contenu d'un trip).
   - Flow join repensé (resolve token → seat picker → join), leave/rotate-token à créer.
2. **Améliorations visuelles opportunistes** (post-home) : avatars des cartes (overlay compact en bas de carte ?), autres sheets en verre, propagation palette/useColors, SafeAreaView edges sur les autres écrans.

## Dette connue

- **TS : 117 erreurs préexistantes** (`npx tsc --noEmit`) — aucune dans les fichiers des sessions récentes. Baseline à ne pas dégrader.
- **Lint : 27 erreurs** apparues avec eslint-config-expo 56/57 (règles React Compiler « This value cannot be modified », `no-unescaped-entities` sur les apostrophes françaises, setState-in-effect). À nettoyer par fichier touché.
- **`text-md` : 15 occurrences** (classe fantôme Tailwind v4) dans 15 fichiers — migration `text-base` au fil de l'eau. `Button.tsx` déjà corrigé.
- **`Skeleton` cassé** : classes construites dynamiquement (`h-${height}`) que NativeWind ne compile pas — remplacé par des blocs statiques sur la home ; le composant reste à corriger/remplacer ailleurs.
- `app/_layout.tsx` : splash masqué dès que les polices sont chargées (l'ancien `setTimeout(3000)` + TODO est réglé) ; `useShareTrip` en `useQuery` (deviendra POST en v3) ; `useVerifyToken` réponse non consommée ; `storage/index.tsx` `encryptionKey` en dur.
- Doctor : échecs restants connus — 2 faux positifs git (pas de git fiable dans l'env), `@expo/config-plugins` direct (voulu pour le plugin Sentry), conflit icônes (`toastify-react-native` tire l'ancien `react-native-vector-icons`), non-CNG (informatif, workflow prebuild).

## Conventions à respecter

- Le projet est écrit à la main par l'utilisateur, avec des zones de qualité inégale assumées. Amélioration **opportuniste** : on nettoie ce qu'on touche de toute façon, pas de grand refacto à part. Signaler le douteux, corriger dans le périmètre de la tâche.
- **Styles** : motif composant → variante de composant (pattern `Button.tsx`) ; chaîne réutilisable → `@utility` + `@apply` dans `global.css` ; nouvelles couleurs → tokens `@theme` dans `global.css` ; surfaces translucides → `GlassSurface`. `text-md` interdit.
- Les fichiers agent (`NOTES-agent.md`, `docs/*-agent.md`, `docs/plan-migration-v3.md`) sont en français.
- Couche API : hooks React Query dans `hooks/api/`, client axios dans `lib/axios.js` (chemins relatifs, headers `x-api-key` + `x-user-id`).
- Stockage : MMKV, clés `trips.<id>`, shape `StorageTrip` dans `hooks/storage/useStorageTrips.ts`.
- Ne jamais éditer un fichier sans l'avoir lu au préalable dans la session.
- Outil : le repo est en **CRLF** — l'outil `edit` échoue sur les fichiers non réécrits ce session ; préférer `write_file` complet ou PowerShell `[System.IO.File]::ReadAllText/WriteAllText`.
