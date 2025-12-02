import { ActivityIndicator, Modal } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"



export const Backdrop = ({ visible }: { visible: boolean }) => {




    return (
        <Modal transparent
            visible={visible}
            animationType="none">
            <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="flex-1 justify-center items-center opacity-25 bg-gray-200">
                <ActivityIndicator size="large" />
            </Animated.View>
        </Modal>
    )
}