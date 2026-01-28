import { TripUser } from "@/types/models";
import { createContext } from "react";

interface ITripContext {
    me: TripUser,
    showMenu: () => void
}


export const TripContext = createContext<ITripContext>({});
