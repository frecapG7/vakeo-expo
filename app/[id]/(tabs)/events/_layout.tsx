import { Stack } from "expo-router";




export default function TripEventsLayout() {


    return (
        <Stack >
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="new" options={{
                title: "Nouvelle activité",
                headerBackTitle: "Annuler",
                presentation: "modal"
            }} />
        </Stack>
    )
}