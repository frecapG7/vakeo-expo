import axios from "@/lib/axios";
import { Poll } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface IParams {
    cursor: string,
    limit: number,
}

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    poll: Poll[]
}



const postPoll = async (tripId: any, data: Omit<Poll, '_id'>): Promise<Poll> => {

    const response = await axios.post(`/trips/${tripId}/polls`, data);
    return response.data;
}

export const usePostPoll = (tripId: any) => {
    const queryClient = useQueryClient();
    return useMutation<Poll, Error, Omit<Poll, '_id'>>({
        mutationFn: (data) => postPoll(tripId, data),
        onSuccess: (data: Poll) => queryClient.invalidateQueries({ queryKey: ["trips", tripId] })
            .then(() => queryClient.setQueryData(["trips", tripId, "polls", data._id], data))
    })
}



const getPolls = async (tripId: any) => {
    const response = await axios.get(`/trips/${tripId}/polls`, {
        params: {
            limit: 25
        }
    });
    return response.data;
}

export const useGetPolls = (tripId: any) => {

    return useQuery<IPage, Error>({
        queryKey: ["trips", tripId, "polls"],
        queryFn: () => getPolls(tripId)
    });
}


const getPoll = async (tripId: any, pollId: any): Promise<Poll> => {
    const response = await axios.get(`/trips/${tripId}/polls/${pollId}`);
    return response.data;
}


export const useGetPoll = (tripId: any, pollId: any) => {
    return useQuery({
        queryKey: ["trips", tripId, "polls", pollId],
        queryFn: () => getPoll(tripId, pollId),
        enabled: !!tripId && !!pollId
    });
}



const votePoll = async (tripId: any, pollId: any, data: any): Promise<Poll> => {

    const response = await axios.patch(`/trips/${tripId}/polls/${pollId}/vote`, data);
    return response.data;

}


export const useVotePoll = (tripId: any, pollId: any) => {
    const queryClient = useQueryClient();
    return useMutation<Poll, Error, any>({
        mutationFn: (data) => votePoll(tripId, pollId, data),
        onSuccess: (data) => queryClient.setQueryData(["trips", tripId, "polls", pollId], data)
    });
}

const unvotePoll = async (tripId: any, pollId: any, optionId: any, userId: any): Promise<Poll> => {
    const response = await axios.delete(`/trips/${tripId}/polls/${pollId}/vote/${optionId}`, {
        headers: {
            "x-user-id": userId
        }
    });
    return response.data;
}


export const useUnvotePoll = (tripId: any, pollId: any) => {
    const queryClient = useQueryClient();
    return useMutation<Poll, Error, any>({
        mutationFn: ({ option, user }) => unvotePoll(tripId, pollId, option, user?._id),
        onSuccess: (data) => queryClient.setQueryData(["trips", tripId, "polls", pollId], data)
    });
}
