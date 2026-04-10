import useColors from "@/hooks/styles/useColors";
import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";


type ButtonVariant = 'none' | 'contained' | 'outlined';

type ButtonSize = 'medium' | 'small';

const variantToClassMap = {
    'none': '',
    'contained': 'bg-blue-400 dark:bg-blue-600 rounded-full',
    'outlined': 'border border-blue-400 rounded-full'
}

const sizeToMap = {
    'medium': "p-4 text-md",
    'small': 'p-2 text-sm'
}


const ButtonTitle = ({ title, variant, size, isLoading }: { title: string, variant: ButtonVariant, size: ButtonSize, isLoading: boolean }) => {

    const colors = useColors();
    const sizeClass = sizeToMap[size];

    if (isLoading)
        return (
            <Animated.View entering={FadeIn} exiting={FadeOut} className="w-full">
                <ActivityIndicator size="large" color={colors.text} className={sizeClass} />
            </Animated.View>
        );

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="w-full">
            <Text className={`${sizeClass}  text-center ${variant === "contained" ? "text-white font-bold" : "text-blue-400"} `}
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
            {title && <ButtonTitle
                title={title}
                size={size}
                variant={variant}
                isLoading={isLoading} />}
            {children}
        </Pressable >
    )
}