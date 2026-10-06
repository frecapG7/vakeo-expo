import useColors from "@/hooks/styles/useColors";
import { useEffect } from "react";
import { useController } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";



export const FormTextArea = ({ control, name, label, placeholder, rules }: {
    control: any,
    name: string,
    label?: string,
    placeholder?: string,
    rules?: any,
    endAdornment?: React.ReactNode,
}) => {

    const { field: { value, onChange, ref }, fieldState: { error } } = useController({
        name,
        control,
        rules,
        defaultValue: ""
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
            // Faux positif React Compiler : mutation volontaire d'un shared value Reanimated.
            // eslint-disable-next-line react-hooks/immutability
            shakeAnimation.value = withRepeat(withTiming(20, {
                duration: 100,
                easing: Easing.linear,
            }), 4, true);
        }
    }, [error, shakeAnimation]);

    const { inputPlaceHolder } = useColors();

    return (
        <View>

            <Animated.View style={animatedStyle}
                className="flex-row bg-white dark:bg-night border border-mist dark:border-white/10 focus:border-amber-deep rounded-2xl h-40">
                <TextInput
                    onChangeText={onChange}
                    value={value}
                    placeholderTextColor={inputPlaceHolder}
                    placeholder={placeholder}
                    ref={ref}
                    numberOfLines={7}
                    multiline={true}
                    className="flex-1 p-3 text-base text-night dark:text-white"
                    style={{
                        textAlignVertical: "top", // Alignement du texte en haut
                    }}
                />
            </Animated.View>
            {rules?.maxLength &&
                <View className="flex-row justify-end">
                    <Text className={`${value?.length < rules?.maxLength ? "text-night/40 dark:text-white/40" : "text-danger"}`}>
                        {rules?.maxLength - value?.length}
                    </Text>
                </View>
            }
        </View>
    )
}
