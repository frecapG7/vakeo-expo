import { EventForm } from "@/components/events/EventForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";



export default function EditTripActivity() {

    const { id, activityId } = useLocalSearchParams();


    const { data: trip } = useGetTrip(id);
    const { data: activity } = useGetEvent(id, activityId);

    const router = useRouter();


    const { control, reset, handleSubmit } = useForm();


    const navigation = useNavigation();


    const updateEvent = useUpdateEvent(id, activityId);

    const onSubmit = async (data) => {
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
                <Button onPress={handleSubmit(onSubmit)}>
                    <Text className="text-md font-bold dark:text-white">Appliquer</Text>
                </Button>
        })
    })

    useEffect(() => {
        if (activity)
            reset({
                ...activity,
                attendees: trip.users.map((user) => ({
                    ...user,
                    checked: activity?.attendees.map(o => o._id).includes(user._id)
                }))
            });
    }, [activity, trip]);

    return (
        <SafeAreaView style={styles.container}>


            <EventForm control={control} />

        </SafeAreaView>
    )
}