import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const getLinks = async (id, params) => {
  const response = await axios.get(`/trips/${id}/links`, {
    params,
  });
  return response.data;
};

export const useGetLinks = (id, params) => {
  return useQuery({
    queryKey: ["trips", id, "links", params],
    queryFn: () => getLinks(id, params),
  });
};
