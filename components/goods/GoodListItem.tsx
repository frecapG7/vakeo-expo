
import { Good } from "@/types/models";
import { Pressable, Text, View } from "react-native";
import { Checkbox } from "../ui/Checkbox";
import { Skeleton } from "../ui/Skeleton";



export const GoodListItemSkeleton = ({ }) => {

    return (
        <View className="gap-1">
            <View className="w-40">
                <Skeleton variant="rectangular" />
            </View>
            <View className="flex-row ml-10 justify-between items-end border-b-2 border-blue-400 pb-1">
                <View className="w-7">
                    <Skeleton height={7} />
                </View>
                <View className="w-20">
                    <Skeleton height={5} />
                </View>
            </View>
        </View>
    )
}

export const GoodListItem = (
    { good, onCheck, disabled = false, hideName = false }:
        { good: Good, onCheck?: (good: Good) => void, disabled?: boolean, hideName?: boolean }) => {
    return (
        <View className="">
            <Text className="dark:text-white capitalize text-xl">{good.name}</Text>
            <View className="flex flex-row justify-between items-end gap-5 ml-10 my-2 pb-1 border-b-2 border-blue-400">
                <View className="flex-row items-center gap-2">
                    <Pressable className="w-7 h-7" onPress={() => onCheck?.(good)} disabled={disabled}>
                        <Checkbox checked={good.checked} />
                    </Pressable>
                </View>
                <Text className={`text-white text-lg font-bold ${good.checked ? "line-through opacity-75" : ""}`}>
                    X {good?.quantity}
                </Text>
            </View>
        </View>
    )

}