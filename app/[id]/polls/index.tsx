import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { translateType } from "@/lib/pollUtils";
import { containsUser } from "@/lib/utils";
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
                renderItem={({ item }) => {
                    const containUser = containsUser(me, item.hasSelected.map(_id => ({ _id })));
                    return (
                        <Pressable
                            onPress={() => router.push({
                                pathname: "/[id]/polls/[pollId]",
                                params: {
                                    id: String(id),
                                    pollId: item._id
                                }
                            })}
                            className={`rounded-xl shadow-lg dark:shadow-gray-200 bg-white dark:bg-gray-900  p-3 ${!containUser ? "border-l-4 border-orange-400" : ""}`}>
                            <View className="flex-row items-center justify-between">


                                {item?.status === "CLOSED" &&
                                    <View className="rounded-full bg-red-200 p-1">
                                        <Text className="text-red-600 uppercase font-bold">Fermé</Text>
                                    </View>
                                }
                            </View>
                            <View className="my-2">
                                <View className="flex-row items-center justify-between gap-1">
                                    <View className="flex-row items-center gap-2">
                                        <Avatar
                                            size2="sm"
                                            src={item?.createdBy.avatar}
                                            alt={item.createdBy.name.charAt(0)}
                                        />
                                        <Text className="text-lg dark:text-white font-bold">{item.createdBy.name}</Text>
                                    </View>
                                    <Text className="text-gray-400">
                                        {formatDuration(item?.createdAt)}
                                    </Text>
                                </View>
                                <Text className="text-2xl font-bold dark:text-white">{item?.question}</Text>
                                <View className="flex-row gap-1 mt-2 items-center">
                                    <View className="flex-row gap-2 items-center">
                                        <IconSymbol name="chart.bar.fill" color="gray" />
                                        <Text className="font-bold text-gray-600 dark:text-gray-400 capitalize text-sm">
                                            {translateType(item.type)}
                                        </Text>
                                    </View>
                                    <Text className="text-gray-400">
                                        •
                                    </Text>
                                    <Text className="font-bold text-gray-600 dark:text-gray-400">{formatDate(item?.createdAt)}</Text>

                                </View>

                            </View>


                            <View className="flex-row flex-1 justify-between items-end">
                                <View className="flex-row flex-1 items-center">
                                    <Text className="text-gray-400">
                                        {item?.hasSelected?.length} votes
                                    </Text>

                                </View>
                                {!containUser &&
                                    <View className="bg-blue-600 flex-1 rounded-xl p-1 items-center">
                                        <Text className="text-md text-white uppercase font-bold">Voter</Text>
                                    </View>
                                }

                            </View>
                        </Pressable>
                    )

                }}
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