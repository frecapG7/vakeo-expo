import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { TripContext } from "@/context/TripContext";
import { useGetConversations, useMarkAllAsRead } from "@/hooks/api/useMessages";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { Conversation } from "@/types/responses";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, RefreshControl, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";


export default function TripConversations() {
    const { me, trip } = useContext(TripContext);
    const { data: conversationsData, isLoading, isRefetching, refetch } = useGetConversations(trip?._id, me?._id);
    const markAllAsRead = useMarkAllAsRead(trip?._id, me?._id);

    const conversations = conversationsData?.conversations ?? [];
    const { formatDuration } = useI18nTime();


    const router = useRouter();

    const ConversationSkeleton = () => (
        <View className="flex-row items-center gap-3 p-3">
            <Skeleton height={50} />
            <View className="flex-1 gap-2">
                <Skeleton height={16} width="60%" />
                <Skeleton height={14} width="40%" />
            </View>
        </View>
    );

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
                                className="font-semibold text-base dark:text-white flex-shrink"
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDuration(item.lastMessageDate)}
                            </Text>
                        </View>
                        {showUnread && (
                            <View className="bg-orange-600 rounded-full w-6 h-6 justify-center items-center min-w-[24px]">
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

    if (isLoading) {
        return (
            <View className="gap-1 pt-2">
                <ConversationSkeleton />
                <ConversationSkeleton />
                <ConversationSkeleton />
                <ConversationSkeleton />
                <ConversationSkeleton />
            </View>
        );
    }

    if (conversations?.length === 0) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-gray-500 dark:text-gray-400 text-center">
                    No conversations yet
                </Text>
                <Text className="text-gray-400 dark:text-gray-500 text-center text-sm mt-1">
                    Start a new conversation to get chatting
                </Text>
            </View>
        );
    }

    return (
        <Animated.FlatList
            data={conversations}
            renderItem={renderConversation}
            keyExtractor={(item) => item.conversationId ?? String(Math.random())}
            className="flex-1"
            contentContainerStyle={{ paddingVertical: 8 }}
            ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-200 dark:bg-gray-700 mx-14" />
            )}
            ListHeaderComponent={() => <View className="flex-row items-center justify-between px-4 py-2">
                <Text className="font-medium text-gray-700 dark:text-gray-300 text-xl">
                    Non lues ({totalUnreadCount > 9 ? '9+' : totalUnreadCount})
                </Text>
                {totalUnreadCount > 0 &&
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <Pressable onPress={async () => await markAllAsRead.mutateAsync()}>
                            <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                Tout marquer comme vu
                            </Text>
                        </Pressable>
                    </Animated.View>
                }
            </View>}
            refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
        />
    );
}