import axios from "@/lib/axios";
import { Poll, PollOption, PollType } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface IParams {
    cursor?: string,
    limit?: number,
    type?: PollType,
    excludeClosed?: boolean,
    excludeSelectedBy?: string
}

interface IPage {
    nextCursor: string,
    prevCursor: string,
    totalResults: number,
    polls: Poll[]
}



const postPoll = async (tripId: any, data: Omit<Poll, '_id'>, userId?: string): Promise<Poll> => {

    const response = await axios.post(`/trips/${tripId}/polls`, data, {
        headers: {
            ...(userId && { 'x-user-id': userId })
        }
    });
    return response.data;
}

export const usePostPoll = (tripId: any, userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<Poll, Error, Omit<Poll, '_id'>>({
        mutationFn: (data) => postPoll(tripId, data, userId),
        onSuccess: (data: Poll) => queryClient.invalidateQueries({ queryKey: ["trips", tripId] })
            .then(() => queryClient.setQueryData(["trips", tripId, "polls", data._id], data))
    })
}

interface UpdatePollPayload {
    newOptions: PollOption[];
}

const updatePoll = async (tripId: string, pollId: string, data: UpdatePollPayload, userId?: string): Promise<Poll> => {
    const response = await axios.put(`/trips/${tripId}/polls/${pollId}`, data, {
        headers: {
            ...(userId && { 'x-user-id': userId })
        }
    });
    return response.data;
}

export const usePutPoll = (tripId: string, pollId: string, userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<Poll, Error, UpdatePollPayload>({
        mutationFn: (data) => updatePoll(tripId, pollId, data, userId),
        onSuccess: async (data: Poll) => {
            // 1. Set the updated poll data (immediate update, no flicker)
            queryClient.setQueryData(
                ["trips", tripId, "polls", pollId],
                data
            );
            // 2. Invalidate tripStops (triggers refetch for related data)
            await queryClient.invalidateQueries({
                queryKey: ["trips", tripId, "stops"]
            });
        }
    })
}



const getPolls = async (tripId: any, params?: IParams) => {
    const response = await axios.get(`/trips/${tripId}/polls`, {
        params: {
            ...params,
            limit: params?.limit || 25
        }
    });
    return response.data;
}

export const useGetPolls = (tripId: any, params?: IParams) => {

    return useQuery<IPage, Error>({
        queryKey: ["trips", tripId, "polls", params],
        queryFn: () => getPolls(tripId, params)
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



const votePoll = async (tripId: any, pollId: any, data: any, userId?: string): Promise<Poll> => {
    const response = await axios.patch(`/trips/${tripId}/polls/${pollId}/vote`, data, {
        headers: {
            "x-user-id": userId
        }
    }
    );
    return response.data;

}


export const useVotePoll = (tripId: string, pollId: string, userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, any>({
        mutationFn: (data) => votePoll(tripId, pollId, data, userId),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ["trips", tripId, "stops"]
            });
            queryClient.setQueryData(["trips", tripId, "polls", pollId], data)
        }
    });
}

const unvotePoll = async (tripId: string, pollId: string, optionId: string, userId?: string): Promise<Poll> => {
    const response = await axios.delete(`/trips/${tripId}/polls/${pollId}/vote/${optionId}`, {
        headers: {
            "x-user-id": userId
        }
    });
    return response.data;
}


export const useUnvotePoll = (tripId: string, pollId: string, userId?: string) => {
    const queryClient = useQueryClient();
    return useMutation<Poll, Error, any>({
        mutationFn: ({ option }) => unvotePoll(tripId, pollId, option, userId),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: ["trips", tripId, "stops"]
            });
            queryClient.setQueryData(["trips", tripId, "polls", pollId], data)
        }
    });
}
