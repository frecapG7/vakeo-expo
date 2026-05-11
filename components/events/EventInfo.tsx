import { useGetGoodsCount } from "@/hooks/api/useGoods";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";
import { Event } from "@/types/models";
import { Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { InfoCard } from "./InfoCard";



export const EventInfo = ({ event }: { event: Event }) => {
    const { formatHour, formatDurationCompact } = useI18nTime();

    const { data: count } = useGetGoodsCount(event.trip, {
        event: event._id
    });

    return (
        <View className="gap-2">
            <View className="flex-row flex-wrap justify-between">
                {/* Number of participants */}
                <View className="w-[48%]">
                    <InfoCard icon="person.2.fill"
                        label={`${event.attendees?.length || 0} Participants`}
                    />
                </View>
                {/* Number of goods */}
                <View className="w-[48%]">
                    <InfoCard
                        icon="list.bullet"
                        label={`${count?.totalCount || 0} Éléments`}
                        // badge={{
                        //     text: `${count?.checkedCount} ✔️`,
                        //     variant: "success"
                        // }}
                    />
                </View>
            </View>

            {event?.startDate &&
                <View className="flex-row gap-2">
                    <View className="w-[48%] rounded-xl bg-white dark:bg-gray-900 justify-center items-center p-4 ">
                        <IconSymbol name="calendar" color="orange" />
                        <View className="flex-row  gap-2 items-center">
                            <Text className="text-lg dark:text-white capitalize">
                                {dayjs(event.startDate).format("dddd")}
                            </Text>
                            <Text className="text-2xl font-bold dark:text-white">
                                {dayjs(event.startDate).date()}
                            </Text>
                            <Text className="text-lg dark:text-white capitalize">
                                {dayjs(event.startDate).format("MMMM")}
                            </Text>
                        </View>
                        <Text className="text-center text-xs dark:text-white">
                            {dayjs(event.startDate).year()}
                        </Text>
                    </View>
                    <View className="w-[48%] rounded-xl bg-white dark:bg-gray-900 items-center justify-center py-4">
                        <IconSymbol name="clock" color="orange" />
                        <View className="flex-row gap-2 items-center">
                            <Text className="text-xl font-bold dark:text-white">
                                {formatHour(event.startDate)}
                            </Text>
                            <Text className="dark:text-white">-</Text>
                            <Text className="text-xl font-bold dark:text-white">
                                {event?.endDate && formatHour(event.endDate)}
                            </Text>
                        </View>
                        <Text className="text-sm dark:text-white text-center">
                            {formatDurationCompact(event?.startDate, event?.endDate)}
                        </Text>
                    </View>
                </View>
            }

            <View className="mx-2 gap-1">
                <View className="">
                    <Text className="capitalize font-bold ml-2 dark:text-white text-lg">
                        Description
                    </Text>
                </View>
                <View className="">
                    <Text className="dark:text-white">
                        {event?.details ? event.details : "Pas de détails"}
                    </Text>
                </View>
            </View>
        </View>
    )
}
