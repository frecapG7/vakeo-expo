import { EventsUsersForm } from "@/components/events/EventUsersForm";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { useTrip } from "@/context/TripContext";
import { usePostEvent } from "@/hooks/api/useEvents";
import { containsUser } from "@/lib/utils";
import { Event } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Control, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";




export default function NewEventUsers() {

    const { id } = useLocalSearchParams();
    const { control, handleSubmit } = useFormContext<Omit<Event, "_id">>();

    const { trip, me } = useTrip();
    const postEvent = usePostEvent(id);
    const router = useRouter();

    const onSubmit = async (data: Omit<Event, "_id">) => {
        // Le créateur est owner par défaut, même s'il ne se coche pas participant.
        const owners = data.owners ?? [];
        const event = await postEvent.mutateAsync(
            me && !containsUser(me, owners) ? { ...data, owners: [me, ...owners] } : data
        );
        router.dismissTo({
            pathname: "/[id]/events/[eventId]",
            params:{
                id: String(id),
                eventId: event._id
            }
        })
    }

    return (
        <Screen className="bg-mist dark:bg-ink">
            <Animated.ScrollView>

                <View className="m-5 gap-2">
                    <Text className="font-bold text-2xl text-night dark:text-white">
                        Ajoute des participants
                    </Text>
                    <Text className="text-gray-400">
                        Ajoute tout de suite tes amis qui participeront à l&apos;activité. Tu n&apos;es pas obligé de faire ça dès maintenant, tes amis
                        pourront également choisir de participer à ton activité.
                    </Text>
                </View>

                <View className="flex">
                    <EventsUsersForm
                        trip={trip}
                        me={me}
                        control={control as unknown as Control<Event>}
                    />
                </View>

                <View className="m-4">
                    <Button variant="contained"
                        size="medium"
                        title="Continuer"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={postEvent.isPending}
                    />
                </View>
            </Animated.ScrollView>

        </Screen>
    )
}
