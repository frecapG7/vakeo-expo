import styles from "@/constants/Styles";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import { getDatesBetween } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFieldArray, useFormState, useWatch } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
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

    const hasDates = option.startDate && option.endDate;

    return (
        <Animated.View
            entering={SlideInUp}
            exiting={SlideOutDown}
            key={option.id}
            className="flex-row items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3 gap-2"
        >
            <Pressable
                onPress={() => onDateSelect(index)}
                className="flex-1"
            >
                {hasDates ? (
                    <View className="flex-row items-center gap-2">
                        <IconSymbol name="calendar" color="#3b82f6" size={18} />
                        <Text className="text-sm dark:text-white capitalize">
                            {formatRange(dayjs(option.startDate), dayjs(option.endDate))}
                        </Text>
                    </View>
                ) : (
                    <View className="flex-row items-center gap-2">
                        <IconSymbol name="calendar" color="gray" size={18} />
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            Sélectionner des dates
                        </Text>
                    </View>
                )}
            </Pressable>
            {hasDates && (
                <Pressable
                    onPress={onRemove}
                    className="p-2 rounded-full hover:bg-red-50"
                >
                    <IconSymbol name="trash" color="#ef4444" size={20} />
                </Pressable>
            )}
        </Animated.View>
    );
};

export const DatesPollOptionsForm = ({ control }: { control: any }) => {
    const [calendarIndex, setCalendarIndex] = useState<number | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const colors = useColors();
    const { formatRange } = useI18nTime();

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

    const markedDates = {
        ...(startDate && {
            [startDate]: {
                startingDay: true,
                color: colors.calendarPrimary,
                textColor: colors.neutral,
                selected: true,
                disableTouchEvent: true
            }
        }),
        ...(endDate && {
            [endDate]: {
                endingDay: true,
                color: colors.calendarPrimary,
                textColor: colors.neutral,
                selected: true,
                disableTouchEvent: true
            }
        }),
        ...(getDatesBetween(dayjs(startDate), dayjs(endDate))
            .reduce((acc: Record<string, any>, date) => {
                acc[date] = {
                    color: colors.neutral,
                    textColor: colors.text,
                    selected: true,
                    disableTouchEvent: true
                };
                return acc;
            }, {} as Record<string, any>))
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
                <Text className="text-red-500 text-sm ml-2 mt-1">
                    Toutes les options doivent avoir une date de début et une date de fin
                </Text>
            )}
            <Button
                onPress={() => append({ startDate: "", endDate: "" })}
                className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg justify-start"
            >
                <IconSymbol name="plus.circle.fill" color="#3b82f6" size={20} />
                <Text className="text-blue-600 dark:text-blue-400 font-medium ml-2">
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
                    backgroundColor: colors.background
                }}>
                    <View className="flex-row justify-between items-center mb-5">
                        <Pressable onPress={() => setCalendarIndex(null)}>
                            <Text className="dark:text-white text-xl">Annuler</Text>
                        </Pressable>
                    </View>

                    <Text className="mb-4 dark:text-white">
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