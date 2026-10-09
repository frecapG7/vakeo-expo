import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";

export default function EventDetailsLayout() {

    const { id, eventId } = useLocalSearchParams();

    const { trip } = useTrip();
    const glass = useGlassHeaderOptions();
    const router = useRouter();

    return (

        <Stack screenOptions={{
            ...glass
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
                        <IconSymbol name="arrow.left" />
                    </Button>,
                    // Le header porte le contexte (le trip) ; l'identité de l'event vit dans le héro.
                    headerTitle: trip?.name ?? "",
                    headerRight: () => <Button onPress={() => router.push({
                        pathname: "/[id]/events/[eventId]/edit",
                        params: {
                            id: String(id),
                            eventId: String(eventId)
                        }
                    })}>
                        <Text className="text-amber-deep dark:text-amber font-semibold">
                            Modifier
                        </Text>
                    </Button>
                }}
            />
            <Stack.Screen name="edit"
                options={{
                    title: "Modifier l'activité",
                    headerBackTitle: "Annuler"
                }}
            />
            <Stack.Screen name="edit-users"
                options={{
                    title: "Participants",
                    headerBackTitle: "Annuler"
                }}
            />
        </Stack>
    )
}
