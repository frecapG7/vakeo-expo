import { Event } from "@/types/models"
import { Control } from "react-hook-form"
import { Text, View } from "react-native"
import { FormText } from "../form/FormText"
import { FormTextArea } from "../form/FormTextArea"



export const EventInfoForm = ({ control }: { control: Control<Event> }) => {

    return (
        <View className="gap-10">
            <View>
                <Text className="font-bold text-sm ml-3 dark:text-white">
                    Nom*
                </Text>
                <FormText
                    control={control}
                    name="name"
                    placeholder="Nom de l'activité"
                    rules={{
                        required: true,
                        maxLength: 55
                    }} />

            </View>

            <View>
                <Text className="font-bold text-sm ml-3 dark:text-white">
                    Description
                </Text>
                <FormTextArea
                    control={control}
                    name="details"
                    placeholder="Entre la description de l'activité"
                    rules={{
                        maxLength: 500
                    }}
                />
            </View>



        </View>
    )
}