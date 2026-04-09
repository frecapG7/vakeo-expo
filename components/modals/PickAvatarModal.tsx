import useColors from "@/hooks/styles/useColors";
import { TripUser } from "@/types/models";
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
    selected = "",
    disabled = [],
    onClose,
    onClick,
}
    :
    {
        open: boolean,
        selected?: string,
        disabled?: TripUser[]
        onClose: () => void,
        onClick: (avatar: string) => void,
    }) => {

    const colors = useColors();


    const disabledAvatars = disabled?.map(user => user.avatar);

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
                        numColumns={3}
                        contentContainerClassName="items-center gap-2"
                        className="mx-4"

                        renderItem={({ item: avatar }) => (
                            <View>

                                <Pressable
                                    disabled={disabledAvatars?.includes(avatar)}
                                    className={`mx-2 ${avatar === selected ? "bg-blue-400 rounded-full p-1" : `${disabledAvatars?.includes(avatar) && "bg-gray-400 rounded-full opacity-50"}`} `}
                                    onPress={() => {
                                        onClick(avatar);
                                    }}>
                                    <Avatar src={avatar} size2="lg" />
                                </Pressable>
                                <Text className="dark:text-white text-xs text-center">
                                    {disabled?.filter(u => u.avatar === avatar)?.[0]?.name}
                                    {selected === avatar && "Moi"}
                                </Text>
                            </View>
                        )} />

                </View>

            </SafeAreaView>
        </Modal>
    );
}