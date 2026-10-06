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
- `npm run lint` — expo lint (eslint-config-expo 57 : **7 erreurs / 17 warnings**, 2026-10-06 — voir Dette)
- `npm test` — jest (preset jest-expo 57, mode watch ; CI : `npx jest --ci`)
- `npx expo-doctor` — 16/21 (les échecs restants sont connus/acceptés, voir architecture doc)
- `npm run brand:assets` — régénère icon/splash depuis la charte (`scripts/generate-brand-assets.mjs`)

## Palette « All In » (validée, en place)

- Couleurs : ambre `#F7B74A`, ambre orangé `#EE8B33`, bleu nuit `#16265C`, encre nuit `#101736`, brume `#F6F8FD`. Plus aucun vert ni corail. **`--color-danger` `#E5484D`** (token `@theme`, ton d'alerte).
- **Déclarées dans `global.css` en tokens `@theme`** → classes `bg-amber`, `bg-amber-deep`, `bg-night`, `bg-ink`, `bg-mist` (+ variantes `dark:`, opacité `/70`).
- Les hex bruts restent utilisés dans les props `color` d'`IconSymbol` (qui prend une vraie couleur RN, pas une classe) et les couleurs de `LinearGradient`. Icônes muettes : hex dérivé du scheme (`isDark ? "#F6F8FD" : "#16265C"`, pattern `useColorScheme` + hex des tokens).
- `constants/Colors.ts` (themes vars) et `hooks/styles/useColors.js` contiennent encore l'ancienne palette — à migrer opportunistiquement sur les écrans touchés. NB : useColors a des valeurs cassées (`"#rgb(...)"`). **Progression 2026-10-06** : `ToggleButton`, `Switch`, `FormLink`, `DateRangeCalendar`, `dates.tsx`, `location.tsx`, `TripStopDetailsEditor` n'utilisent plus `useColors` — il ne reste que `inputPlaceHolder` dans les formulaires (`FormText`, `FormLink`, bottom forms) et les écrans non touchés.
- Logo : wordmark « all in » seul, icône v5b, splash sans tagline. Assets dans `assets/images/` (générés `npm run brand:assets`), proposals dans `assets/brand/proposals/`.
- Renommage technique (name, scheme, bundle id) = décision à part (le scheme casse les liens de partage existants). **Outfit : `Outfit-ExtraBold` chargé via `useFonts` dans `app/_layout.tsx`** (première police de l'app) ; les autres graisses dans `assets/fonts/` au besoin. SpaceMono toujours présent dans `assets/fonts/` mais plus chargé nulle part. **Wordmark** : composant `components/brand/Wordmark.tsx` (« all » bleu nuit/blanc dark, « in » `amber-deep` en clair / `amber` en dark — l'ambre clair est illisible sur fond clair, ~1.8:1). Utilisé en `headerTitle` de la home (pattern marque-sur-l'accueil, les autres écrans gardent leur titre).

## Liquid Glass / GlassSurface (posé le 2026-09-27)

- `components/ui/GlassSurface.tsx` — surface translucide **3-tier** : `GlassView` natif si iOS 26 + `isLiquidGlassAvailable()` → `BlurView` (iOS < 26, Android 12+ via `blurMethod="dimezisBlurViewSdk31Plus"`) → `View` translucide.
- `tintColor` est respecté sur **tous les tiers** (calque semi-transparent 90% dans les fallbacks) — indispensable pour la lisibilité des chips sur Android.
- `GlassSheetBackground` : fond de BottomSheet en verre, `tintColor` **thématique** (brume en clair, encre nuit en sombre via `useColorScheme`), intensité 70 — sans ce calque, le sheet est transparent sur les fallbacks. Retire le `backgroundColor` plein du style par défaut (sinon il masque le verre).
- Règles : **jamais d'opacité < 1 sur un GlassView ou son parent** (le verre ne rend plus) ; animer via `glassEffectStyle` en config `{ style, animate }`. Piège RN : `flexShrink` vaut 0 par défaut — pour contraindre une surface dans une ligne, il faut `alignSelf: "flex-start"` + `maxWidth: "100%"` sur la surface (le `items-start` sur le parent casse la contrainte de largeur).
- Validation device Android : OK (build compile, chip/sheet/fallbacks vérifiés visuellement, 2026-09-27).
- **expo-blur 57 (2026-09-29)** : nouvelle API Android — le blur exige un `blurTarget` (ref d'un `<BlurTargetView>` enveloppant le contenu à flouter), sinon fallback `none` + warning. GlassSurface expose donc un prop `blurTarget`. **Usages câblés (3)** : chip date de la home (cible = image de sa carte), sheet « Ajouter » de la home (cible = la liste, `SheetBackground` mémorisé par `useCallback`), **sheet éditeur d'étapes (2026-10-06, cible = la liste des étapes)**. Patron : `BlurTargetView ref={...} style={{ flex: 1 }}` autour du contenu, `SheetBackground = useCallback((props) => <GlassSheetBackground {...props} blurTarget={ref} />, [ref])`.
- Le vrai Liquid Glass (iOS 26) reste **non validé** — pas de Mac/iOS dispo. Idem le scroll-edge iOS 26 (large title sur verre). Options : iPhone + EAS Build (compte payant) ou cloud Mac.

## Home (`app/index.tsx`) — refaite le 2026-09-27 (état final validé)

- Cartes `h-52` : photo (thèmes illustrés GCS, `components/trips/TripInfoForm.tsx`), **dégradé encre nuit** (`LinearGradient` `#10173600`→`#101736E6`, contenu calé en bas). Bloc bas unique : ligne méta (chip date + pile d'avatars) puis titre — pas de chevron (la carte est le bouton).
- Chip de date : `GlassSurface` clear + tint ambre + icône calendrier 12px, texte `xs` sur **2 lignes max**, contrainte par `flex-1 min-w-0` + `maxWidth 100%` (truncature propre, jamais de chevauchement).
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
- Dashboard (2026-10-02) : héro `h-64` avec **fallback `LinearGradient` nuit→encre quand `image` est null** (spec batch : image peut être absente) ; rayons `rounded-2xl` + border `mist`/`white/10` + marges `mx-4` unifiés sur toutes les cartes ; StatCard Restrictions en `danger` ; « Prochain événement » remonté au-dessus des stats ; `GlassHeaderBar` : les contrôles vivent sous la barre de statut (`paddingTop: insets.top` sur la rangée), fix du chevauchement avec l'heure/batterie.
- Planning (2026-10-02) : `ViewToggle`, `SectionList` groupBy jour avec en-têtes collants, etc. (inchangé depuis). NB : `Animated.SectionList` n'existe pas dans reanimated.
- **Gamification dashboard (2026-10-06, EN ATTENTE DE VALIDATION)** : maquette `docs/maquette-gamification.html` — ring « Préparation du voyage » (dates/étapes/sondages/liste), J-x sur le héro, badges, carte « Prochaine action ». Tout calculable front avec les données existantes. Seule la partie **étapes** est implémentée (voir ci-dessous).

## Étapes (`app/[id]/location.tsx`) — refonte totale 2026-10-06 (validation device en cours)

- **Timeline** : rail gauche — nœuds 32px (`w-8 h-8`), 3 états : complète (`location && accommodation`) = plein `bg-amber-deep` + coche ; incomplète = creux (bordure 2px ambre-deep) + numéro ; dernière étape = drapeau (`flag.fill`, cercle night / amber-deep dark). Connecteurs **pointillés** `border-dashed border-amber-deep/40` en absolu (`left-[15px] top-9 bottom-0`, la ligne traverse le `mb-5` de la carte → continuité), **qui se pavent** (deviennent pleins `border-amber-deep`) quand les deux étapes reliées sont complètes.
- **Gamification** : barre « Préparation du trajet — X/Y complètes » en tête (masquée si 0 étape, ratio = complètes/total, même formule que le futur ring dashboard). Chip « Étape complète » sur les cartes finies, bannière « Trajet au complet » en footer quand X = Y. Sondages exclus du calcul (jamais obligatoires).
- **Badge sondages** : n'apparaît que si *moi* j'ai des sondages en attente (`pendingPolls` = ouverts non votés par me) — chip `bg-danger/10` + bord `danger/30` + `chart.bar.fill` + compte ; tap → 1 sondage = droit sur le sondage, plusieurs = sheet éditeur. Calme visuel par défaut.
- **Éditeur unique** : `TripStopDetailsEditor` (bottom sheet) = seul point d'entrée, création ET édition. FAB/CTA → création (champ nom `FormText` en tête + onglets Adresse/Hébergement, bouton « Ajouter l'étape ») ; crayon/tap carte → édition (« Modifier »). Fond **verre** (`GlassSheetBackground` + `BlurTargetView` sur la liste, patron home). Champs location/hébergement **optionnels** (création en brouillon possible). Chips `PollStatus` ancrées « Sondage : [état] » (libellé gauche + chip droite), édition seule. **Supprimé** : `TripStopNameForm.tsx`, le Modal dialog, le long-press sur le nom.
- **Header natif** : le layout pose déjà `title: "Les étapes"` + `headerLargeTitleEnabled` + `headerTransparent` (iOS) + `useGlassHeaderOptions` — grand titre qui se rétracte dans la barre en verre au scroll. Ne pas re-ajouter de grand titre dans la liste (double titre supprimé le 06/10) ; sous-titre d'intro seulement.
- **Plein cadre** : `Screen edges={[]}` (pattern goods) + `contentContainerClassName="px-4 pt-2 pb-24"` (le pb-24 porte le clearance FAB + barre de gesture). FAB relevé de `insets.bottom + 40` (voir FAB ci-dessous).

## FAB (`components/ui/FloatingAddButton.tsx`)

- Prop `style` passthrough. `bottom-10` du vrai bas — correct dans un conteneur safe (polls/planning), **trop bas sur un écran full-bleed avec barre de navigation Android** (nav 3 boutons ~48px chevauche). Les écrans full-bleed (`location`, `goods`) passent `style={{ bottom: insets.bottom + 40 }}` via `useSafeAreaInsets`. Ne pas rendre le composant globalement inset-aware (double-comptage dans les conteneurs safe). `links` à traiter lors de sa refonte.

## Settings (`app/[id]/settings/*` + share/edit-general/restrictions) — refaits le 2026-10-06

- Charte All In partout : cartes `bg-white dark:bg-night` + `border-mist`, fonds `bg-mist dark:bg-ink` (screens du stack settings sans SafeAreaView — le layout settings padde déjà `insets.bottom`).
- Profil : carte profil (avatar xl + nom + boutons outlined « Modifier nom / avatar ») + carte restrictions ; ~80 lignes de JSX commenté supprimées.
- Avatar (refait en « character select ») : catalogue en tuiles-cartes 3/rangée, sections Personnages/Animaux, héros animé en tête (anneau ambre, ZoomIn à chaque choix), tile élue = bord ambre + fond `bg-amber/10` + badge coche, tile prise = lock + nom du propriétaire ; barre d'action fixe en bas, désactivée sans changement (`isNewPick`, plus de PUT no-op). `selectedAvatar` dérivé (`pickedAvatar ?? user.avatar`).
- `UserRestrictionsForm` (refait en tuiles) : grille sélectionnable 3/rangée façon picker d'avatar — tap pour toggler (`useController`), tuile active = bord ambre + fond `bg-amber/10` + badge coche ; `FormSwitch`/`Switch` restent (PollSettingsForm). **Validé device 06/10 (tout le périmètre du jour sauf share).**
- **Share v3** : `useShareTrip` = POST `/v3/trips/:id/share` (`ShareTripResponse { value, type }`) ; écran : QR sur carte, 3 boutons de partage **en cartes All In** (couleur de marque uniquement sur l'icône FontAwesome), `useTrip()` (fin du double fetch). Idempotence backend (Q4) à confirmer.
- `edit-general` : Screen + charte + `useTrip()` ; `restrictions` : cartes charte, badge compte `bg-amber/15`, « Terminé » ambre-deep.

## Sondages (`app/[id]/polls/*`) — migrés v3 + charte All In le 2026-10-06

- `PollStatus` : chips — CTA (créer/voter) = ambre plein + texte night ; voté = `bg-amber/15` + texte ambre-deep ; terminé = mist neutre. `PollOption` : dégradé ambre→ambre-deep, coche ambre-deep, pill % `bg-amber/15`. `ToggleButton` (polls-only) en ambre/mist. `Switch` passé ambre-deep (propage au form restrictions). `FormLink` au pattern carte de `FormText` (propage à join/links). `DateRangeCalendar` sur tokens (fin du `useColors` cassé, polls-only). `dates.tsx` : cartes charte, thème calendrier tokens, double fetch `useGetTrip` → `useTrip()`.

## Sujets en cours

1. **Migration API v1 → v3** (chantier principal, plan détaillé dans `docs/plan-migration-v3.md`) :
   - `x-user-id` → `x-user-token`, trip IDs encodés en URL, base URL `/api/v3/`.
   - **Phase 3 COMPLETE (06/10)** : `useTrips`, `useEvents`, `useMessages`, `useGoods`, `usePolls`, `useTripStop`, **`useLinks` (06/10, dernier)** — tous sous `v3Path`, interceptor pour le token, plus aucun `x-user-id` manuel. Restent en v1 **par design** : `useTokens`/`useVerifyToken` (Phase 5), `useSearchTrips` (mort, Phase 7) ; `useMigrate` envoie `x-user-id` volontairement. **Share migré v3 (06/10, POST) — idempotence backend Q4 à confirmer** ; puis les 403 lectures privées.
   - Flow join repensé (resolve token → seat picker → join), leave/rotate-token à créer.
2. **Gamification** (2026-10-06) : maquette `docs/maquette-gamification.html`. **Page étapes implémentée** (barre/nœuds/segments/chip/bannière — validation device en cours). **Dashboard en attente de validation** : ring « Préparation du voyage » (pondérations à trancher : ex. dates 25% / étapes 30% / sondages 25% / liste 20%), J-x, badges, carte « Prochaine action ». Tout front, aucune donnée API en plus.
3. **Améliorations visuelles opportunistes** : avatars des cartes, propagation `useColors` (voir Palette), `Screen edges={[]}` sur les écrans poussés restants, FAB inset sur `links`.

## Dette connue

- **TS : 26 erreurs** (`npx tsc --noEmit`, 2026-10-06 — baseline historique 117, réduite au fil des nettoyages par fichier touché). Baseline à ne pas dégrader.
- **Lint : 7 erreurs / 17 warnings** (2026-10-06 ; était 27 erreurs le 02/10). NB : `components/votes/` (ancêtre des polls, orphelin à zéro import) supprimé le 06/10 — il portait 28 erreurs TS à lui seul.. Améliorations du 06/10 : faux positif immutability de `FormLink` aligné sur `FormText` (disable), code mort `markedDates`/`formatRange` supprimés de `DatesPollOptionsForm`, `editMode` de `BottomLocationForm` dérivé (fin d'un setState-in-effect). **2 setState-in-effect restants assumés** (`setEnableQuery` du geocode dans `BottomLocationForm`, `editMode` de `BottomAccommodationForm` — setters manuels, refonte UX risquée, à traiter séparément). À nettoyer par fichier touché.
- **`text-md` : classe fantôme Tailwind v4** — migration `text-sm`/`text-base` au fil de l'eau.
- **`Skeleton` réparé (2026-09-30)** : tailles via `style` numérique (les classes dynamiques ne compilent pas en NativeWind). Les écrans touchés l'utilisent normalement.
- `app/_layout.tsx` : splash masqué dès que les polices sont chargées ; `useShareTrip` en `useQuery` (deviendra POST en v3) ; `useVerifyToken` réponse non consommée ; `storage/index.tsx` `encryptionKey` en dur.
- Doctor : échecs restants connus — 2 faux positifs git, `@expo/config-plugins` direct (voulu, plugin Sentry), conflit icônes (toastify), non-CNG (informatif).

## Conventions à respecter

- Le projet est écrit à la main par l'utilisateur, avec des zones de qualité inégale assumées. Amélioration **opportuniste** : on nettoie ce qu'on touche de toute façon, pas de grand refacto à part. Signaler le douteux, corriger dans le périmètre de la tâche.
- **Styles** : motif composant → variante de composant (pattern `Button.tsx`) ; chaîne réutilisable → `@utility` + `@apply` dans `global.css` ; nouvelles couleurs → tokens `@theme` dans `global.css` ; surfaces translucides → `GlassSurface`. `text-md` interdit.
- Les fichiers agent (`NOTES-agent.md`, `docs/*-agent.md`, `docs/plan-migration-v3.md`) sont en français.
- Couche API : hooks React Query dans `hooks/api/`, client axios dans `lib/axios.js`. **Auth v3 : le header `x-user-token` est injecté par l'interceptor, qui déduit le trip de l'URL (`/trips/<id>/…`) et lit le token dans MMKV au moment de chaque requête.** `v3Path` (`lib/api-v3.ts`) sur chaque endpoint migré ; plus de header posé à la main. leave/rotate-token n'auront qu'à écrire le stockage.
- Stockage : MMKV, clés `trips.<encodedId>`, shape lean `StorageTrip` = `{ _id, user?, token? }` dans `hooks/storage/useStorageTrips.ts`.
- **Écrans : conteneur standard `Screen`** (`components/ui/Screen.tsx`) — SafeAreaView edges gauche/droite/bas sous header natif. **Écrans poussés full-bleed (liste scrollable + FAB) : `edges={[]}` + padding du contenu porteur du clearance (pattern goods/location)** ; le FAB passe `bottom: insets.bottom + 40`.
- Ne jamais éditer un fichier sans l'avoir lu au préalable dans la session.
- **Trip actif : `useTrip()`** depuis `@/context/TripContext` — hook dédié, throw si utilisé hors layout `[id]` ; ne plus faire de `useGetTrip` parallèle dans les écrans sous layout `[id]` (double fetch, remplacé partout où touché).
- Outil : le repo est en **CRLF** — l'outil `edit` échoue sur les fichiers non réécrits ce session ; préférer `write_file` complet (sûr pour l'UTF-8) ou PowerShell `[System.IO.File]::ReadAllText/WriteAllText`. **NB 2026-10-06** : (1) l'affichage console de bash est lossy sur les accents mais les octets sur disque sont propres (vérifié au niveau bytes — ne pas « réparer » sur foi de l'affichage) ; (2) les remplacements multi-lignes doivent reprendre l'indentation exacte du fichier — sinon l'ancre échoue (dump la zone avant) ; (3) éviter les concaténations de chaînes dans les littéraux `@()` imbriqués de PowerShell (évaluation erratique) — précalculer les motifs en variables.
