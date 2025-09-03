import { Animated, View } from "react-native";
import { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";



export const Skeleton = ({ width, height }: { width: number, height: number }) => {


    const opacity = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        width: width,
        height: height,
    }))

    opacity.value = withRepeat(
        withTiming(0.5, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
        }),
        -1, // Repeat indefinitely
        true // Reverse the animation on each repeat
    )
    return (
        <View className="bg-gray-200 dark:bg-gray-700 rounded-lg w-full" style={{
            width,
            height,
        }} >
            <Animated.View style={animatedStyle} />
        </View>
    )
}