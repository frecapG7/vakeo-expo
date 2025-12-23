import { View } from "react-native";


export const LinearProgress = ({ progress = 0, color = "bg-green-400" }: { progress: number, color?: String }) => {



    const percent = Math.min(progress, 1) * 100;
    return (
        <View>
            <View className="w-full bg-gray-200 dark:bg-gray-400 rounded-lg ">
                <View
                    className={`h-5 bg-green-400 dark:bg-blue-800 rounded-lg rounded-r-full`}
                    style={{ width: `${percent}%` }}>
                </View>
            </View>
        </View>
    )
}