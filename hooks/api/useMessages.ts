import axios from "@/lib/axios";
import { ConversationsResponse } from "@/types/responses";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IMessage } from "react-native-gifted-chat";

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    messages: IMessage[]
}

const getMessages = async (tripId: any, limit: number, cursor?: string, eventId?: string): Promise<IPage> => {
    const endpoint = eventId
        ? `/trips/${tripId}/events/${eventId}/messages`
        : `/trips/${tripId}/messages/general`;

    const response = await axios.get(endpoint, {
        params: {
            limit,
            cursor
        }
    });

    return response.data;
}

export const useGetMessages = (tripId: any, eventId?: string) => {
    return useInfiniteQuery<IPage, Error>({
        queryKey: ["trips", tripId, eventId ? "events" : "messages", eventId ?? null],
        queryFn: ({ pageParam }) => getMessages(tripId, 25, String(pageParam), eventId),
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
        },
        initialPageParam: "",
        enabled: !!tripId
    })
}


const postMessage = async (tripId: string, userId: string, message: IMessage, eventId?: string): Promise<IMessage> => {
    const messageWithEvent = eventId ? { ...message, event: eventId } : message;
    const response = await axios.post(`/trips/${tripId}/messages`, messageWithEvent, {
        headers: {
            'x-user-id': userId
        }
    });
    return response.data;
}

export const usePostMessage = (tripId: string, userId?: string, eventId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<IMessage, Error, IMessage>({
        mutationFn: (message) => {
            if (!userId) {
                throw new Error("User ID is required to post a message");
            }
            return postMessage(tripId, userId, message, eventId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["trips", tripId, "messages", eventId ?? null] });
            await queryClient.invalidateQueries({ queryKey: ["trips", tripId, "conversations"] });
        },

    });
}


const getUnreadCount = async (tripId: any, userId: string): Promise<number> => {
    const response = await axios.get(`/trips/${tripId}/conversations/unread/count`, {
        headers: {
            "x-user-id": userId
        }
    });
    return response.data?.count ?? 0;
}

export const useGetUnreadCount = (tripId: any, userId?: string) => {
    return useQuery<number, Error>({
        queryKey: ["trips", tripId, "conversations", "unread", "count"],
        queryFn: () => getUnreadCount(tripId, userId!),
        enabled: !!tripId && !!userId
    });
}


const getConversations = async (tripId: any, userId?: string): Promise<ConversationsResponse> => {
    const response = await axios.get(`/trips/${tripId}/conversations`, {
        headers: userId ? { "x-user-id": userId } : undefined
    });
    return response.data;
}

export const useGetConversations = (tripId: any, userId?: string) => {
    return useQuery<ConversationsResponse, Error>({
        queryKey: ["trips", tripId, "conversations", userId ?? null],
        queryFn: () => getConversations(tripId, userId),
        enabled: !!tripId
    });
}

const markAllAsRead = async (
    tripId: string,
    userId: string,
    eventId?: string,
    isGeneral?: boolean
): Promise<void> => {
    let endpoint: string;

    if (eventId) {
        endpoint = `/trips/${tripId}/events/${eventId}/messages/markAllAsRead`;
    } else if (isGeneral) {
        endpoint = `/trips/${tripId}/messages/general/markAllAsRead`;
    } else {
        endpoint = `/trips/${tripId}/messages/markAllAsRead`;
    }

    await axios.post(endpoint, {}, {
        headers: { 'x-user-id': userId }
    });
};

export const useMarkAllAsRead = (
    tripId: string,
    userId?: string,
    eventId?: string,
    isGeneral?: boolean
) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, void>({
        mutationFn: () => {
            if (!userId) {
                throw new Error("User ID is required");
            }
            return markAllAsRead(tripId, userId, eventId, isGeneral);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trips", tripId, "messages"] });
            queryClient.invalidateQueries({ queryKey: ["trips", tripId, "conversations"] });
        },
    });
};