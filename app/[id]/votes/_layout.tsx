import { Stack } from "expo-router";



export default function TripVotesLayout() {

    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[voteId]" />
        </Stack>
    )
}