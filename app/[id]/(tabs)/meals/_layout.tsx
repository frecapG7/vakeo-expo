import { Stack, useRouter } from "expo-router";

export default function TripMealsLayout() {


    const router = useRouter();
    return (
        <Stack  >
            <Stack.Screen name="index" />
            <Stack.Screen name="new" options={{
                title: "Nouveau repas",
                presentation: "modal",
            }} />
        </Stack>

    )
}