import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { TripContext } from "@/context/TripContext";
import { Stack } from "expo-router";
import { useContext } from "react";


export default function SettingsLayout() {

    const { trip } = useContext(TripContext);

    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTitle: "Mon profil",
            headerTintColor: "white",
            headerBackground: () => trip && <BackgroundHeader trip={trip} />
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="username" options={{
                headerTitle: "Modifier nom"
            }} />
            <Stack.Screen name="avatar" options={{
                headerTitle: "Modifier avatar"
            }} />
        </Stack>
    )
}