import useColors from "@/hooks/styles/useColors";
import { useEffect } from "react";
import { useController } from "react-hook-form";
import { TextInput } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";



export const FormTextArea = ({ control, name, label, placeholder, rules }: {
    control: any,
    name: string,
    label?: string,
    placeholder?: string,
    rules?: object,
    endAdornment?: React.ReactNode,
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

    const {inputPlaceHolder} = useColors();

    return (
        <Animated.View style={animatedStyle} 
        className="flex-row bg-stone-50 dark:bg-gray-400 border border-gray-400 dark:border-gray-200 focus:border-blue-500 rounded-xl h-40">
            <TextInput
                onChangeText={onChange}
                value={value}
                placeholderTextColor={inputPlaceHolder}
                placeholder={placeholder}
                ref={ref}
                numberOfLines={7}
                multiline={true}
                className="flex-1 p-3 text-md "
                style={{
                    textAlignVertical: "top", // Alignement du texte en haut
                }}
            />
        </Animated.View>
    )
}