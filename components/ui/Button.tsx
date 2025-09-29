import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";


type ButtonVariant = 'none' | 'contained' | 'outlined';


const variantToClassMap = {
    'none': '',
    'contained': 'bg-blue-400 rounded-lg',
    'outlined': 'ring-blue-400 rounded-lg'
}

export const Button = ({ title, onPress, className, disabled, isLoading, variant = "none" }: {
    title: string,
    onPress: () => void,
    className?: string,
    disabled?: boolean,
    isLoading?: boolean,
    variant?: ButtonVariant
}) => {


    const variantClass = variantToClassMap[variant];



    //${disabled ? 'bg-neutral-200' : 'bg-blue-400'} 
    return (
        <Pressable
            onPress={onPress}
            className={`p-4 ${variantClass} active:opacity-75 ${className}`}
            disabled={disabled || isLoading}
        >
            {isLoading &&
                <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                    <ActivityIndicator size="large" />
                </Animated.View>
            }
            {!isLoading &&
                <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                    <Text className="text-sm font-bold text-center dark:text-white " >{title}</Text>
                </Animated.View>
            }
        </Pressable >
    )
}