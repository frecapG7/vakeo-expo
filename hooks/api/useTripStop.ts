import { v3Path } from "@/lib/api-v3";
import axios from "@/lib/axios";
import { TripStop } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const getTripStops = async (id: any) : Promise<TripStop[]> => {
    const response = await axios.get(v3Path(`/trips/${id}/stops`));
    return response.data;
}

export const useGetTripStops = (id: any) => {
    return useQuery<TripStop[]>({
        queryKey: ["trips", id, "stops"],
        queryFn: () => getTripStops(id),
        enabled: !!id
    });
}


const postTripStop = async (id: any, data: Omit<TripStop, '_id' | 'polls' | 'createdBy' | 'modifiedBy'>): Promise<TripStop> => {
    const response = await axios.post(v3Path(`/trips/${id}/stops`), data);
    return response.data;
}


export const usePostTripStop = (id: any) => {
    const queryClient = useQueryClient();
    return useMutation<TripStop, Error, Omit<TripStop, '_id' | 'polls' | 'createdBy' | 'modifiedBy'>>({
        mutationFn: (data) => postTripStop(id, data),
         onSuccess: (newTripStop) => queryClient.setQueryData<TripStop[]>(["trips", id, "stops"], (prevTripStops) => [...(prevTripStops || []), newTripStop])
    })
}


const putTripStop = async (id: any, data:  Omit<TripStop, 'polls' | 'createdBy' | 'modifiedBy'>): Promise<TripStop> => {
    const response = await axios.put(v3Path(`/trips/${id}/stops/${data._id}`), data);
    return response.data;
}


export const usePutTripStop = (id: any) => {
    const queryClient = useQueryClient();
    return useMutation<TripStop, Error,  Omit<TripStop, 'polls' | 'createdBy' | 'modifiedBy'>>({
        mutationFn: (data) => putTripStop(id, data),
        onSuccess: (data) => queryClient.setQueryData<TripStop[]>(
            ["trips", id, "stops"], (prevTripStops) => prevTripStops?.map(tripStop => tripStop._id === data._id ? data : tripStop) || [])
    })
}


const deleteTripStop = async (id: any, stopId: any): Promise<void> => {
    await axios.delete(v3Path(`/trips/${id}/stops/${stopId}`));
}

export const useDeleteTripStop = (id: any) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: (stopId) => deleteTripStop(id, stopId),
        onSuccess: (_, stopId) => queryClient.setQueryData<TripStop[]>(["trips", id, "stops"], (prevTripStops) => prevTripStops?.filter(tripStop => tripStop._id !== stopId) || [])
    })
}
