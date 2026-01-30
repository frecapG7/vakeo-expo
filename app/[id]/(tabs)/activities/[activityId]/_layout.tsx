import { EventIcon } from "@/components/events/EventIcon";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetEvent } from "@/hooks/api/useEvents";
import useColors from "@/hooks/styles/useColors";
import { toLabel } from "@/lib/eventUtils";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";


export default function TripActivityDetailLayout() {

    const { id, activityId } = useLocalSearchParams();

    const { data: activity } = useGetEvent(id, activityId);

    const router = useRouter();

    const colors = useColors();

    return (
        <Stack screenOptions={{
            headerShown: true,
            title: activity?.name,
            headerTitleStyle: styles.headerSubTitle,
            headerStyle: {
                backgroundColor: colors.background,
            },
            headerShadowVisible: false,
            headerTitleAlign: "left",
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
                </Pressable>,

        }}>
            <Stack.Screen name="index" options={{
                headerTitle: ({ children }) =>
                    <View className="flex-row items-center justify-start gap-1">
                        <EventIcon name={activity?.type} size="md" />
                        <View>
                            <Text className="text-lg dark:text-white font-bold shadow">{children}</Text>
                            <Text className="dark:text-white italic capitalize">{toLabel(activity)}</Text>
                        </View>
                    </View>,

            }} />

            <Stack.Screen name="edit" options={{
                presentation: "modal",
                headerTitle: "Modifier",
                title: `Modifier (${activity?.name})`,
            }}
            />
            <Stack.Screen name="goods" options={{
                title: "La liste"
            }} />
        </Stack>
    )
}