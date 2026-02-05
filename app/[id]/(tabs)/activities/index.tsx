import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Search } from "@/components/ui/Search";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvents } from "@/hooks/api/useEvents";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { Event, TripUser } from "@/types/models";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";

const showDay = (previous?: any, current?: any) => {
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


    const isAttendee = useMemo(() => event.attendees.map(u => u._id).includes(user?._id), [user, event]);
    const isOwner = useMemo(() => event.owners.map(u => u._id).includes(user?._id), [user, event])



    return (
        <View className={`shadow bg-white dark:bg-stone-600 rounded-lg py-3 px-2 ${isOwner ? "border-l-4 border-orange-400" : ""}`} >
            <View className="flex-row gap-2 items-center justify-between">
                <View className="flex-row">
                    <EventIcon name={event.type} size="md" />
                    <View className="flex gap-1">
                        <View className="flex-row max-w-40 items-start gap-1">
                            <Text className="text-lg text-gray-800 dark:text-white font-bold"
                                numberOfLines={2}>
                                {event.name}
                            </Text>
                            {isOwner &&

                                <Animated.View className="bg-orange-200 items-center rounded-lg p-1">
                                    <Text className="text-sm upper-case text-orange-600 font-bold">RESP.</Text>
                                </Animated.View>}
                        </View>
                        <View className="flex-row items-center ">
                            <IconSymbol name="person.2.fill" color="gray" />
                            <Text className="text-gray-600 dark:text-gray-400">{event?.attendees?.length} inscrit{event?.attendees?.length > 0 && "s"} </Text>
                        </View>
                    </View>

                </View>
                <View>

                    {isAttendee &&
                        <Animated.View className="flex-row bg-green-200 rounded-lg items-center p-1">
                            <IconSymbol name="checkmark" color="green" size={15} />
                            <Text className="text-xm font-bold text-green-600">Inscrit</Text>
                        </Animated.View>

                    }
                </View>
            </View>

        </View>
    )

}



export default function TripActivities() {

    const { id } = useLocalSearchParams();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [onlyAttendee, setOnlyAttendee] = useState(false);
    const [onlyOwner, setOnlyOwner] = useState(false);


    const router = useRouter();
    const { me } = useContext(TripContext);
    const { formatDate } = useI18nTime();

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
                        <Search value={search} onChange={setSearch} />
                        <View className="flex-row justify-between gap-5">
                            <Pressable className={`flex-1 shadow flex-row rounded-lg justify-center items-center p-2 ${onlyAttendee ? "bg-orange-200 dark:bg-orange-600 border border-orange-300" : "bg-white dark:bg-stone-800 dark:border dark:border-gray-600"}`}
                                onPress={() => setOnlyAttendee(!onlyAttendee)}>
                                <IconSymbol name="checkmark" color="orange" />
                                <Text className={`${onlyAttendee ? "font-bold" : ""} text-sm dark:text-white`}>Mes participations</Text>
                            </Pressable>
                            <Pressable className={`flex-1 shadow flex-row rounded-lg justify-center items-center p-2 ${onlyOwner ? "bg-orange-200 dark:bg-orange-600 border border-orange-300" : "bg-white dark:bg-stone-800 dark:border dark:border-gray-600"}`}
                                onPress={() => setOnlyOwner(!onlyOwner)}>
                                <IconSymbol name="bookmark.fill" color="orange" />
                                <Text className={`${onlyOwner ? "font-bold" : ""} text-sm dark:text-white`}>Mes responsabilités</Text>
                            </Pressable>
                        </View>
                        <Animated.ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-1 flex-row my-2"
                            contentContainerClassName="gap-5">
                            {typeFilters.map(item => (
                                <Pressable
                                    key={item.value}
                                    className={`shadow py-2 px-4 items-center rounded-full ${typeFilter === item.value ? "bg-orange-600 border-orange-400 " :"bg-white dark:bg-stone-800 border border-gray-600" }`}
                                    onPress={() => setTypeFilter(typeFilter === item?.value ? "" : item.value)}
                                >
                                    <Text className={`${typeFilter === item.value ? "font-bold text-white" : "dark:text-white"}`}>{item.label}</Text>
                                </Pressable>
                            ))}
                        </Animated.ScrollView>
                    </View>
                }
                renderItem={({ item, index, }) =>
                    <Button className="min-h-50" onPress={() => router.navigate({
                        pathname: "/[id]/(tabs)/activities/[activityId]",
                        params: { id: String(id), activityId: item._id }
                    })}>
                        <EventItem event={item}
                            user={me} />
                    </Button>
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
            <Pressable className="absolute bottom-10 right-6 w-20 h-20 rounded-full border border-white bg-blue-400 items-center justify-center shadow"
                onPress={() => router.push({
                    pathname: "/[id]/activities/new",
                    params: {
                        id: String(id)
                    }
                })}>
                <IconSymbol name="plus" color="white" size={40} />
            </Pressable>
        </Animated.View>
    )
}