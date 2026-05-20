import { usePostLinkPreview } from "@/hooks/api/useLinkPreview";
import useColors from "@/hooks/styles/useColors";
import { isValidUrl } from "@/lib/utils";
import { Link, TripStop } from "@/types/models";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import * as Clipboard from 'expo-clipboard';
import { Image, ImageBackground } from "expo-image";
import React, { useEffect, useState } from "react";
import { Control, useController, useFormState } from "react-hook-form";
import { Linking, Text, View } from "react-native";
import Animated, { BounceIn, BounceOut, SlideInLeft, SlideOutRight } from "react-native-reanimated";
import { Toast } from "toastify-react-native";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";
import { Skeleton } from "../ui/Skeleton";

interface AccommodationFormProps {
    control: Control<TripStop>;
    onCancel: () => void;
    onSubmit: () => Promise<void>;
}

export const BottomAccommodationForm = ({ control, onCancel, onSubmit }: AccommodationFormProps) => {
    const [input, setInput] = useState<string>("");

    const { isDirty, isSubmitting } = useFormState({
        control
    });
    const { field: { value: accommodation, onChange: setAccommodation } } = useController({
        control,
        name: "accommodation",
        rules: {
            required: true
        }
    });
    const [editMode, setEditMode] = useState(!accommodation);

    const { inputPlaceHolder } = useColors();
    const postLinkPreview = usePostLinkPreview();

    const handleSubmitLink = async (data: Link) => {
        setAccommodation(data);
        setInput("");
        await onSubmit();
    };

    const onLinkClick = async () => {
        if (accommodation?.url) {
            try {
                await Linking.openURL(accommodation.url);
            } catch (err) {
                console.error("Failed to open URL:", err);
            }
        }
    };

    const onPaste = async () => {
        const text = await Clipboard.getStringAsync();

        if (!isValidUrl(text)) {
            Toast.warn("Le lien utilisé n'est pas valide");
            return;
        }
        setEditMode(false);
        try {
            const response = await postLinkPreview.mutateAsync(text);
            if (response.success && response.data) {
                // Full link preview available
                await handleSubmitLink(response.data);
            } else {
                // Fallback when preview fails but URL is valid
                const urlObj = new URL(text);
                await handleSubmitLink({
                    title: urlObj.hostname,
                    url: text,
                    image: "",
                    icon: ""
                });
                Toast.warn("Prévisualisation non disponible");
            }
        } catch {
            setEditMode(true);
        }

    }

    useEffect(() => {
        setEditMode(!accommodation);
    }, [accommodation]);

    if (!editMode) {
        if (!accommodation)
            return (
                <View>
                    <Skeleton height={40} />
                </View>
            );

        return (
            <Animated.View
                entering={SlideInLeft}
                exiting={SlideOutRight}
                className="">
                <Button
                    onPress={onLinkClick}
                    className="rounded-xl bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20  gap-1 pb-2 overflow-hidden"
                >

                    <ImageBackground
                        source={accommodation?.image}
                        style={{
                            height: 180,
                            width: "100%",
                            flex: 1,
                            alignItems: "flex-end",
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16
                        }}
                        contentFit="cover"
                    >
                        <View className="flex-1 items-end p-3 w-full">
                            <View className="flex-1 justify-between">
                                <Button
                                    onPress={() => setAccommodation(null)}
                                    className="p-1 bg-red-300 dark:bg-red-900/50 w-10 rounded-full items-center">
                                    <IconSymbol name="trash" />
                                </Button>
                                <View>
                                    <Image source={accommodation?.icon}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                    <View className="mx-1 p-2">
                        <Text className="font-bold text-lg dark:text-white">
                            {accommodation?.title}
                        </Text>
                        <Text className="text-red-400 italic underline text-sm py-2">
                            Voir le détail
                        </Text>
                    </View>

                </Button>

                <View className="flex-row justify-center items-center my-4 gap-4" >
                    <Button
                        variant="outlined"
                        title="Annuler"
                        onPress={onCancel} />
                </View>
            </Animated.View>
        )


    }




    return (<View className="gap-1">
        <View className="flex-row bg-gray-100 dark:bg-gray-600 border focus:border-blue-400 items-center px-2 rounded-xl h-12">
            <IconSymbol name="house.fill" color="gray" size={16} />
            <BottomSheetTextInput
                value={input}
                onChangeText={setInput}
                className="flex-1 text-dark dark:text-white h-full normal-case"
                placeholderTextColor={inputPlaceHolder}
                placeholder="Coller le lien de l'hébergement"
                keyboardType="url"
                autoCapitalize="none"
                maxLength={37}
                editable={false}

            />
            <View>
                <Animated.View
                    entering={BounceIn}
                    exiting={BounceOut}>
                    <Button
                        className="bg-gray-200 rounded-lg p-1 shadow"
                        disabled={postLinkPreview.isPending}
                        onPress={onPaste}
                    >
                        <IconSymbol name="doc.on.doc" size={16} color="blue" />
                    </Button>
                </Animated.View>
            </View>

        </View>
        <View className="flex-row justify-center items-center my-4 gap-4" >
            <Button
                variant="outlined"
                title="Annuler"
                disabled={isSubmitting}
                onPress={onCancel} />
        </View>
    </View>
    );

};