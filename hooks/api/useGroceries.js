
import axios from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";


const getGroceries = async (id, params) => {
    const response = await axios.get(`/trips/${id}/groceries`, {
        params
    });

    return response;
}




export const useGetGroceries = (id, limit = 25, onlyPending = false) => {

    return useInfiniteQuery({
        queryKey: ["trips", id, "groceries"],
        queryFn: ({pageParam = 0}) => getGroceries(id, {
            page: pageParam,
            limit,
            onlyPending
        }),
        getNextPageParam: () => undefined, //TODO,
        initialPageParam: 0
    });
}