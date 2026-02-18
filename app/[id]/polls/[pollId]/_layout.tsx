import { Stack } from "expo-router";



export default function PollDetailsLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
        </Stack>
    )
}