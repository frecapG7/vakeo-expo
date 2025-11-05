import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import { View } from "react-native";


export const LinearProgress = ({ progress = 0, color = "bg-green-400" }: { progress: number, color?: String }) => {


    const { formatPercent } = useI18nNumbers();


    return (
        <View>
            
            <View className="w-full bg-gray-200 border rounded-lg p-1">
                <View
                    className={`h-5 bg-green-400 rounded-r-full`}
                    style={{ width: `${Math.min(progress, 1) * 100}%` }}>
                </View>
            </View>
        </View>
    )
}