import { PollStatus } from "@/components/polls/PollStatus";
import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToggleButton } from "@/components/ui/ToggleButton";
import styles from "@/constants/Styles";
import { useTrip } from "@/context/TripContext";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetDashboard } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { translateType } from "@/lib/pollUtils";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function PollsPage() {

    const { trip, me } = useTrip();

    const [excludeSelectedBy, setExcludeSelectedBy] = useState(false);
    const { data: page, isLoading, refetch, isRefetching } = useGetPolls(trip?._id, {
        ...(excludeSelectedBy && me?._id && { excludeSelectedBy: me?._id })
    });
    const { data: dashboard } = useGetDashboard(trip?._id, me?._id, !!trip?._id);
    const hasPolls = (dashboard?.polls?.openPollsCount ?? 0) > 0;
    const allAnswered = excludeSelectedBy && hasPolls;

    const router = useRouter();

    const { formatDuration } = useI18nTime();


    return (
        <View style={styles.container} className="flex-1 bg-mist dark:bg-ink">
            <Animated.FlatList
                data={page?.polls || []}
                className="my-2"
                contentContainerClassName="m-2"
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={() => (
                    <View className="flex-row mb-2">
                        <ToggleButton
                            active={!!excludeSelectedBy}
                            onPress={() => setExcludeSelectedBy(!excludeSelectedBy)}
                            label="Sondages en attente"
                            icon="exclamationmark"
                            disabled={!hasPolls}
                        />
                    </View>
                )}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push({
                            pathname: "/[id]/polls/[pollId]",
                            params: {
                                id: trip._id,
                                pollId: item._id
                            }
                        })}
                        className="rounded-2xl bg-white dark:bg-night shadow-md p-4 gap-4 border border-mist dark:border-white/10 active:opacity-55">
                        <View className="">
                            <View className="flex-row items-center justify-between gap-1">
                                <View className="flex-row items-center gap-2">
                                    <Avatar
                                        size2="sm"
                                        src={item?.createdBy.avatar}
                                        alt={item.createdBy.name.charAt(0)}
                                    />
                                    <Text className="text-base text-night dark:text-white font-bold">
                                        {item.createdBy.name}
                                    </Text>
                                </View>
                                <View>
                                    <PollStatus poll={item}
                                        selectedUser={me}
                                        onNewClick={() => router.push({
                                            pathname: "/[id]/polls/new",
                                            params: {
                                                id: trip._id,
                                                type: "OtherPoll"
                                            }
                                        })}
                                        onPollClick={() => router.push({
                                            pathname: "/[id]/polls/[pollId]",
                                            params: {
                                                id: trip._id,
                                                pollId: item._id
                                            }
                                        })}
                                    />
                                </View>
                            </View>
                            <Text className="text-2xl font-bold text-night dark:text-white">{item?.question}</Text>

                        </View>


                        <View className="flex-row flex-1 justify-between items-end">
                            <View className="flex-row flex-1 items-center gap-1">
                                {!item.isAnonymous &&
                                    <AvatarsGroup
                                        avatars={item.hasSelected.map(u => ({
                                            avatar: u.avatar,
                                            alt: u.name.charAt(0)
                                        }))}
                                        maxLength={3}
                                        size2="xs"
                                    />
                                }

                                {!item.isAnonymous && item.hasSelected.length > 0 &&
                                    <Text className="font-bold text-night/50 dark:text-white/50">
                                        •
                                    </Text>
                                }
                                <Text className="text-night/50 dark:text-white/50">
                                    {item?.hasSelected?.length ?? 0} votes
                                </Text>

                            </View>
                            <View className="flex-row gap-1 items-center">
                                <Text className="font-bold text-night/70 dark:text-white/70 capitalize text-sm">
                                    {translateType(item.type)}
                                </Text>
                                <Text className="text-night/50 dark:text-white/50">
                                    •
                                </Text>
                                <Text className="font-bold text-night/70 dark:text-white/70 text-xs">
                                    {formatDuration(item?.createdAt)}
                                </Text>

                            </View>

                        </View>
                    </Pressable>
                )
                }
                refreshing={isRefetching}
                onRefresh={refetch}
                ItemSeparatorComponent={() => <View className="my-2" />}
                ListEmptyComponent={() =>
                    isLoading ? (
                        // Skeleton loaders matching poll card structure
                        <View className="gap-3 px-1">
                            <View className="rounded-2xl bg-white dark:bg-night shadow-md p-4 gap-4 border border-mist dark:border-white/10">
                                <View className="flex-row items-center justify-between gap-1">
                                    <View className="flex-row items-center gap-2">
                                        <Skeleton variant="circular" height={32} />
                                        <Skeleton height={4} />
                                    </View>
                                    <Skeleton height={8} />
                                </View>
                                <Skeleton height={6} />
                                <View className="flex-row flex-1 justify-between items-end">
                                    <View className="flex-row items-center gap-1">
                                        <View className="flex-row -space-x-1">
                                            <Skeleton variant="circular" height={20} />
                                            <Skeleton variant="circular" height={20} />
                                        </View>
                                        <Skeleton height={3} />
                                    </View>
                                    <View className="flex-row gap-1 items-center">
                                        <Skeleton height={3} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : allAnswered ? (
                        // All polls answered state
                        <View className="flex-1 items-center justify-center gap-6 py-20 px-4">
                            <View className="p-7 rounded-3xl bg-amber/15 dark:bg-amber/20 shadow-lg">
                                <IconSymbol name="checkmark.circle.fill" size={64} color="#EE8B33" />
                            </View>
                            <Text className="text-3xl font-bold text-night dark:text-white">
                                Tout est à jour
                            </Text>
                            <Text className="text-night/50 dark:text-white/50 text-center max-w-sm">
                                Vous avez répondu à tous les sondages de ce voyage
                            </Text>
                        </View>
                    ) : (
                        // Empty state for polls
                        <View className="flex-1 items-center justify-center gap-6 py-20 px-4">
                            <View className="p-7 rounded-3xl bg-amber/15 dark:bg-amber/20 shadow-lg">
                                <IconSymbol name="chart.bar.fill" size={64} color="#EE8B33" />
                            </View>
                            <Text className="text-3xl font-bold text-night dark:text-white">
                                Aucun sondage
                            </Text>
                            <Text className="text-night/50 dark:text-white/50 text-center max-w-sm">
                                Créez votre premier sondage pour ce voyage
                            </Text>
                        </View>
                    )
                }
            />
            {trip?._id &&
                <FloatingAddButton
                    onPress={() => router.push({
                        pathname: "/[id]/polls/new",
                        params: {
                            id: trip._id,
                            type: "OtherPoll"
                        }
                    })} />
            }
        </View>
    )
}