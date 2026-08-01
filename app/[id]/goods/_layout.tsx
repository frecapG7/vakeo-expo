import { BackgroundHeader } from "@/components/header/BackgroundHeader";
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
                headerTitle: title ?? "La liste générale",
                headerTintColor: "white",
                headerBackground: () => trip && <BackgroundHeader trip={trip} />
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="new"
                    options={{
                        presentation: "modal"
                    }} />
            </Stack>
        </View>
    )
}