import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";

import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";

export default function ItemDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();
    const {me} = useContext(TripContext);
    const { data: trip } = useGetTrip(String(id));

    return (
        <Tabs screenOptions={{
            headerShown: true,
            headerBackground: () => trip && <BackgroundHeader trip={trip} />,
            headerTintColor: "white",
            headerRight: () => (
                <View className="flex flex-row gap-2 justify-end items-center mx-10">
                    <Pressable className="flex-row gap-1 items-center"
                     onPressOut={() => router.push({
                        pathname: "/[id]/(tabs)/settings",
                        params: {
                            id: String(id)
                        }
                     })}>
                        <Text className="text-white font-bold text-sm">
                            {me?.name}
                        </Text>
                        <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="md"/>
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
                    title: "Activités",

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
                    title: "Liste",
                }} />

            <Tabs.Screen name="messages"
                options={{
                    href: {
                        pathname: "/[id]/(tabs)/messages",
                        params: {
                            id: String(id)
                        }
                    },
                    headerShown: true,
                    title: "Messages",
                    tabBarIcon: ({ color, size }) => (
                        <IconSymbol name="paperplane.fill" size={size} color={color} />
                    ),
                }}

            />

            <Tabs.Screen name="settings"
                options={{
                    href: null,
                    headerShown: true,
                    headerRight: () => <></>,
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