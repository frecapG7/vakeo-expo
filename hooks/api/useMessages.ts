import axios from "@/lib/axios";
import { v3Path } from "@/lib/api-v3";
import { reportContent } from "@/hooks/api/useReports";
import { ConversationsResponse, ReportReason, ReportResponse } from "@/types/responses";
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IMessage } from "@kesha-antonov/react-native-chat";

/**
 * Emojis autorises par le backend (liste fermee, sequences exactes au byte pres).
 * Le coeur est U+2764 U+FE0F : le "❤" nu renvoie un 422.
 */
export const ALLOWED_REACTIONS = ["\u{1F44D}", "\u{1F44E}", "\u{2764}\u{FE0F}", "\u{1F602}", "\u{1F622}"];

/** Reaction au format renvoye par l'API ; la lib de chat attend { emoji, userIds } (mapping cote composant). */
export interface BackendReaction {
    emoji: string;
    users: string[];
}

/**
 * Message brut renvoye par l'API (reactions au format backend).
 * `reportedByMe` n'est present que pour un appelant authentifie, et seulement
 * sur les listes : le message ne porte jamais de tableau de signaleurs.
 */
export type BackendMessage = Omit<IMessage, "reactions"> & { reactions?: BackendReaction[], reportedByMe?: boolean };

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    messages: BackendMessage[]
}

const getMessages = async (tripId: any, limit: number, cursor?: string, eventId?: string): Promise<IPage> => {
    const endpoint = eventId
        ? v3Path(`/trips/${tripId}/events/${eventId}/messages`)
        : v3Path(`/trips/${tripId}/messages/general`);

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
        queryKey: ["trips", tripId, "messages", eventId ?? null],
        queryFn: ({ pageParam }) => getMessages(tripId, 25, String(pageParam), eventId),
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
        },
        initialPageParam: "",
        enabled: !!tripId
    })
}


const postMessage = async (tripId: string, message: IMessage, eventId?: string): Promise<IMessage> => {
    const messageWithEvent = eventId ? { ...message, event: eventId } : message;
    const response = await axios.post(v3Path(`/trips/${tripId}/messages`), messageWithEvent);
    return response.data;
}

export const usePostMessage = (tripId: string, userId?: string, eventId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<IMessage, Error, IMessage>({
        mutationFn: (message) => {
            if (!userId) {
                throw new Error("User ID is required to post a message");
            }
            return postMessage(tripId, message, eventId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["trips", tripId, "messages", eventId ?? null] });
            await queryClient.invalidateQueries({ queryKey: ["trips", tripId, "conversations"] });
        },

    });
}


const postReaction = async (tripId: string, messageId: string, emoji: string): Promise<BackendReaction[]> => {
    const response = await axios.post(v3Path(`/trips/${tripId}/messages/${messageId}/reactions`), { emoji });
    return response.data.reactions;
}

const deleteReaction = async (tripId: string, messageId: string, emoji: string): Promise<BackendReaction[]> => {
    const response = await axios.delete(v3Path(`/trips/${tripId}/messages/${messageId}/reactions`), { data: { emoji } });
    return response.data.reactions;
}

/**
 * Reactions calculees pour l'affichage immediat (avant la reponse serveur) :
 * retire mon vote de l'emoji courant, puis le pose sur le nouveau.
 */
const optimisticReactions = (reactions: BackendReaction[] | undefined, userId: string, removeEmoji?: string, addEmoji?: string): BackendReaction[] => {
    let next = (reactions ?? [])
        .map((reaction) => ({ ...reaction, users: reaction.users.filter((user) => user !== userId) }))
        .filter((reaction) => reaction.users.length > 0);
    if (addEmoji) {
        const entry = next.find((reaction) => reaction.emoji === addEmoji);
        if (entry) entry.users = [...entry.users, userId];
        else next = [...next, { emoji: addEmoji, users: [userId] }];
    }
    return next;
}

interface ToggleReactionVariables {
    messageId: string,
    emoji: string,
    /** Emoji de ma reaction actuelle sur ce message, s'il y en a une. */
    currentReaction?: string
}

