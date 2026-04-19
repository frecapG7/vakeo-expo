import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useGetTrip } from "@/hooks/api/useTrips";
import { containsUser } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import AnimatedCheckbox from "react-native-checkbox-reanimated";




export default function NewEventUsers() {

    const { id } = useLocalSearchParams();
    const { control } = useFormContext();

    const { data: trip } = useGetTrip(id);

    const { fields: attendees, remove, append } = useFieldArray({
        control,
        name: "attendees",
        keyName: "customId", // This is important to uniquely identify each user
        // de: trip?.users.map(user => ({ id: user.id, name: user.name, value: true })) || []
    })

    return (
        <View>
            <View className="m-5 gap-2">
                <Text className="font-bold text-2xl dark:text-white">
                    Ajoute des participants
                </Text>
                <Text className="text-gray-400">
                    Ajoute tout de suite tes amis qui participeront à l'activité. Tu n'es pas obligé de faire ça dès maintenant, tes amis
                    pourront également choisir de participer à ton activité.
                </Text>
            </View>

            <View className="flex m-5 gap-2">
                <View className="flex flex-row justify-end " >
                    <Button
                        onPress={() => trip?.users.filter(user => !containsUser(user, attendees)).forEach((u) => append(u))}>
                        <Text className="underline text-blue-400 font-bold">Sélectionner tous</Text>
                    </Button>
                </View>
                <View className="flex gap-2 bg-white dark:bg-gray-200 rounded-xl py-2">
                    {trip?.users?.map((user, index) => {
                        const checked = containsUser(user, attendees);
                        return (
                            <Pressable key={user._id}
                                className="flex flex-row items-center justify-between px-5 py-2 active:opacity-50"
                                onPressOut={() => checked ? remove(attendees?.map(u => u._id)?.indexOf(user._id)) : append(user)}>
                                <View className="flex-row gap-1 items-center">
                                    <Avatar src={user.avatar}
                                        alt={user.name.charAt(0)}
                                        size2="sm" />
                                    <Text className="text-lg font-bold">{user.name}</Text>
                                </View>

                                <View className="w-10 h-10">
                                    <AnimatedCheckbox
                                        checked={checked}
                                        highlightColor="#4444ff"
                                        checkmarkColor="#483AA0"
                                        boxOutlineColor="#4444ff"
                                    />
                                </View>
                            </Pressable>
                        );
                    }
                    )}
                </View>
            </View>
        </View>
    )
}