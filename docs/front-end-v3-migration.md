# Frontend migration v1 → v3

## Résumé des changements pour le frontend

L'API v3 introduit trois ruptures par rapport à v1 :
1. **Identité** : `x-user-id` (raw ObjectId) → `x-user-token` (secret token)
2. **Trip IDs dans les URLs** : raw ObjectId → encoded ID (AES-256-GCM, opaque)
3. **Base URL** : `/api/trips/...` → `/api/v3/trips/...`

Tout le reste (structure des réponses, services, modèle de données) est identique.

---

## Étape 1 — Endpoint de migration (one-shot au lancement)

Au démarrage de l'app, pour chaque trip stocké localement (raw ObjectId), appeler :

```
POST /api/v3/migrate
Headers: x-user-id: <ancien TripUser ObjectId>  (optionnel)
Body:    { tripId: "<raw trip ObjectId>" }
```

Réponse :
```json
{
  "encodedId": "hKKWa1eWAw...",   // nouvel identifiant à stocker
  "user": { "_id": "...", "name": "Alice" },  // si x-user-id fourni
  "token": "tok-..."              // si x-user-id fourni
}
```

**À faire côté frontend :**
- Remplacer le raw trip id stocké localement par `encodedId`.
- Si un `x-user-id` était stocké, le remplacer par le `token` retourné.
- Stocker `{ encodedId, token, userId }` comme nouvelle identité locale.
- L'endpoint est idempotent : un second appel avec le même `x-user-id` retourne le même token (pas de re-mint).
- Si l'utilisateur n'avait pas réclamé de siège (pas de `x-user-id`), seul `encodedId` est retourné.

## Étape 2 — Headers d'authentification

| Avant (v1) | Après (v3) |
|---|---|
| `x-api-key: <key>` | `x-api-key: <key>` (inchangé) |
| `x-user-id: <TripUser ObjectId>` | `x-user-token: <token>` |

- Toutes les requêtes v3 envoient `x-user-token` au lieu de `x-user-id`.
- Sur les endpoints de lecture publique (trips publics, polls, etc.), `x-user-token` est optionnel — l'utilisateur peut être anonyme.
- Sur les endpoints de mutation, `x-user-token` est obligatoire (401 sans).

## Étape 3 — Trip IDs dans les URLs

Tous les `:tripId` / `:id` dans les URLs v3 sont des **encoded IDs**, pas des raw ObjectIds.

| Avant (v1) | Après (v3) |
|---|---|
| `GET /api/trips/507f1f77bcf86cd799439011` | `GET /api/v3/trips/hKKWa1eWAw...` |
| `PUT /api/trips/507f1f77bcf86cd799439011` | `PUT /api/v3/trips/hKKWa1eWAw...` |

- Le frontend ne construit **jamais** d'encoded ID lui-même — il reçoit `encodedId` de l'API (création, migration, share) et le stocke tel quel.
- Les sub-resource IDs (stop, poll, good, link, message, event) restent des raw ObjectIds — eux ne changent pas.

## Étape 4 — Changements par endpoint

### Trips

| Endpoint v1 | Endpoint v3 | Différences |
|---|---|---|
| `GET /api/trips?ids=<raw>,<raw>` | `GET /api/v3/trips?ids=<encoded>,<encoded>` | IDs encodés dans le query param |
| `GET /api/trips/:id` | `GET /api/v3/trips/:tripId` | ID encodé ; private trip → 403 sans token |
| `POST /api/trips` | `POST /api/v3/trips` | Réponse change : `{ encodedId, seats, credentials: { _id, name, token } }` — stocker `encodedId` + `credentials.token` |
| `PUT /api/trips/:id` | `PUT /api/v3/trips/:tripId` | ID encodé ; 403 si non-membre |
| `DELETE /api/trips/:id` | `DELETE /api/v3/trips/:tripId` | ID encodé ; 403 si non-membre ; retourne 204 (pas 200) |
| `GET /api/trips/:id/dashboard` | `GET /api/v3/trips/:tripId/dashboard` | ID encodé ; private → 403 sans token |
| `POST /api/trips/:id/share` | `POST /api/v3/trips/:tripId/share` | ID encodé ; 403 si non-membre ; retourne `{ value, type: "joinToken" }` |
| — | `POST /api/v3/trips/:tripId/join` | Nouveau — réclamer un siège + obtenir un token |
| — | `POST /api/v3/trips/:tripId/leave` | Nouveau — libérer son siège |

