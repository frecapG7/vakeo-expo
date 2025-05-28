import { IconSymbol } from "@/components/ui/IconSymbol";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable } from "react-native";



export default function TripLinksLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: true,
                title: "Liens",
                headerRight: () => <Pressable onPress={() => router.push(`/trips/${id}/links/new`)}>
                    <IconSymbol name="plus.circle" size={25} color="#000" />
                </Pressable>,
            }} />
            <Stack.Screen name="new" options={{
                headerShown: true,
                presentation: "modal",
                title: "Ajouter un lien",
            }} />
        </Stack>
    )
}