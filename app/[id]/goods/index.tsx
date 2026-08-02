import { GoodListItemSkeleton } from "@/components/goods/GoodListItem";
import { Button } from "@/components/ui/Button";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useCheckAllGoods, useCheckGood, useGetGoods } from "@/hooks/api/useGoods";
import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import Animated from "react-native-reanimated";


export default function TripGoods() {

    const { eventId, title } = useLocalSearchParams<{ eventId?: string, title?: string }>();
    const { trip, me } = useContext(TripContext);


    const [unchecked, setUnchecked] = useState(false);
    const { data, isFetching, hasNextPage, fetchNextPage, refetch } = useGetGoods(trip._id, {
        ...(unchecked && { unchecked: true }),
        ...eventId && { event: eventId }
    });

    const checkGood = useCheckGood(trip._id, me?._id);
    const checkAllGoods = useCheckAllGoods(trip._id, me?._id || '');
    const [showMenu, setShowMenu] = useState(false);

    const onCheck = async (data: Good) => await checkGood.mutateAsync(data);
    const handleCheckAll = () => {
        checkAllGoods.mutate({ createdBy: me?._id, event: eventId });
        setShowMenu(false);
    };

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const colors = useColors();
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: title ?? "La liste générale",
            headerRight: () => (
                <Pressable onPress={() => setShowMenu(!showMenu)} className="p-2">
                    <IconSymbol name="ellipsis.circle" size={24} color={colors.text} />
                </Pressable>
            )
        })
    })

    return (
        <MenuProvider>
            <View style={styles.container}>
                {showMenu && (
                    <>
                        <Pressable
                            className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 z-40"
                            onPress={() => setShowMenu(false)}
                        />
                        <Menu onBackdropPress={() => setShowMenu(false)}>
                            <MenuTrigger customStyles={{ triggerWrapper: { padding: 6, display: 'none' } }} />
                            <MenuOptions
                                customStyles={{
                                    optionsContainer: {
                                        borderRadius: 12,
                                        padding: 4,
                                        marginTop: 8,
                                        backgroundColor: colors.background,
                                    },
                                    optionWrapper: { margin: 0, backgroundColor: 'transparent' }
                                }}
                            >
                                <MenuOption onSelect={() => { setUnchecked(!unchecked); setShowMenu(false); }}>
                                    <View className="flex-row items-center gap-2 p-2">
                                        <IconSymbol name={unchecked ? "checkmark.circle.fill" : "circle"} size={20} color={colors.text} />
                                        <Text className="text-sm" style={{ color: colors.text }}>Uniquement manquant</Text>
                                    </View>
                                </MenuOption>
                                <MenuOption onSelect={handleCheckAll} disabled={checkAllGoods.isPending}>
                                    <View className="flex-row items-center gap-2 p-2">
                                        <IconSymbol name="checkmark.circle" size={20} color={colors.success} />
                                        <Text className="text-sm" style={{ color: colors.text }}>Tout cocher</Text>
                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </>
                )}
                <Animated.FlatList
                    data={goods}
                    refreshing={isFetching}
                    className="flex-1"
                    contentContainerClassName="my-5"
                    renderItem={({ item }) =>
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
                                onLongPress={() => router.push({
                                    pathname: "/[id]/goods/[goodId]",
                                    params: {
                                        id: trip._id,
                                        goodId: item._id
                                    }
                                })}
                                disabled={item?.checked}
                                className="flex-1 justify-center active:opacity-">
                                <Text className={`dark:text-white capitalize  ${item.checked && "line-through"}`}>
                                    <Text className="text-lg">
                                        {item.name}
                                    </Text>
                                </Text>
                                <View className="flex-row items-center justify-between mt-1">
                                    <View>
                                        {item?.event && (
                                            <Text className="text-gray-400 text-xs">{item.event?.name}</Text>
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
                            <View className="flex-1 items-center justify-center gap-4 my-10 px-4">
                                <View className="p-6 rounded-full bg-gray-100 dark:bg-gray-700">
                                    <IconSymbol name="list.bullet.clipboard" size={50} color={colors.gray} />
                                </View>
                                <Text className="text-3xl font-bold dark:text-white text-center">Aucun article</Text>
                                <Text className="text-base text-gray-500 dark:text-gray-400 text-center max-w-xs">
                                    Appuyez sur "+" pour ajouter un article
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
            </View>
        </MenuProvider>
    )
}