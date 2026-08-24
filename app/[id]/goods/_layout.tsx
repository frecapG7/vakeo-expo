import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function GoodsLayout() {

    const { trip } = useContext(TripContext);
    const { title } = useLocalSearchParams<{ title?: string }>();

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
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
            }}>
                <Stack.Screen name="index"
                    options={{
                        title: title ?? "La liste de course",
                        headerBackground: () => trip && <BackgroundHeader trip={trip} />,
                        headerLeft: () => <Button onPress={() => router.back()}
                            className="mr-4">
                            <IconSymbol name="arrow.left" />
                        </Button>
                    }} />
                <Stack.Screen name="new"
                    options={{
                        presentation: "modal",
                        title: "Ajouter un article",
                        animation: "slide_from_bottom",
                        headerLeft: () => <Button onPress={() => router.back()}
                            className="mr-4">
                            <IconSymbol name="xmark" />
                        </Button>
                    }} />
                <Stack.Screen name="[goodId]"
                    options={{
                        presentation: "modal",
                        title: "Modifier un article",
                        animation: "slide_from_bottom",
                        headerLeft: () => <Button onPress={() => router.back()}
                            className="mr-4">
                            <IconSymbol name="xmark" />
                        </Button>
                    }} />
            </Stack>
        </View>
    )
}