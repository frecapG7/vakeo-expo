import { PickUsersModal } from "@/components/modals/PickUsersModal";
import { HousingOptions } from "@/components/polls/HousingOptions";
import { PollOption } from "@/components/polls/PollOption";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPoll, useUnvotePoll, useVotePoll } from "@/hooks/api/usePolls";
import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";

import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";




export default function PollDetailsPage() {
    const { id, pollId } = useLocalSearchParams();


    const { me } = useContext(TripContext);
    const { data: poll } = useGetPoll(id, pollId);

    const votePoll = useVotePoll(id, pollId, me?._id);
    const unvotePoll = useUnvotePoll(id, pollId, me?._id);

    const { formatDuration, formatRange } = useI18nTime();

    const { formatPercent } = useI18nNumbers();

    const [selectedOption, setSelectedOption] = useState(null);
    const [loadingOptionId, setLoadingOptionId] = useState<string | null>(null);

    const handleClick = async (option: any, includeMe: boolean) => {
        setLoadingOptionId(option._id);
        try {
            if (includeMe)
                await unvotePoll.mutateAsync({
                    option: option?._id,
                })
            else
                await votePoll.mutateAsync({
                    options: [option?._id],
                });
        } finally {
            setLoadingOptionId(null);
        }
    }

    const navigation = useNavigation();

    // Keep it case headerTitle is shown in stack
    // useFocusEffect(
    //     useCallback(() => {
    //         navigation.setOptions({
    //             title: poll?.question || 'Chargement...',
    //             headerBackTitle: 'Retour',
    //         });
    //     }, [navigation, poll?.question])
    // );



    if (!poll)
        return (
            <View style={styles.container}>
                <View className="flex-row gap-3 items-center p-4">
                    <Skeleton variant="circular" size="md" />
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
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            {/* Enhanced Header */}
            <View className="flex-row gap-3 items-center p-4">
                <Avatar
                    src={poll?.createdBy?.avatar}
                    alt={poll?.createdBy?.name?.charAt(0)}
                    size2="md"
                />
                <View className="flex-1">
                    <Text className="font-bold text-lg dark:text-white">
                        {poll?.createdBy?.name}
                    </Text>
                    <View className="flex-row items-center gap-1">
                        <IconSymbol name="clock" color="gray" size={14} />
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDuration(poll?.createdAt)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Poll Card */}
            <View className="m-2 mb-4 rounded-2xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-800"
            >
                {/* Question Section */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold dark:text-white mb-2">
                        {poll?.question}
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <View className="flex-row items-center">
                            <IconSymbol name="person.2" color="orange" size={16} />
                            <Text className="text-orange-600 dark:text-orange-400 font-medium ml-1">
                                {poll?.hasSelected.length}
                            </Text>
                        </View>
                        <Text className="text-gray-500 dark:text-gray-400">
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
                            const includeMe = option?.selectedBy?.map(u => u._id).includes(me?._id);
                            const isLoading = loadingOptionId === option._id;
                            return (
                                <Button
                                    key={option?._id}
                                    disabled={poll?.isClosed || votePoll?.isPending || isLoading}
                                    onPress={() => handleClick(option, includeMe)}
                                    onLongPress={() => setSelectedOption(option)}
                                    className={`rounded-xl border-2 ${includeMe
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-800/30'
                                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                                        }`}
                                >
                                    <PollOption
                                        label={poll?.type === "DatesPoll"
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
                <View className="flex-row justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                    <View className="flex-row items-center gap-2">
                        <View className="flex-row -space-x-1">
                            {poll?.isSingleAnswer ? (
                                <IconSymbol name="checkmark.circle.fill" color="gray" size={18} />
                            ) : (
                                <>
                                    <IconSymbol name="checkmark.circle.fill" color="gray" size={18} />
                                    <IconSymbol name="checkmark.circle.fill" color="gray" size={18} className="-ml-2" />
                                </>
                            )}
                        </View>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {poll?.isSingleAnswer ? "Une option" : "Options multiples"}
                        </Text>
                    </View>

                    <View className="flex-row gap-1 items-center">
                        <IconSymbol
                            name={poll?.isAnonymous ? "eye.slash.fill" : "eye.fill"}
                            color={poll?.isAnonymous ? "purple" : "green"}
                            size={18}
                        />
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            Vote {poll?.isAnonymous ? "anonyme" : "public"}
                        </Text>
                    </View>
                </View>

                {/* Closed Poll Indicator */}
                {poll?.isClosed && (
                    <View className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                        <View className="flex-row items-center gap-2">
                            <IconSymbol name="lock.fill" color="amber" size={18} />
                            <Text className="text-amber-700 dark:text-amber-300 font-medium">
                                Sondage terminé
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            <PickUsersModal
                open={!!selectedOption && !poll.isAnonymous}
                onClose={() => setSelectedOption(null)}
                users={selectedOption?.selectedBy}
                disabled
                title="Votants"
            />
        </Animated.ScrollView>
    );


}