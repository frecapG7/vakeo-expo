import { useController } from "react-hook-form";
import { Text, View } from "react-native";
import { Switch } from "../ui/Switch";






export const PollSettingsForm = ({ control }: { control: any }) => {



    const { field: { value: isSingleAnswer, onChange: setIsSingleAnswer } } = useController({
        control,
        name: "isSingleAnswer",
    });

    const { field: { value: isAnonymous, onChange: setIsAnonymous } } = useController({
        control,
        name: "isAnonymous",
    });

    return (
        <View>
            <View className="flex-1 gap-4 my-2">
                <View
                    className={`flex-row items-center rounded-lg justify-between border border-2 p-5 ${isSingleAnswer ? "border-blue-400 dark:border-blue-600" : "border-gray-200 dark:border-gray-600"}`}>
                    <View>
                        <Text className="font-bold dark:text-white">
                            Réponse unique
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-200 text-xs italic">
                            Seule réponse à la fois sera possible
                        </Text>
                    </View>
                    <Switch value={isSingleAnswer} onSwitch={setIsSingleAnswer} />
                </View>

                <View
                    className={`flex-row items-center rounded-lg justify-between border border-2 p-5 ${isAnonymous ? "border-blue-400 dark:border-blue-600" : "border-gray-200 dark:border-gray-600"}`}>
                    <View>
                        <Text className="font-bold dark:text-white">
                            Votes anonyme
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-200 text-xs italic">
                            Seul les résultats du vote seront visible
                        </Text>
                    </View>
                    <Switch value={isAnonymous} onSwitch={setIsAnonymous} />
                </View>
            </View>

        </View>
    )
}