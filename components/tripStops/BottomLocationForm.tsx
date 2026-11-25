import { useGeocode } from "@/hooks/api/useGeocode";
import useColors from "@/hooks/styles/useColors";
import { Location, TripStop } from "@/types/models";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
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
    // Recherche au clic uniquement (service de geocoding facture) : la query est
    // desactivee et ne part que sur refetch(), depuis la loupe ou la touche chercher du clavier.
    const { data: results, isFetching, isSuccess, isError, refetch } = useGeocode(input);
    const noResult = isSuccess && !isFetching && results?.length === 0;

    const onSearch = () => {
        if (isFetching || results?.length || !input.trim())
            return;
        refetch();
    };

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
                const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                try {
                    await Linking.openURL(fallbackUrl);
                } catch (err) {
                    console.error("Failed to open maps:", err);
                }
            }
        }
    };

    const handleSelectResult = (result: Location) => {
        setLocation(result);
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
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={onSearch}
                        returnKeyType="search"
                        autoCorrect={false}
                        className="flex-1 text-night dark:text-white h-full normal-case"
                        placeholderTextColor={inputPlaceHolder}
                        placeholder="Saisir le lieu ou le code postal"
                    />
                    {input.length > 0 && (
                        <Pressable onPress={() => setInput("")} hitSlop={8} className="px-1">
                            <IconSymbol name="xmark.circle" color={isDark ? "#F6F8FD" : "#16265C"} size={16} />
                        </Pressable>
                    )}
                    {isFetching
                        ? <ActivityIndicator size="small" color="#EE8B33" className="px-1" />
                        : <Pressable onPress={onSearch} hitSlop={8} className={`px-1 ${input.trim() ? "" : "opacity-40"}`}>
                            <IconSymbol name="magnifyingglass" color="#EE8B33" />
                        </Pressable>}
                </View>
            }
            {noResult && (
                <Text className="text-xs text-danger px-2">
                    Aucun lieu trouvé pour « {input} »
                </Text>
            )}
            {isError && !isFetching && (
                <Text className="text-xs text-danger px-2">
                    Recherche indisponible — vérifie ta connexion et réessaie
                </Text>
            )}
            {results && results.length > 0 && (
                <Animated.View entering={SlideInLeft} exiting={SlideOutRight} className="gap-1">
                    {results.map((result, index) => (
                        <Pressable
                            key={index}
                            onPress={() => handleSelectResult(result)}
                            className="flex-row items-center gap-3 p-3 rounded-xl bg-white dark:bg-night border border-mist dark:border-white/10"
                        >
                            <View className="p-2 rounded-full bg-amber/15 dark:bg-amber/20">
                                <IconSymbol name="mappin" color="#EE8B33" size={16} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-night/50 dark:text-white/50">Suggestion</Text>
                                <Text className="text-sm font-bold text-night dark:text-white" numberOfLines={3}>
                                    {result.displayName}
                                </Text>
                            </View>
                            <IconSymbol name="chevron.right" color={isDark ? "#F6F8FD" : "#16265C"} size={16} />
                        </Pressable>
                    ))}
                </Animated.View>
            )}
        </View>
    );
};
