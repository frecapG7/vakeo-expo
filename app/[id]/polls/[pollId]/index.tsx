import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { HousingOptions } from "@/components/polls/HousingOptions";
import { PollOption } from "@/components/polls/PollOption";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { useTrip } from "@/context/TripContext";
import { useGetPoll, useUnvotePoll, useVotePoll } from "@/hooks/api/usePolls";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";

import { PollOption as Option } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, useColorScheme } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PollDetailsPage() {
    const { id, pollId } = useLocalSearchParams<{ id: string, pollId: string }>();

    const { me } = useTrip();
    const isDark = useColorScheme() === "dark";
    const { data: poll } = useGetPoll(id, pollId);
    const votePoll = useVotePoll(id, pollId);
    const unvotePoll = useUnvotePoll(id, pollId);
    const router = useRouter();

    const { formatDuration, formatRange } = useI18nTime();


    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [loadingOptionId, setLoadingOptionId] = useState<string | null>(null);

    const insets = useSafeAreaInsets();

    const handleClick = async (option: Option, includeMe: boolean) => {
        setLoadingOptionId(option._id);
        try {
            if (includeMe)
                await unvotePoll.mutateAsync({
                    option: option._id,
                })
            else
                await votePoll.mutateAsync({
                    options: [option._id],
                });
        } finally {
            setLoadingOptionId(null);
        }
    }

    if (!poll)
        return (
            <View style={styles.container} className="flex-1 bg-mist dark:bg-ink">
                <View className="flex-row gap-3 items-center p-4">
                    <Skeleton variant="circular" height={40} />
                    <View className="flex-1 gap-2">
                        <Skeleton height={8} width="60%" />
                        <Skeleton height={6} width="40%" />
                    </View>
                </View>
                <View className="gap-4 my-4 px-4">
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                </View>
            </View>
        );



    return (
        <Animated.ScrollView
            style={styles.container}
            className="flex-1 bg-mist dark:bg-ink"
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            showsVerticalScrollIndicator={false}
        >
            {/* Poll Card */}
            <View className="m-2 mb-4 rounded-2xl p-4 border border-mist dark:border-white/10 shadow-sm bg-white dark:bg-night"
            >
                {/* Meta block */}
                <View className="flex-row items-center gap-2 mb-4">
                    <Avatar
                        src={poll?.createdBy?.avatar}
                        alt={poll?.createdBy?.name?.charAt(0)}
                        size2="sm"
                    />
                    <View className="flex-1">
                        <Text className="text-sm font-medium text-night/70 dark:text-white/70"
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {poll?.createdBy?.name}
                        </Text>
                        <View className="flex-row items-center gap-1">
                            <IconSymbol name="clock" color={isDark ? "#F6F8FD" : "#16265C"} size={12} />
                            <Text className="text-xs text-night/50 dark:text-white/50">
                                {formatDuration(poll?.createdAt)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Question hero */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-night dark:text-white mb-2">
                        {poll?.question}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <View className="flex-row items-center">
                            <IconSymbol name="person.2" color="#EE8B33" size={16} />
                            <Text className="text-amber-deep dark:text-amber font-medium ml-1">
                                {poll?.hasSelected.length}
                            </Text>
                        </View>
                        <Text className="text-night/50 dark:text-white/50">
                            {poll?.hasSelected.length === 1 ? 'vote' : 'votes'}
                        </Text>
                    </View>
                </View>

                {/* Options Section */}
                {poll?.type === "HousingPoll" ? (
                    <View className="mb-4">
                        <HousingOptions
                            poll={poll}
                            user={me}
                            onVote={(option) => handleClick(option, false)}
                            onUnVote={(option) => handleClick(option, true)}
                            onSelected={(option) => setSelectedOption(option)}
                        />
                    </View>
                ) : (
                    <View className="gap-4 mb-4">
                        {poll?.options?.map((option) => {
                            const includeMe = option?.selectedBy?.map(u => u._id).includes(me?._id ?? "");
                            const isLoading = loadingOptionId === option._id;
                            return (
                                <Button
                                    key={option?._id}
                                    disabled={poll?.isClosed || votePoll?.isPending || unvotePoll?.isPending || isLoading}
                                    onPress={() => handleClick(option, includeMe)}
                                    onLongPress={() => setSelectedOption(option)}
                                    className={`rounded-xl border-2 ${includeMe
                                        ? 'border-amber-deep bg-amber/10 dark:bg-amber/15'
                                        : 'border-mist dark:border-white/10 bg-white dark:bg-night'
                                        }`}
                                >
                                    <PollOption
                                        // Narrowing par le champ : une option DatesPoll porte startDate, une OtherPoll non.
                                        label={"startDate" in option
                                            ? formatRange(dayjs(option.startDate), dayjs(option.endDate))
                                            : option.value}
                                        selectedBy={option.selectedBy}
                                        percent={option.percent}
                                        isAnonymous={poll.isAnonymous}
                                        includeUser={includeMe}
                                        isLoading={isLoading}
                                    />
                                </Button>
                            );
                        })}
                    </View>
                )}

                {/* Poll Settings Footer */}
                <View className="flex-row justify-between items-center pt-4 border-t border-mist dark:border-white/10">
                    <View className="flex-row items-center gap-2">
                        <IconSymbol
                            name={poll?.isSingleAnswer ? "checkmark.circle.fill" : "list.bullet"}
                            color={isDark ? "#F6F8FD" : "#16265C"}
                            size={18}
                        />
                        <Text className="text-sm text-night/60 dark:text-white/60">
                            {poll?.isSingleAnswer ? "Une option" : "Options multiples"}
                        </Text>
                    </View>

                    <View className="flex-row gap-1 items-center">
                        <IconSymbol
                            name={poll?.isAnonymous ? "eye.slash.fill" : "eye.fill"}
                            color={poll?.isAnonymous ? "#EE8B33" : (isDark ? "#F6F8FD" : "#16265C")}
                            size={18}
                        />
                        <Text className="text-sm text-night/60 dark:text-white/60">
                            Vote {poll?.isAnonymous ? "anonyme" : "public"}
                        </Text>
                    </View>
                </View>

                {/* Closed Poll Indicator */}
                {poll?.isClosed ? (
                    <View className="mt-4 p-3 bg-amber/15 dark:bg-amber/20 rounded-xl border border-amber-deep/30 dark:border-amber-deep/40">
                        <View className="flex-row items-center gap-2">
                            <IconSymbol name="lock.fill" color="#EE8B33" size={18} />
                            <Text className="text-amber-deep dark:text-amber font-medium">
                                Sondage terminé
                            </Text>
                        </View>
                    </View>)
                    :
                    <View className="mt-3">

                        <Button variant="contained"
                            size="small"
                            icon="plus"
                            title="Ajouter une option"
                            onPress={() => router.push({
                                pathname: "/[id]/polls/[pollId]/new-option",
                                params: { id, pollId }
                            })}
                        />
                    </View>
                }
            </View>

            <PickUsersModal
                open={!!selectedOption && !poll.isAnonymous}
                onClose={() => setSelectedOption(null)}
                users={selectedOption?.selectedBy || []}
                disabled
                title="Votants"
            />
        </Animated.ScrollView>
    );


}