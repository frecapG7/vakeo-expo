import { Trip, TripUser } from "@/types/models";
import { createContext, useContext } from "react";

/**
 * Statut de résolution du trip actif — tri-state posé avec les 403 v3
 * (lectures privées : le refus d'accès est un état, pas une erreur).
 * - "loading" : le GET /trips/:id du layout est en vol ; `trip` est en pratique
 *   undefined pendant ce créneau (typage non-optionnel historique assumé).
 * - "ready" : trip résolu, les écrans [id]/* sont utilisables.
 * - "forbidden" : lecture privée refusée (403, pas de token valide) — le layout
 *   rend son écran d'état au lieu de la Stack, les écrans ne montent pas.
 */
export type TripStatus = "loading" | "ready" | "forbidden";

/**
 * Trip actif, fourni par `app/[id]/_layout.tsx` à tous les écrans `[id]/*`.
 * `trip._id` est l'encodedId v3 (opaque, fourni par l'API — jamais construit côté front).
 */
interface ITripContext {
    trip: Trip,
    me?: TripUser,
    status: TripStatus,
}

export const TripContext = createContext<ITripContext | undefined>(undefined);

/**
 * Consomme le trip actif. Throw si utilisé hors du layout `[id]`
 * (le provider n'y est pas monté) — ne pas utiliser sur la home.
 */
export const useTrip = (): ITripContext => {
    const context = useContext(TripContext);
    if (!context)
        throw new Error("useTrip : TripContext.Provider absent — ce composant doit vivre sous app/[id]/");
    return context;
};
