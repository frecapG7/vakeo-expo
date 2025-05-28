import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";



export default function ItemDetailsLayout() {



    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: trip } = useGetTrip(String(id));

    const { formatDate } = useI18nTime();

    return (
        <Stack screenOptions={{
            header: ({ options, route, back }) => (
                <View className="flex flex-row justify-between items-center px-5 bg-blue-200 h-20">
                    <View className="flex flex-row gap-2 justify-start items-center">
                        <Pressable onPress={() => router.back()}>
                            <IconSymbol name="arrow.left" size={25} color="#000" />
                        </Pressable>
                        <View>
                            <Text className="text-2xl font-bold">{trip?.name} {options?.title ? `- ${options?.title}` : ''}</Text>
                            <Text>
                                {formatDate(trip?.startDate)} - {formatDate(trip?.endDate)}
                            </Text>
                        </View>


                    </View>

                    <IconSymbol name="ellipsis.circle" size={25} color="#000" />

                </View>
            )
        }} >
            <Stack.Screen name="index" options={{

            }} />
            <Stack.Screen name="dates" options={{
                headerShown: true,
                presentation: "modal",
                title: "Sélectionner les dates",
                headerTitle: "Date de séjour",
                headerLeft(props) {
                    return (
                        <TouchableOpacity onPress={() => router.back()}>
                            <IconSymbol name="xmark.circle" size={20} color="#000" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    )
                },
                headerRight: () => (
                    <Button title="Appliquer" />
                )
            }} />
            <Stack.Screen name="activities" />
            <Stack.Screen name="links" options={{
                headerShown: false
            }} />

        </Stack >

    );
}