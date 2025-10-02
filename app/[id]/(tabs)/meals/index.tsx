import { IconSymbol } from "@/components/ui/IconSymbol";
import { AvatarsList } from "@/components/users/AvatarsList";
import styles from "@/constants/Styles";
import { useGetMeals } from "@/hooks/api/useMeals";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
export default function TripMeals() {



    const router = useRouter();


    const { id } = useLocalSearchParams();
    const { data: meals } = useGetMeals(id);


    const { formatDay, formatHour } = useI18nTime();



    const groupedMeals = useMemo(() => meals?.reduce((acc, meals) => {
        const day = meals.startDate?.split('T')[0] || 'NaN';
        if (!acc[day])
            acc[day] = []
        acc[day].push(meals);
        return acc;
    }, {}), [meals]);




    return (
        <Animated.ScrollView style={styles.container}>
            {groupedMeals &&
                <View className="flex flex-col gap-2 divide-y divide-solid divide-secondary p-2">
                    {Object.keys(groupedMeals)?.map((day) => (
                        <View className="flex gap-2" key={day}>
                            <View className="flex flex-row gap-1">
                                <IconSymbol name="calendar" size={24} />
                                <Text className="text-lg text-secondary">{day !== "NaN" ? formatDay(day + "T00:00:00Z") : ""}</Text>
                            </View>
                            <View className="px-5 flex gap-5">
                                {groupedMeals[day]?.map((meal) =>
                                    <View key={meal.id} className="flex flex-row items-center gap-4">
                                        <View>
                                            <Text className="text-sm italic text-secondary">
                                                {formatHour(meal.startDate)} - {formatHour(meal.endDate)}
                                            </Text>
                                        </View>
                                        <Pressable className="flex flex-col flex-grow p-2 justify-between align-center rounded-lg bg-primary-400 ring-secondary ring-2"
                                            onPress={() => router.push({ pathname: "/trips/[id]/meals/[mealId]", params: { id, mealId: meal.id } })}>
                                            <View className="flex flex-row items-center justify-between ">
                                                <Text className="text-md font-bold text-secondary">{meal.name}</Text>
                                                {meal.hasWarning && <IconSymbol name="exclamationmark.triangle" size={24} color="red" />}
                                            </View>

                                            <View className="flex flex-row justify-end">
                                                <AvatarsList users={meal.cooks} title="Qui cuisine ?" />
                                            </View>

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