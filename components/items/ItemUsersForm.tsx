import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { FormText } from "../form/FormText";


interface User {
    name: string;
}

interface FormValues {
    users: User[];
}

export const ItemUsersForm = ({ control }: {
    control: Control<FormValues>
}) => {

    const { fields: users, append, remove } = useFieldArray({
        control,
        name: "users",
    })

    const [me, setMe] = useState(users[0]?.id);

    return (
        <View className="flex flex-col gap-0 bg-gray-200 rounded-lg divider-solid divider-white">
            {users.map((user, index) => (
                <Animated.View key={user.id} className="border-b border-white" entering={FadeInUp} exiting={FadeOutDown}>
                    <FormText
                        control={control}
                        name={`users.${index}.name`}
                        rules={{ required: true }}
                        endAdornment={
                            <TouchableOpacity
                                onPress={() => me === user.id ? console.log("todo edit Me") : remove(index)}>
                                {me === user.id ? <Text className="font-bold bg-blue-600 p-1 text-white">Moi</Text> : <IconSymbol name="xmark.circle" size={24} color="black" />}
                            </TouchableOpacity>
                        }
                    />
                </Animated.View>
            ))}

            <Text className="text-md font-bold text-blue-500 p-2" onPress={() => {
                append({ name: "" });
            }}>
                Ajouter un participant
            </Text>
        </View>
    )
}