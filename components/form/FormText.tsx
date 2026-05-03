import useColors from "@/hooks/styles/useColors";
import { useEffect, useRef } from "react";
import { useController } from "react-hook-form";
import { TextInput, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export const FormText = ({ control, name, placeholder, rules, endAdornment, autoFocus }: {
    control: any,
    name: string,
    placeholder?: string,
    rules?: object,
    endAdornment?: React.ReactNode,
    autoFocus?: boolean
}) => {

    const { field: { value, onChange },
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

    const { inputPlaceHolder } = useColors();

    const textInputRef = useRef<TextInput>(null);
    useEffect(() => {
        if (error)
            textInputRef.current?.focus();
    }, [error]);


    return (
        <Animated.View style={animatedStyle}
            className="flex-row items-center bg-gray-100 dark:bg-gray-600  border focus:border focus:border-blue-500 rounded-xl h-12">
            <TextInput
                onChangeText={onChange}
                value={value}
                className="flex-1 text-dark dark:text-white h-full items-start normal-case"
                placeholderTextColor={inputPlaceHolder}
                ref={textInputRef}
                placeholder={placeholder}
                style={{
                    textAlignVertical: "top",
                }}
                autoFocus={autoFocus}

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
