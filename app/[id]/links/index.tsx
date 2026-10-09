import { Button } from "@/components/ui/Button";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { useTrip } from "@/context/TripContext";
import { useDeleteLink, useGetLinks } from "@/hooks/api/useLinks";
import { Link } from "@/types/models";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as Linking from 'expo-linking';
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Alert, Text, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated from "react-native-reanimated";
import { Toast } from "toastify-react-native";


export default function TripLinks() {

    const { trip } = useTrip();
    const router = useRouter();

    const { data, hasNextPage, fetchNextPage, isLoading, refetch, isRefetching } = useGetLinks(trip?._id);
    const deleteLink = useDeleteLink(trip?._id);
    const links = useMemo(() => data?.pages.flatMap((page) => page?.links), [data?.pages]);

    const handleDelete = (link: Link) => {
        if (!link)
            return;
        Alert.alert("Retirer le lien ?",
            "", [
            {
                text: "Annuler",
            },
            {
                text: "Supprimer",
                onPress: () =>
                    deleteLink.mutate(link, {
                        onSuccess: () => {
                            Toast.success("Lien supprimé")
                        },
                        onError: (error) => {
                            console.error("Delete failed:", error);
                            Toast.error("Erreur de suppression");
                        }
                    })
            }
        ]);
    }


    const handleCopy = async (item: Link) => {
        await Clipboard.setStringAsync(item.url);
        Toast.info("Lien copié");
    };


    return (
        <View className="flex-1 bg-mist dark:bg-ink">
            <Animated.FlatList
                data={links || []}
                refreshing={isRefetching}
                className="flex-1"
                contentContainerClassName="my-5 gap-2"
                contentInsetAdjustmentBehavior="automatic"
                renderItem={({ item }) =>
                    <Swipeable
                        renderRightActions={() => (
                            <View className="flex-row gap-2 mx-4 my-1">
                                <View className="bg-amber-deep justify-center rounded-2xl">
                                    <Button
                                        onPress={() => handleCopy(item)}
                                        className="h-full px-4"
                                    >
                                        <IconSymbol name="doc.on.doc" color="#F6F8FD" size={18} />
                                    </Button>
                                </View>
                                <View className="bg-danger justify-center rounded-2xl">
                                    <Button
                                        onPress={() => handleDelete(item)}
                                        className="h-full px-4"
                                        disabled={deleteLink.isPending || item?.type === "accommodation"}
                                    >
                                        {deleteLink?.isPending ? <Spinner size="small" /> : <IconSymbol name="trash" color="#F6F8FD" size={18} />}
                                    </Button>
                                </View>
                            </View>
                        )}
                        onSwipeableOpen={() =>
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                    >

                        <View className="flex-row items-center rounded-2xl bg-white dark:bg-night shadow-md mx-4 p-4 gap-4 border border-mist dark:border-white/10">
                            {/* Icon: item.icon first, fallback link symbol */}
                            <View className="w-12 h-12 rounded-xl bg-amber/15 dark:bg-amber/20 items-center justify-center">
                                {item.icon ? (
                                    <Image source={{ uri: item.icon }} style={{ width: "75%", height: "75%" }} contentFit="cover" />
                                ) : (
                                    <IconSymbol name="link" size={24} color="#EE8B33" />
                                )}
                            </View>

                            {/* Title + description */}
                            <View className="flex-1">
                                <Text className="text-lg font-semibold text-night dark:text-white" numberOfLines={1}>
                                    {item.title}
                                </Text>
                                {item.description && (
                                    <Text className="text-sm text-night/50 dark:text-white/50" numberOfLines={1}>
                                        {item.description}
                                    </Text>
                                )}
                            </View>

                            {/* Open URL button */}
                            <Button
                                className="w-8 h-8"
                                onPress={() => Linking.openURL(item.url)}
                            >
                                <IconSymbol name="arrow.up.right" size={18} color="#EE8B33" />
                            </Button>
                        </View>
                    </Swipeable>
                }
                keyExtractor={(i) => i._id}
                ListEmptyComponent={() =>
                    isLoading ? (
                        // Skeleton loaders
                        <View className="gap-3 px-4 pt-5">
                            {[0, 1, 2].map(i => (
                                <View key={i} className="flex-row items-center rounded-2xl bg-white dark:bg-night shadow-md p-4 gap-4 border border-mist dark:border-white/10">
                                    <Skeleton variant="circular" height={12} />
                                    <View className="flex-1 gap-2">
                                        <Skeleton height={4} />
                                        <Skeleton height={3} />
                                    </View>
                                    <Skeleton variant="circular" height={8} />
                                </View>
                            ))}
                        </View>
                    ) : (
                        // Empty state
                        <View className="flex-1 items-center justify-center gap-6 py-20 px-4">
                            <View className="p-7 rounded-3xl bg-amber/15 dark:bg-amber/20 shadow-lg">
                                <IconSymbol name="link" size={64} color="#EE8B33" />
                            </View>
                            <Text className="text-3xl font-bold text-night dark:text-white">
                                Aucun lien
                            </Text>
                            <Text className="text-night/50 dark:text-white/50 text-center max-w-sm">
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
                ListFooterComponent={<View className="my-5 pb-6" />}
            />
            {trip?._id &&
                <FloatingAddButton onPress={() => router.push({
                    pathname: "/[id]/links/new",
                    params: {
                        id: trip._id,
                    }
                })} />
            }
        </View>
    )
}
