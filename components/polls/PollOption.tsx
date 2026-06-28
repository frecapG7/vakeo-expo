import { TripUser } from "@/types/models"
import { ActivityIndicator, Text, View } from "react-native"
import { AvatarsGroup } from "../ui/Avatar"
import { IconSymbol } from "../ui/IconSymbol"

const getColorForPercent = (percent: number) => {
    // Enhanced orange gradient: light → vibrant
    const startColor = { r: 255, g: 200, b: 150 }; // #ffc896
    const endColor = { r: 245, g: 120, b: 50 };   // #f57832

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * (percent / 100));
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * (percent / 100));
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * (percent / 100));

    return `rgb(${r}, ${g}, ${b})`;
}

export const PollOption = ({
    label,
    selectedBy,
    percent,
    isAnonymous,
    includeUser,
    isLoading
}: {
    label?: string,
    selectedBy?: TripUser[],
    percent: string | number,
    isAnonymous?: boolean,
    includeUser?: boolean,
    isLoading?: boolean
}) => {
    const voteCount = selectedBy?.length || 0;
    const normalizedPercent = typeof percent === 'string' ? parseFloat(percent) : percent;

    return (
        <View className="flex-1 rounded-xl py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Progress bar - enhanced */}
            <View
                className="absolute left-0 top-0 bottom-0 rounded-xl"
                style={{
                    width: `${normalizedPercent}%`,
                    backgroundColor: getColorForPercent(normalizedPercent),
                    opacity: 0.2,
                }}
            />

            <View className="relative flex-1 flex-row justify-between items-center px-3">
                <View className="flex-row items-center gap-3 flex-1">
                    {/* Checkmark circle - improved with loading state */}
                    <View className={`rounded-full w-10 h-10 items-center justify-center border-2 ${
                        includeUser
                            ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30'
                            : 'border-gray-300 bg-gray-50 dark:bg-gray-700/30'
                    }`}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#3b82f6" />
                        ) : includeUser ? (
                            <IconSymbol
                                name="checkmark.circle.fill"
                                color="blue"
                                size={22}
                            />
                        ) : null}
                    </View>

                    {/* Label - improved typography */}
                    <Text
                        className="text-md capitalize flex-1 dark:text-white"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {label}
                    </Text>
                </View>

                {/* Right side - vote info */}
                <View className="flex-row items-center gap-2">
                    {/* Avatars - only show if not anonymous and has voters */}
                    {!isAnonymous && voteCount > 0 && (
                        <AvatarsGroup
                            avatars={selectedBy?.map(u => ({
                                avatar: u.avatar,
                                alt: u?.name.charAt(0)
                            }))}
                            size2="xs"
                            maxLength={3}
                        />
                    )}

                    {/* Percentage - enhanced display */}
                    <View className={`px-3 py-1 rounded-lg ${
                        normalizedPercent > 50 ? 'bg-green-100 dark:bg-green-900/30' :
                        normalizedPercent > 25 ? 'bg-amber-100 dark:bg-amber-900/30' :
                        'bg-red-100 dark:bg-red-900/30'
                    }`}>
                        <Text className={`font-bold text-sm ${
                            normalizedPercent > 50 ? 'text-green-700 dark:text-green-300' :
                            normalizedPercent > 25 ? 'text-amber-700 dark:text-amber-300' :
                            'text-red-700 dark:text-red-300'
                        }`}>
                            {Math.round(normalizedPercent)}%
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}