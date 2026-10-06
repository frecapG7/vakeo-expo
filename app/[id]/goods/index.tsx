import { GoodListItemSkeleton } from "@/components/goods/GoodListItem";
import { Button } from "@/components/ui/Button";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Spinner } from "@/components/ui/Spinner";
import { Screen } from "@/components/ui/Screen";
import { popupMenuStyles } from "@/constants/Styles";
import { useTrip } from "@/context/TripContext";
import { useCheckAllGoods, useCheckGood, useDeleteGood, useGetGoods } from "@/hooks/api/useGoods";
import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { Toast } from "toastify-react-native";

export default function TripGoods() {

    const { eventId } = useLocalSearchParams<{ eventId?: string, title?: string }>();
    const { trip, me } = useTrip();


    const [unchecked, setUnchecked] = useState(false);
    const { data, isFetching, hasNextPage, fetchNextPage, refetch } = useGetGoods(trip._id, {
        ...(unchecked && { unchecked: true }),
        ...eventId && { event: eventId }
    });

    const checkGood = useCheckGood(trip._id);
    const checkAllGoods = useCheckAllGoods(trip._id);
    const deleteGood = useDeleteGood(trip._id);

    const onCheck = async (data: Good) => await checkGood.mutateAsync(data);
    const handleCheckAll = async () => {
        await checkAllGoods.mutateAsync({ event: eventId });
    };

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const colors = useColors();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleDelete = async (good: Good) => {
        if (!good)
            return;
        Alert.alert("Retirer de la liste ?",
            "", [
            {
                text: "Annuler",
            },
            {
                text: "Supprimer",
                onPress: () =>
                    deleteGood.mutate(good, {
                        onSuccess: () => {
                            Toast.success("Élément supprimé")
                        },
                        onError: (error) => {
                            console.error("Delete failed:", error);
                            Toast.error("Erreur de suppression");
                        }
                    })

            }
        ]);

    }
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Menu>
                    <MenuTrigger>
                        <IconSymbol name="ellipsis" size={24} color={colors.text} />
                    </MenuTrigger>
                    <MenuOptions customStyles={popupMenuStyles(colors)}>
                        <MenuOption onSelect={() => setUnchecked(!unchecked)}
                            customStyles={{ optionWrapper: popupMenuStyles(colors).optionWrapper }}>
                            <View className={`flex-row items-center gap-2 ${unchecked ? 'bg-amber/20' : ''}`}>
                                <View className={`p-1 rounded-full`}>
                                    <IconSymbol
                                        name="line.horizontal.3"
                                        size={18}
                                        color={unchecked ? "#EE8B33" : colors.text}
                                    />
                                </View>
                                <Text className="text-night dark:text-white">Afficher uniquement les articles manquants</Text>
                            </View>
                        </MenuOption>
                        {!!me?._id &&
                            <MenuOption onSelect={handleCheckAll}
                                customStyles={{ optionWrapper: popupMenuStyles(colors).optionWrapper }}>
                                <View className="flex-row items-center gap-2">
                                    <IconSymbol name="checkmark.circle" size={18} color={colors.text} />
                                    <Text className="text-night dark:text-white">Cocher tous les éléments</Text>
                                </View>
                            </MenuOption>
                        }
                    </MenuOptions>
                </Menu>
            )
        })
    })

    return (
        <Screen className="bg-mist dark:bg-ink" edges={[]}>
            <Animated.FlatList
                data={goods}
                refreshing={isFetching}
                className="flex-1"
                contentInsetAdjustmentBehavior="automatic"
                contentContainerClassName="my-5"
                renderItem={({ item }) =>
                    <Swipeable
                        renderRightActions={() => (
                            <View className="bg-danger justify-center rounded-2xl mx-4 my-1">
                                <Button
                                    onPress={() => handleDelete(item)}
                                    className="h-full px-4"
                                    disabled={deleteGood.isPending}
                                >
                                    {deleteGood.isPending ? <Spinner size="small" /> : <IconSymbol name="trash" color="white" size={24} />}

                                </Button>
                            </View>
                        )}
                        onSwipeableOpen={() =>
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                    >

                        <View
                            className={`flex-row items-center rounded-2xl bg-white dark:bg-night shadow-md mx-4 p-4 gap-4 border border-mist dark:border-white/10 ${item.checked ? "opacity-60" : ""}`}>
                            <Button className=""
                                onPress={() => onCheck(item)}
                                disabled={false}>
                                <IconSymbol name={item.checked ? "checkmark.circle.fill" : "circle"}
                                    color={item.checked ? "#EE8B33" : "#9AA3B8"}
                                    size={30} />
                            </Button>
                            <Pressable
                                onPress={() => router.push({
                                    pathname: "/[id]/goods/[goodId]",
                                    params: {
                                        id: trip._id,
                                        goodId: item._id
                                    }
                                })}

                                disabled={item?.checked}
                                className="flex-1 justify-center active:opacity-75">
                                <Text className={`text-night dark:text-white capitalize  ${item.checked && "line-through"}`}>
                                    <Text className="text-lg">
                                        {item.name}
                                        {item.quantityNumber != null && (
                                            <Text className="text-base"> ({item.quantityNumber} {item.unit})</Text>
                                        )}
                                    </Text>
                                </Text>
                                <View className="flex-row items-center justify-between mt-1">
                                    <View className="max-w-[50%]">
                                        {item?.event && (
                                            <Text className="text-night/60 dark:text-white/70 text-xs" numberOfLines={2}>{item.event?.name}</Text>
                                        )}
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-xs text-night/60 dark:text-white/70">
                                            Ajouté par {item.createdBy?.name}
                                        </Text>
                                    </View>
                                </View>

                            </Pressable>

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
                    isFetching ?
                        <View className="gap-2 px-5">
                            <GoodListItemSkeleton />
                            <GoodListItemSkeleton />
                            <GoodListItemSkeleton />
                        </View>
                        :
                        <View className="flex-1 items-center justify-center gap-6 py-20 px-4">
                            <View className="p-7 rounded-3xl bg-amber/15 shadow-lg">
                                <IconSymbol name="cart" size={64} color="#EE8B33" />
                            </View>
                            <Text className="text-3xl font-bold text-night dark:text-white">
                                Aucun article
                            </Text>
                            <Text className="text-night/60 dark:text-white/70 text-center max-w-sm">
                                Votre liste est vide pour l&apos;instant
                            </Text>
                        </View>
                }
                onRefresh={refetch}
                onEndReached={() => {
                    if (hasNextPage)
                        fetchNextPage();
                }}
                ListFooterComponent={<View className="my-5" />}
            />
            <FloatingAddButton
                style={{ bottom: insets.bottom + 40 }}
                onPress={() => router.push({
                pathname: "/[id]/goods/new",
                params: {
                    id: trip._id,
                    ...(eventId && { eventId })
                }
            })}
            />
        </Screen>
    )
}