import { Pressable, Text } from "react-native";
import { IconSymbol, IconSymbolName } from "./IconSymbol";



type ChipSize = 'medium' | 'small' | 'xsmall';
const sizeToMap = {
    'medium': "p-2 text-base",
    'small': 'p-1 text-sm',
    "xsmall": "p-1 text-xs"
}


export const Chip = ({ text, variant = "outlined", size = "medium", icon , onPress }: { text: string, variant?: string, size?: ChipSize, icon?: IconSymbolName, onPress?: () => void }) => {


    const sizeClass = sizeToMap[size];

    return (
        <Pressable className={`rounded-full border border-night/20 dark:border-white/25 mx-1 ${variant === "contained" && "bg-amber/20"}`}
            onPress={onPress} >
            {icon && <IconSymbol name={icon} size={10}/>}
            <Text className={`${variant === "contained" ? "font-bold text-night dark:text-white" : "text-night dark:text-white"} ${sizeClass}`}>
                {text}
            </Text>
        </Pressable >
    )
}
