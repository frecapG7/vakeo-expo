import { IconSymbol } from "@/components/ui/IconSymbol";
import { UsersList } from "@/components/users/UsersList";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { CalendarProvider, ExpandableCalendar, TimelineList } from "react-native-calendars";
import Animated from "react-native-reanimated";

interface IEvent {
    id: string,
    start: string,
    end: string,
    title: string,
    summary: string,
    color: string,
    users: {
        id: number,
        name: string
    }[]
}


export default function TripCalendar() {




    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));



    const [currentDate, setCurrentDate] = useState("2025-06-14");
    const [longPressStartDate, setLongPressStartDate] = useState<string>("");
    const [longPressEndDate, setLongPressEndDate] = useState<string>("");



    const [items, setItems] = useState<IEvent>({
        "2025-06-14": [{
            id: "1",
            start: "2025-06-14 09:00",
            end: "2025-06-14  10:00",
            title: "Sortie bateau",
            // color: "#FF5733",
            users: [
                {
                    id: 1,
                    name: "Florian",
                },
                {
                    id: 2,
                    name: "Alice",
                },
                {
                    id: 3,
                    name: "Bob",
                }
            ]
        },
        {
            id: "2",
            start: "2025-06-14 10:30",
            end: "2025-06-14 12:00",
            title: "Baignade à la plage",
            summary: "Explore the iconic Eiffel Tower and enjoy the view from the top.",
            users: [
                {
                    id: 1,
                    name: "Florian",
                }, {
                    id: 2,
                    name: "Alice",
                },
                {
                    id: 3,
                    name: "Bob",
                }
            ]
        },
        {
            id: "3",
            start: "2025-06-14 10:30",
            end: "2025-06-14 14:00",
            title: "Pate bolo",
            summary: "Savor a delicious lunch at a local bistro near the Eiffel Tower.",
            users: [
                {
                    id: 1,
                    name: "Florian",
                }
            ]
        }]
    });



    const { container, calendar } = useStyles()

    const router = useRouter();



    return (
        <Animated.ScrollView style={container}>
            <Text className="text-secondary">{currentDate}</Text>
            <CalendarProvider
                date={currentDate}
                showTodayButton
                disabledOpacity={0.6}
                onDateChanged={(date) => {
                    console.log("Date changed", date);
                    setCurrentDate(date)
                }
                }
                numberOfDays={1}
            >
                <ExpandableCalendar
                    theme={calendar}
                    allowShadow={true}
                    initialPosition={ExpandableCalendar.positions.CLOSED}
                />
                <TimelineList
                    events={items}
                    showNowIndicator
                    initialTime={{ hour: 9, minutes: 0 }}
                    scrollToFirst
                    timelineProps={{
                        renderEvent: (event) =>
                            <View className="flex flex-col w-full items-around ring-secondary">
                                <View className="flex flex-row items-center justify-around gap-2">
                                    <Text className="text-lg font-bold text-secondary">{event.title}</Text>
                                    <IconSymbol name="flame" size={34} />
                                </View>
                                <UsersList users={event.users} size={34} max={2} />
                            </View>,
                        overlapEventsSpacing: 8,
                        rightEdgeSpacing: 24,
                        onBackgroundLongPress: (timeString, time) => {
                            router.setParams({ startDate: timeString });
                        },
                        onBackgroundLongPressOut: (timeString, time) => {
                            router.push({ pathname: "./calendar/add-event", params: { startDate: longPressStartDate, endDate: timeString } });
                        },
                    }}
                    theme={{
                        timelineBackgroundColor: "#f0f0f0",

                    }}
                    numberOfDays={1}


                />

            </CalendarProvider>
        </Animated.ScrollView>
    )
}