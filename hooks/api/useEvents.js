import axios from "@/lib/axios";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const search = async (tripId, params) => {
    const response = await axios.get(`/trips/${tripId}/events`, {
        params
    });
    return response.data;
}

export const useGetEvents = (tripId, params) => {

    return useInfiniteQuery({
        queryKey: ["trips", tripId, "events", params],
        queryFn: ({ pageParam }) => search(tripId, {
            cursor: pageParam,
            limit: 25,
            ...params
        }),
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: !!tripId
    });
}


const postEvent = async (tripId, data) => {
    const response = await axios.post(`/trips/${tripId}/events`, data);
    return response.data;
}


export const usePostEvent = (tripId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => postEvent(tripId, data),
        onSuccess: () => queryClient.invalidateQueries(["trips", tripId, "events"])
    })
}


const getEvent = async (tripId, eventId) => {
    const response = await axios.get(`/trips/${tripId}/events/${eventId}`);
    return response.data;
}

export const useGetEvent = (tripId, eventId) => {
    return useQuery({
        queryKey: ["trips", tripId, "events", eventId],
        queryFn: () => getEvent(tripId, eventId),
        enabled: (!!tripId && !!eventId)
    })
}


const updateEvent = async (tripId, eventId, data) => {
    const response = await axios.put(`/trips/${tripId}/events/${eventId}`, data);
    return response.data;
}

export const useUpdateEvent = (tripId, eventId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => updateEvent(tripId, eventId, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries(["trips", tripId, "events"]);
        }
    })
}


