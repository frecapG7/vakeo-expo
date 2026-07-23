import { EventIcon, getEventIconSource } from "@/components/events/EventIcon";
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
import { useContext, useMemo } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventDetails() {

    const { id, eventId } = useLocalSearchParams();
    const { me } = useContext(TripContext);
    const insets = useSafeAreaInsets();

    const { data: event } = useGetEvent(id, eventId);
    const updateEvent = useUpdateEvent(id, eventId);

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
                                Participants
                            </Text>
                        </View>
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

            </Animated.ScrollView>
        </KeyboardAvoidingView>
    )
}