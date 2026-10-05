/**
 * Feature flags de l'app.
 *
 * Activation par variable d'environnement `EXPO_PUBLIC_*` (inlinée au build par Expo) :
 *   EXPO_PUBLIC_SHARED_CALENDAR_ENABLED=true   → calendrier de disponibilités partagées actif
 *   EXPO_PUBLIC_SHARED_CALENDAR_ENABLED=false  → désactivé
 *
 * Sans variable, la valeur par défaut est `__DEV__` : actif en dev (expo start / dev client),
 * désactivé dans les builds release (EAS preview / production, où `__DEV__` vaut false).
 * Après avoir modifié `.env.local`, relancer Metro avec le cache vidé : `npx expo start -c`.
 */
const flag = (override: string | undefined, devDefault: boolean = __DEV__): boolean =>
    override === undefined || override === "" ? devDefault : override === "true";

export const SHARED_CALENDAR_ENABLED = flag(process.env.EXPO_PUBLIC_SHARED_CALENDAR_ENABLED);
