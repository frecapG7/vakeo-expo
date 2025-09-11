import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
import { Tabs, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
                    <Pressable onPress={() => router.push({
                        pathname: "./[id]/messages",
                        params: { id: id }
                    }
                    )} className="flex flex-row gap-1 items-center ring-1 rounded-full p-3 py-1 bg-blue-200">
                        <IconSymbol name="message" size={20} color="#000" />
                        <Text className="text-secondary text-sm">{trip?.users?.length}</Text>
                    </Pressable>
                    <IconSymbol name="ellipsis.circle" size={25} color="#000" />
                </View>
            )
        });
    }, [navigation, trip])


    return (

        <Tabs>
            <Tabs.Screen name="index"
                options={{
                    title: "Accueil",
                    headerShown: false,
                    href: {
                        pathname: "/[id]",
                        params: {
                            id: String(id)
                        }
                    },
                    tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,

                }} />
            <Tabs.Screen
                name="activities"
                options={{
                    href: "/[id]/activities",
                    tabBarIcon: ({ color }) => <IconSymbol name="flame" color={color} />,
                    headerShown: false,
                    title: "Les activités",
                }}
            />
            <Tabs.Screen name="meals"
                options={{
                    href: "./meals",
                    tabBarIcon: ({ color }) => <IconSymbol name="suit.spade" color={color} />,
                    headerShown: false,
                    title: "Les menus",
                }} />
            <Tabs.Screen name="calendar"
                options={{
                    href: {
                        pathname: "/[id]/calendar",
                        params: {
                            id: String(id)
                        }
                    },
                    tabBarIcon: ({ color, size }) => (
                        <IconSymbol name="calendar" size={24} color={color} />
                    ),
                    title: "Calendrier",
                }} />
          
            <Tabs.Screen name="links"
                options={{
                    href: null
                }} />
            <Tabs.Screen name="groceries"
                options={{
                    href: null,
                    headerShown: true,
                    headerLeft: () => <Pressable onPress={() => router.navigate(`/trips/${id}`)}>
                        <IconSymbol name="arrow.left" />
                    </Pressable>,
                    title: "Les courses",
                }} />
        </Tabs >



    );
}