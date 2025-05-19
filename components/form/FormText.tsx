import { useEffect } from "react";
import { useController } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export const FormText = ({ control, name, label, placeholder, rules, endAdornment, className }: {
    control: any,
    name: string,
    label?: string,
    placeholder?: string,
    rules?: object,
    endAdornment?: React.ReactNode,
    className?: string,
}) => {

    const { field: { value, onChange, ref },
        fieldState: { error } } = useController({
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
        <View className={`flex flex-col ${className}`}>
            <Text className="text-sm font-bold mx-2 ">{label}</Text>
            <Animated.View style={animatedStyle} className="relative">
                <TextInput
                    onChangeText={onChange}
                    value={value}
                    className={`bg-gray-200 rounded-lg p-2 ${error ? "border border-red-600" : ""}`}
                    ref={ref}
                    placeholder={placeholder}

                />
                {endAdornment && <View className="absolute right-0 top-0 bottom-0 flex items-center justify-center b">
                    {endAdornment}
                </View>}
            </Animated.View>
        </View>
    )
}
