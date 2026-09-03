import { Event } from "./models";

export interface ConversationLastMessageUser {
    _id: string;
    name: string;
    avatar?: string;
    __v?: number;
    restrictions?: string[];
}

export interface Conversation {
    conversationId: string | null;
    title: string;
    lastMessage: string;
    lastMessageDate: string;
    lastMessageUser: ConversationLastMessageUser;
    unreadCount: number;
}

export interface ConversationsResponse {
    conversations: Conversation[];
}

export interface Dashboard {
    stops: {
        count: number;
        first: string;
        last: string;
    };
    goods: {
        missing: number;
        total: number;
    };
    events: {
        nextEvent: Event | null;
        total: number;
        totalAttendings: number;
    };
    polls: {
        openPollsCount: number;
        pendingPollsCount : number
    },
    users: {
        restrictionCount: number
    },
    links: {
        linksCount: number
    }
}
