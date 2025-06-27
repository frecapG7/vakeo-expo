import useI18nTime from "@/hooks/i18n/useI18nTime";
import { Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";



export const CalendarView = ({ startDate, endDate }: { startDate: Date, endDate: Date }) => {
    const { formatDate, formatHour } = useI18nTime();
    return (

        <View className="flex flex-col items-center justify-center gap-2">
            <View className="flex flex-col gap-1 rounded-lg bg-primary-400 p-5 justify-center items-center">
                <View className="flex flex-row items-between justify-center gap-1">
                    <Text className="text-xs text-secondary font-bold uppercase">
                        {formatDate(startDate, {
                            weekday: "short",
                        })}
                    </Text>
                    <IconSymbol name="calendar" size={14} />

                </View>
                <Text className="text-xl text-secondary font-bold">
                    {formatDate(startDate, {
                        day: "2-digit"
                    })}
                </Text>
                <Text className="text-md text-secondary font-bold uppercase">
                    {formatDate(startDate, {
                        month: "short"
                    })}
                </Text>
            </View>
            <Text className="text-xs text-secondary">
                {formatHour(startDate)} - {formatHour(endDate)}
            </Text>
        </View>
    );
}