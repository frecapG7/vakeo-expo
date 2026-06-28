import useColors from "@/hooks/styles/useColors";
import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { IconSymbol, IconSymbolName } from "./IconSymbol";


type ButtonVariant = 'none' | 'contained' | 'outlined';

type ButtonSize = 'medium' | 'small';

const variantToClassMap = {
    'none': 'flex-row justify-center items-center',
    'contained': 'bg-blue-400 dark:bg-blue-600 rounded-xl shadow-sm shadow-blue-400 flex-row justify-center items-center',
    'outlined': 'border-2 border-blue-500 dark:border-blue-400 rounded-xl bg-transparent dark:bg-transparent flex-row justify-center items-center active:bg-blue-50 dark:active:bg-blue-900/20'
}

const sizeToMap = {
    'medium': "px-6 py-3 text-md",  // More horizontal padding
    'small': 'px-4 py-2 text-sm'
}

const ButtonTitle = ({ title, variant, size, isLoading }: { title: string, variant: ButtonVariant, size: ButtonSize, isLoading: boolean }) => {

    const colors = useColors();
    const sizeClass = sizeToMap[size];

    if (isLoading)
        return (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
                <ActivityIndicator size={size === "medium" ? "large" : "small"}
                    color={colors.text} />
            </Animated.View>
        );

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text className={`${sizeClass} ${variant === "contained" ? "text-white font-bold" : "text-blue-400"}`}
                numberOfLines={1}>
                {title}
            </Text>
        </Animated.View>
    );

}

export const Button = ({ title,
    onPress,
    onLongPress,
    className,
    disabled,
    isLoading = false,
    variant = "none",
    size = "medium",
    icon,
    children,
    ...props
}: {
    title?: string,
    onPress: () => void,
    onLongPress?: () => void,
    className?: string,
    disabled?: boolean,
    isLoading?: boolean,
    variant?: ButtonVariant,
    size?: ButtonSize,
    icon?: IconSymbolName,
    children?: React.ReactNode
}) => {

    const variantClass = variantToClassMap[variant];

    const disableClass = (disabled || isLoading) ? "opacity-50 bg-gray-600" : ""

    //${disabled ? 'bg-neutral-200' : 'bg-blue-400'} 
    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            className={`${variantClass} active:opacity-75 ${className} ${disableClass}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {icon && (
                <Animated.View entering={FadeIn} exiting={FadeOut} className="">
                    <IconSymbol name={icon}
                        color={variant === "contained" ? "white" : "blue"}
                        size={size === "medium" ? 22 : 18} />
                </Animated.View>
            )}
            {(title || isLoading) && (
                <ButtonTitle
                    title={title}
                    size={size}
                    variant={variant}
                    isLoading={isLoading} />
            )}
            {children}
        </Pressable >
    )
}