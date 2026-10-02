import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTrip } from "@/context/TripContext";
import { useGetConversations, useMarkAllAsRead } from "@/hooks/api/useMessages";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { Conversation } from "@/types/responses";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";


export default function TripConversations() {
    const { me, trip } = useTrip();
    const { data: conversationsData, isFetching, isRefetching, refetch } = useGetConversations(trip?._id);
    const markAllAsRead = useMarkAllAsRead(trip?._id, me?._id);

    const conversations = conversationsData?.conversations ?? [];
    const { formatDuration } = useI18nTime();


    const router = useRouter();


    const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

    const renderConversation = ({ item }: { item: Conversation }) => {
        const lastMessageUser = item.lastMessageUser;
        const showUnread = item.unreadCount > 0;

        return (
            <Pressable className="flex-row items-center gap-3 p-3 active:opacity-70"
                onPress={() => router.push({
                    pathname: "/[id]/chat",
                    params: {
                        id: trip?._id,
                        title: item.title,
                        ...(item.conversationId && { eventId: item?.conversationId })
                    }
                })}>
                <Avatar
                    src={lastMessageUser?.avatar}
                    alt={lastMessageUser?.name?.charAt(0)}
                    size2="sm"
                />

                <View className="flex-1 min-w-0">
                    <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center gap-2 flex-1 min-w-0">
                            <Text
                                className="font-semibold text-base text-night dark:text-white flex-shrink"
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDuration(item.lastMessageDate)}
                            </Text>
                        </View>
                        {showUnread && (
                            <View className="bg-amber-deep rounded-full w-6 h-6 justify-center items-center min-w-[24px]">
                                <Text className="font-bold text-white text-xs">
                                    {item.unreadCount > 9 ? '9+' : item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="flex-row items-center gap-1">
                        <Text
                            className="text-gray-600 dark:text-gray-300 flex-1"
                            numberOfLines={1}
                        >
                            {lastMessageUser.name}: {item.lastMessage}
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <Animated.FlatList
            data={conversations}
            renderItem={renderConversation}
            keyExtractor={(item) => item.conversationId ?? "general"}
            className="flex-1 bg-mist dark:bg-ink"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ paddingVertical: 8 }}
            ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-200 dark:bg-white/10 mx-14" />
            )}
            ListHeaderComponent={() =>!isFetching && <View className="flex-row items-center justify-between px-4 py-2">
                <Text className="font-medium text-night dark:text-white text-xl">
                    Non lues ({totalUnreadCount > 9 ? '9+' : totalUnreadCount})
                </Text>
                {totalUnreadCount > 0 &&
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <Pressable onPress={async () => await markAllAsRead.mutateAsync()}>
                            <Text className="text-amber-deep dark:text-amber text-sm font-medium">
                                Tout marquer comme vu
                            </Text>
                        </Pressable>
                    </Animated.View>
                }
            </View>}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={() => isFetching ?
                <View className="gap-4">
                    <View className="flex-row gap-2">
                        <Skeleton variant="circular" height={40} />
                        <View className="flex-1 px-5 gap-2">
                            <Skeleton height={12} />
                            <Skeleton height={12} width="66%" />
                        </View>
                    </View>
                    <View className="flex-row gap-2">
                        <Skeleton variant="circular" height={40} />
                        <View className="flex-1 px-5 gap-2">
                            <Skeleton height={12} />
                            <Skeleton height={12} width="66%" />
                        </View>
                    </View>

                </View>
                :
                <View className="flex-1 justify-center items-center p-8">
                    <GlassSurface style={{ borderRadius: 24 }}>
                        <View className="items-center gap-3 p-6">
                            <IconSymbol name="bubble.left.fill" size={40} color="#EE8B33" />
                            <Text className="text-h1 text-center text-night dark:text-white">Aucune conversation pour le moment</Text>
                            <Text className="text-sm text-center text-gray-500 dark:text-gray-400">
                                Lance la discussion avec ton groupe de voyage.
                            </Text>
                            <Button
                                className="bg-amber p-4 rounded-2xl flex-row items-center justify-center gap-3 w-full"
                                onPress={() => router.push({
                                    pathname: "/[id]/chat",
                                    params: { id: trip?._id, title: "General" }
                                })}>
                                <IconSymbol name="plus.circle" size={28} color="#16265C" />
                                <Text className="text-base font-bold text-night">Nouvelle discussion</Text>
                            </Button>
                        </View>
                    </GlassSurface>
                </View>
            }
        />
    );
}
