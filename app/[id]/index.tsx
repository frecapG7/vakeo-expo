import { Avatar } from "@/components/ui/Avatar";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { AvatarsList } from "@/components/users/AvatarsList";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useGetStorageTrip, useUpdateStorageTrip } from "@/hooks/storage/useStorageTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip, isLoading } = useGetTrip(String(id));


    const router = useRouter();



    const { data: storageTrip } = useGetStorageTrip(String(id));
    const me = useMemo(() => storageTrip?.user, [storageTrip]);
    const updateStorageTrip = useUpdateStorageTrip(String(id));


    const [showUserPicker, setShowUserPicker] = useState(false);


    const { formatDate } = useI18nTime();


    return (
        <View style={styles.container}>
            <View className="flex flex-row justify-between items-center px-5 my-5">
                <CalendarDayView>
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
                    </View>
                </CalendarDayView>

                <View className="flex flex-col justify-between gap-2">
                    <View className="bg-gray-200 p-2 rounded-xl">
                        <Text className="text-xl">En cours</Text>
                    </View>
                    <Pressable className="rounded-2xl px-2 flex flex-row circled-white"
                        onPress={() => setShowUserPicker(true)}>
                        <Text className="text-2xl font-bold text-white">
                            {trip?.users?.length}
                        </Text>
                        <IconSymbol name="person.circle" />
                    </Pressable>
                </View>
            </View>

<Text>
    {JSON.stringify(storageTrip)}
</Text>

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


            <Modal visible={showUserPicker || (!me?._id && !isLoading)}
                animationType="slide"
                style={{
                    backgroundColor: "background"
                }}>
                <Pressable className="p-2" onPress={() => me?._id ? setShowUserPicker(false) : router.dismissAll()}>
                    <Text className="text-secondary">Annuler</Text>
                </Pressable>

                <Text className="text-xl text-center font-bold mb-2 dark:text-white">Sélectionne qui tu es</Text>

                <Animated.FlatList
                    data={trip?.users}
                    renderItem={({ item }) =>
                        <Pressable className="flex flex-row justify-between items-center p-2"
                            onPress={async() => {
                                await updateStorageTrip.mutateAsync({
                                    _id: storageTrip?._id,
                                    name: storageTrip?.name,
                                    user: {
                                        _id: item._id
                                    }
                                });
                                setShowUserPicker(false);
                            }}>
                            <View className="flex flex-row gap-2 items-center">
                                <Avatar alt={item.name.charAt(0)} size={40} color="blue" />
                                <Text className="text-lg ">{item.name}</Text>
                            </View>
                            {item._id === me?._id && <IconSymbol name="checkmark.circle.fill" size={35} color="blue" />}
                        </Pressable>
                    }
                    keyExtractor={(item) => item.id}
                    contentContainerClassName="mx-5 bg-orange-100 dark:bg-gray-100 rounded-lg"
                    ItemSeparatorComponent={() => <View className="h-0.5 bg-black dark:bg-white" />}
                />
            </Modal>
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