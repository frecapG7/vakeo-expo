import useI18nTime from "@/hooks/i18n/useI18nTime"
import { Pressable, Text, View } from "react-native"
import { Avatar } from "../ui/Avatar"
import { IconSymbol } from "../ui/IconSymbol"


interface IUser {
    _id: string,
    name: string,
    avatar: string
}

interface IEvent {
    _id: string,
    startDate: Date,
    endDate: Date,
    name: string,
    attendees: IUser[],
    owners: IUser[]
}


export const EventListItem = ({ event,
    onPress,
    onLongPress
}: {
    event: IEvent,
    onPress?: () => void,
    onLongPress?: () => void,
}) => {


    const {formatDate, getTime} = useI18nTime();


    return (
        <Pressable className="active:opacity-75 bg-orange-200 dark:bg-gray-200 my-5 p-2 rounded-lg flex-row justify-between gap-2"
            onPress={onPress}
            onLongPress={onLongPress}>
                <View>
            <View className="flex-1 justify-end gap-2">
                {/* <Text>{event.startDate}</Text> */}
                  <View className="flex-row items-center ">
                        {event?.owners.map((owner, index) =>
                            <View key={owner._id} className={`flex ${index > 0 && "-ml-3"}`}>
                                <Avatar src={owner.avatar} size2="sm" alt={owner.name.charAt(0)} />
                            </View>)}
                    </View>
                <Text className="text-lg font-bold" numberOfLines={1}>{event?.name}</Text>
            </View>
                </View>

            <View className="flex w-24">
                <View className="flex-row items-center justify-start gap-1">
                    <IconSymbol name="calendar" size={16} color="black"/>
                    <Text className="text-sm">{event.startDate ? formatDate(event.startDate, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit"
                    }) : ""}</Text>
                </View>
                <View className="flex-row items-center justify-start gap-1">
                    <IconSymbol name="clock" size={16} color="black"/>
                    <Text className="text-sm">{event.startDate ? `${getTime(event.startDate)}-${getTime(event.endDate)}` : "" }</Text>
                </View>
                <View className="flex-row items-center justify-start gap-1">
                    <IconSymbol name="person" size={16} color="black"/>
                    <Text className="text-sm">{event.attendees.length}</Text>
                </View>
            </View>

            
        </Pressable>
    )
}