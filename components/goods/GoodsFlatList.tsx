import { Good } from "@/types/models";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { IconSymbol } from "../ui/IconSymbol";
import { GoodListItemSkeleton } from "./GoodListItem";




export const GoodsFlatList = (
    { goods, isRefreshing, isFetching, onCheck, onClick, onRefresh, hasNextPage, fetchNextPage, disabled }:
        { goods: Good[], isRefreshing: boolean, isFetching: boolean, onCheck: (good: Good) => void, onClick: (good: Good) => void, onRefresh: () => void, hasNextPage: boolean, fetchNextPage: () => void, disabled: boolean }) => {


    return (
        <Animated.FlatList
            data={goods}
            refreshing={isRefreshing}
            className="flex-1"
            renderItem={({ item, index }) =>
                <View className="px-2">
                    {item?.name !== goods[index - 1]?.name &&
                        <Animated.View entering={FadeIn} className="flex-row items-end justify-between">
                            <Text className="dark:text-white capitalize text-xl">{item.name}</Text>
                        </Animated.View>
                    }
                    <View className="flex flex-row justify-between items-end gap-5 ml-10  pb-1 border-b-2 border-blue-400">
                        <Button className="flex-row flex-1 items-center gap-2" onPress={() => onCheck(item)} disabled={disabled}>
                            <View className="w-5 h-7" >
                                <Checkbox checked={item.checked} />
                            </View>
                            <Text className={`dark:text-white text-p=p=m font-bold ${item.checked ? "line-through opacity-50" : ""}`}>{item?.quantity}</Text>
                        </Button>

                        <Button className="rounded-full border bg-blue-500 p-1"
                            onPress={() => onClick(item)}
                            disabled={item.checked} >
                            <IconSymbol name="pencil" color="black" size={16} />
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
                        <IconSymbol name="cart" size={45} color="gray" />
                        <Text className="text-2xl dark:text-white">Votre liste est vide</Text>
                        <Text className="text-lg dark:text-white mt-5">
                            Commencez à ajouter des éléments à votre liste
                        </Text>
                    </View>
            }
            onRefresh={onRefresh}
            onEndReached={() => {
                if (hasNextPage)
                    fetchNextPage();
            }}
            ListHeaderComponent={() => {
                if (isFetching)
                    return (
                        <View className="items-center">
                            <ActivityIndicator />
                        </View>);

                if (goods?.length > 0)
                    return
            }
            }
        />
    )
}