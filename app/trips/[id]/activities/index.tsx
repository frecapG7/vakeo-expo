import { IconSymbol } from "@/components/ui/IconSymbol";
import { AvatarsList } from "@/components/users/AvatarsList";
import { useGetActivities } from "@/hooks/api/useActivities";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";



export default function TripActivities() {


    const { container } = useStyles();

    const { id } = useLocalSearchParams();
    const { data: activities } = useGetActivities(String(id));


    const { formatDate, formatHour } = useI18nTime();

    const router = useRouter();


    const groupedActivities = useMemo(() => activities?.reduce((acc, activity) => {
        const day = activity.startDate?.split('T')[0] || 'NaN';
        if (!acc[day])
            acc[day] = []
        acc[day].push(activity);
        return acc;
    }, {}), [activities]);

    return (
        <Animated.ScrollView style={container}>
            {groupedActivities &&
                <View className="flex flex-col gap-2 divide-y divide-solid divide-secondary p-2">
                    {Object.keys(groupedActivities)?.map((day) => (
                        <View className="flex gap-2" key={day}>
                            <View className="flex flex-row gap-1">
                                <IconSymbol name="calendar" size={24} />
                                <Text className="text-lg text-secondary">{day !== "NaN" ? day : ""}</Text>
                            </View>
                            <View className="px-2 flex gap-5">
                                {groupedActivities[day]?.map((activity) =>
                                    <View key={activity.id} className="flex flex-row items-center gap-4">
                                        <View>
                                            <Text className="text-xs italic text-secondary">
                                                {formatHour(activity.startDate)} - {formatHour(activity.endDate)}
                                            </Text>
                                        </View>
                                        <Pressable className="flex flex-row flex-grow p-2 justify-between align-center rounded-lg bg-primary-400 ring-secondary ring-2 " onPress={() => router.push(`/trips/${id}/activities/${activity.id}`)}>
                                            <Text className="text-md font-bold text-secondary">{activity.name}</Text>

                                            <AvatarsList users={activity.users} />

                                        </Pressable>
                                    </View>
                                )}
                            </View>

                        </View>
                    ))}
                </View>
            }


        </Animated.ScrollView >
    )
}