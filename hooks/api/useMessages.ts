import axios from "@/lib/axios";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IMessage } from "react-native-gifted-chat";

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    messages: IMessage[]
}

const getMessages = async (tripId: any, limit: number, cursor?: string): Promise<IPage> => {
    const response = await axios.get(`/trips/${tripId}/messages`, {
        params: {
            limit,
            cursor
        }
    });

    return response.data;
}


export const useGetMessages = (tripId: any) => {
    return useInfiniteQuery<IPage, Error>({
        queryKey: ["trips", tripId, "messages"],
        queryFn: ({ pageParam }) => getMessages(tripId, 25, String(pageParam)),
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
        },
        initialPageParam: "",
        enabled: !!tripId
    })
}


const postMessage = async (tripId: any, message: IMessage): Promise<void> => {
    console.log("posting content");
    const response = await axios.post(`/trips/${tripId}/messages`, message);
    return response.data;
}

export const usePostMessage = (tripId: any) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, IMessage>({
        mutationFn: (message) => postMessage(tripId, message),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "messages"] })
    });
}