import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import useColors from "@/hooks/styles/useColors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";




export default function TripEventsLayout() {


    const {id} = useLocalSearchParams();

    const colors = useColors();
    const router = useRouter();

    return (
        <Stack screenOptions={{
            title: "",
            headerStyle: {
                backgroundColor: colors.background,
            },
            headerShadowVisible: false
        }}>
            <Stack.Screen name="index" options={{
                headerLeft: () => (<View className="flex-row items-center justify-center gap-1">
                    <Text className="text-2xl font-bold dark:text-white">Activités</Text>
                    <View className="rounded-full bg-orange-400 dark:bg-gray-400 p-2">
                        <IconSymbol name="flame" size={20} color="black" />
                    </View>
                </View>),
                headerRight: () => (
                    <Button variant="contained"
                        className="p-2 rounded-full ringed"
                        onPress={() => {
                            //TODO: ./new should be enought but it is not
                            router.push({
                                pathname: "/[id]/(tabs)/activities/new",
                                params: { id: String(id) }
                            });
                        }} >
                        <IconSymbol name="plus" size={20} />
                    </Button>
                )
            }} />
            <Stack.Screen name="new" options={{
                title: "Nouvelle activité",
                headerBackTitle: "Annuler",
                presentation: "modal"
            }}
            />
            <Stack.Screen name="[activityId]" options={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: colors.background
                }

            }} />
        </Stack >
    )
}