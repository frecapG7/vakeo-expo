import { Button } from "@/components/ui/Button";
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



export default function TripEvents() {

    const { id } = useLocalSearchParams();
    const { data } = useGetEvents(id);

    const router = useRouter();

    const events = useMemo(() => data?.pages.flatMap((page) => page.events), [data]);

    const [onlyMealFilter, setOnlyMealFilter] = useState(false);
    const [isAttendant, setIsAttendant] = useState(false);
    const [isOwner, setIsOwner] = useState(false);


    return (
        <SafeAreaView style={styles.container}>

            <View className="flex flex-row justify-between p-5 items-center">
                <Text className="text-2xl font-bold dark:text-white">Les Activités</Text>
                <Button variant="contained" title="Ajouter" onPress={() => {
                    //TODO: ./new should be enought but it is not
                    router.push({
                        pathname: "/[id]/(tabs)/events/new",
                        params: { id: String(id) }
                    }
                    )
                }} />
            </View>


            <View className="flex flex-row justify-around items-center">
                <Pressable className={`border border-blue-200 rounded-full px-5 py-1 ${onlyMealFilter && "bg-gray-100"}`}>
                    <Text className="dark:text-white">les repas</Text>
                </Pressable>
                <Pressable className={`border border-blue-200 rounded-full px-5 py-1  ${isAttendant && "bg-green-100 dark:bg-gray-200"}`}
                    onPress={() => setIsAttendant(!isAttendant)}>
                    <Text className={`${!isAttendant && "dark:text-white"}`}>Participant</Text>
                </Pressable>
                <Pressable className="border border-blue-200 rounded-full px-5 py-1">
                    <Text className="dark:text-white">Organisateur</Text>
                </Pressable>
            </View>

            <View>
                <Animated.FlatList
                    data={events}
                    renderItem={({ item }) =>
                        <View className="bg-orange-200 my-10">
                            <Text>{item?.name}</Text>
                        </View>
                    }
                    keyExtractor={(item) => item?._id}
                    contentContainerClassName="flex rounded-lg"
                    ListEmptyComponent={
                        <View className="my-5">
                            <Text className="text-2xl dark:text-white">
                                Aucune activité
                            </Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    )
}