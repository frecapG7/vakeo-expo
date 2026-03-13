import { Stack } from "expo-router";


export default function DatesLayout(){




    return (
        <Stack screenOptions={{
            title: "Dates du séjour",
            headerShown: false
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="edit" />
        </Stack>
    )
}