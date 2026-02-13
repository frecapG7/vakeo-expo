import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVotes } from "@/hooks/api/useVotes";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";



const typeToIconColor = {
    "DATES": "blue"
}

const typeToColor = {
    "DATES": "text-blue-400"
}


export default function PollsPage() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const { data: page } = useGetVotes(id);



    const { me } = useContext(TripContext);

    const { formatDate, formatDuration } = useI18nTime();

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={page?.votes || []}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View className="rounded-xl bg-stone-50 dark:bg-gray-800 p-3 ">
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
                                    {item?.voters?.length} votes
                                </Text>
                                <Text className="text-gray-400">
                                    •
                                </Text>
                                <Text className="text-gray-400">
                                    {formatDuration(item?.createdAt)}
                                </Text>
                            </View>


                            <View className="bg-blue-600 flex-1 rounded-xl m-5 p-2 items-center">
                                <Text className="text-lg text-white">Voter</Text>
                            </View>

                        </View>

                    </View>
                )}
                ItemSeparatorComponent={() => <View className="my-5" />}
            />
        </View>
    )
}