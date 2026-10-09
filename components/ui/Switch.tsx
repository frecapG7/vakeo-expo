import { useEffect } from "react";
import { Pressable, useColorScheme } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol";




export const Switch = ({ value = false, onSwitch, disabled = false }: { value: boolean, onSwitch: (value: boolean) => void, disabled?: boolean }) => {

    const isDark = useColorScheme() === "dark";
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
    })


    return (
        <Pressable onPress={() => onSwitch(!value)}
            className={`flex-row items-center justify-between  rounded-full w-20 ${value ? 'bg-amber-deep' : 'bg-mist dark:bg-white/10'}`}
            disabled={disabled}>
            <Animated.View className={`items-center rounded-full border bg-white dark:bg-white/20 shadow-md transform border-4 ${value ? "border-amber" : "border-mist dark:border-white/10"}`} style={animatedStyle}>
                <IconSymbol name={value ? "checkmark" : "xmark.circle"} color={value ? "#EE8B33" : (isDark ? "#F6F8FD" : "#16265C")} />
            </Animated.View>
        </Pressable>
    )
}
