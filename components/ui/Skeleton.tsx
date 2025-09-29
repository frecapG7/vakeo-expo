import { useEffect } from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";




export const Skeleton = ({ width = '100%', height = 20 }: {
    width: number | string,
    height: number | string
}) => {

    const shimmerPosition = useSharedValue(-1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmerPosition?.value * 200 }],
    }));

    useEffect(() => {
        shimmerPosition.value = withRepeat(
            withTiming(1, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
            false,
        );
    }, []);
    return (
        <View className={`rounded-lg bg-gray-200 w-full h-${height}`} >
            <Animated.View style={[
                {
                    width: '100%',
                    height: '100%',
                },
                animatedStyle,
            ]} />
        </View>
    )
}