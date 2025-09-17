import { createContext } from "react";

interface IUser {
    _id: string,
    avatar: string,
    name: string
}

interface ITripContext {
    me?: {
        _id: string,
        avatar: string,
        name: string
    }
}


export const TripContext = createContext<ITripContext>({});
