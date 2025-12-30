import { GoodBottomSheet } from "@/components/goods/GoodBottomSheet";
import { GoodsFlatList } from "@/components/goods/GoodsFlatList";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Switch } from "@/components/ui/Switch";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useCheckGood, useGetGoods } from "@/hooks/api/useGoods";
import { Good } from "@/types/models";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
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


    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const handleAdd = () => setSelectedGood({
        _id: "",
        name: "",
        quantity: "",
        createdBy: me,
        trip: {
            _id: id
        }
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureHandlerRootView style={styles.container}>
                <Animated.View entering={ZoomIn} exiting={ZoomOut} className="border-b border-orange-400 dark:border-gray-400 pb-1 mb-5">
                    <View className="flex-row items-center">
                        <Button className="flex-row flex-1 ml-10 gap-2 items-center" onPress={handleAdd}>
                            <IconSymbol name="plus" color="blue" />
                            <Text className="text-2xl font-bold text-blue-400">Ajouter</Text>
                        </Button>
                        <View className="items-center">
                            <Switch value={unchecked} onSwitch={(v) => setUnchecked(!unchecked)} />
                            <Text className="text-sm dark:text-white">Uniquement manquant</Text>
                        </View>
                    </View>
                </Animated.View>

                <GoodsFlatList
                    goods={goods}
                    isRefreshing={isLoading}
                    isFetching={isFetching || isFetchingNextPage}
                    onCheck={onCheck}
                    onRefresh={() => queryClient.invalidateQueries({ queryKey: ["trips", id, "goods"] })}
                    onClick={setSelectedGood}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    disabled={checkGood?.isPending}
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