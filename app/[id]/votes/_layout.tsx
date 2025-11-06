import { Stack } from "expo-router";

export default function TripVotesLayout() {

    return (
        <Stack screenOptions={{
            title: "Votes"
        }}>
            <Stack.Screen name="index"  />
            <Stack.Screen name="[voteId]" options={{
                title: "Voter",
                headerShown: true
            }} />
            <Stack.Screen name="new" options={{
                title: "Nouveau vote",
                headerShown: true
            }} />
        </Stack>
    )
}