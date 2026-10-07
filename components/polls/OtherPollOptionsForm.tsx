import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";


export const OtherPollOptionsForm = ({ control }: { control: any }) => {
    const { fields: options, append, remove } = useFieldArray({
        control,
        name: "options",
        rules: {
            minLength: 1
        },
        keyName: "key",
    });

    useEffect(() => {
        if (options.length === 0) {
            append({ value: "" });
        }
    }, [options.length, append]);

    return (
        <View className="gap-3">
            {options?.map((option, index) => (
                <Animated.View
                    entering={SlideInUp}
                    exiting={SlideOutDown}
                    key={option.key}
                    className="flex-row items-center bg-mist dark:bg-ink rounded-lg p-3"
                >
                    <View className="flex-1">
                        <FormText
                            control={control}
                            name={`options[${index}].value`}
                            placeholder={`Option ${index + 1}`}
                            rules={{ required: true }}
                        />
                    </View>
                    <Pressable
                        onPress={() => remove(index)}
                        className="p-2 rounded-full active:bg-danger/10"
                    >
                        <IconSymbol name="trash" color="#E5484D" size={20} />
                    </Pressable>
                </Animated.View>
            ))}

            <Button
                onPress={() => append({ value: "" })}
                className="mt-3 p-3 bg-white dark:bg-night border border-mist dark:border-white/10 rounded-lg justify-start"
            >
                <IconSymbol name="plus.circle.fill" color="#EE8B33" size={20} />
                <Text className="text-amber-deep dark:text-amber font-medium ml-2">
                    Ajouter une option
                </Text>
            </Button>
        </View>
    );
};
