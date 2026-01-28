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

const getTrip = async (tripId: string): Promise<Trip> => {
  const response = await axios.get(`/trips/${tripId}`);
  return response.data;
};

export const useGetTrip = (tripId: string) => {
  return useQuery<Trip>({
    queryKey: ["trips", tripId],
    queryFn: () => getTrip(tripId),
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

export const useSearchTrips = (ids: string[], search: string) => {
  return useQuery({
    queryKey: ["trips", ids, search],
    queryFn: () => searchTrips(ids, search)
  });
}

const updateTrip = async (tripId: string, data: Trip): Promise<Trip> => {
  const response = await axios.put(`/trips/${tripId}`, data);
  return response.data;
}

export const useUpdateTrip = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Trip, Error, Trip>({
    mutationFn: (data) => updateTrip(tripId, data),
    onSuccess: async (data) => await queryClient.setQueryData(['trips', tripId], data)
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



export const useGetDashboard = (tripId: string, user: string, options: any) => {
  return useQuery<Dashboard>({
    queryKey: ["trips", tripId, "dashboard"],
    queryFn: () => getDashboard(tripId, user),
    ...options
  })
}