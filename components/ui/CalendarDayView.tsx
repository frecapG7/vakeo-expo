import { ReactElement } from "react";
import { View } from "react-native";


export const CalendarDayView = ({ children }: { children: ReactElement }) => {

    return (
        <View className="bg-orange-100 dark:bg-neutral-200 rounded-xl">
            <View className="h-5 bg-red-600 dark:bg-gray-600" />
            {children}
        </View>
    )
}