import { EventForm, EventFormValues } from "@/components/events/EventForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import Animated from "react-native-reanimated";
import { Toast } from "toastify-react-native";



export default function EditTripActivity() {

    const { id, activityId } = useLocalSearchParams();


    const { data: trip } = useGetTrip(String(id));
    const { data: activity } = useGetEvent(id, activityId);
    const updateEvent = useUpdateEvent(id, activityId);

    const router = useRouter();

    const { control, reset, handleSubmit } = useForm<EventFormValues>();


    const onSubmit = async (data: any) => {
        await updateEvent.mutateAsync({
            ...data,
            attendees: data.attendees.filter(attendee => attendee.checked)
        });
        Toast.success("Activité modifiée");
        router.dismissTo("..");

    }

    useEffect(() => {
        if (activity)
            reset({
                ...activity,
                attendees: trip?.users.map((user) => ({
                    ...user,
                    checked: activity?.attendees.map(o => o._id).includes(user._id)
                }))
            });
    }, [activity, trip]);

    return (
            <Animated.ScrollView style={{ flex: 1 }} className="flex flex-grow">
                <EventForm control={control} />

                  <Button className="flex-row bg-blue-600 items-center justify-center rounded-full p-4 my-5"
                                onPress={handleSubmit(onSubmit)}
                                isLoading={updateEvent.isPending}>
                                <IconSymbol name="pencil" color="white" />
                                <Text className="text-white font-bold text-xl">Modifier</Text>
                            </Button>
            </Animated.ScrollView>
    )
}