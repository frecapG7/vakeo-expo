import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetActivity } from "@/hooks/api/useActivities";
import { Stack, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Pressable } from "react-native";


export default function TripActivitiesLayout() {

    const router = useRouter();
    const { id, activityId } = useLocalSearchParams();

    const { data: activity } = useGetActivity(String(id), String(activityId));

    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTitle: "Activités",
            headerRight: () => <Pressable onPress={() => router.push(`/trips/${id}/activities/new`)}>
                <IconSymbol name="plus.circle" size={24} color="black" />
            </Pressable>,

        }}>
            <Stack.Screen
                name="index"
            />
            <Stack.Screen
                name="[activityId]"

            />
            <Stack.Screen
                name="new"
                options={{
                    headerRight: () => <></>
                }} />
        </Stack >
    );
}
