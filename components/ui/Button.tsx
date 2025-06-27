import { ActivityIndicator, Pressable, Text } from "react-native";


export const Button = ({ title, onPress, className, disabled, isLoading }: {
    title: string,
    onPress: () => void,
    className?: string,
    disabled?: boolean,
    isLoading?: boolean
}) => {
    return (
        <Pressable
            onPress={onPress}
            className={`rounded-lg p-2 ring-secondary ${disabled ? 'bg-neutral-200' : ''} ${className}`}
            disabled={disabled || isLoading}
        >
            {isLoading && <ActivityIndicator size="large" />}
            {!isLoading && <Text className="text-sm font-bold text-center text-secondary " >{title}</Text>}
        </Pressable >
    )
}