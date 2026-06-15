import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// L'interface demandée par ton dev
export interface AvailabilityRange {
    startDate: string;
    endDate: string;
}

export interface Availability {
    userId: string;
    ranges: AvailabilityRange[];
}

// La constante qui sert de fausse base de données (Mock)
let MOCK_DATABASE: Record<string, Availability> = {};

export const useAvailability = (tripId: string) => {
    const queryClient = useQueryClient();

    // Simule la récupération des disponibilités de tous les participants
    const getAvailabilities = useQuery({
        queryKey: ["availability", tripId],
        queryFn: async () => {
            // Faux délai réseau de 300ms
            await new Promise(resolve => setTimeout(resolve, 300));
            return Object.values(MOCK_DATABASE);
        }
    });

    // Simule la sauvegarde des disponibilités d'un utilisateur
    const updateAvailability = useMutation({
        mutationFn: async (data: Availability) => {
            await new Promise(resolve => setTimeout(resolve, 300));
            MOCK_DATABASE[data.userId] = data; // Enregistre dans la constante
            return data;
        },
        onSuccess: () => {
            // Rafraîchit les données visuelles après la sauvegarde
            queryClient.invalidateQueries({ queryKey: ["availability", tripId] });
        }
    });

    return { getAvailabilities, updateAvailability };
};