import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { usePostEvent } from "@/hooks/api/useEvents";
import useColors from "@/hooks/styles/useColors";
import { Event } from "@/types/models";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";


const firstParam = (value: string | string[] | undefined) : string =>
    Array.isArray(value) ? value?.[0] : value || "";




export default function NewEventLayout() {

    const { id, startDate, endDate } = useLocalSearchParams();
    const methods = useForm<Omit<Event, "_id">>({
        defaultValues: {
            name: "",
            type: "",
            ...(startDate && {startDate: firstParam(startDate)}),
            ...(endDate && {endDate: firstParam(endDate)})
        }
    });

    const router = useRouter();

    const {text} = useColors();
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

    return (
        <FormProvider {...methods}>
            <Stack screenOptions={{
                headerShown: true,
                headerRight: () => 
                <Button onPress={() => router.dismissTo({
                    pathname: "/[id]/(tabs)/planning",
                    params: {
                        id: String(id)
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