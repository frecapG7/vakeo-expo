import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip, useGetTripUser } from "@/hooks/api/useTrips";
import { useGetStorageTrip } from "@/hooks/storage/useStorageTrips";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";

export default function TripDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams<{id : string}>();

    const { data: storageTrip } = useGetStorageTrip(id);
    const { data: trip } = useGetTrip(id, true);

    const { data: me } = useGetTripUser(id, storageTrip?.user, {
        enabled: !!storageTrip?.user
    });

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
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
                headerBackground:() => trip && <BackgroundHeader trip={trip} />
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
                <Stack.Screen name="edit-general" options={{
                    presentation: "modal",
                    title: "Modifier",
                    headerBackTitle: "Annuler"
                }} />
               
                <Stack.Screen name="dates"
                    options={{
                        title: "Dates du séjour",
                    }} />
                <Stack.Screen name="votes"
                    options={{
                        title: "Votes",
                        headerShown: false
                    }} />
                <Stack.Screen name="polls"
                    options={{
                        headerShown: true,
                        title: "Sondages",
                        
                    }}
                />
                <Stack.Screen name="location"
                    options={{
                        headerShown: true,
                        title: "Les étapes",
                    }}
                />
                <Stack.Screen name="goods"
                    options={{
                        headerShown: true,
                        title: "La liste partagée",
                    }}
                />
                <Stack.Screen name="events"
                    options={{
                        headerShown: false,
                        title: "La liste de course",
                    }}
                />
                <Stack.Screen name="attendees"
                    options={{
                        title: "Participants",
                    }}
                />
                <Stack.Screen name="share"
                    options={{
                        headerShown: true,
                        title: "",
                    }}
                />
                <Stack.Screen name="settings"
                    options={{
                        headerShown: false,
                        title: "Mon profil",
                    }}
                />
                <Stack.Screen name="chat"
                    options={{
                        headerShown: true,
                        title: "Messagerie",
                        headerLeft: () => (
                            <Pressable onPress={() => router.replace({
                                pathname: "/[id]/(tabs)",
                                params: {id}
                            })}>
                                <IconSymbol name="arrow.left" color="white" />
                            </Pressable>
                        ),
                        headerRight: () => (
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
            </Stack>

        </TripContext.Provider>

    )

}