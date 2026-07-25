import { EventIcon, getEventIconSource } from "@/components/events/EventIcon";
import { EventInfo } from "@/components/events/EventInfo";
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
import { useContext, useMemo } from "react";
import { KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventDetails() {

    const { eventId } = useLocalSearchParams<{ eventId: string }>();
    const { trip, me } = useContext(TripContext);
    const insets = useSafeAreaInsets();

    const { data: event } = useGetEvent(trip?._id, eventId);
    const updateEvent = useUpdateEvent(trip?._id, eventId);

    const isAttendee = useMemo(() => containsUser(me, event?.attendees), [me, event]);

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
            <Animated.ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}>
                <LinearGradient
                    colors={['#FF4500', '#FF8C00', '#FFB347']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: 5,
                        // paddingTop: insets.top + 8,
                        height: 100 + insets.top,
                    }}
                >
                    <View className="flex flex-row justify-end mr-4 mt-2">
                        <Button
                            key={isAttendee ? "attending-button" : "attend-button"}
                            variant={isAttendee ? "contained" : "outlined"}
                            title={isAttendee ? "PARTICIPANT" : "PARTICIPER"}
                            onPress={onJoinClick}
                            isLoading={updateEvent.isPending}
                            size="small"
                        />
                    </View>
                </LinearGradient>
                <View className="flex-row justify-center" style={{ marginTop: -60 - insets.top }}>
                    <View className="rounded-full bg-white p-1 border-2 border-orange-600">
                        <EventIcon source={getEventIconSource(event?.type)} size="lg" />
                    </View>
                </View>
                <View className="my-4">
                    <EventInfo event={event} />
                </View>


                <View className="my-10">
                    <View className="flex-row justify-between px-4">
                        <View className="flex-row items-center gap-2">
                            <IconSymbol name="person.2.fill" size={18} color="orange" />
                            <Text className="text-xl font-bold dark:text-white">
                                Participants {Number(event?.attendees?.length) > 0 && `(${event?.attendees?.length})`}
                            </Text>
                        </View>
                        <Button onPress={() => router.push({
                            pathname: "/[id]/events/[eventId]/edit-users",
                            params: {
                                id: trip._id,
                                eventId
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

                <View className="my-6">
                    <View className="border-t border-gray-200 dark:border-gray-700 my-4" />

                    <View className="flex-row mx-4 gap-4">
                        <Pressable
                            onPress={() => router.push({
                                pathname: "/[id]/goods",
                                params: {
                                    id: trip._id,
                                    title: event.name,
                                    eventId
                                }
                            })}
                            className="flex-1 items-center py-4 rounded-xl bg-orange-50 dark:bg-orange-900/20
                   border border-orange-300 dark:border-orange-700
                   active:opacity-80 active:scale-[0.98]"
                        >
                            <View className="flex-row items-center justify-center gap-2">
                                <Text className="text-orange-600 dark:text-orange-400 font-medium">
                                    Ajouter des articles
                                </Text>
                            </View>
                            <Text className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                Liste partagée
                            </Text>
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
                            className="flex-1 items-center py-4 rounded-xl bg-blue-50 dark:bg-blue-900/20
                   border border-blue-300 dark:border-blue-700
                   active:opacity-80 active:scale-[0.98]"
                        >
                            <View className="flex-row items-center justify-center gap-2">
                                <Text className="text-blue-600 dark:text-blue-400 font-medium">
                                    Voir les messages
                                </Text>
                            </View>
                            <Text className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                Discussion
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Animated.ScrollView>
        </KeyboardAvoidingView>
    )
}