import LinkForm, { type LinkFormValues } from "@/components/links/LinkForm";
import { Button } from "@/components/ui/Button";
import { useTrip } from "@/context/TripContext";
import { usePostLink } from "@/hooks/api/useLinks";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { View } from "react-native";




export default function NewLink() {

    const { trip } = useTrip();
    const { control, handleSubmit } = useForm<LinkFormValues>();

    const router = useRouter();

    const postLink = usePostLink(trip?._id);

    const onSubmit = async (data: LinkFormValues) => {
        await postLink.mutateAsync(data);
        router.dismissTo({
            pathname: "/[id]/links",
            params: {
                id: trip._id
            }
        })
    };

    return (
        <View className="flex-1 bg-mist dark:bg-ink">
            <View className="m-4">
                <LinkForm control={control} />
                <View className="mt-6">
                    <Button
                        title="Ajouter"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={postLink.isPending}
                        variant="contained"
                        className="w-full"
                    />
                </View>

            </View>
        </View>
    )
}
