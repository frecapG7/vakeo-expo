import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import WheelPicker from '@quidone/react-native-wheel-picker';
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import Animated, { FadeIn, FadeOut, FadeOutDown } from "react-native-reanimated";



const hoursItems = Array.from({ length: 25 }).map((_, index) => ({
    value: index,
    label: index < 10 ? "0" + index : index
}));
const minuteItems = Array.from({ length: 60 }).map((_, index) => ({
    value: index,
    label: index < 10 ? "0" + index : index
}));

export const FormDateTimePickerV2 = ({ control, rules }:
    {
        control: any;
        rules: any
    }) => {



    const { field: { value: startDate, onChange: setStartDate } } = useController({
        control,
        name: "startDate",
        rules
    });

    const { field: { value: endDate, onChange: setEndDate }, fieldState: { error } } = useController({
        control,
        name: "endDate",
        rules: {
            validate: (v) => {
                if (!startDate)
                    return;
                if (!v)
                    return "Il manque une horaire de fin"

                if (dayjs(v).isBefore(dayjs(startDate)))
                    return "L'heure de fin est antérieure à celle de début"

            }
        }
    });

    const colors = useColors();

    const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
    const [showStartDateTimePicker, setShowStartDateTimePicker] = useState(false);
    const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
    const [showEndDateTimePicker, setShowEndDateTimePicker] = useState(false);
    const { formatDate, formatHour } = useI18nTime();


    useEffect(() => {
        if (showStartDateCalendar) {
            setShowStartDateTimePicker(false);
            setShowEndDateTimePicker(false);
            setShowEndDateCalendar(false);
        }
    }, [showStartDateCalendar, setShowStartDateTimePicker, setShowEndDateTimePicker, setShowEndDateCalendar]);

    useEffect(() => {
        if (showStartDateTimePicker) {
            setShowStartDateCalendar(false);
            setShowEndDateCalendar(false);
            setShowEndDateTimePicker(false)
        }
    }, [showStartDateTimePicker, setShowStartDateCalendar, setShowEndDateCalendar, setShowEndDateTimePicker]);
    useEffect(() => {
        if (showEndDateCalendar) {
            setShowStartDateCalendar(false);
            setShowStartDateTimePicker(false);
            setShowEndDateTimePicker(false);
        }
    }, [showEndDateCalendar, setShowStartDateTimePicker, setShowEndDateTimePicker, setShowStartDateCalendar]);

    useEffect(() => {
        if (showEndDateTimePicker) {
            setShowStartDateCalendar(false);
            setShowStartDateTimePicker(false);
            setShowEndDateCalendar(false);
        }
    }, [showEndDateTimePicker, setShowStartDateCalendar, setShowEndDateCalendar, setShowStartDateTimePicker]);


    return (
        <View className="gap-4">
            <View>
                <View className="flex-row justify-between items-center p-1">
                    <Text className="text-lg font-bold">
                        Début
                    </Text>

                    <View className="flex-row gap-1 items-end">
                        <Pressable className="dark:bg-gray-400 rounded-full py-1 px-2 border "
                            onPress={() => setShowStartDateCalendar(!showStartDateCalendar)}>
                            <Text className={`${showStartDateCalendar && "font-bold text-orange-400"}`}>
                                {startDate ? formatDate(startDate) : "Choisis un jour"}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setShowStartDateTimePicker(!showStartDateTimePicker)}
                            className="dark:bg-gray-400 rounded-full py-1 px-2 border">
                            <Text className={`${showStartDateTimePicker && "font-bold text-orange-400"} `}>
                                {startDate ? formatHour(startDate) : "Choisis une heure"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
                {
                    showStartDateCalendar ?
                        <Animated.View entering={FadeIn}
                            exiting={FadeOutDown}
                        >
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
                                onDayPress={({ dateString }) => {

                                    let newStartDate = dayjs(dateString).startOf("day");
                                    if (startDate) {
                                        newStartDate = newStartDate.hour(dayjs(startDate).hour()).minute(dayjs(startDate).minute());
                                    }
                                    setStartDate(newStartDate.toISOString())
                                    if (endDate && dayjs(endDate).isBefore(startDate))
                                        setEndDate(newStartDate.add(30, "minute").toISOString());
                                }}
                                markedDates={{
                                    ...(startDate && {
                                        [CalendarUtils.getCalendarDateString(startDate)]: {
                                            color: colors.calendarPrimary,
                                            textColor: colors.neutral,
                                            selected: true,
                                            disableTouchEvent: true
                                        }
                                    })
                                }}
                            />
                        </Animated.View>
                        :
                        showStartDateTimePicker &&
                        <Animated.View entering={FadeIn}
                            exiting={FadeOutDown}
                        >
                            <View className="flex-row flex-1 gap-5 items-center justify-center bg-white dark:bg-gray-900">
                                <WheelPicker
                                    data={hoursItems}
                                    value={startDate && dayjs(startDate).hour()}
                                    onValueChanged={({ item: { value: hour } }) =>
                                        setStartDate(dayjs(startDate).hour(hour).toISOString())
                                    }
                                    enableScrollByTapOnItem={true}
                                    style={{
                                        width: 40,
                                    }}
                                    itemTextStyle={{
                                        color: colors.text,
                                        // backgroundColor:colors.neutral
                                    }}
                                    overlayItemStyle={{
                                        backgroundColor: colors.neutral
                                        // marHorizontal: 10
                                    }}
                                />
                                <WheelPicker
                                    data={minuteItems}
                                    value={startDate && dayjs(startDate).minute()}
                                    onValueChanged={({ item: { value: minute } }) =>
                                        setStartDate(dayjs(startDate).minute(minute).toISOString())
                                    }
                                    enableScrollByTapOnItem={true}
                                    style={{
                                        width: 40,
                                    }}
                                    itemTextStyle={{
                                        color: colors.text,
                                        // backgroundColor:colors.neutral
                                    }}
                                    overlayItemStyle={{
                                        backgroundColor: colors.neutral
                                        // marHorizontal: 10
                                    }}
                                />
                            </View>
                        </Animated.View>
                }
            </View>
            <View>
                <View className="flex-row justify-between items-center p-1">
                    <Text className="text-lg font-bold">
                        Fin
                    </Text>

                    <View className="flex-row gap-1 items-end">
                        <Pressable className="dark:bg-gray-400 rounded-full py-1 px-2 border "
                            onPress={() => setShowEndDateCalendar(!showEndDateCalendar)}>
                            <Text className={`${showEndDateCalendar && "font-bold text-orange-400"} ${error && "text-red-400 line-through"}`}>
                                {endDate ? formatDate(endDate) : "Choisis un jour"}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setShowEndDateTimePicker(!showEndDateTimePicker)}
                            className="dark:bg-gray-400 rounded-full py-1 px-2 border">
                            <Text className={`${showEndDateTimePicker && "font-bold text-orange-400"} ${error && "text-red-400 line-through"} `}>
                                {endDate ? formatHour(endDate) : "Choisis une heure"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
                {!!error &&
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        className="flex-row justify-end">
                        <Text className="text-red-400">
                            {error?.message}
                        </Text>

                    </Animated.View>

                }
                {
                    showEndDateCalendar ?
                        <Animated.View entering={FadeIn}
                            exiting={FadeOutDown}
                        >
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
                                onDayPress={({ dateString }) => setEndDate(dayjs(dateString).startOf("day").toISOString())}
                                markedDates={{
                                    ...(endDate && {
                                        [CalendarUtils.getCalendarDateString(endDate)]: {
                                            color: colors.calendarPrimary,
                                            textColor: colors.neutral,
                                            selected: true,
                                            disableTouchEvent: true
                                        }
                                    })
                                }}
                            />
                        </Animated.View>
                        :
                        showEndDateTimePicker &&
                        <Animated.View entering={FadeIn}
                            exiting={FadeOutDown}
                        >
                            <View className="flex-row flex-1 gap-5 items-center justify-center bg-white dark:bg-gray-900">
                                <WheelPicker
                                    data={hoursItems}
                                    value={endDate && dayjs(endDate).hour()}
                                    onValueChanged={({ item: { value: hour } }) =>
                                        setEndDate(dayjs(endDate).hour(hour).toISOString())
                                    }
                                    enableScrollByTapOnItem={true}
                                    style={{
                                        width: 40,
                                    }}
                                    itemTextStyle={{
                                        color: colors.text,
                                        // backgroundColor:colors.neutral
                                    }}
                                    overlayItemStyle={{
                                        backgroundColor: colors.neutral
                                        // marHorizontal: 10
                                    }}
                                />
                                <WheelPicker
                                    data={minuteItems}
                                    value={endDate && dayjs(endDate).minute()}
                                    onValueChanged={({ item: { value: minute } }) =>
                                        setEndDate(dayjs(endDate).minute(minute).toISOString())
                                    }
                                    enableScrollByTapOnItem={true}
                                    style={{
                                        width: 40,
                                    }}
                                    itemTextStyle={{
                                        color: colors.text,
                                        // backgroundColor:colors.neutral
                                    }}
                                    overlayItemStyle={{
                                        backgroundColor: colors.neutral
                                        // marHorizontal: 10
                                    }}
                                />
                            </View>
                        </Animated.View>
                }
            </View>
        </View >
    )
}


