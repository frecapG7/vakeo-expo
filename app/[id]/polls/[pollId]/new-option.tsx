import { FormLink } from "@/components/form/FormLink";
import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { usePostLinkPreview } from "@/hooks/api/useLinkPreview";
import { useGetPoll, usePutPoll } from "@/hooks/api/usePolls";
import { DatePollOption, HousingPollOption, OtherPollOption, PollOption } from "@/types/models";
import { Image, ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { BounceIn, BounceOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

export default function NewPollOptionPage() {
    const { id, pollId } = useLocalSearchParams<{ id: string, pollId: string }>();
    const router = useRouter();
    const { me } = useContext(TripContext);

    const { data: poll } = useGetPoll(id, pollId);
    const updatePoll = usePutPoll(id, pollId, me?._id);
    const postLinkPreview = usePostLinkPreview();

    const { control, register, handleSubmit, reset, setValue, formState: { isSubmitSuccessful } } = useForm();
    const option = useWatch({ control });

    useEffect(() => {
        if (poll?.type === "DatesPoll") {
            register("startDate", { required: true });
            register("endDate", { required: true });
        }
    }, [poll?.type, register]);

    useEffect(() => {
        if (isSubmitSuccessful)
            reset();
    }, [isSubmitSuccessful, reset]);

    const handlePasteLink = async (url: string) => {
        const response = await postLinkPreview.mutateAsync(url);
        if (response.success && response.data) {
            reset(response.data);
        }
    };

    const onSubmit = async (data: any) => {
        let typedOption: PollOption;

        if (poll?.type === "DatesPoll") {
            typedOption = {
                startDate: new Date(data.startDate as string),
                endDate: new Date(data.endDate as string),
            } as DatePollOption;
        }
        else if (poll?.type === "HousingPoll") {
            typedOption = data as HousingPollOption;
        }
        else {
            typedOption = data as OtherPollOption;
        }

        try {
            await updatePoll.mutateAsync({ newOptions: [typedOption] });
            Toast.success("Option ajoutée");
            router.back();
        } catch {
            // Toast already handled by axios interceptor
        }
    };

    if (!poll)
        return (
            <View style={styles.container}>
                <View className="gap-4 my-4 px-4">
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                </View>
            </View>
        );

    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView
                className="flex-1 mx-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        {poll.type === "DatesPoll" && "Proposer des dates"}
                        {poll.type === "HousingPoll" && "Proposer un hébergement"}
                        {poll.type === "OtherPoll" && "Ajouter une option"}
                    </Text>

                    {poll.type === "DatesPoll" && (
                        <View className="gap-2">
                            <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                Sélectionne une date de début et de fin
                            </Text>
                            <DateRangeCalendar
                                startDate={option?.startDate || ""}
                                endDate={option?.endDate || ""}
                                onChange={({ startDate, endDate }) => {
                                    setValue("startDate", startDate, { shouldValidate: true });
                                    setValue("endDate", endDate, { shouldValidate: true });
                                }}
                            />
                        </View>
                    )}

                    {poll.type === "HousingPoll" && (
                        <View className="gap-3">
                            {postLinkPreview.isPending ? (
                                <Animated.View entering={BounceIn} exiting={BounceOut}>
                                    <Skeleton height={40} />
                                </Animated.View>
                            ) : (
                                <Animated.View entering={BounceIn} exiting={BounceOut}>
                                    {option?.image && (
                                        <ImageBackground
                                            source={option.image}
                                            style={{
                                                height: 200,
                                                width: "100%",
                                                alignItems: "flex-end",
                                            }}
                                            className="rounded-t-xl"
                                            contentFit="cover"
                                        >
                                            <View className="flex-1 items-end p-2">
                                                <View className="flex-1 justify-between w-full">
                                                    <Pressable
                                                        onPress={() => reset({ url: "" })}
                                                        className="p-2 bg-white/80 w-11 rounded-full items-center shadow-md border border-gray-300"
                                                    >
                                                        <IconSymbol name="trash" color="red" size={20} />
                                                    </Pressable>
                                                    {option.icon && (
                                                        <View>
                                                            <Image
                                                                source={option.icon}
                                                                style={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    borderRadius: 10
                                                                }}
                                                            />
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </ImageBackground>
                                    )}
                                </Animated.View>
                            )}

                            {option?.title ? (
                                <View className="mx-1 px-3 pb-2">
                                    <Text className="font-bold text-lg dark:text-white">
                                        {option.title}
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                    <FormLink
                                        control={control}
                                        name="url"
                                        placeholder="Colle un lien Airbnb, Abritel, Booking..."
                                        pattern={/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i}
                                        onPaste={handlePasteLink}
                                    />
                                </View>
                            )}
                        </View>
                    )}

                    {poll.type === "OtherPoll" && (
                        <FormText
                            control={control}
                            placeholder="Nouvelle option"
                            name="value"
                            rules={{
                                required: true,
                                maxLength: 255
                            }}
                        />
                    )}
                </View>

                <Button
                    variant="contained"
                    icon="plus"
                    title="Ajouter"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={updatePoll.isPending}
                />
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
