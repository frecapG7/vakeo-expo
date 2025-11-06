import { Pressable, Text, View } from "react-native";

import useI18nTime from "@/hooks/i18n/useI18nTime";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
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


    const [show, setShow] = useState(false)

    const { field: { onChange, value, onBlur } } = useController({
        control,
        name,
        rules,
    })

    const { formatDate } = useI18nTime();

    return (
        <View className="flex">
            <Text className="text-sm font-bold mb-2 text-secondary">toto</Text>
            <Pressable className="flex bg-gray-200 rounded-lg p-2 mb-2" onPress={() => setShow(true)}>
                <Text>{formatDate(value)}</Text>
            </Pressable>
            {show &&
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value || new Date()}
                    mode="date"
                    display="compact"
                    onChange={(v) => onChange(v)} 
                    />

            }

        </View>

    );
}