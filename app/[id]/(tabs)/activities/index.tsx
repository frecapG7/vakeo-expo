import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Search } from "@/components/ui/Search";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvents } from "@/hooks/api/useEvents";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { toLabel } from "@/lib/eventUtils";
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



const EventItem = ({ event,  user }: { event: Event, user: TripUser }) => {


    const isAttendee = useMemo(() => event.attendees.map(u => u._id).includes(user?._id), [user, event]);
    const isOwner = useMemo(() => event.owners.map(u => u._id).includes(user?._id), [user, event])

    return (
        <View className="flex-1 bg-blue-200  dark:bg-gray-400 rounded-t-lg shadow dark:border-gray-100 justify-betweens">

            <View className="flex-row p-1 shadow justify-between items-center">
                <View>
                    <Text className="text-2xl text-gray-800 dark:text-white font-bold" numberOfLines={1}>
                        {event.name}
                    </Text>
                </View>
                <View className="items-center mr-5">
                    <EventIcon name={event.type} size="sm" />
                    <Text className="text-xs capitalize">{toLabel(event)}</Text>
                </View>
            </View>

            <View className="rounded-t-xl bg-yellow-50 dark:bg-gray-900 shadow  border-blue-200 border p-2 gap-2">

                <View className="flex-row flex-1 items-center gap-2">
                    <IconSymbol name="clock" color="gray" />
                    <Text className="text-gray-400">
                        {event?.startDate ? "TODO" : "A spécifier"}
                    </Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <IconSymbol name="person.2.fill" color="gray" />
                    <Text className="text-gray-400">{event?.attendees.length} participants</Text>
                </View>
                {/* {event.owners?.length > 0 &&
                    <View className="flex-row gap-1">
                        <Text numberOfLines={1} className="max-w-0">
                            {event.owners.map(o => o.name).join(", ")}
                        </Text>
                        <Text>{event.owners.length > 1 ? "sont responsables" : "est responsable"}</Text>
                    </View>
                } */}

                <View className="justify-end flex-row gap-4 items-center ">
                    {isAttendee &&
                        <Chip text="Je participe" />
                    }
                    {isOwner &&
                        <Chip text="Je suis responsable" />
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
                        <Animated.ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-1 flex-row">
                            {typeFilters.map(item => (
                                <Pressable key={item.value}
                                    onPress={() => setTypeFilter(typeFilter === item?.value ? "" : item.value)}
                                    className="mx-2 items-center">
                                    <View className={`p-3 ${typeFilter === item.value ? "bg-blue-200 dark:bg-gray-200 rounded-full" : ""}`}>
                                        <EventIcon name={item.value} color={typeFilter === item.value ? "black" : "gray"} size="md" />
                                    </View>
                                    <Text className="font-bold dark:text-white">{item.label}</Text>
                                </Pressable>
                            ))}
                        </Animated.ScrollView>
                        <Animated.ScrollView horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerClassName="flex-1 flex-row justify-around">
                            <Chip text="Je participe"
                                onPress={() => setOnlyAttendee(!onlyAttendee)}
                                variant={onlyAttendee ? "contained" : "outlined"} />
                            <Chip text="Je suis responsable"
                                onPress={() => setOnlyOwner(!onlyOwner)}
                                variant={onlyOwner ? "contained" : "outlined"} />
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
                ItemSeparatorComponent={() => <View className="my-5" />}
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