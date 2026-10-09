import { EventIcon } from "@/components/events/EventIcon";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Screen } from "@/components/ui/Screen";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTrip } from "@/context/TripContext";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { containsUser } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import Animated from "react-native-reanimated";

const SectionTitle = ({ children, action, onAction }: {
    children: ReactNode,
    action?: string,
    onAction?: () => void
}) => (
    <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs font-extrabold uppercase tracking-widest text-amber-deep dark:text-amber">
            {children}
        </Text>
        {action &&
            <Pressable onPress={onAction}>
                <Text className="text-xs font-bold text-amber-deep dark:text-amber">
                    {action}
                </Text>
            </Pressable>
        }
    </View>
);

export default function EventDetails() {

    const { eventId } = useLocalSearchParams<{ eventId: string }>();
    const { trip, me } = useTrip();
    const isDark = useColorScheme() === "dark";
    const { formatDate, formatHour } = useI18nTime();

    const { data: event } = useGetEvent(trip?._id, eventId);
    const updateEvent = useUpdateEvent(trip?._id, eventId);

    const isAttendee = useMemo(() => !!me && containsUser(me, event?.attendees), [me, event]);

    const ownerIds = useMemo(
        () => new Set(event?.owners?.map(o => o._id) ?? []),
        [event?.owners]
    );
    const owner = event?.owners?.[0];

    const attendeesCount = event?.attendees?.length ?? 0;
    const namesLine = useMemo(() => {
        const names = (event?.attendees ?? []).map(
            u => `${u.name}${ownerIds.has(u._id) ? " (orga)" : ""}`
        );
        if (names.length === 0)
            return "";
        if (names.length === 1)
            return `${names[0]} participe`;
        if (names.length === 2)
            return `${names.join(" et ")} participent`;
        return `${names.slice(0, 2).join(", ")} et ${names.length - 2} autres participent`;
    }, [event?.attendees, ownerIds]);

    const onJoinClick = async () => {
        if (!event || !me)
            return;
        const newAttendees = isAttendee
            ? event.attendees?.filter(u => u._id !== me._id)
            : [...(event.attendees ?? []), me];
        await updateEvent.mutateAsync({
            ...event,
            attendees: newAttendees
        });
    }

    const goEdit = () => router.push({
        pathname: "/[id]/events/[eventId]/edit",
        params: { id: trip._id, eventId }
    });
    const goEditUsers = () => router.push({
        pathname: "/[id]/events/[eventId]/edit-users",
        params: { id: trip._id, eventId }
    });

    if (!event)
        return (
            <Screen className="bg-mist dark:bg-ink">
                <View className="mx-4 mt-2 rounded-3xl overflow-hidden">
                    <Skeleton height={220} />
                </View>
                <View className="gap-3 px-5 pt-10">
                    <Skeleton height={12} width={90} />
                    <Skeleton height={40} />
                    <Skeleton height={12} width={110} />
                    <Skeleton height={64} />
                </View>
            </Screen>
        );

    return (
        <Screen className="bg-mist dark:bg-ink">
            <Animated.ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>

                {/* --- Héro : illustration + identité de l'event --- */}
                <View className="mx-4 mt-2 rounded-3xl overflow-hidden">
                    <LinearGradient
                        colors={['#16265C', '#101736']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0.8 }}
                        style={{
                            alignItems: "center",
                            paddingHorizontal: 16,
                            paddingTop: 28,
                            paddingBottom: 56,
                        }}
                    >
                        <View className="h-30 w-30 rounded-full bg-amber/15 items-center justify-center my-3">
                            <EventIcon name={event?.type} size="lg" />
                        </View>

                        {event?.startDate ? (
                            <View className="flex-row items-center gap-1.5 bg-amber/20 border border-amber/45 rounded-full px-3 py-1.5">
                                <IconSymbol name="calendar" size={12} color="#F7B74A" />
                                <Text className="text-xs font-semibold text-amber" numberOfLines={1}>
                                    {formatDate(event.startDate, {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short"
                                    } as any)}
                                    {event.endDate ? ` · ${formatHour(event.startDate)} – ${formatHour(event.endDate)}` : ""}
                                </Text>
                            </View>
                        ) : (
                            <Pressable
                                onPress={goEdit}
                                className="flex-row items-center gap-1.5 border border-dashed border-amber/55 bg-white/5 rounded-full px-3 py-1.5"
                            >
                                <IconSymbol name="calendar" size={12} color="#F7B74A" />
                                <Text className="text-xs font-semibold text-white/70">
                                    Définir la date
                                </Text>
                            </Pressable>
                        )}

                        <Text className="text-2xl font-extrabold text-white text-center mt-3">
                            {event?.name}
                        </Text>
                        {owner &&
                            <Text className="text-sm text-white/60 mt-1">
                                Créé par {owner.name}
                            </Text>
                        }
                    </LinearGradient>
                </View>

                {/* --- CTA participation, chevauchant le héro --- */}
                <View className="items-center -mt-6 z-10">
                    <Button
                        key={isAttendee ? "attending-button" : "attend-button"}
                        variant="none"
                        onPress={onJoinClick}
                        isLoading={updateEvent.isPending}
                        // elevation : les classes shadow-* ne rendent pas sur Android.
                        style={{ elevation: isAttendee ? 3 : 8 }}
                        className={`flex-row items-center gap-2 py-3 rounded-full ${isAttendee
                            ? "px-6 bg-white dark:bg-night border-2 border-amber-deep"
                            : "px-8 bg-amber"
                            }`}
                    >
                        {isAttendee && !updateEvent.isPending &&
                            <IconSymbol name="checkmark" size={15} color="#EE8B33" />
                        }
                        <Text className={`text-sm font-extrabold tracking-wide ${isAttendee ? "text-amber-deep dark:text-amber" : "text-night"}`}>
                            {isAttendee ? "PARTICIPANT" : "PARTICIPER"}
                        </Text>
                    </Button>
                </View>

                <View className="px-5 pt-10 gap-7">

                    {/* --- Description --- */}
                    <View>
                        <SectionTitle>Description</SectionTitle>
                        {event?.details ? (
                            <Text className="text-[13.5px] leading-6 text-gray-500 dark:text-gray-400">
                                {event.details}
                            </Text>
                        ) : (
                            <Text className="text-sm italic text-gray-400">
                                Pas encore de description.{" "}
                                <Text
                                    onPress={goEdit}
                                    className="not-italic font-bold text-amber-deep dark:text-amber"
                                >
                                    Ajouter
                                </Text>
                            </Text>
                        )}
                    </View>

                    {/* --- Participants --- */}
                    <View>
                        <SectionTitle
                            action={attendeesCount > 0 ? "Modifier" : "Ajouter"}
                            onAction={goEditUsers}
                        >
                            Participants
                        </SectionTitle>
                        {attendeesCount > 0 ? (
                            <View className="flex-row items-center gap-2">
                                {event?.attendees?.slice(0, 3).map(u => (
                                    <View key={u._id} className="relative">
                                        <Avatar
                                            size2="sm"
                                            src={u.avatar}
                                            alt={u.name.charAt(0)}
                                        />
                                        {ownerIds.has(u._id) &&
                                            <View className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-deep items-center justify-center">
                                                <IconSymbol name="star.fill" size={8} color="white" />
                                            </View>
                                        }
                                    </View>
                                ))}
                                {attendeesCount > 3 &&
                                    <View className="h-10 w-10 rounded-full border border-dashed border-gray-300 dark:border-white/25 items-center justify-center">
                                        <Text className="text-xs text-gray-400">
                                            +{attendeesCount - 3}
                                        </Text>
                                    </View>
                                }
                                {me && isAttendee &&
                                    <Chip variant="contained" text="Moi" size="xsmall" />
                                }
                                <Text className="flex-1 ml-1 text-[13px] text-gray-500 dark:text-gray-400">
                                    {namesLine}
                                </Text>
                            </View>
                        ) : (
                            <Pressable onPress={goEditUsers} className="flex-row items-center gap-3">
                                <View className="h-10 w-10 rounded-full border border-dashed border-gray-300 dark:border-white/25 items-center justify-center">
                                    <IconSymbol name="plus" size={16} color="gray" />
                                </View>
                                <Text className="text-sm text-gray-400">
                                    Personne ne participe encore — sois le premier
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    {/* --- Actions --- */}
                    <View>
                        <SectionTitle>Actions</SectionTitle>
                        <View className="flex-row gap-2.5 mb-8">
                            <Pressable
                                onPress={() => router.push({
                                    pathname: "/[id]/goods",
                                    params: {
                                        id: trip._id,
                                        title: event.name,
                                        eventId
                                    }
                                })}
                                className="flex-1 flex-row items-center gap-2.5 rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 p-4 active:opacity-80"
                                style={{ elevation: 2 }}
                            >
                                <View className="h-9 w-9 rounded-xl bg-amber/20 items-center justify-center">
                                    <IconSymbol name="cart" size={17} color="#EE8B33" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[12.5px] font-bold text-night dark:text-white">
                                        Liste de course
                                    </Text>
                                    <Text className="text-[11px] text-gray-500 dark:text-gray-400">
                                        {event?.goodsCount ?? 0} article{(event?.goodsCount ?? 0) > 1 ? "s" : ""}
                                    </Text>
                                </View>
                            </Pressable>

                            <Pressable
                                onPress={() => router.push({
                                    pathname: "/[id]/chat",
                                    params: {
                                        id: trip._id,
                                        eventId,
                                        title: event.name
                                    }
                                })}
                                className="flex-1 flex-row items-center gap-2.5 rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 p-4 active:opacity-80"
                                style={{ elevation: 2 }}
                            >
                                <View className="h-9 w-9 rounded-xl bg-night/10 dark:bg-white/15 items-center justify-center">
                                    <IconSymbol name="message" size={17} color={isDark ? "#F6F8FD" : "#16265C"} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[12.5px] font-bold text-night dark:text-white">
                                        Discussion
                                    </Text>
                                    <Text className="text-[11px] text-gray-500 dark:text-gray-400">
                                        Fil de discussion
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>

                </View>
            </Animated.ScrollView>
        </Screen>
    )
}
