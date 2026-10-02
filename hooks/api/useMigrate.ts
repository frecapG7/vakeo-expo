import { useMutation } from "@tanstack/react-query";
import { getStorageTrips, StorageTrip } from "@/hooks/storage/useStorageTrips";
import { v3Path } from "@/lib/api-v3";
import axios from "@/lib/axios";
import { storage } from "@/storage";

/**
 * Bootstrap de migration v1 → v3 (Phase 2 du plan, docs/plan-migration-v3.md).
 *
 * Pour chaque trip local encore identifié par un raw ObjectId, appelle
 * `POST /api/v3/migrate` avec l'ancien `x-user-id` + `{ tripId }`, puis :
 * - réécrit la clé `trips.<encodedId>` (avec le token retourné),
 * - supprime la clé `trips.<rawId>`,
 * - 404 = trip supprimé côté serveur (décision Q6) → drop local.
 *
 * Resumable et idempotent :
 * - un raw ObjectId (24 hex) ne migre jamais deux fois (liste `migrated` dans
 *   la clé méta `migration`, + le garde-fou pattern rawObjectId) ;
 * - un échec réseau n'interrompt pas la boucle : le trip restera à migrer au
 *   prochain lancement ;
 * - la clé méta disparaîtra en Phase 7 avec le reste du code de migration.
 *
 * Gate : branché au démarrage derrière `EXPO_PUBLIC_V3_ENABLED` — désactivé,
 * l'app reste 100 % v1 (aucun appel réseau).
 */

interface MigrateResponse {
    encodedId: string,
    user?: { _id: string, name: string },
    token?: string
}

interface MigrationState {
    version: number,
    /** Raw ObjectIds déjà migrés (ou droppés) — ne pas les re-traiter. */
    migrated: string[]
}

interface MigrateSummary {
    migrated: number,
    /** Trips supprimés côté serveur (404), donc droppés localement. */
    dropped: number,
    /** Échecs réseau/serveur — seront retentés au prochain lancement. */
    failed: number
}

const MIGRATION_KEY = "migration";
const MIGRATION_VERSION = 3;
const RAW_OBJECT_ID = /^[0-9a-f]{24}$/i;

const getMigrationState = (): MigrationState => {
    const raw = storage.getString(MIGRATION_KEY);
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch (err) {
            console.error("Migration v3 : clé méta corrompue, repart à vide", err);
        }
    }
    return { version: MIGRATION_VERSION, migrated: [] };
};

const markMigrated = (rawId: string): void => {
    const state = getMigrationState();
    if (!state.migrated.includes(rawId)) {
        state.migrated.push(rawId);
        storage.set(MIGRATION_KEY, JSON.stringify(state));
    }
};

/**
 * True s'il reste des trips à migrer (raw ObjectId non encore traités).
 * Permet à MigrationGate de ne pas lancer la mutation (ni logger) quand tout
 * est déjà migré — cas de tous les full reloads en dev une fois la migration faite.
 */
export const hasPendingMigrations = (): boolean => {
    const { migrated } = getMigrationState();
    return getStorageTrips().some(trip =>
        RAW_OBJECT_ID.test(trip._id) && !migrated.includes(trip._id)
    );
};

const migrateTrip = async (trip: StorageTrip): Promise<"migrated" | "dropped"> => {
    try {
        const response = await axios.post(v3Path("/migrate"), { tripId: trip._id }, {
            headers: {
                ...(trip.user && { "x-user-id": trip.user })
            },
            // 404 = trip supprimé côté serveur (décision Q6) : drop silencieux, sans
            // toast de l'interceptor. Les autres échecs (réseau, 5xx…) toastent comme avant.
            skipToastStatuses: [404]
        });
        const data: MigrateResponse = response.data;
        // Stockage lean v3 : encodedId + credentials. name/image ne sont plus stockés
        // localement — l'affichage vit sur l'hydrate batch (POST /v3/trips/batch).
        const newTrip: StorageTrip = {
            _id: data.encodedId,
            user: data.user?._id ?? trip.user,
            token: data.token
        };
        // Nouvelle clé d'abord : si encodedId === rawId (re-mint théorique),
        // l'écriture puis la suppression ne doivent pas s'annuler.
        storage.set(`trips.${data.encodedId}`, JSON.stringify(newTrip));
        if (data.encodedId !== trip._id)
            storage.delete(`trips.${trip._id}`);
        return "migrated";
    } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
            storage.delete(`trips.${trip._id}`);
            return "dropped";
        }
        throw err;
    }
};

export const useMigrate = () => {
    return useMutation<MigrateSummary, Error, void>({
        mutationFn: async () => {
            const { migrated } = getMigrationState();
            const pending = getStorageTrips().filter(trip =>
                RAW_OBJECT_ID.test(trip._id) && !migrated.includes(trip._id)
            );

            const summary: MigrateSummary = { migrated: 0, dropped: 0, failed: 0 };

            for (const trip of pending) {
                try {
                    const result = await migrateTrip(trip);
                    markMigrated(trip._id);
                    summary[result]++;
                } catch (err) {
                    console.error(`Migration v3 : échec pour ${trip._id}`, err);
                    summary.failed++;
                }
            }

            return summary;
        }
    });
};
