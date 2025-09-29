import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable } from "react-native";



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