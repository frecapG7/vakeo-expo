import { Button } from "@/components/ui/Button";
import { usePostLinkPreview } from "@/hooks/api/useLinkPreview";
import { DatePollOption, HousingPollOption, OtherPollOption, Poll, PollOption } from "@/types/models";
import { Image, ImageBackground } from "expo-image";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, { BounceIn, BounceOut } from "react-native-reanimated";
import { FormLink } from "../form/FormLink";
import { FormText } from "../form/FormText";
import { IconSymbol } from "../ui/IconSymbol";
import { Skeleton } from "../ui/Skeleton";

interface AddOptionModalProps {
    open: boolean;
    onClose: () => void;
    poll: Poll;
    onAdd: (newOption: PollOption) => Promise<void>;
    isLoading: boolean;
}

export function AddOptionModal({ open, onClose, poll, onAdd, isLoading }: AddOptionModalProps) {
    const postLinkPreview = usePostLinkPreview();

    const { control, formState: { isSubmitSuccessful }, reset, handleSubmit } = useForm();

    const handlePasteLink = async (url: string) => {
        const response = await postLinkPreview.mutateAsync(url);
        if (response.success && response.data) {
            // setValue("title", response.data.title);
            // setValue("image", response.data.image);
            // setValue("icon", response.data.icon);
            // setValue("url", response.data.url);
            reset(response.data);
        }
    };

    const option = useWatch({ control });
    useEffect(() => {
        if (isSubmitSuccessful)
            reset();
    }, [isSubmitSuccessful, reset]);

    const onSubmit = async (data: any) => {
        let typedOption: PollOption;

        if (poll.type === "DatesPoll") {
            typedOption = {
                startDate: new Date(data.startDate as string),
                endDate: new Date(data.endDate as string),
            } as DatePollOption;
        }
        else if (poll.type === "HousingPoll") {
            typedOption = data as HousingPollOption;
        }
        else {
            typedOption = data as OtherPollOption;
        }

        await onAdd(typedOption);
        onClose();
    };

    return (
        <Modal
            visible={open}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 p-4">
                <View className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 gap-4">
                    {/* Header */}
                    <View className="flex-row justify-between items-center">
                        <Text className="text-xl font-bold dark:text-white">
                            Ajouter une option
                        </Text>
                        <Button
                            variant="outlined"
                            size="small"
                            icon="xmark"
                            onPress={onClose}
                        />
                    </View>

                    {/* Type-specific form */}
                    {poll.type === "DatesPoll" && (
                        <View className="gap-4">
                            <View>
                                <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                    Date de début
                                </Text>
                                <FormText
                                    control={control}
                                    name="startDate"
                                    rules={{
                                        required: true
                                    }}
                                />
                            </View>
                        </View>
                    )}

                    {poll.type === "HousingPoll" && (
                        <View className="">
                            {postLinkPreview.isPending ?
                                <Animated.View entering={BounceIn}
                                    exiting={BounceOut}>
                                    <Skeleton height={40} />
                                </Animated.View>
                                :
                                <Animated.View entering={BounceIn}
                                    exiting={BounceOut}>
                                    {option?.image && (
                                        <Button onPress={() => console.log(option.url)}>
                                            <ImageBackground
                                                source={option.image}
                                                style={{
                                                    height: 200,
                                                    width: "100%",
                                                    flex: 1,
                                                    alignItems: "flex-end",
                                                }}
                                                className="rounded-t-full"
                                                contentFit="cover"
                                            >
                                                <View className="flex-1 items-end p-2">
                                                    <View className="flex-1 justify-between">
                                                        <Pressable
                                                            onPress={() => reset({ url: "" })}
                                                            className="p-2 bg-white/80  w-11 rounded-full items-center shadow-md border border-gray-300"
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
                                        </Button>
                                    )}
                                </Animated.View>
                            }



                            {option?.title ? (
                                <View className="mx-1 px-3 pb-2">
                                    <Text className="font-bold text-lg dark:text-white">
                                        {option.title}
                                    </Text>
                                </View>
                            ) :
                                <View className="p-3">
                                    <FormLink
                                        control={control}
                                        name="url"
                                        placeholder="Colle un lien Airbnb, Abritel, Booking..."
                                        pattern={/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i}
                                        onPaste={handlePasteLink}
                                    />
                                </View>
                            }
                        </View>
                    )}

                    {poll.type === "OtherPoll" && (
                        <View>
                            <Text className="text-sm font-medium mb-1 dark:text-gray-300">
                                Option
                            </Text>
                            <FormText
                                control={control}
                                placeholder="Nouvelle option"
                                name="value"
                                rules={{
                                    required: true,
                                    maxLength: 255
                                }}
                            />
                        </View>
                    )}

                    {/* Submit button */}
                    <Button
                        title="Ajouter"
                        icon="plus"
                        onPress={handleSubmit(onSubmit)}
                        variant="contained"
                        isLoading={isLoading}
                    />
                </View>
            </View>
        </Modal>
    );
}
