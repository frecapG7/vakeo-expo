import { Stack } from "expo-router";



export default function PollDetailsLayout() {

    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
        </Stack>
    )
}