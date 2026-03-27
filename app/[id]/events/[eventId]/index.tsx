import { EventIcon } from "@/components/events/EventIcon";
import { GoodBottomSheet } from "@/components/goods/GoodBottomSheet";
import { GoodsFlatList } from "@/components/goods/GoodsFlatList";
import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { RestrictionIcon } from "@/components/users/RestrictionIcon";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useCheckGood, useGetGoods } from "@/hooks/api/useGoods";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { translateRestriction } from "@/lib/userUtils";
import { containsUser } from "@/lib/utils";
import { Event, Good, TripUser } from "@/types/models";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";



const buildRestrictions = (event: Event) => {

    const a = event?.attendees?.flatMap(u => u.restrictions);
    const b = a?.reduce((acc, restriction) => {
        acc[restriction] = acc[restriction] || { name: restriction, count: 0 };
        acc[restriction].count++;
        return acc;
    }, {});

    return b;
}



const InfoTab = ({ event, me }: { event: Event, me: TripUser }) => {
    const restrictions = useMemo(() => event ? buildRestrictions(event) : {}, [event]);
    const [showAttendees, setShowAttendees] = useState(false);
    const { formatRange } = useI18nTime();

    return (

        <Animated.ScrollView>
            <View className="gap-2 mx-5 my-5 shadow-lg shadow-orange-200 bg-white dark:bg-gray-900 rounded-xl">
                <View className="flex-row p-2 gap-2 items-center">
                    <View className="rounded-full bg-orange-200 p-2">
                        <IconSymbol name="calendar" size={30} color="gray" />
                    </View>
                    <View>
                        <Text className="uppercase text-gray-600 dark:text-gray-400">
                            Date & Heure
                        </Text>
                        <Text className="font-bold dark:text-white">
                            Choisis une date pour l'activité
                        </Text>
                    </View>
                </View>
                <View className="flex-1 px-5  justify-center">
                    <View className="flex-1 h-0.5 bg-orange-200" />
                </View>
                <View className="flex-row p-2 gap-2 items-center">
                    <View className="rounded-full bg-blue-200 p-2">
                        <IconSymbol name="map" size={30} color="gray" />
                    </View>
                    <View>
                        <Text className="uppercase text-gray-600 dark:text-gray-400">
                            lieu de rendez-vous
                        </Text>
                        <Text className="font-bold dark:text-white">
                            Choisis un lieu
                        </Text>
                    </View>
                </View>
            </View>

            <View className="m-2 gap-1">
                <View className="flex-row justify-between items-end">
                    <View className="flex-row items-end gap-1">
                        <IconSymbol name="person.2.fill" color="orange" size={34} />
                        <Text className="text-2xl font-bold dark:text-white">Participants</Text>
                    </View>
                    <View className="bg-orange-200 p-2 rounded-full">
                        <Text className="text-orange-600 font-bold">
                            {event?.attendees?.length} inscrits
                        </Text>
                    </View>
                </View>
                <View className="gap-1 bg-white dark:bg-gray-900 rounded-xl">
                    {event?.attendees?.slice(0, 3).map((attendee) => (
                        <View
                            key={attendee._id}
                            className="flex-row p-2 rounded-xl gap-2 p-2 items-center border-b border-gray-600 dark:border-gray-200" >
                            <Avatar size2="sm" alt={attendee.name.charAt(0)} src={attendee?.avatar} />
                            <View>
                                <Text className="text-md dark:text-white">
                                    {attendee.name}
                                    {attendee._id === me._id &&
                                        <Text className="text-xs capitalize">
                                            (Moi)
                                        </Text>}
                                </Text>
                                <View className="flex-row gap-2 items-center">
                                    {containsUser(attendee, event.owners) && (
                                        <Text className="text-sm capitalize text-gray-600 dark:text-gray-400">
                                            Responsable
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                    {event?.attendees?.length > 0 ?
                        <Button
                            onPress={() => setShowAttendees(true)}
                            className="justify-center flex-row items-center p-2">
                            <Text className="font-bold text-md text-center text-gray-600 dark:text-gray-200">
                                Voir tout
                            </Text>
                        </Button>
                        :
                        <View className="py-2">

                            <Text className="dark:text-white">
                                Aucun participants
                            </Text>
                        </View>
                    }
                </View>
            </View>
            {event.type === "MEAL" &&
                <View className="m-2">
                    <View className="flex-row gap-2 items-end mb-1">
                        <IconSymbol name="info.circle" color="orange" size={34} />
                        <Text className="max-w-50 font-bold dark:text-white text-xl" numberOfLines={2}>
                            Restrictions alimentaires
                        </Text>
                    </View>

                    <View className="gap-2 p-2 rounded-xl">
                        {Object.values(restrictions)?.map((restriction, index) =>
                            <View key={restriction.name}
                                className={`flex-row p-2 items-center justify-between ${index !== Object(restrictions).length ? "border-b border-gray-200" : ""} `}>
                                <View className="flex-row items-center  gap-2">
                                    <View className="bg-orange-200 dark:bg-gray-200 rounded-full p-1 ">
                                        <RestrictionIcon value={restriction.name} size="sm" />
                                    </View>
                                    <Text className="font-bold text-md dark:text-white capitalize" numberOfLines={2}>{translateRestriction(restriction.name)}</Text>
                                </View>
                                <View className="bg-orange-200 border rounded-lg p-1">
                                    <Text className="font-bold text-lg">{restriction.count}</Text>
                                </View>

                            </View>
                        )}
                        {Object.values(restrictions)?.length === 0 &&
                            <Animated.View className="">
                                <Text className="dark:text-white font-bold text-lg">Aucune restrictions</Text>
                            </Animated.View>}
                    </View>
                </View>
            }

            <View className="m-2">
                <Text className="text-xl capitalize font-bold ml-2 dark:text-white">
                    Détails
                </Text>
                <Text className="dark:text-white">
                    {event?.details ? event.details : "Pas de détails"}
                </Text>
            </View>

            <View className="my-5 mx-5">
                <Button
                    onPress={() => router.push({
                        pathname: "/[id]/events/[eventId]/edit",
                        params: {
                            id: String(event.trip),
                            eventId: event._id
                        }
                    })}
                    className="flex-row bg-blue-400 dark:bg-blue-600 items-center justify-center rounded-full p-4 my-5"
                >
                    <IconSymbol name="pencil" color="white" size={16} />
                    <Text className="font-bold text-white">Modifier</Text>
                </Button>
            </View>


            <PickUsersModal open={showAttendees}
                onClose={() => setShowAttendees(false)}
                users={event?.attendees}
                disabled
                title="Participants"
                showRestrictions
            />
        </Animated.ScrollView>
    )
}


const GoodsTab = ({ event }: { event: Event }) => {



    const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetGoods(event.trip, {
        event: event._id
    });
    const checkGood = useCheckGood(event.trip);

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const queryClient = useQueryClient();

    const { me } = useContext(TripContext);
    const [selectedGood, setSelectedGood] = useState<Good | null>();


    return (
        <View className="flex-1">
            <GoodsFlatList
                goods={goods}
                isRefreshing={isLoading}
                isFetching={isFetching || isFetchingNextPage}
                onCheck={async (good) => await checkGood.mutateAsync(good)}
                onRefresh={() => queryClient.invalidateQueries({ queryKey: ["trips", event.trip, "goods"] })}
                onClick={setSelectedGood}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                disabled={checkGood?.isPending}
            />
            <GoodBottomSheet good={selectedGood}
                trip={{
                    _id: event.trip
                }}
                open={!!selectedGood}
                onClose={() => setSelectedGood(null)} />

            <Pressable className="absolute bottom-10 right-6 p-2 rounded-full border border-white bg-orange-400 items-center justify-center shadow"
                onPress={() => setSelectedGood(
                    {
                        _id: "",
                        name: "",
                        quantity: "",
                        createdBy: me,
                        trip: {
                            _id: event.trip
                        },
                        event
                    })}>
                <IconSymbol name="plus" color="white" size={26} />
            </Pressable>
        </View>
    );
}


export default function EventDetails() {

    const { id, eventId } = useLocalSearchParams();
    const { me } = useContext(TripContext);

    const { data: event } = useGetEvent(id, eventId);
    const updateEvent = useUpdateEvent(id, eventId);



    const isAttendee = useMemo(() => containsUser(me, event?.attendees), [me, event]);
    const isOwner = useMemo(() => containsUser(me, event?.owners), [me, event])

    const [tabValue, setTabValue] = useState("info");

    // Deprecated
    const handleJoin = async () => {

        const newAttendees = event?.attendees;
        newAttendees?.push(me);
        await updateEvent.mutateAsync({
            ...event,
            attendees: newAttendees
        });
    }

    const onJoinClick = async () => {
        let newAttendees = event?.attendees;
        if (isAttendee) {
            newAttendees = newAttendees?.filter(u => u._id !== me._id);
        } else {
            newAttendees?.push(me);
        }
        await updateEvent.mutateAsync({
            ...event,
            attendees: newAttendees
        });
    }
    const onOwnershipClick = async () => {
        let newOwners = event?.owners;
        if (isOwner) {
            newOwners = newOwners?.filter(u => u._id !== me._id);
        } else {
            newOwners?.push(me);
        }
        await updateEvent.mutateAsync({
            ...event,
            owners: newOwners
        });
    }

    if (!event)
        return (
            <SafeAreaView style={styles.container}>
                <View className="items-center gap-2">
                    <Skeleton variant="circular" height={20} />
                    <View className="w-60">
                        <Skeleton height={10} />
                    </View>
                    <View className="flex-row gap-2">
                        <View className="w-20">
                            <Skeleton height={10} />
                        </View>
                        <View className="w-20">
                            <Skeleton height={10} />
                        </View>
                    </View>

                    <View className="w-[80%]">
                        <Skeleton height={40} />
                    </View>
                    <View className="w-full">
                        <Skeleton height={60} />
                    </View>
                </View>
            </SafeAreaView>
        );

    return (
        <SafeAreaView style={styles.container}>

            <View className="flex items-center gap-2">

                <View className="absolute left-1 top-5 ">
                    <Pressable
                        onPress={() => router.dismissTo({
                            pathname: "/[id]/(tabs)/planning",
                            params: {
                                id: String(id)
                            }
                        })}
                        className="bg-gray-200 rounded-full h-10 w-10 p-2 justify-center items-center flex">
                        <IconSymbol name="arrow.left" color="black" />
                    </Pressable>
                </View>
                <EventIcon name={event?.type} size="lg" />
                <Text className="text-4xl font-bold dark:text-white">
                    {event?.name}
                </Text>

                <View className="flex-row justify-center gap-1">
                    <Pressable
                        disabled={updateEvent.isPending}
                        onPress={onOwnershipClick}
                        className={`flex items-center rounded-xl p-2  border  ${isOwner ? "bg-orange-200 border-orange-600" : "bg-white dark:bg-gray-900 border-gray-600"}`}>
                        <Text className={` ${isOwner ? "text-orange-600 font-bold" : "dark:text-white"}`}>
                            Responsable
                        </Text>
                    </Pressable>

                    <Pressable
                        disabled={updateEvent.isPending}
                        onPress={onJoinClick}
                        className={`flex items-center rounded-xl p-2  border  ${isAttendee ? "bg-blue-200 border-blue-600" : "bg-white dark:bg-gray-900 border-gray-600"}`}>
                        <Text className={` ${isAttendee ? "text-blue-600 font-bold" : "dark:text-white"}`}>
                            Inscrit
                        </Text>
                    </Pressable>

                    {/* {isOwner &&
                        <Animated.View
                            entering={FadeIn}
                            exiting={FadeOut}
                            className="flex items-center rounded-xl p-2 bg-orange-200 border border-orange-600">
                            <Text className="text-orange-600 font-bold">
                                Responsable
                            </Text>
                        </Animated.View>
                    }

                    {isAttendee &&
                        <Animated.View
                            entering={FadeIn}
                            exiting={FadeOut}
                            className="flex items-center rounded-xl p-2 bg-blue-200 border border-blue-600">
                            <Text className="text-blue-600 font-bold">
                                Inscrit
                            </Text>
                        </Animated.View>} */}

                </View>
            </View>

            {/* Tabs button */}
            <View className="flex-row mx-10 justify-center rounded-full my-2 bg-orange-200 rounded-full border border-orange-600si tu ">
                <Pressable
                    onPress={() => setTabValue("info")}
                    className={`flex-1 flex-row rounded-l-full p-2 items-center justify-center ${tabValue === "info" && "bg-orange-400"}`}>
                    <IconSymbol name="list.dash" color={tabValue === "info" ? "white" : "black"} />
                    <Text className={`${tabValue === "info" && "font-bold text-white"}`}>
                        Informations
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setTabValue("goods")}
                    className={`flex-1 flex-row bg-orange-200 rounded-r-full justify-center  items-center ${tabValue === "goods" && "bg-orange-400"}`}>
                    <IconSymbol name="cart" color={tabValue === "goods" ? "white" : "black"} />
                    <Text className={`${tabValue === "goods" && "font-bold text-white"}`}>
                        Liste de course
                    </Text>
                </Pressable>

            </View>

            {tabValue === "info" &&
                <Animated.View entering={ZoomIn} className="m-2 flex-1">
                    <InfoTab
                        event={event}
                        me={me} />
                </Animated.View>
            }
            {tabValue === "goods" &&
                <Animated.View entering={ZoomIn}
                    className="m-2 flex-1">
                    <GoodsTab
                        event={event} />
                </Animated.View>
            }

        </SafeAreaView>
    )
}