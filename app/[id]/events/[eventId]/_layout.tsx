import { TripContext } from "@/context/TripContext";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import { Stack, useLocalSearchParams } from "expo-router";
import { useContext } from "react";



export default function EventDetailsLayout() {


    const { id, eventId } = useLocalSearchParams();
    const { me } = useContext(TripContext);
    const { data: trip } = useGetTrip(id);
    const { data: event } = useGetEvent(id, eventId);


    return (
        <Stack screenOptions={{
        }}>
            <Stack.Screen name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="edit"
                options={{
                    presentation: "modal",
                    title: "Modifier"
                }} />
        </Stack>
    )
}