import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetEvent } from "@/hooks/api/useEvents";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { View } from "react-native";



export default function TripActivityDetailLayout() {



    const { id, activityId } = useLocalSearchParams();


    const { data: activity } = useGetEvent(id, activityId);

    const router = useRouter();


    const colors = useColors();

    const navigation = useNavigation();


    // useEffect(() => {

    //     navigation.setOptions({
    //         title: activity?.name,

    //     })
    // }, [navigation, activity]);


    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="index" options={{
                title: activity?.name,
                headerShadowVisible: false,
                headerRight: () => (
                    <View>
                        <Button onPress={() => router.push({
                            pathname: "/[id]/(tabs)/activities/[activityId]/edit",
                            params: { id, activityId }
                        })}
                            className="rounded-full p-2 bg-blue-400">
                            <IconSymbol name="pencil" />
                        </Button>
                    </View>
                )
            }} />

            <Stack.Screen name="edit" options={{
                presentation: "modal",
                title: "Modifier"
            }} />
        </Stack>
    )
}