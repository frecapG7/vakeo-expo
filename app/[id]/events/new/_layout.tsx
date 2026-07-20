import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext"; 
import { usePostEvent } from "@/hooks/api/useEvents";
import useColors from "@/hooks/styles/useColors";
import { Event } from "@/types/models";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

// 1️⃣ Fix Lapin : Typage propre pour accepter 'undefined' sans faire planter TypeScript
const firstParam = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

export default function NewEventLayout() {
    // 2️⃣ Fix frecapG7 : On retire 'id' d'ici, il est devenu inutile
    const { startDate, endDate } = useLocalSearchParams();
    
    const { trip } = useContext(TripContext); 

    const methods = useForm<Omit<Event, "_id">>({
        defaultValues: {
            name: "",
            type: "",
            // 3️⃣ Fix frecapG7 : Retour en arrière. On ne force plus la date ici pour éviter
            // que tous les événements soient créés le 1er jour du séjour.
            ...(startDate && {startDate: firstParam(startDate)}),
            ...(endDate && {endDate: firstParam(endDate)})
        }
    });

    const router = useRouter();
    const {text} = useColors();
    
    // ✨ Fix frecapG7 / Lapin : On manipule directement l'ID depuis l'objet trip !
    const postEvent = usePostEvent(trip?._id);

    const onSubmit = async (data: Omit<Event, '_id'>) => {
        const newEvent = await postEvent.mutateAsync(data);
        router.navigate({
            pathname: "/[id]/events/[eventId]",
            params: {
                id: trip?._id, // On utilise l'ID sécurisé du trip
                eventId: newEvent._id
            }
        });
    }

    return (
        <FormProvider {...methods}>
            <Stack screenOptions={{
                headerShown: true,
                headerRight: () => 
                <Button onPress={() => router.dismissTo({
                    pathname: "/[id]/(tabs)/planning",
                    params: {
                        id: trip?._id // On utilise l'ID sécurisé du trip
                    }
                })}>
                    <IconSymbol name="xmark" color={text} size={24} />
                </Button>
            }}>
                <Stack.Screen name="index"
                    options={{
                        headerLeft: () => (
                            <View className="flex-row items-center">
                                <Button onPress={() => router.back()}>
                                    <IconSymbol name="arrow.left" color="gray" />
                                </Button>
                                <Chip text="1 sur 3" size="xsmall" />
                            </View>
                        ),
                        title: ""
                    }} />
                <Stack.Screen name="setup-event-info"
                    options={{
                        headerLeft: () => (
                            <View className="flex-row items-center">
                                <Button onPress={() => router.back()}>
                                    <IconSymbol name="arrow.left" color="gray" />
                                </Button>
                                <Chip text="2 sur 3" size="xsmall" />
                            </View>
                        ),
                        title: ""
                    }} />
                <Stack.Screen name="setup-event-users"
                    options={{
                        headerLeft: () => (
                            <View className="flex-row items-center">
                                <Button onPress={() => router.back()}>
                                    <IconSymbol name="arrow.left" color="gray" />
                                </Button>
                                <Chip text="3 sur 3" size="xsmall" />
                            </View>
                        ),
                        title: "",
                    }}
                />
            </Stack>
        </FormProvider>
    )
}