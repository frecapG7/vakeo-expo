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
import Animated from "react-native-reanimated";

const showDay = (previous?: Event, current?: Event) => {
    if (!current?.startDate)
        return false;
    if (!previous?.startDate)
        return true;
    return !dayjs(previous.startDate).isSame(dayjs(current.startDate), 'day');

}



const typeFilters = [
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



const EventItem = ({ event, user }: { event: Event, user: TripUser }) => {


    const isAttendee = useMemo(() => event.attendees?.map(u => u._id).includes(user?._id), [user, event]);
    const isOwner = useMemo(() => event.owners?.map(u => u._id).includes(user?._id), [user, event])

    return (
        <View className={`py-3 pr-1 bg-white dark:bg-gray-900 rounded-xl ${isOwner ? "border-l-4 border-orange-400" : ""}`} >
            <View className="flex-row gap-2 items-center justify-between">
                <View className="flex-row items-center" >
                    <EventIcon name={event.type} size="md" />
                    <View className="flex gap-1">
                        <View className="flex-row items-start gap-1">
                            <Text className="text-lg text-gray-800 max-w-50 dark:text-white font-bold"
                                numberOfLines={2}>
                                {event.name}
                            </Text>
                            {isOwner &&
                                <Animated.View className="bg-orange-200 items-center rounded-lg p-1">
                                    <Text className="text-sm upper-case text-orange-600 font-bold">RESP.</Text>
                                </Animated.View>}
                        </View>
                        <View className="flex-row items-center ">
                            <IconSymbol name="person.2.fill" color="gray" size={16} />
                            <Text className="text-gray-600 dark:text-gray-400 text-sm">
                                {event?.attendees?.length} inscrit{event?.attendees?.length > 0 && "s"}
                            </Text>
                        </View>
                    </View>

                </View>
                <View>

                    {isAttendee &&
                        <Animated.View className="flex-row bg-green-200 rounded-lg items-center p-1">
                            <IconSymbol name="checkmark" color="green" size={14} />
                            <Text className="text-xs font-bold text-green-600">Inscrit</Text>
                        </Animated.View>

                    }
                </View>
            </View>

        </View>
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
    const { formatDate, formatDay , formatHour} = useI18nTime();

    const { data, hasNextPage, fetchNextPage, isLoading } = useGetEvents(String(id), {
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
                    <View className="gap-2 mb-5">
                        {/* <Search value={search} onChange={setSearch} /> */}

                        <View className="flex-row justify-between gap-5">
                            <Pressable className={`flex-1 shadow flex-row rounded-lg justify-center items-center p-2 ${onlyAttendee ? "bg-orange-200 dark:bg-orange-600 border border-orange-300" : "bg-white dark:bg-gray-900 dark:border dark:border-gray-600"}`}
                                onPress={() => setOnlyAttendee(!onlyAttendee)}>
                                <IconSymbol name="checkmark" color="orange" />
                                <Text className={`${onlyAttendee ? "font-bold" : ""} text-sm dark:text-white`}>Mes participations</Text>
                            </Pressable>
                            <Pressable className={`flex-1 shadow flex-row rounded-lg justify-center items-center p-2 ${onlyOwner ? "bg-orange-200 dark:bg-orange-600 border border-orange-300" : "bg-white dark:bg-gray-900 dark:border dark:border-gray-600"}`}
                                onPress={() => setOnlyOwner(!onlyOwner)}>
                                <IconSymbol name="bookmark.fill" color="orange" />
                                <Text className={`${onlyOwner ? "font-bold" : ""} text-sm dark:text-white`}>Mes responsabilités</Text>
                            </Pressable>
                        </View>
                        <Animated.ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-row my-2"
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
                }
                renderItem={({ item, index, }) =>
                    <View>
                        {showDay(events[index - 1], item) &&
                            <View className="border-b border-gray-200 p-1 mb-2">
                                <Text className="text-xl font-bold uppercase dark:text-white">
                                    {formatDay(item.startDate)}
                                </Text>
                            </View>
                        }
                        <View className="flex flex-row">
                            <View className="p-1 justify-around">
                                <Text className="text-gray-400">{formatHour(item.startDate)}</Text>
                                <Text className="text-gray-400">{formatHour(item.endDate)}</Text>
                            </View>
                            <Button className="flex-1 min-h-50 "
                                onPress={() => router.navigate({
                                    pathname: "/[id]/events/[eventId]",
                                    params: { id: String(id), eventId: item._id }
                                })}>
                                <EventItem event={item}
                                    user={me} />
                            </Button>
                        </View>

                    </View>

                }
                ItemSeparatorComponent={() => <View className="my-2" />}
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