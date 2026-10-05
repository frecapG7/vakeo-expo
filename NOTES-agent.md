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
- `npm run lint` — expo lint (eslint-config-expo 57 : 14 erreurs préexistantes au 2026-10-05, voir Dette)
- `npm test` — jest (preset jest-expo 57, mode watch ; CI : `npx jest --ci`)
- `npx expo-doctor` — 16/21 (les échecs restants sont connus/acceptés, voir architecture doc)
- `npm run brand:assets` — régénère icon/splash depuis la charte (`scripts/generate-brand-assets.mjs`) ; `npm run brand:icons` — réduit les PNG d'icônes d'events (`scripts/optimize-event-icons.mjs`, resize 512px + palette, sharp en devDependency)

## Palette « All In » (validée, en place)

- Couleurs : ambre `#F7B74A`, ambre orangé `#EE8B33`, bleu nuit `#16265C`, encre nuit `#101736`, brume `#F6F8FD`. Plus aucun vert ni corail. **Ajout 2026-10-02 : `--color-danger` `#E5484D`** (token `@theme`, ton d'alerte — StatCard Restrictions, à valider visuellement sur device).
- **Déclarées dans `global.css` en tokens `@theme`** → classes `bg-amber`, `bg-amber-deep`, `bg-night`, `bg-ink`, `bg-mist` (+ variantes `dark:`, opacité `/70`).
- Les hex bruts restent utilisés dans les props `color` d'`IconSymbol` (qui prend une vraie couleur RN, pas une classe) et les couleurs de `LinearGradient`. Gris neutre UI : `#9AA3B8` (icônes/chevrons secondaires, pattern maquettes).
- `constants/Colors.ts` (themes vars) et `hooks/styles/useColors.js` contiennent encore l'ancienne palette — à migrer opportunistement sur les écrans touchés. NB : useColors a des valeurs cassées (`"#rgb(...)"`).
- Logo : wordmark « all in » seul, icône v5b, splash sans tagline. Assets dans `assets/images/` (générés `npm run brand:assets`), proposals dans `assets/brand/proposals/`.
- Renommage technique (name, scheme, bundle id) = décision à part (le scheme casse les liens de partage existants). **Outfit : `Outfit-ExtraBold` chargé via `useFonts` dans `app/_layout.tsx`** (première police de l'app) ; les autres graisses dans `assets/fonts/` au besoin. SpaceMono toujours présent dans `assets/fonts/` mais plus chargé nulle part. **Wordmark** : composant `components/brand/Wordmark.tsx` (« all » bleu nuit/blanc dark, « in » `amber-deep` en clair / `amber` en dark — l'ambre clair est illisible sur fond clair, ~1.8:1). Utilisé en `headerTitle` de la home (pattern marque-sur-l'accueil, les autres écrans gardent leur titre).

## Liquid Glass / GlassSurface (posé le 2026-09-27)

- `components/ui/GlassSurface.tsx` — surface translucide **3-tier** : `GlassView` natif si iOS 26 + `isLiquidGlassAvailable()` → `BlurView` (iOS < 26, Android 12+ via `blurMethod="dimezisBlurViewSdk31Plus"`) → `View` translucide.
- `tintColor` est respecté sur **tous les tiers** (calque semi-transparent 90% dans les fallbacks) — indispensable pour la lisibilité des chips sur Android.
- `GlassSheetBackground` : fond de BottomSheet en verre, `tintColor` **thématique** (brume en clair, encre nuit en sombre via `useColorScheme`), intensité 70 — sans ce calque, le sheet est transparent sur les fallbacks. Retire le `backgroundColor` plein du style par défaut (sinon il masque le verre).
- Règles : **jamais d'opacité < 1 sur un GlassView ou son parent** (le verre ne rend plus) ; animer via `glassEffectStyle` en config `{ style, animate }`. Piège RN : `flexShrink` vaut 0 par défaut — pour contraindre une surface dans une ligne, il faut `alignSelf: "flex-start"` + `maxWidth: "100%"` sur la surface (le `items-start` sur le parent casse la contrainte de largeur).
- Validation device Android : OK (build compile, chip/sheet/fallbacks vérifiés visuellement, 2026-09-27).
- **expo-blur 57 (2026-09-29)** : nouvelle API Android — le blur exige un blurTarget (ref d'un `<BlurTargetView>` enveloppant le contenu à flouter), sinon fallback `none` + warning. L'ancien blur automatique « de tout ce qu'il y a derrière » n'existe plus. GlassSurface expose donc un prop blurTarget ; sans cible sur Android, pas de blur (overlay translucide). Câblé : chip date (cible = l'image de sa carte, TripCard extrait de app/index.tsx) et sheet Ajouter de la home (cible = la liste, SheetBackground mémorisé par useCallback). Le vrai Liquid Glass (iOS 26) reste **non validé** — pas de Mac/iOS dispo. Options : iPhone + EAS Build (compte payant) ou cloud Mac.

## Home (`app/index.tsx`) — refaite le 2026-09-27 (état final validé)

- Cartes `h-52` : photo (thèmes illustrés GCS, `components/trips/TripInfoForm.tsx`), **dégradé encre nuit** (`LinearGradient` `#10173600`→`#101736E6`, contenu calé en bas). Bloc bas unique : ligne méta (chip date + pile d'avatars) puis titre — pas de chevron (la carte est le bouton).
- Chip de date : `GlassSurface` clear + tint ambre + icône calendrier 12px, texte `xs` sur **2 lignes max**, contrainte par `flex-1 min-w-0` + `maxWidth 100%` (truncation propre, jamais de chevauchement).
- Avatars : `AvatarsGroup` (`xs`, 24px, `maxLength={3}` + « +N ») — les noms individuels ont été supprimés (bruit). Fallback initiale **à l'échelle de la taille** (`sizeToTextMap` dans `Avatar.tsx`).
- Sheet « Ajouter » : fond `GlassSheetBackground`, bouton Créer plein ambre, Rejoindre outline bleu nuit sur brume.
- Empty state : `components/trips/TripsEmptyState.tsx` — 3 branches (skeletons / erreur + Réessayer / carte de verre avec CTA Créer+Rejoindre intégrés), fond brume/encre nuit porté par le composant. `contentContainerStyle={{ flexGrow: 1 }}` sur le FlatList pour le plein écran.
- Espacement : `SafeAreaView edges={["left","right","bottom"]}` (le header gère le top), `contentContainerStyle` paddingHorizontal 12 / paddingTop 12 / paddingBottom 24, séparateur `h-4` (les marges ne fusionnent pas en RN — `my-N` sur un séparateur double l'espacement).
- **Pattern à propager** : les autres écrans ont probablement le même double-espacement (SafeAreaView edges par défaut sous header natif) — corriger opportunistement.

## Tabs `[id]/(tabs)` — chrome verre (2026-09-30)

- `BackgroundHeader` (photo + scrim noir dans le header natif) **supprimé** — ancienne mécanique, incompatible verre.
- Planning + conversations : stacks avec `useGlassHeaderOptions` (iOS 26 = Liquid Glass natif, iOS < 26 = blur `regular`, Android = tint plat brume/encre nuit via `headerStyle`). Wordmark en `headerLeft` de l'onglet **racine** uniquement (`WordmarkHomeButton`, tap → `router.dismissAll()` → home) — les écrans poussés (calendar, day) gardent le back natif.
- Dashboard : header flottant `GlassHeaderBar` (composant, pas de Stack dédié) — photo héro pleine au repos, surface `GlassSurface` qui **glisse en translation** au scroll (jamais d'opacité < 1 sur le verre), crossfade du wordmark (variante `onMedia` blanc/ambre sur photo → variante scheme sur verre), nom du trip en fade-in. Avatar + dropdown migrent dans le header, plus de back flottant.
- `Wordmark` : prop `onMedia` (variante claire + ombre portée, pour rendu sur photo).
- Dashboard (2026-10-02) : héro `h-64` avec **fallback `LinearGradient` nuit→encre quand `image` est null** (spec batch : image peut être absente) ; rayons `rounded-2xl` + border `mist`/`white/10` + marges `mx-4` unifiés sur toutes les cartes ; StatCard Restrictions en `danger` ; « Prochain événement » remonté au-dessus des stats ; `GlassHeaderBar` : les contrôles vivent sous la barre de statut (`paddingTop: insets.top` sur la rangée — le verre couvre toujours insets.top+44), fix du chevauchement avec l'heure/batterie.
- Planning (2026-10-02) : `ViewToggle` (`components/ui/ViewToggle.tsx`) — segmented control liste|calendrier, pouce `amber-deep` en spring (animation dans `useAnimatedStyle` avec deps, pattern Skeleton), posé en `headerTitle` **centré** (`headerTitleAlign: "center"` — centrage Android à valider) ; wordmark en `headerLeft` de l'onglet racine uniquement (un headerLeft commun remplace le back natif des poussés — piège) ; titres « Planning » retirés (redondants avec la tab bar) ; liste des events en **`SectionList`** (groupBy par jour côté front, en-têtes **collants** (`stickySectionHeadersEnabled`, fond `bg-mist` obligatoire pour l'épinglage), events sans date en section sans en-tête, `pb-2` par item en remplacement de l'ItemSeparator). **NB : `Animated.SectionList` n'existe pas dans reanimated** (types ni runtime) — crash si utilisé.
- Planning (2026-10-05) : **filtre « J'organise »** à côté de « Mes participations » — même modèle (param `owner: me._id` côté API comme `attendee`, confirmé backend, les deux filtres se combinent), badge étoile `star.fill` sur pastille `amber-deep` à l'activation (langage orga des avatars/edit-users) ; les deux pills passent en `flex-1` + `gap-3` (le `w-[48%]` débordait à deux) ; bordures inactives `border-mist` (fini `gray-200`) ; classe morte `border-amber` du pill type actif corrigée en `border border-amber-deep` (hauteur stable). Distinction assumée : catégories = plein `amber-deep`, toggles = translucide `amber/40` + badge.
- Dashboard/Planning 2026-10-02 : non validés sur device (voir MR).
- Non validé sur device : le scroll-edge iOS 26 et le comportement du GlassView en translation (validation Android flat faite en priorité).

## Events `app/[id]/events/` — migration + UI (2026-10-02, retouches 2026-10-05)

- **Validation en cours** : après polish du 02/10 (ratio illustration héro 53%, `elevation` explicite partout, `npx expo start -c` obligatoire) le rendu était « bcp mieux ». **Retouches 2026-10-05 sur retours device** : tuiles d'actions aérées (`p-4`, `gap-2.5` parité maquette, titre 12.5px), `EventIcon` du héro `size="lg"` (96px dans le cercle `bg-amber/15` de 120px — `md` laissait l'illustration à moitié vide), header du détail **normalisé** (`headerTitle: trip?.name` en rendu natif, plus de `text-sm italic text-night/60` — le nom du trip seul en gris rendait bizarre). **Maquette de référence validée : `docs/mockups/events-mockup.html`** (écrans A/B héro, D grille, F/G/H états vides, I participation, J owners — C rejeté, E historique icônes). Décision de design : le héro reste nuit→encre **aussi en clair** (l'ambre en fond casserait contraste texte/pill et l'identité de marque — cartes home, fallback dashboard).
- **Migration v3** : `useEvents` était déjà v3 (30/09). `EventType` aligné dans `types/models.ts` (`TRANSPORT`/`EXCURSION` ajoutés, `VISITATION` fantôme retiré) ; fin des doubles fetch `useGetTrip` → `useTrip()` sur `edit`, `edit-users`, `[eventId]/_layout`, `setup-event-users` ; `eventId` reste un raw ObjectId (conforme spec v3).
- **UI palette** : refonte complète du détail selon la maquette validée — **héro** `LinearGradient` nuit→encre `rounded-3xl mx-4` (illustration `EventIcon lg` dans cercle `bg-amber/15`, chip date verre ambre ou chip pointillée « Définir la date » si sans date → tap = Modifier, titre + « Créé par X » = premier owner), **CTA PARTICIPER/PARTICIPANT** en pill chevauchante (`-mt-6`, ambre pleine vs blanche bordée ambre-deep + check), sections épurées (titres uppercase ambre-deep/amber) : description (vide = lien « Ajouter »), participants (pile 3 avatars + « +N », badge étoile ambre-deep sur les owners, chip « Moi », vide = avatar pointillé « + »), tuiles actions (goodsCount affiché). Le fade-in du nom de l'event dans le header au scroll reste un polish non fait.
- **Owners (2026-10-02)** : réintroduits en display-only — « Créé par » (héro), badge étoile (pile), « (orga) » (décompte), chip étoile dans `EventUsersForm`. Règles : étoile visible uniquement sur les participants (owners ⊆ attendees côté front), décocher un owner retire son étoile, dernière étoile non retirable (toast). Créateur auto-owner au POST (`setup-event-users`). Gestion : tout dans edit-users (checkbox = participation, étoile = orga) — pas d'écran dédié.
- Flow `new/*` : **grille 2 colonnes** de cartes illustrées (pattern maquette D) — sélection = bordure ambre + check badge ambre-deep ; stack sous `useGlassHeaderOptions`, `Screen` partout ; `onSubmit`/`postEvent` morts du layout retirés.
- Composants : `EventUsersForm` refait (rows carte, checkbox ambre-deep custom, étoile orga) ; `EventIcon` réparé (API = `name`) ; commentaires scaffolding retirés (2026-10-05). **Composants morts supprimés (2026-10-05, zéro référence vérifiée)** : `EventForm.tsx`, `EventInfo.tsx`, `InfoCard.tsx`, `EventsUsersList.tsx`, `FormDateTimePicker.tsx` (V1).
- `FormDateTimePickerV2` (utilisé uniquement par `EventInfoForm`) : palette complète (calendrier react-native-calendars sur tokens, wheels `#16265C`/brume, chips sélectionnées ambre-deep, erreur en `danger`).

## Goods `app/[id]/goods/` — v3 + refonte (2026-10-05, non validé sur device)

- **v3** : `useGoods` entièrement migré — 7 endpoints sous `v3Path` (fini le mix v1/v2), plus aucun `x-user-id` manuel (interceptor `x-user-token`, toutes les URLs matchent `/trips/<id>/goods`), params `userId` morts retirés des hooks et call sites. Restent en v1/v2 : `useLinks`, `usePolls`, `useTripStop`.
- **UI** : liste sur `Screen` (fin du `GestureHandlerRootView` redondant — la racine en monte déjà un), cartes `bg-white dark:bg-night` + `border-mist`, swipe suppression en `bg-danger`, coche ambre-deep `#EE8B33` (le vert `colors.success` hors charte est parti, non-coché `#9AA3B8`), menu ellipsis désorangé (`bg-amber/20`), état vide cercle `bg-amber/15` + panier ambre-deep ; modals new/[goodId] sur `bg-mist dark:bg-ink`, rows « similaires » en cartes. `popupMenuStyles` (constants/Styles) garde `useColors` — acceptable, à migrer opportunistement.
- **Morts supprimés (2026-10-05, zéro référence vérifiée)** : `GoodBottomSheet.tsx`, `GoodBottomForm.tsx`, `GoodsFlatList.tsx`, export `GoodListItem` (texte blanc sur blanc + bordures bleues — seul `GoodListItemSkeleton` vivait, bordure skeleton passée à `border-mist`).

## Sujets en cours

1. **Migration API v1 → v3** (chantier principal, plan détaillé dans `docs/plan-migration-v3.md`) :
   - `x-user-id` → `x-user-token`, trip IDs encodés en URL, base URL `/api/v3/`.
   - Phase 3 presque close : restent `useLinks`, `usePolls`, `useTripStop` (+ stratégie d'erreur 401/403 dans `lib/axios.js`).
   - Flow join repensé (resolve token → seat picker → join), leave/rotate-token à créer.
2. **Améliorations visuelles opportunistes** (post-home) : avatars des cartes (overlay compact en bas de carte ?), autres sheets en verre, propagation palette/useColors, SafeAreaView edges sur les autres écrans, tokens « soft/line » pour les textes secondaires (`#5B6478`/`#E4E9F4` des maquettes — aujourd'hui gris génériques sur planning/events).

## Dette connue

- **Icônes d'events réduites + fond découpé (2026-10-02)** : les 5 PNG historiques passés à 512px + palette + suppression du fond par flood-fill (blancs intérieurs préservés) — **29,5 Mo → 271 Ko (−99 %)** via `scripts/optimize-event-icons.mjs`. **Rendu à valider visuellement** (seuil blanc 235 : risque de découpe trop agressive, banding → remonter `quality`).
- **TS : 84 erreurs** (`npx tsc --noEmit`, 2026-10-05 — baseline historique 117 ; 2026-10-02 : 104 → 89 ; 2026-10-05 : 86 après suppression des morts, 84 après goods). Baseline à ne pas dégrader.
- **Lint : 14 erreurs** (`npm run lint`, 2026-10-05 — était 27 le 02/10, 16 après events, 14 après suppression des morts + goods ; règles React Compiler « This value cannot be modified », `no-unescaped-entities` sur les apostrophes françaises, setState-in-effect). À nettoyer par fichier touché. NB : `npx eslint .` direct remonte en plus des erreurs `no-undef` sur les fichiers de tests (hors baseline `npm run lint`).
- **`text-md` : 5 occurrences vivantes** (classe fantôme Tailwind v4) — `join.tsx`, `ItemUsersForm.tsx`, `CalendarView.tsx`, `Search.tsx`, `VoteListItem.tsx`. Les porteurs supprimés le 2026-10-05 : `EventForm` (mort), `GoodBottomSheet`, `GoodsFlatList`.
- **`Skeleton` réparé (2026-09-30)** : tailles via `style` numérique, animation de pulsation conservée. Réutilisé sur la home, les (tabs) et goods.
- `app/_layout.tsx` : splash masqué dès que les polices sont chargées ; `useShareTrip` en `useQuery` (deviendra POST en v3) ; `useVerifyToken` réponse non consommée ; `storage/index.tsx` `encryptionKey` en dur.
- Doctor : échecs restants connus — 2 faux positifs git (pas de git fiable dans l'env), `@expo/config-plugins` direct (voulu pour le plugin Sentry), conflit icônes (`toastify-react-native` tire l'ancien `react-native-vector-icons`), non-CNG (informatif, workflow prebuild).

## Conventions à respecter

- Le projet est écrit à la main par l'utilisateur, avec des zones de qualité inégale assumées. Amélioration **opportuniste** : on nettoie ce qu'on touche de toute façon, pas de grand refacto à part. Signaler le douteux, corriger dans le périmètre de la tâche.
- **Styles** : motif composant → variante de composant (pattern `Button.tsx`) ; chaîne réutilisable → `@utility` + `@apply` dans `global.css` ; nouvelles couleurs → tokens `@theme` dans `global.css` ; surfaces translucides → `GlassSurface`. `text-md` interdit.
- **Champs de saisie (2026-10-05)** : pattern carte pour `FormText`/`FormTextArea`/`FormNumberV2`/`FormAutocomplete` — `bg-white dark:bg-night` + `border-mist dark:border-white/10` + `rounded-2xl` + `focus:border-amber-deep` (état disabled `bg-white/60`). Ne pas réintroduire de champs fusionnés au fond.
- Couche API : hooks React Query dans `hooks/api/`, client axios dans `lib/axios.js` (chemins relatifs, header `x-api-key`). **Auth v3 : le header `x-user-token` est injecté par l'interceptor, qui déduit le trip de l'URL (`/trips/<id>/…`, toutes versions) et lit le token dans MMKV au moment de chaque requête** — plus de `setTripToken`/`clearTripToken`, plus d'état global, plus de header posé à la main dans les hooks v3 (les params `userId` morts ont été retirés). leave/rotate-token n'auront qu'à écrire le stockage.
- Stockage : MMKV, clés `trips.<encodedId>`, shape lean `StorageTrip` = `{ _id, user?, token? }` dans `hooks/storage/useStorageTrips.ts`.
- **Écrans : conteneur standard `Screen`** (`components/ui/Screen.tsx`) — SafeAreaView aux edges gauche/droite/bas, le header natif consomme le top ; cas particuliers via la prop `edges` (plein cadre : `edges={[]}`). Adopté sur home, `new/setup-*` (trips + events), `token/[token]`, `pick-user`, tous les écrans events, goods (liste) ; à propager au fil de l'eau sur les autres écrans.
- Ne jamais éditer un fichier sans l'avoir lu au préalable dans la session.
- **Trip actif : `useTrip()`** depuis `@/context/TripContext` — hook dédié, throw si utilisé hors layout `[id]`. `trip._id` = encodedId v3 (opaque, jamais construit côté front) ; `trip` est en pratique undefined pendant le chargement (typage non-optionnel assumé).
- Outil : le repo est en **CRLF** — l'outil `edit` échoue sur les fichiers non réécrits ce session ; préférer `write_file` complet ou PowerShell `[System.IO.File]::ReadAllText/WriteAllText`. NB outillage PS : l'affichage console des accents est brouillé (artefact), mais le canal d'écriture est propre — vérifier le résultat avec `read_file`. Piège : nommer une fonction PS `R` = collision avec l'alias `Invoke-History` ; un tableau à un seul élément passé en paramètre est aplati — les remplacements deviennent caractère par caractère (corruption).
