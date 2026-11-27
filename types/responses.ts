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

/**
 * Motifs de signalement acceptes par l'API (`CONTENT_REPORT_REASONS`). Ce sont
 * des cles : le libelle FR vit cote UI, le serveur ne renvoie jamais de texte.
 */
export type ReportReason = "spam" | "harassment" | "illicit" | "other";

/**
 * Types de contenu signalables (`CONTENT_REPORT_SUBJECTS`). La route est
 * generique : l'app n'expose aujourd'hui que `message`, les autres types sont
 * acceptes par le serveur sans surface UI.
 */
export type ReportSubjectType = "message" | "event" | "trip" | "tripUser" | "tripStop" | "poll" | "link" | "good";

/** Etat du signalement dans la file de moderation (workflow hors perimetre front). */
export type ReportStatus = "pending" | "reviewed" | "dismissed";

/** Signalement d'un contenu, tel que renvoye par `POST /trips/:id/reports`. */
export interface Report {
    _id: string;
    subjectType: ReportSubjectType;
    subjectId: string;
    trip: string;
    /** `null` pour un signalement anonyme (canal public DSA art. 16). */
    reporter: string | null;
    reason: ReportReason;
    comment: string | null;
    /** Instantane du contenu au moment du signalement : la preuve survit a l'edition. */
    subjectText?: string;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

/**
 * Reponse du canal siege. `alreadyReported` vient de l'anti-doublon serveur :
 * un second signalement renvoie 200 avec le signalement existant au lieu d'une
 * erreur, donc il n'y a pas de chemin d'erreur cote client.
 */
export interface ReportResponse {
    report: Report;
    alreadyReported: boolean;
}
