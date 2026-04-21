import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { usePostEvent } from "@/hooks/api/useEvents";
import { Event } from "@/types/models";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";




export default function NewEventLayout() {

    const { id, startDate, endDate } = useLocalSearchParams();
    const methods = useForm<Event>({
        defaultValues: {
            name: "",
            type: "",
            ...(startDate && {startDate}),
            ...(endDate && {endDate})
        }
    });

    const router = useRouter();

    const postEvent = usePostEvent(id);


    const onSubmit = async (data: Omit<Event, '_id'>) => {
        const newEvent = await postEvent.mutateAsync(data);
        router.navigate({
            pathname: "/[id]/events/[eventId]",
            params: {
                id: String(id),
                eventId: newEvent._id
            }
        });
    }

    // useEffect(() => {
    //     if (startDate && endDate)
    //         methods.reset({
    //             name: "",
    //             type: "",
    //             startDate,
    //             endDate
    //         })
    // }, [startDate, endDate]);

    return (
        <FormProvider {...methods}>
            <Stack screenOptions={{
                headerShown: true
            }}>
                <Stack.Screen name="index"
                    options={{
                        headerLeft: () => (
                            <View className="flex-row items-center">
                                <Button onPress={() => router.dismissAll()}>
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
                                <Button onPress={() => router.dismissTo({
                                    pathname: "/[id]/events/new",
                                    params: {
                                        id: String(id)
                                    }
                                })}>
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
                                <Button onPress={() => router.dismissTo({
                                    pathname: "/[id]/events/new/setup-event-info",
                                    params: {
                                        id: String(id)
                                    }
                                })}>
                                    <IconSymbol name="arrow.left" color="gray" />
                                </Button>
                                <Chip text="3 sur 3" size="xsmall" />
                            </View>
                        ),
                        title: "",
                        headerRight: () =>
                            <Button variant="contained"
                                size="small"
                                title="Créer l'activité"
                                onPress={methods.handleSubmit(onSubmit)}
                                isLoading={postEvent.isPending}
                            />

                    }}

                />
            </Stack>
        </FormProvider>
    )




}