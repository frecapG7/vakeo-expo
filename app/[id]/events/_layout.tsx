import { Stack } from "expo-router";




export default function EventsLayout() {



    return (
        <Stack>
            <Stack.Screen name="[eventId]"
                options={{
                    headerShown: false
                }} />
            <Stack.Screen name="new"
                options={{
                    headerShown: false,
                    title: "Nouvelle activité"
                }}
            />
        </Stack>
    )
}