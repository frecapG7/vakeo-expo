import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import useColors from "@/hooks/styles/useColors";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function SettingsLayout() {

    const { trip } = useContext(TripContext);
    const router = useRouter();
    const { text } = useColors();


    const insets = useSafeAreaInsets();

    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom
        }}>
            <Stack screenOptions={{
                headerShown: true,
                headerTitle: "Mon profil",
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerBackground: () => trip && <BackgroundHeader trip={trip} />
            }}>
                <Stack.Screen name="index" options={{
                    headerLeft: () => <Button
                        className="mr-4"
                        onPress={() => router.back()}
                    >
                        <IconSymbol name="arrow.left" color={text} />
                    </Button>,
                }} />
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