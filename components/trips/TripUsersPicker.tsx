import { Modal, Pressable, Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";
import { IconSymbol } from "../ui/IconSymbol";



const TripUsersPicker = ({ isVisible, onClose, onSelect, options = [], value }:
    {
        isVisible: boolean,
        onClose: () => void,
        onSelect: (user: any) => void,
        options?: any[],
        value?: any
    }) => {




    return (
        <View>
            <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={onClose}>
                <View>
                    <Text onPress={onClose} className="font-bold text-lg m-5">
                        Annuler
                    </Text>
                    <Text className="text-xl text-center font-bold mb-2">Sélectionne qui tu es</Text>

                    <View className="flex flex-col mx-10 bg-gray-400 rounded-lg divide-solid divide-white gap-1">
                        {options.map((option) => (
                            <Pressable key={option.id} className="flex flex-row justify-between items-center p-2" onPress={() => onSelect(option)}>
                                <View className="flex flex-row gap-2 items-center">
                                    <Avatar name={option.name} size={50} color="blue" />
                                    <Text className="text-lg ">{option.name}</Text>
                                </View>

                                {option.id === value?.id && <IconSymbol name="checkmark.circle.fill" size={35} color="blue" />}
                            </Pressable>
                        ))}
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default TripUsersPicker;