import { View } from "react-native";


export const LinearProgress = ({ progress = 0, color = "bg-green-400" , disabled = false}: { progress: number, color?: String, disabled ?: boolean }) => {



    const percent = Math.min(progress, 1) * 100;
    return (
        <View>
            <View className="w-full bg-gray-200 dark:bg-gray-400 rounded-lg ">
                <View
                    className={`h-5 ${disabled ? "bg-gray-400" : "bg-blue-400 dark:bg-blue-800"} rounded-lg rounded-full`}
                    style={{ width: `${percent}%` }}>
                </View>
            </View>
        </View>
    )
}