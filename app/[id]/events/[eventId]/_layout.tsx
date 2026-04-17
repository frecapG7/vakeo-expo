import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";



export default function EventDetailsLayout() {


    const { id, eventId } = useLocalSearchParams();

    const {text} = useColors();
    const router = useRouter();

    return (

        <Stack screenOptions={{
        }}>
            <Stack.Screen name="index"
                options={{
                    headerShown: true,
                    headerLeft: () => <Button onPress={() => router.dismissTo({
                        pathname: "/[id]/(tabs)/planning",
                        params: {
                            id: String(id)
                        }
                    })}>
                        <IconSymbol name="arrow.left" color={text} />
                    </Button>,
                    title: ""
                }}
            />
            <Stack.Screen name="edit"
                options={{
                    presentation: "modal",
                    title: "Modifier"
                }} />
        </Stack>
    )
}