import useColors from "@/hooks/styles/useColors";
import { useEffect, useRef, useState } from "react";
import { useController } from "react-hook-form";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export const FormAutocomplete = ({
    control,
    name,
    placeholder,
    rules,
    suggestions = [],
    disabled
}: {
    control: any,
    name: string,
    placeholder?: string,
    rules?: object,
    suggestions?: readonly string[],
    disabled?: boolean
}) => {

    const { field: { value, onChange },
        fieldState: { error } } = useController({
            name,
            control,
            rules
        });

    const shakeAnimation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: shakeAnimation?.value
                }
            ]
        };
    });

    useEffect(() => {
        if (error) {
            shakeAnimation.value = withRepeat(withTiming(20, {
                duration: 100,
                easing: Easing.linear,
            }), 4, true);
        }
    }, [error, shakeAnimation]);

    const { inputPlaceHolder } = useColors();
    const textInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (error)
            textInputRef.current?.focus();
    }, [error]);

    const [showDropdown, setShowDropdown] = useState(false);
    const [inputValue, setInputValue] = useState<string>(value ?? '');

    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value ?? '');
        }
    }, [value]);

    const filteredSuggestions = inputValue.length > 0
        ? suggestions.filter(s => 
            s.toLowerCase().includes(inputValue.toLowerCase())
          )
        : [];

    const handleChangeText = (text: string) => {
        setInputValue(text);
        onChange(text);
        setShowDropdown(text.length > 0);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        setInputValue(suggestion);
        onChange(suggestion);
        setShowDropdown(false);
    };

    const handleFocus = () => {
        if (inputValue.length > 0) {
            setShowDropdown(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setShowDropdown(false), 200);
    };

    return (
        <View className="flex-1">
            <Animated.View style={animatedStyle}
                className={`flex-row items-center ${disabled ? 'bg-gray-200 dark:bg-gray-700 opacity-60' : 'bg-white dark:bg-gray-600'} border focus:border focus:border-blue-500 rounded-xl h-12`}>
                <TextInput
                    onChangeText={handleChangeText}
                    value={inputValue}
                    className="flex-1 text-dark dark:text-white h-full items-start normal-case p-3"
                    placeholderTextColor={inputPlaceHolder}
                    ref={textInputRef}
                    placeholder={placeholder}
                    style={{
                        textAlignVertical: "top",
                    }}
                    editable={!disabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </Animated.View>
            {!disabled && showDropdown && filteredSuggestions.length > 0 && (
                <View className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl mt-1 max-h-40 z-10">
                    <FlatList
                        data={filteredSuggestions}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => handleSelectSuggestion(item)}
                                className="p-3"
                            >
                                <Text className="text-dark dark:text-white">{item}</Text>
                            </Pressable>
                        )}
                        keyboardShouldPersistTaps="always"
                    />
                </View>
            )}
        </View>
    );
};
