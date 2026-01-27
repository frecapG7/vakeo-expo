


export interface Trip {
    _id: string,
    image: string,
    users: TripUser[],
    name: String,
    startDate?: Date,
    endDate?: Date
}

export interface TripUser {
    _id: string,
    name: string,
    avatar: string,
    restrictions: string[]
}


export interface Event {
    _id: string,
    startDate: Date,
    endDate: Date,
    name: string,
    attendees: TripUser[],
    owners: TripUser[],
    trip: string,
    details?: string
}


export interface Good {
    _id: string,
    name: string,
    quantity: string,
    createdBy: TripUser,
    event?: Event,
    checked: boolean
}


export interface DateVote {
    startDate: Date,
    endDate: Date,
    users: TripUser[]
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



