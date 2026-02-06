import { FormText } from "@/components/form/FormText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Switch } from "@/components/ui/Switch";
import styles from "@/constants/Styles";
import { useController, useFieldArray, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";


export default function NewPoll() {



    const { control, handleSubmit } = useForm({
        defaultValues: {
            allowMultipleAnswers: false,
            anonymous: false,
            options: [
                {
                    value: "",
                    voters: []
                },
                {
                    value: "",
                    voters: []
                }
            ]
        }
    });



    const { field: { value: allowMultipleAnswers, onChange: setAllowMultipleAnswers } } = useController({
        control,
        name: "allowMultipleAnswers",
    });

    const { field: { value: anonymous, onChange: setAnonymous } } = useController({
        control,
        name: "anonymous",
    });

    const { fields: options, append, update, remove } = useFieldArray({
        control,
        name: "options",
        rules: {
            minLength: 1
        },
        keyName: "key"
    })

    const onSubmit = async (data) => {
        console.log(JSON.stringify(data));
    }

    return (
        <Animated.ScrollView style={styles.container}>


            <View className="flex-1 border-b border-gray-200 my-2">
                <Text className="text-lg text-gray-600">Posez une question*</Text>
                <FormText control={control}
                    name="title"
                    placeholder="Quelles date?"
                />

                <View className="gap-2 my-2">
                    <Text className="text-lg text-gray-600">Options</Text>
                    <View className="gap-2 mx-2">
                        {options?.map((option, index) => (
                            <View className="flex-row items-center" key={index}>
                                <IconSymbol name="line.horizontal.3" color="gray"/>
                                <FormText control={control}
                                    name={`options[${index}].value`}
                                    rules={{
                                        required: true
                                    }}
                                />
                                <Pressable onPress={() => remove(index)}>
                                    <IconSymbol name="xmark" color="gray" />
                                </Pressable>
                            </View>
                        ))}



                    </View>

                    <Pressable
                        onPress={() => append({
                            value: "",
                            voters: []
                        })}
                        className="my-3 flex-row items-center justify-center rounded-full bg-gray-200 p-2">
                        <IconSymbol name="plus" color="black" />
                        <Text>Ajouter une options</Text>
                    </Pressable>

                </View>
            </View>





            <View className="flex-1 gap-2">
                <Text>Réglages</Text>

                <View
                    className={`flex-row items-center rounded-lg mx-5 justify-between border border-2 p-2 px-5 ${allowMultipleAnswers ? "border-blue-200" : "border-gray-200"}`}>
                    <Text className="font-bold">
                        Autoriser plusieurs réponses
                    </Text>
                    <Switch value={allowMultipleAnswers} onSwitch={setAllowMultipleAnswers} />
                </View>

                <View
                    className={`flex-row items-center rounded-lg mx-5 justify-between border border-2 p-2 px-5 ${allowMultipleAnswers ? "border-blue-200" : "border-gray-200"}`}>
                    <View>
                        <Text className="font-bold">
                            Votes anonyme
                        </Text>
                        <Text className="text-gray-600 text-xs italic">
                            Seul les résultats du vote seront visible
                        </Text>
                    </View>
                    <Switch value={allowMultipleAnswers} onSwitch={setAllowMultipleAnswers} />
                </View>
            </View>


            <Pressable className="bg-blue-400 items-center rounded-full p-4 my-5"
                onPress={handleSubmit(onSubmit)}>
                <Text className="text-white font-bold text-xl">Créér</Text>
            </Pressable>

        </Animated.ScrollView>
    )
}