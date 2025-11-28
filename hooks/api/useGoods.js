import axios from "@/lib/axios";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getGoods = async (tripId, params) => {
    const response = await axios.get(`/trips/${tripId}/goods`, {
        params
    })
    return response.data;
}


export const useGetGoods = (tripId, params, options) => {
    return useInfiniteQuery({
        queryKey: ["trips", tripId, "goods", params],
        queryFn: ({ pageParam }) => getGoods(tripId, {
            cursor: pageParam,
            limit: 50,
            ...params
        }),
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: (!!tripId && options?.enabled),
        ...options
    })
}


const postGood = async (tripId, good) => {
    const response = await axios.post(`/trips/${tripId}/goods`, good);
    return response.data
}

export const usePostGood = (tripId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => postGood(tripId, data),
        onSuccess: () => queryClient.invalidateQueries(["trips", tripId, "goods"])
    });
}

const putGood = async (tripId, data) => {
    const response = await axios.put(`/trips/${tripId}/goods/${data._id}`, data);
    return response.data;
}
export const usePutGood = (tripId) => {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => putGood(tripId, data),
        onSuccess:() => queryClient.invalidateQueries(["trips", tripId, "goods"])
    });
}

const checkGood = async (tripId, goodId) => {
    const response = await axios.put(`/trips/${tripId}/goods/${goodId}/checked`);
    return response.data;
}

export const useCheckGood = (tripId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (good) => checkGood(tripId, good._id),
        onSuccess: () => queryClient.invalidateQueries(["trips", tripId, "goods"])
    })
}



const getNames = async (tripId, search) => {
    const response = await axios.get(`/trips/${tripId}/goods/names`, {
        params: {
            search
        }
    });
    return response.data;
}

const isEnabled = (search) => {
    if (!search)
        return false;
    return search?.length > 2;
}

export const useGetNames = (tripId, search) => {
    return useQuery({
        queryKey: ["trips", tripId, "goods", "names", search],
        queryFn: () => getNames(tripId, search),
        enabled: isEnabled(search)
    });
}


const getCount = async (tripId) => {
    const response = await axios.get(`/trips/${tripId}/goods/count`);
    return response.data;
}

export const useGetGoodsCount = (tripId) => {
    return useQuery({
        queryKey: ["trips", tripId, "goods", "count"],
        queryFn: () => getCount(tripId),
        enabled: !!tripId
    })
}