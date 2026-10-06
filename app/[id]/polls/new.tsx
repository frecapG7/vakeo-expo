import { FormText } from "@/components/form/FormText";
import { DatesPollOptionsForm } from "@/components/polls/DatesPollOptionsForm";
import { HousingOptionsForm } from "@/components/polls/HousingOptionsForm";
import { OtherPollOptionsForm } from "@/components/polls/OtherPollOptionsForm";
import { PollSettingsForm } from "@/components/polls/PollSettingsForm";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useTrip } from "@/context/TripContext";
import { usePostPoll } from "@/hooks/api/usePolls";
import { Poll } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import { useEffect } from "react";

import { useController, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";


const placeholder = (type: string): string => {
    if (type === "DatesPoll")
        return "On part quand?";
    else if (type === "HousingPoll")
        return "On loge ou?";
    else
        return "On part ou?"
}


export default function NewPoll() {

    const { control, handleSubmit, setValue } = useForm({
        defaultValues: {
            question: "",
            type: "",
            isSingleAnswer: false,
            isAnonymous: false,
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


    const { type: typeParam, stop } = useLocalSearchParams<{ type: string, stop?: string }>();
    const { trip } = useTrip();
    const postPoll = usePostPoll(trip?._id);
    const router = useRouter();

    const onSubmit = async (data: Omit<Poll, '_id'>) => {
        const result = await postPoll.mutateAsync({
            ...data,
            ...(stop && { stop })
        });
        router.dismissTo({
            pathname: "/[id]/polls/[pollId]",
            params: {
                id: trip?._id,
                pollId: result._id

            }
        });
    }

    useEffect(() => {
        if (typeParam)
            setValue("type", String(typeParam));
    }, [typeParam, setValue]);

    if (!type)
        return (
            <View style={styles.container} className="flex-1 bg-mist dark:bg-ink">
                <Text className="text-night dark:text-white">Quel type de sondage veux tu organiser ? </Text>
                <View className="flex-row flex-wrap gap-5 m-5">
                    <Button className="flex bg-white dark:bg-night rounded-2xl w-[40%] gap-2 border border-mist dark:border-white/10 shadow p-2"
                        onPress={() => setType("DatesPoll")}>
                        <IconSymbol name="calendar" color="#EE8B33" size={34} />
                        <Text className="capitalize text-lg font-bold text-night dark:text-white"> des Dates</Text>
                    </Button>
                    <Button className="flex bg-white dark:bg-night rounded-2xl w-[40%] gap-2 border border-mist dark:border-white/10 shadow p-2"
                        onPress={() => setType("HousingPoll")}>
                        <IconSymbol name="house.fill" color="#EE8B33" size={34} />
                        <Text className="capitalize text-lg font-bold text-night dark:text-white"> des hébergements</Text>
                    </Button>
                    <Button className="flex bg-white dark:bg-night rounded-2xl w-[40%] gap-2 border border-mist dark:border-white/10 shadow p-2"
                        onPress={() => setType("OtherPoll")}>
                        <IconSymbol name="chart.bar.fill" color="#EE8B33" size={34} />
                        <Text className="capitalize text-lg font-bold text-night dark:text-white"> autre chose</Text>
                    </Button>

                </View>

            </View>


        )

    return (
        <Animated.ScrollView className="flex-1 bg-mist dark:bg-ink" contentContainerClassName="mt-4 mx-4" contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
            <View className="bg-white dark:bg-night rounded-2xl p-4 mb-4 shadow-sm border border-mist dark:border-white/10">
                <Text className="text-lg font-semibold text-night dark:text-white mb-3">
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


            <View className="bg-white dark:bg-night rounded-2xl p-4 mb-4 shadow-sm border border-mist dark:border-white/10">
                <Text className="text-lg font-semibold text-night dark:text-white mb-3">
                    Options
                </Text>
                {type === "DatesPoll" &&
                    <DatesPollOptionsForm control={control} />
                }
                {type === "OtherPoll" &&
                    <OtherPollOptionsForm
                        control={control}
                    />
                }
                {type === "HousingPoll" &&
                    <View className="flex-1 my-2">
                        <HousingOptionsForm control={control} />
                    </View>
                }
            </View>

            <View className="flex-1 bg-white dark:bg-night rounded-2xl p-4 mb-6 shadow-sm border border-mist dark:border-white/10">
                <Text className="text-lg font-semibold text-night dark:text-white mb-3">
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
    )
}