import { Good } from "@/types/models";
import { FlatList, Pressable, Text, View } from "react-native";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";
import { GoodListItemSkeleton } from "./GoodListItem";




export const GoodsFlatList = (
    { goods, isRefreshing, isFetching, onCheck, onClick, onRefresh, hasNextPage, fetchNextPage, disabled, showEvent }:
        { goods: Good[], isRefreshing: boolean, isFetching: boolean, onCheck: (good: Good) => Promise<void>, onClick: (good: Good) => void, onRefresh: () => void, hasNextPage: boolean, fetchNextPage: () => void, disabled: boolean, showEvent?: boolean }) => {


    return (
        <FlatList
            data={goods}
            refreshing={isRefreshing}
            className="flex-1"
            renderItem={({ item }) =>
                <View className={`flex-row items-center rounded-xl py-2 ${item.checked ? "opacity-50" : ""}`}>
                    <Button className="px-5"
                        onPress={() => onCheck(item)}
                        disabled={disabled}>
                        <IconSymbol name={item.checked ? "checkmark.circle.fill" : "circle"}
                            color={item.checked ? "green" : "gray"}
                            size={32} />
                    </Button>
                    <Pressable
                        onPress={() => onClick(item)}
                        disabled={item?.checked}
                        className="flex-1 border-b border-orange-200 dark:border-gray-200">
                        <Text className={`dark:text-white capitalize  ${item.checked && "line-through"}`}>
                            <Text className="text-2xl">

                                {item.name}
                            </Text>
                            <Text className="text-md">
                                {item.quantity && `(${item?.quantity})`}

                            </Text>
                        </Text>
                        {(showEvent && item.event) &&
                            <Text className="dark:text-white text-xs">
                                {item.event?.name}
                            </Text>

                        }
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
                        <IconSymbol name="cart" size={45} color="gray" />
                        <Text className="text-2xl dark:text-white">Votre panier est vide</Text>
                        <Text className="text-lg dark:text-white mt-5">
                            Commencez à ajouter des éléments à votre panier
                        </Text>
                    </View>
            }
            onRefresh={onRefresh}
            onEndReached={() => {
                if (hasNextPage)
                    fetchNextPage();
            }}
        // ListHeaderComponent={() => {
        //     if (isFetching)
        //         return (
        //             <View className="items-center">
        //                 <ActivityIndicator />
        //             </View>);

        //     if (goods?.length > 0)
        //         return
        // }
        // }
        />
    )
}