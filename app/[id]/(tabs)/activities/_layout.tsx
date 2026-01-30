import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function TripEventsLayout() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);

    const router = useRouter();

    const colors = useColors();

    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTintColor: colors.text,
            headerTitleStyle: styles.headerSubTitle,
            headerStyle: {
                backgroundColor: colors.background

            },
            // headerBackVisible: false,
            headerShadowVisible: false,

        }}>
            <Stack.Screen name="index" options={{
                headerShown: false,
                title: "Au programme",
                headerRight: () =>
                    <Pressable
                        onPressOut={() =>
                            router.push({
                                pathname: "/[id]/(tabs)/activities/new",
                                params: { id: String(id) }
                            })

                        }
                        className="bg-gray-800 rounded-full p-1 mx-2">
                        <IconSymbol name="plus" color="white" />
                    </Pressable>,
                // headerBackground: () => <BackgroundHeader trip={trip} />,
            }} />
            <Stack.Screen name="new" options={{
                title: "Nouvelle activité",
                headerBackTitle: "Annuler",
                presentation: "modal",
                headerShown: true,
            }} />
            <Stack.Screen name="[activityId]" options={{
                headerShown: false,
            }} />
        </Stack >
    )
}