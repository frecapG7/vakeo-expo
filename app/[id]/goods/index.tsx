import { GoodListItemSkeleton } from "@/components/goods/GoodListItem";
import { Button } from "@/components/ui/Button";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Spinner } from "@/components/ui/Spinner";
import styles, { popupMenuStyles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useCheckAllGoods, useCheckGood, useDeleteGood, useGetGoods } from "@/hooks/api/useGoods";
import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import Animated from "react-native-reanimated";
import { Toast } from "toastify-react-native";

export default function TripGoods() {

    const { eventId } = useLocalSearchParams<{ eventId?: string, title?: string }>();
    const { trip, me } = useContext(TripContext);


    const [unchecked, setUnchecked] = useState(false);
    const { data, isFetching, hasNextPage, fetchNextPage, refetch } = useGetGoods(trip._id, {
        ...(unchecked && { unchecked: true }),
        ...eventId && { event: eventId }
    });

    const checkGood = useCheckGood(trip._id, me?._id);
    const checkAllGoods = useCheckAllGoods(trip._id, me?._id || '');
    const deleteGood = useDeleteGood(trip._id, me?._id);

    const onCheck = async (data: Good) => await checkGood.mutateAsync(data);
    const handleCheckAll = async () => {
        await checkAllGoods.mutateAsync({ event: eventId });
    };

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const colors = useColors();
    const navigation = useNavigation();

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
                        <MenuOption onSelect={() => setUnchecked(!unchecked)} customStyles={{ optionWrapper: popupMenuStyles(colors).optionWrapper }}>
                            <Text className="dark:text-white">Afficher uniquement les articles manquant</Text>
                        </MenuOption>
                        <MenuOption onSelect={handleCheckAll} customStyles={{ optionWrapper: popupMenuStyles(colors).optionWrapper }}>
                            <Text className="dark:text-white">Marquer tout comme validé</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            )
        })
    })

    return (
        <GestureHandlerRootView style={styles.container}>
            <Animated.FlatList
                data={goods}
                refreshing={isFetching}
                className="flex-1"
                contentContainerClassName="my-5"
                renderItem={({ item }) =>
                    <Swipeable
                        renderRightActions={() => (
                            <View className="bg-red-500 justify-center rounded-2xl mx-4 my-1">
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
                            className={`flex-row items-center rounded-2xl bg-white dark:bg-gray-800 shadow-md mx-4 p-4 gap-4 border border-gray-100 dark:border-gray-700 ${item.checked ? "opacity-60" : ""}`}>
                            <Button className=""
                                onPress={() => onCheck(item)}
                                disabled={false}>
                                <IconSymbol name={item.checked ? "checkmark.circle.fill" : "circle"}
                                    color={item.checked ? colors.success : colors.gray}
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
                                <Text className={`dark:text-white capitalize  ${item.checked && "line-through"}`}>
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
                                            <Text className="text-gray-400 text-xs" numberOfLines={2}>{item.event?.name}</Text>
                                        )}
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-xs text-gray-500 dark:text-gray-400">
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
                            <View className="p-7 rounded-3xl bg-gray-50 dark:bg-gray-800 shadow-lg">
                                <IconSymbol name="cart" size={64} color={colors.gray} />
                            </View>
                            <Text className="text-3xl font-bold dark:text-white">
                                Aucun article
                            </Text>
                            <Text className="text-gray-400 dark:text-gray-500 text-center max-w-sm">
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
            <FloatingAddButton onPress={() => router.push({
                pathname: "/[id]/goods/new",
                params: {
                    id: trip._id,
                    ...(eventId && { eventId })
                }
            })}
            />
        </GestureHandlerRootView>
    )
}