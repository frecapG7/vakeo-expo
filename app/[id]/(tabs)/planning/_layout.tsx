import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";

export default function PlanningLayout() {
    const { id } = useGlobalSearchParams();
    const router = useRouter();

    return (
        <Stack screenOptions={{
            headerShown: true,
            header: ({ route }) => (
                <View className="items-center justify-center my-2 w-full bg-transparent">
                    <View className="flex-row bg-gray-200 dark:bg-gray-800 w-56 h-12 rounded-full p-1">
                        
                        {/* Bouton LISTE */}
                        <TouchableOpacity 
                            className={`flex-1 justify-center items-center rounded-full ${route.name !== 'calendar' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                            onPress={() => {
                                if (route.name === 'calendar') {
                                    router.dismissTo({
                                        pathname: "/[id]/(tabs)/planning",
                                        params: { id: String(id) }
                                    });
                                }
                            }}
                        >
                            <Text className={`font-bold ${route.name !== 'calendar' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                Liste
                            </Text>
                        </TouchableOpacity>

                        {/* Bouton CALENDRIER */}
                        <TouchableOpacity 
                            className={`flex-1 justify-center items-center rounded-full ${route.name === 'calendar' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                            onPress={() => {
                                if (route.name !== 'calendar') {
                                    router.dismissTo({
                                        pathname: "/[id]/(tabs)/planning/calendar",
                                        params: { id: String(id) }
                                    });
                                }
                            }}
                        >
                            <Text className={`font-bold ${route.name === 'calendar' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                Calendrier
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="calendar" />
        </Stack>
    )
}