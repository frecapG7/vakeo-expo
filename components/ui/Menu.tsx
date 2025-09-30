import { Text } from "react-native"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"





export const Menu = ({ open = false, anchorEl, children }: { open: boolean, anchorEl?: any, children: React.ReactNode }) => {


    if (open)
        return (
            <Animated.View
                entering={ZoomIn}
                exiting={ZoomOut}
                style={{ position: 'absolute' , top: 10, zIndex: 999}}
                className="bg-gray-200 p-1 rounded-lg">
                {children}
                <Text className="text-dark">{JSON.stringify(anchorEl)}</Text>
            </Animated.View>
        )
}