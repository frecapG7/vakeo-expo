import { EventIcon } from "@/components/events/EventIcon";
import { EventInfo } from "@/components/events/EventInfo";
import { EventsGoodsList } from "@/components/events/EventsGoodsList";
import { EventUserList } from "@/components/events/EventsUsersList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvent, useUpdateEvent } from "@/hooks/api/useEvents";
import { containsUser } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function EventDetails() {

    const { id, eventId } = useLocalSearchParams();
    const { me } = useContext(TripContext);

    const { data: event } = useGetEvent(id, eventId);
    const updateEvent = useUpdateEvent(id, eventId);


    const isAttendee = useMemo(() => containsUser(me, event?.attendees), [me, event]);

    const [tabValue, setTabValue] = useState("info");


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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <Animated.ScrollView contentContainerStyle={{ flexGrow: 1}}>

                    <View className="flex items-center gap-2">
                        <EventIcon name={event?.type} size="lg" />
                        <Text className="text-2xl font-bold dark:text-white">
                            {event?.name}
                        </Text>

                        <View className="flex-row justify-center gap-1">
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
                            <EventInfo
                                event={event}
                                me={me} />
                        </Animated.View>
                    }
                    {tabValue === "goods" &&
                        <Animated.View entering={ZoomIn}
                            className="m-2">
                            <EventsGoodsList event={event} user={me} />
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}