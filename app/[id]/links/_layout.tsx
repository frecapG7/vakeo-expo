


import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function GoodsLayout() {

    const { trip } = useContext(TripContext);

    const insets = useSafeAreaInsets();
    const bottomPadding = insets.bottom;


    const router = useRouter();

    return (
        <View className="flex-1"
            style={{
                paddingBottom: bottomPadding
            }}>
            <Stack screenOptions={{
                headerShown: true,
            }}>
                <Stack.Screen name="index"
                    options={{
                        title: "Les liens utiles",
                        headerTintColor: "white",
                        headerTitleStyle: styles.headerTitle,
                        headerBackground: () => trip && <BackgroundHeader trip={trip} />
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
                {/*
                <Stack.Screen name="[goodId]"
                    options={{
                        presentation: "modal",
                        title: "Modifier article",
                        animation:"slide_from_bottom",
                        headerBackVisible: true,
                    }} /> */}
            </Stack>
        </View>
    )
}