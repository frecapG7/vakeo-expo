export interface Location {
    coordinates: [Number],
    displayName: string
}


export interface TripStop {
    _id: string,
    name: String,
    location?: Location,
    accommodation?: {
        image: string,
        icon: string,
        url: string,
        title: string,
    },
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
    tripStops?: TripStop[]
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
    type: EventType | string
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


export interface Poll {
    _id: string,
    type: PollType,
    question: string,
    trip: string,
    createdBy?: TripUser,
    isSingleAnswer: boolean,
    isAnonymous: boolean,
    isClosed: boolean,
    hasSelected: TripUser[]
};


export interface DatesPoll extends Poll {
    options: [
        {
            startDate: Date,
            endDate: Date,
            selectedBy: TripUser[],
            percent: number
        }
    ]
};


export interface HousingPoll extends Poll {
    options: [
        {
            image: string,
            icon: string,
            url: string,
            title: string,
            selectedBy: TripUser[],
            percent: number
        }
    ]
};

export interface OtherPoll extends Poll {
    options: [
        {
            value: string,
            selectedBy: TripUser[],
            percent: number
        }
    ]
}



