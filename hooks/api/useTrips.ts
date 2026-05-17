import axios from "@/lib/axios";
import { Dashboard, Trip, TripUser } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const postTrip = async (trip: Omit<Trip, '_id'>): Promise<Trip> => {
  const response = await axios.post("/trips", trip);
  return response?.data;
};

export const usePostTrip = () => {
  return useMutation<Trip, Error, Omit<Trip, '_id'>>({
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
      ids: ids?.join(",") || "",
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

const getTripUser = async (tripId: string, userId: string): Promise<TripUser> => {
  const response = await axios.get(`/trips/${tripId}/users/${userId}`);
  return response.data;
}

export const useGetTripUser = (tripId: string, userId: string, options: any) => {
  return useQuery<TripUser>({
    queryKey: ["trips", tripId, "users", userId],
    queryFn: () => getTripUser(tripId, userId),
    ...options
  });
}

const updateTripUser = async (tripId: string, userId: string, data: TripUser) => {
  const response = await axios.put(`/trips/${tripId}/users/${userId}`, data);
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

const shareTrip = async (id: string) => {
  const response = await axios.post(`/trips/${id}/share`);
  return response.data;
}

export const useShareTrip = (id: string) => {
  return useMutation({
    mutationFn: () => shareTrip(id)
  });
}



const getDashboard = async (tripId: string, user: string): Promise<Dashboard> => {
  const response = await axios.get(`/trips/${tripId}/dashboard`, {
    params: {
      user
    }
  });
  return response.data;
}



export const useGetDashboard = (tripId: any, user: any, options?: any) => {
  return useQuery<Dashboard>({
    queryKey: ["trips", tripId, "dashboard"],
    queryFn: () => getDashboard(tripId, user),
    enabled: !!tripId && !!user,
    ...options
  })
}