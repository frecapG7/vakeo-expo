import useColors from "@/hooks/styles/useColors";
import { Modal, Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../ui/Avatar";

const avatars = [
    "https://storage.googleapis.com/vakeo_dev/avatar/chat.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/chien.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/dauphin.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/fille_noir.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/garcon_noir.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/fille.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/garcon.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/papie.png",
    "https://storage.googleapis.com/vakeo_dev/avatar/famille.png",
];

export const PickAvatarModal = ({
    open,
    onClose,
    onClick,
}
    :
    {
        open: boolean,
        onClose: () => void,
        onClick: (avatar: string) => void,
    }) => {

    const colors = useColors();

    return (
        <Modal visible={open}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
            allowSwipeDismissal>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: colors.background
            }}>
                <View className="flex-1 py-10">

                    <Pressable onPress={onClose}>
                        <Text className="dark:text-white text-xl mb-5">Fermer</Text>
                    </Pressable>


                    <Animated.FlatList
                        data={avatars}
                        keyExtractor={(i) => i}
                        numColumns={4}
                        contentContainerClassName="items-between gap-2"
                        className="gap-2"

                        renderItem={({ item: avatar }) => (
                            <Pressable onPress={() => {
                                onClick(avatar);
                            }}>
                                <Avatar src={avatar} size2="lg" />
                            </Pressable>
                        )} />

                </View>

            </SafeAreaView>
        </Modal>
    );
}