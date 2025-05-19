import { ActivityIndicator, Text, TouchableOpacity } from "react-native";


export const Button = ({ title, onPress, className, disabled, isLoading }: {
    title: string,
    onPress: () => void,
    className?: string,
    disabled?: boolean,
    isLoading?: boolean
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`border rounded-lg p-2 ${disabled ? 'bg-neutral-200' : ''} ${className}`}
            disabled={disabled || isLoading}
        >
            {isLoading && <ActivityIndicator size="large" />}
            {!isLoading && <Text className="text-sm font-bold text-center">{title}</Text>}
        </TouchableOpacity >
    )
}