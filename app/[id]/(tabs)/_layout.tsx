import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetTrip } from "@/hooks/api/useTrips";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ItemDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
   
    return (
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <Tabs screenOptions={{
                        headerShown: false,
                     
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
                                headerShown: false,
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
                                tabBarIcon: ({ color }) => <IconSymbol name="cart" color={color} />,
                                headerShown: false,
                                title: "La Liste",
                            }} />
                        <Tabs.Screen name="calendar"
                            options={{
                                href: null,
                                tabBarIcon: ({ color, size }) => (
                                    <IconSymbol name="calendar" size={24} color={color} />
                                ),
                                title: "Calendrier",
                            }} />

                        <Tabs.Screen name="links"
                            options={{
                                href: null
                            }} />



                    </Tabs >

                    
                </BottomSheetModalProvider>
            </GestureHandlerRootView>


    );
}