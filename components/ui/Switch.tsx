import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol";




export const Switch = ({ value = false, onSwitch }: { value: boolean, onSwitch: (value: boolean) => void }) => {

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
            transform: [{translateX: offset.value}]
        }
    });


    return (
        <Pressable onPress={() => onSwitch(!value)}
            className={`flex-row items-center justify-between p-1 rounded-full w-20 ${value ? 'bg-green-600 dark:bg-gray-200' : 'bg-gray-500 dark:bg-gray-700'}`}>
            <Animated.View className={`items-center rounded-full dark:bg-blue-200 shadow-md transform `} style={animatedStyle}>
                <IconSymbol name={value ? "checkmark" : "xmark.circle"} />
            </Animated.View>
        </Pressable>
    )
}