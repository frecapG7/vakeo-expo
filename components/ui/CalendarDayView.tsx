import { ReactElement } from "react";
import { View } from "react-native";


export const CalendarDayView = ({ children }: { children: ReactElement }) => {

    return (
        <View className="bg-orange-100 dark:bg-neutral-200 rounded-xl max-w-sm">
            <View className="bg-red-600 dark:bg-gray-600 rounded-t-lg flex justify-around h-10 items-center flex-row">
                <View className="bg-white w-4 h-4 rounded-full">
                    <View className="absolute w-2 h-7 bg-gray-400 left-1 right-1 bottom-2 rounded-full " />    
                </View>
                <View className="bg-white w-4 h-4 rounded-full">
                    <View className="absolute w-2 h-7 bg-gray-400 left-1 right-1 bottom-2 rounded-full " />    
                </View>
            </View>
            {children}
        </View>
    )
}