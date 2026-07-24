import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import useColors from "@/hooks/styles/useColors";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConversationLayout() {

    const router = useRouter();
    const { me , trip} = useContext(TripContext);

    const colors = useColors();


    const insets = useSafeAreaInsets();
    const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 0;

    return (
        <View className="flex-1"
            style={{
                paddingBottom: bottomPadding
            }}>
            <Stack screenOptions={{
                headerShown: true,
                title: "Conversations",
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerBackground: () => trip && <BackgroundHeader trip={trip} />,
                headerRight: () =>
                    <View className="flex flex-row justify-end items-center my-2 gap-2">
                        <Pressable
                            className="items-center"
                            onPress={() => router.push({
                                pathname: "/[id]/settings",
                                params: {
                                    id: trip._id
                                }
                            })}>
                            <Avatar alt={me?.name?.charAt(0)} src={me?.avatar} />
                        </Pressable>
                    </View>,
            }}>
                <Stack.Screen name="index" />
            </Stack>
        </View>

    )
}