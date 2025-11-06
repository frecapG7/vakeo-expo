import useColors from "@/hooks/styles/useColors"
import { Modal, Pressable, Text, View } from "react-native"
import AnimatedCheckbox from "react-native-checkbox-reanimated"
import Animated from "react-native-reanimated"
import { Avatar } from "../ui/Avatar"
import { Button } from "../ui/Button"
import { ThemeProvider } from "../ui/ThemeProvider"






export const PickUsersModal = ({
    open,
    onClose,
    users = [],
    onClick,
    disabled = false,
    hideCheckbox = false
}
    :
    {
        open: boolean,
        onClose: () => void,
        users: [],
        onClick?: (user: any, index: number) => void,
        disabled?: boolean,
        hideCheckbox?: boolean
    }) => {


    const colors = useColors();

    return (
        <Modal visible={open}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
            allowSwipeDismissal>
            <ThemeProvider>
                <View className="flex-1" style={{
                    backgroundColor: colors.background,
                    padding: 25
                }}>
                    <View className="my-5">
                        <Button onPress={onClose}>
                            <Text className="text-xl dark:text-white">Fermer</Text>
                        </Button>
                    </View>


                    <Animated.FlatList
                        data={users}
                        renderItem={({ item, index }) =>
                            <Pressable className="flex flex-row justify-between items-center p-2"
                                onPress={async () => await onClick(item, index)}
                                disabled={disabled}>
                                <View className="flex flex-row gap-2 items-center">
                                    <Avatar alt={item.name.charAt(0)} size2="md" src={item.avatar} />
                                    <Text className="text-lg ">{item.name}</Text>
                                </View>
                                {!hideCheckbox &&

                                    <View className="w-10 h-10">
                                        <AnimatedCheckbox checked={item.checked}
                                            highlightColor="#4444ff"
                                            checkmarkColor="#483AA0"
                                            boxOutlineColor="#4444ff"
                                        />
                                    </View>
                                }

                            </Pressable>
                        }
                        keyExtractor={(item) => item._id}
                        contentContainerClassName="mx-5 bg-orange-100 dark:bg-gray-100 rounded-lg"
                        ItemSeparatorComponent={() => <View className="h-0.5 bg-black dark:bg-white" />}
                    />

                </View>

            </ThemeProvider>
        </Modal>
    )
}