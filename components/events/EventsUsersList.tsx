import { Event, TripUser } from "@/types/models";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { Avatar } from "../ui/Avatar";
import { Chip } from "../ui/Chip";
import { Skeleton } from "../ui/Skeleton";




export const EventUserList = ({ event, selected }: { event: Event, selected?: TripUser }) => {

    if (!event)
        return (

            <View>
                <Skeleton height={64} />
            </View>
        )

    return (
        <View>
            <View className="m-2 gap-1">
                {event?.attendees?.map((attendee) => (
                    <View
                        key={attendee._id}
                        className="flex-row p-2 rounded-xl gap-2 p-2 items-center bg-white dark:bg-gray-900" >
                        <Avatar size2="sm"
                            alt={attendee.name.charAt(0)}
                            src={attendee?.avatar} />
                        <View className="flex-1 flex-row justify-between items-center">
                            <Text className="text-md dark:text-white">
                                {attendee.name}
                            </Text>
                            {attendee?._id === selected?._id &&
                                <Animated.View>
                                    <Chip variant="contained" text="Moi" size="small" />
                                </Animated.View>

                            }
                        </View>
                    </View>
                ))}

            </View>
        </View>
    )
}