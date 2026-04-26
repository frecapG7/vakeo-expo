import { GoodBottomForm } from "@/components/goods/GoodBottomForm";
import { GoodListItemSkeleton } from "@/components/goods/GoodListItem";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Switch } from "@/components/ui/Switch";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useCheckGood, useDeleteGood, useGetGoods, usePostGood, usePutGood } from "@/hooks/api/useGoods";
import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";


const GoodEvents = ({ id, good }: { id: any, good?: Good }) => {


    const enabled = useMemo(() => !!good?._id, [good]);

    const { data } = useGetGoods(id, {
        search: good?.name
    }, {
        enabled
    })


    if (!good?._id)
        return <></>;


    return (
        <BottomSheetFlatList
            data={data?.pages.flatMap((page) => page?.goods?.filter(g => g._id !== good._id))}
            keyExtractor={(i) => i?._id}
            renderItem={({ item }) =>
                <View className="flex-row items-center gap-4">
                    <Text className="text-xs dark:text-white">
                        {'\u2B24'}
                    </Text>
                    <View className="justify-center">
                        <Text className={`${item.checked && "line-through"} dark:text-white capitalize`}>
                            {item?.name}
                        </Text>
                        {item?.event &&
                            <Text className="text-gray-400 italic text-sm">
                                {item?.event?.name}
                            </Text>
                        }
                    </View>
                </View>}
            ListHeaderComponent={<Text className="font-bold text-gray-400">
                Éléments similaires trouvés
            </Text>
            }
            ListEmptyComponent={<Text className="text-sm text-gray-400">
                Aucun autre élément
            </Text>}
            contentContainerClassName="border-t border-gray-400 m-5"

        />
    )


}


export default function TripGoods() {

    const { id } = useLocalSearchParams();
    const { me } = useContext(TripContext);


    const [unchecked, setUnchecked] = useState(false);
    const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useGetGoods(id, {
        ...(unchecked && { unchecked: true })
    });

    const checkGood = useCheckGood(id);
    const putGood = usePutGood(id);
    const postGood = usePostGood(id);
    const deleteGood = useDeleteGood(id);

    const onCheck = async (data: Good) => await checkGood.mutateAsync(data);


    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const colors = useColors();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [bottomSheetIndex, setBottomSheetIndex] = useState(0);


    const defaultValues = useMemo(() => ({
        trip: String(id),
        createdBy: me
    }), [id, me]);


    const { control, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm<Good>({
        defaultValues
    });
    const currentGood = useWatch({
        control
    });

    const onSubmit = async (data: Good) => {
        if (data._id) {
            await putGood.mutateAsync(data);
            Toast.success("Liste modifiée");
        }
        else {
            await postGood.mutateAsync(data);
            Toast.success("Article ajouté");
        }
    }
    const onDelete = async (data: Good) => {

        await deleteGood.mutateAsync(data);
        reset(defaultValues);
        Toast.success("Élément supprimé")
        bottomSheetRef.current?.snapToIndex(0)
    }

    useEffect(() => {
        if (isSubmitSuccessful)
            reset({
                name: "",
                quantity: "",
                trip: String(id),
                createdBy: me
            })
    }, [isSubmitSuccessful, reset, id, me])



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.FlatList
                    data={goods}
                    refreshing={isFetching}
                    className="flex-1"
                    renderItem={({ item }) =>
                        <View className={`flex-row items-center rounded-xl py-2 ${item.checked ? "opacity-50" : ""}`}>
                            <Button className="px-5"
                                onPress={() => onCheck(item)}
                                disabled={false}>
                                <IconSymbol name={item.checked ? "checkmark.circle.fill" : "circle"}
                                    color={item.checked ? "green" : "gray"}
                                    size={32} />
                            </Button>
                            <Pressable
                                onLongPress={() => {
                                    reset(item)
                                    bottomSheetRef.current?.snapToIndex(2)
                                }}
                                disabled={item?.checked}
                                className="flex-1 border-b border-orange-200 dark:border-gray-200">
                                <Text className={`dark:text-white capitalize  ${item.checked && "line-through"}`}>
                                    <Text className="text-2xl">
                                        {item.name}
                                    </Text>
                                </Text>
                                <Text className="dark:text-white text-xs">
                                    {item.event?.name}
                                </Text>

                            </Pressable>

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
                                <IconSymbol name="list.bullet" size={45} color="gray" />
                                <Text className="text-2xl dark:text-white">La liste est vide</Text>
                                <Text className="text-lg dark:text-white mt-5">
                                    Commence à ajouter des éléments à la liste
                                </Text>
                            </View>
                    }
                    onRefresh={refetch}
                    onEndReached={() => {
                        if (hasNextPage)
                            fetchNextPage();
                    }}
                    ListHeaderComponent={() => <View className="flex flex-row justify-end">
                        <View className="items-center gap-1 ">
                            <Switch value={unchecked}
                                onSwitch={(v) => setUnchecked(v)} />
                            <Text className="text-xs text-gray-400">Uniquement manquant</Text>
                        </View>
                    </View>
                    }
                    ListFooterComponent={<View className="my-5" />}
                />
                <BottomSheet ref={bottomSheetRef}
                    index={1}
                    backgroundStyle={{
                        backgroundColor: colors.background,
                        ...styles.bottomSheet
                    }}
                    enablePanDownToClose={false}
                    enableOverDrag={false}
                    keyboardBehavior="interactive"
                    keyboardBlurBehavior="restore"
                    snapPoints={["5%", "15%", "50%"]}
                    onChange={(index) => {
                        if (index === 0)
                            reset(defaultValues)
                        setBottomSheetIndex(index);
                    }}
                >
                    <BottomSheetView style={{ flex: 1 }} className="gap-2 py-5 px-2">

                        {(currentGood?._id && bottomSheetIndex > 2) &&

                            <Animated.View
                                entering={FadeIn}
                                exiting={FadeOut}
                                className="flex-row justify-end">
                                <Button
                                    className="rounded-full bg-red-200 p-1"
                                    onPress={() => Alert.alert("Retirer de la liste ?",
                                        "", [
                                        {
                                            text: "Annuler",
                                        },
                                        {
                                            text: "Supprimer",
                                            onPress: () => onDelete(currentGood)
                                        }
                                    ])}>
                                    <IconSymbol name="trash" color="red" />
                                </Button>
                            </Animated.View>
                        }
                        <GoodBottomForm control={control}
                            onSubmit={handleSubmit(onSubmit)}
                            onCancel={() => {
                                reset(defaultValues);
                                bottomSheetRef.current?.snapToIndex(1);
                            }}
                            isSubmitting={postGood.isPending || putGood.isPending}
                        />

                        {bottomSheetIndex > 2 &&
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <GoodEvents id={id} good={currentGood} />
                            </Animated.View>

                        }

                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </SafeAreaView>
    )
}