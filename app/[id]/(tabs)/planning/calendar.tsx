import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetEvents } from "@/hooks/api/useEvents";
import { useTrip } from "@/context/TripContext";
import dayjs from "@/lib/dayjs-config";
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { DayState } from "react-native-calendars/src/types";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";


const DayComponent = ({ date, state, onDayPress, count = 0 }: { date?: DateData, state?: DayState, onDayPress: (day: DateData) => void, count?: number }) => {


    const isSelected = state === 'selected';
    const isToday = state === 'today';
    const isDisabled = state === 'disabled' || !date;
    const isInactive = state === 'inactive';

    return (
        <Pressable
            key={`${date?.dateString}-${state}-${count}`}
            className={`
                items-center justify-center rounded-full active:scale-[1.5] aspect-square
                dark:bg-night
                ${isDisabled ? 'opacity-30' : ''}
                ${isInactive ? 'opacity-50' : ''}
                ${isSelected ? 'border-2 border-amber-deep bg-amber/25 shadow-md' :
                    isToday ? 'ring-2 ring-amber-deep bg-amber/25' :
                        'border border-gray-300 dark:border-white/15'}
                m-1 p-1
                `}
            disabled={isDisabled || isInactive}
            onPress={() => date && onDayPress(date)}
        >
            <Text
                className={`
                text-night dark:text-white text-lg
                ${isSelected ? 'font-bold' : isToday ? `font-semibold` : ''}
                
            `}>
                {date?.day}
            </Text>
            {count > 0 &&
                <View className="absolute -top-2 -right-2 bg-amber-deep rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                        {count}
                    </Text>
                </View>
            }
        </Pressable>
    );
};

export default function TripCalendar() {

    const { id } = useGlobalSearchParams<{ id: string }>();
    const router = useRouter();

    const { trip } = useTrip();
    const [currentDate, setCurrentDate] = useState(dayjs(trip?.startDate).format("YYYY-MM-DD"));
    const { date: selectedDay } = useLocalSearchParams<{ date?: string }>();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const calendarTheme = {
        background: isDark ? "#101736" : "#F6F8FD",
        calendarBackground: isDark ? "#101736" : "#F6F8FD",
        textSectionTitleColor: isDark ? "#F6F8FD" : "#16265C",
        dayTextColor: isDark ? "#F6F8FD" : "#16265C",
        monthTextColor: isDark ? "#F6F8FD" : "#16265C",
        selectedDayBackgroundColor: "#EE8B33",
        selectedDayTextColor: "white",
        todayTextColor: "#EE8B33",
        arrowColor: "#EE8B33",
        indicatorColor: "#EE8B33",
    };

    const { data: eventsData, } = useGetEvents(id, {
        startDate: dayjs(currentDate).startOf('month').toISOString(),
        endDate: dayjs(currentDate).endOf('month').toISOString(),
        limit: 50
    });

    const eventCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        eventsData?.pages?.forEach(page => {
            page?.events?.forEach(event => {
                if (event.startDate) {
                    const dateStr = dayjs(event.startDate).format('YYYY-MM-DD');
                    counts[dateStr] = (counts[dateStr] || 0) + 1;
                }
            });
        });
        return counts;
    }, [eventsData]);
    const markedDates = useMemo(() => {
        const marked: Record<string, { customStyles?: object, count?: number }> = {};
        if (eventCounts)
            Object.entries(eventCounts).forEach(([dateStr, count]) => {
                marked[dateStr] = { customStyles: {}, count };
            });
        return marked;
    }, [eventCounts]);



    const handleDayPress = (day: DateData) => {
        router.setParams({ date: day.dateString });
    };

    return (
        <Animated.ScrollView className="flex-1 bg-mist dark:bg-ink" showsVerticalScrollIndicator={false}>
            <Calendar
                current={currentDate}
                onMonthChange={(date) => setCurrentDate(date.dateString)}
                markedDates={markedDates}
                markingType="custom"
                theme={calendarTheme}
                hideDayNames={false}
                dayComponent={({ date, state, marking }) => <DayComponent date={date}
                    state={date?.dateString === selectedDay ? 'selected' : state}
                    onDayPress={handleDayPress}
                    count={(marking as { count?: number } | undefined)?.count ?? 0}
                />}
                firstDay={1}
                renderArrow={(direction) => (
                    <IconSymbol
                        name={direction === 'left' ? 'chevron.left' : 'chevron.right'}
                        size={24}
                        color={isDark ? "#F6F8FD" : "#16265C"}
                    />
                )}

            />
            {selectedDay && (
                <Animated.View
                    entering={SlideInDown.duration(300)}
                    exiting={SlideOutDown.duration(200)}
                >
                    <View className="flex-row justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-white/10">
                        <Text className="text-xl font-semibold text-night dark:text-white capitalize">
                            {dayjs(selectedDay).locale('fr').format('dddd D MMMM')}
                        </Text>
                    </View>

                    <View className="px-4 pb-4">
                        {eventsData?.pages?.flatMap(page => page?.events)
                            .filter(event =>
                                event.startDate && dayjs(event.startDate).format('YYYY-MM-DD') === selectedDay
                            ).map(event => (
                                <Button key={event._id}
                                    onPress={() => router.push({
                                        pathname: "/[id]/events/[eventId]",
                                        params: {
                                            id: String(id),
                                            eventId: event._id
                                        }
                                    })}>
                                    <View className="mb-2 p-3 bg-white dark:bg-night rounded-lg flex-row items-center gap-3">
                                        <EventIcon name={event.type} size="sm" />
                                        <View className="flex-1">
                                            <Text className="font-medium text-night dark:text-white">
                                                {event.name}
                                            </Text>
                                            <View className="flex-row gap-1">
                                                {event.startDate && <Text className="text-sm text-gray-500 dark:text-gray-400">
                                                    {dayjs(event.startDate).format('HH:mm')}
                                                </Text>}
                                                <Text className="text-sm text-gray-500 dark:text-gray-400">-</Text>
                                                {event.endDate && <Text className="text-sm text-gray-500 dark:text-gray-400">
                                                    {dayjs(event.endDate).format('HH:mm')}
                                                </Text>}
                                            </View>
                                        </View>
                                    </View>
                                </Button>
                            ))}
                        <Button variant="contained"
                            title="Ajouter"
                            size="small"
                            className="my-2"
                            onPress={() => router.push({
                                pathname: "/[id]/events/new",
                                params: {
                                    id,
                                    startDate: dayjs(selectedDay).hour(12).toISOString(),
                                    endDate: dayjs(selectedDay).hour(14).toISOString(),
                                }
                            })}
                        />
                    </View>
                </Animated.View>
            )}
        </Animated.ScrollView>
    )
}
