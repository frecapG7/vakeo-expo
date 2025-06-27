import { Pressable, Text, View } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useController } from "react-hook-form";


export const FormDateTimePicker = ({
    control,
    name,
    label,
    rules = {},
}: {
    control: any;
    name: string;
    label?: string;
    rules?: any;
}) => {



    const { field: { onChange, value, onBlur } } = useController({
        control,
        name,
        rules,
    })
    return (
        <View className="flex">
            <Text className="text-sm font-bold mb-2 text-secondary">toto</Text>
            <Pressable className="flex bg-gray-200 rounded-lg p-2 mb-2">
                <Text>{value}</Text>
            </Pressable>
            <DateTimePicker
                testID="dateTimePicker"
                value={value}
                mode="date"
                onChange={(v) => onChange(v)} />

        </View>

    );
}