import { GoodBottomSheet } from "@/components/goods/GoodBottomSheet";
import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { Checkbox } from "@/components/ui/Checkbox";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useCheckGood, useGetGoods } from "@/hooks/api/useGoods";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { Event, Good, TripUser } from '@/types/models';
import { useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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

    const [openOwners, setOpenOwners] = useState(false);

    const { getDayNumber, getMonthName } = useI18nTime();

    const [selectedGood, setSelectedGood] = useState<Good | null>(null);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureHandlerRootView style={styles.container}>
                <Animated.ScrollView>

                    <View className="flex-row justify-between px-5">
                        <CalendarDayView>
                            {!!activity?.startDate ? (
                                <Animated.View entering={FadeIn} className="flex flex-1 items-center px-5">
                                    <Text className="text-lg">{getDayNumber(activity.startDate)}</Text>
                                    <Text className="capitalize text-xl font-bold">{getMonthName(activity.startDate)}</Text>
                                </Animated.View>
                            ) :
                                <View className="flex items-center m-1">
                                    <IconSymbol name="pencil" size={24} color="dark" />
                                    <Text className="text-sm">Ajouter des dates</Text>
                                </View>
                            }
                        </CalendarDayView>



                        <Button className="flex max-w-50 items-center justify-center gap-2 p-2" onPress={() => setOpenOwners(true)}>

                            <AvatarsGroup avatars={activity?.owners.map((owner) => ({
                                avatar: owner?.avatar,
                                alt: owner.name.charAt(0)
                            }))}
                                size2="md"
                                maxLength={4}
                            />
                            <View className="max-w-40 ml-5 ">
                                <Text className="dark:text-white text-center text-sm" numberOfLines={1} >
                                    {activity?.owners.map((owner) => owner.name).join(", ")}
                                </Text>

                            </View>
                        </Button>
                    </View>





                    <View className="my-5">
                        <EventGoodAccordion event={activity} user={me} onClick={(good) => setSelectedGood(good)} />
                    </View>


                    <View className="my-5">
                        <Text className="font-bold text-xl dark:text-white ml-2">
                            Participants
                        </Text>
                        <View className="rounded-lg bg-orange-100 dark:bg-gray-400 gap-2 px-2 py-4">
                            {activity?.attendees.map((attendee) =>
                                <View key={attendee._id} className="flex flex-row gap-2 items-center">
                                    <Avatar alt={attendee.name?.charAt(0)} size2="sm" src={attendee.avatar} />
                                    <Text className="text-lg ">{attendee.name}</Text>
                                </View>)}
                        </View>
                    </View>
                    <PickUsersModal open={openOwners}
                        onClose={() => setOpenOwners(false)}
                        users={activity?.owners}
                        disabled
                    />


                    <GoodBottomSheet good={selectedGood} trip={{ _id: id }} onClose={() => setSelectedGood(null)} />
                </Animated.ScrollView>

            </GestureHandlerRootView>
        </SafeAreaView>
    )
}