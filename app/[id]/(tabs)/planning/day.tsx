import { useGetEvents } from "@/hooks/api/useEvents";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CalendarProvider, CalendarUtils, ExpandableCalendar, TimelineList } from "react-native-calendars";
import { PackedEvent } from "react-native-calendars/src/timeline/EventBlock";


export default function DayModal() {
    const { date = dayjs().format('YYYY-MM-DD') } = useLocalSearchParams<{ date?: string }>();
    const { id } = useGlobalSearchParams<{ id: string }>();

    const colors = useColors();
    const router = useRouter();

    const { data: events } = useGetEvents(id, {
        startDate: dayjs(date).startOf("month").toISOString(),
        endDate: dayjs(date).endOf("month").toISOString(),
    });

    const markedDates = useMemo(() => {
        return events?.pages?.flatMap(page => page?.events || [])
            .filter(event => event.startDate)
            .reduce<Record<string, { dots: { key: string; color: string }[] }>>(
                (acc, event) => {
                    const dateStr = dayjs(event.startDate).format('YYYY-MM-DD');
                    if (!acc[dateStr]) {
                        acc[dateStr] = { dots: [{ key: dateStr, color: colors.primary }] };
                    }
                    return acc;
                },
                {}
            ) || {};
    }, [events, colors.primary]);


    // For timeline - filter events for current day
    const dayEvents = useMemo(() => {
        return events?.pages?.flatMap(page => page?.events)
            .filter(event => dayjs(event.startDate).format('YYYY-MM-DD') === date) || [];
    }, [events, date]);

    const [newEvent, setNewEvent] = useState<Event | null>();

    const timelineEvents = useMemo(() => {
        const baseEvents = dayEvents?.map(event => ({
            id: event._id,
            start: dayjs(event.startDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            end: dayjs(event.endDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
            title: event.name,
            summary: event.type,
            color: colors.background,
        })) || [];

        const previewEvent = newEvent ? [{
            id: 'new-event-preview',
            start: newEvent.startDate,
            end: newEvent.endDate,
            title: newEvent.name,
            summary: newEvent.type,
            color: colors.calendarPrimary,
        }] : [];

        return {
            [CalendarUtils.getCalendarDateString(dayjs(date).toDate())]:
                [...baseEvents, ...previewEvent]
        };
    }, [dayEvents, newEvent, colors.primary, colors.background, date]);

    const handleDateChanged = useCallback((newDate: string) => {
        router.setParams({ date: dayjs(newDate).format('YYYY-MM-DD') });
    }, [router]);




    return (
        <View className="flex-1">
            <CalendarProvider
                date={dayjs(date).format("YYYY-MM-DD HH:mm:ss")}
                onDateChanged={handleDateChanged}
            >
                <ExpandableCalendar
                    firstDay={1}
                    hideKnob
                    theme={{
                        calendarBackground: colors.background,
                        textSectionTitleColor: colors.text,
                        dayTextColor: colors.text,
                        monthTextColor: colors.text,
                        arrowColor: colors.calendarPrimary,
                        selectedDayBackgroundColor: colors.calendarPrimary,
                        selectedDayTextColor: colors.background,
                        todayTextColor: colors.primary,
                        todayBackgroundColor: '#fdb140',
                    }}
                    markedDates={markedDates}
                    markingType="multi-dot"

                />
                <TimelineList
                    initialTime={{ hour: 9, minutes: 0 }}
                    styles={{ flex: 1 }}
                    events={timelineEvents}
                    timelineProps={{
                        // overlapEventsSpacing: 8,
                        rightEdgeSpacing: 24,
                        renderEvent: (event: PackedEvent) =>
                            <Pressable
                                key={event.id}
                                onPress={() => router.push({
                                    pathname: "/[id]/events/[eventId]",
                                    params: { id: String(id), eventId: String(event.id) }
                                })}
                                className="flex-1 rounded-lg bg-orange-100 border-l-2 border-orange-600 "
                            >
                                <Text className="text-sm font-semibold text-gray-800">
                                    {event.title}
                                </Text>
                                <Text className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                    {dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}
                                </Text>
                                {event.summary && (
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {event.summary}
                                    </Text>
                                )}
                            </Pressable>,
                        onBackgroundLongPress: (timeString, time) => {
                            setNewEvent({
                                startDate: timeString,
                                endDate: dayjs(timeString).add(2, "hour").format("YYYY-MM-DD HH:mm:ss"),
                                name: "Nouvelle activité",
                                trip: String(id),
                                type: ""
                            })
                        },
                        onBackgroundLongPressOut: (timeString, time) => {
                            router.push({
                                pathname: "/[id]/events/new",
                                params: {
                                    id: String(id),
                                    startDate: String(newEvent?.startDate),
                                    endDate: String(newEvent?.endDate),
                                }
                            });
                            setNewEvent(null);
                        },
                        theme: {
                            backgroundColor: colors.background,
                            calendarBackground: colors.background,
                            textSectionTitleColor: colors.text,
                            dayTextColor: colors.text,
                            textSectionTitleDisabledColor: '#d9e1e8',
                            selectedDayBackgroundColor: '#fdb140',
                            selectedDayTextColor: colors.primary,
                            todayTextColor: '#00adf5',
                            todayBackgroundColor: '#a2daf1ff',
                            textDisabledColor: '#828485ff',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: 'orange',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: colors.text,
                            indicatorColor: colors.text,

                            // borderWidth: 0
                            // eventBackgroundColor: '#E3F2FD',  // fallback for all events
                            // eventTextColor: colors.text,
                        }

                    }}

                    onEventPress={(e) => console.log(e)}


                    scrollToFirst
                    showNowIndicator
                    containerStyle={{ flex: 1 }}
                    timeLabelStyle={{ color: colors.text }}
                />
            </CalendarProvider>
        </View>
    );
}