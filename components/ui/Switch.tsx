import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol";




export const Switch = ({ value = false, onSwitch, disabled = false }: { value: boolean, onSwitch: (value: boolean) => void, disabled?: boolean }) => {

    const offset = useSharedValue(0);

    useEffect(() => {
        offset.value = withTiming(
            value ? 40 : 0,
            {
                duration: 200,
                easing: Easing.out(Easing.ease)
            }
        )
    }, [value]);


    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }]
        }
    });


    return (
        <Pressable onPress={() => onSwitch(!value)}
            className={`flex-row items-center justify-between  rounded-full w-20 ${value ? 'bg-blue-400 dark:bg-blue-500' : 'bg-blue-200 dark:bg-gray-700'}`}
            disabled={disabled}>
            <Animated.View className={`items-center rounded-full border bg-white dark:bg-blue-200 shadow-md transform border-4 ${value ? "border-blue-400" : "border-blue-200" } `} style={animatedStyle}>
                <IconSymbol name={value ? "checkmark" : "xmark.circle"} color={value ? "blue" : "gray"}/>
            </Animated.View>
        </Pressable>
    )
}