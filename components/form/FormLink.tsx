import { IconSymbol } from "@/components/ui/IconSymbol";
import useColors from "@/hooks/styles/useColors";
import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef } from "react";
import { useController } from "react-hook-form";
import { Pressable, TextInput } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { Toast } from "toastify-react-native";


export const FormLink = ({
    control,
    name,
    placeholder = "https://www.example...",
    required = true,
    autoFocus = false,
    pattern = /^(https?:\/\/)[\w\.-]+(\/[\w\.-]*)*$/,
    onPaste
}: {
    control: any;
    name: string;
    placeholder?: string;
    required?: boolean;
    autoFocus?: boolean;
    pattern?: RegExp,
    onPaste?: (text: string) => void
}) => {
    const {
        field: { value, onChange },
        fieldState: { error }
    } = useController({
        name,
        control,
        rules: {
            required: required ? "Le lien est requis" : false,
            pattern: {
                value: pattern,
                message: "Format de lien invalide"
            }
        }
    });

    const shakeAnimation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeAnimation.value }]
    }));

    useEffect(() => {
        if (error) {
            shakeAnimation.value = withRepeat(
                withTiming(20, { duration: 100, easing: Easing.linear }),
                4,
                true
            );
        }
    }, [error, shakeAnimation]);

    const { inputPlaceHolder } = useColors();
    const textInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (error) textInputRef.current?.focus();
    }, [error]);

    const handlePaste = async () => {
        const text = await Clipboard.getStringAsync();

        // Try direct match first
        if (pattern.test(text)) {
            onChange(text);
            await onPaste?.(text);
            Toast.info("Lien collé !");
            return;
        }

        // Extract first URL from text (e.g., "Join us at https://toto.com")
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const match = text.match(urlRegex);

        if (match) {
            const extractedUrl = match[0];
            // Clean trailing punctuation: "https://toto.com." -> "https://toto.com"
            const cleanUrl = extractedUrl.replace(/[.,!?;:)]+$/, '');

            if (pattern.test(cleanUrl)) {
                onChange(cleanUrl);
                await onPaste?.(cleanUrl);
                Toast.info("Lien extrait et collé !");
                return;
            }
        }

        Toast.info("Aucun lien valide trouvé");
    };

    // Add helper
    const hasValidLink = value && pattern.test(value);

    // Add clear handler
    const handleClear = () => {
        onChange("");
        textInputRef.current?.focus();
    };

    return (
        <Animated.View style={animatedStyle} className="flex-row items-center bg-white dark:bg-gray-600 border focus:border focus:border-blue-500 rounded-xl h-12">
            <TextInput
                onChangeText={onChange}
                value={value}
                className="flex-1 text-dark dark:text-white h-full items-start normal-case p-3"
                placeholderTextColor={inputPlaceHolder}
                ref={textInputRef}
                placeholder={placeholder}
                style={{ textAlignVertical: "top" }}
                autoFocus={autoFocus}
                editable={!hasValidLink}
            />
            {hasValidLink ? (
                <Pressable onPress={handleClear} className="p-1 h-full justify-center items-center">
                    <IconSymbol name="xmark.circle" size={20} color="blue" />
                </Pressable>
            ) : (
                <Pressable onPress={handlePaste} className="p-1 h-full justify-center items-center">
                    <IconSymbol name="doc.on.doc" size={20} color="gray" />
                </Pressable>
            )}
        </Animated.View>
    );
};
