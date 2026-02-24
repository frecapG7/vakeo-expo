import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";



const typeToIconColor = {
    "DatesPoll": "blue",
    "OtherPoll": "orange"
}

const typeToColor = {
    "DatesPoll": "text-blue-400",
    "OtherPoll": "text-orange-400"
}


export default function PollsPage() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const { data: page } = useGetPolls(id);



    const { me } = useContext(TripContext);
    const router = useRouter();

    const { formatDate, formatDuration } = useI18nTime();


    return (
        <SafeAreaView style={styles.container}>
            <Animated.FlatList
                data={page?.polls || []}
                contentContainerClassName="m-2"
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Pressable 
                    onPress={() => router.push({
                        pathname: "/[id]/polls/[pollId]",
                        params: {
                            id: String(id),
                            pollId: item._id
                        }
                    })}
                    className="rounded-xl bg-stone-50 dark:bg-gray-800 p-3 ">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row gap-2">
                                <IconSymbol name="calendar" color={typeToIconColor[item?.type]} />
                                <Text className={`font-bold text-lg ${typeToColor[item?.type]}`}>Dates</Text>
                            </View>


                            {item?.status === "CLOSED" &&

                                <View className="rounded-full bg-red-200 p-1">
                                    <Text className="text-red-600 uppercase font-bold">Fermé</Text>
                                </View>

                            }

                        </View>
                        <View className="my-2">
                            <Text className="text-2xl font-bold">{item?.question || "Quelles dates ?"}</Text>
                            <Text className="font-bold">{formatDate(item?.createdAt)}</Text>
                        </View>


                        <View className="flex-row flex-1 justify-between items-end">


                            <View className="flex-row flex-1 justify-around items-center">
                                <Text className="text-gray-400">
                                    {item?.hasSelected?.length} votes
                                </Text>
                                <Text className="text-gray-400">
                                    •
                                </Text>
                                <Text className="text-gray-400">
                                    {formatDuration(item?.createdAt)}
                                </Text>
                            </View>


                            {!item?.hasSelected.map(u => u._id).includes(me?._id) &&

                                <View className="bg-blue-600 flex-1 rounded-xl m-5 p-2 items-center">
                                    <Text className="text-lg text-white">Voter</Text>
                                </View>
                            }

                        </View>

                    </Pressable>
                )}
                ItemSeparatorComponent={() => <View className="my-5" />}
            />
            <Pressable className="absolute bottom-20 right-6 w-20 h-20 rounded-full border border-white bg-blue-400 items-center justify-center shadow"
                onPress={() => router.push({
                    pathname: "/[id]/polls/new",
                    params: {
                        id: String(id)
                    }
                })}>
                <IconSymbol name="plus" color="white" size={40} />
            </Pressable>
        </SafeAreaView>
    )
}