export interface Location {
    coordinates: [Number],
    displayName: string
}

export interface Link {
    image: string,
    icon: string,
    url: string,
    title: string
}


export interface TripStop {
    _id: string,
    name: string,
    location?: Location,
    accommodation?: Link,
    polls?: Poll[],
    createdBy: TripUser,
    modifiedBy?: TripUser
}

export interface Trip {
    _id: string,
    image: string,
    users: TripUser[],
    name: string,
    description?: string,
    startDate?: Date | string,
    endDate?: Date | string,
    location?: Location, // marked as deprecated
    stops?: TripStop[]
    isPrivate?: boolean
}

export interface TripUser {
    _id: string,
    name: string,
    avatar?: string,
    restrictions?: string[]
}


export type EventType = "MEAL" | "RESTAURANT" | "SPORT" | "PARTY" | "VISITATION" | "ACTIVITY" | "OTHER";


export interface Event {
    _id: string,
    startDate?: Date | string,
    endDate?: Date | string,
    name: string,
    attendees?: TripUser[],
    owners?: TripUser[],
    trip: string,
    details?: string,
    type: EventType | string,
    goodsCount?: number
}


export interface Good {
    _id: string,
    name: string,
    quantity: string,
    createdBy: TripUser,
    event?: Event,
    checked: boolean
    trip: string
}




export interface Dashboard {
    polls: {
        pending: number,
        total: number
    },
    attendees: {
        total: number,
        restrictions: string[]
    },
    goods: {
        missing: number,
        total: number
    },
    events: {
        attending: number,
        ownership: number,
        total: number
    }
}


export type PollType = "DatesPoll" | "HousingPoll" | "OtherPoll";

// Base option interface with common fields
export interface PollOption {
    _id: string;
    selectedBy: TripUser[];
    percent: number;
}

// Specific option types
export interface DatePollOption extends PollOption {
    startDate: Date;
    endDate: Date;
}

export interface HousingPollOption extends PollOption {
    image: string;
    icon: string;
    url: string;
    title: string;
}

export interface OtherPollOption extends PollOption {
    value: string;
}


// Base interface for shared poll fields (without discriminator)
export interface BasePoll {
    _id: string;
    question: string;
    trip: string;
    createdBy?: TripUser;
    isSingleAnswer: boolean;
    isAnonymous: boolean;
    isClosed: boolean;
    hasSelected: TripUser[];
    createdAt: Date;
    options: PollOption[];
}

// Concrete poll types with literal type discriminators
export interface DatesPoll extends BasePoll {
    type: "DatesPoll";
    options: DatePollOption[];
}

export interface HousingPoll extends BasePoll {
    type: "HousingPoll";
    options: HousingPollOption[];
}

export interface OtherPoll extends BasePoll {
    type: "OtherPoll";
    options: OtherPollOption[];
}

// Poll is now a discriminated union
export type Poll = DatesPoll | HousingPoll | OtherPoll;



