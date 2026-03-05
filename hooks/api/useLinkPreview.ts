import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";








const postLinkPreview = async (url: string): Promise<any> => {
    const response = await axios.post("/link-preview", {
        url
    });
    return response.data;

}

export const usePostLinkPreview = () => {
    return useMutation<any, Error, any>({
        mutationFn: (url) => postLinkPreview(url)
    });
}