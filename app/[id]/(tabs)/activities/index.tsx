import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetEvents } from "@/hooks/api/useEvents";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const toto = [
    {
        _id: "2132234543",
        name: "Toto"
    },

    {
        _id: "2132234544",
        name: "Toto"
    },
    {
        _id: "2132234545",
        name: "Toto"
    },
    {
        _id: "2132234557",
        name: "Toto"
    },
    {
        _id: "2132234546",
        name: "Toto"
    },
    {
        _id: "2132234547",
        name: "Toto"
    },
    {
        _id: "2132234548",
        name: "Toto"
    },
    {
        _id: "2132234549",
        name: "Toto"
    },
    {
        _id: "2132234550",
        name: "Toto"
    },

]







export default function TripActivities() {

    const { id } = useLocalSearchParams();
    const { data } = useGetEvents(id, "ACTIVITY");

    const router = useRouter();

    const events = useMemo(() => data?.pages.flatMap((page) => page.events), [data]);

    const [onlyMealFilter, setOnlyMealFilter] = useState(false);
    const [isAttendant, setIsAttendant] = useState(false);
    const [isOwner, setIsOwner] = useState(false);



    const [listStyle, setListStyle] = useState("");


    return (
        <SafeAreaView style={styles.container}>

            <View className="flex flex-row justify-between p-5 items-center">
                <Text className="text-2xl font-bold dark:text-white">Les Activités</Text>
                <Button variant="contained" title="Ajouter" onPress={() => {
                    //TODO: ./new should be enought but it is not
                    router.push({
                        pathname: "/[id]/(tabs)/activities/new",
                        params: { id: String(id) }
                    }
                    )
                }} />
            </View>

            <View className="flex-row w-full justify-center">
                <View className="rounded-full flex-row border dark:bg-gray-500">
                    <Pressable className={`${listStyle === "" && "bg-orange-200 dark:bg-gray-200"} flex rounded-l-full p-2 px-7 items-center`}
                        onPress={() => setListStyle("")}>
                        <IconSymbol name="list.bullet" size={20} />
                    </Pressable>
                    <View className="w-0.5 dark:bg-black" />
                    <Pressable className={`${listStyle === "perDay" && "bg-orange-200 dark:bg-gray-300"} flex rounded-r-full p-2 px-7 items-center`}
                        onPress={() => setListStyle("perDay")}>
                        <IconSymbol name="calendar" size={20} />
                    </Pressable>
                </View>
            </View>





            <Animated.FlatList
                data={events}
                renderItem={({ item }) =>
                    <Pressable className="bg-orange-200 dark:bg-gray-300 my-10 rounded-lg flex-row justify-between"
                        onPress={() => router.navigate({
                            pathname: "/[id]/(tabs)/activities/[activityId]",
                            params: { id, activityId: item._id }
                        })}>

                        <View className="flex gap-2">
                            <Text>{item.startDate}</Text>
                            <Text className="text-lg ">{item?.name}</Text>
                        </View>

                        <View className="flex-row flex-1 gap-3 items-center justify-end">
                            {item?.attendees?.slice(2).map((attendee) =>
                                <View className="items-center" key={attendee._id}>
                                    <Avatar size2="sm" src={attendee.avatar} alt={attendee.name.charAt(0)} />
                                    <Text className="text-xs max-w-15 text-clip">{attendee.name}</Text>
                                </View>
                            )}
                        </View>
                    </Pressable>
                }
                keyExtractor={(item) => item?._id}
                contentContainerClassName="flex rounded-lg p-2"
                ListEmptyComponent={
                    <View className="my-5 flex-1 flex-grow justify-center">
                        <Text className="text-2xl dark:text-white">
                            Aucune activité
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}