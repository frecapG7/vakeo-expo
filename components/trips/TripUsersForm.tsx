import useColors from "@/hooks/styles/useColors";
import { Trip } from "@/types/models";
import { useState } from "react";
import { Control, useController, useFieldArray } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown, SlideInRight, SlideOutRight } from "react-native-reanimated";
import { FormText } from "../form/FormText";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { IconSymbol } from "../ui/IconSymbol";

const MAX_USERS_LENGTH = 20;

export const TripUsersForm = ({ control }: { control: Control<Trip> }) => {


    const { fields: users, append, remove } = useFieldArray({
        control,
        name: "users",
        keyName: "key",
        rules: {
            minLength: 1,
            maxLength: MAX_USERS_LENGTH
        }
    });

    const [me, setMe] = useState(0)

    const { field: { value: isPrivate, onChange: setIsPrivate } } = useController({
        control,
        name: "isPrivate"
    });

    const { text } = useColors();

    return (
        <View className="gap-4">
            <View className="flex gap-5">
                <Button className={`flex-row items-center justify-evenly rounded-xl py-2 ${!isPrivate && "border border-blue-400"}`}
                    onPress={() => setIsPrivate(false)}>
                    <IconSymbol name={!isPrivate ? "number.circle.fill" : "number.circle"} size={24} color={text} />
                    <View className="max-w-[60%]">
                        <Text className="text-xl font-bold dark:text-white">
                            Public
                        </Text>
                        <Text numberOfLines={5} className="text-xs dark:text-gray-400">
                            Tes amis à qui tu partagera le lien pourront ajouter leur utilisateur au projet
                        </Text>
                    </View>
                    <View className="w-7 h-7">
                        <Checkbox checked={!isPrivate} />
                    </View>
                </Button>
                <Button
                    onPress={() => setIsPrivate(true)}
                    className={`flex-row items-center justify-evenly rounded-xl py-2 ${isPrivate && "border border-blue-400"}`}>
                    <IconSymbol name={isPrivate ? "lock.fill" : "lock"} size={24} color={text} />
                    <View className="max-w-[60%]">
                        <Text className="font-bold text-xl dark:text-white">
                            Privé
                        </Text>
                        <Text numberOfLines={5} className="text-xs dark:text-gray-400">
                            Tes amis à qui tu partagera le lien pourront ajouter leur utilisateur au projet
                        </Text>
                    </View>
                    <View className="w-7 h-7">
                        <Checkbox checked={!!isPrivate} />
                    </View>
                </Button>
            </View>

            <View className="border-t mx-5 py-2 dark:border-gray-400">
                <Text className="text-sm font-bold dark:text-white">
                    Ajoute tes amis
                </Text>
                <View className="gap-2 p-1 rounded-t-lg">
                    {users?.map((item, index) => (
                        <Animated.View key={item.key}
                            entering={SlideInRight}
                            exiting={SlideOutRight}
                        >
                            <FormText
                                key={item.key}
                                control={control}
                                name={`users.${index}.name`}
                                rules={{
                                    required: true,
                                    maxLength: 25
                                }}
                                endAdornment={
                                    <Pressable
                                        className="mx-2"
                                        onPress={() => me !== index && remove(index)}>
                                        {me === index ?
                                            <Text className="font-bold bg-blue-600 p-1 text-white">Moi</Text> :
                                            !item._id && <IconSymbol name="xmark.circle" size={24} color="black" />}
                                    </Pressable>}
                            />
                        </Animated.View>
                    ))}
                    {users?.length < MAX_USERS_LENGTH &&
                        <Animated.View entering={FadeInDown}
                            exiting={FadeOutDown}
                            >
                            <Pressable className="rounded-b-lg"
                                onPress={() => {
                                    append({ name: "" });
                                }}>
                                <Text className="text-md font-bold text-blue-500 p-2">
                                    Ajouter un participant
                                </Text>
                            </Pressable>
                        </Animated.View>
                    }
                </View>
            </View>
        </View>
    )
}