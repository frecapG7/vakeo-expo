# Architecture front — vakeo-expo

Référentiel d'architecture établi depuis la lecture du code (session 2026-09-26), mis à jour le 2026-10-06 (polls/stops v3 + charte All In, timeline étapes, gamification en cours).
États « avant migration v3 » — les écarts v3 restants sont notés `⚠ v3` et détaillés dans `plan-migration-v3.md`.

## Stack

| Domaine | Choix |
|---|---|
| Runtime | Expo SDK 57, React Native 0.86.3, React 19.2.3, TypeScript 6.0.3, expo-router (`app/`) |
| Navigation | expo-router 57 — **sans react-navigation** (`standard-navigation` vendored) ; `ThemeProvider`, `DefaultTheme`, `useNavigation` importés depuis `expo-router` |
| Styles | NativeWind 5.0.0-rc.0 + react-native-css 3.1.0-rc.0 (pins exacts) + tokens `@theme` dans `global.css` |
| Verre | `expo-glass-effect` (iOS 26) via `components/ui/GlassSurface.tsx` (3-tier) |
| Données | TanStack React Query v5, axios (`lib/axios.js`) |
| Stockage local | MMKV (`storage/index.tsx`, id `vakeo-storage`) |
| Forms | react-hook-form |
| Dates | dayjs (`lib/dayjs-config.js`), calendriers `react-native-calendars` 1.1314.0 |
| Tests | jest + jest-expo 57 |
| Autres | Sentry (hors `__DEV__`), `@gorhom/bottom-sheet`, `@kesha-antonov/react-native-chat` 5.0.1 (remplace gifted-chat, crash Reanimated v4), expo-image, QRCode SVG |

## Styles (NativeWind 5 / Tailwind v4)

Pipeline : `global.css` (imports Tailwind v4 + `nativewind/theme`) → `withNativewind` (metro) ; `postcss.config.mjs` utilise `@tailwindcss/postcss`. Sans directive `@config` dans `global.css`, le `tailwind.config.js` (v3) **n'est pas chargé**.

Structure de `global.css` :
- `@theme` : **palette All In** — `--color-amber` `#F7B74A`, `--color-amber-deep` `#EE8B33`, `--color-night` `#16265C`, `--color-ink` `#101736`, `--color-mist` `#F6F8FD`, `--color-danger` `#E5484D` → classes `bg-amber`, `text-night`, variantes `dark:`, modificateurs d'opacité.
- `@utility` : utilities sémantiques (`text-h1`, `text-label`).

Trois mécanismes de factorisation :
1. **Variantes de composants** (motif composant : boutons, écrans, titres) — pattern `components/ui/Button.tsx` (`variantToClassMap`).
2. **Custom utilities sémantiques** (chaînes réutilisables) — `@utility` + `@apply` dans `global.css`. La variante `dark:` à l'intérieur de `@apply` expande en `@media (prefers-color-scheme: dark)`, mappé sur le colorScheme RN.
3. **Tokens `@theme`** pour toute nouvelle couleur — jamais de couleur arbitraire (`bg-[#…]`, `orange-*`, `blue-*`) dans un écran touché.

Recettes validées (refontes goods/events/polls/stops) :
- Carte : `bg-white dark:bg-night border border-mist dark:border-white/10 rounded-2xl shadow-sm`.
- Fond d'écran : `bg-mist dark:bg-ink` sur le conteneur racine.
- Textes muets : `text-night/50-70 dark:text-white/50-70` ; icônes muettes : hex dérivé du scheme (`isDark ? "#F6F8FD" : "#16265C"` via `useColorScheme`).
- Input carte (pattern `FormText`) : `bg-white dark:bg-night border border-mist dark:border-white/10 focus:border-amber-deep rounded-2xl h-12` + `text-night dark:text-white` (typo `text-dark` cassée interdite).
- Corbeille/danger : `#E5484D` ou `bg-danger/10 dark:bg-danger/20` ; CTA ambre : `bg-amber` plein + texte night, ou `bg-amber/15` + texte ambre-deep.
- Thème react-native-calendars : `useColorScheme` + hex des tokens (recette du calendrier planning, cf. `DateRangeCalendar.tsx`).

