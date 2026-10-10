import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useRouter } from "expo-router";
import { View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function SettingsLayout() {

    const router = useRouter();
    const isDark = useColorScheme() === "dark";


    const insets = useSafeAreaInsets();

    const glass = useGlassHeaderOptions();

    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom
        }}>
            <Stack screenOptions={{
                headerShown: true,
                headerTitle: "Mon profil",
                ...glass
            }}>
                <Stack.Screen name="index" options={{
                    headerLeft: () =>
                        <Button
                            onPress={() => router.back()}
                        >
                            <IconSymbol name="arrow.left" color={isDark ? "#F6F8FD" : "#16265C"} />
                        </Button>,
                }}
                />
                <Stack.Screen name="username" options={{
                    headerTitle: "Modifier nom",
                }} />
                <Stack.Screen name="avatar" options={{
                    headerTitle: "Modifier avatar"
                }} />
            </Stack>
        </View>
    )
}