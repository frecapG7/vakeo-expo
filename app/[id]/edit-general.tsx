import { TripInfoForm } from "@/components/trips/TripInfoForm";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { useTrip } from "@/context/TripContext";
import { useUpdateTrip } from "@/hooks/api/useTrips";
import { Trip } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Toast } from "toastify-react-native";

export default function EditTripGeneral() {

    const { id } = useLocalSearchParams();

    const { trip } = useTrip();
    const updateTrip = useUpdateTrip(id);


    const { control, reset, handleSubmit } = useForm<Trip>();

    const router = useRouter();

    useEffect(() => {
        if (trip)
            reset(trip);
    }, [reset, trip]);

    const onSubmit = async (data: Trip) => {
        if(!trip) return;
        await updateTrip.mutateAsync(data);
        Toast.success("Voyage modifié");
        router.dismissTo({
            pathname: "/[id]/(tabs)",
            params: {
                id: trip._id
            }
        })
    }

    return (
        <Screen className="flex-1 bg-mist dark:bg-ink">
            <Animated.ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="px-4 py-5">
                <TripInfoForm control={control} />

                <Animated.View
                    entering={ZoomIn}
                    className="mt-5">
                    <Button
                        variant="contained"
                        title="Modifier"
                        onPress={handleSubmit(onSubmit)} />
                </Animated.View>
            </Animated.ScrollView>
        </Screen>
    )
}
