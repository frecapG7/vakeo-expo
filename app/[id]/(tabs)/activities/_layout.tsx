import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetTrip } from "@/hooks/api/useTrips";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function TripEventsLayout() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);

    const router = useRouter();

    return (
        <Stack screenOptions={{
            headerShown: true
        }}>
            <Stack.Screen name="index" options={{
                headerShown: false,
                title: "Activités",
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerRight: () =>

                    <Pressable
                        onPressOut={() =>
                            router.push({
                                pathname: "/[id]/(tabs)/activities/new",
                                params: { id: String(id) }
                            })

                        }
                        className="bg-gray-800 rounded-full p-2 mx-2 z-1000">
                        <IconSymbol name="plus" color="white" />
                    </Pressable>,
                headerBackground: () => <BackgroundHeader trip={trip} />,
            }} />
            <Stack.Screen name="new" options={{
                title: "Nouvelle activité",
                headerBackTitle: "Annuler",
                presentation: "modal",
                headerShown: true,
            }} />
            <Stack.Screen name="[activityId]" options={{
                headerShown: false,
                title: "",
            }} />
        </Stack >
    )
}