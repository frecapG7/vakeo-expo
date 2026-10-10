import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";
import WheelPicker from '@quidone/react-native-wheel-picker';
import { useState } from "react";
import { useController } from "react-hook-form";
import { Pressable, Text, View, useColorScheme } from "react-native";
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
    const isDark = useColorScheme() === "dark";
    return (
        <View className="flex-row flex-1 gap-5 items-center justify-center bg-white dark:bg-night">
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
                    color: isDark ? "#F6F8FD" : "#16265C",
                }}
                overlayItemStyle={{
                    backgroundColor: isDark ? "#16265C" : "#F6F8FD"
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
                    color: isDark ? "#F6F8FD" : "#16265C",
                }}
                overlayItemStyle={{
                    backgroundColor: isDark ? "#16265C" : "#F6F8FD"
                }}
            />
        </View>)
}

export const FormDateTimePickerV2 = ({ control, rules, initialDate }:
    {
        control: any;
        rules: any;
        initialDate?: string | Date;
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

    const isDark = useColorScheme() === "dark";
    const themeText = isDark ? "#F6F8FD" : "#16265C";
    const themeBackground = isDark ? "#16265C" : "#FFFFFF";

    const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
    const [showStartDateTimePicker, setShowStartDateTimePicker] = useState(false);
    const [showEndDateTimePicker, setShowEndDateTimePicker] = useState(false);
    const { formatDate, formatHour } = useI18nTime();

    return (
        <View className="gap-2">
            <View>
                <View className="flex-row justify-between items-center p-1 pb-2 border-b border-night/10 dark:border-white/10">
                    <Text className="font-bold text-night dark:text-white">
                        Quel jour
                    </Text>
                    <Pressable className="bg-mist dark:bg-white/10 rounded-full py-1 px-2"
                        onPress={() => {
                            setShowStartDateTimePicker(false);
                            setShowEndDateTimePicker(false);
                            setShowStartDateCalendar(!showStartDateCalendar)
                        }}>
                        <Text className={`text-night dark:text-white ${showStartDateCalendar && "font-bold text-amber-deep dark:text-amber"}`}>
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
                            // Si on a déjà choisi une date, on ouvre le calendrier dessus.
                            // Sinon, on s'ouvre sur la date de début du séjour (initialDate).
                            initialDate={startDate ? String(startDate) : (initialDate ? String(initialDate) : undefined)}
                            enableSwipeMonths
                            theme={{
                                backgroundColor: themeBackground,
                                calendarBackground: themeBackground,
                                textSectionTitleColor: themeText,
                                dayTextColor: themeText,
                                textSectionTitleDisabledColor: '#d9e1e8',
                                selectedDayBackgroundColor: '#EE8B33',
                                selectedDayTextColor: '#FFFFFF',
                                todayTextColor: '#EE8B33',
                                todayBackgroundColor: '#F7B74A33',
                                textDisabledColor: '#828485ff',
                                dotColor: '#EE8B33',
                                selectedDotColor: '#ffffff',
                                arrowColor: '#EE8B33',
                                disabledArrowColor: '#d9e1e8',
                                monthTextColor: themeText,
                                indicatorColor: themeText,
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
                                        color: '#EE8B33',
                                        textColor: '#FFFFFF',
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
                <View className="flex-row justify-between items-center p-1 pb-2 border-b border-night/10 dark:border-white/10">
                    <Text className="font-bold text-night dark:text-white">
                        Heure de début
                    </Text>
                    <View className="flex-row gap-1 items-end">
                        <Pressable className="bg-mist dark:bg-white/10 rounded-full py-1 px-2"
                            onPress={() => {
                                setShowStartDateCalendar(false);
                                setShowEndDateTimePicker(false);
                                setShowStartDateTimePicker(!showStartDateTimePicker)
                            }}>
                            <Text className={`text-night dark:text-white ${showStartDateTimePicker && "font-bold text-amber-deep dark:text-amber"}`}>
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
                    <Text className="font-bold text-night dark:text-white">
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
                            className={`bg-mist dark:bg-white/10 rounded-full py-1 px-2 ${!startDate && 'opacity-40'}`}>
                            <Text className={`text-night dark:text-white ${showEndDateTimePicker && "font-bold text-amber-deep dark:text-amber"} ${error && "text-danger line-through"}`}>
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
                        <Text className="text-danger">
                            {error?.message}
                        </Text>

                    </Animated.View>

                }
                {
                    showEndDateTimePicker &&
                    <Animated.View entering={StretchInY}
                        exiting={StretchOutY}
                    >
                        <View className="flex-row flex-1 gap-5 items-center justify-center bg-white dark:bg-night">
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
                                    color: themeText,
                                }}
                                overlayItemStyle={{
                                    backgroundColor: isDark ? "#16265C" : "#F6F8FD"
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
                                    color: themeText,
                                }}
                                overlayItemStyle={{
                                    backgroundColor: isDark ? "#16265C" : "#F6F8FD"
                                }}
                            />
                        </View>
                    </Animated.View>
                }
            </View>
        </View >
    )
}
