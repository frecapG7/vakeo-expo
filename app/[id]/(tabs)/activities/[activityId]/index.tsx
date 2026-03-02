import { EventIcon } from "@/components/events/EventIcon";
import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { RestrictionIcon } from "@/components/users/RestrictionIcon";
import { TripContext } from "@/context/TripContext";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { useGetGoodSummary } from "@/hooks/api/useGoods";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { translateRestriction } from "@/lib/userUtils";
import { containsUser } from "@/lib/utils";
import { Event } from "@/types/models";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
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
                    <IconSymbol name="bag.fill" size={36} color="orange" />
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
                <View className="flex-row gap-1 items-center">
                    <IconSymbol name="bag.fill" size={36} color="orange" />
                    <Text className="font-bold capitalize dark:text-white">
                        à apporter
                    </Text>
                </View>
                <View className="bg-gray-200 rounded-full px-2 py-1">
                    <Text>
                        {goodSummary?.checkedCount} / {goodSummary?.totalCount}
                    </Text>
                </View>
            </View>


            <View className="border rounded-xl p-2 border-orange-400 dark:border-gray-400">
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
                    className="bg-blue-50 dark:bg-neutral-800 border border-blue-200 dark:border-gray-200 border-dashed rounded-xl p-1 m-2">
                    <Text className="text-center dark:text-white">{goodSummary.totalCount > 0 ? "Voir tout" : "Ajouter +"}</Text>
                </Button>
            </View>
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


    const handleJoin = async () => {
        const newAttendees = activity?.attendees;
        newAttendees?.push(me);
        await updateEvent.mutateAsync({
            ...activity,
            attendees: newAttendees
        });
    }

    if (!activity)
        return (
            <SafeAreaView>
                <View className="gap-2 px-5">
                    <View className="flex-row items-center gap-2">

                        <Chip text="Je participe" />
                        <View className="w-20">
                            <Skeleton variant="rectangular" />
                        </View>
                    </View>

                    <View className="flex-row gap-5 items-center py-2" >
                        <IconSymbol name="smiley" color="gray" size={34} />
                        <View className="flex-row flex-1 border-b items-center gap-5">
                            <Skeleton variant="circular" />
                            <View className="w-10">
                                <Skeleton height={5} />
                            </View>
                        </View>
                    </View>
                    <View className="flex-row gap-5 items-center py-2" >
                        <IconSymbol name="cart" color="gray" size={34} />
                        <View className="w-20">
                            <Skeleton variant="rectangular" />
                        </View>
                    </View>


                </View>
            </SafeAreaView>
        );

    return (
        <Animated.ScrollView className="flex gap-2">
            <View className="flex items-center gap-2">
                <EventIcon name={activity?.type} size="lg" />
                <Text className="text-4xl font-bold dark:text-white">
                    {activity?.name}
                </Text>


                <View className="flex-row justify-center gap-1">
                    {isOwner &&
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
                        </Animated.View>}

                </View>
            </View>

            <View className="gap-2 mx-5 my-5">
                <View className="flex-row p-2 gap-2 items-center rounded-xl shadow-lg shadow-stone-200 bg-white dark:bg-stone-800 border border-orange-100 dark:border-gray-200">
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
                <View className="flex-row p-2 gap-2 items-center rounded-xl bg-white dark:bg-stone-800 shadow-lg shadow-stone-200 border border-orange-100">
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


            <View className="mx-2 gap-1 my-2">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-1">
                        <IconSymbol name="person.2.fill" color="orange" size={34} />
                        <Text className="text-xl font-bold dark:text-white">Participants</Text>
                    </View>

                    <View className="bg-orange-200 p-2 rounded-full">
                        <Text className="text-orange-600 font-bold">
                            {activity?.attendees?.length} inscrits
                        </Text>
                    </View>
                </View>

                <View className="gap-1">
                    {activity?.attendees?.slice(0, 3).map((attendee) => (
                        <View
                            key={attendee._id}
                            className="flex-row p-2 rounded-xl gap-2 p-2 items-center bg-white dark:bg-stone-800 shadow-lg dark:shadow-stone-200 " >
                            <Avatar size2="sm2" alt={attendee.name.charAt(0)} src={attendee?.avatar} />
                            <View>
                                <Text className="font-bold text-lg dark:text-white">
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
                            className="bg-blue-50 dark:bg-stone-800 border border-dashed border-blue-200 dark:border-gray-200 rounded-xl justify-center flex-row items-center p-2">
                            <Text className="font-bold text-md text-center text-gray-600 dark:text-gray-200">
                                Voir tout
                            </Text>
                            <IconSymbol name="chevron.down" color="gray" size={16} />

                        </Button>
                        :
                        <Button
                            onPress={handleJoin}
                            variant="contained"
                            isLoading={updateEvent.isPending}
                            title="Participer" />
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
                    <View className="flex-row gap-2 items-center mb-1">
                        <IconSymbol name="suit.spade" color="orange" size={34} />
                        <Text className="max-w-50 font-bold dark:text-white" numberOfLines={2}>
                            Restrictions alimentaires
                        </Text>
                    </View>

                    <View className="gap-2 border border-orange-400 dark:border-gray-200 p-2 rounded-xl">
                        <Text className="text-gray-800 dark:text-gray-200">Récapitulatif pour le groupe</Text>
                        {Object.values(restrictions)?.map((restriction) =>
                            <View key={restriction.name}
                                className="flex-row px-2 py-5 bg-white dark:bg-stone-800 rounded-xl items-center justify-between">
                                <View className="flex-row items-center  gap-2">
                                    <View className="bg-orange-200 dark:bg-gray-200 rounded-full p-2 ">
                                        <RestrictionIcon value={restriction.name} size="sm" />
                                    </View>
                                    <Text className="font-bold text-lg dark:text-white">{translateRestriction(restriction.name)}</Text>
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
                    className="bg-blue-600 border border-blue-400 rounded-xl shadow flex-row p-3 items-center justify-center gap-2">
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