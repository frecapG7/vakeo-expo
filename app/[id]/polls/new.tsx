import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Switch } from "@/components/ui/Switch";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostPoll } from "@/hooks/api/usePolls";
import { Poll } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useContext, useEffect } from "react";

import { useController, useFieldArray, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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


    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            question: "",
            type: "",
            singleAnswer: false,
            anonymous: false,
            options: [{
                value: "",
            }, {
                value: ""
            }]
        }
    });

    const { field: { value: type, onChange: setType } } = useController({
        control,
        name: "type",
        rules: {
            required: true
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


    const {id} = useLocalSearchParams();
    const {me} = useContext(TripContext);
    const postPoll = usePostPoll(id);
    const router = useRouter();

    const onSubmit = async (data: Omit<Poll, '_id'>) => {
        postPoll.mutateAsync({
            ...data,
            createdBy: me
        });
        router.dismissTo({
            pathname: "/[id]/polls",
            params: {
                id: String(id)
            }
        });
    }


    useEffect(() => {
        if (type === "DatesPoll")
            setValue("question", "Quelles dates ?");
        else if (type === "HousingPoll")
            setValue("question", "Quelles hébergement ? ");
        else
            setValue("question", "Qu'est ce qu'on mange ? ")
    }, [type,]);

    if (!type)
        return (
            <View style={styles.container}>
                <Text>Quel type de sondage veux tu organiser ? </Text>


                <View className="flex-row flex-wrap gap-5 m-5">
                    <Button className="flex bg-orange-200 rounded-xl w-[40%] gap-2 border-blue-50 shadow p-2"
                        onPress={() => setType("DatesPoll")}>
                        <IconSymbol name="calendar" color="black" size={34} />
                        <Text className="capitalize text-lg font-bold"> des Dates</Text>
                    </Button>
                    <Button className="flex bg-orange-200 rounded-xl w-[40%] gap-2 border-blue-50 shadow p-2"
                        onPress={() => setType("HousingPoll")}>
                        <IconSymbol name="house.fill" color="black" size={34} />
                        <Text className="capitalize text-lg font-bold"> des hébergements</Text>
                    </Button>
                    <Button className="flex bg-orange-200 rounded-xl w-[40%] gap-2 border-blue-50 shadow p-2"
                        onPress={() => setType("OtherPoll")}>
                        <IconSymbol name="chart.bar.fill" color="black" size={34} />
                        <Text className="capitalize text-lg font-bold"> autre chose</Text>
                    </Button>

                </View>

            </View>


        )



    return (

        <SafeAreaView style={{ flex: 1 }}>

            <Animated.ScrollView style={styles.container}>
                <Pressable className="flex-row bg-green-200 py-5" onPress={() => setType("")}>
                    <IconSymbol name="checkmark.circle.fill" color="green" />
                    <Text>Sondages de dates</Text>
                </Pressable>




                <View className="flex-1 border-b border-gray-200 my-2">
                    <Text className="text-lg text-gray-600 dark:text-gray-200">Posez une question*</Text>
                    <FormText control={control}
                        name="question"
                        placeholder="Quelles date?"
                    />

                    <View className="gap-2 my-2">
                        <Text className="text-lg text-gray-600 dark:text-gray-200">Options</Text>
                        <View className="gap-2 mx-2">
                            {options?.map((option, index) => (
                                <View key={option.key}>

                                    <ListItem control={control}
                                        item={option}
                                        index={index}
                                        onRemove={() => remove(index)} />
                                </View>
                            ))}



                        </View>

                        <Pressable
                            onPress={() => append({
                                value: "",
                            })}
                            className="my-3 flex-row items-center justify-center rounded-full bg-blue-200  p-2">
                            <IconSymbol name="plus" color="black" />
                            <Text>Ajouter une option</Text>
                        </Pressable>

                    </View>
                </View>


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
                <Button className="bg-blue-400 items-center rounded-full p-4 my-5"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={postPoll?.isPending}>
                    <Text className="text-white font-bold text-xl">Créér</Text>
                </Button>

            </Animated.ScrollView>
        </SafeAreaView>
    )
}