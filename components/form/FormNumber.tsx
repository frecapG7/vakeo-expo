import { useEffect } from "react";
import { useController } from "react-hook-form";
import { Easing, Text, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";


export const FormNumber = ({
    control,
    name,
    label,
    placeholder,
    rules,
}: {
    control: any,
    name: string,
    label?: string,
    placeholder?: string,
    rules?: object,
}) => {


    const { field: { value, onChange, ref }, fieldState: { error } } = useController({
        name,
        control,
        rules
    });

    const shakeAnimation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: shakeAnimation.value
                }
            ]
        }
    });

    useEffect(() => {
        if (error) {
            shakeAnimation.value = withRepeat(withTiming(10, {
                duration: 100,
                easing: Easing.linear,
            }), 4, true);
        }
    }, [error, shakeAnimation]);


    return (
        <View >
            <Text className="text-sm font-bold mx-2 text-secondary">{label}</Text>
            <Animated.View style={animatedStyle} className="flex relative">
                <TextInput
                    onChangeText={(v) => {
                        if (!isNaN(Number(v))) {
                            onChange(Number(v));
                        }
                        else {
                            onChange(""); // Clear the value if it's not a number
                        }
                    }}
                    value={value?.toString() || ""}
                    className={`bg-gray-200 rounded-lg p-2 ${error ? "border border-red-600" : ""}`}
                    ref={ref}
                    placeholder={placeholder}
                    keyboardType="numeric"

                />
            </Animated.View>


        </View >
    )
}