import { IconSymbol } from "@/components/ui/IconSymbol";
import { useStyles } from "@/hooks/styles/useStyles";
import { Stack, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Pressable } from "react-native";


export default function TripActivitiesLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { header } = useStyles();

    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTitle: "Activités",
            headerRight: () => <Pressable onPress={() => router.push(`/trips/${id}/activities/new`)}>
                <IconSymbol name="plus.circle" size={24} color="black" />
            </Pressable>,
            headerStyle: {
                backgroundColor: header.backgroundColor
            },
            // backgroundColor: '#f4511e',
            headerTintColor: header.tintColor,
            headerTitleStyle: {
                fontWeight: 'bold',
            },

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
