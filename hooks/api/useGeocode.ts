import axios from "@/lib/axios";
import { Location } from "@/types/models";
import { useQuery } from "@tanstack/react-query";




const getGeocode = async (address: string) : Promise<Location> => {

    const response = await axios.get("/geocode", {
        params: {
            address
        }
    });
    return response.data;
}

export const useGeocode = (address: string, enabled: boolean) => {
    return useQuery<Location>({
        queryFn: () => getGeocode(address),
        queryKey: ["geocode", address],
        enabled
    });
}