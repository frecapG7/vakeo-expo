import { EventsUsersForm } from "@/components/events/EventUsersForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { usePostEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";




export default function NewEventUsers() {

    const { id } = useLocalSearchParams();
    const { control, handleSubmit } = useFormContext<Omit<Event, "_id">>();

    const { data: trip } = useGetTrip(id);
    const postEvent = usePostEvent(id);
    const router = useRouter();

    const onSubmit = async (data: Omit<Event, "_id">) => {
        const event = await postEvent.mutateAsync(data);
        router.dismissTo({
            pathname: "/[id]/events/[eventId]",
            params:{
                id: String(id),
                eventId: event._id
            }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView>

                <View className="m-5 gap-2">
                    <Text className="font-bold text-2xl dark:text-white">
                        Ajoute des participants
                    </Text>
                    <Text className="text-gray-400">
                        Ajoute tout de suite tes amis qui participeront à l'activité. Tu n'es pas obligé de faire ça dès maintenant, tes amis
                        pourront également choisir de participer à ton activité.
                    </Text>
                </View>

                <View className="flex">
                    <EventsUsersForm
                        trip={trip}
                        control={control}
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

        </SafeAreaView>
    )
}