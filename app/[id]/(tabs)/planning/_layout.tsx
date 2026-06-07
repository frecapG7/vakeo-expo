import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { Stack, useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, View } from "react-native";

export default function PlanningLayout() {

    const { id } = useGlobalSearchParams();
    const router = useRouter();
    const { data: trip } = useGetTrip(id);
    const { me } = useContext(TripContext);

    const colors = useColors();

    const pathname = usePathname();
    const isCalendar = pathname?.includes("calendar");

    return (
        <Stack screenOptions={{
            headerShown: true,
            title: "Planning",
            headerBackground: () => trip && <BackgroundHeader trip={trip} />,
            headerRight: () =>
                <View className="flex flex-row justify-end items-center my-2 gap-2">
                    <Pressable
                        onPress={() => {
                            if (isCalendar)
                                router.dismissTo({
                                    pathname: "/[id]/(tabs)/planning",
                                    params: {
                                        id: String(id),
                                    }
                                })
                            else
                                router.dismissTo({
                                    pathname: "/[id]/(tabs)/planning/calendar",
                                    params: {
                                        id: String(id),
                                    }
                                })
                        }}
                        className="flex-row p-1 rounded-full bg-gray-200 dark:bg-gray-800 justify-evenly items-center gap-2">
                        <View className={`${!isCalendar ? "bg-white dark:bg-gray-900 rounded-full" : ""} p-2`}>
                            <IconSymbol
                                name="list.dash"
                                size={20}
                                color={!isCalendar ? colors.text : "gray"}
                            />
                        </View>
                        <View className={`${isCalendar ? "bg-white dark:bg-gray-900 rounded-full" : ""} p-2`}>
                            <IconSymbol
                                name="calendar"
                                size={20}
                                color={isCalendar ? colors.text : "gray"}
                            />
                        </View>
                    </Pressable>
                    <Avatar alt={me?.name?.charAt(0)} src={me?.avatar} />
                </View>,
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="calendar"
            />
        </Stack>
    )
}