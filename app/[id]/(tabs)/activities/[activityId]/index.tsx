import { EventIcon } from "@/components/events/EventIcon";
import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { RestrictionIcon } from "@/components/users/RestrictionIcon";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useGetGoodSummary } from "@/hooks/api/useGoods";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { translateRestriction } from "@/lib/userUtils";
import { containsUser } from "@/lib/utils";
import { Event } from "@/types/models";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
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


const ActivityGoodsWidget = ({ event, onPress }: { event: Event, onPress: () => void }) => {

    const { data: goodSummary } = useGetGoodSummary(event.trip, event._id);

    if (!goodSummary)
        return (
            <View>
                <View className="flex-row gap-1 items-center">
                    <IconSymbol name="cart" size={36} color="orange" />
                    <Text className="font-bold capitalize dark:text-white">
                        à apporter
                    </Text>
                </View>
                <Skeleton height={40} />
            </View>

        )

    return (
        <View>
            <View className="flex-row justify-between items-center">
                <View className="flex-row gap-1 items-end">
                    <IconSymbol name="cart" size={36} color="orange" />
                    <Text className="font-bold capitalize dark:text-white text-xl">
                        panier
                    </Text>
                </View>
                {goodSummary?.totalCount > 0 &&
                    <View className="bg-gray-200 rounded-full px-2 py-1">
                        <Text>
                            {goodSummary?.checkedCount} / {goodSummary?.totalCount}
                        </Text>
                    </View>

                }
            </View>

            {goodSummary.totalCount > 0 ?

                <View className="rounded-xl p-2  bg-white dark:bg-gray-900">
                    {goodSummary?.goods.map((good) => (
                        <View
                            key={good._id}
                            className="flex-row gap-2 p-1">
                            <IconSymbol name={good.checked ? "checkmark.circle.fill" : "circle"} color={good.checked ? "green" : "gray"} />

                            <Text className={`${good.checked ? "line-through text-gray-400" : "dark:text-white"} `}>
                                <Text className="text-lg capitalize">
                                    {good?.name}
                                </Text>
                                {good?.quantity &&
                                    <Text className="text-md10">
                                        ({good.quantity})
                                    </Text>
                                }
                            </Text>
                        </View>
                    ))}

                    <Button
                        onPress={onPress}
                        className="border-t border-gray-600 dark:border-gray-200 p-2 m-2">
                        <Text className="text-center text-gray-600 dark:text-gray-200 font-bold">
                            Voir tout
                        </Text>
                    </Button>
                </View>
                :
                <Pressable
                    onPress={onPress}
                    className="bg-white dark:bg-gray-400 flex-row border border-dashed dark:border-gray-200 justify-center items-center py-2 rounded-xl">
                    <IconSymbol name="plus" size={15} color="black" />
                    <Text>Ajouter</Text>
                </Pressable>

            }
        </View>

    )


}




export default function TripActivityDetails() {

    const { id, activityId } = useLocalSearchParams();
    const { me } = useContext(TripContext);

    const { data: activity } = useGetEvent(id, activityId);
    const updateEvent = useUpdateEvent(id, activityId);

    const [showAttendees, setShowAttendees] = useState(false);


    const { formatRange } = useI18nTime();
    const isAttendee = useMemo(() => containsUser(me, activity?.attendees), [me, activity]);
    const isOwner = useMemo(() => containsUser(me, activity?.owners), [me, activity])


    const restrictions = useMemo(() => activity ? buildRestrictions(activity) : {}, [activity]);


    // Deprecated
    const handleJoin = async () => {

        const newAttendees = activity?.attendees;
        newAttendees?.push(me);
        await updateEvent.mutateAsync({
            ...activity,
            attendees: newAttendees
        });
    }

    const onJoinClick = async () => {
        let newAttendees = activity?.attendees;
        if (isAttendee) {
            newAttendees = newAttendees?.filter(u => u._id !== me._id);
        } else {
            newAttendees?.push(me);
        }
        await updateEvent.mutateAsync({
            ...activity,
            attendees: newAttendees
        });
    }
    const onOwnershipClick = async () => {
        let newOwners = activity?.owners;
        if (isOwner) {
            newOwners = newOwners?.filter(u => u._id !== me._id);
        } else {
            newOwners?.push(me);
        }
        await updateEvent.mutateAsync({
            ...activity,
            owners: newOwners
        });
    }

    if (!activity)
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
        <Animated.ScrollView className="flex gap-2">

            <View className="flex items-center gap-2">

                <View className="absolute left-1 top-5 ">
                    <Pressable
                        onPress={() => router.dismissTo({
                            pathname: "/[id]/(tabs)/activities",
                            params: {
                                id: String(id)
                            }
                        })}
                        className="bg-gray-200 rounded-full h-10 w-10 p-2 justify-center items-center flex">
                        <IconSymbol name="arrow.left" color="black" />
                    </Pressable>
                </View>
                <EventIcon name={activity?.type} size="lg" />
                <Text className="text-4xl font-bold dark:text-white">
                    {activity?.name}
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
                            {activity?.attendees?.length} inscrits
                        </Text>
                    </View>
                </View>

                <View className="gap-1 bg-white dark:bg-gray-900 rounded-xl">
                    {activity?.attendees?.slice(0, 3).map((attendee) => (
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
                                    {containsUser(attendee, activity.owners) && (
                                        <Text className="text-sm capitalize text-gray-600 dark:text-gray-400">
                                            Responsable
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                    {activity?.attendees?.length > 0 ?
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

            <View className="m-2">
                <ActivityGoodsWidget
                    event={activity}
                    onPress={() => router.push({
                        pathname: "/[id]/(tabs)/activities/[activityId]/goods",
                        params: {
                            id: String(id),
                            activityId: String(activity._id)
                        }
                    })} />
            </View>




            {activity.type === "MEAL" &&
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
                    {activity?.details ? activity.details : "Pas de détails"}
                </Text>
            </View>

            <View className="my-5 mx-5">
                <Button
                    onPress={() => router.push({
                        pathname: "/[id]/(tabs)/activities/[activityId]/edit",
                        params: {
                            id: String(id),
                            activityId: activity._id
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
                users={activity?.attendees}
                disabled
                title="Participants"
                showRestrictions
            />

        </Animated.ScrollView >
    )
}