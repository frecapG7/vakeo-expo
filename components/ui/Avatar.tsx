import { Image } from "expo-image";
import { Text, View } from "react-native";

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

type ImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';


const sizeToClassMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
};


const sizeToMarginMap = {
    xs: "-mr-2",
    sm: "-mr-3",
    md: "-mr-6",
    lg: "-mr-7",
    xl: "-mr-10"
}


export const Avatar = ({ name, size = 24, size2 = "sm", color, alt, src, ...props }: {
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
            <View className={`justify-center items-center rounded-full ${sizeClass} border dark:border-white bg-orange-200 dark:bg-gray-400`}>
                <Text className="font-bold uppercase ">{alt}</Text>
            </View>
        )


    return (
        <View className={`justify-center items-center rounded-full ${sizeClass}`} {...props}>
            <Image source={src}
                style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    borderRadius: 100
                }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
            />
        </View>
    )
}


export const AvatarsGroup = ({ avatars = [], size2 = "sm", maxLength = 3 }: { avatars: any, size2: ImageSize, maxLength: number }) => {

    const marginClass = sizeToMarginMap[size2];

    return (
        <View className="flex-row items-center justify-center">
            {avatars?.slice(0, maxLength).map((avatar, index) =>
                <View key={index} className={`flex ${marginClass}`}>
                    <Avatar
                        size2={size2}
                        src={avatar.avatar}
                        alt={avatar.alt}
                    />
                </View>
            )}
            {avatars?.length > maxLength &&

                <View className={`flex ${marginClass}`}>
                    <Avatar size2={size2}
                        alt={`+${avatars?.length - maxLength}`} />
                </View>
            }
        </View>
    )


}