import { Text, View } from "react-native";


export const Avatar = ({ name, size = 24, color }: {
    name: string,
    size?: number,
    color?: string
}) => {
    return (
        <View className="justify-center items-center bg-gray-200 p-2"
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: color,
            }}>
            <Text className="text-lg font-bold text-white">{name?.charAt(0).toUpperCase()}</Text>
        </View >

    )
}