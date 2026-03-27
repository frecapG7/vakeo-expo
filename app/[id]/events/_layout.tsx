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
                    headerShown: true,
                    title: "Nouvelle activité"
                }}
            />
        </Stack>
    )
}