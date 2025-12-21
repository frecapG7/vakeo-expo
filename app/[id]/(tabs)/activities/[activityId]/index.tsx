import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useCheckGood, useGetGoods, useGetGoodsCount } from "@/hooks/api/useGoods";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { Event, Good, TripUser } from '@/types/models';
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, StretchInY, StretchOutY } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const EventGoodAccordion = ({ event, user, onClick }: { event: Event, user: TripUser, onClick: (good?: Good) => void }) => {


    const [expanded, setExpanded] = useState(true);

    const { data } = useGetGoods(event?.trip, {
        event: event?._id
    });
    const checkGood = useCheckGood(event?.trip);


    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    return (
        <View>
            <View className="flex-row justify-between items-end px-2 mb-1">
                <Text className="font-bold text-xl dark:text-white">
                    Courses
                </Text>
                <Pressable className="rounded-full bg-blue-400 p-1" onPress={() => setExpanded(!expanded)}>
                    <IconSymbol name={expanded ? "chevron.up" : "chevron.down"} size={20} />
                </Pressable>
            </View>
            {expanded &&

                <Animated.View entering={StretchInY} exiting={StretchOutY} className="gap-2 bg-orange-100 dark:bg-gray-400 p-2 rounded-lg">

                    {goods?.length < 50 &&

                        <Animated.View entering={FadeIn} exiting={FadeOut}>
                            <Button className="flex-row gap-1" onPress={() => onClick({
                                _id: "",
                                name: "",
                                quantity: "1",
                                event,
                                createdBy: user,
                                checked: false
                            })}>
                                <IconSymbol name="plus" color="blue" />
                                <Text className="text-xl text-blue-700 font-bold">Ajouter</Text>
                            </Button>

                        </Animated.View>

                    }

                    {goods?.map((good) =>
                        <Animated.View key={good._id} entering={FadeIn} className="flex-row items-center">
                            <Button className="flex-row items-center gap-1"
                                onPress={async () => checkGood.mutateAsync(good)}
                                disabled={checkGood?.isPending}>
                                <View className="h-7 w-7">
                                    <Checkbox checked={good?.checked} />
                                </View>
                                <View className="flex-row flex-1 justify-between">
                                    <Text className={`text-xl capitalize flex-1 ${good.checked ? "line-through" : ""}`} >{good.name} ({good.quantity})</Text>
                                </View>

                                <Button className="rounded-full border bg-blue-500 p-1"
                                    onPress={() => onClick(good)}
                                    disabled={good.checked} >
                                    <IconSymbol name="pencil" color="black" size={16} />
                                </Button>
                            </Button>


                        </Animated.View>)}
                </Animated.View>
            }
        </View>
    )
}


export default function TripActivityDetails() {

    const { id, activityId } = useLocalSearchParams();
    const { me } = useContext(TripContext);

    const { data: activity } = useGetEvent(id, activityId);


    const [showAttendees, setShowAttendees] = useState(false);
    const [showOwners, setShowOwners] = useState(false);

    const { data: goodsCount } = useGetGoodsCount(id, {
        event: activityId
    });

    const { formatRange } = useI18nTime();
    const isParticipant = useMemo(() => activity?.attendees?.map(u => u._id).includes(me?._id), [me, activity]);


    if (!activity)
        return (
            <SafeAreaView>
                <View className="gap-2 px-5">
                    <View className="flex-row items-center gap-2">

                        <View className="flex-row rounded-full border p-1 items-center gap-1">
                            <Text>Je participe</Text>
                            <IconSymbol name="bookmark" color="black" />
                        </View>
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
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView>
                <View className="gap-2 px-5">
                    <View className="flex-row items-center gap-2">

                        <View className={`flex-row rounded-full border p-1 items-center gap-1 ${isParticipant ? "bg-orange-200 dark:bg-gray-200" : "dark:border-white dark:bg-gray-700"}`}>
                            <Text>Je participe</Text>
                            <IconSymbol name={isParticipant ? "bookmark.fill" : "bookmark"} color="black" />
                        </View>

                        <Pressable onPress={() => setShowAttendees(true)}>
                            <Text className="underline font-bold dark:text-white">
                                {activity?.attendees?.length} personnes participent
                            </Text>
                        </Pressable>
                    </View>
                    <Pressable className="flex-row gap-5 items-center py-2" onPress={() => setShowOwners(true)}>
                        <IconSymbol name="smiley" color="gray" size={34} />


                        <View className="flex-row flex-1 border-b border-gray-800 py-2 items-center gap-2">

                            {activity?.owners?.length === 0 &&

                                <Text className="dark:text-white text-center text-md">Aucun responsable</Text>
                            }
                            <AvatarsGroup avatars={activity?.owners.map((owner) => ({
                                avatar: owner?.avatar,
                                alt: owner.name.charAt(0)
                            }))}
                                size2="sm"
                                maxLength={4}
                            />
                            <View className="max-w-40 ml-5 gap-2 justify-center ">
                                <Text className="dark:text-white text-center text-md" numberOfLines={1} >
                                    {activity?.owners.map((owner) => owner.name).join(", ")}
                                </Text>

                            </View>
                        </View>
                    </Pressable>
                    {activity?.startDate &&
                        <Animated.View className="flex-row gap-5 items-center py-2">
                            <IconSymbol name="calendar" size={34} color="grey" />
                            <View className="flex-row flex-1 border-b border-gray-800  items-center py-2 ">
                                <Text className="capitalize  dark:text-white">
                                    {formatRange(activity?.startDate, activity?.endDate)}
                                </Text>
                            </View>
                        </Animated.View>
                    }
                    <Pressable className="flex-row gap-5  items-center py-2" onPress={() => router.push({
                        pathname: "/[id]/(tabs)/activities/[activityId]/goods",
                        params: {
                            id: String(id),
                            activityId: activityId
                        }
                    })}>
                        <IconSymbol name="cart" size={34} color="grey" />
                        <Text className="flex-1 border-b border-gray-800 py-2 dark:text-white">
                            Voir les courses {goodsCount?.totalCount > 0 && `(${goodsCount?.totalCount})`}
                        </Text>
                    </Pressable>
                    {activity?.address &&
                        <Pressable className="flex-row gap-5  items-center py-2" onPress={() => router.push({
                            pathname: "/[id]/(tabs)/activities/[activityId]/goods",
                            params: {
                                id: String(id),
                                activityId: activityId
                            }
                        })}>
                            <IconSymbol name="map" size={34} color="grey" />
                            <Text className="flex-1 border-b border-gray-800  py-2 dark:text-white">
                                45 Rue Pouchet, 75017, Paris
                            </Text>
                        </Pressable>
                    }

                </View>


                <View className="px-4 mt-5">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-bold text-lg dark:text-white">Détails</Text>
                        {/* <Button variant="contained"
                            className="rounded-full p-1"
                            onPress={() => console.log("todo")}>
                            <IconSymbol name="pencil" color="black" />
                        </Button> */}
                    </View>
                    <View>
                        <Text className="dark:text-white">
                            {activity?.details ? activity.details : "Pas de détails"}
                        </Text>

                    </View>
                </View>


                <PickUsersModal open={showAttendees}
                    onClose={() => setShowAttendees(false)}
                    users={activity?.attendees}
                    disabled
                    title="Participants"
                />

                <PickUsersModal open={showOwners}
                    onClose={() => setShowOwners(false)}
                    users={activity?.owners}
                    disabled
                    title="Responsables"
                />
            </Animated.ScrollView>
        </SafeAreaView>
    )
}