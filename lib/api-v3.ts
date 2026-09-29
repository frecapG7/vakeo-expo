/**
 * Socle API v3.
 *
 * Décision Q1 (docs/plan-migration-v3.md) : le préfixe `/v3` est posé **par appel**
 * pendant la migration, la baseURL d'axios reste inchangée (v1 et v3 cohabitent
 * dans le client). Un endpoint migre URL **et** header ensemble.
 * Phase 7 : le préfixe passera dans `EXPO_PUBLIC_API_URL` (baseURL) et ces
 * helpers seront retirés.
 *
 * Les encoded IDs (trips) viennent toujours de l'API — jamais construits ici.
 * Les sub-resources (stops, polls, goods, links, messages, events) gardent
 * leurs raw ObjectIds, qui ne changent pas.
 */

/** Préfixe v3 à poser devant chaque chemin d'endpoint migré. */
export const V3_PREFIX = "/v3";

/** Construit un chemin v3 : `v3Path("/trips/:id")` → `/v3/trips/:id`. */
export const v3Path = (path: string): string =>
  `${V3_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Header d'auth v3 : `x-user-token` (secret token du seat, par trip+user).
 * Remplace `x-user-id`. Optionnel sur les lectures publiques, obligatoire
 * sur les mutations (401 sans).
 */
export const xUserTokenHeaders = (token?: string): Record<string, string> =>
  token ? { "x-user-token": token } : {};
