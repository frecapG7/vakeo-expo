import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface TripUser {
    _id: string;
    name?: string;
    username?: string;
    colorHex?: string;
}

export interface AvailabilityRange {
    startDate: string;
    endDate: string;
}

export interface Availability {
    _id: string;
    user: TripUser;
    ranges: AvailabilityRange[];
}

let MOCK_DATABASE: Record<string, Availability> = {
    "mock_1": {
        _id: "mock_1",
        user: { _id: "pote_1", name: "Alice" },
        ranges: [{ startDate: "2026-06-14", endDate: "2026-06-20" }]
    },
    "mock_2": {
        _id: "mock_2",
        user: { _id: "pote_2", name: "Bob" },
        ranges: [{ startDate: "2026-06-15", endDate: "2026-06-18" }]
    },
    "mock_3": {
        _id: "mock_3",
        user: { _id: "pote_3", name: "Charlie" },
        ranges: [{ startDate: "2026-06-16", endDate: "2026-06-19" }]
    }
};

export const useGetAvailability = (tripId: string) => {
    return useQuery({
        queryKey: ["availability", tripId],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return Object.values(MOCK_DATABASE);
        }
    });
};

export const useUpdateAvailability = (tripId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Availability) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            MOCK_DATABASE[data.user._id] = data; 
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["availability", tripId] });
        }
    });
};