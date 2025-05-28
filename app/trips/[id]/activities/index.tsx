import { Avatar } from "@/components/ui/Avatar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetActivities } from "@/hooks/api/useActivities";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";



export default function TripActivities() {



    const { id } = useLocalSearchParams();
    const { data: activities } = useGetActivities(String(id));


    const { formatDate } = useI18nTime();

    const router = useRouter();;

    return (
        <Animated.ScrollView>


            <View className="flex flex-col gap-2 divide-y divide-solid divide-white p-10">

                {activities?.map((activity) => (
                    <View key={activity.id} className="flex flex-row justify-between align-center p-5 rounded-lg bg-white shadow-md">
                        <View className="flex flex-col gap-1 w-2/3">
                            <Text className="text-xl font-bold">{activity.name}</Text>
                            <Text className="text-sm text-gray-500">{activity.description}</Text>
                            <View className="flex flex-row justify-between gap-1">
                                <View className="flex flex-row gap-1 items-center">

                                    {activity.users?.map((user) => (
                                        <Avatar key={user?.id} name={user.name} color="#62D16E" />
                                    ))}
                                </View>
                                <View className="flex flex-row gap-2 rounded-lg bg-gray-300 p-2 items-center justify-center">
                                    <IconSymbol name="calendar" size={20} color="#000" />
                                    <Text className="text-sm">{formatDate(activity.startDate)} - {formatDate(activity.endDate)} </Text>
                                </View>

                            </View>
                        </View>
                        <Pressable className="flex justify-center items-center" onPress={() => router.push(`/trips/${id}/activities/${activity.id}`)}>
                            <IconSymbol name="chevron.right" size={25} color="#000" />
                        </Pressable>


                    </View>
                ))}
            </View>



        </Animated.ScrollView>
    )
}