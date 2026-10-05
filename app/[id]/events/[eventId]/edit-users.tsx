import { EventsUsersForm } from "@/components/events/EventUsersForm";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTrip } from "@/context/TripContext";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { Event } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { Toast } from "toastify-react-native";

export default function EditEventUsers() {


    const { id, eventId } = useLocalSearchParams<{ id: string, eventId: string }>();

    const { trip, me } = useTrip();
    const { data: event } = useGetEvent(id, eventId);
    const updateEvent = useUpdateEvent(id, eventId);

    const router = useRouter();

    const { control, reset, handleSubmit } = useForm<Event>({
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


    if (!trip)
        return (
            <Screen className="bg-mist dark:bg-ink">
                <View className="flex flex-1 gap-2 p-4 my-10">
                    <Skeleton height={60} />
                </View>
            </Screen>

        )
    return (
        <Screen className="bg-mist dark:bg-ink">
            <Animated.ScrollView style={{
                flex: 1,
            }}>
                <View>
                    <EventsUsersForm trip={trip} me={me} control={control} />
                </View>
                <View className="my-2 px-4">
                    <Button variant="contained"
                        title="Enregistrer"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={updateEvent.isPending}
                    />
                </View>
            </Animated.ScrollView>
        </Screen>
    )
}
