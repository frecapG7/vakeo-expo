import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";
import { Event } from "@/types/models";
import { Text, View } from "react-native";
import { InfoCard } from "./InfoCard";



export const EventInfo = ({ event }: { event: Event }) => {
    const { formatHour, formatDurationCompact, formatDate } = useI18nTime();


    return (
        <View className="gap-2 mx-1">
            <View className="flex-row flex-wrap justify-between">
                {event?.startDate &&
                    <View className="w-[48%]">
                        <InfoCard
                            icon="calendar"
                            label={formatDate(event.startDate, {
                                weekday: "short",
                                day: "numeric",
                                month: "short"
                            })}
                            subtitle={String(dayjs(event.startDate).year())}
                        />
                    </View>
                }
                {event?.startDate &&
                      <View className="w-[48%]">
                        <InfoCard
                            icon="clock"
                            label={`${formatHour(event.startDate)} - ${formatHour(event.endDate)}`}
                            subtitle={String(formatDurationCompact(event?.startDate, event?.endDate))}
                        />
                    </View>
                }
            </View>

           

            <View className="mx-2 gap-1">
                <View className="">
                    <Text className="capitalize font-bold ml-2 dark:text-white text-lg">
                        Description
                    </Text>
                </View>
                <View className="">
                    <Text className="text-gray-500 dark:text-gray-400">
                        {event?.details ? event.details : "Pas de description"}
                    </Text>
                </View>
            </View>
        </View>
    )
}
