import useColors from "@/hooks/styles/useColors"
import { Event } from "@/types/models"
import { Control, useWatch } from "react-hook-form"
import { Text, View } from "react-native"
import { FormDateTimePickerV2 } from "../form/FormDateTimePickerV2"
import { FormText } from "../form/FormText"
import { FormTextArea } from "../form/FormTextArea"



export const EventInfoForm = ({ control }: { control: Control<Event> }) => {

    const { text } = useColors();


    const startDate = useWatch({
        control,
        name: "startDate"
    });

    return (
        <View className="gap-5">
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

            <View className="">
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


            <View>
                <Text className="ml-3 font-bold dark:text-white text-sm">
                    Le jour et l'heure
                </Text>

                <View className="bg-white dark:bg-gray-600 border border border-gray-400 dark:border-gray-200 focus:border-blue-500 rounded-xl p-2 py-4 gap-4">
                    <FormDateTimePickerV2
                        control={control}
                        rules={{
                            required: false
                        }}
                    />
                </View>
            </View>


        </View>
    )
}