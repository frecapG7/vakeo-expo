import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";



export default function TripActivityDetailLayout() {

    const { id, activityId } = useLocalSearchParams();


    const { data: trip } = useGetTrip(id);
    const { data: activity } = useGetEvent(id, activityId);

    const router = useRouter();

    const colors = useColors();

    const navigation = useNavigation();

    useEffect(() => navigation.setOptions({
        headerRight: () => (
            <View>
                <Button onPress={() => router.push({
                    pathname: "/[id]/(tabs)/activities/[activityId]/edit",
                    params: { id, activityId }
                })}
                    className="rounded-full p-2 bg-blue-400">
                    <IconSymbol name="pencil" color="black" />
                </Button>
            </View>
        )
    }), [activityId, id, navigation]);

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: true,
                title: activity?.name,
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerBackground: () => <BackgroundHeader trip={trip} />,
                headerLeft: () => <Button onPress={() => router.dismissTo({
                    pathname: "/[id]/(tabs)/activities",
                    params: {
                        id: String(id)
                    }
                })}>
                    <IconSymbol name="arrow.left" color="white" />
                </Button>,
                headerTitle: ({ children }) => <View className="flex-row items-center mt-3">
                    <View className="rounded-full border p-2 bg-gray-200">
                        <IconSymbol name="suit.spade" size={34} color="black" />
                    </View>
                    <Text className="text-white text-2xl font-bold shadow">{children}</Text>
                </View>,
                headerRight: () => <Button onPress={() => router.push({
                    pathname: "/[id]/(tabs)/activities/[activityId]/edit",
                    params: {
                        id: String(id),
                        activityId: String(activityId)
                    }
                })}
                    className="bg-gray-800 rounded-full p-2">
                    <IconSymbol name="pencil" size={25} color="white" />
                </Button>
            }}
            />

            <Stack.Screen name="edit" options={{
                presentation: "modal",
                title: "Modifier"
            }}
            />
            <Stack.Screen name="goods" options={{
                headerBackground: () => <BackgroundHeader trip={trip} />,
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                title: `${activity?.name}`
            }} />
        </Stack>
    )
}