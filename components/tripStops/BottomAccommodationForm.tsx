import { usePostLinkPreview } from "@/hooks/api/useLinkPreview";
import useColors from "@/hooks/styles/useColors";
import { isValidUrl } from "@/lib/utils";
import { Link, TripStop } from "@/types/models";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import * as Clipboard from 'expo-clipboard';
import { Image, ImageBackground } from "expo-image";
import React, { useEffect, useState } from "react";
import { Control, useController, useFormState } from "react-hook-form";
import { Linking, Pressable, Text, View } from "react-native";
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

    const handleSubmitLink = (data: Link) => {
        setAccommodation(data);
        setInput("");
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
                handleSubmitLink(response.data);
            } else {
                // Fallback when preview fails but URL is valid
                const urlObj = new URL(text);
                handleSubmitLink({
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
                <Pressable
                    onPress={onLinkClick}
                    className="bg-white dark:bg-gray-900 rounded-xl gap-1 pb-2 overflow-hidden border dark:border-gray-200 "
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
                                <Pressable
                                    onPress={() => setAccommodation(null)}
                                    className="p-1 bg-gray-400 w-10 rounded-full items-center">
                                    <IconSymbol name="trash" />
                                </Pressable>
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
                        <Button className="py-2" onPress={() => onLinkClick()}>
                            <Text className="text-red-400 italic underline text-sm">
                                Voir le détail
                            </Text>

                        </Button>

                    </View>
                </Pressable>

                <View className="flex-row justify-center items-center my-4 gap-4" >
                    <Button
                        variant="outlined"
                        title="Annuler"
                        onPress={onCancel} />
                    <Button
                        variant="contained"
                        title="Modifier"
                        disabled={!isDirty}
                        isLoading={isSubmitting}
                        onPress={onSubmit} />
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
                {!accommodation ? <Animated.View
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
                    :
                    <Button onPress={onLinkClick}>
                        <IconSymbol name="xmark.circle" color="gray" size={16} />
                    </Button>}
            </View>
        </View>
    </View>
    );

};