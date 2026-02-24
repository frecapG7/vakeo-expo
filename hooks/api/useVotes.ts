import axios from "@/lib/axios";
import { DateVote } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface IParams {
    cursor: string,
    limit: number,
}

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    votes: DateVote[]
}

const postVote = async (tripId: any, vote: DateVote) => {
    const response = await axios.post(`/trips/${tripId}/votes`, vote);
    return response.data;
}

export const usePostVote = (tripId: any) => {
    const queryClient = useQueryClient();
    return useMutation<DateVote, Error, Omit<DateVote, '_id'>>({
        mutationFn: (vote) => postVote(tripId, vote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trips", tripId, "votes"] })
        }
    })
}

const getVotes = async (tripId: any, params?: IParams) => {
    const response = await axios.get(`/trips/${tripId}/votes`, {
        params
    });
    return response.data;
}

export const useGetVotes = (tripId: any) => {
    return useQuery<IPage, Error>({
        queryKey: ["trips", tripId, "votes"],
        queryFn: () => getVotes(tripId),
        enabled: !!tripId
    });
}

const getVote = async (tripId: any, voteId: any) => {
    const response = await axios.get(`/trips/${tripId}/votes/${voteId}`);
    return response.data;
}

export const useGetVote = (tripId: any, voteId: any) => {
    return useQuery<DateVote>({
        queryKey: ["trips", tripId, "votes", voteId],
        queryFn: () => getVote(tripId, voteId),
        enabled: (!!tripId && !!voteId)
    });
}

const putVote = async (tripId: any, voteId: any, vote: DateVote) => {
    const response = await axios.put(`/trips/${tripId}/votes/${voteId}`, vote);
    return response.data;
}

export const usePutVote = (tripId: any, voteId: any) => {
    const queryClient = useQueryClient();
    return useMutation<DateVote, Error, DateVote>({
        mutationFn: (data) => putVote(tripId, voteId, data),
        onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "votes"] })
            .then(() =>
                queryClient.setQueryData(["trips", tripId, "votes", voteId], data)
            )
    });
}

const closeVote = async (tripId: any, voteId: any, user: any) => {
    const response = await axios.put(`/trips/${tripId}/votes/${voteId}/close`,
        {},
        {
            params: {
                user
            }
        });
    return response.data;
}

export const useCloseVote = (tripId: any, voteId: any) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => closeVote(tripId, voteId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trips", tripId, "votes"] })
    });

}