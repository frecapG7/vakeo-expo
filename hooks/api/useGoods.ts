import axios from "@/lib/axios";
import { Good } from "@/types/models";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface IParams {
    cursor: string,
    limit: number,
    type?: string
}

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    goods: Good[]
}

const getGoods = async (tripId: any, params: IParams): Promise<IPage> => {
    const response = await axios.get(`/trips/${tripId}/goods`, {
        params
    })
    return response.data;
}


export const useGetGoods = (tripId: any, params: any, options?: any) => {
    return useInfiniteQuery<IPage, Error>({
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


const postGood = async (tripId: any, good: Good) => {
    const response = await axios.post(`/trips/${tripId}/goods`, good);
    return response.data
}

export const usePostGood = (tripId: any) => {
    const queryClient = useQueryClient();
    return useMutation<Good, Error, Good>({
        mutationFn: (data) => postGood(tripId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    });
}

const putGood = async (tripId: any, data: Good) => {
    const response = await axios.put(`/trips/${tripId}/goods/${data._id}`, data);
    return response.data;
}
export const usePutGood = (tripId: any) => {

    const queryClient = useQueryClient();
    return useMutation<Good, Error, Good>({
        mutationFn: (data) => putGood(tripId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    });
}

const checkGood = async (tripId: any, goodId: any) => {
    const response = await axios.put(`/trips/${tripId}/goods/${goodId}/checked`);
    return response.data;
}

export const useCheckGood = (tripId: any) => {
    const queryClient = useQueryClient();
    return useMutation<Good, Error, Good>({
        mutationFn: (good) => checkGood(tripId, good._id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    })
}

const deleteGood = async (tripId: any, goodId: any) => {
    const response = await axios.delete(`/trips/${tripId}/goods/${goodId}`);
    return response.data;
}

export const useDeleteGood = (tripId: any) => {
    const queryClient = useQueryClient();

    return useMutation<Good, Error, Good>({
        mutationFn: (data) => deleteGood(tripId, data._id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "goods"] })
    });
}



// DEPRECATED AREA BELOW




const getCount = async (tripId, params) => {
    const response = await axios.get(`/trips/${tripId}/goods/count`, {
        params
    });
    return response.data;
}

export const useGetGoodsCount = (tripId, params) => {
    return useQuery({
        queryKey: ["trips", tripId, "goods", "count", params],
        queryFn: () => getCount(tripId, params),
        enabled: !!tripId
    })
}




interface IGoodSummary {
    totalCount: number,
    checkedCount: number,
    goods: Good[]
}


const getGoodSummary = async (tripId: string, event?: string): Promise<IGoodSummary> => {
    const response = await axios.get(`/trips/${tripId}/goods/summary`, {
        params: {
            ...(event && { event })
        }
    });
    return response.data;
}


export const useGetGoodSummary = (tripId: string, event?: string) => {
    return useQuery<IGoodSummary>({
        queryKey: ["trips", tripId, ...(event ? ["event", event] : [])],
        queryFn: () => getGoodSummary(tripId, event)
    });

}