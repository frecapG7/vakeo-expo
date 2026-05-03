import axios from "@/lib/axios";
import { TripStop } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const getTripStops = async (id: any) : Promise<TripStop[]> => {
    const response = await axios.get(`/trips/${id}/stops`);
    return response.data;
}

export const useGetTripStops = (id: any) => {
    return useQuery<TripStop[]>({
        queryKey: ["trip", id, "stops"],
        queryFn: () => getTripStops(id)
    });
}


const postTripStop = async (id: any, data: TripStop): Promise<TripStop> => {
    const response = await axios.post(`/trips/${id}/stops`, data);
    return response.data;
}


export const usePostTripStop = (id: any) => {
    const queryClient = useQueryClient();
    return useMutation<TripStop, Error, TripStop>({
        mutationFn: (data) => postTripStop(id, data),
         onSuccess: (newTripStop) => queryClient.setQueryData<TripStop[]>(["trip", id, "stops"], (prevTripStops) => [...(prevTripStops || []), newTripStop])
    })
}


const putTripStop = async (id: any, data: TripStop): Promise<TripStop> => {
    const response = await axios.put(`/trips/${id}/stops/${data._id}`, data);
    return response.data;
}


export const usePutTripStop = (id: any) => {
    const queryClient = useQueryClient();
    return useMutation<TripStop, Error, TripStop>({
        mutationFn: (data) => putTripStop(id, data),
        onSuccess: (data) => queryClient.setQueryData<TripStop[]>(
            ["trip", id, "stops"], (prevTripStops) => prevTripStops?.map(tripStop => tripStop._id === data._id ? data : tripStop) || [])
    })
}


const deleteTripStop = async (id: any, stopId: any): Promise<void> => {
    await axios.delete(`/trips/${id}/stops/${stopId}`);
}

export const useDeleteTripStop = (id: any) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: (stopId) => deleteTripStop(id, stopId),
        onSuccess: (_, stopId) => queryClient.setQueryData<TripStop[]>(["trip", id, "stops"], (prevTripStops) => prevTripStops?.filter(tripStop => tripStop._id !== stopId) || [])
    })
}
