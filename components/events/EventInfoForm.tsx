import { useTrip } from "@/context/TripContext"
import { Event } from "@/types/models"
import { Control } from "react-hook-form"
import { Text, View } from "react-native"
import { FormDateTimePickerV2 } from "../form/FormDateTimePickerV2"
import { FormText } from "../form/FormText"
import { FormTextArea } from "../form/FormTextArea"

export const EventInfoForm = ({ control }: { control: Control<Event> }) => {

    // Le voyage vient du contexte (encodedId v3), pas d'un fetch dédié.
    const { trip } = useTrip();

    return (
        <View className="gap-5">
            <View>
                <Text className="font-bold text-sm ml-3 text-night dark:text-white">
                    Nom*
                </Text>
                <FormText
                    control={control}
                    name="name"
                    placeholder="Nom de l&apos;activité"
                    rules={{
                        required: true,
                        maxLength: 55
                    }} />
            </View>

            <View className="">
                <Text className="font-bold text-sm ml-3 text-night dark:text-white">
                    Description
                </Text>
                <FormTextArea
                    control={control}
                    name="details"
                    placeholder="Entre la description de l&apos;activité"
                    rules={{
                        maxLength: 500
                    }}
                />
            </View>


            <View>
                <Text className="ml-3 font-bold text-night dark:text-white text-sm">
                    Le jour et l&apos;heure
                </Text>

                <View className="bg-white dark:bg-night rounded-2xl p-2 py-4 gap-4 border border-mist dark:border-white/10">
                    <FormDateTimePickerV2
                        control={control}
                        rules={{
                            required: false
                        }}
                        initialDate={trip?.startDate}
                    />
                </View>
            </View>
        </View>
    )
}
