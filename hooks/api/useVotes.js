import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const postVote = async (tripId, vote) => {
    const response = await axios.post(`/trips/${tripId}/votes`, vote);
    return response.data;
}

export const usePostVote = (tripId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vote) => postVote(tripId, vote),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["trips", tripId]).then(() =>
                queryClient.setQueryData(["trips", tripId, "votes", data._id], data)
            )
        }
    })
}


const getVotes = async (tripId, params) => {
    const response = await axios.get(`/trips/${tripId}/votes`, {
        params
    });
    return response.data;
}



export const useGetVotes = (tripId, params) => {
    return useQuery({
        queryKey: ["trips", tripId, "votes", params],
        queryFn: () => getVotes(tripId, params),
        enabled: !!tripId
    });
}

const getVote = async (tripId, voteId) => {
    const response = await axios.get(`/trips/${tripId}/votes/${voteId}`);
    return response.data;
}

export const useGetVote = (tripId, voteId) => {
    return useQuery({
        queryKey: ["trips", tripId, "votes", voteId],
        queryFn: () => getVote(tripId, voteId),
        enabled: (!!tripId && !!voteId)
    });
}



const putVote = async (tripId, voteId, vote) => {
    const response = await axios.put(`/trips/${tripId}/votes/${voteId}`, vote);
    return response.data;
}


export const usePutVote = (tripId, voteId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => putVote(tripId, voteId, data),
        onSuccess: (data) => queryClient.invalidateQueries(["trips", tripId, "votes"])
            .then(() =>
                queryClient.setQueryData(["trips", tripId, "votes", voteId], data)
            )
    });
}


const closeVote = async (tripId, voteId, user) => {
    const response = await axios.put(`/trips/${tripId}/votes/${voteId}/close`,
        {},
        {
            params: {
                user
            }
        });
    return response.data;
}


export const useCloseVote = (tripId, voteId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => closeVote(tripId, voteId, data),
        onSuccess: () => queryClient.invalidateQueries(["trips", tripId, "votes"])
    });

}