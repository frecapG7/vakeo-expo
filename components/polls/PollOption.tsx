import { TripUser } from "@/types/models"
import { Text, View } from "react-native"
import { AvatarsGroup } from "../ui/Avatar"
import { IconSymbol } from "../ui/IconSymbol"


const getColorForPercent = (percent: number) => {
    // Couleurs de départ et d'arrivée (orange clair → orange foncé)
    const startColor = { r: 254, g: 215, b: 170 }; // #FED7AA
    const endColor = { r: 234, g: 88, b: 12 };    // #EA580C

    // Interpolation linéaire pour chaque composante RGB
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * (percent / 100));
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * (percent / 100));
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * (percent / 100));

    return `rgb(${r}, ${g}, ${b})`;
}

export const PollOption = ({ label, selectedBy, percent, isAnonymous, includeUser }: { label?: string, selectedBy?: TripUser[], percent: stringnumber, isAnonymous?: boolean, includeUser?: boolean }) => {



    return (

        <View className="flex-1 rounded-full py-2 bg-orange-50 dark:bg-gray-50 border border-orange-200 dark:border-gray-200">
            <View
                className="absolute left-0 top-0 bottom-0 rounded-full"
                style={{
                    width: `${percent}%`,
                    backgroundColor: getColorForPercent(percent)
                }}
            />
            <View className="flex-1 flex-row justify-between items-center px-2 ">
                <View className="flex-row items-center gap-2">
                    <View className={`rounded-full w-10 h-10 border-2 items-center justify-center border-white ${includeUser ? "bg-orange-600" : "bg-orange-100"}`} >
                        {includeUser && <IconSymbol name="checkmark" size={24} />}
                    </View>
                    <Text className="text-md capitalize max-w-40" numberOfLines={3}>{label}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    {!isAnonymous &&

                        <AvatarsGroup avatars={selectedBy?.map(u => ({
                            avatar: u.avatar,
                            alt: u?.name.charAt(0)
                        }))}
                            size2="sm"
                            maxLength={3}
                        />
                    }
                    <Text className="font-bold text-lg">
                       {Number(percent).toFixed()} %
                    </Text>

                </View>

            </View>
        </View>
    );
}