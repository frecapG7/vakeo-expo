import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { useTrip } from "@/context/TripContext";
import { useGetEvents } from "@/hooks/api/useEvents";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";
import { Event, TripUser } from "@/types/models";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
    },
    {
        value: "TRANSPORT",
        icon: "map",
        label: "Transport"
    },
    {
        value: "EXCURSION",
        icon: "smiley",
        label: "Excursion"
    },
    {
        value: "OTHER",
        icon: "star",
        label: "Autre"
    }
]

/** Clé de section pour les events sans date (pas d'en-tête de jour rendu). */
const SANS_DATE_KEY = "sans-date";

type DaySection = { key: string, data: Event[] };

/**
 * Regroupe les events par jour, en conservant l'ordre d'apparition.
 * Les events sans startDate forment une section sans en-tête (comportement
 * historique : ils s'affichent sans titre de jour). GroupBy front assumé :
 * l'API pagine en cursor plat, le jour est une notion de vue uniquement.
 */
const toDaySections = (events: Event[]): DaySection[] => {
    const sections: DaySection[] = [];
    const sectionsByKey = new Map<string, DaySection>();
    for (const event of events) {
        const key = event.startDate ? dayjs(event.startDate).format("YYYY-MM-DD") : SANS_DATE_KEY;
        let section = sectionsByKey.get(key);
        if (!section) {
            section = { key, data: [] };
            sectionsByKey.set(key, section);
            sections.push(section);
        }
        section.data.push(event);
    }
    return sections;
};

const EventItem = ({ event, user, onPress }: { event: Event, user?: TripUser | null, onPress: () => void }) => {
    const isAttendee = useMemo(() => !!user && !!event.attendees?.map(u => u._id).includes(user._id), [user, event]);

    return (
        <Button
            onPress={onPress}
            className="flex-row items-center rounded-2xl bg-white dark:bg-night shadow-md mx-2 p-4 gap-4 border border-mist dark:border-white/10">
            <View className="flex-row gap-3 items-center">
                <View className="mt-1">
                    <EventIcon name={event.type as any} size="md" />
                </View>
                <View className="flex-1 gap-2 justify-between">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2 flex-1">
                            <Text className="text-lg text-night dark:text-white font-bold flex-1"
                                numberOfLines={2}>
                                {event.name}
                            </Text>
                        </View>
                        {isAttendee &&
                            <Animated.View className="flex-row bg-amber/40 rounded-lg items-center px-2 py-1">
                                <IconSymbol name="checkmark" color="#EE8B33" size={14} />
                                <Text className="text-xs font-bold text-night dark:text-amber">Participant</Text>
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
                                {event?.goodsCount ?? 0}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Button>
    )
}

export default function TripPlanning() {

    const { id } = useGlobalSearchParams<{id: string}>();
    const [typeFilter, setTypeFilter] = useState("");
    const [onlyAttendee, setOnlyAttendee] = useState(false);


    const router = useRouter();
    const { me, trip } = useTrip();
    const { formatDay } = useI18nTime();

    const { data, hasNextPage, fetchNextPage, isLoading, refetch, isRefetching } = useGetEvents(trip?._id, {
        type: typeFilter,
        ...(onlyAttendee && { attendee: String(me?._id) }),
    }, {
        enabled: !!trip?._id,
    });

    const events = useMemo(() => data?.pages.flatMap((page) => page?.events), [data?.pages]);
    const sections = useMemo(() => toDaySections(events || []), [events]);

    return (
        <Animated.View className="flex-1 bg-mist dark:bg-ink">
            <SectionList
                sections={sections}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                stickySectionHeadersEnabled
                ListHeaderComponent={
                    <View className="gap-4 my-2">
                        <View className="">
                            <Animated.ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="flex-row "
                                contentContainerClassName="gap-3 px-2 my-2">
                                {typeFilters.map(item => (
                                    <Pressable
                                        key={item.value}
                                        className={`py-2 px-4 items-center rounded-full ${typeFilter === item.value ? "bg-amber-deep border-amber " : "bg-white dark:bg-night border border-gray-200 dark:border-white/15"}`}
                                        onPress={() => setTypeFilter(typeFilter === item?.value ? "" : item.value)}
                                    >
                                        <Text className={`${typeFilter === item.value ? "font-bold text-night" : "text-night dark:text-white"}`}>
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </Animated.ScrollView>
                        </View>
                        <View className="flex-row justify-start gap-5">
                            <Pressable className={`w-[48%] shadow flex-row rounded-full justify-center items-center gap-1 p-2 ${onlyAttendee ? "bg-amber/40 dark:bg-amber/25 border border-amber" : "bg-white dark:bg-night border border-gray-200 dark:border-white/15"}`}
                                onPress={() => setOnlyAttendee(!onlyAttendee)}>
                                {onlyAttendee &&
                                    <Animated.View entering={FadeIn} exiting={FadeOut} className="rounded-full bg-amber-deep p-1">
                                        <IconSymbol name="checkmark" color="white" size={14} />
                                    </Animated.View>
                                }
                                <Text className={`${onlyAttendee ? "font-bold text-night dark:text-white" : ""} text-sm text-night dark:text-white`}>Mes participations</Text>
                            </Pressable>
                        </View>
                    </View>
                }
                renderSectionHeader={({ section }) =>
                    section.key === SANS_DATE_KEY ? null : (
                        <View className="bg-mist dark:bg-ink border-b border-amber-deep dark:border-white/20 p-1 mt-6">
                            <Text className="text-xl font-bold uppercase text-amber-deep dark:text-white">
                                {formatDay(section.key)}
                            </Text>
                        </View>
                    )
                }
                renderItem={({ item }) =>
                    <View className="pb-2">
                        <EventItem event={item}
                            user={me}
                            onPress={() => trip?._id && router.navigate({
                                pathname: "/[id]/events/[eventId]",
                                params: { id: String(id), eventId: item._id }
                            })} />
                    </View>

                }
                keyExtractor={(item) => item?._id}
                ListEmptyComponent={
                    isLoading ?
                        <View className="gap-3 mx-2">
                            <Skeleton height={96} />
                            <Skeleton height={96} />
                        </View>
                        :
                        <View className="my-5 flex-1 flex-grow justify-center">
                            <Text className="text-2xl text-night dark:text-white text-center">
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
            {trip?._id && (
                <FloatingAddButton onPress={() => router.push({
                    pathname: "/[id]/events/new",
                    params: {
                        id: String(id)
                    }
                })} />
            )}
        </Animated.View>
    )
}
