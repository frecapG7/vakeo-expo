import { Button } from "@/components/ui/Button";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useDeleteLink, useGetLinks } from "@/hooks/api/useLinks";
import { Link } from "@/types/models";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as Linking from 'expo-linking';
import { useRouter } from "expo-router";
import { useContext, useMemo } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated from "react-native-reanimated";


export default function TripLinks() {


    const { trip, me } = useContext(TripContext);
    const router = useRouter();

    const { data, hasNextPage, fetchNextPage, isLoading, refetch, isRefetching } = useGetLinks(trip?._id);
    const deleteLink = useDeleteLink(trip?._id, me?._id);
    const links = useMemo(() => data?.pages.flatMap((page) => page?.links), [data?.pages]);

    const handleDelete = async (link: Link) => {
        await deleteLink.mutateAsync(link);
    }


    const handleCopy = async (item: Link) => {
        await Clipboard.setStringAsync(item.url);
    };


    return (
        <GestureHandlerRootView style={styles.container}>
            <Animated.FlatList
                data={links || []}
                refreshing={isRefetching}
                className="flex-1"
                contentContainerClassName="my-5"
                renderItem={({ item }) =>
                    <Swipeable
                        renderRightActions={() => (
                            <View className="flex-row gap-2 mx-4 my-1">
                                <View className="bg-blue-500 justify-center rounded-2xl">
                                    <Button
                                        onPress={() => handleCopy(item)}
                                        className="h-full px-4"
                                    >
                                        <IconSymbol name="doc.on.doc" color="white" size={18} />
                                    </Button>
                                </View>
                                <View className="bg-red-500 justify-center rounded-2xl">
                                    <Button
                                        onPress={() => handleDelete(item)}
                                        className="h-full px-4"
                                        disabled={deleteLink.isPending || item?.type === "accommodation"}
                                    >
                                        {deleteLink?.isPending ? <Spinner size="small" /> : <IconSymbol name="trash" color="white" size={18} />}
                                    </Button>
                                </View>
                            </View>
                        )}
                        onSwipeableOpen={() =>
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                    >

                        <View className="flex-row items-center rounded-2xl bg-white dark:bg-gray-800 shadow-md mx-4 p-4 gap-4 border border-gray-100 dark:border-gray-700">
                            {/* Icon: try item.icon first, else fallback to link symbol */}
                            <View className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-gray-700 items-center justify-center">
                                {item.icon ? (
                                    <Image source={{ uri: item.icon }} style={{ width: "75%", height: "75%" }} contentFit="cover" />
                                ) : (
                                    <IconSymbol name="link" size={24} color={"blue"} />
                                )}
                            </View>

                            {/* Title + description */}
                            <View className="flex-1">
                                <Text className="text-lg font-semibold dark:text-white" numberOfLines={1}>
                                    {item.title}
                                </Text>
                                {item.description && (
                                    <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>
                                        {item.description}
                                    </Text>
                                )}
                            </View>

                            {/* Open URL button */}
                            <Button
                                className="w-8 h-8"
                                onPress={() => Linking.openURL(item.url)}
                            >
                                <IconSymbol name="arrow.up.right" size={18} />
                            </Button>
                        </View>
                    </Swipeable>
                }
                keyExtractor={(i) => i._id}
                ItemSeparatorComponent={() =>
                    <View className="items-center my-1">
                        {/* <View className="h-0.5 bg-gray-400 w-80 rounded-full my-2" /> */}
                    </View>
                }
                ListEmptyComponent={() =>
                    isLoading ? (
                        // Skeleton loaders
                        <View className="gap-3 px-5 pt-5">
                            <View className="flex-row items-center rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4 gap-4 border border-gray-100 dark:border-gray-700">
                                <Skeleton variant="circular" height={12} />
                                <View className="flex-1 gap-2">
                                    <Skeleton height={4} />
                                    <Skeleton height={3} />
                                </View>
                                <Skeleton variant="circular" height={8} />
                            </View>
                            <View className="flex-row items-center rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4 gap-4 border border-gray-100 dark:border-gray-700">
                                <Skeleton variant="circular" height={12} />
                                <View className="flex-1 gap-2">
                                    <Skeleton height={4} />
                                </View>
                                <Skeleton variant="circular" height={8} />
                            </View>
                            <View className="flex-row items-center rounded-2xl bg-white dark:bg-gray-800 shadow-md p-4 gap-4 border border-gray-100 dark:border-gray-700">
                                <Skeleton variant="circular" height={12} />
                                <View className="flex-1 gap-2">
                                    <Skeleton height={4} />
                                </View>
                                <Skeleton variant="circular" height={8} />
                            </View>
                        </View>
                    ) : (
                        // Empty state
                        <View className="flex-1 items-center justify-center gap-6 py-20 px-4">
                            <View className="p-7 rounded-3xl bg-gray-50 dark:bg-gray-800 shadow-lg">
                                <IconSymbol name="link" size={64} color="gray" />
                            </View>
                            <Text className="text-3xl font-bold dark:text-white">
                                Aucun lien
                            </Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-center max-w-sm">
                                Ajoutez des liens utiles pour ce voyage
                            </Text>
                        </View>
                    )
                }
                onRefresh={refetch}
                onEndReached={() => {
                    if (hasNextPage)
                        fetchNextPage();
                }}
                ListFooterComponent={<View className="my-5" />}
            />
            {trip?._id &&
                <FloatingAddButton onPress={() => router.push({
                    pathname: "/[id]/links/new",
                    params: {
                        id: trip._id,
                    }
                })} />
            }
        </GestureHandlerRootView>
    )
}