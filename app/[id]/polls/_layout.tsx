import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PollsLayout() {

    const insets = useSafeAreaInsets();
    const { trip, me } = useContext(TripContext);

    const router = useRouter();

    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom
        }}>

            <Stack screenOptions={{
                headerShown: true,
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerBackground: () => trip && <BackgroundHeader trip={trip} />,
            }}>
                <Stack.Screen name="index"
                    options={{
                        headerShown: true,
                        title: "Sondages",

                        headerLeft: () =>
                            <Button onPress={() => router.back()}
                                className="mr-4">
                                <IconSymbol name="arrow.left" />
                            </Button>,
                        headerRight: () =>
                            me && <Button
                                onPress={() => router.push({
                                    pathname: "/[id]/settings",
                                    params: {
                                        id: trip?._id
                                    }
                                })}
                                className="ml-4"
                            >
                                <Avatar
                                    src={me?.avatar}
                                    alt={me?.name?.charAt(0)}
                                />
                            </Button>
                    }}
                />

                <Stack.Screen name="new"
                    options={{
                        title: "Nouveau sondage",
                        headerBackTitle: "Annuler",
                    }} />
                <Stack.Screen name="[pollId]"
                    options={{
                        headerShown: true,
                        title: "Détails",
                        headerRight: () =>
                            me && <Button
                                onPress={() => router.push({
                                    pathname: "/[id]/settings",
                                    params: {
                                        id: trip?._id
                                    }
                                })}
                                className="ml-4"
                            >
                                <Avatar
                                    src={me?.avatar}
                                    alt={me?.name?.charAt(0)}
                                />
                            </Button>
                    }} />
            </Stack>
        </View>
    )
}