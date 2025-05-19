import { useGetActivities } from "@/hooks/api/useActivities";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function TripActivities() {



    const { id } = useLocalSearchParams();
    const { data: activities } = useGetActivities(String(id));



    return (
        <Animated.ScrollView>


            <View className="flex flex-col gap-2 divide-y divide-solid divide-white">

                {activities?.map((activity) => (
                    <View key={activity.id} className="flex flex-row justify-between align-center py-5">
                        <Text>{activity.name}</Text>
                    </View>
                ))}
            </View>



        </Animated.ScrollView>
    )
}