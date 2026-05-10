import { EventIcon } from "@/components/events/EventIcon";
import { EventInfo } from "@/components/events/EventInfo";
import { EventsGoodsList } from "@/components/events/EventsGoodsList";
import { EventUserList } from "@/components/events/EventsUsersList";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { containsUser } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventDetails() {

    const { id, eventId } = useLocalSearchParams();
    const { me } = useContext(TripContext);

    const { data: event } = useGetEvent(id, eventId);
    const updateEvent = useUpdateEvent(id, eventId);


    const isAttendee = useMemo(() => containsUser(me, event?.attendees), [me, event]);

    const [tabValue, setTabValue] = useState("info");


    // const router = useRouter();
    // useEffect(() => {
    //     router.replace({
    //         pathname: "/[id]/events/[eventId]/details",
    //         params: {
    //             id: String(id),
    //             eventId: String(eventId)
    //         }
    //     })
    // }, [event]);

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
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <Animated.ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <LinearGradient
                    colors={['#FF4500',
                        '#FF6B00',
                        '#FF8C00',
                    ]} // Orange gradient colors
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        padding: 8,
                        borderRadius: 5
                    }}
                    className="m-2 rounded-xl p-1"
                >
                    <View className="flex flex-row justify-end">
                        <Button variant={isAttendee ? "contained" : "outlined"}
                            title={isAttendee ? "REJOINT" : "REJOINDRE"}
                            onPress={onJoinClick}
                            isLoading={updateEvent.isPending}
                        />
                    </View>
                    <View className="flex-row justify-center -mb-10">
                        <View className="rounded-full bg-orange-600 p-3">
                            <EventIcon name={event?.type} size="lg" />

                        </View>
                    </View>
                </LinearGradient>
                <SafeAreaView style={styles.container}>
                    <View className="flex-row flex-wrap justify-between my-4">
                        {/* Number of participants */}
                        <View className="w-[48%] mb-4 bg-white dark:bg-gray-900 rounded-xl p-4 items-center">
                            <IconSymbol name="person.2.fill" color="orange" size={24} />
                            <Text className="text-lg font-bold dark:text-white mt-2">
                                {event.attendees?.length || 0} Participants
                            </Text>
                        </View>

                        {/* Number of goods */}
                        <View className="w-[48%] mb-4 bg-white dark:bg-gray-900 rounded-xl p-4 items-center">
                            <IconSymbol name="list.bullet" color="orange" size={24} />
                            <Text className="text-lg font-bold dark:text-white mt-2">
                                0 Goods
                            </Text>
                        </View>
                    </View>

                    <View>
                        <EventInfo event={event} />
                    </View>


                    <View className="">
                        <View className="flex-row justify-between px-4">
                            <Text className="text-lg font-bold dark:text-white">
                                Participants
                            </Text>
                            <Button onPress={() => router.push({
                                pathname: "/[id]/events/[eventId]/edit-users",
                                params: {
                                    id: String(id),
                                    eventId: String(eventId)
                                }
                            })}>
                                <Text className="text-blue-400">
                                    Modifier
                                </Text>
                            </Button>
                        </View>
                        <EventUserList event={event}
                            selected={me}
                        />
                    </View>

                    <View className="px-4 my-2">
                        <EventsGoodsList
                            event={event}
                            user={me}
                        />
                    </View>
                </SafeAreaView>

            </Animated.ScrollView>
        </KeyboardAvoidingView>
    )
}