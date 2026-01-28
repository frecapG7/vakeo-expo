import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Search } from "@/components/ui/Search";
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
    // {
    //     value: "RESTAURANT",
    //     icon: "suit.spade",
    //     label: "Restaurant"
    // },
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



const EventItem = ({ event, onPress, user }: { event: Event, onPress: () => void, user: TripUser }) => {


    const isAttendee = useMemo(() => event.attendees.map(u => u._id).includes(user?._id), [user, event]);
    const isOwner = useMemo(() => event.owners.map(u => u._id).includes(user?._id), [user, event])

    return (
        <Button className="flex-1 bg-blue-100  dark:bg-gray-400 rounded-lg shadow border border-orange-400 dark:border-gray-100" onPress={onPress}>

            <View className="flex-row py-1 shadow justify-between">
                <View>
                    <Text className="text-2xl text-blue-800 dark:text-white font-bold" numberOfLines={1}>
                        {event.name}
                    </Text>
                </View>
                <EventIcon name={event.type} size="sm"/>
            </View>

            <View className="rounded-t-xl bg-white dark:bg-black  border-blue-200 border p-2 gap-2">

                <View className="flex-row  flex-1 items-center gap-2">
                    <EventIcon name={event?.type} size="sm" />
                    <Text className="capitalize text-gray-400">{toLabel(event)}</Text>
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


        </Button>
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

    const { data, hasNextPage, fetchNextPage } = useGetEvents(String(id), {
        type: typeFilter,
        ...(onlyAttendee && { attendees: me?._id }),
        ...(onlyOwner && { owners: me?._id }),
    }, {
        enabled: !!id,
    });
    const events = useMemo(() => data?.pages.flatMap((page) => page?.events), [data?.pages]);


    return (
        // <SafeAreaView style={styles.container}>
        <Animated.View style={styles.container}>
            <Animated.FlatList
                data={events || []}
                ListHeaderComponent={
                    <View className="gap-2">
                        <Search value={search} onChange={setSearch} />
                        <Animated.ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-1 flex-row gap-5">
                            {typeFilters.map(item => (
                                <Pressable key={item.value}
                                    onPress={() => setTypeFilter(typeFilter === item?.value ? "" : item.value)}
                                    className="mx-4 items-center">
                                    <View className={`rounded-full p-2 ${typeFilter === item.value ? "rounded-full bg-blue-200 dark:bg-gray-200" : ""}`}>
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




        // </SafeAreaView>
    )
}