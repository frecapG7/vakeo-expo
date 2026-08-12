import { useEffect } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol";

type SpinnerSize = 'small' | 'medium' | 'large' | number;

interface SpinnerProps {
    size?: SpinnerSize;
    color?: string;
}

const sizeToIconSize = (size: SpinnerSize): number => {
    if (typeof size === 'number') return size;
    const sizes: Record<string, number> = {
        small: 16,
        medium: 24,
        large: 32,
    };
    return sizes[size] ?? 24;
};

export const Spinner = ({ size = 'medium', color }: SpinnerProps) => {
    const spin = useSharedValue(0);

    useEffect(() => {
        spin.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const spinStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${spin.value}deg` }],
    }));

    return (
        <Animated.View style={spinStyle}>
            <IconSymbol
                name="arrow.clockwise"
                size={sizeToIconSize(size)}
                color={color}
            />
        </Animated.View>
    );
};
