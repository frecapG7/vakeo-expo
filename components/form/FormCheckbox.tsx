import { useController } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

import AnimatedCheckbox from 'react-native-checkbox-reanimated';

export const FormCheckbox = ({
    control,
    name,
    rules,
    defaultValue = false
}: {
    control: any;
    name: string;
    rules?: object;
    defaultValue?: boolean;
}) => {


    const { field: { value, onChange, ref },
        fieldState: { error } } = useController({
            name,
            control,
            rules,
            defaultValue,
        });


    return (
        <View>
            <Pressable onPress={() => onChange(!value)} className="w-7">
                <AnimatedCheckbox checked={value}
                    highlightColor="#4444ff"
                    checkmarkColor="#483AA0"
                    boxOutlineColor="#4444ff"
                />
            </Pressable>
            <Text>{name}</Text>
            <Text>{JSON.stringify(value)}</Text>
        </View>
    )
}