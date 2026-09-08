import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConversationLayout() {

    const router = useRouter();
    const { me , trip} = useContext(TripContext);

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
                headerLargeTitleStyle: {
                    color: "white",
                    fontWeight: "bold",
                },
                headerBackground: () => trip && <BackgroundHeader trip={trip} />,
                headerRight: () => me && 
                        <Pressable
                            disabled={!trip}
                            onPress={() => trip && router.push({
                                pathname: "/[id]/settings",
                                params: {
                                    id: trip._id
                                }
                            })}>
                            <Avatar alt={me?.name?.charAt(0)} src={me?.avatar} />
                        </Pressable>
            }}>
                <Stack.Screen name="index" options={{
                    headerLargeTitleEnabled: true,
                    headerTransparent: Platform.OS === "ios",
                }} />
            </Stack>
        </View>

    )
}