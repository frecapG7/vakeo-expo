import styles from "@/constants/Styles";
import { useGetEvents } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { Event } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text } from "react-native";
import { CalendarProvider, CalendarUtils, ExpandableCalendar, TimelineList } from "react-native-calendars";
import { Event as TimelineEvent } from 'react-native-calendars/src/timeline/EventBlock';
import Animated from "react-native-reanimated";

const groupBy = (events: Event[]): Record<string, TimelineEvent[]> => {
    return events.reduce((acc, event) => {
        // Ignore if startDate undefined
        if (!event.startDate)
            return acc;

        const date = CalendarUtils.getCalendarDateString(event.startDate);
        if (!acc[date])
            acc[date] = [];
        acc[date].push(({
            id: event?._id,
            title: event.name,
            start: dayjs(event.startDate).format("YYYY-MM-DD HH:mm"),
            end: dayjs(event.endDate).format("YYYY-MM-DD HH:mm"),
            summary: event.type
        }));

        return acc;
    }, {} as Record<string, TimelineEvent[]>);
}


export default function TripCalendar() {



    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: trip } = useGetTrip(id);
    const [currentDate, setCurrentDate] = useState(CalendarUtils.getCalendarDateString(new Date()));


    const colors = useColors();

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetEvents(String(id), {
        startDate: dayjs(currentDate).startOf("day").toISOString(),
        endDate: dayjs(currentDate).add(4, "day").endOf("day").toISOString(),
    }, {
        enabled: !!id,
    });
    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const events = useMemo(() => data?.pages.flatMap((page) => page?.events) || [], [data?.pages]);


    const [newEvent, setNewEvent] = useState<Event | null>();


    return (
        <Animated.View style={styles.container}>
            <CalendarProvider
                date={currentDate}
                showTodayButton
                disabledOpacity={0.6}
                onDateChanged={(date) => {
                    setCurrentDate(date)
                }}
                numberOfDays={5}
            >
                <ExpandableCalendar
                    firstDay={1}
                    theme={{
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
                    }}
                // theme={calendar}
                // allowShadow={true}
                // initialPosition={ExpandableCalendar.positions.CLOSED}

                />
                <TimelineList
                    events={groupBy([...events, ...(newEvent ? [newEvent] : [])]) || {}}
                    showNowIndicator
                    initialTime={{ hour: 9, minutes: 0 }}
                    scrollToFirst
                    timelineProps={{
                        renderEvent: (event) =>
                            <Pressable
                                key={event.id}
                                onPress={() => router.push({
                                    pathname: "/[id]/events/[eventId]",
                                    params: {
                                        id: String(id),
                                        eventId: String(event.id)
                                    }
                                })}
                                className="flex flex-col w-full items-around ">
                                {/* <View className="flex flex-row items-center justify-around gap-2"> */}
                                {/* <EventIcon name={event.type} size={16} /> */}
                                <Text className="text-xs font-bold text-secondary">
                                    {event.title}
                                </Text>
                                {/* </View> */}
                            </Pressable>,
                        overlapEventsSpacing: 8,
                        rightEdgeSpacing: 24,
                        onBackgroundLongPress: (timeString, time) => {
                            setNewEvent({
                                _id: "",
                                startDate: dayjs(timeString).toISOString(),
                                endDate: dayjs(timeString).add(2, "hour").toISOString(),
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
                        },

                    }}


                />

            </CalendarProvider>
        </Animated.View>
    )
}