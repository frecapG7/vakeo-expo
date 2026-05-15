import { Pressable, Text } from "react-native";
import { IconSymbol } from "./IconSymbol";



type ChipSize = 'medium' | 'small' | 'xsmall';
const sizeToMap = {
    'medium': "p-2 text-md",
    'small': 'p-1 text-sm',
    "xsmall": "p-1 text-xs"
}


export const Chip = ({ text, variant = "outlined", size = "medium", icon , onPress }: { text: string, variant?: string, size?: ChipSize, icon ?: string, onPress?: () => void }) => {


    const sizeClass = sizeToMap[size];


    return (
        <Pressable className={`rounded-full border dark:border-white mx-1 ${variant === "contained" && "bg-blue-100"}`}
            onPress={onPress} >
            {icon && <IconSymbol name={icon} size={10}/>}
            <Text className={`${variant === "contained" ? "font-bold" : "dark:text-white"} ${sizeClass}`}>
                {text}
            </Text>
        </Pressable >
    )
}