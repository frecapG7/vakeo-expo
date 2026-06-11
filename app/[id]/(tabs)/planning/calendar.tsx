import { EventIcon } from "@/components/events/EventIcon";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import { useGetEvents } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
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
            className={`
                items-center justify-center rounded-full active:scale-[1.5] aspect-square
                dark:bg-gray-800
                ${isDisabled ? 'opacity-30' : ''}
                ${isInactive ? 'opacity-50' : ''}
                ${isSelected ? 'border-2 border-orange-400 bg-orange-50 shadow-md' :
                    isToday ? 'ring-2 ring-blue-400 bg-blue-50' :
                        'border border-gray-300'}
                m-1 p-1
                `}
            disabled={isDisabled || isInactive}
            onPress={() => date && onDayPress(date)}
        >
            <Text
                className={`
                dark:text-gray-200 text-lg
                ${isSelected ? 'font-bold dark:text-white' : isToday ? `font-semibold dark:text-white` : 'text-text'}
                
            `}>
                {date?.day}
            </Text>
            {count > 0 &&
                <View className="absolute -top-2 -right-2 bg-orange-400 rounded-full w-5 h-5 items-center justify-center">
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

    const { data: trip } = useGetTrip(id);
    const [currentDate, setCurrentDate] = useState(dayjs(trip?.startDate).format("YYYY-MM-DD"));
    const { date: selectedDay } = useLocalSearchParams<{ date?: string }>();

    const colors = useColors();

    const { data: eventsData, } = useGetEvents(String(id), {
        startDate: dayjs(currentDate).startOf('month').toISOString(),
        endDate: dayjs(currentDate).endOf('month').toISOString(),
        limit: 50
    }, {
        enabled: !!id,
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
        <Animated.View style={styles.container}>
            <Calendar
                current={currentDate}
                onMonthChange={(date) => setCurrentDate(date.dateString)}
                markedDates={markedDates}
                markingType="custom"
                theme={{
                    backgroundColor: colors.background,
                    calendarBackground: colors.background,
                    textSectionTitleColor: colors.text,
                    dayTextColor: colors.text,
                    monthTextColor: colors.text,
                    selectedDayBackgroundColor: colors.primary,
                    selectedDayTextColor: 'white',
                    todayTextColor: colors.primary,
                    arrowColor: colors.primary,
                    indicatorColor: colors.primary,
                }}
                hideDayNames={false}
                dayComponent={({ date, state, marking }) => <DayComponent date={date}
                    state={date?.dateString === selectedDay ? 'selected' : state}
                    onDayPress={handleDayPress}
                    count={marking?.count | 0}
                />}
                firstDay={1}
                style={{
                    // flex: 1,
                    // height: "100%"
                }}

            />
            {selectedDay && (
                <Animated.ScrollView
                    entering={SlideInDown.duration(300)}
                    exiting={SlideOutDown.duration(200)}
                >
                    <View className="flex-row justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <Text className="text-xl font-semibold text-text dark:text-white capitalize">
                            {dayjs(selectedDay).locale('fr').format('dddd D MMMM')}
                        </Text>
                        <Pressable onPress={() => router.push({
                            pathname: "/[id]/(tabs)/planning/day",
                            params: { id: String(id), date: selectedDay },
                        })}>
                            <Text className="text-orange-400 font-medium">Voir tout</Text>
                        </Pressable>
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
                                    <View className="mb-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex-row items-center gap-3">
                                        <EventIcon name={event.type} size="sm" />
                                        <View className="flex-1">
                                            <Text className="font-medium text-text dark:text-white">
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
                            onPress={() => router.push({
                                pathname: "/[id]/events/new",
                                params: {
                                    id: String(id),
                                    startDate: dayjs(currentDate).hour(12).toISOString(),
                                    endDate: dayjs(currentDate).hour(14).toISOString(),
                                }
                            })}
                        />
                    </View>
                </Animated.ScrollView>
            )}
        </Animated.View>
    )
}