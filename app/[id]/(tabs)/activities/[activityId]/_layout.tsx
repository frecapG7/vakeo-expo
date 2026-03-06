import { EventIcon } from "@/components/events/EventIcon";
import styles from "@/constants/Styles";
import { useGetEvent } from "@/hooks/api/useEvents";
import useColors from "@/hooks/styles/useColors";
import { toLabel } from "@/lib/eventUtils";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";


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


        }}>
            <Stack.Screen name="index" options={{
                headerShown: false,
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
                headerTitle: activity?.name,
                title: activity?.name,
            }}
            />
            <Stack.Screen name="goods" options={{
                title: "La liste"
            }} />
        </Stack>
    )
}