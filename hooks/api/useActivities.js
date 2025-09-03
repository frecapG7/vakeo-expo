import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getActivities = async (id) => {
  const response = await axios.get(`/trips/${id}/activities`);
  return response.data;
};

export const useGetActivities = (tripId) => {
  return useQuery({
    queryKey: ["activities", tripId],
    queryFn: () => getActivities(tripId),
    enabled: !!tripId,
  });
};

const getActivity = async (tripId, activityId) => {
  const response = await axios.get(`/trips/${tripId}/activities/${activityId}`);
  return response.data;
};
export const useGetActivity = (tripId, activityId) => {
  return useQuery({
    queryKey: ["trips", tripId, "activities", activityId],
    queryFn: () => getActivity(tripId, activityId),
    enabled: !!tripId && !!activityId,
  });
};

const postActivity = async (tripId, activity) => {
  const response = await axios.post(`/trips/${tripId}/activities`, activity);
  return response.data;
};
export const usePostActivity = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postActivity(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData({
        queryKey: ["trips", id, "activities"],
        data: (oldData) => [...(oldData || []), data],
      });
    },
  });
};

const putActivity = async (tripId, activityId, activity) => {
  const response = await axios.put(
    `/trips/${tripId}/activities/${activityId}`,
    activity
  );
  return response.data;
};

export const usePutActivity = (tripId, activityId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => putActivity(tripId, activityId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId] }).then(() =>
        queryClient.setQueryData({
          queryKey: ["trips", tripId, "activities", activityId],
          data,
        })
      );
    },
  });
};

const deleteActivity = async (tripId, activityId) => {
  const response = await axios.delete(
    `/trips/${tripId}/activities/${activityId}`
  );
  return response.data;
};
export const useDeleteActivity = (tripId, activityId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteActivity(tripId, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", tripId] });
      queryClient.removeQueries({
        queryKey: ["trips", tripId, "activities", activityId],
      });
    },
  });
};
