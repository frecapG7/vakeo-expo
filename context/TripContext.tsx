import { Trip, TripUser } from "@/types/models";
import { createContext } from "react";

interface ITripContext {
    trip: Trip,
    me?: TripUser,
}


export const TripContext = createContext<ITripContext>({
    trip: null!
});
