import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import dayjs from "@/lib/dayjs-config";
import { Event, TripUser } from "@/types/models";
import { useMemo } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { EventIcon } from "./EventIcon";

export const EventItem = ({ event, user, onPress }: { event: Event, user: TripUser, onPress?: () => void }) => {

  const isAttendee = useMemo(() => event.attendees?.some(u => u._id === user?._id), [user, event]);
  const isOwner = useMemo(() => event.owners?.some(u => u._id === user?._id), [user, event]);

  const handlePress = () => onPress && onPress();
  return (
    <Button
      onPress={handlePress}
      className="flex-row items-center rounded-2xl bg-white dark:bg-gray-800 shadow-md mx-2 p-4 gap-4 border border-gray-100 dark:border-gray-700"
    >
      <View className="flex-row gap-3 items-center">
        <View className="mt-1">
          <EventIcon name={event.type} size="md" />
        </View>
        <View className="flex-1 gap-2 justify-between">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <Text className="text-lg text-gray-800 dark:text-white font-bold flex-1" numberOfLines={2}>
                {event.name}
              </Text>
            </View>
            {isAttendee && (
              <Animated.View className="flex-row bg-green-200 rounded-lg items-center px-2 py-1">
                <IconSymbol name="checkmark" color="green" size={14} />
                <Text className="text-xs font-bold text-green-600">Participant</Text>
              </Animated.View>
            )}
          </View>
          {event.details && (
            <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={2}>
              {event.details}
            </Text>
          )}
          <View className="flex-row items-center justify-around">
            <View className="flex-row items-center gap-1">
              <IconSymbol name="clock" color="gray" size={14} />
              {event?.startDate && (
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {dayjs(event?.startDate).format("HH:mm")}-{dayjs(event?.endDate).format("HH:mm")}
                </Text>
              )}
            </View>
            <View className="flex-row items-center gap-1">
              <IconSymbol name="person.2.fill" color="gray" size={14} />
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {event?.attendees?.length}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <IconSymbol name="list.bullet" color="gray" size={14} />
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {event?.goodsCount ?? 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Button>
  );
};
