import axios from "@/lib/axios";
import { v3Path } from "@/lib/api-v3";
import { Trip, TripUser } from "@/types/models";
import { Dashboard } from "@/types/responses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Création v3 (Phase 4) ---
// POST /v3/trips : la réponse n'est plus un Trip complet — encodedId (à stocker tel quel,
// jamais construit côté front), seats créés, et credentials du créateur (seat token).
export interface PostTripResponse {
  encodedId: string,
  seats?: unknown,
  credentials: { _id: string, name: string, token: string }
}

const postTrip = async (trip: Omit<Trip, '_id'>): Promise<PostTripResponse> => {
  const response = await axios.post(v3Path("/trips"), trip);
  return response?.data;
};

export const usePostTrip = () => {
  return useMutation<PostTripResponse, Error, Omit<Trip, '_id'>>({
    mutationFn: (data) => postTrip(data),
  });
};

const getTrip = async (tripId: string, params?: any): Promise<Trip> => {
  const response = await axios.get(`/trips/${tripId}`, {
    params
  });
  return response.data;
};

export const useGetTrip = (tripId: any, includeStops?: boolean) => {
  return useQuery<Trip>({
    queryKey: ["trips", tripId, { includeStops: !!includeStops }],
    queryFn: () => getTrip(tripId, {
      ...(!!includeStops && { includeStops: "true" })
    }),
    enabled: !!tripId,
  });
};


const searchTrips = async (ids: string[], search?: string) => {
  const response = await axios.get("/trips", {
    params: {
      ids: ids?.join(","),
      search
    }
  });
  return response.data;
}

export const useSearchTrips = (ids: string[]) => {
  return useQuery({
    queryKey: ["trips", ids],
    queryFn: () => searchTrips(ids)
  });
}

const updateTrip = async (tripId: any, data: Trip): Promise<Trip> => {
  const response = await axios.put(`/trips/${tripId}`, data);
  return response.data;
}

export const useUpdateTrip = (tripId: any) => {
  const queryClient = useQueryClient();
  return useMutation<Trip, Error, Trip>({
    mutationFn: (data) => updateTrip(tripId, data),
    onSuccess: async (data) => await queryClient.invalidateQueries({ queryKey: ["trips"] })
  })
}

const getTripUser = async (tripId: string, userId?: string): Promise<TripUser> => {
  const response = await axios.get(`/trips/${tripId}/users/${userId}`, {
    headers: {
      ...(userId && { "x-user-id": userId })
    }
  });
  return response.data;
}

export const useGetTripUser = (tripId: string, userId?: string, options?: any) => {
  return useQuery<TripUser>({
    queryKey: ["trips", tripId, "users", userId],
    queryFn: () => getTripUser(tripId, userId),
    enabled: !!userId,
    ...options
  })
}

const updateTripUser = async (tripId: string, userId: string, data: TripUser) => {
  const response = await axios.put(`/trips/${tripId}/users/${userId}`, data, {
    headers: {
      "x-user-id": userId
    }
  });
  return response.data;
}

export const useUpdateTripUser = (tripId: string, userId: string) => {
  const queryClient = useQueryClient();
  return useMutation<TripUser, Error, TripUser>({
    mutationFn: (data) => updateTripUser(tripId, userId, data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      await queryClient.setQueryData(["trips", tripId, "users", userId], data);
    }
  })
}

const shareTrip = async (id: any) => {
  const response = await axios.get(`/trips/${id}/share`);
  return response.data;
}

export const useShareTrip = (id: string) => {
  return useQuery({
    queryKey: ["trips", id, "share"],
    queryFn: () => shareTrip(id),
    enabled: !!id
  });
}



const getDashboard = async (tripId: string, userId?: string): Promise<Dashboard> => {
  const response = await axios.get(`/trips/${tripId}/dashboard`, {
    headers: {
      ...(userId && { "x-user-id": userId })
    }
  });
  return response.data;
}



export const useGetDashboard = (tripId: string, userId?: string, enabled?: boolean) => {
  return useQuery<Dashboard>({
    queryKey: ["trips", tripId, "dashboard", userId ?? null],
    queryFn: () => getDashboard(tripId, userId),
    enabled
  })
}


// --- Hydrate batch v3 (remplace GET /trips?ids= pour la home) ---
// POST /v3/trips/batch : credentials par item (identité v3 = seat token), pas de header global.
// Max 30 entrées par appel → pavage ; trips invisibles omis silencieusement (privé sans token
// valide, supprimé) → ne PAS déduire d'erreur d'un trip manquant, et ne pas zipper par position.

export interface BatchTripInput {
  /** encodedId v3 du trip (clé MMKV locale). */
  id: string,
  /** Seat token du trip (optionnel — requis pour les trips privés). */
  token?: string
}

export interface BatchTrip {
  /** encodedId v3 du trip (ajouté par le backend 2026-09-29) — clé de réconciliation
   *  avec le stockage local (navigation, keyExtractor). */
  encodedId: string,
  name: string,
  image?: string | null,
  startDate?: string,
  endDate?: string,
  createdAt: string,
  isPrivate: boolean,
  users: { _id: string, name: string, avatar?: string }[]
}

const BATCH_MAX_TRIPS = 30;

const batchTrips = async (trips: BatchTripInput[]): Promise<BatchTrip[]> => {
  const chunks: BatchTripInput[][] = [];
  for (let i = 0; i < trips.length; i += BATCH_MAX_TRIPS)
    chunks.push(trips.slice(i, i + BATCH_MAX_TRIPS));

  const pages = await Promise.all(chunks.map(chunk =>
    axios.post(v3Path("/trips/batch"), { trips: chunk })
      .then(response => response?.data?.trips ?? [])
  ));

  return pages.flat();
}

export const useBatchTrips = (trips: BatchTripInput[]) => {
  return useQuery<BatchTrip[], Error>({
    queryKey: ["trips", "batch", trips],
    queryFn: () => batchTrips(trips),
    enabled: trips.length > 0
  });
}
