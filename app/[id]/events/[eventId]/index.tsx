import { EventIcon } from "@/components/events/EventIcon";
import { EventsGoodsList } from "@/components/events/EventsGoodsList";
import { EventUserList } from "@/components/events/EventsUsersList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { containsUser } from "@/lib/utils";
import { Event, TripUser } from "@/types/models";
import { useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue, ZoomIn } from "react-native-reanimated";
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

            <View className="m-2">
                <Text className="text-xl capitalize font-bold ml-2 dark:text-white">
                    Détails
                </Text>
                <Text className="dark:text-white">
                    {event?.details ? event.details : "Pas de détails"}
                </Text>
            </View>
        </Animated.ScrollView>
    )
}



export default function EventDetails() {

    const { id, eventId } = useLocalSearchParams();
    const { me } = useContext(TripContext);

    const { data: event } = useGetEvent(id, eventId);
    const updateEvent = useUpdateEvent(id, eventId);



    const isAttendee = useMemo(() => containsUser(me, event?.attendees), [me, event]);
    const isOwner = useMemo(() => containsUser(me, event?.owners), [me, event])

    const [tabValue, setTabValue] = useState("info");

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

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
            <Animated.ScrollView onScroll={scrollHandler}>

                <View className="flex items-center gap-2">
                    <EventIcon name={event?.type} size="lg" />
                    <Text className="text-2xl font-bold dark:text-white">
                        {event?.name} - {scrollY?.value}
                    </Text>

                    <View className="flex-row justify-center gap-1">
                        {/* <Pressable
                        disabled={updateEvent.isPending}
                        onPress={onOwnershipClick}
                        className={`flex items-center rounded-xl p-2  border  ${isOwner ? "bg-orange-200 border-orange-600" : "bg-white dark:bg-gray-900 border-gray-600"}`}>
                        <Text className={` ${isOwner ? "text-orange-600 font-bold" : "dark:text-white"}`}>
                            Responsable
                        </Text>
                    </Pressable> */}

                        <Pressable
                            disabled={updateEvent.isPending}
                            onPress={onJoinClick}
                            className={`flex items-center rounded-xl p-2  border  ${isAttendee ? "bg-blue-200 border-blue-600" : "bg-white dark:bg-gray-900 border-blue-400"}`}>
                            <Text className={` ${isAttendee ? "text-blue-600 font-bold" : "text-blue-200"} uppercase`}>
                                {isAttendee ? "Inscrit" : "S'inscrire"}
                            </Text>
                        </Pressable>

                    </View>
                </View>

                {/* Tabs button */}
                <View className="flex-row mx-10 justify-center rounded-full my-2 bg-orange-200 rounded-full border border-orange-600si tu ">
                    <Pressable
                        onPress={() => setTabValue("info")}
                        className={`flex-1 flex-row rounded-l-full p-2 items-center justify-center ${tabValue === "info" && "bg-orange-400"}`}>
                        <IconSymbol name="doc.plaintext" color={tabValue === "info" ? "white" : "black"} />
                    </Pressable>
                    <Pressable
                        onPress={() => setTabValue("goods")}
                        className={`flex-1 flex-row bg-orange-200 justify-center  items-center border-x ${tabValue === "goods" && "bg-orange-400"}`}>
                        <IconSymbol name="list.dash" color={tabValue === "goods" ? "white" : "black"} />
                    </Pressable>
                    <Pressable
                        onPress={() => setTabValue("users")}
                        className={`flex-1 flex-row bg-orange-200 rounded-r-full justify-center  items-center ${tabValue === "users" && "bg-orange-400"}`}>
                        <IconSymbol name="person.2.fill" color={tabValue === "users" ? "white" : "black"} />
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
                        <EventsGoodsList event={event} />
                    </Animated.View>
                }
                {tabValue === "users" &&
                    <Animated.View entering={ZoomIn}
                        className="m-2 flex-1">
                        <EventUserList
                            event={event}
                            selected={me} />
                    </Animated.View>
                }

            </Animated.ScrollView>
        </SafeAreaView>
    )
}