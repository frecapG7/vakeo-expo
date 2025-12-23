import { useEffect } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

type SkeletonVariant = "rectangular" | "circular";

export const Skeleton = ({ variant = "rectangular", height = 10 }: { variant?: SkeletonVariant, height?: number }) => {

    const opacity = useSharedValue(0.75);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        }
    });

    useEffect(() => {
        opacity.value = withRepeat(withTiming(0.3, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease)
        }),
            -1, // Infinite loop,
            true
        )
    }, []);



    if(variant === "circular")
        return <Animated.View className={`flex bg-gray-400 dark:bg-gray-700 rounded-full w-${height} h-${height}`} style={animatedStyle} />


    return (
        <Animated.View className={`flex bg-gray-400 dark:bg-gray-700 rounded-lg w-full h-${height}`} style={animatedStyle} />
    )
}