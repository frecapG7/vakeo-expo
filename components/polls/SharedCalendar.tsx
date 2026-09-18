import { IconSymbol } from "@/components/ui/IconSymbol";
import dayjs from "@/lib/dayjs-config";
import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

const getUserColor = (userId: string) => {
    const colors = ["#3b82f6", "#ef4444", "#eab308", "#a855f7", "#14b8a6", "#ec4899", "#f97316"];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const getBgColor = (voteCount: number) => {
    if (voteCount === 0) return "bg-gray-50 dark:bg-gray-900";
    if (voteCount <= 2) return "bg-green-100 dark:bg-green-900/30";
    if (voteCount <= 4) return "bg-green-300 dark:bg-green-700/50";
    return "bg-green-500 dark:bg-green-600";
};

export default function SharedCalendar({ poll, me, onToggleDay }: any) {
    const initialDate = poll?.options?.[0]?.startDate ? dayjs(poll.options[0].startDate) : dayjs();
    const [currentMonth, setCurrentMonth] = useState(initialDate);

    const calendarDays = useMemo(() => {
        const startOfMonth = currentMonth.startOf('month');
        const startOfGrid = startOfMonth.startOf('isoWeek');
        const endOfGrid = startOfGrid.add(41, 'day');

        const days = [];
        let day = startOfGrid;
        while (day.isBefore(endOfGrid) || day.isSame(endOfGrid, 'day')) {
            days.push(day);
            day = day.add(1, 'day');
        }
        return days;
    }, [currentMonth]);

    const handlePreviousMonth = () => setCurrentMonth(prev => prev.subtract(1, 'month'));
    const handleNextMonth = () => setCurrentMonth(prev => prev.add(1, 'month'));

    return (
        <View className="flex-1 bg-white dark:bg-gray-950">
            <View className="flex-row items-center justify-between px-6 py-4">
                <Pressable onPress={handlePreviousMonth} className="p-2">
                    <IconSymbol name="chevron.left" size={24} color="gray" />
                </Pressable>
                <View className="items-center">
                    <Text className="text-gray-400 font-semibold text-xs uppercase tracking-widest">
                        Année {currentMonth.format("YYYY")}
                    </Text>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                        {currentMonth.format("MMMM")}
                    </Text>
                </View>
                <Pressable onPress={handleNextMonth} className="p-2">
                    <IconSymbol name="chevron.right" size={24} color="gray" />
                </Pressable>
            </View>

            <View className="flex-row border-b border-gray-200 dark:border-gray-800 pb-2">
                {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"].map((day, i) => (
                    <View key={i} className="flex-1 items-center">
                        <Text className="text-gray-400 font-bold text-xs">{day}</Text>
                    </View>
                ))}
            </View>

            <View className="flex-row flex-wrap border-l border-t border-gray-200 dark:border-gray-800">
                {calendarDays.map((day, index) => {
                    const isCurrentMonth = day.isSame(currentMonth, 'month');
                    const optionForDay = poll?.options?.find((opt: any) => 
                        day.isSame(dayjs(opt.startDate), 'day')
                    );

                    const voters = optionForDay?.selectedBy || [];
                    const voteCount = voters.length;
                    const isSelectedByMe = voters.some((u: any) => u._id === me?._id);

                    const visibleVoters = voters.slice(0, 3);
                    const extraVoters = voters.length - 3;

                    return (
                        <Pressable
                            key={index}
                            disabled={poll.isClosed}
                            onPress={() => onToggleDay(day)}
                            className={`w-[14.28%] aspect-[0.65] border-r border-b border-gray-200 dark:border-gray-800 p-[2px] 
                                ${getBgColor(voteCount)} 
                                ${!isCurrentMonth ? "opacity-40" : ""}
                                ${isSelectedByMe ? "border-orange-500 border-[1.5px] z-10" : ""}
                            `}
                        >
                            <View className="flex-row justify-between items-start">
                                <Text className={`text-xs font-semibold ${isCurrentMonth ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
                                    {day.format("D")}
                                </Text>
                            </View>

                            <View className="flex-1 justify-end overflow-hidden mt-[2px] gap-[1px]">
                                {visibleVoters.map((user: any) => (
                                    <View key={user._id} style={{ backgroundColor: getUserColor(user._id) }} className="px-[2px] py-[1px] rounded-sm">
                                        <Text className="text-white font-bold text-[7px]" numberOfLines={1} ellipsizeMode="clip">
                                            {poll.isAnonymous ? "Anonyme" : user.name}
                                        </Text>
                                    </View>
                                ))}
                                {extraVoters > 0 && (
                                    <View className="px-[2px] py-[1px] rounded-sm bg-gray-400/50 dark:bg-gray-700/50">
                                        <Text className="text-gray-900 dark:text-white font-bold text-[7px] text-center">
                                            +{extraVoters}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            <View className="flex-row items-center justify-center gap-4 py-6">
                <View className="flex-row items-center gap-1">
                    <View className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                    <Text className="text-gray-500 text-xs font-semibold">1-2</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <View className="w-4 h-4 rounded bg-green-300 border border-green-400" />
                    <Text className="text-gray-500 text-xs font-semibold">3-4</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <View className="w-4 h-4 rounded bg-green-500 border border-green-600" />
                    <Text className="text-gray-500 text-xs font-semibold">5+</Text>
                </View>
            </View>
        </View>
    );
}