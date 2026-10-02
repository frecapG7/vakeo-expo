import { WordmarkHomeButton } from "@/components/brand/WordmarkHomeButton";
import { Avatar } from "@/components/ui/Avatar";
import { ViewToggle, ViewToggleMode } from "@/components/ui/ViewToggle";
import { useTrip } from "@/context/TripContext";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlanningLayout() {

    const { id } = useGlobalSearchParams<{id: string}>();
    const router = useRouter();
    const { me } = useTrip();

    const glass = useGlassHeaderOptions();

    const pathname = usePathname();
    const mode: ViewToggleMode = pathname?.includes("calendar") || pathname?.includes("day")
        ? "calendar"
        : "list";

    const insets = useSafeAreaInsets();
    const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 0;

    const handleModeChange = (next: ViewToggleMode) => {
        if (next === mode)
            return;
        router.replace({
            pathname: next === "calendar"
                ? "/[id]/(tabs)/planning/calendar"
                : "/[id]/(tabs)/planning",
            params: { id }
        });
    };

    return (
        <View className="flex-1"
            style={{
                paddingBottom: bottomPadding
            }}>
            <Stack screenOptions={{
                headerShown: true,
                ...glass,
                // Le toggle vit au centre (comme le titre du GlassHeaderBar du dashboard).
                headerTitleAlign: "center",
                headerTitle: () => <ViewToggle mode={mode} onChange={handleModeChange} />,
                headerRight: () =>
                    <View className="flex flex-row justify-end items-center my-2 gap-2">
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
                    // Le nom de l'onglet vit dans la tab bar : pas de titre.
                    // headerLeft = wordmark (retour home) — uniquement sur l'onglet
                    // racine, les écrans poussés gardent leur back natif.
                    title: "",
                    headerLeft: () => <WordmarkHomeButton />,
                }} />
                <Stack.Screen name="calendar" options={{ title: "" }} />
                <Stack.Screen name="day" options={{ title: "" }} />
            </Stack>
        </View>

    )
}
