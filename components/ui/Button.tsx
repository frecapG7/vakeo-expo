import useColors from "@/hooks/styles/useColors";
import { Pressable, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { IconSymbol, IconSymbolName } from "./IconSymbol";
import { Spinner } from "./Spinner";


type ButtonVariant = 'none' | 'contained' | 'outlined' | 'danger';

type ButtonSize = 'medium' | 'small';

const variantToClassMap = {
    'none': 'flex-row justify-center items-center',
    'contained': 'bg-amber rounded-xl shadow-sm shadow-amber/40 flex-row justify-center items-center',
    'outlined': 'border-2 border-night dark:border-white/25 rounded-xl bg-mist dark:bg-transparent flex-row justify-center items-center active:bg-amber/20 dark:active:bg-white/10',
    'danger': 'border-2 border-danger rounded-xl bg-danger/10 dark:bg-danger/20 flex-row justify-center items-center active:bg-danger/20 dark:active:bg-danger/25'
}

const sizeToMap = {
    'medium': "px-6 py-3 text-base",  // More horizontal padding
    'small': 'px-4 py-2 text-sm'
}

const variantToTitleClassMap = {
    'none': 'text-night dark:text-white',
    'contained': 'text-night font-bold',
    'outlined': 'text-night dark:text-white font-semibold',
    'danger': 'text-danger font-semibold'
}

const ButtonTitle = ({ title, variant, size, isLoading }: { title?: string, variant: ButtonVariant, size: ButtonSize, isLoading: boolean }) => {

    const colors = useColors();
    const sizeClass = sizeToMap[size];
    const variantTitleClass = variantToTitleClassMap[variant];

    if (isLoading)
        return (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
                <Spinner size={size === "medium" ? "medium" : "small"} color={colors.text} />
            </Animated.View>
        );

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text className={`${sizeClass} ${variantTitleClass}`} numberOfLines={1}>
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
    style,
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
    children?: React.ReactNode,
    style?: React.ComponentProps<typeof Pressable>["style"],
}) => {

    const variantClass = variantToClassMap[variant];

    const disableClass = (disabled || isLoading) ? "opacity-40" : ""

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            className={`${variantClass} active:opacity-75 ${className} ${disableClass}`}
            disabled={disabled || isLoading}
            style={style}
            {...props}
        >
            {icon && (
                <Animated.View entering={FadeIn} exiting={FadeOut} className="">
                    <IconSymbol name={icon}
                        color={variant === "contained" ? "#16265C" : "#EE8B33"}
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
