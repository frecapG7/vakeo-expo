import { Button } from "@/components/ui/Button";
import { usePostActivity } from "@/hooks/api/useActivities";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Animated from "react-native-reanimated";
import { ActivityForm } from "./components/ActivityForm";



export default function NewActivity() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id)
    const { control, handleSubmit, setValue } = useForm({

    });

    const navigation = useNavigation();

    const router = useRouter();
    const postActivity = usePostActivity(id);

    const onSubmit = async (data: any) => {
        postActivity.mutateAsync({
            ...data,
            users: data.users.filter((user: any) => user.value).map((user: any) => user.id)
        })
        router.navigate(`/trips/${id}/activities`);

        // Here you would typically handle the form submission, e.g., send data to an API
    }
    navigation.setOptions({
        headerTitle: "Nouvelle activité",
        headerBackTitle: "Retour",
        headerRight: () => <Button
            onPress={handleSubmit(onSubmit)}
            title="Terminer"

        />
    });

    useEffect(() => {
        if (trip)
            setValue("users", trip.users.map(user => ({
                id: user.id,
                name: user.name,
                value: true
            })));
    }, [trip, setValue]);



    return (
        <Animated.ScrollView>
            <ActivityForm control={control} />
        </Animated.ScrollView>
    );
}
