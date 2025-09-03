import { FormText } from "@/components/form/FormText"
import { Button } from "@/components/ui/Button"
import { useFieldArray } from "react-hook-form"
import { Pressable, Text, View } from "react-native"
import AnimatedCheckbox from "react-native-checkbox-reanimated"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

export const ActivityForm = ({ control, }: {
    control: any,
}) => {


    const { fields, update } = useFieldArray({
        control,
        name: "users",
        keyName: "customId", // This is important to uniquely identify each user
        // de: trip?.users.map(user => ({ id: user.id, name: user.name, value: true })) || []
    })




    return (

        <View className="flex flex-col gap-2">
            <FormText control={control} name="name" label="Titre" rules={{
                required: true
            }} />
            <View className="m-2 flex flex-row justify-between items-center">
                <Text className="font-bold ml-2 text-secondary">Participants</Text>
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                    {!fields?.every((f) => f.value) &&
                        <Button title="Sélectionner tous" onPress={() =>
                            fields.forEach((f, index) => update(index, {
                                ...f,
                                value: true
                            }))
                        }
                            className="" />
                    }
                </Animated.View>
            </View>
            <View className="flex flex-col divide-y divide-white rounded-lg bg-gray-400">
                {fields.map((user, index) => (
                    <View key={user.id} className="flex flex-row items-center justify-between p-2">
                        <Text>{user.name}</Text>
                        <Pressable onPress={() => update(index, {
                            ...user,
                            value: !user.value
                        })} className="w-7">
                            <AnimatedCheckbox checked={user.value}
                                highlightColor="#4444ff"
                                checkmarkColor="#483AA0"
                                boxOutlineColor="#4444ff"
                            />
                        </Pressable>                    </View>
                ))}

            </View>
        </View>
    )
}