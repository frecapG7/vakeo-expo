import LinkForm from "@/components/links/LinkForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostLink } from "@/hooks/api/useLinks";
import { Link } from "@/types/models";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";




export default function NewLink() {


    const {trip, me} = useContext(TripContext);
    const { control, handleSubmit } = useForm<Omit<Link, '_id'>>();


    const router = useRouter();

    const postLink = usePostLink(trip?._id, me?._id);

    const onSubmit = async (data: Omit<Link, '_id'>) => {
        await postLink.mutateAsync(data);
        router.dismissTo({
            pathname: "/[id]/links",
            params: {
                id: trip._id
            }
        })
    };

    return (
        <View style={styles.container}>
            <View className="m-4">
                <LinkForm control={control} />
                <View className="mt-6">
                    <Button
                        title="Ajouter"
                        onPress={handleSubmit(onSubmit)}
                        // isLoading={isPending}
                        variant="contained"
                        className="w-full"
                    />
                </View>

            </View>
        </View>
    )
}