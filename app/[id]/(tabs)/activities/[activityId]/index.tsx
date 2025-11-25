import { GoodForm } from "@/components/goods/GoodForm";
import { GoodListItem, GoodListItemSkeleton } from "@/components/goods/GoodListItem";
import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useGetGoods, usePostGood } from "@/hooks/api/useGoods";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { Event, TripUser } from '@/types/models';
import { useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, StretchInY, StretchOutY } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";


const EventGoodAccordion = ({ event, user }: { event: Event, user: TripUser }) => {


    const [expanded, setExpanded] = useState(true);

    const { data, isLoading } = useGetGoods(event?.trip, {
        event: event?._id
    });
    const postGood = usePostGood(event?.trip);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            quantity: "1"
        }
    });


    const onSubmit = async (data: any) => {
        const response = await postGood.mutateAsync({
            ...data,
            event,
            createdBy: user
        });
        Toast.success("Course ajoutée");
        reset({
            name: "",
            quantity: "1"
        });
    }

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    return (
        <View>
            <View className="flex-row justify-between items-center">
                <Text className="font-bold text-xl dark:text-white ml-2">
                    Courses
                </Text>
                <Pressable className="rounded-full bg-blue-400 p-1" onPress={() => setExpanded(!expanded)}>
                    <IconSymbol name={expanded ? "chevron.up" : "chevron.down"} size={14} />
                </Pressable>
            </View>

            {expanded &&

                <Animated.FlatList entering={StretchInY}
                    exiting={StretchOutY}
                    data={goods}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => <GoodListItem good={item}
                        onCheck={() => console.log("TODO")}
                    />
                    }
                    className="p-2"
                    contentContainerClassName="gap-2"
                    ListEmptyComponent={() =>
                        isLoading ?
                            <View>
                                <GoodListItemSkeleton />
                                <GoodListItemSkeleton />
                            </View>
                            :
                            <></>
                    }
                    ListFooterComponent={() =>
                        <View className="gap-2 px-10">
                            <GoodForm control={control} trip={{ _id: event?.trip }} />
                            <Button variant="contained"
                                title="Ajouter"
                                onPress={handleSubmit(onSubmit)}
                                isLoading={postGood.isPending} />
                        </View>
                    }

                />
            }

        </View>
    )
}


export default function TripActivityDetails() {

    const { id, activityId } = useLocalSearchParams();
    const {me} = useContext(TripContext);

    const { data: activity } = useGetEvent(id, activityId);

    const [openOwners, setOpenOwners] = useState(false);

    const { getDayNumber, getMonthName } = useI18nTime();



    const { data } = useGetGoods(id, {
        event: activity
    }, {
        enabled: !!activity
    });


    return (
        <SafeAreaView style={styles.container}>
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



                <Pressable className="flex max-w-50 items-center justify-center gap-2 p-2" onPress={() => setOpenOwners(true)}>
                    <View className="flex-row items-center ">
                        {activity?.owners.map((owner) =>
                            <View key={owner._id} className="flex -ml-7 ">
                                <Avatar src={owner.avatar} size2="md" alt={owner.name?.charAt(0)} />
                            </View>)}
                    </View>
                    <View className="max-w-40 -ml-7">
                        <Text className="dark:text-white text-sm" numberOfLines={1} >
                            {activity?.owners.map((owner) => owner.name).join(", ")}
                        </Text>

                    </View>
                </Pressable>
            </View>







            {/* <View className="my-5">
                <View className="flex-row justify-between items-end">
                    <Text className="font-bold text-xl dark:text-white ml-2">
                        Courses
                    </Text>
                    <Pressable className="rounded-full bg-blue-400 p-2">
                        <IconSymbol name="plus" />
                    </Pressable>
                </View>
                <View className="flex rounded-lg">

                    <View>
                        <GoodListItemSkeleton />
                    </View>
                    <GoodListItem good={{
                        _id: "131544536446efzefz4654",
                        name: "bières",
                        quantity: "5 litre",
                        checked: true
                    }} />
                    <GoodListItem good={{
                        _id: "131544536444234hum6efzefze45",
                        name: "bières",
                        quantity: "2 paquet",
                        checked: false
                    }} />

                </View>
            </View> */}

            <View className="my-5">
                <EventGoodAccordion event={activity} user={me} />
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
        </SafeAreaView>
    )
}