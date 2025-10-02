import useColors from "@/hooks/styles/useColors";
import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";


type ButtonVariant = 'none' | 'contained' | 'outlined';


const variantToClassMap = {
    'none': '',
    'contained': 'bg-blue-400 rounded-lg',
    'outlined': 'ring-blue-400 rounded-lg'
}


const ButtonTitle = ({ title, isLoading }: { title: string, isLoading: boolean }) => {

    const colors = useColors();
    if (isLoading)
        return (
            <Animated.View entering={ZoomIn} exiting={ZoomOut} className="p-4 w-full">
                <ActivityIndicator size="large" color={colors.text} />
            </Animated.View>
        );

    return (
        <Animated.View entering={ZoomIn} exiting={ZoomOut} className="p-4 w-full">
            <Text className="text-sm font-bold text-center dark:text-white" >{title}</Text>
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
    children?: React.ReactNode
}) => {


    const variantClass = variantToClassMap[variant];

    const disableClass = (disabled || isLoading) ? "opacity-75" : ""



    //${disabled ? 'bg-neutral-200' : 'bg-blue-400'} 
    return (
        <Pressable
            onPress={onPress}
            className={`${variantClass} active:opacity-75 ${className} ${disableClass}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {title && <ButtonTitle title={title} isLoading={isLoading} />}
            {children}
        </Pressable >
    )
}