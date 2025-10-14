import axios from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";


const search = async (tripId, params) => {
    const response = await axios.get(`/trips/${tripId}/events`, {
        params
    });
    return response.data;
}

export const useGetEvents = (tripId) => {

    return useInfiniteQuery({
        queryKey: ["trips", tripId, "events"],
        queryFn: ({pageParam}) => search(tripId, {
            cursor : pageParam,
            limit : 25
        }),
        getNextPageParam : (lastPage) => lastPage?.nextCursor,
        enabled: !!tripId
    });
}


