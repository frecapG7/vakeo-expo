import { Modal, View } from "react-native"

export const Backdrop = ({ visible, children }: { visible: boolean, children: React.ReactNode }) => {

    return (
        <Modal transparent
            visible={visible}
            animationType="none">
            <View className="flex-1 opacity-25">
                {children}
            </View>
        </Modal>
    )
}