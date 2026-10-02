import { WordmarkHomeButton } from "@/components/brand/WordmarkHomeButton";
import { Avatar } from "@/components/ui/Avatar";
import { useTrip } from "@/context/TripContext";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConversationLayout() {

    const router = useRouter();
    const { me, trip } = useTrip();

    const insets = useSafeAreaInsets();
    const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 0;


    return (
        <View className="flex-1"
            style={{
                paddingBottom: bottomPadding
            }}>
            <Stack screenOptions={{
                headerShown: true,
                title: "",
                ...useGlassHeaderOptions(),
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
                    // Onglet racine : pas de back natif — le wordmark ramène à la home.
                    headerLeft: () => <WordmarkHomeButton />,
                }} />
            </Stack>
        </View>

    )
}
