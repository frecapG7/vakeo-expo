import { TripUser } from "@/types/models"
import { ActivityIndicator, Text, View } from "react-native"
import { AvatarsGroup } from "../ui/Avatar"
import { IconSymbol } from "../ui/IconSymbol"

const getColorForPercent = (percent: number) => {
    // Dégradé palette All In : ambre (#F7B74A) → ambre orangé (#EE8B33)
    const startColor = { r: 247, g: 183, b: 74 };
    const endColor = { r: 238, g: 139, b: 51 };

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
        <View className="flex-1 rounded-xl py-3 bg-white dark:bg-night border border-mist dark:border-white/10 overflow-hidden">
            {/* Progress bar */}
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
                    {/* Checkmark circle */}
                    <View className={`rounded-full w-10 h-10 items-center justify-center border-2 ${
                        includeUser
                            ? 'border-amber-deep bg-amber/15 dark:bg-amber/20'
                            : 'border-mist dark:border-white/10 bg-mist dark:bg-white/5'
                    }`}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#EE8B33" />
                        ) : includeUser ? (
                            <IconSymbol
                                name="checkmark.circle.fill"
                                color="#EE8B33"
                                size={22}
                            />
                        ) : null}
                    </View>

                    {/* Label */}
                    <Text
                        className="text-sm capitalize flex-1 text-night dark:text-white"
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

                    {/* Percentage */}
                    <View className="px-3 py-1 rounded-lg bg-amber/15 dark:bg-amber/20">
                        <Text className="font-bold text-sm text-amber-deep dark:text-amber">
                            {Math.round(normalizedPercent)}%
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
