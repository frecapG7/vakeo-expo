import { Event } from "./models";

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
        hasStopPoll: boolean;
        hasPendingStopPoll: boolean;
        hasDatePoll: boolean;
        hasPendingDatePoll: boolean;
    };
}
