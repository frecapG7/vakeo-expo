import styles from "@/constants/Styles";
import { useGetEvent } from "@/hooks/api/useEvents";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";


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
                title:""
            }} />

            <Stack.Screen name="edit" options={{
                presentation: "modal",
                headerTitle: activity?.name,
                title: "Modifier",
            }}
            />
            <Stack.Screen name="goods" options={{
                title: "Le panier"
            }} />
        </Stack>
    )
}