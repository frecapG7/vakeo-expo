import { EventInfoForm } from "@/components/events/EventInfoForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { Event } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";



export default function EditTripEvent() {

    const { id, eventId } = useLocalSearchParams();


    const { data: trip } = useGetTrip(String(id));
    const { data: event } = useGetEvent(id, eventId);
    const updateEvent = useUpdateEvent(id, eventId);

    const router = useRouter();

    const { control, reset, handleSubmit, formState: { isDirty } } = useForm<Event>({
        reValidateMode: "onChange"
    });

    const onSubmit = async (data: any) => {
        await updateEvent.mutateAsync(data);
        Toast.success("Activité modifiée");
        router.dismissTo({
            pathname: "/[id]/events/[eventId]",
            params: {
                id: String(id),
                eventId: String(event?._id)
            }
        });
    }

    useEffect(() => {
        if (event)
            reset(event);
    }, [event]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView style={{ flex: 1 }} className="flex flex-grow">
                <EventInfoForm control={control} />

                {isDirty &&
                    <Animated.View entering={ZoomIn}
                        className="my-10">
                        <Button
                            variant="contained"
                            title="Modifier"
                            onPress={handleSubmit(onSubmit)}
                            isLoading={updateEvent.isPending} />
                    </Animated.View>
                }
            </Animated.ScrollView>
        </SafeAreaView>
    )
}