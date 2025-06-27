import { Stack } from "expo-router";



export default function TripCalendarLayout() {




    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: false,
                title: "Calendrier",
            }} />
            <Stack.Screen name="add-event" options={{
                presentation: "modal",
                title: "Ajouter un événement",
                headerBackTitle: "Retour",

            }} />
        </Stack>
    )
}