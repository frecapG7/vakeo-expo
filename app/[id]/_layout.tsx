import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";



export default function ItemDetailsLayout() {



    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: trip } = useGetTrip(String(id));

    const navigation = useNavigation();



    useEffect(() => {
        navigation.setOptions({
            title: trip?.name,
            headerRight: () => (
                <View className="flex flex-row gap-2 justify-end items-center mx-5">
                    <Pressable onPress={() => router.push('./messages')}
                        className="flex flex-row gap-1 items-center ring-1 rounded-full p-3 py-1 bg-blue-200">
                        <IconSymbol name="message" size={20} color="#000" />
                        <Text className="text-secondary text-sm">{trip?.users?.length}</Text>
                    </Pressable>
                    <IconSymbol name="ellipsis.circle" size={25} color="#000" />
                </View>
            )
        });
    }, [navigation, trip])



    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{
                headerShown: false
            }} />
            <Stack.Screen name="pick-user" options={{
                presentation: "modal",
                title: "Choisis qui tu es",
                 headerStyle: {
                    backgroundColor: "primary",
                },
            }} />
            <Stack.Screen name="messages" options={{
                presentation: "modal",
                title: "Messagerie",
                headerStyle: {
                    backgroundColor: "background",
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />
            <Stack.Screen name="dates"
                options={{
                    presentation: "modal"
                }} />
        </Stack>
    )

}