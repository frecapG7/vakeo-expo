import { GoodListItemSkeleton } from "@/components/goods/GoodListItem";
import { Button } from "@/components/ui/Button";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ToggleButton } from "@/components/ui/ToggleButton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useCheckGood, useGetGoods } from "@/hooks/api/useGoods";
import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
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

    const onCheck = async (data: Good) => await checkGood.mutateAsync(data);

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const colors = useColors();
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: title ?? "La liste générale"
        })
    })

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={goods}
                refreshing={isFetching}
                className="flex-1"
                contentContainerClassName=""
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
                ListHeaderComponent={() => <View className="flex flex-row mb-2">
                    <ToggleButton
                        active={unchecked}
                        onPress={() => setUnchecked(!unchecked)}
                        label="Uniquement manquant"
                    />
                </View>
                }
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
    )
}