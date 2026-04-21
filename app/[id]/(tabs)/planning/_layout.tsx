import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";



export default function PlanningLayout() {

    const { id } = useGlobalSearchParams();
    const router = useRouter();

    return (
        <Stack screenOptions={{
            headerShown: true,
            header: ({ navigation, route }) =>
                <View className="flex flex-row justify-end my-2">
                    <Pressable
                        onPress={() => {
                            if (route.name === "calendar")
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
                        className="flex-row p-1 rounded-full bg-gray-200 dark:bg-gray-800 justify-evenly items-center w-40 gap-2">
                        <Text
                            className={`${route.name !== "calendar" && "bg-white dark:bg-gray-900  dark:text-white rounded-full  font-bold"} p-2 text-center dark:text-gray-400`}>
                            Liste
                        </Text>
                        <Text
                            className={`${route.name === "calendar" && "bg-white dark:bg-gray-900  dark:text-white rounded-full  font-bold"} p-2 text-center dark:text-gray-400`}>
                            Calendrier
                        </Text>
                    </Pressable>
                </View>
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="calendar"
            />
        </Stack>
    )
}