import { EventsUsersForm } from "@/components/events/EventUsersForm";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { Event } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

export default function EditEventUsers() {


    const { id, eventId } = useLocalSearchParams<{ id: string, eventId: string }>();


    const { data: trip } = useGetTrip(id);
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
            <SafeAreaView style={styles.container}>
                <View className="flex flex-1 gap-2 p-4 my-10">
                    <Skeleton height={60} />
                </View>
            </SafeAreaView>

        )
    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView style={{
                flex: 1,
            }}>
                <View>
                    <EventsUsersForm trip={trip} control={control} />
                </View>
                <View className="my-2">
                    <Button variant="contained"
                        title="Modifier"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={updateEvent.isPending}
                    />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}