import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PollsLayout() {

    const insets = useSafeAreaInsets();
    const { trip, me } = useTrip();

    const router = useRouter();

    const glass = useGlassHeaderOptions();
    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom
        }}>

            <Stack screenOptions={{
                headerShown: true,
                ...glass,
            }}>
                <Stack.Screen name="index"
                    options={{
                        headerLargeTitleEnabled: true,
                        headerTransparent: Platform.OS === "ios",
                        title: "Sondages",
                        headerLeft: () =>
                            <Pressable onPress={() => router.back()}>
                                <IconSymbol name="arrow.left" />
                            </Pressable>,
                        headerRight: () =>
                            me && <Pressable
                                onPress={() => router.push({
                                    pathname: "/[id]/settings",
                                    params: {
                                        id: trip?._id
                                    }
                                })}
                            >
                                <Avatar
                                    src={me?.avatar}
                                    alt={me?.name?.charAt(0)}
                                />
                            </Pressable>
                    }}
                />
                <Stack.Screen name="new"
                    options={{
                        title: "Nouveau sondage",
                        headerBackTitle: "Annuler",
                    }} />
                <Stack.Screen name="[pollId]/index"
                    options={{
                        headerShown: true,
                        title: "",
                        headerLeft: () =>
                            <Pressable
                                onPress={() => router.canGoBack()
                                    ? router.back()
                                    : router.replace({
                                        pathname: "/[id]/polls",
                                        params: { id: trip?._id }
                                    })}>
                                <IconSymbol name="arrow.left" />
                            </Pressable>,
                    }} />
                <Stack.Screen name="[pollId]/new-option"
                    options={{
                        presentation: "modal",
                        headerShown: true,
                        title: "Ajouter une option",
                        headerBackTitle: "Annuler",
                    }} />
            </Stack>
        </View>
    )
}