import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { AvatarsList } from "@/components/users/AvatarsList";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface MenuItem {
    path: string,
    label: string,
    icon: any
}

const MENU_ITEMS: MenuItem[] = [
    {
        path: "/activities",
        label: "Activités",
        icon: "flame"
    },
    {
        path: "/meals",
        label: "Les repas",
        icon: "suit.spade"
    },
    {
        path: "/groceries",
        label: "Les courses",
        icon: "cart"
    },
    {
        path: "/links",
        label: "Les liens",
        icon: "link"
    }
]


export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));


    const router = useRouter();


    const [showUserPicker, setShowUserPicker] = useState(false);


    const [me, setMe] = useState({
        id: 1,
        name: "John Doe",
    });



    const { formatDate, formatDay } = useI18nTime();


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
                    <View className="border-2 rounded-2xl px-2 flex flex-row">
                        <Text className="text-2xl font-bold">
                            5
                        </Text>
                        <IconSymbol name="person.circle" />
                    </View>
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


            {/* 
            <Animated.FlatList
                data={MENU_ITEMS}
                renderItem={({ item, index }) => (
                    <Pressable onPress={() => router.push({ pathname: "/[id]" + item.path, params: { id } })}
                        className="flex flex-row justify-between align-center p-5 rounded-lg bg-blue-100 ring-secondary ring-2">
                        <View className="items-center flex flex-row gap-2 justify-start">
                            <IconSymbol name={item.icon} size={25} color="amber" />
                            <Text className="text-xl font-bold text-secondary">{item.label}</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={25} color="#000" />
                    </Pressable>
                )}
                keyExtractor={(item) => item.path}
                contentContainerClassName="gap-10"
            /> */}
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