import { EventInfoForm } from "@/components/events/EventInfoForm";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { useDeleteEvent, useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { Event } from "@/types/models";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Text } from "react-native";
import { useForm } from "react-hook-form";
import Animated, { ZoomIn } from "react-native-reanimated";
import { Toast } from "toastify-react-native";



export default function EditTripEvent() {

    const { id, eventId } = useLocalSearchParams();


    const { data: event } = useGetEvent(id, eventId);
    const updateEvent = useUpdateEvent(id, eventId);
    const deleteEvent = useDeleteEvent(id, eventId);

    const onDelete = () => {
        Alert.alert("Supprimer cette activité ?", "Cette action est définitive.", [
            {
                text: "Annuler",
            },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                    if (deleteEvent.isPending) return;
                    await deleteEvent.mutateAsync();
                    Toast.success("Activité supprimée");
                    router.dismissTo({
                        pathname: "/[id]/(tabs)/planning",
                        params: { id: String(id) }
                    });
                }
            }
        ]);
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={onDelete} disabled={deleteEvent.isPending} className="ml-4">
                    <Text className="text-danger font-semibold">Supprimer</Text>
                </Button>
            )
        })
    })

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

    return (
        <Screen className="bg-mist dark:bg-ink">
            <Animated.ScrollView style={{ flex: 1 }} className="flex flex-grow">
                <EventInfoForm control={control} />

                    <Animated.View entering={ZoomIn}
                        className="my-10 mx-6">
                        <Button
                            variant="contained"
                            title="Modifier"
                            onPress={handleSubmit(onSubmit)}
                            isLoading={updateEvent.isPending} />
                    </Animated.View>
            </Animated.ScrollView>
        </Screen>
    )
}
