import { GoodBottomSheet } from "@/components/goods/GoodBottomSheet";
import { GoodListItemSkeleton } from "@/components/goods/GoodListItem";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Switch } from "@/components/ui/Switch";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useCheckGood, useGetGoods } from "@/hooks/api/useGoods";
import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, ZoomIn, ZoomOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoodPage() {

    const { id } = useLocalSearchParams();
    const { me } = useContext(TripContext);


    const [unchecked, setUnchecked] = useState(false);
    const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetGoods(id, {
        ...(unchecked && { unchecked: true })
    });
    const queryClient = useQueryClient();

    const checkGood = useCheckGood(id);

    const onCheck = async (data: Good) => {
        await checkGood.mutateAsync(data);
    }

    const [selectedGood, setSelectedGood] = useState<Good | null>();

    const colors = useColors();

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const handleAdd = () => setSelectedGood({
        _id: "",
        name: "",
        quantity: "1",
        createdBy: me,
        trip: {
            _id: id
        }
    });

    const router = useRouter();
    const navigation = useNavigation();


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <Pressable
                onPressOut={handleAdd}
                className="bg-gray-800 rounded-full p-2 mx-2 z-1000">
                <IconSymbol name="plus" color="white" />
            </Pressable>,
        })
    }, [navigation]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureHandlerRootView style={styles.container}>
                <Animated.View entering={ZoomIn} exiting={ZoomOut} className="border-b border-orange-400 dark:border-gray-400 pb-1 mb-5">
                    <View className="flex-row items-center">
                        {/* <Button className="flex-row flex-1 ml-10 gap-2 items-center" onPress={handleAdd}>
                            <IconSymbol name="plus" color="blue" />
                            <Text className="text-2xl font-bold text-blue-400">Ajouter</Text>
                        </Button> */}
                        <View className="items-center">
                            <Switch value={unchecked} onSwitch={(v) => setUnchecked(!unchecked)} />
                            <Text className="text-sm dark:text-white">Uniquement manquant</Text>
                        </View>

                    </View>
                </Animated.View>a
                <Animated.FlatList
                    data={goods}
                    refreshing={isLoading}
                    renderItem={({ item, index }) =>
                        <View className="px-2">
                            {item?.name !== goods[index - 1]?.name &&
                                <Animated.View entering={FadeIn} className="flex-row items-end justify-between">
                                    <Text className="dark:text-white capitalize text-2xl">{item.name}</Text>

                                    {/* TODO: could be useful to be able to see details */}
                                    {/* <Pressable onPress={() => router.push({
                                        pathname: "/[id]/(tabs)/goods/details",
                                        params: {
                                            id,
                                            name: item.name
                                        }
                                    })}
                                        className="bg-gray-200 rounded-full">
                                        <IconSymbol name="plus" color="black" />
                                    </Pressable> */}
                                </Animated.View>
                            }
                            <View className="flex flex-row justify-between items-end gap-5 ml-10 my-2 pb-1 border-b-2 border-blue-400">
                                <Button className="flex-row flex-1 items-center gap-2" onPress={() => onCheck(item)} disabled={checkGood.isPending}>
                                    <View className="w-7 h-7" >
                                        <Checkbox checked={item.checked} />
                                    </View>
                                    <Text className={`dark:text-white text-lg font-bold ${item.checked ? "line-through opacity-50" : ""}`}>{item?.quantity}</Text>
                                </Button>
                                <Button className="rounded-full bg-blue-400 p-1" onPress={() => setSelectedGood(item)}>
                                    <IconSymbol name="pencil" size={16} />
                                </Button>
                            </View>
                        </View>
                    }
                    keyExtractor={(i) => i._id}
                    ItemSeparatorComponent={() =>
                        <View className="items-center my-2">
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
                            <View className="flex-1 items-center justify-center gap-2 mt-5">
                                <IconSymbol name="cart" size={45} color={colors.text} />
                                <Text className="text-2xl dark:text-white">Votre liste est vide</Text>
                                <Text className="text-lg dark:text-white mt-5">
                                    Commencez à ajouter des éléments à votre liste
                                </Text>
                            </View>
                    }
                    onRefresh={() => queryClient.invalidateQueries({ queryKey: ["trips", id, "goods"] })}
                    onEndReached={() => {
                        if (hasNextPage)
                            fetchNextPage();
                    }}
                    ListHeaderComponent={() => {

                        if (isFetchingNextPage)
                            return (
                                <View className="items-center">
                                    <ActivityIndicator />
                                </View>);

                        if (goods?.length > 0)
                            return
                    }

                    }
                />



                <GoodBottomSheet good={selectedGood}
                    trip={{
                        _id: id
                    }}
                    open={!!selectedGood}
                    onClose={() => setSelectedGood(null)} />
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}