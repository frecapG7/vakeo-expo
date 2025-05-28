import { FormCheckbox } from "@/components/form/FormCheckbox"
import { FormText } from "@/components/form/FormText"
import { useFieldArray } from "react-hook-form"
import { Text, View } from "react-native"

export const ActivityForm = ({ control, }: {
    control: any,
}) => {


    const { fields } = useFieldArray({
        control,
        name: "users",
        keyName: "id", // This is important to uniquely identify each user
        // de: trip?.users.map(user => ({ id: user.id, name: user.name, value: true })) || []
    })


    return (

        <View className="flex flex-col gap-2 px-10">

            <FormText control={control} name="name" label="Titre" rules={{
                required: true
            }} />


            <Text className="font-bold ml-2">Participants</Text>
            <View className="flex flex-col divide-y divide-white rounded-lg bg-gray-400">
                {fields.map((user, index) => (
                    <View key={user.id} className="flex flex-row items-center justify-between p-2">
                        <Text>{user.name}</Text>
                        <FormCheckbox control={control} name={`users[${index}.value]`} defaultValue={true} />
                    </View>
                ))}

            </View>

        </View>
    )
}