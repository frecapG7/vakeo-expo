import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import WheelPicker from '@quidone/react-native-wheel-picker';
import { useState } from "react";
import { useController } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import Animated, { FadeIn, FadeOut, StretchInY, StretchOutY } from "react-native-reanimated";



const hoursItems = Array.from({ length: 24 }).map((_, index) => ({
    value: index,
    label: index < 10 ? "0" + index : index
}));
const minuteItems = Array.from({ length: 12 }).map((_, index) => index * 5).map((index) => ({
    value: index,
    label: index < 10 ? "0" + index : index
}));

const WheelTimePicker = ({ value, onChangeHour, onChangeMinute }: { value?: Date | string, onChangeHour: (value: any) => void, onChangeMinute: (value: any) => void }) => {
    const colors = useColors();
    return (
        <View className="flex-row flex-1 gap-5 items-center justify-center bg-white dark:bg-gray-900">
            <WheelPicker
                data={hoursItems}
                value={value && dayjs(value).hour()}
                onValueChanged={({ item: { value: hour } }) =>
                    onChangeHour(hour)
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
                value={value && dayjs(value).minute()}
                onValueChanged={({ item: { value: minute } }) => onChangeMinute(minute)
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
        </View>)
}

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
    const [showEndDateTimePicker, setShowEndDateTimePicker] = useState(false);
    const { formatDate, formatHour } = useI18nTime();


    return (
        <View className="gap-2">
            <View>
                <View className="flex-row justify-between items-center p-1 pb-2 border-b border-gray-200">
                    <Text className="font-bold dark:text-gray-200">
                        Quel jour
                    </Text>
                    <Pressable className="bg-gray-200 rounded-full py-1 px-2"
                        onPress={() => {
                            setShowStartDateTimePicker(false);
                            setShowEndDateTimePicker(false);
                            setShowStartDateCalendar(!showStartDateCalendar)
                        }}>
                        <Text className={`${showStartDateCalendar && "font-bold text-orange-400"}`}>
                            {startDate ? formatDate(startDate) : "Choisis un jour"}
                        </Text>
                    </Pressable>
                </View>
                {
                    showStartDateCalendar &&
                    <Animated.View entering={StretchInY}
                        exiting={StretchOutY}
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
                                let newStartDate = dayjs(dateString).hour(12);
                                let newEndDate = dayjs(dateString).hour(12).minute(30);
                                if (startDate)
                                    newStartDate = newStartDate.hour(dayjs(startDate).hour()).minute(dayjs(startDate).minute());
                                if (endDate)
                                    newEndDate = newEndDate.hour(dayjs(endDate).hour()).minute(dayjs(endDate).minute());
                                setStartDate(newStartDate.toISOString());
                                setEndDate(newEndDate.toISOString());
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
                }

            </View>
            <View>
                <View className="flex-row justify-between items-center p-1 pb-2 border-b border-gray-200">
                    <Text className="font-bold dark:text-gray-200">
                        Heure de début
                    </Text>
                    <View className="flex-row gap-1 items-end">
                        <Pressable className="bg-gray-200 rounded-full py-1 px-2"
                            onPress={() => {
                                setShowStartDateCalendar(false);
                                setShowEndDateTimePicker(false);
                                setShowStartDateTimePicker(!showStartDateTimePicker)
                            }}>
                            <Text className={`${showStartDateTimePicker && "font-bold text-orange-400"}`}>
                                {startDate ? formatHour(startDate) : "Choisis une heure"}
                            </Text>
                        </Pressable>


                    </View>
                </View>
                {showStartDateTimePicker &&
                    <Animated.View
                        entering={StretchInY}
                        exiting={StretchOutY}
                    >
                        <WheelTimePicker
                            value={startDate}
                            onChangeHour={(hour) => {
                                let newStartDate = startDate ? dayjs(startDate) : dayjs();
                                newStartDate = newStartDate.hour(hour);
                                setStartDate(newStartDate.toISOString());
                            }}
                            onChangeMinute={(minute) => {
                                let newStartDate = startDate ? dayjs(startDate) : dayjs();
                                newStartDate = newStartDate.minute(minute);
                                setStartDate(newStartDate.toISOString());
                            }
                            } />
                    </Animated.View>
                }
            </View>
            <View>
                <View className="flex-row justify-between items-center p-1">
                    <Text className="font-bold dark:text-gray-200">
                        Heure de fin
                    </Text>
                    <View className="flex-row gap-1 items-end">
                        <Pressable
                            disabled={!startDate}
                            onPress={() => {
                                setShowStartDateCalendar(false);
                                setShowStartDateTimePicker(false);
                                setShowEndDateTimePicker(!showEndDateTimePicker)
                            }
                            }
                            className={`bg-gray-200 rounded-full py-1 px-2  ${!startDate && 'opacity-40 bg-gray-100'}`}>
                            <Text className={`${showEndDateTimePicker && "font-bold text-orange-400"} ${error && "text-red-400 line-through"}`}>
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
                    showEndDateTimePicker &&
                    <Animated.View entering={StretchInY}
                        exiting={StretchOutY}
                    >
                        <View className="flex-row flex-1 gap-5 items-center justify-center bg-white dark:bg-gray-900">
                            <WheelPicker
                                data={hoursItems}
                                value={endDate && dayjs(endDate).hour()}
                                onValueChanged={({ item: { value: hour } }) =>
                                    !!endDate && setEndDate(dayjs(endDate).hour(hour).toISOString())
                                }
                                enableScrollByTapOnItem={true}
                                style={{
                                    width: 40,
                                }}
                                itemTextStyle={{
                                    color: colors.text,
                                }}
                                overlayItemStyle={{
                                    backgroundColor: colors.neutral
                                }}
                            />
                            <WheelPicker
                                data={minuteItems}
                                value={endDate && dayjs(endDate).minute()}
                                onValueChanged={({ item: { value: minute } }) => endDate &&
                                    setEndDate(dayjs(endDate).minute(minute).toISOString())
                                }
                                enableScrollByTapOnItem={true}
                                style={{
                                    width: 40,
                                }}
                                itemTextStyle={{
                                    color: colors.text,
                                }}
                                overlayItemStyle={{
                                    backgroundColor: colors.neutral
                                }}
                            />
                        </View>
                    </Animated.View>
                }
            </View>
        </View >
    )
}


