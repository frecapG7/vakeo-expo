import { useGetGoods } from "@/hooks/api/useGoods";
import { Event } from "@/types/models";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";

export const EventsGoodsList = ({ event }: { event: Event }) => {

    const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetGoods(
        event.trip,
        {
            event: event._id
        });

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);


    const onCheck = () => { }
    const onClick = () => { }
    const onAdd = () => { }
    return (
        <View>
            <View className="gap-2">
                {goods?.map((good) =>
                    <View key={good._id}
                        className={`flex-row  items-center rounded-xl py-2 ${good.checked ? "opacity-50" : ""}`}>
                        <Button className="px-5"
                            onPress={() => onCheck(good)}
                            disabled={false}>
                            <IconSymbol name={good.checked ? "checkmark.circle.fill" : "circle"}
                                color={good.checked ? "green" : "gray"}
                                size={32} />
                        </Button>
                        <Pressable
                            onPress={() => onClick(good)}
                            disabled={good?.checked}
                            className="flex-1 flex-row justify-between items-center border-b border-orange-200 dark:border-gray-200">
                            <Text className={`dark:text-white capitalize  ${good.checked && "line-through"}`}>
                                <Text className="text-2xl">
                                    {good.name}
                                </Text>
                                <Text className="text-md">
                                    {good.quantity && `(${good?.quantity})`}
                                </Text>
                            </Text>
                            <IconSymbol name="cart" size={18} color="gray"/>
                        </Pressable>
                    </View>
                )}
            </View>
            <View className="flex-row items-center justify-center my-10">
                <Button className="rounded-full border border-orange-400"
                    onPress={onAdd}>
                    <IconSymbol name="plus" color="orange" size={34} />
                </Button>
            </View>
        </View>
    )
}