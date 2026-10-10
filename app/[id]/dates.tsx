import { PollStatus } from "@/components/polls/PollStatus";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { useTrip } from "@/context/TripContext";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useUpdateTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import dayjs from "@/lib/dayjs-config";
import { countDaysBetween } from "@/lib/utils";
import { Trip } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { useController, useForm } from "react-hook-form";
import { Text, View, useColorScheme } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function DatesPage() {

    const isDark = useColorScheme() === "dark";
    const textColor = isDark ? "#F6F8FD" : "#16265C";
    const muted = isDark ? "rgba(246,248,253,0.35)" : "rgba(22,38,92,0.35)";
    const ink = "#101736";

    const { id } = useLocalSearchParams();
    const updateTrip = useUpdateTrip(id);
    const { trip, me } = useTrip();
    const { data: pagePoll } = useGetPolls(id, { type: "DatesPoll" });
    const poll = pagePoll?.polls[0];
    const router = useRouter();

    const { control, reset, formState: { isDirty, errors }, handleSubmit } = useForm<Trip>();
    const { field: { value: startDate, onChange: setStartDate } } = useController({
        control,
        rules: {
            required: true
        },
        name: "startDate",
    });

    const { field: { value: endDate, onChange: setEndDate } } = useController({
        control,
        rules: {
            required: true
        },
        name: "endDate",
    });

    const handleDateSelection = (dateString: string) => {
        const isCurrentSingleDay = startDate === dateString && endDate === dateString;

        if (isCurrentSingleDay) {
            setStartDate("");
            setEndDate("");
        } else if (startDate && endDate && startDate !== endDate) {
            setStartDate(dateString);
            setEndDate(dateString);
        } else if (startDate) {
            if (dayjs(dateString).isBefore(dayjs(startDate))) {
                setEndDate(startDate);
                setStartDate(dateString);
            } else {
                setEndDate(dateString);
            }
        } else {
            setStartDate(dateString);
            setEndDate(dateString);
        }
    }

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


    const hasError = Object.keys(errors)?.length > 0;
    const disableCalendar = useMemo(() => Boolean(startDate && endDate && !isDirty), [startDate, endDate, isDirty]);


    return (
        <SafeAreaView edges={["bottom"]} style={styles.container} className="flex-1 bg-mist dark:bg-ink">
            <Animated.ScrollView contentInsetAdjustmentBehavior="automatic">
                {/* // Above calendar */}
                <View className="m-2 mb-4 p-4 gap-4 bg-white dark:bg-night rounded-2xl shadow-sm border border-mist dark:border-white/10">
                    <View className="flex-row items-center gap-2">
                        <IconSymbol name="calendar" size={24} color="#EE8B33" />
                        {startDate && endDate ? (
                            <View>
                                <Text className="text-lg font-bold capitalize text-night dark:text-white">
                                    {formatRange(dayjs(startDate), dayjs(endDate))}
                                </Text>
                                <Text className="text-base font-normal text-night/60 dark:text-white/60">
                                    {countDaysBetween(dayjs(startDate), dayjs(endDate))} jours
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-lg font-bold text-night dark:text-white">Aucune date sélectionnée</Text>
                        )}
                    </View>
                    <View className="flex-row justify-start">
                        {!pagePoll ? (
                            <View className="w-40">
                                <Skeleton height={14} />
                            </View>
                        ) : (
                            <PollStatus
                                poll={poll}
                                selectedUser={me}
                                onNewClick={() => router.push({
                                    pathname: "/[id]/polls/new",
                                    params: {
                                        id: String(id),
                                        type: "DatesPoll"
                                    }
                                })}
                                onPollClick={(pollId) => router.push({
                                    pathname: "/[id]/polls/[pollId]",
                                    params: {
                                        id: String(id),
                                        pollId
                                    }
                                })}
                            />
                        )}
                    </View>
                </View>

                <View className="flex-1 m-2 py-5 rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10">
                    <Calendar
                        enableSwipeMonths
                        theme={{
                            backgroundColor: isDark ? "#16265C" : "#FFFFFF",
                            calendarBackground: isDark ? "#16265C" : "#FFFFFF",
                            textSectionTitleColor: textColor,
                            dayTextColor: textColor,
                            textSectionTitleDisabledColor: muted,
                            selectedDayBackgroundColor: "#EE8B33",
                            selectedDayTextColor: ink,
                            todayTextColor: "#EE8B33",
                            textDisabledColor: muted,
                            dotColor: "#EE8B33",
                            selectedDotColor: "#F6F8FD",
                            arrowColor: "#EE8B33",
                            disabledArrowColor: muted,
                            textInactiveColor: muted,
                            monthTextColor: textColor,
                            indicatorColor: "#EE8B33",
                        }}
                        initialDate={startDate ? CalendarUtils.getCalendarDateString(startDate) : undefined}
                        markingType="period"
                        onDayPress={({ dateString }) => !disableCalendar && handleDateSelection(dateString)}
                        markedDates={
                            startDate && endDate
                                ? Array.from({ length: dayjs(endDate).diff(dayjs(startDate), 'day') + 1 }, (_, i) =>
                                    dayjs(startDate).add(i, 'day').format('YYYY-MM-DD'))
                                    .reduce((acc, date) => ({
                                        ...acc,
                                        [date]: {
                                            startingDay: date === startDate,
                                            endingDay: date === endDate,
                                            color: date === startDate || date === endDate ? "#EE8B33" : "rgba(247,183,74,0.35)",
                                            textColor: date === startDate || date === endDate ? ink : textColor,
                                            selected: true,
                                            disableTouchEvent: true
                                        }
                                    }), {})
                                : {}
                        }
                        renderArrow={(direction) => (
                            <IconSymbol
                                name={direction === 'left' ? 'chevron.left' : 'chevron.right'}
                                size={24}
                                color="#EE8B33"
                            />
                        )}
                    />
                    {hasError &&
                        <Animated.View entering={SlideInDown} exiting={SlideOutUp}>
                            <Text className="text-danger mt-4">
                                Une date de début et de fin est requise
                            </Text>
                        </Animated.View>

                    }
                </View>

                {/* Action bar below calendar */}
                <View className="gap-2 mx-2 my-4">
                    {disableCalendar ? (
                        <Button
                            key="clear-button"
                            variant="outlined"
                            title="Réinitialiser"
                            onPress={() => { setStartDate(""); setEndDate(""); }}>

                        </Button>
                    ) :
                        <Button
                            key="edit-button"
                            variant="contained"
                            title="Modifier"
                            onPress={handleSubmit(onSubmit)} />}
                </View>


            </Animated.ScrollView>
        </SafeAreaView>
    )
}
