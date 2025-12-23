import { useEffect } from "react";
import { useController } from "react-hook-form";
import { TextInput } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";



export const FormTextArea = ({ control, name, rules }: {
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

    return (
        <Animated.View style={animatedStyle} className="flex-1 flex-row bg-gray-200 focus:border focus:border-blue-500 rounded-lg h-40">
            <TextInput
                onChangeText={onChange}
                value={value}
                placeholderTextColor="#000000"
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