import { useFieldArray } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { FormDateTimePicker } from "../form/FormDateTimePicker";
import { FormText } from "../form/FormText";
import { IconSymbol } from "../ui/IconSymbol";


export const MealForm = ({ control }: { control: any }) => {


    const { fields: groceries, append, remove } = useFieldArray({
        control,
        name: "groceries"
    });


    return (
        <View className="flex gap-2">


            <FormText control={control}
                name="name"
                label="Nom du repas"
                placeholder="Entrer le nom du repas"
                rules={{
                    required: true
                }} />


            <FormDateTimePicker
                control={control}
                name="startDate"
                label="Quel jour ?"
                rules={{ required: true }}
            />

            <FormDateTimePicker
                control={control}
                name="startDate"
                label="Heure de début"
                rules={{ required: true }}
                
            />







            <Text className="text-lg text-secondary font-bold">Courses</Text>

            <View className="flex flex-col bg-primary-400 p-4 rounded-lg flex gap-2">
                {groceries.map((item, index) => (
                    <Animated.View key={item.id} entering={FadeInUp} exiting={FadeInDown}>
                        <View className="flex flex-row items-center gap-2">
                            <FormText
                                control={control}
                                name={`groceries.${index}.name`}
                                rules={{ required: true }}
                                className="flex-1"
                            />

                            <Pressable onPress={() => remove(index)} className="p-2">
                                <IconSymbol name="trash" size={20} />
                            </Pressable>
                        </View>
                    </Animated.View>
                ))}
                <Pressable className="flex flex-row gap-2 items-center mt-1" onPress={() => append({ name: "" })}>
                    <IconSymbol name="plus" size={24} />
                    <Text className="text-secondary">Ajouter un ingrédient</Text>
                </Pressable>
            </View>









        </View>
    );
}