import { GoodBottomSheet } from "@/components/goods/GoodBottomSheet";
import { GoodsFlatList } from "@/components/goods/GoodsFlatList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useCheckGood, useGetGoods } from "@/hooks/api/useGoods";
import { Good } from "@/types/models";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function ActivityGoods() {


    const { id, activityId } = useLocalSearchParams();

    const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetGoods(id, {
        event: activityId
    });
    const checkGood = useCheckGood(id);

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    const queryClient = useQueryClient();

    const { me } = useContext(TripContext);
    const [selectedGood, setSelectedGood] = useState<Good | null>();

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <Pressable
                onPressOut={() => setSelectedGood(
                    {
                        _id: "",
                        name: "",
                        quantity: "",
                        createdBy: me,
                        trip: {
                            _id: id
                        },
                        event: {
                            _id: activityId
                        }
                    })}
                className="bg-gray-800 rounded-full p-2">
                <IconSymbol name="plus" size={25} color="white" />
            </Pressable>
        })
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <GoodsFlatList
                goods={goods}
                isRefreshing={isLoading}
                isFetching={isFetching || isFetchingNextPage}
                onCheck={async (good) => await checkGood.mutateAsync(good)}
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
        </SafeAreaView>
    )
}