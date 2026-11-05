import { v3Path } from "@/lib/api-v3";
import axios from "@/lib/axios";
import { Location } from "@/types/models";
import { useQuery } from "@tanstack/react-query";


const postGeocode = async (address: string): Promise<Location> => {
    const response = await axios.post(v3Path("/geocode"), { address });
    return response.data;
}

/**
 * Geocoding v3 branche sur un service facture : la requete ne part QUE sur
 * `refetch()` (declenche par la loupe), jamais au fil de la saisie.
 * - `enabled: false` : aucune requete automatique (montage, focus, changement de cle).
 * - `staleTime: Infinity` : une adresse deja resolue sert le cache sans nouveau appel.
 * - `retry: false` : pas de rafale sur une adresse introuvable.
 * L'adresse est trimmee pour dedupliquer les variantes avec espaces superflus.
 */
export const useGeocode = (address: string) => {
    const trimmed = address.trim();
    return useQuery<Location>({
        queryKey: ["geocode", trimmed],
        queryFn: () => postGeocode(trimmed),
        enabled: false,
        staleTime: Infinity,
        retry: false
    });
}
