import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getMeals = async (tripId) => {
  // const response = await axios.get(`/trips/${tripId}/meals`);
  // return response.data;

  return [];
};

export const useGetMeals = (tripId) => {
  return useQuery({
    queryKey: ["meals", tripId],
    queryFn: () => getMeals(tripId),
    enabled: !!tripId,
  });
};

const getMeal = async (tripId, mealId) => {
  const response = await axios.get(`/trips/${tripId}/meals/${mealId}`);
  return response.data;
};

export const useGetMeal = (tripId, mealId) => {
  return useQuery({
    queryKey: ["trips", tripId, "meals", mealId],
    queryFn: () => getMeal(tripId, mealId),
    enabled: !!tripId && !!mealId,
  });
};

const postMeal = async (tripId, meal) => {
  const response = await axios.post(`/trips/${tripId}/meals`, meal);
  return response.data;
};

export const usePostMeal = (tripId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postMeal(tripId, data),
    onSuccess: (data) => {
      queryClient.setQueryData({
        queryKey: ["trips", tripId, "meals"],
        data: (oldData) => [...(oldData || []), data],
      });
    },
  });
};
