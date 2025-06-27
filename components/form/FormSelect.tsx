import { useState } from "react";
import { useController } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";


export const FormSelect = ({ control, name, label, options = [] }: {
    control: any,
    name: string,
    label?: string,
    options?: { label: string, value: string }[]
}) => {



    const [showOptions, setShowOptions] = useState(false);



    const { field: { onChange, value, onBlur, ref } } = useController({
        control,
        name,
        defaultValue: ''
    });


    return (
        <View className="flex">
            <Text className="text-sm font-bold mx-2 text-secondary">{label}</Text>
            <Pressable
                onPress={() => {
                    setShowOptions(!showOptions);
                }}
                className="p-2 rounded-lg bg-gray-200 flex flex-row justify-between items-center"
            >
                <Text>
                    {value ? options.find(option => option.value === value)?.label || value : ""}
                </Text>
            </Pressable>


            {showOptions &&
                <Animated.View entering={FadeIn} exiting={FadeOut} style={{ position: 'absolute', top: 50, left: 0, right: 0, zIndex: 1000 }} >
                    <View className="h-full max-width-md bg-gray-200 rounded-lg shadow-lg ">
                        <View className="flex flex-col divide-y divide-secondary">
                            {options.map((option) => (
                                <Pressable
                                    key={option.value}
                                    onPress={() => {
                                        onChange(option.value);
                                        setShowOptions(false);
                                    }}
                                    className="p-2 hover:bg-gray-100"
                                >
                                    <Text>{option.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </Animated.View>
            }

        </View>
    )
}