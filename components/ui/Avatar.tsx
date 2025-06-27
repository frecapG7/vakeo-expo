import { Image } from "expo-image";
import { Text, View } from "react-native";

export const Avatar = ({ name, size = 24, color, alt, src }: {
    name?: string,
    size?: number,
    color?: string,
    alt?: string,
    src?: string
}) => {
    return (
        <View className="justify-center items-center bg-primary-200 p-2 ring-2"
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
            }}>
            {src ?
                <Image source={`@assets/avatars/${src}`} className="flex flex-grow" />
                :
                <Text className="font-bold text-secondary text-ellipsis">{alt}</Text>
            }
        </View >

    )
}