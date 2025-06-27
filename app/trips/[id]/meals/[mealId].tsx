import { CalendarView } from "@/components/meals/CalendarView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { UsersList } from "@/components/users/UsersList";
import { useGetMeal } from "@/hooks/api/useMeals";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import AddGrocery from "./components/AddGrocery";


export default function TripMealDetails() {


    const { container } = useStyles();

    const { id, mealId } = useLocalSearchParams();
    const { data: meal } = useGetMeal(String(id), String(mealId));

    const { formatDay, formatHour, formatDate } = useI18nTime();


    const navigation = useNavigation();
    navigation.setOptions({
        headerTitle: meal?.name,
    });

    const router = useRouter();


    const [modalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <Animated.ScrollView style={container}>
            <View className="flex flex-row items-center justify-between px-5">
                <CalendarView startDate={meal?.startDate} endDate={meal?.endDate} />
                <View className="flex flex-col rounded-lg justify-center items-center ring-2 ring-secondary bg-primary-400 px-5 py-2">
                    {meal?.rate &&
                        <View className="flex flex-row items-center">
                            <Text className="text-xl font-bold text-yellow-200 dark:text-secondary ">{meal.rate}</Text>
                            <IconSymbol name="star.fill" size={24} color="yellow" />
                        </View>
                    }
                    <Text className="text-sm italic text-secondary">{meal?.rates?.length} avis</Text>
                </View>
            </View>
            <View className="flex flex-col p-10 gap-1">

                <View>
                    <Text className="text-secondary font-bold">Qui cuisine ?</Text>
                    <View className="bg-primary-400 rounded-lg px-4 py-0.5">
                        {meal?.cooks?.length === 0 && <Text className="text-secondary py-2">Aucun cuisiner</Text>}
                        <UsersList users={meal?.cooks} max={5} size={24} />
                    </View>
                </View>


                <View>
                    <Text className="text-secondary font-bold">Qui mange ?</Text>
                    <View className="bg-primary-400 rounded-lg px-4 py-0.5">
                        <UsersList users={meal?.users} max={5} size={24} />
                    </View>
                </View>

                <View className="flex flex-col gap-2">
                    <Text className="text-lg font-bold text-secondary">Courses</Text>
                    <Pressable className="flex flex-row gap-2 items-center" onPress={() => setModalVisible(true)}>
                        <IconSymbol name="plus" size={24} color="black" />
                        <Text className="text-lg text-secondary">Ajouter</Text>
                    </Pressable>
                    {meal?.groceries?.filter((item) => !item.checked).map((item) => (
                        <Pressable key={item.id} className="flex flex-row items-center justify-start gap-2">
                            <IconSymbol name="circle" size={24} color="black" />
                            <Text className="text-lg text-secondary">{item.name} ({item.quantity} {item.unit})</Text>
                        </Pressable>
                    ))}

                    {meal?.groceries?.filter((item) => item.checked).map((item) => (
                        <View key={item.id} className="flex flex-row items-center justify-start gap-2">
                            <IconSymbol name="circle.fill" size={24} color="black" />
                            <Text className="text-lg text-secondary decoration-secondary line-through">{item.name} ({item.quantity} {item.unit})</Text>
                        </View>
                    ))}
                </View>
            </View>


            <AddGrocery open={modalVisible} onClose={() => setModalVisible(false)} />

        </Animated.ScrollView>
    )
}