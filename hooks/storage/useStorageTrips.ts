import { storage } from "@/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";




export interface StorageTrip {
    /** encodedId v3 (opaque, fourni par l'API — jamais construit côté front). Raw ObjectId avant migration (Phase 2). */
    _id: string,
    /** Raw ObjectId du TripUser local (le seat réclamé). Optionnel : l'anonymat devient un état explicite en v3. Requis pour les URLs settings (GET /trips/:tripId/users/:tripUserId, décision Q2). */
    user?: string,
    /** Secret token v3 du seat pour CE trip (par trip+user, pas global). Lu par l'interceptor axios dans MMKV au moment de chaque requête (dérivé de l'URL). Absent si le seat n'a pas réclamé sa place. */
    token?: string
}


/**
 * Prédicat de forme d'un enregistrement `trips.*` : objet non-null avec `_id` string.
 * Filtre les valeurs JSON parsables mais sémantiquement invalides (null, nombre,
 * chaîne) — sinon `trip._id` fait crasher tous les consommateurs (preflight
 * migration, boucle migrate, home). Un enregistrement invalide est ignoré
 * (warn), jamais supprimé du stockage : il devient inerte, sans perte de donnée.
 */
const isStorageTrip = (value: unknown): value is StorageTrip =>
    !!value && typeof value === "object" && typeof (value as { _id?: unknown })._id === "string";


export const getStorageTrips = (): StorageTrip[] => {
    return storage.getAllKeys()
        .filter((key): key is string => !!key && key.startsWith("trips."))
        .map(key => storage.getString(key))
        .filter((value): value is string => !!value)
        .flatMap(value => {
            try{
                const parsed: unknown = JSON.parse(value);
                if (!isStorageTrip(parsed)) {
                    console.warn("Stockage : enregistrement trips.* invalide ignoré", value);
                    return [];
                }
                return [parsed];
            }catch(err){
                 console.warn("Stockage : trip corrompu ignoré", err);
                return [];
            }
        });
}

export const useGetStorageTrips = () => {
    return useQuery({ queryKey: ["storage", "trips"], queryFn: getStorageTrips })
}

const getStorageTrip = (id: string): StorageTrip | null => {
    const stringTrip = storage.getString(`trips.${id}`);
    if (stringTrip)
        return JSON.parse(stringTrip);
    return null;
}

export const useGetStorageTrip = (id: string) => {
    return useQuery({
        queryFn: () => getStorageTrip(id),
        queryKey: ["storage", "trips", id]
    });
}


const addTripStorage = (trip: StorageTrip): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            storage.set(`trips.${trip._id}`, JSON.stringify(trip));
            resolve();
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

export const useAddStorageTrip = () => {
    const queryClient = useQueryClient();
    return useMutation({ mutationFn: (trip: StorageTrip) => addTripStorage(trip), onSuccess: () => queryClient.invalidateQueries() })
}

const updateStorageTrip = (id: string, trip: StorageTrip): Promise<StorageTrip> => {
    return new Promise((resolve) => {
        storage.set(`trips.${id}`, JSON.stringify(trip));
        resolve(trip);
    }
    );
}


export const useUpdateStorageTrip = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({ mutationFn: (trip: StorageTrip) => updateStorageTrip(id, trip), onSuccess: () => queryClient.invalidateQueries() })
}

const deleteStorageTrip = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            storage.delete(`trips.${id}`);
            resolve();
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

export const useDeleteStorageTrip = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteStorageTrip(id),
        onSuccess: () => queryClient.invalidateQueries()
    });
}
