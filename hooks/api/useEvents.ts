import axios from "@/lib/axios";
import { Event } from "@/types/models";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface IParams {
    cursor: string,
    limit: number,
    type?: string
}

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    events: Event[]
}

const search = async (tripId: string, params?: IParams): Promise<IPage> => {
    const response = await axios.get(`/trips/${tripId}/events`, {
        params
    });
    return response.data;
}

export const useGetEvents = (tripId: string, type?: string, options?: any) => {

    return useInfiniteQuery<IPage, Error>({
        queryKey: ["trips", tripId, "events", type],
        queryFn: ({ pageParam }) => search(tripId, {
            cursor: String(pageParam),
            limit: 25,
            type
        }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: !!tripId,
        ...options
    });
}


const postEvent = async (tripId: string, data: Omit<Event, '_id'>) : Promise<Event> => {
    const response = await axios.post(`/trips/${tripId}/events`, data);
    return response.data;
}


export const usePostEvent = (tripId: string) => {
    const queryClient = useQueryClient();
    return useMutation<Event, Error, Event>({
        mutationFn: (data) => postEvent(tripId, data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["trips", tripId, "events"]})
    })
}


const getEvent = async (tripId : string, eventId: string): Promise<Event> => {
    const response = await axios.get(`/trips/${tripId}/events/${eventId}`);
    return response.data;
}

export const useGetEvent = (tripId: string, eventId: string) => {
    return useQuery<Event>({
        queryKey: ["trips", tripId, "events", eventId],
        queryFn: () => getEvent(tripId, eventId),
        enabled: (!!tripId && !!eventId)
    })
}


const updateEvent = async (tripId: string, eventId: string, data: Event): Promise<Event> => {
    const response = await axios.put(`/trips/${tripId}/events/${eventId}`, data);
    return response.data;
}

export const useUpdateEvent = (tripId: string, eventId: string) => {
    const queryClient = useQueryClient();
    return useMutation<Event, Error, Event>({
        mutationFn: (data) => updateEvent(tripId, eventId, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["trips", tripId, "events"]});
        }
    })
}


