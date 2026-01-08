import { TripUser } from "@/types/models";
import { createContext } from "react";

interface ITripContext {
    me: TripUser
}


export const TripContext = createContext<ITripContext>({});
