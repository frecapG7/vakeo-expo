import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";

import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, View } from "react-native";

export default function ItemDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();
    const {showMenu} = useContext(TripContext);
    const { data: trip } = useGetTrip(String(id));

    return (
        <Tabs screenOptions={{
            headerShown: true,
            headerBackground: () => <BackgroundHeader trip={trip} />,
            headerTintColor: "white",
            headerRight: () => (
                <View className="flex flex-row gap-2 justify-end items-center mx-5">
                    <Pressable onPressOut={() => router.push({
                        pathname: "/[id]/messages",
                        params: {
                            id: String(id)
                        }
                    })}
                        className="bg-gray-800 rounded-full p-2">
                        <IconSymbol name="message" size={25} color="white" />
                    </Pressable>
                    <Pressable className="bg-gray-800 p-2 rounded-full" onPressOut={showMenu}>
                        <IconSymbol name="ellipsis.circle" size={25} color="white" />
                    </Pressable>
                </View>
            ),
        }}>
            <Tabs.Screen name="index"
                options={{
                    title: "Accueil",
                    href: {
                        pathname: "/[id]",
                        params: {
                            id: String(id)
                        }
                    },
                    headerShown: false,
                    headerTitle: trip?.name,
                    headerLeft: () => <Button onPress={() => router.dismissAll()}>
                        <IconSymbol name="arrow.left" color="white" />
                    </Button>,
                    tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,
                }} />
            <Tabs.Screen
                name="activities"
                options={{
                    href: {
                        pathname: "/[id]/(tabs)/activities",
                        params: {
                            id: String(id)
                        }
                    },
                    tabBarIcon: ({ color }) => <IconSymbol name="calendar" color={color} />,
                    headerShown: true,
                    title: "Le Programme",

                }}
            />
            <Tabs.Screen name="goods"
                options={{
                    href: {
                        pathname: "/[id]/(tabs)/goods",
                        params: {
                            id: String(id)
                        }
                    },
                    tabBarIcon: ({ color, size }) => <IconSymbol name="cart" size={size} color={color} />,
                    headerShown: true,
                    title: "La Liste",
                }} />

            <Tabs.Screen name="settings"
                options={{
                    href: {
                        pathname: "/[id]/(tabs)/settings",
                        params: {
                            id: String(id)
                        }
                    },
                    headerShown: true,
                    title: "Réglages",
                    tabBarIcon: ({ color, size }) => (
                        <IconSymbol name="person.circle" size={size} color={color} />
                    ),
                }}

            />

            <Tabs.Screen name="calendar"
                options={{
                    href: null,
                    title: "Calendrier",
                }} />

            <Tabs.Screen name="links"
                options={{
                    href: null
                }} />



        </Tabs >




    );
}