import { v3Path } from "@/lib/api-v3";
import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";








const postLinkPreview = async (url: string): Promise<any> => {
    const response = await axios.post(v3Path("/link-preview"), {
        url
    });
    return response.data;

}

export const usePostLinkPreview = () => {
    return useMutation<any, Error, any>({
        mutationFn: (url) => postLinkPreview(url)
    });
}