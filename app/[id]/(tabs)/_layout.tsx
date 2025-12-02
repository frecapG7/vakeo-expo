import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";



export default function ItemDetailsLayout() {



    const router = useRouter();
    const { id } = useLocalSearchParams();


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
                    href: {
                        pathname: "/[id]/(tabs)/activities",
                        params: {
                            id: String(id)
                        }
                    },
                    tabBarIcon: ({ color }) => <IconSymbol name="flame" color={color} />,
                    headerShown: false,
                    title: "Les activités",
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
                    title: "Les courses",
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
        


        </Tabs >



    );
}