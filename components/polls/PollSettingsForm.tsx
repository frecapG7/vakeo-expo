import { useController } from "react-hook-form";
import { Text, View } from "react-native";
import { Switch } from "../ui/Switch";






export const PollSettingsForm = ({ control }: { control: any }) => {



    const { field: { value: singleAnswer, onChange: setSingleAnswer } } = useController({
        control,
        name: "singleAnswer",
    });

    const { field: { value: anonymous, onChange: setAnonymous } } = useController({
        control,
        name: "anonymous",
    });

    return (
        <View>
            <View className="flex-1 gap-4 my-2">
                <Text className="text-lg text-gray-600 dark:text-gray-200">Réglages</Text>
                <View
                    className={`flex-row items-center rounded-lg justify-between border border-2 p-5 ${singleAnswer ? "border-blue-400 dark:border-blue-600" : "border-gray-200 dark:border-gray-600"}`}>
                    <View>
                        <Text className="font-bold dark:text-white">
                            Réponse unique
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-200 text-xs italic">
                            Seule réponse à la fois sera possible
                        </Text>
                    </View>
                    <Switch value={singleAnswer} onSwitch={setSingleAnswer} />
                </View>

                <View
                    className={`flex-row items-center rounded-lg justify-between border border-2 p-5 ${anonymous ? "border-blue-400 dark:border-blue-600" : "border-gray-200 dark:border-gray-600"}`}>
                    <View>
                        <Text className="font-bold dark:text-white">
                            Votes anonyme
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-200 text-xs italic">
                            Seul les résultats du vote seront visible
                        </Text>
                    </View>
                    <Switch value={anonymous} onSwitch={setAnonymous} />
                </View>
            </View>

        </View>
    )
}