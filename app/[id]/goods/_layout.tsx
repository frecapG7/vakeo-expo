import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function GoodsLayout() {

    const { trip } = useContext(TripContext);
    const { title } = useLocalSearchParams<{ title?: string }>();

    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;


    return (
        <View className="flex-1"
            style={{
                paddingBottom: bottomPadding
            }}>
            <Stack screenOptions={{
                headerShown: true,
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerBackground: () => trip && <BackgroundHeader trip={trip} />
            }}>
                <Stack.Screen name="index"
                    options={{
                        title: title ?? "La liste de course",
                    }} />
                <Stack.Screen name="new"
                    options={{
                        presentation: "modal",
                        title: "Nouvel article",
                        animation:"slide_from_bottom",
                        headerBackVisible: true
                    }} />
                <Stack.Screen name="[goodId]"
                    options={{
                        presentation: "modal",
                        title: "Modifier article",
                        animation:"slide_from_bottom",
                        headerBackVisible: true,
                    }} />
            </Stack>
        </View>
    )
}