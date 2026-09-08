import { Avatar } from "@/components/ui/Avatar";
import { TripContext } from "@/context/TripContext";
import { useGetTrip, useGetTripUser } from "@/hooks/api/useTrips";
import { useGetStorageTrip } from "@/hooks/storage/useStorageTrips";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, Pressable } from "react-native";

export default function TripDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: storageTrip } = useGetStorageTrip(id);
    const { data: trip } = useGetTrip(id, true);

    const { data: me } = useGetTripUser(id, storageTrip?.user, {
        enabled: !!storageTrip?.user
    });

    const glass = useGlassHeaderOptions();

    useEffect(() => {
        if (!!storageTrip && !storageTrip.user)
            router.navigate('./pick-user');
    }, [router, storageTrip]);


    return (
        <TripContext.Provider value={{
            me,
            trip
        }}>
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