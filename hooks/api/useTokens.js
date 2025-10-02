import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";


const verifyToken = async (token) => {
    const response = await axios.post("/token/verify", {
        token
    });

    return response?.data;
}



export const useVerifyToken = () => {
    return useMutation({
        mutationFn: verifyToken,
    });
}


const getToken = async (token) => {
    const response = await axios.get(`/token/${token}`);
    return response.data;
}


export const useGetToken = (token, options) => {
    return useQuery({
        queryKey: ["token", token],
        queryFn: () => getToken(token),
        ...options
    });
}