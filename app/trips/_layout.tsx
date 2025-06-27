import { useStyles } from "@/hooks/styles/useStyles";
import { Stack } from "expo-router";

export default function TripsLayout() {


    const { header } = useStyles();

    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: header?.backgroundColor,
            },
            headerTintColor: header?.tintColor,
            headerTitleStyle: {
                fontWeight: "bold",
            },
            headerShadowVisible: false,
            animation: "fade_from_bottom",
        }}>
            <Stack.Screen name="new" options={{
                headerTitle: "Ajouter un projet",
                headerShown: true,
            }} />
            <Stack.Screen name="[id]" options={{
                headerTitle: "",
                headerShown: true
            }} />
        </Stack>
    )
}