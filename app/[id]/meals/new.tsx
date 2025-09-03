import { MealForm } from "@/components/meals/MealForm";
import { useStyles } from "@/hooks/styles/useStyles";
import { useNavigation } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function NewMeal() {


    const { container } = useStyles();


    const { control, handleSubmit } = useForm({
        defaultValues: {
            groceries: [{ name: "" }],
        }
    });

    const onSubmit = (data: any) => {
        console.log("Submitted data:", data);
        // Here you would typically handle the form submission, e.g., send data to an API
    };

    const navigation = useNavigation();
    navigation.setOptions({
        headerRight: () => (
            <Pressable onPress={handleSubmit(onSubmit)} >
                <Text className="text-blue-200 px-4 py-2 font-bold">Terminer</Text>
            </Pressable>
        )
    });


    return (
        <Animated.ScrollView style={container}>


            <View className="px-10">
                <MealForm control={control} />

            </View>

        </Animated.ScrollView>
    )
}
