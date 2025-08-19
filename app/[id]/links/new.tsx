import { FormText } from "@/components/form/FormText";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import Animated from "react-native-reanimated";


export default function NewTripLink() {

    const { id } = useLocalSearchParams();
    const { control } = useForm();

    return (
        <Animated.ScrollView style={{ flex: 1 }}>
            <FormText control={control} name="name" rules={{ required: true }} />

        </Animated.ScrollView>
    )
}