export const useToggleReaction = (tripId: any, userId?: string, eventId?: string) => {
    const queryClient = useQueryClient();
    const queryKey = ["trips", tripId, "messages", eventId ?? null];

    return useMutation<BackendReaction[], Error, ToggleReactionVariables, { previous?: InfiniteData<IPage> }>({
        mutationFn: async ({ messageId, emoji, currentReaction }) => {
            if (!tripId || !userId) {
                throw new Error("User ID is required to react");
            }
            // Une seule reaction par personne : on retire l'ancienne emoji avant de poser la nouvelle.
            if (currentReaction && currentReaction !== emoji) {
                await deleteReaction(tripId, messageId, currentReaction);
            }
            return currentReaction === emoji
                ? deleteReaction(tripId, messageId, emoji)
                : postReaction(tripId, messageId, emoji);
        },
        onMutate: async ({ messageId, emoji, currentReaction }) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<InfiniteData<IPage>>(queryKey);
            if (!previous || !userId) return { previous };

            queryClient.setQueryData<InfiniteData<IPage>>(queryKey, {
                ...previous,
                pages: previous.pages.map((page) => ({
                    ...page,
                    messages: page.messages.map((message) => String(message._id) === messageId
                        ? {
                            ...message,
                            reactions: optimisticReactions(
                                message.reactions,
                                userId,
                                currentReaction,
                                currentReaction === emoji ? undefined : emoji
                            )
                        }
                        : message)
                }))
            });
            return { previous };
        },
        onError: (_error, _variables, context) => {
            if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
        },
        // L'endpoint ne renvoie que les reactions du message modifie : merge local, pas de re-fetch.
        onSuccess: (reactions, { messageId }) => {
            queryClient.setQueryData<InfiniteData<IPage>>(queryKey, (old) => old && ({
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    messages: page.messages.map((message) => String(message._id) === messageId
                        ? { ...message, reactions }
                        : message)
                }))
            }));
        }
    });
}


interface ReportMessageVariables {
    messageId: string,
    reason: ReportReason,
    /** Precision libre optionnelle : trimmee cote serveur, 500 caracteres max. */
    comment?: string
}

/**
 * Signalement d'un message. La route est generique (`POST /trips/:id/reports`,
 * cf. `useReports`) : ce hook ne porte que le type de sujet et l'etat « deja
 * signale » dans le cache des messages.
 */
export const useReportMessage = (tripId: any, userId?: string, eventId?: string) => {
    const queryClient = useQueryClient();
    // Meme cle que les reactions : le chat general et les conversations d'event
    // partagent l'ecran, seule la cle de cache distingue les deux listes.
    const queryKey = ["trips", tripId, "messages", eventId ?? null];

    return useMutation<ReportResponse, Error, ReportMessageVariables>({
        mutationFn: ({ messageId, reason, comment }) => {
            if (!tripId || !userId) {
                throw new Error("User ID is required to report a message");
            }
            return reportContent(tripId, { subjectType: "message", subjectId: messageId, reason, comment });
        },
        // L'endpoint est idempotent (201 sur un nouveau signalement, 200 +
        // alreadyReported sur un doublon) : dans les deux cas le message est
        // « signale par moi », on pose le drapeau localement sans re-fetch.
        onSuccess: (_response, { messageId }) => {
            queryClient.setQueryData<InfiniteData<IPage>>(queryKey, (old) => old && ({
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    messages: page.messages.map((message) => String(message._id) === messageId
                        ? { ...message, reportedByMe: true }
                        : message)
                }))
            }));
        }
    });
}


const getUnreadCount = async (tripId: any): Promise<number> => {
    const response = await axios.get(v3Path(`/trips/${tripId}/conversations/unread/count`));
    return response.data?.count ?? 0;
}

export const useGetUnreadCount = (tripId: any, userId?: string) => {
    return useQuery<number, Error>({
        queryKey: ["trips", tripId, "conversations", "unread", "count", userId ?? null],
        queryFn: () => getUnreadCount(tripId),
        enabled: !!tripId && !!userId
    });
}


const getConversations = async (tripId: any): Promise<ConversationsResponse> => {
    const response = await axios.get(v3Path(`/trips/${tripId}/conversations`));
    return response.data;
}

export const useGetConversations = (tripId: any, userId?: string) => {
    return useQuery<ConversationsResponse, Error>({
        queryKey: ["trips", tripId, "conversations", userId ?? null],
        queryFn: () => getConversations(tripId),
        enabled: !!tripId
    });
}

const markAllAsRead = async (
    tripId: string,
    eventId?: string,
    isGeneral?: boolean
): Promise<void> => {
    let endpoint: string;

    if (eventId) {
        endpoint = v3Path(`/trips/${tripId}/events/${eventId}/messages/markAllAsRead`);
    } else if (isGeneral) {
        endpoint = v3Path(`/trips/${tripId}/messages/general/markAllAsRead`);
    } else {
        endpoint = v3Path(`/trips/${tripId}/messages/markAllAsRead`);
    }

    await axios.post(endpoint, {});
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
            return markAllAsRead(tripId, eventId, isGeneral);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trips", tripId, "messages", eventId ?? null] });
            queryClient.invalidateQueries({ queryKey: ["trips", tripId, "conversations"] });
        },
    });
};
