import axios from "@/lib/axios";
import { TripStop } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const getTripStops = async (id: any) : Promise<TripStop[]> => {
    const response = await axios.get(`/trips/${id}/stops`);
    return response.data;
}

export const useGetTripStops = (id: any) => {
    return useQuery<TripStop[]>({
        queryKey: ["trips", id, "stops"],
        queryFn: () => getTripStops(id),
        enabled: !!id
    });
}


const postTripStop = async (id: any, data: Omit<TripStop, '_id' | 'polls' | 'createdBy' | 'modifiedBy'>, userId?: string): Promise<TripStop> => {
    const response = await axios.post(`/trips/${id}/stops`, data, {
        headers: { ...(userId && { 'x-user-id': userId }) }
    });
    return response.data;
}


export const usePostTripStop = (id: any, userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<TripStop, Error, Omit<TripStop, '_id' | 'polls' | 'createdBy' | 'modifiedBy'>>({
        mutationFn: (data) => postTripStop(id, data, userId),
         onSuccess: (newTripStop) => queryClient.setQueryData<TripStop[]>(["trips", id, "stops"], (prevTripStops) => [...(prevTripStops || []), newTripStop])
    })
}


const putTripStop = async (id: any, data:  Omit<TripStop, 'polls' | 'createdBy' | 'modifiedBy'>, userId?: string): Promise<TripStop> => {
    const response = await axios.put(`/trips/${id}/stops/${data._id}`, data, {
        headers: { ...(userId && { 'x-user-id': userId }) }
    });
    return response.data;
}


export const usePutTripStop = (id: any, userId ?: string) => {
    const queryClient = useQueryClient();
    return useMutation<TripStop, Error,  Omit<TripStop, 'polls' | 'createdBy' | 'modifiedBy'>>({
        mutationFn: (data) => putTripStop(id, data, userId),
        onSuccess: (data) => queryClient.setQueryData<TripStop[]>(
            ["trips", id, "stops"], (prevTripStops) => prevTripStops?.map(tripStop => tripStop._id === data._id ? data : tripStop) || [])
    })
}


const deleteTripStop = async (id: any, stopId: any, userId?: string): Promise<void> => {
    await axios.delete(`/trips/${id}/stops/${stopId}`, {
        headers: { ...(userId && { 'x-user-id': userId }) }
    });
}

export const useDeleteTripStop = (id: any, userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: (stopId) => deleteTripStop(id, stopId, userId),
        onSuccess: (_, stopId) => queryClient.setQueryData<TripStop[]>(["trips", id, "stops"], (prevTripStops) => prevTripStops?.filter(tripStop => tripStop._id !== stopId) || [])
    })
}
