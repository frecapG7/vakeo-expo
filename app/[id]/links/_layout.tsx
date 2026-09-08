


import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function GoodsLayout() {

    const { trip } = useContext(TripContext);

    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;


    const router = useRouter();


    const glass = useGlassHeaderOptions();

    return (
        <View className="flex-1"
            style={{
                paddingBottom: bottomPadding
            }}>
            <Stack screenOptions={{
                headerShown: true,
                ...glass
            }}>
                <Stack.Screen name="index"
                    options={{
                        title: "Les liens utiles",
                        headerLargeTitleEnabled: true,
                        headerTransparent: Platform.OS === "ios"
                    }} />
                <Stack.Screen name="new"
                    options={{
                        presentation: "modal",
                        title: "Ajouter un lien",
                        animation: "slide_from_bottom",
                        headerLeft: () => <Button
                            className="mr-4"
                            onPress={() => router.back()}>
                            <IconSymbol name="xmark" />
                        </Button>
                    }} />
            </Stack>
        </View>
    )
}