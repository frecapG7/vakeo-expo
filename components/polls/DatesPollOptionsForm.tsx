import styles from "@/constants/Styles";
import useI18nTime from "@/hooks/i18n/useI18nTime";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFieldArray, useFormState, useWatch } from "react-hook-form";
import { Modal, Pressable, Text, useColorScheme, View } from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../ui/Button";
import { DateRangeCalendar } from "../ui/DateRangeCalendar";
import { IconSymbol } from "../ui/IconSymbol";

export const DateOptionItem = ({
    control,
    index,
    onDateSelect,
    onRemove
}: {
    control: any;
    index: number;
    onDateSelect: (index: number) => void;
    onRemove: () => void;
}) => {
    const option = useWatch({ control, name: `options[${index}]` });
    const { formatRange } = useI18nTime();
    const isDark = useColorScheme() === "dark";

    const hasDates = option.startDate && option.endDate;

    return (
        <Animated.View
            entering={SlideInUp}
            exiting={SlideOutDown}
            key={option.id}
            className="flex-row items-center bg-mist dark:bg-ink rounded-lg p-3 gap-2"
        >
            <Pressable
                onPress={() => onDateSelect(index)}
                className="flex-1"
            >
                {hasDates ? (
                    <View className="flex-row items-center gap-2">
                        <IconSymbol name="calendar" color="#EE8B33" size={18} />
                        <Text className="text-sm text-night dark:text-white capitalize">
                            {formatRange(dayjs(option.startDate), dayjs(option.endDate))}
                        </Text>
                    </View>
                ) : (
                    <View className="flex-row items-center gap-2">
                        <IconSymbol name="calendar" color={isDark ? "#F6F8FD" : "#16265C"} size={18} />
                        <Text className="text-sm text-night/50 dark:text-white/50">
                            Sélectionner des dates
                        </Text>
                    </View>
                )}
            </Pressable>
            {hasDates && (
                <Pressable
                    onPress={onRemove}
                    className="p-2 rounded-full active:bg-danger/10"
                >
                    <IconSymbol name="trash" color="#E5484D" size={20} />
                </Pressable>
            )}
        </Animated.View>
    );
};

export const DatesPollOptionsForm = ({ control }: { control: any }) => {
    const [calendarIndex, setCalendarIndex] = useState<number | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const isDark = useColorScheme() === "dark";

    const { fields: options, append, remove, update } = useFieldArray<{ startDate?: string; endDate?: string }>({
        control,
        name: "options",
        rules: {
            validate: (value) =>  value.every(opt => opt.startDate && opt.endDate) || "options.error"
        }
    });
    const formState = useFormState({
        control,
        name: "options"
    });

    // Add default option on mount
    useEffect(() => {
        if (options.length === 0) {
            append({ startDate: "", endDate: "" });
        }
    }, [options.length, append]);

    const handleDateSelect = (index: number) => {
        setCalendarIndex(index);
        // Pre-fill with existing dates if editing
        if (options[index]?.startDate) {
            setStartDate(dayjs(options[index].startDate).format("YYYY-MM-DD"));
            setEndDate(dayjs(options[index].endDate).format("YYYY-MM-DD"));
        } else {
            setStartDate("");
            setEndDate("");
        }
    };

    const handleSaveDates = () => {
        if (calendarIndex !== null && startDate && endDate) {
            update(calendarIndex, {
                startDate: dayjs(startDate).toISOString(),
                endDate: dayjs(endDate).toISOString()
            });
        }
        setCalendarIndex(null);
    };

    return (
        <View className="gap-3">
            {options.map((option, index) => (
                <DateOptionItem
                    key={option.id}
                    control={control}
                    index={index}
                    onDateSelect={handleDateSelect}
                    onRemove={() => remove(index)}
                />
            ))}
            {formState.errors.options?.root && (
                <Text className="text-danger text-sm ml-2 mt-1">
                    Toutes les options doivent avoir une date de début et une date de fin
                </Text>
            )}
            <Button
                onPress={() => append({ startDate: "", endDate: "" })}
                className="mt-3 p-3 bg-white dark:bg-night border border-mist dark:border-white/10 rounded-lg justify-start"
            >
                <IconSymbol name="plus.circle.fill" color="#EE8B33" size={20} />
                <Text className="text-amber-deep dark:text-amber font-medium ml-2">
                    Ajouter une option
                </Text>
            </Button>

            {/* Calendar Modal */}
            <Modal
                visible={calendarIndex !== null}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setCalendarIndex(null)}
            >
                <SafeAreaView style={{
                    ...styles.container,
                    padding: 10,
                    backgroundColor: isDark ? "#101736" : "#F6F8FD"
                }}>
                    <View className="flex-row justify-between items-center mb-5">
                        <Pressable onPress={() => setCalendarIndex(null)}>
                            <Text className="text-night dark:text-white text-xl">Annuler</Text>
                        </Pressable>
                    </View>

                    <Text className="mb-4 text-night dark:text-white">
                        Sélectionne une date de début et de fin
                    </Text>

                    <DateRangeCalendar
                        startDate={startDate}
                        endDate={endDate}
                        onChange={({ startDate: newStart, endDate: newEnd }) => {
                            setStartDate(newStart);
                            setEndDate(newEnd);
                        }}
                    />
                    {(startDate && endDate) && (
                        <View className="my-4">

                            <Button
                                title="Enregistrer"
                                onPress={handleSaveDates}
                                variant="contained"
                            />
                        </View>
                    )}
                </SafeAreaView>
            </Modal>
        </View>
    );
};
