import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useStyles } from "@/hooks/styles/useStyles";
import { Tabs, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";



export default function ItemDetailsLayout() {



    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: trip } = useGetTrip(String(id));

    const { formatDate } = useI18nTime();


    const { header } = useStyles();


    const navigation = useNavigation();
    navigation.setOptions({
        // headerLeft: () => <Pressable onPress={() => router.dismissTo("/")}>
        //     <IconSymbol name="chevron.left" size={24} />
        // </Pressable>,
        headerBackVisible: false,
        headerRight: () => (
            <View className="flex flex-row gap-2 justify-end items-center mx-5">
                <Pressable onPress={() => router.push({ pathname: "/trips/[id]/pick-user", params: { id } })} className="flex flex-row gap-1 items-center ring-1 ring-secondary  rounded-full px-2 py-1 bg-primary-800">
                    <IconSymbol name="person.circle" size={20} color="#000" />
                    <Text className="text-secondary text-sm">{trip?.users?.length}</Text>
                </Pressable>
                <IconSymbol name="ellipsis.circle" size={25} color="#000" />
            </View>
        )
    });


    return (

        <Tabs screenOptions={{

            tabBarActiveTintColor: header?.tintColor,
            tabBarInactiveTintColor: header?.tintColor,
            tabBarLabelPosition: "below-icon",
            tabBarStyle: {
                backgroundColor: header?.backgroundColor,
                borderTopWidth: 0,
            },
            headerStyle: {
                backgroundColor: header?.backgroundColor,
            },
            headerTintColor: header.tintColor,


        }}>

            <Tabs.Screen name="index" options={{
                title: trip?.name || "Détails du voyage",
                tabBarIcon: ({ color, size }) => (
                    <IconSymbol name="list.dash" size={size} color="black" />
                ),
                headerTitle: () => <View className="flex flex-row gap-2 justify-start items-center ml-5">
                    {trip &&
                        <View className="flex flex-col justify-center items-start">
                            <Text className="text-lg font-bold text-secondary">{trip?.name}</Text>
                            <Text className="text-xs text-secondary italic">
                                {formatDate(trip?.startDate)} - {formatDate(trip?.endDate)}
                            </Text>
                        </View>
                    }
                    {!trip &&
                        <View className="flex flex-col justify-center items-start">
                            <Skeleton width={250} height={30} />
                        </View>}
                </View>,

            }} />
            <Tabs.Screen
                name="dates"
                options={{
                    headerShown: true,
                    // presentation: "modal",
                    title: "Sélectionner les dates",
                    headerTitle: "Date de séjour",
                    headerLeft(props) {
                        return (
                            <TouchableOpacity onPress={() => router.back()}>
                                <IconSymbol name="xmark.circle" size={20} color="#000" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        )
                    },
                    href: null
                }}
            />
            <Tabs.Screen
                name="activities"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
            <Tabs.Screen name="links"
                options={{
                    href: null
                }} />
            <Tabs.Screen name="meals"
                options={{
                    href: null,
                    headerShown: false,
                    title: "Les menus",
                }} />
            <Tabs.Screen name="calendar"
                options={{
                    href: { pathname: "/trips/[id]/calendar", params: { id } },
                    tabBarIcon: ({ color, size }) => (
                        <IconSymbol name="calendar" size={24} color="black" />
                    ),
                    title: "Calendrier",
                }} />
            <Tabs.Screen name="pick-user"
                options={{
                    href: null,
                    headerShown: false,
                }} />
        </Tabs >



    );
}