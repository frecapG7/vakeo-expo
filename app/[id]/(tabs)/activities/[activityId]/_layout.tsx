import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { toIcon } from "@/lib/eventUtils";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";


export default function TripActivityDetailLayout() {

    const { id, activityId } = useLocalSearchParams();

    const { data: trip } = useGetTrip(id);
    const { data: activity } = useGetEvent(id, activityId);

    const router = useRouter();

    const colors = useColors();

    return (
        <Stack screenOptions={{
            headerShown: true,
            title: activity?.name,
            // headerTintColor: "white",
            headerTitleStyle: styles.headerSubTitle,
            headerStyle: {
                backgroundColor: colors.background,
            },
            headerShadowVisible: false,
            headerTitleAlign: "left",
            // headerBackground: () => <BackgroundHeader trip={trip} />,
            headerLeft: () =>
                <Pressable onPressOut={() => router.dismissTo({
                    pathname: "/[id]/(tabs)/activities",
                    params: {
                        id: String(id)
                    }
                })} className="mr-2">
                    <IconSymbol name="arrow.left" color={colors.text} />
                </Pressable>,

            headerRight: () =>
                <Pressable onPressOut={() => router.push({
                    pathname: "/[id]/(tabs)/activities/[activityId]/edit",
                    params: {
                        id: String(id),
                        activityId: String(activityId)
                    }
                })}
                    className="bg-gray-800 rounded-full p-2">
                    <IconSymbol name="pencil" size={20} color="white" />
                </Pressable>
        }}>
            <Stack.Screen name="index" options={{
                headerTitle: ({ children }) =>
                    <View className="flex items-start">
                        <View className="rounded-full border p-2 bg-gray-200">
                            <IconSymbol name={toIcon(activity)} size={25} color="black" />
                        </View>
                        <Text className="text-lg dark:text-white font-bold shadow">{children}</Text>
                    </View>,
            }} />

            <Stack.Screen name="edit" options={{
                presentation: "modal",
                title: `Modifier (${activity?.name})`
            }}
            />
            <Stack.Screen name="goods" options={{
                // headerBackground: () => <BackgroundHeader trip={trip} />,
                // headerTintColor: "white",
                // headerTitleStyle: styles.headerTitle,
                title: `La liste (${activity?.name})`
            }} />
        </Stack>
    )
}