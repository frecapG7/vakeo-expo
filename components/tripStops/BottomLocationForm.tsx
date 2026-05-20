import { useGeocode } from "@/hooks/api/useGeocode";
import useColors from "@/hooks/styles/useColors";
import { TripStop } from "@/types/models";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { Control, useController, useFormState } from "react-hook-form";
import { ActivityIndicator, Linking, Pressable, Text, View } from "react-native";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";

interface LocationSearchProps {
    control: Control<TripStop>;
    onCancel: () => void;
    onSubmit: () => Promise<void>;
}

export const BottomLocationForm = ({ control, onCancel, onSubmit }: LocationSearchProps) => {
    const [input, setInput] = useState<string>("");
    const [enableQuery, setEnableQuery] = useState<boolean>(false);


    const { isDirty, isSubmitting } = useFormState({
        control
    });
    const { field: { value: location, onChange: setLocation } } = useController({
        control,
        name: "location",
        rules: {
            required: true
        }
    });
    const [editMode, setEditMode] = useState(!location);

    useEffect(() => setEditMode(!location), [location]);


    const { inputPlaceHolder } = useColors();
    const { data: geocode, isSuccess } = useGeocode(input, enableQuery);

    useEffect(() => {
        setEnableQuery(false);
    }, [input, isSuccess]);

    const onMapClick = async () => {
        if (location?.coordinates) {
            const encodedDisplayName = encodeURIComponent(location.displayName);
            const [longitude, latitude] = location.coordinates;
            // Universal geo URI that works on both iOS and Android
            const url = `geo:${latitude},${longitude}?q=${encodedDisplayName}`;
            try {
                await Linking.openURL(url);
            } catch {
                // Fallback for platforms that don't support geo: URI
                const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodedDisplayName}`;
                try {
                    await Linking.openURL(fallbackUrl);
                } catch (err) {
                    console.error("Failed to open maps:", err);
                }
            }
        }
    };

    const handleSubmitGeocode = () => {
        setLocation(geocode);
        setInput("");
        onSubmit();
    };

    useEffect(() => {
        setEditMode(!location);
    }, [setEditMode, location]);


    if (!editMode)
        return (
            <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                <Button
                    onPress={onMapClick}
                    className="flex-row items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20"
                >
                    <View className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <IconSymbol name="mappin" color="orange" />
                    </View>
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-gray-500 dark:text-gray-400">Lieu</Text>
                            <Button
                                onPress={() => setLocation(null)}
                                className="p-1 bg-red-300 dark:bg-red-900/50 w-10 rounded-full items-center">
                                <IconSymbol name="trash" />
                            </Button>
                        </View>
                        <Text className="text-lg font-bold flex-1 dark:text-white" numberOfLines={3}>
                            {location?.displayName}
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


    return (
        <View className="gap-1">
            {isSubmitting ?
                <View>
                    <ActivityIndicator size="large" />
                </View>
                :
                <View className="flex-row bg-gray-100 dark:bg-gray-600 border focus:border-blue-400 items-center px-2 rounded-xl h-12">
                    <IconSymbol name="mappin" color="gray" size={16} />
                    <BottomSheetTextInput
                        value={editMode ? input : location?.displayName}
                        onChangeText={setInput}
                        className="flex-1 text-dark dark:text-white h-full normal-case"
                        placeholderTextColor={inputPlaceHolder}
                        placeholder="Saisir le lieu ou le code postal"
                    />
                    {editMode ? (
                        <Pressable onPress={() => setEnableQuery(true)}>
                            <IconSymbol name="magnifyingglass" color="blue" />
                        </Pressable>
                    ) : (
                        <Pressable onPress={onMapClick}>
                            <IconSymbol name="map" color="blue" />
                        </Pressable>
                    )}
                </View>
            }
            {editMode && geocode && (
                <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                    <Pressable
                        onPress={handleSubmitGeocode}
                        className="flex-row items-center py-2 gap-2"
                    >
                        <IconSymbol name="mappin" color="gray" />
                        <Text className="text-sm flex-1 dark:text-white" numberOfLines={3}>
                            {geocode.displayName}
                        </Text>
                    </Pressable>
                </Animated.View>
            )}
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
