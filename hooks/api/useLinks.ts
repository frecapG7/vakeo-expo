import axios from "@/lib/axios";
import type { Link } from "@/types/models";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";


interface IParams {
  cursor: string,
  limit: number,
}

interface IPage {
  nextCursor: string,
  totalResults: number,
  links: Link[]
}

const getLinks = async (id: string, params?: IParams): Promise<IPage> => {
  const response = await axios.get(`/v2/trips/${id}/links`, {
    params,
  });
  return response.data;
};

export const useGetLinks = (tripId: string) => {

  return useInfiniteQuery<IPage, Error>({
    queryKey: ["trips", tripId, "links"],
    queryFn: ({ pageParam }) => getLinks(tripId, {
      cursor: String(pageParam),
      limit: 25,
    }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!tripId,
  });
};


const postLink = async (tripId: string, data: Omit<Link, '_id'>, userId?: string): Promise<Link> => {
  const response = await axios.post(`/v2/trips/${tripId}/links`, data, {
    headers: {
      ...(userId && { "x-user-id": userId })
    }
  });
  return response.data;
}


export const usePostLink = (tripId: string, userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<Link, Error, Omit<Link, "_id">>({
    mutationFn: (data) => postLink(tripId, data, userId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "links"] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "dashboard"]});
    }
  });
}



const deleteLink = async (tripId: string, linkId: string, userId?: string): Promise<void> => {
  const response = await axios.delete(`/v2/trips/${tripId}/links/${linkId}`, {
    headers: {
      ...(userId && { "x-user-id": userId })
    }
  });
  return response.data;
}

export const useDeleteLink = (tripId: string, userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Link>({
    mutationFn: (data) => deleteLink(tripId, data._id, userId),
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["trips", tripId, "links"]
    })
  })
}