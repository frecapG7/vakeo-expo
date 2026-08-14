import { Switch } from "@/components/ui/Switch";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { useController } from "react-hook-form";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export const FormSwitch = ({
    control,
    name,
    rules,
    disabled,
}: {
    control: any,
    name: string,
    rules?: object,
    disabled?: boolean
}) => {

    const { field: { value, onChange }, fieldState: { error }, formState: {isSubmitting} } = useController({
        name,
        control,
        rules
    });

    const shakeAnimation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: shakeAnimation.value
                }
            ]
        }
    });

    useEffect(() => {
        if (error) {
            shakeAnimation.value = withRepeat(withTiming(10, {
                duration: 100,
                easing: Easing.linear,
            }), 4, true);
        }
    }, [error, shakeAnimation]);

    const handleSwitch = (newValue: boolean) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onChange(newValue);
    };



    return (
        <Animated.View style={animatedStyle}>
            <Switch
                value={value || false}
                onSwitch={handleSwitch}
                disabled={disabled || isSubmitting}
            />
        </Animated.View>
    )
}
