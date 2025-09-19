import axios from "@/lib/axios";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getMessages = async (tripId, cursor, limit = 10,) => {
    const response = await axios.get(`/trips/${tripId}/messages`, {
        params: {
            limit,
            cursor
        }
    });

    return response.data;
}


export const useGetMessages = (tripId) => {
    return useInfiniteQuery({
        queryKey: ["trips", tripId, "messages"],
        queryFn: ({ pageParam }) => getMessages(tripId, pageParam),
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
        },
    })
}


const postMessage = async (tripId, message) => {
    console.log("posting content");
    const response = await axios.post(`/trips/${tripId}/messages`, message);
    return response.data;
}

export const usePostMessage = (tripId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (message) => postMessage(tripId, message),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "messages"] })
    });
}