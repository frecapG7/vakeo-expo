import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetTrip, useUpdateTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { countDaysBetween, getDatesBetween } from "@/lib/utils";
import { Trip } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useController, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function DatesPage() {

    const colors = useColors();
    const router = useRouter();

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const updateTrip = useUpdateTrip(id);

    const { control, reset, formState: { isDirty }, handleSubmit } = useForm<Trip>();
    const { field: { value: startDate, onChange: setStartDate } } = useController({
        control,
        name: "startDate",
    });

    const { field: { value: endDate, onChange: setEndDate } } = useController({
        control,
        name: "endDate",
    });

    useEffect(() => {
        reset({
            ...trip,
            startDate: trip?.startDate ? CalendarUtils.getCalendarDateString(trip?.startDate) : "",
            endDate: trip?.endDate ? CalendarUtils.getCalendarDateString(trip?.endDate) : ""
        })
    }, [reset, trip]);


    const onSubmit = async (data: Trip) => {
        const body = {
            ...data,
            startDate: dayjs(data.startDate).toISOString(),
            endDate: dayjs(data.endDate).toISOString()
        };
        await updateTrip.mutateAsync(body);
    }

    const { formatRange } = useI18nTime();


    return (
        <Animated.ScrollView style={styles.container} >

            <View className="flex-1 m-2 py-5 rounded-xl bg- dark:bg-gray-900">
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
                    initialDate={startDate}
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
                    minDate={startDate && CalendarUtils.getCalendarDateString(startDate)}
                />
            </View>

            <View className="flex gap-5 mx-2 mt-10 mb-20">
                <View>

                    <Text className="font-bold text-2xl dark:text-white ml-2">
                        Dates séléctionnées
                    </Text>
                    {/* <Text>{startDate}</Text> */}
                    {/* <Text>{endDate}</Text> */}
                    <View className="flex-row justify-between items-center bg-white dark:bg-gray-900 rounded-xl px-4 p-4">
                        <View className="flex-row gap-1 items-center">
                            <View className="p-1 bg-blue-100 rounded-xl">
                                <IconSymbol name="calendar" color="blue" size={34} />
                            </View>
                            <View>
                                {(startDate && endDate) &&
                                    <View>
                                        <Text className="capitalize font-bold dark:text-white" numberOfLines={2}>
                                            {formatRange(dayjs(startDate), dayjs(endDate))}
                                        </Text>
                                        <Text className="text-gray-400">
                                            {countDaysBetween(dayjs(startDate), dayjs(endDate))} jours
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View className="flex-row gap-1">
                            {(endDate && startDate) &&
                                <Animated.View entering={FadeIn} exiting={FadeOut} >
                                    {isDirty ?
                                        <Pressable
                                            disabled={updateTrip.isPending}
                                            onPress={handleSubmit(onSubmit)}
                                            className="bg-blue-400 rounded-xl p-1">
                                            {updateTrip.isPending ?
                                                <ActivityIndicator /> :
                                                <IconSymbol name="pencil" color="white" />
                                            }
                                        </Pressable>
                                        :
                                        <Pressable
                                            className="bg-gray-400 rounded-xl p-1"
                                            onPress={() => {
                                                setEndDate("");
                                                setStartDate("");
                                            }}>
                                            <IconSymbol name="trash" color="white" />
                                        </Pressable>

                                    }
                                </Animated.View>
                            }
                        </View>
                    </View>
                </View>
                <View>
                    <Text className="font-bold text-2xl dark:text-white">
                        Sondages
                    </Text>
                    <View className="bg-white rounded-xl">
                        <Text>Aucun sondage</Text>
                    </View>
                </View>

                <Button
                    onPress={() => router.push({
                        pathname: "/[id]/polls/new",
                        params: {
                            id: String(id),
                            type: "DatesPoll"
                        }
                    })}
                    className="rounded-full bg-blue-400 py-4 flex-row justify-center  items-center mx-5">
                    <IconSymbol name="chart.bar.fill" color="white" />
                    <Text className="font-bold text-white">
                        Lancer un sondage
                    </Text>
                </Button>
            </View>
        </Animated.ScrollView>
    )
}