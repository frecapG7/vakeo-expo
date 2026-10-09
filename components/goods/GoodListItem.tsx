import { View } from "react-native";
import { Skeleton } from "../ui/Skeleton";


export const GoodListItemSkeleton = ({ }) => {

    return (
        <View className="gap-1">
            <View className="w-40">
                <Skeleton variant="rectangular" />
            </View>
            <View className="flex-row ml-10 justify-between items-end border-b-2 border-mist dark:border-white/10 pb-1">
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
