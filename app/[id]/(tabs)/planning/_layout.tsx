import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { Stack, useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import { useContext } from "react";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlanningLayout() {

    const { id } = useGlobalSearchParams<{id: string}>();
    const router = useRouter();
    const { data: trip } = useGetTrip(id);
    const { me } = useContext(TripContext);

    const colors = useColors();

    const pathname = usePathname();
    const isCalendar = pathname?.includes("calendar") || pathname?.includes("day");

    const insets = useSafeAreaInsets();
    const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 0;

    return (
        <View className="flex-1"
            style={{
                paddingBottom: bottomPadding
            }}>
            <Stack screenOptions={{
                headerShown: true,
                title: "Planning",
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerBackground: () => trip && <BackgroundHeader trip={trip} />,
                headerRight: () =>
                    <View className="flex flex-row justify-end items-center my-2 gap-2">
                        <View>
                            <Pressable
                                onPress={() =>
                                    router.replace({
                                        pathname: isCalendar
                                            ? "/[id]/(tabs)/planning"
                                            : "/[id]/(tabs)/planning/calendar",
                                        params: { id }
                                    })
                                }
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
                                <IconSymbol
                                    name={isCalendar ? "list.dash" : "calendar"}
                                    size={20}
                                    color={colors.text}
                                />
                            </Pressable>

                        </View>
                        <Pressable
                            className="items-center"
                            onPress={() => router.push({
                                pathname: "/[id]/settings",
                                params: {
                                    id: String(id)
                                }
                            })}>

                            <Avatar alt={me?.name?.charAt(0)} src={me?.avatar} />
                        </Pressable>
                    </View>,
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="calendar" />
                <Stack.Screen name="day" options={{
                    presentation: "modal",

                }} />
            </Stack>
        </View>

    )
}