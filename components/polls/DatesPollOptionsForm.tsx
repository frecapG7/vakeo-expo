import styles from "@/constants/Styles";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import { getDatesBetween } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";





export const DatesPollOptionsForm = ({ control }: { control: any }) => {


    const [openModal, setOpenModal] = useState(false);

    const colors = useColors();

    const { fields: options, append, remove } = useFieldArray({
        control,
        name: "options",
    })

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const { formatRange } = useI18nTime();

    useEffect(() => {
        if (!openModal) {
            setEndDate("");
            setStartDate("");
        }
    }, [openModal, setStartDate, setEndDate]);

    return (
        <View>

            <View className="gap-5 m-2">
                {options.map((option, index) => (
                    <View
                        key={option.id}
                        className="flex-row items-center gap-2">
                        <Text className="flex-1 capitalize text-sm dark:text-white bg-white dark:bg-gray-900 border border-gray-600 dark:border-gray-200 rounded-xl p-3">
                            {formatRange(dayjs(option.startDate), dayjs(option.endDate))}
                        </Text>
                        <Pressable onPress={() => remove(index)} className="flex items-center">
                            <IconSymbol name="xmark" color="gray" />
                        </Pressable>
                    </View>
                ))}
            </View>

            <Pressable
                onPress={() => setOpenModal(true)}
                className="my-3 flex-row items-center justify-center rounded-full bg-blue-200  p-2">
                <IconSymbol name="plus" color="black" />
                <Text>Ajouter une option</Text>
            </Pressable>


            <Modal visible={openModal}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setOpenModal(false)}
                allowSwipeDismissal>
                <SafeAreaView style={{
                    ...styles.container,
                    padding: 10,
                    backgroundColor: colors.background
                }}>
                    <Pressable onPress={() => setOpenModal(false)}>
                        <Text className="dark:text-white text-xl mb-5">Fermer</Text>
                    </Pressable>


                    <Text>
                        Choisis une date de début et de fin
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
                        // initialDate={startDate}
                        markingType="period"
                        onDayPress={({ dateString }) => {
                            if (!startDate) {
                                setEndDate("");
                                setStartDate(dateString);
                            } else if (endDate) {
                                setEndDate("");
                                setStartDate(dateString);
                            } else {
                                setEndDate(dateString)
                            }
                        }}
                        markedDates={{
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
                                    }
                                    return acc;
                                }, {} as Record<string, any>))
                        }}
                    // minDate={startDate && CalendarUtils.getCalendarDateString(startDate)}
                    />


                    {(startDate && endDate) &&
                        <Animated.View entering={FadeIn}
                            exiting={FadeOut}
                            className="mx-2 my-5">
                            <Button variant="contained" title="Ajouter" onPress={() => {
                                append({
                                    startDate: dayjs(startDate).toISOString(),
                                    endDate: dayjs(endDate).toISOString()
                                });
                                setOpenModal(false);
                            }} />
                        </Animated.View>
                    }
                </SafeAreaView>
            </Modal>
        </View>
    )
}