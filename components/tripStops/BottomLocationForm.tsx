import { useGeocode } from "@/hooks/api/useGeocode";
import useColors from "@/hooks/styles/useColors";
import { TripStop } from "@/types/models";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { Control, useController, useFormState } from "react-hook-form";
import { ActivityIndicator, Linking, Pressable, Text, useColorScheme, View } from "react-native";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";

interface LocationSearchProps {
    control: Control<TripStop>;
}

export const BottomLocationForm = ({ control}: LocationSearchProps) => {
    const [input, setInput] = useState<string>("");
    const [enableQuery, setEnableQuery] = useState<boolean>(false);

    const isDark = useColorScheme() === "dark";

    const { isSubmitting } = useFormState({
        control
    });
    const { field: { value: location, onChange: setLocation } } = useController({
        control,
        name: "location"
    });
    // Derive de la valeur du formulaire : mode edition tant qu'aucun lieu n'est defini.
    // Boolean() casse le narrowing TS de `location` (sinon never apres le early return).
    const editMode = Boolean(!location);

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
    };


    if (!editMode)
        return (
            <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                <Button
                    onPress={onMapClick}
                    className="flex-row items-center gap-4 p-4 rounded-xl bg-white dark:bg-night shadow-sm border border-mist dark:border-white/10"
                >
                    <View className="p-2 rounded-full bg-amber/15 dark:bg-amber/20">
                        <IconSymbol name="mappin" color="#EE8B33" />
                    </View>
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm text-night/50 dark:text-white/50">Lieu</Text>
                            <Button
                                onPress={() => setLocation(null)}
                                className="p-1 bg-danger/10 dark:bg-danger/20 w-10 rounded-full items-center">
                                <IconSymbol name="trash" color="#E5484D" />
                            </Button>
                        </View>
                        <Text className="text-lg font-bold flex-1 text-night dark:text-white" numberOfLines={3}>
                            {location?.displayName}
                        </Text>
                    </View>
                </Button>
            </Animated.View>
        )


    return (
        <View className="gap-1">
            {isSubmitting ?
                <View>
                    <ActivityIndicator size="large" color="#EE8B33" />
                </View>
                :
                <View className="flex-row bg-white dark:bg-night border border-mist dark:border-white/10 focus:border-amber-deep items-center px-2 rounded-2xl h-12">
                    <IconSymbol name="mappin" color={isDark ? "#F6F8FD" : "#16265C"} size={16} />
                    <BottomSheetTextInput
                        value={editMode ? input : location?.displayName}
                        onChangeText={setInput}
                        className="flex-1 text-night dark:text-white h-full normal-case"
                        placeholderTextColor={inputPlaceHolder}
                        placeholder="Saisir le lieu ou le code postal"
                    />
                    <Pressable onPress={() => setEnableQuery(true)}>
                        <IconSymbol name="magnifyingglass" color="#EE8B33" />
                    </Pressable>
                </View>
            }
            {geocode && (
                <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
                    <Pressable
                        onPress={handleSubmitGeocode}
                        className="flex-row items-center py-2 gap-2"
                    >
                        <IconSymbol name="mappin" color={isDark ? "#F6F8FD" : "#16265C"} />
                        <Text className="text-sm flex-1 text-night dark:text-white" numberOfLines={3}>
                            {geocode.displayName}
                        </Text>
                    </Pressable>
                </Animated.View>
            )}
        </View>
    );
};
