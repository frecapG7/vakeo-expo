import styles from "@/constants/Styles";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import { getDatesBetween } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../ui/Button";
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
                        <Text className="text-sm dark:text-white">
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

    const { fields: options, append, remove, update } = useFieldArray({
        control,
        name: "options",
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

                    <Calendar
                        enableSwipeMonths
                        theme={{
                            backgroundColor: colors.calendarBackground,
                            calendarBackground: colors.calendarBackground,
                            textSectionTitleColor: colors.text,
                            dayTextColor: colors.text,
                            textSectionTitleDisabledColor: '#d9e1e8',
                            selectedDayBackgroundColor: '#fdb140',
                            selectedDayTextColor: colors.primary,
                            todayTextColor: '#00adf5',
                            todayBackgroundColor: '#a2daf1ff',
                            textDisabledColor: '#828485ff',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: 'orange',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: colors.text,
                            indicatorColor: colors.text,
                        }}
                        markingType="period"
                        onDayPress={({ dateString }) => {
                            if (!startDate) {
                                setEndDate("");
                                setStartDate(dateString);
                            } else if (endDate) {
                                setEndDate("");
                                setStartDate(dateString);
                            } else {
                                setEndDate(dateString);
                            }
                        }}
                        markedDates={markedDates}
                        renderArrow={(direction) => (
                            <IconSymbol
                                name={direction === 'left' ? 'chevron.left' : 'chevron.right'}
                                size={24}
                                color={colors.primary}
                            />
                        )}
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