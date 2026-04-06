import { Pressable, Text } from "react-native";



type ChipSize = 'medium' | 'small';
const sizeToMap = {
    'medium': "p-2 text-md",
    'small' : 'p-1 text-sm'
}


export const Chip = ({ text, variant = "outlined", size = "medium", onPress }: { text: string, variant?: string, size?: ChipSize, onPress?: () => void }) => {


    const sizeClass = sizeToMap[size];


    return (
        <Pressable className={`rounded-full border dark:border-white mx-1 ${variant === "contained" && "bg-blue-100"}`}
            onPress={onPress} >
            <Text className={`${variant === "contained" ? "font-bold" :  "dark:text-white"} ${sizeClass}`}>{text}</Text>
        </Pressable >
    )
}