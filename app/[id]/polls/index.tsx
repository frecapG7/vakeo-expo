import { PollStatus } from "@/components/polls/PollStatus";
import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { ToggleButton } from "@/components/ui/ToggleButton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetDashboard } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { translateType } from "@/lib/pollUtils";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function PollsPage() {

    const { trip, me } = useContext(TripContext);

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
        <View style={styles.container}>
            <Animated.FlatList
                data={page?.polls || []}
                className="my-2"
                contentContainerClassName="m-2"
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
                        className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4 gap-4 border border-gray-100 dark:border-gray-700 active:opacity-55">
                        <View className="">
                            <View className="flex-row items-center justify-between gap-1">
                                <View className="flex-row items-center gap-2">
                                    <Avatar
                                        size2="sm"
                                        src={item?.createdBy.avatar}
                                        alt={item.createdBy.name.charAt(0)}
                                    />
                                    <Text className="text-base dark:text-white font-bold">
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
                            <Text className="text-2xl font-bold dark:text-white">{item?.question}</Text>

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
                                    <Text className="font-bold text-gray-400">
                                        •
                                    </Text>
                                }
                                <Text className="text-gray-400">
                                    {item?.hasSelected?.length ?? 0} votes
                                </Text>

                            </View>
                            <View className="flex-row gap-1 items-center">
                                <Text className="font-bold text-gray-600 dark:text-gray-400 capitalize text-sm">
                                    {translateType(item.type)}
                                </Text>
                                <Text className="text-gray-400">
                                    •
                                </Text>
                                <Text className="font-bold text-gray-600 dark:text-gray-400 text-xs">
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
                            <View className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4 gap-4 border border-gray-100 dark:border-gray-700">
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
                            <View className="p-7 rounded-3xl bg-green-50 dark:bg-green-900 shadow-lg">
                                <IconSymbol name="checkmark.circle.fill" size={64} color="#22C55E" />
                            </View>
                            <Text className="text-3xl font-bold dark:text-white">
                                Tout est à jour
                            </Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-center max-w-sm">
                                Vous avez répondu à tous les sondages de ce voyage
                            </Text>
                        </View>
                    ) : (
                        // Empty state for polls
                        <View className="flex-1 items-center justify-center gap-6 py-20 px-4">
                            <View className="p-7 rounded-3xl bg-gray-50 dark:bg-gray-800 shadow-lg">
                                <IconSymbol name="chart.bar.fill" size={64} color="gray" />
                            </View>
                            <Text className="text-3xl font-bold dark:text-white">
                                Aucun sondage
                            </Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-center max-w-sm">
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