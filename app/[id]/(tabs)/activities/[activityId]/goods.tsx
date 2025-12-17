import { GoodsFlatList } from "@/components/goods/GoodsFlatList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useCheckGood, useGetGoods } from "@/hooks/api/useGoods";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function ActivityGoods() {


    const { id, activityId } = useLocalSearchParams();

    const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetGoods(id, {
        event: activityId
    });
    const checkGood = useCheckGood(id);

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const queryClient = useQueryClient();

    return (
        <SafeAreaView style={styles.container}>
            <View className="flex-row items-center pl-5 gap-2">
                <IconSymbol name="plus" color="blue" />
                <Text className="font-bold text-xl text-blue-700">Ajouter</Text>
            </View>
            <GoodsFlatList
                goods={goods}
                isRefreshing={isLoading}
                isFetching={isFetching}
                onCheck={async(good) => await checkGood.mutateAsync(good)}
                onRefresh={() => queryClient.invalidateQueries({ queryKey: ["trips", id, "goods"] })}
                onClick={(good) => console.log(JSON.stringify(good))}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                disabled={checkGood?.isPending}
            />
        </SafeAreaView>
    )
}