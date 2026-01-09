import { EventForm, EventFormValues } from "@/components/events/EventForm";
import { Button } from "@/components/ui/Button";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { Toast } from "toastify-react-native";



export default function EditTripActivity() {

    const { id, activityId } = useLocalSearchParams();


    const { data: trip } = useGetTrip(String(id));
    const { data: activity } = useGetEvent(String(id), String(activityId));
    const updateEvent = useUpdateEvent(String(id), String(activityId));

    const router = useRouter();

    const { control, reset, handleSubmit } = useForm<EventFormValues>();

    const navigation = useNavigation();


    const onSubmit = async (data: any) => {
        await updateEvent.mutateAsync({
            ...data,
            attendees: data.attendees.filter(attendee => attendee.checked)
        });
        Toast.success("Activité modifiée");
        router.dismissTo("..");

    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <View className="mx-2">
                    <Button onPress={handleSubmit(onSubmit)} isLoading={updateEvent.isPending}>
                        <Text className="text-md font-bold dark:text-white">Appliquer</Text>
                    </Button>

                </View>
        })
    })

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
            </Animated.ScrollView>
    )
}