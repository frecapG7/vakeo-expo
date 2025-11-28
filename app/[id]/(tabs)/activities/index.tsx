import { EventListItem } from "@/components/events/EventListItem";
import styles from "@/constants/Styles";
import { useGetEvents } from "@/hooks/api/useEvents";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const showDay = (previous?: any, current?: any) => {
    if (!current?.startDate)
        return false;
    if (!previous?.startDate)
        return true;
    return !dayjs(previous.startDate).isSame(dayjs(current.startDate), 'day');

}


export default function TripActivities() {

    const { id } = useLocalSearchParams();
    const { data, hasNextPage, fetchNextPage } = useGetEvents(id, {
        type: "ACTIVITY",
    });

    const router = useRouter();
    const { formatDate } = useI18nTime();

    const events = useMemo(() => data?.pages.flatMap((page) => page?.events), [data]);

    return (
        <SafeAreaView style={styles.container}>
        


            <Animated.FlatList
                data={events || []}
                renderItem={({ item, index, }) =>
                    // <Animated.View entering={SlideInUp} exiting={SlideInDown} className="flex">
                    <View className="flex">
                        {showDay(events[index - 1], item) &&
                            <Text className="ml-2 font-bold dark:text-white capitalize">
                                {formatDate(item.startDate, {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </Text>}
                        <EventListItem event={item} onPress={() => router.navigate({
                            pathname: "/[id]/(tabs)/activities/[activityId]",
                            params: { id: String(id), activityId: item._id }
                        })} />
                    </View>
                }
                keyExtractor={(item) => item?._id}
                contentContainerClassName="flex rounded-lg p-2 gap-5"
                ListEmptyComponent={
                    <View className="my-5 flex-1 flex-grow justify-center">
                        <Text className="text-2xl dark:text-white">
                            Aucune activité
                        </Text>
                    </View>
                }
                onEndReached={() => {
                    if (hasNextPage)
                        fetchNextPage();
                }}
            />



        </SafeAreaView>
    )
}