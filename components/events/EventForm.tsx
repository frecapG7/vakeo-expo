import { FormText } from "@/components/form/FormText"
import { Button } from "@/components/ui/Button"
import { useState } from "react"
import { useFieldArray } from "react-hook-form"
import { Text, View } from "react-native"
import AnimatedCheckbox from "react-native-checkbox-reanimated"
import Animated from "react-native-reanimated"
import { PickUsersModal } from "../modals/PickUsersModal"
import { Avatar } from "../ui/Avatar"
import { IconSymbol } from "../ui/IconSymbol"

export const EventForm = ({ control, }: {
    control: any,
}) => {

    const { fields: owners, remove, append } = useFieldArray({
        control,
        name: "owners",
        keyName: "customId", // This is important to uniquely identify each user
        // de: trip?.users.map(user => ({ id: user.id, name: user.name, value: true })) || []
    })
    const { fields: attendees, update } = useFieldArray({
        control,
        name: "attendees",
        keyName: "customId", // This is important to uniquely identify each user
        // de: trip?.users.map(user => ({ id: user.id, name: user.name, value: true })) || []
    })


    const [editOwners, setEditOwners] = useState(false);

    return (
        <Animated.ScrollView style={{ flex: 1 }} className="flex flex-grow">
            <View className="flex ">
                <Text className="text-lg font-bold  italic ml-5 dark:text-white">
                    Nom
                </Text>
                <FormText control={control} name="name" rules={{ required: true }} />
            </View>



            <View className="flex-1 mt-5 gap-2">
                <View className="flex flex-row justify-between" >
                    <Text className="text-lg font-bold  italic ml-5 dark:text-white">
                        Responsables
                    </Text>

                </View>
                <View className="flex gap-5 bg-gray-400 rounded-lg py-2 ">
                    {owners?.map((owner, index) => (
                        <View key={owner._id} className="flex flex-row items-center justify-between px-5" onPress={() => updateOwner(index, {
                            ...owner,
                        })}>
                            <View className="flex-row gap-2 items-center">
                                <Avatar src={owner.avatar} alt={owner.name.charAt(0)} size2="sm" />
                                <Text className="text-lg font-bold">{owner.name}</Text>
                            </View>
                            <Button onPress={() => remove(index)} className="bg-gray-700 rounded-full p-2">
                                <IconSymbol name="trash" color="white" />
                            </Button>
                        </View>
                    ))}
                    <Button className="p-2" onPress={() => setEditOwners(true)}>
                        <Text className="font-bold text-xl text-blue-500">Ajouter un responsable</Text>
                    </Button>

                </View>
            </View>

            <View className="flex-1 mt-5 gap-2">
                <View className="flex flex-row justify-between" >
                    <Text className="text-lg font-bold  italic ml-5 dark:text-white">
                        Participants
                    </Text>
                    <Button
                        onPress={() => attendees.forEach((f, index) => update(index, {
                            ...f,
                            checked: true
                        }))}>
                        <Text className="p-2 underline text-blue-400 font-bold">Sélectionner tous</Text>
                    </Button>
                </View>
                <View className="flex gap-5 bg-gray-400 rounded-lg py-2">
                    {attendees?.map((attendee, index) => (
                        <Button key={attendee._id} className="flex flex-row items-center justify-between px-5" onPress={() => update(index, {
                            ...attendee,
                            checked: !attendee.checked
                        })}>
                            <View className="flex-row gap-1 items-center">
                                <Avatar src={attendee.avatar} alt={attendee.name.charAt(0)} size2="sm" />
                                <Text className="text-lg font-bold">{attendee.name}</Text>
                            </View>

                            <View className="w-10 h-10">
                                <AnimatedCheckbox checked={attendee.checked}
                                    highlightColor="#4444ff"
                                    checkmarkColor="#483AA0"
                                    boxOutlineColor="#4444ff"
                                />
                            </View>
                        </Button>
                    ))}

                </View>
            </View>


            <PickUsersModal open={editOwners}
                onClose={() => setEditOwners(false)}
                users={attendees?.map((u) => ({
                    ...u,
                    checked: owners.map(u => u._id).includes(u._id)
                })) || []}
                onClick={(user, index) => {
                    if (user.checked)
                        remove(index);
                    else
                        append(user);
                }} />

        </Animated.ScrollView>
    )
}