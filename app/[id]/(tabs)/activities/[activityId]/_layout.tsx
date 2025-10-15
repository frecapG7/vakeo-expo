import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetEvent } from "@/hooks/api/useEvents";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";



export default function TripActivityDetailLayout() {



    const { id, activityId } = useLocalSearchParams();


    const { data: activity } = useGetEvent(id, activityId);

    const router = useRouter();


    return (
        <Stack>
            <Stack.Screen name="index" options={{
                title: activity?.name,
                headerRight: () => (
                    <View>
                        <Button onPress={() => router.push({
                            pathname: "/[id]/(tabs)/activities/[activityId]/edit",
                            params: { id, activityId }
                        })}
                            className="rounded-full p-2 bg-blue-200">
                            <IconSymbol name="pencil" />
                        </Button>
                    </View>
                )
            }} />

            <Stack.Screen name="edit" options={{
                presentation: "modal",
                title: "Modifier"
            }}/>
        </Stack>
    )
}