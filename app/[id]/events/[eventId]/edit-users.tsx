import { EventsUsersForm } from "@/components/events/EventUsersForm";
import { Button } from "@/components/ui/Button";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { Toast } from "toastify-react-native";

export default function EditEventUsers() {


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
                eventId: String(eventId)
            }
        });
    }

    useEffect(() => {
        if (event)
            reset(event);
    }, [event]);


    return (
        <View>
            <View>
                <EventsUsersForm trip={trip} control={control} />
            </View>

            <View className="my-5">
                <Button variant="contained"
                    title="Modifier"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={updateEvent.isPending}
                />
            </View>
        </View>
    )
}