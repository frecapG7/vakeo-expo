import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvents } from "@/hooks/api/useEvents";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";
import { Event, TripUser } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const showDay = (previous?: Event, current?: Event) => {
    if (!current?.startDate)
        return false;
    if (!previous?.startDate)
        return true;
    return !dayjs(previous.startDate).isSame(dayjs(current.startDate), 'day');

}



const typeFilters = [
    {
        value: "",
        label: "Tous"
    },
    {
        value: "ACTIVITY",
        icon: "flame",
        label: "Activité"
    },
    {
        value: "MEAL",
        icon: "cart",
        label: "Repas"
    },
    {
        value: "RESTAURANT",
        icon: "suit.spade",
        label: "Restaurant"
    },
    {
        value: "SPORT",
        icon: "sportscourt",
        label: "Sport"
    },
    {
        value: "PARTY",
        icon: "moon.stars.fill",
        label: "Soirée"
    }
]

const EventItem = ({ event, user, onPress }: { event: Event, user: TripUser, onPress: () => void }) => {
    const isAttendee = useMemo(() => event.attendees?.map(u => u._id).includes(user?._id), [user, event]);
    const isOwner = useMemo(() => event.owners?.map(u => u._id).includes(user?._id), [user, event])

    return (
        <Button
            onPress={onPress}
            className="py-3 px-1 border-b border-orange-400 dark:border-gray-400 bg-gray-100 dark:bg-gray-800/50">
            <View className="flex-row gap-3">
                <View className="mt-1">
                    <EventIcon name={event.type} size="md" />
                </View>
                <View className="flex-1 gap-2 justify-between">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2 flex-1">
                            <Text className="text-lg text-gray-800 dark:text-white font-bold flex-1"
                                numberOfLines={2}>
                                {event.name}
                            </Text>
                        </View>
                        {isAttendee &&
                            <Animated.View className="flex-row bg-green-200 rounded-lg items-center px-2 py-1">
                                <IconSymbol name="checkmark" color="green" size={14} />
                                <Text className="text-xs font-bold text-green-600">Inscrit</Text>
                            </Animated.View>}
                    </View>
                    {event.details &&
                        <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={2}>
                            {event.details}
                        </Text>}
                    <View className="flex-row items-center justify-around ">
                        <View className="flex-row items-center gap-1">
                            <IconSymbol name="clock" color="gray" size={14} />
                            {event?.startDate &&
                                <Text className="text-sm text-gray-500 dark:text-gray-400">
                                    {dayjs(event?.startDate).format("HH:mm")}-{dayjs(event?.endDate).format("HH:mm")}
                                </Text>}
                        </View>
                        <View className="flex-row items-center gap-1">
                            <IconSymbol name="person.2.fill" color="gray" size={14} />
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                {event?.attendees?.length}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <IconSymbol name="list.bullet" color="gray" size={14} />
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                10
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Button>
    )
}

export default function TripPlanning() {

    const { id } = useLocalSearchParams();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [onlyAttendee, setOnlyAttendee] = useState(false);
    const [onlyOwner, setOnlyOwner] = useState(false);


    const router = useRouter();
    const { me } = useContext(TripContext);
    const { formatDate, formatDay, formatHour } = useI18nTime();

    const { data, hasNextPage, fetchNextPage, isLoading, refetch, isRefetching } = useGetEvents(String(id), {
        type: typeFilter,
        search,
        ...(onlyAttendee && { attendee: String(me?._id) }),
        ...(onlyOwner && { owner: String(me?._id) }),
    }, {
        enabled: !!id,
    });
    const events = useMemo(() => data?.pages.flatMap((page) => page?.events), [data?.pages]);


    return (
        <Animated.View style={styles.container}>
            <Animated.FlatList
                data={events || []}
                ListHeaderComponent={
                    <View className="gap-4 mb-5">
                        <View className="">
                            <Animated.ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="flex-row "
                                contentContainerClassName="gap-5">
                                {typeFilters.map(item => (
                                    <Pressable
                                        key={item.value}
                                        className={`py-2 px-4 items-center rounded-full ${typeFilter === item.value ? "bg-orange-600 border-orange-400 " : "bg-white dark:bg-gray-900 border border-gray-600"}`}
                                        onPress={() => setTypeFilter(typeFilter === item?.value ? "" : item.value)}
                                    >
                                        <Text className={`${typeFilter === item.value ? "font-bold text-white" : "dark:text-white"}`}>
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </Animated.ScrollView>
                        </View>
                        <View className="flex-row justify-start gap-5">
                            <Pressable className={`w-[48%] shadow flex-row rounded-full justify-center items-center gap-1 p-2 ${onlyAttendee ? "bg-orange-200 dark:bg-orange-600 border border-orange-300" : "bg-white dark:bg-gray-900 dark:border dark:border-gray-600"}`}
                                onPress={() => setOnlyAttendee(!onlyAttendee)}>
                                {onlyAttendee &&
                                    <Animated.View entering={FadeIn} exiting={FadeOut} className="rounded-full bg-orange-400 p-1">
                                        <IconSymbol name="checkmark" color="white" size={14} />
                                    </Animated.View>
                                }
                                <Text className={`${onlyAttendee ? "font-bold" : ""} text-sm dark:text-white`}>Mes participations</Text>
                            </Pressable>
                        </View>
                    </View>
                }
                renderItem={({ item, index, }) =>
                    <View className="gap-2">
                        {showDay(events[index - 1], item) &&
                            <View className="border-b border-orange-400 dark:border-gray-200 p-1 mt-6">
                                <Text className="text-xl font-bold uppercase text-orange-400 dark:text-white">
                                    {formatDay(item.startDate)}
                                </Text>
                            </View>
                        }
                        <EventItem event={item}
                            user={me}
                            onPress={() => router.navigate({
                                pathname: "/[id]/events/[eventId]",
                                params: { id: String(id), eventId: item._id }
                            })} />
                    </View>

                }
                ItemSeparatorComponent={() => <View className="my-0" />}
                keyExtractor={(item) => item?._id}
                contentContainerClassName="p-2"
                ListEmptyComponent={
                    isLoading ?
                        <View className="gap-5">
                            <Skeleton height={40} />
                            <Skeleton height={40} />
                        </View>
                        :
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
                refreshing={isRefetching}
                onRefresh={refetch}

            />
            <Pressable className="absolute bottom-10 right-6 p-2 rounded-full border border-white bg-orange-400 items-center justify-center shadow"
                onPress={() => router.push({
                    pathname: "/[id]/events/new",
                    params: {
                        id: String(id)
                    }
                })}>
                <IconSymbol name="plus" color="white" size={26} />
            </Pressable>
        </Animated.View>
    )
}