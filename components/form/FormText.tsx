import { useEffect } from "react";
import { useController } from "react-hook-form";
import { TextInput, View } from "react-native";
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
                    translateX: shakeAnimation?.value
                }
            ]
        }
    });

    useEffect(() => {
        if (error) {
            shakeAnimation.value = withRepeat(withTiming(20, {
                duration: 100,
                easing: Easing.linear,
            }), 4, true);
        }
    }, [error, shakeAnimation]);

    return (
        <Animated.View style={animatedStyle}
            className="flex-row items-center bg-stone-50 dark:bg-gray-400 border border-gray-400 dark:border-gray-200 focus:border-blue-500 rounded-xl h-15">
            <TextInput
                onChangeText={onChange}
                value={value}
                className="text-md flex-1 text-dark h-full items-start"
                placeholderTextColor="#575656"
                ref={ref}
                placeholder={placeholder}
                style={{
                    textAlignVertical: "top",
                }}
            />
            {endAdornment &&
                <View
                    className="flex"
                >
                    {endAdornment}
                </View>
            }
        </Animated.View>
    )
}
