import { Pressable, Text } from "react-native"



export const Chip = ({ text, variant = "outlined", onPress }: { text: string, variant?: string, onPress?: () => void }) => {

    return (
        <Pressable className={`rounded-full p-1 border dark:border-white mx-1 ${variant === "contained" && "bg-blue-100"}`}
            onPress={onPress} >
            <Text className={`${variant === "contained" ? "font-bold" :  "dark:text-white"} `}>{text}</Text>
        </Pressable >
    )
}