import { Button } from "@/components/ui/Button";
import { usePostLinkPreview } from "@/hooks/api/useLinkPreview";
import { Pressable, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";

import { Image, ImageBackground } from "expo-image";
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import Animated, { BounceIn, BounceOut, FadeIn, SlideOutDown } from "react-native-reanimated";
import { FormLink } from "../form/FormLink";
import { Skeleton } from "../ui/Skeleton";

export const HousingOptionItem = ({
    control,
    index,
    onPreview,
    onRemove,
    isPending,
    onClick
}: {
    control: any;
    index: number;
    onPreview: (url: string, index: number) => void;
    onRemove: () => void;
    isPending: boolean;
    onClick: (url: string) => void
}) => {
    const option = useWatch({ control, name: `options[${index}]` });

    if (isPending)
        return (
            <Animated.View entering={BounceIn} exiting={BounceOut}>
                <Skeleton height={40} />
            </Animated.View>
        )

    return (
        <Animated.View
            entering={FadeIn}
            exiting={SlideOutDown}
            className="bg-gray-50 dark:bg-gray-700 rounded-b-lg rounded-t-xl gap-1 pb-2 overflow-hidden"
        >

            {option?.image && (
                <Button onPress={() => onClick(option.url)}>
                    <ImageBackground
                        source={option.image}
                        style={{
                            height: 200,
                            width: "100%",
                            flex: 1,
                            alignItems: "flex-end",
                            borderRadius: "inherit"
                        }}
                        className="rounded-t-full"
                        contentFit="cover"
                    >
                        <View className="flex-1 items-end p-2">
                            <View className="flex-1 justify-between">
                                <Pressable
                                    onPress={onRemove}
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
                        name={`options[${index}].url`}
                        placeholder="Colle un lien Airbnb, Abritel, Booking..."
                        pattern={/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i}
                        onPaste={(text) => onPreview(text, index)}
                    />
                </View>
            }
        </Animated.View>
    );
};

export const HousingOptionsForm = ({ control }: { control: any }) => {
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
    const postLinkPreview = usePostLinkPreview();

    const { fields: options, append, remove, update } = useFieldArray({
        control,
        name: "options",
    })

  const handleLinkClick = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (err) {
            console.error(err);
        }
    }


    const handlePreview = useCallback(async (url: string, index: number) => {
        setLoadingIndex(index);
        try {
            const response = await postLinkPreview.mutateAsync(url);
            if (response.success) {
                update(index, {
                    title: response.data.title,
                    image: response.data.image,
                    icon: response.data.icon,
                    url: response.data.url
                });
            }
        } finally {
            setLoadingIndex(null);
        }
    }, [postLinkPreview, update]);
    // Add default option on mount
    useEffect(() => {
        if (options.length === 0) {
            append({ url: "", title: "", image: "", icon: "" });
        }
    }, [options.length, append]);

    return (
        <View className="gap-2 my-2">
            {options.map((option, index) => (
                <HousingOptionItem
                    key={option.id}
                    control={control}
                    index={index}
                    onPreview={handlePreview}
                    onRemove={() => remove(index)}
                    isPending={loadingIndex === index}
                    onClick={handleLinkClick}
                />
            ))}

            <Button
                onPress={() => append({ url: "", title: "", image: "", icon: "" })}
                className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg justify-start"
            >
                <IconSymbol name="plus.circle.fill" color="#3b82f6" size={20} />
                <Text className="text-blue-600 dark:text-blue-400 font-medium ml-2">
                    Ajouter une option
                </Text>
            </Button>
        </View>
    );
};
