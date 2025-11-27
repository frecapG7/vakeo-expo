import { GoodForm } from "@/components/goods/GoodForm";
import { GoodListItemSkeleton } from "@/components/goods/GoodListItem";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Switch } from "@/components/ui/Switch";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useCheckGood, useGetGoods, usePostGood } from "@/hooks/api/useGoods";
import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
    const postGood = usePostGood(id);
    const checkGood = useCheckGood(id);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            quantity: "1"
        }
    });

    const onSubmit = async (data: Good) => {
        await postGood.mutateAsync({
            ...data,
            createdBy: me
        });
        reset({
            name: "",
            quantity: "1"
        });
    }

    const onCheck = async (data: Good) => {
        await checkGood.mutateAsync(data);
    }
    const bottomSheetRef = useRef<BottomSheet>(null);

    const colors = useColors();


    const router = useRouter();


    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureHandlerRootView style={styles.container}>
                {goods?.length > 0 &&
                    <Animated.View entering={ZoomIn} exiting={ZoomOut} className="border-b border-orange-400 mb-5">
                        <View className="flex-row">
                            {/* <Text>Courses</Text> */}
                            {/* <IconSymbol name="cart" size={34} color="black"/> */}
                        </View>
                        
                        <View className="flex-row items-center">
                        <Button className="flex-row flex-1 ml-10 gap-5" onPress={() => bottomSheetRef?.current?.expand()}>
                            <IconSymbol name="plus" color="blue" />
                            <Text className="text-2xl font-bold text-blue-400">Ajouter</Text>
                        </Button>
                        <View className="items-center">
                            <Switch value={unchecked} onSwitch={(v) => setUnchecked(!unchecked)} />
                            <Text className="text-sm dark:text-white">Uniquement manquant</Text>
                        </View>

                        </View>
                    </Animated.View>
                }
                <Animated.FlatList
                    data={goods}
                    refreshing={isLoading}
                    renderItem={({ item, index }) =>
                        <View className="px-2">
                            {item?.name !== goods[index - 1]?.name &&
                                <Animated.View entering={FadeIn} className="flex-row items-end justify-between">
                                    <Text className="dark:text-white capitalize text-2xl">{item.name}</Text>
                                    <Pressable onPress={() => router.push({
                                        pathname: "/[id]/(tabs)/goods/details",
                                        params: {
                                            id,
                                            name: item.name
                                        }
                                    })}
                                        className="bg-gray-200 rounded-full">
                                        <IconSymbol name="plus" color="black" />
                                    </Pressable>
                                </Animated.View>
                            }
                            <View className="flex flex-row justify-between items-end gap-5 ml-10 my-2 pb-1 border-b-2 border-blue-400">
                                <View className="flex-row items-center gap-2">
                                    <Pressable className="w-7 h-7" onPress={() => onCheck(item)} disabled={checkGood.isPending}>
                                        <Checkbox checked={item.checked} />
                                    </Pressable>
                                </View>
                                <Text className={`dark:text-white text-lg font-bold ${item.checked ? "line-through opacity-50" : ""}`}>X {item?.quantity}</Text>
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
                                <Button variant="contained" title="Ajouter" onPress={() => bottomSheetRef.current?.expand()} />
                            </View>
                    }
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



                <BottomSheet ref={bottomSheetRef}
                    index={-1}
                    backgroundStyle={{
                        backgroundColor: colors.background,
                        ...styles.bottomSheet
                    }}
                    enablePanDownToClose={true}
                >

                    <BottomSheetView style={{ flex: 1 }} className="gap-2 py-5 px-2">
                        <Pressable className="flex-row gap-1 mb-5 items-center" onPress={() => bottomSheetRef.current?.close()}>
                            <View className="rounded-full">
                                <IconSymbol name="xmark.circle" color={colors?.text} />
                            </View>
                            <Text className="text-2xl font-bold dark:text-white">Nouvel élément</Text>
                        </Pressable>

                        <View className="gap-5 my-5">
                            <GoodForm control={control} trip={{ _id: id }} />
                            <View className="px-10">
                                <Button variant="contained"
                                    className="px-10"
                                    title="Ajouter"
                                    onPress={handleSubmit(onSubmit)}
                                    isLoading={postGood.isPending} />
                            </View>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}