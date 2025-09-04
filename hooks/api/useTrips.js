import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const postTrip = async (trip) => {
  const response = await axios.post("/trips", trip);
  return response.data;
};

export const usePostTrip = () => {
  return useMutation({
    mutationFn: postTrip,
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
