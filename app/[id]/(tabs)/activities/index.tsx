import { EventListItem } from "@/components/events/EventListItem";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetEvents } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { getDatesBetween } from "@/lib/utils";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { SlideInDown, SlideInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const DayItem = ({ date, trip }: { date: Date, trip: any }) => {

    const { formatDate, getDayName, getDayNumber, getMonthName } = useI18nTime();


    const { data } = useGetEvents(trip._id, {
        type: "ACTIVITY",
        startDate: date,
        endDate: dayjs(date).endOf("day")
    })


    // TODO: handle pagination if there 
    const events = useMemo(() => data?.pages.flatMap((page) => page.events), [data]);

    return (
        <View className="my-2">
            <View className="w-20 ">
                <CalendarDayView>
                    <View className="flex items-center justify-center">
                        <Text className="text-xs uppercase">
                            {getDayName(date)}
                        </Text>
                        <Text className="text-md font-bold">
                            {getDayNumber(date)}
                        </Text>
                        <Text className="text-xs capitalize">
                            {getMonthName(date)}
                        </Text>
                    </View>
                </CalendarDayView>
            </View>
            <View className="flex flex-1">
                {events?.length === 0 &&

                    <Animated.View className="flex-1 items-center">
                        <View className="bg-dark dark:bg-gray-200 h-10 w-md"></View>
                        <Text>rien</Text>
                    </Animated.View>

                }
            </View>
        </View>

    )
}





export default function TripActivities() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const { data } = useGetEvents(id, {
        type: "ACTIVITY"
    });

    const router = useRouter();

    const events = useMemo(() => data?.pages.flatMap((page) => page.events), [data]);

    const [listStyle, setListStyle] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <View className="flex-row w-full justify-center">
                <View className="rounded-full flex-row border bg-orange-200 dark:bg-gray-500">
                    <Pressable className={`${listStyle === "" && "bg-orange-400 dark:bg-gray-200"} flex rounded-l-full p-2 px-7 items-center`}
                        onPress={() => setListStyle("")}>
                        <IconSymbol name="list.bullet" size={20} color="black" />
                    </Pressable>
                    <View className="w-0.5 dark:bg-black" />
                    <Pressable className={`${listStyle === "perDay" && "bg-orange-400 dark:bg-gray-300"} flex rounded-r-full p-2 px-7 items-center`}
                        onPress={() => setListStyle("perDay")}>
                        <IconSymbol name="calendar" size={20} color="black" />
                    </Pressable>
                </View>
            </View>

            {listStyle === "" &&
                <Animated.FlatList
                    data={events}
                    renderItem={({ item }) =>
                        <EventListItem event={item} onPress={() => router.navigate({
                            pathname: "/[id]/(tabs)/activities/[activityId]",
                            params: { id: String(id), activityId: item._id }
                        })} />
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
            }


            {listStyle === "perDay" &&
                <Animated.View entering={SlideInUp} exiting={SlideInDown}>
                    <Animated.FlatList data={getDatesBetween(trip.startDate, trip.endDate, true)}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) =>
                            <DayItem date={item} trip={trip} />
                        }
                    />
                </Animated.View>
            }
        </SafeAreaView>
    )
}