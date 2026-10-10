import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTrip } from "@/context/TripContext";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Event } from "@/types/models";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { useColorScheme } from "react-native";

const firstParam = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

export default function NewEventLayout() {
    const { startDate, endDate } = useLocalSearchParams();

    const { trip } = useTrip();
    const isDark = useColorScheme() === "dark";
    const text = isDark ? "#F6F8FD" : "#16265C";

    const methods = useForm<Omit<Event, "_id">>({
        defaultValues: {
            name: "",
            type: "",
            // Retour arrière assumé : on ne force plus la date ici pour éviter
            // que tous les événements soient créés le 1er jour du séjour.
            ...(startDate && {startDate: firstParam(startDate)}),
            ...(endDate && {endDate: firstParam(endDate)})
        }
    });

    const router = useRouter();
    const glass = useGlassHeaderOptions();

    return (
        <FormProvider {...methods}>
            <Stack screenOptions={{
                headerShown: true,
                ...glass,
                headerRight: () =>
                <Button onPress={() => router.dismissTo({
                    pathname: "/[id]/(tabs)/planning",
                    params: {
                        id: trip?._id
                    }
                })}>
                    <IconSymbol name="xmark" color={text} size={24} />
                </Button>
            }}>
                <Stack.Screen name="index"
                    options={{
                        headerLeft: () => (
                            <Button onPress={() => router.back()}>
                                <IconSymbol name="arrow.left" color="gray" />
                                <Chip text="1 sur 3" size="xsmall" onPress={() => router.back()} />
                            </Button>
                        ),
                        title: ""
                    }} />
                <Stack.Screen name="setup-event-info"
                    options={{
                        headerLeft: () => (
                            <Button onPress={() => router.back()}>
                                <IconSymbol name="arrow.left" color="gray" />
                                <Chip text="2 sur 3" size="xsmall" onPress={() => router.back()} />
                            </Button>
                        ),
                        title: ""
                    }} />
                <Stack.Screen name="setup-event-users"
                    options={{
                        headerLeft: () => (
                            <Button onPress={() => router.back()}>
                                <IconSymbol name="arrow.left" color="gray" />
                                <Chip text="3 sur 3" size="xsmall" onPress={() => router.back()} />
                            </Button>
                        ),
                        title: "",
                    }}
                />
            </Stack>
        </FormProvider>
    )
}
