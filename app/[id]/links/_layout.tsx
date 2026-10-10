


import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useRouter } from "expo-router";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function LinksLayout() {

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
                        headerTransparent: Platform.OS === "ios",
                        headerLeft: () =>
                            <Button onPress={() => router.back()}>
                                <IconSymbol name="arrow.left" />
                            </Button>
                    }} />
                <Stack.Screen name="new"
                    options={{
                        presentation: "modal",
                        title: "Ajouter un lien",
                        animation: "slide_from_bottom",
                        headerLeft: () => <Button
                            onPress={() => router.back()}>
                            <IconSymbol name="xmark" />
                        </Button>
                    }} />
            </Stack>
        </View>
    )
}