### Sub-resources (stops, polls, goods, links, messages, events, tripUsers)

| Changement | Détail |
|---|---|
| Base URL | `/api/trips/:id/...` → `/api/v3/trips/:tripId/...` |
| Trip ID dans l'URL | raw → encoded |
| Auth sur mutations | `x-user-token` obligatoire, 403 si non-membre |
| Auth sur lectures | `x-user-token` optionnel ; private trip → 403 si non-membre/anonyme |
| Sub-resource IDs | Inchangés (raw ObjectIds) |
| Body / response | Identiques à v1 |

### Share links (tokens)

| Avant (v1) | Après (v3) |
|---|---|
| `GET /api/token/:token` (JWT déprécié) | `GET /api/v3/token/:value` (joinToken JWT) |
| `GET /api/token/v2/:token` (encoded ID) | `GET /api/v3/token/:value` (unifié) |

Le token de share v3 est toujours un joinToken JWT (retourné par `POST /:tripId/share`). La résolution via `GET /api/v3/token/:value` retourne :
```json
{
  "type": "joinToken",
  "encodedId": "...",
  "trip": { "_id", "name", "image", "isPrivate" },
  "availableSeats": [{ "_id", "name", "avatar" }]
}
```

### TripUsers

| Endpoint v3 | Notes |
|---|---|
| `GET /api/v3/trips/:tripId/users` | Liste des seats |
| `POST /api/v3/trips/:tripId/users` | Ajouter un seat — bloqué sur trips privés (utiliser join) |
| `PUT /api/v3/trips/:tripId/users/:id` | Mettre à jour un seat |
| `DELETE /api/v3/trips/:tripId/users/:id` | Supprimer un seat |
| `POST /api/v3/trips/:tripId/users/:id/rotate-token` | Renouveler un token compromis |

## Étape 5 — Nouveaux flows à implémenter

### Join (nouvel utilisateur rejoint un trip)

1. L'owner partage : `POST /api/v3/trips/:tripId/share` → `{ value, type: "joinToken" }`
2. Le nouvel utilisateur ouvre le lien : `GET /api/v3/token/:value` → `{ trip, availableSeats, encodedId }`
3. Il réclame un siège : `POST /api/v3/trips/:encodedId/join` avec `{ joinToken, tripUserId }` (privé) ou `{ tripUserId }` / `{ name }` (public)
4. Réponse : `{ user: { _id, name }, token }` — stocker `token` + `encodedId`

### Leave

`POST /api/v3/trips/:tripId/leave` avec `x-user-token` → 204. Le siège est libéré, le token invalidé.

### Rotate token

`POST /api/v3/trips/:tripId/users/:id/rotate-token` → retourne le nouveau token. À utiliser si un token est compromis.

## Étape 6 — Checklist de migration

- [ ] Au lancement : appeler `POST /api/v3/migrate` pour chaque trip local stocké
- [ ] Remplacer le stockage local : `tripId` (raw) → `encodedId`, `userId` (raw) → `token`
- [ ] Changer le header par défaut : `x-user-id` → `x-user-token`
- [ ] Changer la base URL : `/api/` → `/api/v3/`
- [ ] URL builder : utiliser `encodedId` pour les trips, raw ObjectIds pour sub-resources
- [ ] Gérer les nouveaux codes d'erreur : 403 sur private reads (était open en v1), 401 sur mutations sans token
- [ ] Création de trip : stocker `credentials.token` + `encodedId` de la réponse
- [ ] Implémenter le flow join (share link → resolve → join)
- [ ] Implémenter leave + rotate-token
- [ ] Supprimer le code de migration une fois tous les utilisateurs migrés

## Notes

- v1 reste disponible pendant la migration — pas besoin de big-bang.
- L'endpoint `/migrate` est temporaire : à supprimer côté API une fois le frontend migré.
- Les encoded IDs ne sont pas réversibles côté frontend (pas de `decodeId`) — toujours stocker ce que l'API retourne.
- `x-api-key` ne change pas.
