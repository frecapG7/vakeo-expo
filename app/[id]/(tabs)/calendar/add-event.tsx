import { FormText } from "@/components/form/FormText";
import { useStyles } from "@/hooks/styles/useStyles";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { Animated, Text, View } from "react-native";




export default function TripCalendarAddEvent() {



    const { container } = useStyles();
    const { startDate, endDate } = useLocalSearchParams<{ startDate: string, endDate: string }>();


    const { control, reset, handleSubmit } = useForm();


    return (
        <Animated.ScrollView style={container}>

            <Text className="text-secondary">Add event</Text>
            <Text className="text-secondary">{startDate}</Text>
            <Text className="text-secondary">{endDate}</Text>

            <View>
                <FormText control={control} name="title" label="Titre" rules={{
                    required: true
                }} />
            </View>
        </Animated.ScrollView>
    )
}