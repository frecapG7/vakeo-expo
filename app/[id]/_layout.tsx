import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGetTrip, useGetTripUser } from "@/hooks/api/useTrips";
import { useGetStorageTrip } from "@/hooks/storage/useStorageTrips";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";



export default function TripDetailsLayout() {



    const router = useRouter();
    const { id } = useLocalSearchParams();



    const { data: storageTrip } = useGetStorageTrip(String(id));
    const { data: trip } = useGetTrip(String(id));


    const { data: me } = useGetTripUser(id, storageTrip?.user, {
        enabled: !!storageTrip?.user
    });




    return (
        <TripContext.Provider value={{
            me: {
                _id: me?._id,
                avatar: me?.avatar,
                name: me?.name
            }
        }}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{
                    headerShown: true,
                    title: trip?.name || "Mon voyage",
                    headerRight: () => (
                        <View className="flex flex-row gap-2 justify-end items-center mx-5">
                            <Pressable onPress={() => router.push('./messages')}
                                className="flex flex-row gap-1 items-center ring-1 rounded-full p-3 py-1 bg-blue-200">
                                <IconSymbol name="message" size={20} color="#000" />
                                <Text className="text-secondary text-sm">{trip?.users?.length}</Text>
                            </Pressable>
                            <IconSymbol name="ellipsis.circle" size={25} color="#000" />
                        </View>
                    )
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
                <Stack.Screen name="messages" options={{
                    title: "Messagerie",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />
                <Stack.Screen name="dates"
                    options={{
                        presentation: "modal",
                        title: "Dates du séjour"
                    }} />
            </Stack>
        </TripContext.Provider>

    )

}