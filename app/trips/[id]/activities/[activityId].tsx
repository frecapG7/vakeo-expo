import { CalendarView } from "@/components/meals/CalendarView";
import { Button } from "@/components/ui/Button";
import { UsersList } from "@/components/users/UsersList";
import { useGetActivity } from "@/hooks/api/useActivities";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
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
        <Animated.ScrollView style={container}>


            <View className="flex flex-row items-center justify-start px-5 py-2">
                <CalendarView startDate={activity?.startDate} endDate={activity?.endDate} />
            </View>

            <View className="flex flex-col px-10 gap-1">

                <View>
                    <Text className="text-secondary font-bold">Qui participe ?</Text>

                    <View className="bg-primary-400 rounded-lg px-4 py-0.5">
                        <UsersList users={activity?.users} />
                    </View>
                </View>
            </View>

            <EditActivity open={edit}
                onClose={() => setEdit(false)}
                trip={trip}
                activity={activity}
            />
        </Animated.ScrollView >
    )



}