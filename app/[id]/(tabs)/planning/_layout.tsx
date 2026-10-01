import { WordmarkHomeButton } from "@/components/brand/WordmarkHomeButton";
import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import { Platform, Pressable, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlanningLayout() {

    const { id } = useGlobalSearchParams<{id: string}>();
    const router = useRouter();
    const { me } = useTrip();

    const isDark = useColorScheme() === "dark";
    const iconColor = isDark ? "#F6F8FD" : "#16265C";

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
                ...useGlassHeaderOptions(),
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
                                className="p-2 rounded-full bg-white dark:bg-night border border-gray-200 dark:border-white/15">
                                <IconSymbol
                                    name={isCalendar ? "list.dash" : "calendar"}
                                    size={20}
                                    color={iconColor}
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
                <Stack.Screen name="index" options={{
                    headerLargeTitleEnabled: true,
                    // Onglet racine : pas de back natif — le wordmark ramène à la home.
                    headerLeft: () => <WordmarkHomeButton />,
                }} />
                <Stack.Screen name="calendar" />
                <Stack.Screen name="day" />
            </Stack>
        </View>

    )
}
