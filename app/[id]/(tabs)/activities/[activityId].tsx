import { Button } from "@/components/ui/Button";
import { CalendarDayView } from "@/components/ui/CalendarDayView";
import { UsersList } from "@/components/users/UsersList";
import { useGetActivity } from "@/hooks/api/useActivities";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { EditActivity } from "./components/EditActivity";



export default function TripActivityDetails() {

    const { container } = useStyles();


    const { id, activityId } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));
    const { data: activity } = useGetActivity(String(id), String(activityId));


    const [edit, setEdit] = useState(false);

    const { formatDate, formatHour } = useI18nTime();


    const navigation = useNavigation();
    navigation.setOptions({
        headerTitle: activity?.name,
        headerRight: () => <Button title="Modifier" onPress={() => setEdit(true)} className="flex flex-row justify-center items-center p-2 rounded-lg" />
    })


    return (
        <View>



            <View className="flex flex-row items-center justify-between px-10 py-2">
                <View className="bg-orange-100">
                    <CalendarDayView >
                        <View className="flex flex-row items-between justify-center gap-1">
                            <Text className="text-xs text-secondary font-bold uppercase">
                                {formatDate(date, {
                                    weekday: "short",
                                })}
                            </Text>
                            <IconSymbol name="calendar" size={14} />

                        </View>
                        <Text className="text-xl text-secondary font-bold">
                            {formatDate(date, {
                                day: "2-digit"
                            })}
                        </Text>
                        <Text className="text-md text-secondary font-bold uppercase">
                            {formatDate(date, {
                                month: "short",
                            })}
                        </Text>
                    </CalendarDayView>
                </View>

                <View className="flex flex-col items-center gap-2 p-5 rounded-lg bg-orange-100">
                    <Text className="text-xl text-blue-600 font-bold">
                        {activity?.name}
                    </Text>
                    <Text className="italic text-lg text-blue-600">10-12h</Text>
                </View>
            </View>

            <View className="flex flex-col px-10 gap-1">

                <View>
                    <Text className="text-secondary font-bold">Qui participe ?</Text>

                    <View className="bg-gray-200 rounded-lg px-4 py-0.5">
                        <UsersList users={activity?.users} />
                    </View>
                </View>
            </View>

            <EditActivity open={edit}
                onClose={() => setEdit(false)}
                trip={trip}
                activity={activity}
            />
        </View>
    )



}