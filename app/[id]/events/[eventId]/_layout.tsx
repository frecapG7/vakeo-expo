import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGetEvent } from "@/hooks/api/useEvents";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";



export default function EventDetailsLayout() {


    const { id, eventId } = useLocalSearchParams();
    const { me } = useContext(TripContext);
    const { data: trip } = useGetTrip(id);
    const { data: event } = useGetEvent(id, eventId);


    const {text} = useColors();
    const router = useRouter();

    return (

        <Stack screenOptions={{
        }}>
            <Stack.Screen name="index"
                options={{
                    headerShown: true,
                    headerRight: () => <Button variant="contained"
                        title="Modifier"
                        size="small"
                        onPress={() => router.push({
                            pathname: "/[id]/events/[eventId]/edit",
                            params: {
                                id: String(id),
                                eventId: String(eventId)
                            }
                        })}
                    />,
                    headerLeft: () => <Button onPress={() => router.dismissTo({
                        pathname: "/[id]/(tabs)/planning",
                        params: {
                            id: String(id)
                        }
                    })}>
                        <IconSymbol name="arrow.left" color={text} />
                    </Button>,
                    title: ""
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