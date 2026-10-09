import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Screen } from "@/components/ui/Screen";
import { TripContext, TripStatus } from "@/context/TripContext";
import { useGetTrip, useGetTripUser } from "@/hooks/api/useTrips";
import { useGetStorageTrip } from "@/hooks/storage/useStorageTrips";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Platform, Pressable, Text, View } from "react-native";

export default function TripDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: storageTrip } = useGetStorageTrip(id);
    // retry: false — un refus d'accès (403 lecture privée) ne se répare pas en
    // relançant la requête. L'interceptor ne toast pas les 403 GET (état d'accès).
    const { data: trip, error, isLoading } = useGetTrip(id, true, { retry: false });
    const forbidden = (error as any)?.response?.status === 403;

    const { data: me } = useGetTripUser(id, storageTrip?.user, {
        enabled: !!storageTrip?.user
    });

    const glass = useGlassHeaderOptions();

    // Tri-state 403 v3 : le contexte porte le statut de résolution (cf. TripContext).
    const status: TripStatus = forbidden ? "forbidden" : isLoading ? "loading" : "ready";
    const contextValue = useMemo(() => ({ me, trip: trip!, status }), [me, trip, status]);

    useEffect(() => {
        if (!forbidden && !!storageTrip && !storageTrip.user)
            router.navigate('./pick-user');
    }, [router, storageTrip, forbidden]);


    // Lecture privée refusée (403) : écran d'état à la place de la Stack — les
    // écrans [id]/* assument un trip résolu, ils ne doivent pas monter. Pattern
    // des états pick-user (carte lock ambre, charte All In).
    if (forbidden) {
        return (
            <Screen className="flex-1 bg-mist dark:bg-ink">
                <View className="flex-1 items-center justify-center gap-3 px-6">
                    <View className="w-20 h-20 rounded-full bg-amber/15 justify-center items-center mb-2">
                        <IconSymbol name="lock" size={36} color="#EE8B33" />
                    </View>
                    <Text className="text-xl font-bold text-night dark:text-white text-center">
                        Voyage privé
                    </Text>
                    <Text className="text-sm text-night/50 dark:text-white/50 text-center mb-4">
                        Tu n&apos;as pas accès à ce voyage. Demande un lien de partage à l&apos;organisateur pour le rejoindre.
                    </Text>
                    <Button
                        title="Retour à l'accueil"
                        variant="contained"
                        className="w-full"
                        onPress={() => router.dismissAll()}
                    />
                </View>
            </Screen>
        );
    }

    return (
        <TripContext.Provider value={contextValue}>
            <Stack screenOptions={{
                headerShown: true,
                headerBackTitle: "Annuler",
                ...glass
            }}>
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                    title: trip?.name || "",
                }} />
                <Stack.Screen name="pick-user" options={{
                    presentation: "modal",
                    title: "Choisis qui tu es",
                    headerLeft: () => <></>

                }} />
                <Stack.Screen name="edit-general"
                    options={{
                        presentation: "modal",
                        title: "Modifier",
                    }} />

                <Stack.Screen name="dates"
                    options={{
                        title: "Dates du séjour",
                        headerLargeTitleEnabled: true,
                        headerTransparent: Platform.OS === "ios"
                    }} />

                <Stack.Screen name="location"
                    options={{
                        title: "Les étapes",
                        headerLargeTitleEnabled: true,
                        headerTransparent: Platform.OS === "ios"
                    }}
                />

                <Stack.Screen name="share"
                    options={{
                        title: "",
                    }}
                />
                <Stack.Screen name="chat"
                    options={{
                        headerBackTitle: "",
                        title: "General",
                        headerRight: () => me && (
                            <Pressable onPress={() => router.navigate('./settings')}>
                                <Avatar
                                    src={me?.avatar}
                                    alt={me?.name?.charAt(0)}
                                    size2="sm"
                                />
                            </Pressable>
                        ),
                    }}
                />
                <Stack.Screen name="restrictions"
                    options={{
                        title: "Restrictions alimentaires",
                        headerShown: false,
                        presentation: "modal"
                    }}
                />
                {/* Nested folders */}
                <Stack.Screen name="attendees"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="polls"
                    options={{
                        headerShown: false,
                        title: "Sondages",
                    }}
                />
                <Stack.Screen name="goods"
                    options={{
                        headerShown: false,
                        title: "La liste de course",
                    }}
                />
                <Stack.Screen name="links"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="events"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen name="settings"
                    options={{
                        headerShown: false,
                        title: "Mon profil",
                    }}
                />

            </Stack>

        </TripContext.Provider>

    )

}
