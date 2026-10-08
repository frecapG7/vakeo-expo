import { v3Path } from "@/lib/api-v3";
import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Phase 5 — resolve + join v3.
 *
 * Le POST /token/verify v1 (useVerifyToken) est mort : le resolve EST la
 * vérification (un lien invalide/expiré → 404, état d'écran dédié). L'écran
 * join pousse directement vers /token/[token] avec la valeur extraite du lien.
 *
 * Aucun header x-user-token ici : le resolve est anonyme, et le join est
 * l'appel qui CRÉE l'identité — rien n'est encore en stockage, l'interceptor
 * ne matche aucune clé trips.<encodedId> (cf. lib/axios.js).
 */

/** Seat libre proposé par le resolve (raw ObjectId du TripUser — ne change pas en v3). */
export interface SeatCandidate {
    _id: string,
    name: string,
    avatar?: string
}

/** Réponse de GET /v3/token/:value (unifie les v1 /token/:token et /token/v2/:token). */
export interface ResolveTokenResponse {
    type: "joinToken",
    encodedId: string,
    trip: {
        _id: string,
        name: string,
        image?: string | null,
        isPrivate: boolean
    },
    availableSeats: SeatCandidate[]
}

const resolveToken = async (value: string): Promise<ResolveTokenResponse> => {
    // 404 = lien invalide ou expiré : état d'écran dédié, pas de toast interceptor.
    const response = await axios.get(v3Path(`/token/${value}`), { skipToastStatuses: [404] });
    return response.data;
};

export const useResolveToken = (value?: string) => {
    return useQuery<ResolveTokenResponse, Error>({
        queryKey: ["token", value],
        queryFn: () => resolveToken(String(value)),
        enabled: !!value,
        // Un lien invalide ne se répare pas : pas de retry, état d'erreur immédiat.
        retry: false
    });
};

/**
 * POST /v3/trips/:encodedId/join — réclamer un siège + recevoir le token du seat.
 * Privé : { joinToken, tripUserId } — le joinToken est la valeur du lien de partage.
 * Public : { tripUserId } (reprendre un seat existant) ou { name } (créer le sien).
 */
export interface JoinTripInput {
    joinToken?: string,
    tripUserId?: string,
    name?: string
}

export interface JoinTripResponse {
    user: { _id: string, name: string },
    token: string
}

const joinTrip = async (encodedId: string, data: JoinTripInput): Promise<JoinTripResponse> => {
    const response = await axios.post(v3Path(`/trips/${encodedId}/join`), data);
    return response.data;
};

export const useJoinTrip = (encodedId: string) => {
    return useMutation<JoinTripResponse, Error, JoinTripInput>({
        mutationFn: (data) => joinTrip(encodedId, data)
    });
};
