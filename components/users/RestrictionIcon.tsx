import { Text, View } from "react-native";

type ImageSize = 'xs' | 'sm' | 'sm2' | 'md' | 'lg' | 'xl';

const sizeToClassMap = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    sm2: 'w-14 h-14',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
};

const valueToEmoji: Record<string, string> = {
    "hasHalal": "🌙",
    "hasKasher": "✡️",
    "hasNoPork": "🐷",
    "hasVegan": "🌱",
    "hasNoAlcohol": "🍷",
};

export const RestrictionIcon = ({ value, size = "md" }: { value: string, size: ImageSize }) => {
    const sizeClass = sizeToClassMap[size];
    const emoji = valueToEmoji[value] || "❓";

    return (
        <View className={`rounded-full items-center justify-center ${sizeClass}`}>
            <Text className="text-xl">{emoji}</Text>
        </View>
    );
};