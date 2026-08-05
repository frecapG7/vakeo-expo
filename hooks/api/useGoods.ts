import axios from "@/lib/axios";
import { Good } from "@/types/models";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface IParams {
    cursor: string,
    limit: number,
    type?: string,
    event?: string,
}

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    goods: Good[]
}

const getGoods = async (tripId: string, params: IParams): Promise<IPage> => {
    const response = await axios.get(`/trips/${tripId}/goods`, {
        params
    })
    return response.data;
}


export const useGetGoods = (tripId: string, params: any, options ?: {enabled ?: boolean}) => {
    return useInfiniteQuery<IPage, Error>({
        queryKey: ["trips", tripId, "goods", params],
        queryFn: ({ pageParam }) => getGoods(tripId, {
            cursor: pageParam,
            limit: 50,
            ...params
        }),
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        initialPageParam:"",
        enabled: !!tripId && (options?.enabled ?? true)
    })
}

const getGood = async (tripId: string, goodId: string, userId?: string): Promise<Good> => {
    const response = await axios.get(`/trips/${tripId}/goods/${goodId}`, {
        headers: {
            ...(userId && { "x-user-id": userId })
        }
    });
    return response.data;
}

export const useGetGood = (tripId: string, goodId: string, userId?: string, options?: { enabled?: boolean }) => {
    return useQuery<Good, Error>({
        queryKey: ["trips", tripId, "goods", goodId],
        queryFn: () => getGood(tripId, goodId, userId),
        enabled: !!tripId && !!goodId && (options?.enabled ?? true)
    });
}


const postGood = async (tripId: string, good: Good, userId?: string) => {
    const response = await axios.post(`/v2/trips/${tripId}/goods`, good, {
        headers: {
            ...(userId && { "x-user-id": userId })
        }
    });
    return response.data
}

export const usePostGood = (tripId: string, userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<Good, Error, Good>({
        mutationFn: (data) => postGood(tripId, data, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    });
}

const putGood = async (tripId: string, data: Good, userId?: string) => {
    const response = await axios.put(`/v2/trips/${tripId}/goods/${data._id}`, data, {
        headers: {
            ...(userId && { "x-user-id": userId })
        }
    });
    return response.data;
}
export const usePutGood = (tripId: string, userId?: string) => {

    const queryClient = useQueryClient();
    return useMutation<Good, Error, Good>({
        mutationFn: (data) => putGood(tripId, data, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    });
}

const checkGood = async (tripId: string, goodId: any, userId?: string) => {
    const response = await axios.put(`/v2/trips/${tripId}/goods/${goodId}/checked`, {}, {
        headers: {
            ...(userId && { "x-user-id": userId })
        }
    });
    return response.data;
}

export const useCheckGood = (tripId: string, userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<Good, Error, Good>({
        mutationFn: (good) => checkGood(tripId, good._id, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    })
}

const checkAllGoods = async (tripId: string, userId: string, createdBy?: string, event?: string) => {
    const response = await axios.put(`/trips/${tripId}/goods/checked`, {
        createdBy,
        event
    }, {
        headers: {
            "x-user-id": userId
        }
    });
    return response.data;
}

export const useCheckAllGoods = (tripId: string, userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { createdBy?: string, event?: string }) => 
            checkAllGoods(tripId, userId, params.createdBy, params.event),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    });
}

const deleteGood = async (tripId: string, goodId: any, userId?: string) => {
    const response = await axios.delete(`/v2/trips/${tripId}/goods/${goodId}`, {
        headers: {
            ...(userId && { "x-user-id": userId })
        }
    });
    return response.data;
}

export const useDeleteGood = (tripId: string, userId?: string) => {
    const queryClient = useQueryClient();

    return useMutation<Good, Error, Good>({
        mutationFn: (data) => deleteGood(tripId, data._id, userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    });
}
