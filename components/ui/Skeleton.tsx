



// export const Skeleton = ({ width = '100%', height = 20 }: {
//     width: number | string,
//     height: number | string
// }) => {

import { useEffect } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

//     const shimmerPosition = useSharedValue(-1);

//     const animatedStyle = useAnimatedStyle(() => ({
//         transform: [{ translateX: shimmerPosition?.value * 200 }],
//     }));

//     useEffect(() => {
//         shimmerPosition.value = withRepeat(
//             withTiming(1, {
//                 duration: 1000,
//                 easing: Easing.linear,
//             }),
//             -1,
//             false,
//         );
//     }, []);
//     return (
//         <View className={`rounded-lg bg-gray-200 w-full h-${height}`} >
//             <Animated.View style={[
//                 {
//                     width: '100%',
//                     height: '100%',
//                 },
//                 animatedStyle,
//             ]} />
//         </View>
//     )
// }
type SkeletonVariant = "rectangular" | "circular";



export const Skeleton = ({ variant = "rectangular" }: { variant?: SkeletonVariant }) => {



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


    return (
        <Animated.View className="flex bg-gray-400 dark:bg-gray-700 h-10 rounded-lg w-full" style={animatedStyle}>
        </Animated.View>
    )
}