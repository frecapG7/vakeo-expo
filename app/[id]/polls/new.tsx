import { FormText } from "@/components/form/FormText";
import { DatesPollOptionsForm } from "@/components/polls/DatesPollOptionsForm";
import { HousingOptionsForm } from "@/components/polls/HousingOptionsForm";
import { PollSettingsForm } from "@/components/polls/PollSettingsForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostPoll } from "@/hooks/api/usePolls";
import { Poll } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useContext, useEffect } from "react";

import { useController, useFieldArray, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const placeholder = (type: string): string => {
    if (type = "DatesPoll")
        return "On part quand?";
    else if (type = "HousingPoll")
        return "On loge ou?";
    else
        return "On part ou?"
}


export default function NewPoll() {

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            question: "",
            type: "",
            singleAnswer: false,
            anonymous: false,
            options: []
        }
    });

    const { field: { value: type, onChange: setType } } = useController({
        control,
        name: "type",
        rules: {
            required: true
        }
    });

    const { fields: options, append, update, remove } = useFieldArray({
        control,
        name: "options",
        rules: {
            minLength: 1
        },
        keyName: "key",
    })

    const { id, type: typeParam , stop} = useLocalSearchParams<{ id: string , type: string, stop ?: string}>();
    const { me } = useContext(TripContext);
    const postPoll = usePostPoll(id, me?._id);
    const router = useRouter();

    const onSubmit = async (data: Omit<Poll, '_id'>) => {
        const result = await postPoll.mutateAsync({
            ...data,
            ...(stop && {stop})
        });
        router.dismissTo({
            pathname: "/[id]/polls/[pollId]",
            params: {
                id,
                pollId: result._id

            }
        });
    }
    // useEffect(() => {
    //     if (type === "DatesPoll")
    //         setValue("question", "Quelles dates ?");
    //     else if (type === "HousingPoll")
    //         setValue("question", "Quels hébergement ? ");
    //     else {
    //         setValue("question", "Qu'est ce qu'on mange ? ")

    //     }
    // }, [type,]);

    useEffect(() => {
        if (typeParam)
            setValue("type", String(typeParam));
    }, [typeParam, setValue]);

    useEffect(() => {
        if (type === "OtherPoll" && options.length === 0) {
            append({ value: "" });
        }
    }, [type, options.length, append]);

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

                <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Question *
                    </Text>
                    <FormText
                        control={control}
                        name="question"
                        rules={{
                            required: true,
                            maxLength: 255
                        }}
                        placeholder={placeholder(type)}
                    />
                </View>
                {type === "HousingPoll" &&
                    <View className="flex-1 my-2">
                        <HousingOptionsForm control={control} />
                    </View>
                }
                {type === "DatesPoll" &&
                    <View className="flex-1 my-2">
                        <DatesPollOptionsForm control={control} />
                    </View>
                }
                {type === "OtherPoll" &&
                    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                            Options
                        </Text>
                        <View className="gap-3">
                            {options?.map((option, index) => (
                                <Animated.View
                                    entering={SlideInUp}
                                    exiting={SlideOutDown}
                                    key={option.key}
                                    className="flex-row items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                                >
                                    <View className="flex-1">
                                        <FormText
                                            control={control}
                                            name={`options[${index}].value`}
                                            placeholder={`Option ${index + 1}`}
                                            rules={{ required: true }}
                                        />
                                    </View>
                                    <Pressable
                                        onPress={() => remove(index)}
                                        className="p-2 rounded-full hover:bg-red-50"
                                    >
                                        <IconSymbol name="trash" color="#ef4444" size={20} />
                                    </Pressable>
                                </Animated.View>
                            ))}

                            <Button
                                onPress={() => append({ value: "" })}
                                className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg justify-start"
                            >
                                <IconSymbol name="plus.circle.fill" color="#3b82f6" size={20} />
                                <Text className="text-blue-600 dark:text-blue-400 font-medium ml-2">
                                    Ajouter une option
                                </Text>
                            </Button>
                        </View>
                    </View>
                }

                <View className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Paramètres
                    </Text>
                    <PollSettingsForm control={control} />
                </View>

                <View className="my-4">
                    <Button
                        variant="contained"
                        icon="tray"
                        title="Démarrer le sondage"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={postPoll?.isPending} />
                </View>

            </Animated.ScrollView>
        </SafeAreaView >
    )
}