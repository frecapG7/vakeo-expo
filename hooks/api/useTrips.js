import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const postTrip = async (trip) => {
  const response = await axios.post("/trips", trip);
  return response?.data;
};

export const usePostTrip = () => {
  return useMutation({
    mutationFn: (data) => postTrip(data),
  });
};

const getTrip = async (tripId) => {
  const response = await axios.get(`/trips/${tripId}`);
  return response.data;
};

export const useGetTrip = (tripId) => {
  return useQuery({
    queryKey: ["trips", tripId],
    queryFn: () => getTrip(tripId),
    enabled: !!tripId,
  });
};


const updateTrip = async (tripId, data) => {
  const response = await axios.put(`/trips/${tripId}`, data);
  return response.data;
}

export const useUpdateTrip = (tripId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateTrip(tripId, data),
    onSuccess: (data) => queryClient.setQueryData({
      queryKey: ['trips', tripId],
      data
    })
  })
}


const getTripUser = async (tripId, userId) => {
  const response = await axios.get(`/trips/${tripId}/users/${userId}`);
  return response.data;
}

export const useGetTripUser = (tripId, userId, options) => {
  return useQuery({
    queryKey: ["trips", tripId, "users", userId],
    queryFn: () => getTripUser(tripId, userId),
    ...options
  });
}

const updateTripUser = async (tripId, userId, data) => {
  const response = await axios.put(`/trips/${tripId}/users/${userId}`, data);
  return response.data;
}

export const useUpdateTripUser = (tripId, userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateTripUser(tripId, userId, data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["trips", tripId] });
      await queryClient.setQueryData({
        queryKey: ["trips", tripId, "users", userId],
        data
      })
    }
  })
}
