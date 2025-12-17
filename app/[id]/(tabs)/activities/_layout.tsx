import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";




export default function TripEventsLayout() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);

    const router = useRouter();
    const colors = useColors();
    return (
        <Stack screenOptions={{
        }}>
            <Stack.Screen name="index" options={{
                headerShown: true,
                title: "Activités",
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerBackground: () => <BackgroundHeader trip={trip} />,
               
                headerRight: () => <Button
                    onPress={() => router.push({
                        pathname: "/[id]/(tabs)/activities/new",
                        params: { id: String(id) }

                    })}
                    className="bg-gray-800 rounded-full p-2">
                    <IconSymbol name="plus" color="white" />
                </Button>
            }} />
            <Stack.Screen name="new" options={{
                title: "Nouvelle activité",
                headerBackTitle: "Annuler",
                presentation: "modal",
                headerShown: true,

            }}
            />
            <Stack.Screen name="[activityId]" options={{
                headerShown: false,
                title: "",
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerShadowVisible: false
            }} />
        </Stack >
    )
}