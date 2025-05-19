import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";



export default function ItemDetailsLayout() {



    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: trip } = useGetTrip(String(id));


    return (
        <Stack>
            <Stack.Screen name="index" options={{
                header: () => (
                    <View className="flex flex-row justify-between items-center p-5 bg-red-200 h-20">
                        <View className="flex flex-row gap-1 justify-start items-center">
                            <Pressable onPress={() => router.back()}>
                                <IconSymbol name="chevron.left" size={25} color="#000" />
                            </Pressable>
                            <Text className="text-2xl font-bold">{trip?.name}</Text>

                        </View>

                        <IconSymbol name="ellipsis.circle" size={25} color="#000" />

                    </View>
                )
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
            <Stack.Screen name="activities" options={{
                presentation: "modal"
            }} />

        </Stack >

    );
}