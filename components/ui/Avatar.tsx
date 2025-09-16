import { Image } from "expo-image";
import { Text, View } from "react-native";

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

type ImageSize = 'sm' | 'md' | 'lg' | 'xl';


const sizeToClassMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
};


export const Avatar = ({ name, size = 24, size2 = "sm", color, alt, src , ...props}: {
    name?: string,
    size?: number,
    size2?: ImageSize
    color?: string,
    alt?: string,
    src?: string,
}) => {


    const sizeClass = sizeToClassMap[size2];


    if (!src)
        return (
            <View className={`justify-center items-center rounded-full border-2 ${sizeClass}`}>
                <Text className="font-bold uppercase ">{alt}</Text>
            </View>
        )


    return (
        <View className={`justify-center items-center rounded-full border-2 ${sizeClass}`} {...props}>
            <Image source={src}
                style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
            />
        </View>
    )


}