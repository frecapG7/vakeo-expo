import { Stack } from "expo-router";

export default function TripsLayout() {

    return (
        <Stack >
            <Stack.Screen name="new" options={{
                headerTitle: "Ajouter un projet",
                headerShown: true,
            }} />
            <Stack.Screen name="[id]" options={{
                headerTitle: "Détails du projet",
                headerShown: false
            }} />
        </Stack>
    )
}