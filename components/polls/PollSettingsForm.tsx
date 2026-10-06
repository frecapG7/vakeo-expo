import { useWatch } from "react-hook-form";
import { Text, View } from "react-native";
import { FormSwitch } from "../form/FormSwitch";




export const PollSettingsForm = ({ control }: { control: any }) => {

    const isSingleAnswer = useWatch({
        control,
        name: "isSingleAnswer"
    })

    const isAnonymous = useWatch({
        control,
        name: "isAnonymous"
    })

    return (
        <View>
            <View className="flex-1 gap-4 my-2">
                <View
                    className={`flex-row items-center rounded-lg justify-between border border-2 p-5 ${isSingleAnswer ? "border-amber-deep" : "border-mist dark:border-white/10"}`}>
                    <View>
                        <Text className="font-bold text-night dark:text-white">
                            Réponse unique
                        </Text>
                        <Text className="text-night/60 dark:text-white/60 text-xs italic">
                            Seule réponse à la fois sera possible
                        </Text>
                    </View>
                    <FormSwitch control={control}
                        name="isSingleAnswer"
                    />
                </View>

                <View
                    className={`flex-row items-center rounded-lg justify-between border border-2 p-5 ${isAnonymous ? "border-amber-deep" : "border-mist dark:border-white/10"}`}>
                    <View>
                        <Text className="font-bold text-night dark:text-white">
                            Votes anonyme
                        </Text>
                        <Text className="text-night/60 dark:text-white/60 text-xs italic">
                            Seul les résultats du vote seront visible
                        </Text>
                    </View>
                    <FormSwitch
                        control={control}
                        name="isAnonymous"
                    />
                </View>
            </View>

        </View>
    )
}
