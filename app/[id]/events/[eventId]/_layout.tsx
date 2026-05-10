import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function EventDetailsLayout() {

    const { id, eventId } = useLocalSearchParams();

    const { data: event } = useGetEvent(id, eventId)
    const { data: trip } = useGetTrip(id)
    const { text } = useColors();
    const router = useRouter();

    return (

        <Stack screenOptions={{
        }}>
            <Stack.Screen name="index"
                options={{
                    headerShown: true,
                    headerLeft: () => <Button onPress={() => router.dismissTo({
                        pathname: "/[id]/(tabs)/planning",
                        params: {
                            id: String(id)
                        }
                    })}>
                        <IconSymbol name="arrow.left" color={text} />
                    </Button>,
                    headerTitle: () => <View className="items-center justify-center">
                        <Text className="font-bold text-lg dark:text-white" numberOfLines={1}>{event?.name}</Text>
                        <Text className="text-sm italic text-gray-400 dark:text-gray-200" numberOfLines={1}>{trip?.name}</Text>
                    </View>,
                    headerRight: () => <Button onPress={() => router.push({
                        pathname: "/[id]/events/[eventId]/edit",
                        params: {
                            id: String(id),
                            eventId: String(eventId)
                        }
                    })}>
                        <Text className="text-blue-400">
                            Modifier
                        </Text>
                    </Button>
                }}
            />
            <Stack.Screen name="edit"
                options={{
                    presentation: "modal",
                    title: "Modifier"
                }} />
            <Stack.Screen name="edit-users"
                options={{
                    presentation: "modal",
                    title: "Modifier"
                }} />
        </Stack>
    )
}