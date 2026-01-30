import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip, useGetTripUser } from "@/hooks/api/useTrips";
import { useGetStorageTrip } from "@/hooks/storage/useStorageTrips";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function TripDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: storageTrip } = useGetStorageTrip(String(id));
    const { data: trip } = useGetTrip(String(id));

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
        }}>
            <Stack screenOptions={{
                headerTintColor: "white",
                headerTitleStyle: styles.headerTitle,
            }}>
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                    title: trip?.name || "",
                }} />
                <Stack.Screen name="pick-user" options={{
                    presentation: "modal",
                    title: "Choisis qui tu es",

                }} />
                <Stack.Screen name="edit-user" options={{
                    presentation: "modal",
                    title: "Modifier mon utilisateur",
                    headerBackTitle: "Annuler"
                }} />

                <Stack.Screen name="dates"
                    options={{
                        presentation: "modal",
                        title: "Dates du séjour"
                    }} />
                <Stack.Screen name="votes"
                    options={{
                        title: "Votes",
                        headerShown: false
                    }} />
            </Stack>

        </TripContext.Provider>

    )

}