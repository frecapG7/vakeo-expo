import { FormText } from "@/components/form/FormText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Switch } from "@/components/ui/Switch";
import styles from "@/constants/Styles";
import { useController, useFieldArray, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const SONG_HEIGHT = 40;

const ListItem = ({ control, item, index, onRemove }) => {

    const top = useSharedValue(index * SONG_HEIGHT);


    const animatedStyle = useAnimatedStyle(() => {
        return {
            top: top.value
        }
    });


    return (
        <Animated.View className="flex-row items-center" key={index}>
            <IconSymbol name="line.horizontal.3" color="gray" />
            <FormText control={control}
                name={`options[${index}].value`}
                rules={{
                    required: true
                }}
            />
            <Pressable onPress={onRemove}>
                <IconSymbol name="xmark" color="gray" />
            </Pressable>
        </Animated.View>
    )


}


export default function NewPoll() {


    const { control, handleSubmit } = useForm({
        defaultValues: {
            type: "",
            singleAnswer: false,
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



    const { field: { value: singleAnswer, onChange: setSingleAnswer } } = useController({
        control,
        name: "singleAnswer",
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
        keyName: "key",
    })

    const onSubmit = async (data) => {
        console.log(JSON.stringify(data));
    }



    return (
        <Animated.ScrollView style={styles.container}>


            <View className="flex-1 border-b border-gray-200 my-2">
                <Text className="text-lg text-gray-600 dark:text-gray-200">Posez une question*</Text>
                <FormText control={control}
                    name="title"
                    placeholder="Quelles date?"
                />

                <View className="gap-2 my-2">
                    <Text className="text-lg text-gray-600 dark:text-gray-200">Options</Text>
                    <View className="gap-2 mx-2">
                        {options?.map((option, index) => (
                            <ListItem control={control}
                                item={option}
                                index={index}
                                onRemove={() => remove(index)} />
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





            <View className="flex-1 gap-2 my-2">
                <Text className="text-lg text-gray-600 dark:text-gray-200">Réglages</Text>

                <View
                    className={`flex-row items-center rounded-lg justify-between border border-2 p-2 px-5 ${singleAnswer ? "border-blue-200 dark:border-blue-600" : "border-gray-200 dark:border-gray-600"}`}>
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
                    className={`flex-row items-center rounded-lg justify-between border border-2 p-2 px-5 ${anonymous ? "border-blue-200 dark:border-blue-600" : "border-gray-200 dark:border-gray-600"}`}>
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


            <Pressable className="bg-blue-400 items-center rounded-full p-4 my-5"
                onPress={handleSubmit(onSubmit)}>
                <Text className="text-white font-bold text-xl">Créér</Text>
            </Pressable>

        </Animated.ScrollView>
    )
}