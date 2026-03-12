import { Stack } from "expo-router";





export default function PollsLayout() {


    return (
        <Stack screenOptions={{
            title: "Sondages",
            headerShadowVisible: false,
            headerShown: false,
        }}>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />

            <Stack.Screen name="new"
                options={{
                    presentation: "modal",
                    title: "Nouveau sondage",
                    headerBackTitle: "Annuler",
                }} />
            <Stack.Screen name="[pollId]"
                options={{
                    headerShown: false
                }} />
        </Stack>
    )
}