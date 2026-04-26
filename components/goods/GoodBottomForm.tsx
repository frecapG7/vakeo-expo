import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { Control, useController, useWatch } from "react-hook-form";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { Button } from "../ui/Button";

export const GoodBottomForm = ({ control, onSubmit, onCancel, isSubmitting }: {
    control: Control<Good>,
    onSubmit: () => Promise<void>,
    onCancel: () => void,
    isSubmitting?: boolean,
}) => {

    const _id = useWatch({
        control,
        name: "_id"
    });


    const { field: { value, onChange: setName }, fieldState: { error } } = useController({
        control,
        name: "name",
        rules: {
            required: true,
            maxLength: 255
        }
    });


    const shakeAnimation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: shakeAnimation?.value
                }
            ]
        }
    });

    useEffect(() => {
        if (error) {
            shakeAnimation.value = withRepeat(withTiming(20, {
                duration: 100,
                easing: Easing.linear,
            }), 4, true);
        }
    }, [error, shakeAnimation]);

    const textInputRef = useRef<TextInput>(null);
    useEffect(() => {
        if (error)
            textInputRef.current?.focus();
    }, [error]);

    const { inputPlaceHolder } = useColors();
    // Référence pour le BottomSheetTextInput

    return (
        <View className="gap-4 items-center">
            <Animated.View
                style={animatedStyle}
                className={`flex flex-row items-center bg-gray-100 dark:bg-gray-600  border focus:border focus:border-blue-500 rounded-xl h-12`} >
                <BottomSheetTextInput
                    value={value}
                    onChangeText={(v) => {
                        setName(v);
                    }}
                    className={`w-[90%] text-dark dark:text-white h-full items-start normal-case`}
                    placeholderTextColor={inputPlaceHolder}
                    placeholder="Ajoute un élément"
                    style={{
                        flexGrow: 1
                    }}
                    ref={textInputRef}
                />
            </Animated.View>
            <View className="flex-row gap-4 items-center justify-center">
                <Button variant="outlined"
                    title="Annuler"
                    onPress={onCancel}
                />
                <Button variant="contained"
                    title={_id ? "Modifier" : "Ajouter"}
                    onPress={onSubmit}
                    isLoading={isSubmitting}
                />

            </View>
        </View>
    )
}