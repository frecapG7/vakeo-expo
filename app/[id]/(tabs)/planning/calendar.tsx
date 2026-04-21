import styles from "@/constants/Styles";
import { useGetEvents } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { Event } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CalendarProvider, CalendarUtils, ExpandableCalendar, TimelineList, TimelineProps } from "react-native-calendars";
import Animated from "react-native-reanimated";




const groupBy = (events: Event[]): Record<string, TimelineProps[]> => {
    return events.reduce((acc, event) => {
        // Ignore if startDate undefined
        if (!event.startDate)
            return acc;

        const date = CalendarUtils.getCalendarDateString(event.startDate);
        if (!acc[date])
            acc[date] = [];
        acc[date].push(({
            _id: event._id,
            title: event.name,
            start: dayjs(event.startDate).format("YYYY-MM-DD HH:mm"),
            end: dayjs(event.endDate).format("YYYY-MM-DD HH:mm"),
            type: event.type
        }));


        return acc;
    }, {} as Record<string, TimelineProps[]>);
}


export default function TripCalendar() {



    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { data: trip } = useGetTrip(id);
    const [currentDate, setCurrentDate] = useState(CalendarUtils.getCalendarDateString(new Date()));


    const colors = useColors();

    const { data, hasNextPage, fetchNextPage, isLoading } = useGetEvents(String(id), {
        startDate: dayjs(currentDate).startOf("day").toISOString(),
        endDate: dayjs(currentDate).add(5, "day").endOf("day").toISOString(),
    }, {
        enabled: !!id,
    });
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
                                onPress={() => router.push({
                                    pathname: "/[id]/events/[eventId]",
                                    params: {
                                        id: String(id),
                                        eventId: String(event._id)
                                    }
                                })}
                                className="flex flex-col w-full items-around ">
                                <View className="flex flex-row items-center justify-around gap-2">
                                    {/* <EventIcon name={event.type} size={16} /> */}
                                    <Text className="text-xs font-bold text-secondary">
                                        {event.title}
                                    </Text>
                                </View>

                                {/* <UsersList users={event.users} size={34} max={2} /> */}
                            </Pressable>,
                        overlapEventsSpacing: 8,
                        rightEdgeSpacing: 24,
                        onEventPress: (events) =>
                            router.push({
                                pathname: "/[id]/events/[eventId]",
                                params: {
                                    id: String(id),
                                    eventId: String(events?._id)
                                }
                            }),
                        onBackgroundLongPress: (timeString, time) => {
                            setNewEvent({
                                startDate: dayjs(timeString).toISOString(),
                                endDate: dayjs(timeString).add(2, "hour").toISOString(),
                                name: "Nouvelle activité"
                            })
                        },
                        onBackgroundLongPressOut: (timeString, time) => {
                            router.push({
                                pathname: "/[id]/events/new",
                                params: {
                                    id: String(id),
                                    startDate: dayjs(timeString).subtract(2, "hour").toISOString(),
                                    endDate: dayjs(timeString).toISOString(),
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
                        }
                    }}
                    numberOfDays={5}


                />

            </CalendarProvider>
        </Animated.View>
    )
}