Limites connues :
- `@apply` ne résout que les utilities Tailwind v4 core ou définies via `@theme`/`@utility` — pas les extensions NativeWind.
- `text-md` n'existe pas (classe fantôme) — migration au fil de l'eau.
- Les classes construites dynamiquement (`h-${height}`) ne sont pas compilées par NativeWind — tailles en `style` numérique (cas `Skeleton`).

## GlassSurface (`components/ui/GlassSurface.tsx`)

Surface translucide 3-tier : `GlassView` natif si iOS 26 + `isLiquidGlassAvailable()` → `BlurView` (iOS < 26, Android 12+ `dimezisBlurViewSdk31Plus`) → `View` translucide. `tintColor` appliqué sur tous les tiers (calque 90% dans les fallbacks). Exporte aussi `GlassSheetBackground` (fond de BottomSheet en verre).

Depuis expo-blur 57 (2026-09-29) : le blur Android exige un `blurTarget` explicite (ref d'un `<BlurTargetView>` englobant le contenu à flouter) — l'ancien blur automatique a disparu. `GlassSurface` expose `blurTarget` ; sans cible sur Android, pas de blur (overlay translucide). **Usages câblés (3)** : chip date de la home, sheet « Ajouter » de la home, **sheet éditeur d'étapes (`TripStopDetailsEditor`, 2026-10-06 — cible = la liste des étapes)**. Patron : `BlurTargetView` autour du contenu + `SheetBackground` mémorisé par `useCallback`. **Jamais d'opacité < 1 sur le verre ou son parent.**

## Écrans (`app/`)

| Route | Rôle |
|---|---|
| `index.tsx` | Accueil : header au wordmark (`Wordmark`), cartes photo (dégradé encre nuit, chip date ambre en verre), sheet « Ajouter » en verre, `TripsEmptyState` |
| `new/*` | Création : setup-general (infos, thèmes illustrés GCS dans `components/trips/TripInfoForm.tsx`) → setup-users (seats) → POST /trips |
| `join.tsx` | Saisie manuelle d'un lien d'invitation → pousse `/token/[token]` |
| `token/[token].tsx` | Deep link d'invitation : GET /token/v2/:token → stocke le trip → `/[id]` ⚠ v3 : resolve → seat picker → join |
| `[id]/(tabs)/*` | Cœur du voyage : dashboard (GlassHeaderBar flottant), planning (calendar/day), conversations |
| `[id]/location.tsx` | **Étapes (refonte 2026-10-06)** : timeline gamifiée — nœuds 3 états (creux+numéro / plein+coche / drapeau final), segments pointillés qui se pavent, barre « Préparation du trajet X/Y complètes », chip « Étape complète », badge sondages actionnable (danger, tap → poll ou sheet) ; **éditeur unique** `TripStopDetailsEditor` (sheet verre, création+édition, nom + onglets Adresse/Hébergement, champs optionnels) ; `Screen edges={[]}` + FAB relevé `insets.bottom + 40` ; header natif large title (pas de titre en liste) |
| `[id]/dates.tsx` | Dates du trip + pouce DatesPoll : cartes charte, thème calendrier sur tokens, `useTrip()` (fin du double fetch), chips `PollStatus` |
| `[id]/polls/*` | Sondages (v3 + charte 2026-10-06) : liste cartes All In, `PollStatus` chips ambre, `PollOption` dégradé ambre, flow new/option, `ViewToggle` via `ToggleButton` |
| `[id]/events/*` | Événements (liste infinie, création, édition, suppression) |
| `[id]/goods/*`, `links/*` | Sub-resources (liste/CRUD) — goods refait (05/10), links encore v1/v2 |
| `[id]/attendees/*`, `pick-user.tsx` | Gestion des seats |
| `[id]/settings/*` | Profil du seat, share, edit-general, restrictions |
| `[id]/chat.tsx` | Chat général (`@kesha-antonov/react-native-chat`) |

`TripContext` (`context/`) expose `trip` et `me` (le seat de l'utilisateur local) aux écrans `[id]/*` — via le hook dédié `useTrip()` (plus de `useContext` direct, plus de `useGetTrip` parallèle dans les écrans touchés).

Layout / safe area : `GestureHandlerRootView` monté **une fois** dans `app/_layout.tsx`. Conteneur standard : composant **`Screen`** — SafeAreaView aux edges gauche/droite/bas sous header natif, cas particuliers via `edges` (plein cadre : `edges={[]}`, pattern goods/location pour les listes scrollables + FAB). Le FAB (`FloatingAddButton`) accepte un `style` passthrough : les écrans full-bleed passent `bottom: insets.bottom + 40` (barre de navigation Android).

## Couche réseau

### Client (`lib/axios.js`)

- `baseURL` = `EXPO_PUBLIC_API_URL`, header `x-api-key` = `EXPO_PUBLIC_API_KEY`, timeout 10 s.
- **Interceptor de requête (auth v3)** : déduit l'encodedId du trip de l'URL (`/trips/<id>/…`, toutes versions) et lit `trips.<id>.token` dans MMKV de façon synchrone au moment de la requête → header `x-user-token`. Pas d'état global, pas de course au montage. Requêtes non trip-scopées : pas de header.
- Interceptor de réponse : toasts génériques par statut (401/403/404/500), `console.error`, rethrow ; `skipToastStatuses` par requête pour les statuts attendus.
- **Pas de gestion différenciée 401-token-expiré** — les toasts sont en français en dur.

### Conventions d'URL (⚠ v3 : tout passe sous `/api/v3/`)

| Préfixe | Utilisé par |
|---|---|
| `/v3/...` via `v3Path` (2026-10-06) | useTrips (getTrip/updateTrip/getTripUser/updateTripUser/getDashboard/batch), useEvents (tout), useMessages (tout), useGoods (tout), **usePolls (tout)**, **useTripStop (tout)**, useMigrate |
| `/token/...` (v1) | useTokens (token/v2) + useVerifyToken — Phase 5 (par design, derniers restants) |

⚠ v3 restant : préfixe posé **par appel** (décision Q1, baseURL inchangée pendant la migration) ; URL **et** header migrent ensemble endpoint par endpoint. Switch de baseURL en Phase 7 seulement.

### Auth (⚠ v3 : `x-user-id` → `x-user-token`)

- Identification v3 par **token de seat** (`x-user-token`, par trip+user), injecté par l'interceptor — plus aucun header posé à la main dans les hooks migrés.
- Restes d'`x-user-id` : `useLinks.ts` (à migrer), `useMigrate.ts` (voulu — le migrate envoie l'ancien credential pour convertir).
- Lectures publiques : token optionnel ; mutations : obligatoire (401 sinon) ; lectures privées → 403 sans token (anonymat explicite, écrans d'état à faire).

### Endpoints par hook (état 2026-10-06)

- `useTrips.ts` : POST /v3/trips ; POST /v3/trips/batch (pavage 30) ; GET/PUT /v3/trips/:id ; GET/PUT /v3/trips/:id/users/:userId ; GET /v3/trips/:id/dashboard ; POST /v3/trips/:id/share
- `useEvents.ts` : GET/POST/GET/PUT /v3/trips/:id/events(…) ; DELETE /v3/trips/:id/events/:eventId
- `useMessages.ts` : GET /v3/.../messages/general|events/:id/messages (infinite) ; POST /v3/.../messages ; GET /v3/.../conversations(/unread/count) ; POST /v3/.../markAllAsRead
- `useGoods.ts` : GET /v3/.../goods (infinite) ; GET/POST/PUT/DELETE + PUT /checked, PUT /checked (all) — tout /v3
- `usePolls.ts` : GET/POST /v3/trips/:id/polls ; GET/PUT /v3/trips/:id/polls/:id ; PATCH /vote ; DELETE /vote/:optionId — tout /v3, invalidation `["trips", id, "polls"]`
- `useTripStop.ts` : GET/POST /v3/trips/:id/stops ; PUT/DELETE /v3/trips/:id/stops/:id — tout /v3, cache direct `["trips", id, "stops"]`
- `useTripStop` consommateurs : `location.tsx` seul (timeline + éditeur unique)
- `useMigrate.ts` : POST /v3/migrate (x-user-id, conversion)
- `useTokens.js` : POST /token/verify ; GET /token/v2/:token — **Phase 5**
- `useLinks.ts` : GET/POST/DELETE /v3/trips/:id/links — tout /v3 (2026-10-06, Phase 3 close)

## Stockage local (MMKV)

- Clés `trips.<encodedId>`, valeur JSON. **Stockage lean** : `{ _id, user?, token? }` — l'affichage vit sur l'hydrate batch (`POST /v3/trips/batch`).
- Hooks storage React Query : `useGetStorageTrips` (queryKey `["storage","trips"]`), `useGetStorageTrip`, `useAddStorageTrip`, `useUpdateStorageTrip`, `useDeleteStorageTrip` (invalident tout le cache à chaque succès).
- `getStorageTrips` filtre les enregistrements sémantiquement invalides (prédicat `isStorageTrip`) — ne jamais crasher la gate de migration.

## Conventions React Query

- QueryKeys racine `[“trips”, tripId, <resource>, ...]` — changement d'ID ⇒ invalidation implicite.
- Listes paginées : `useInfiniteQuery` avec `cursor` / `nextCursor` (events, goods, links, messages).
- Mutations : invalidations ciblées dans `onSuccess`, parfois `setQueryData` pour éviter le flicker (polls, stops).

## Flux clés

- **Accueil** : ids locaux (MMKV) → `useBatchTrips` (POST /v3/trips/batch, pavage 30, credentials par item) → cartes. Trips invisibles = absents de la liste (stale local non droppé automatiquement).
- **Création** : form multi-étapes → POST /v3/trips (`PostTripResponse` : encodedId, seats, credentials) → stockage `{ _id, user, token }` → `/[id]/(tabs)`.
- **Invitation (deep link)** : `vakeoexpo://token/<value>` → GET /token/v2/:token → `addStorageTrip` direct. ⚠ v3 : resolve → seat picker → POST /join → stocker token.
- **Share (v3 depuis le 06/10)** : POST /v3/trips/:id/share au mount de l'écran (`ShareTripResponse { value, type: "joinToken" }`) ; idempotence backend (Q4) à confirmer. Écran : QR sur carte, 3 boutons de partage en cartes All In (couleur de marque sur l'icône uniquement).
- **Étapes (refondu 2026-10-06)** : timeline (GET /v3/stops) → éditeur unique en sheet (création = POST avec brouillon possible, édition = PUT) ; complétion d'étape = `location && accommodation` (front), socle de la gamification (barre étapes, à partager avec le ring dashboard).

## Gamification (proposé 2026-10-06 — en cours de validation)

- Maquette : `docs/maquette-gamification.html`. Implémenté : **page étapes** (barre de progression, nœuds 3 états, segments pavés, chip complète, bannière finale) — calcul front `complètes/total`.
- En attente de validation : **dashboard** — ring « Préparation du voyage » (dates/étapes/sondages/liste, pondérations à trancher), J-x sur le héro, badges, carte « Prochaine action ». Tout calculable avec les données existantes (`pendingPollsCount`, `goods.total/missing`, `stops[].location/accommodation`, `startDate`) — zéro backend.
- Garde-fous : pas de streak, pas de notification, chaque barre mène à l'écran réel.

## Points de vigilance

- `useShareTrip` est un `useQuery` qui deviendra un POST en v3 — smell à retravailler.
- `useVerifyToken` (join.tsx) : réponse non consommée, seul `isPending` est utilisé.
- Anonymat implicite : l'app suppose un seat existant ; v3 rend l'anonymat un état explicite (403).
- `storage/index.tsx` : `encryptionKey: "demo-setup"` en dur.
- `hooks/styles/useColors.js` : palette historique avec valeurs cassées (`"#rgb(...)"`) — restent `inputPlaceHolder` (formulaires) et les écrans non touchés ; à faire mourir au fil des refontes.
- 2 setState-in-effect assumés (lint baseline) : `setEnableQuery` (`BottomLocationForm`), `editMode` (`BottomAccommodationForm`) — refonte UX risquée, à traiter séparément.
- Thème des trips : images illustrées distantes (GCS `vakeo_dev/theme/*.png`) — dépendance réseau pour les cartes de la home (blurhash de secours via Avatar seulement).
- `Animated.SectionList` n'existe pas dans reanimated — crash si utilisé.
