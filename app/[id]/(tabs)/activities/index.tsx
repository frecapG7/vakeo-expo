import { AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvents } from "@/hooks/api/useEvents";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { toIcon } from "@/lib/eventUtils";
import { Event, TripUser } from "@/types/models";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const showDay = (previous?: any, current?: any) => {
    if (!current?.startDate)
        return false;
    if (!previous?.startDate)
        return true;
    return !dayjs(previous.startDate).isSame(dayjs(current.startDate), 'day');

}

const EventItem = ({ event, onPress, user }: { event: Event, onPress: () => void, user: TripUser }) => {


    const isAttendee = useMemo(() => event.attendees.map(u => u._id).includes(user?._id), [user, event]);
    const isOwner = useMemo(() => event.owners.map(u => u._id).includes(user?._id), [user, event])

    return (
        <Button className=" bg-orange-200 dark:bg-gray-200 p-2 rounded-lg gap-2" onPress={onPress}>
            <View className="flex-row justify-between items-center gap-5">
                <View className="flex-row flex-1 gap-2">
                    <IconSymbol name={toIcon(event)} size={24} color="black" />
                    <Text className="text-lg font-bold max-w-xs" numberOfLines={1}>{event.name}</Text>
                </View>
                <View className="flex-1">
                    <AvatarsGroup avatars={event.attendees?.map(u => ({
                        avatar: u?.avatar,
                        alt: u.name?.charAt(0)
                    }))}
                        maxLength={2}
                        size2="sm" />
                </View>
            </View>
            <View className="flex-row gap-1">
                {isAttendee &&
                    <Animated.View entering={FadeIn} className="border p-1 rounded-full justify-center" >
                        <Text className="text-xs">Je participe</Text>
                    </Animated.View>
                }
                {isOwner &&
                    <Animated.View entering={FadeIn} className="border p-1 rounded-full">
                        <Text className="text-xs">Je suis responsable</Text>
                    </Animated.View>
                }
            </View>
        </Button>
    )
}



export default function TripActivities() {

    const { id } = useLocalSearchParams();
    const { data, hasNextPage, fetchNextPage } = useGetEvents(String(id), {
        enabled: !!id
    });

    const router = useRouter();
    const { me } = useContext(TripContext);
    const { formatDate } = useI18nTime();

    const events = useMemo(() => data?.pages.flatMap((page) => page?.events), [data]);

    return (
        // <SafeAreaView style={styles.container}>
        <Animated.View style={styles.container}>
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
                        <EventItem event={item}
                            onPress={() => router.navigate({
                                pathname: "/[id]/(tabs)/activities/[activityId]",
                                params: { id: String(id), activityId: item._id }
                            })}
                            user={me} />
                    </View>
                }

                keyExtractor={(item) => item?._id}
                className="flex"
                contentContainerClassName="p-2 gap-5"
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
        </Animated.View>




        // </SafeAreaView>
    )
}