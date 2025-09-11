import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { AvatarsList } from "@/components/users/AvatarsList";
import { useGetTrip, useGetTripUser } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useGetStorageTrip, useUpdateStorageTrip } from "@/hooks/storage/useStorageTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";


export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip, isLoading } = useGetTrip(String(id));


    const router = useRouter();



    const { data: storageTrip } = useGetStorageTrip(String(id));


    const { data: me } = useGetTripUser(storageTrip?._id, storageTrip?.user, {
        enabled: !!storageTrip
    });
    const updateStorageTrip = useUpdateStorageTrip(String(id));


    const [showUserPicker, setShowUserPicker] = useState(false);


    const { formatDate } = useI18nTime();




    return (
        <View style={styles.container}>
            <View className="flex flex-row justify-between items-center px-5 my-5">
                <CalendarDayView>
                    {!!trip?.startDate ? (
                        <View className="px-5 pb-2 flex items-center">
                            <Text className="text-2xl">
                                {formatDate(trip?.startDate, {
                                    day: "numeric",
                                    month: "long"
                                })}
                            </Text>
                            <Text className="text-xl font-bold">-</Text>
                            <Text className="text-2xl">
                                {formatDate(trip?.endDate, {
                                    day: "numeric",
                                    month: "long"
                                })}
                            </Text>
                        </View>) :
                        (<Animated.View entering={ZoomIn} exiting={ZoomOut} >
                            <Pressable onPress={() => router.push("./dates")} className="flex items-center m-1">
                                <IconSymbol name="pencil" size={24} color="dark" />
                                <Text className="text-sm">Ajouter des dates</Text>
                            </Pressable>
                        </Animated.View>)
                    }

                </CalendarDayView>

                <View className="flex flex-col justify-between gap-2 bg-orange-200 p-5 rounded-lg">
                    <View className="bg-gray-200 p-2 rounded-xl">
                        <Text className="text-xl">En cours</Text>
                    </View>
                    <Pressable className="rounded-2xl px-2 flex flex-row circled-white"
                        onPress={() => router.push("./pick-user")}>
                        <Text className="text-2xl font-bold text-white">
                            {trip?.users?.length}
                        </Text>
                        <IconSymbol name="person.circle" />
                    </Pressable>
                </View>
            </View>

            <View className="mt-10">
                <Text className="text-2xl ">A venir</Text>
                <View className="flex flex-row justify-between bg-gray-200 py-2 rounded-lg">
                    <View className="flex flex-row gap-2 items-center">
                        <IconSymbol name="flame" size={35} />
                        <View>
                            <Text className="text-lg">10h-12h</Text>
                            <Text className="text-lg italic">Piscine</Text>
                        </View>
                    </View>

                    <AvatarsList users={[
                        {
                            id: "1",
                            name: "Florian"
                        }, {
                            id: "213454",
                            name: "Coumba"
                        }
                    ]} />
                </View>
            </View>
        </View>

    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 2
    }
})