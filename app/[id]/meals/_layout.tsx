import { Button } from "@/components/ui/Button";
import { useStyles } from "@/hooks/styles/useStyles";
import { Stack, useRouter } from "expo-router";

export default function TripMealsLayout() {


    const router = useRouter();

    const { header } = useStyles();

    return (
        <Stack screenOptions={{
            title: "Les repas",
            headerShown: true,
            headerStyle: {
                backgroundColor: header.backgroundColor
            },
            // backgroundColor: '#f4511e',
            headerTintColor: header.tintColor,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }} >
            <Stack.Screen name="index" options={{
                headerRight: () =>
                    <Button onPress={() => router.push("./meals/new")} title="Ajouter un repas" />
            }} />
            <Stack.Screen name="new" options={{
                title: "Nouveau repas",
                presentation: "modal",
            }} />
        </Stack>

    )
}