import { Trip, TripUser } from "@/types/models";
import { createContext, useContext } from "react";

/**
 * Trip actif, fourni par `app/[id]/_layout.tsx` à tous les écrans `[id]/*`.
 * `trip._id` est l'encodedId v3 (opaque, fourni par l'API — jamais construit côté front).
 * NB : `trip` est en pratique undefined pendant le chargement du layout ; le typage
 * non-optionnel est un héritage assumé (à retyper en tri-state chargement/anonyme/membre
 * avec la gestion des 403 v3, cf. plan-migration-v3.md Phase 3/5).
 */
interface ITripContext {
    trip: Trip,
    me?: TripUser,
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
