import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetTrip, useUpdateTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { countDaysBetween } from "@/lib/utils";
import { Trip, TripUser } from "@/types/models";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useMemo } from "react";
import { useController, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


const PollStatus = ({ id, selectedUser }: { id: any, selectedUser?: TripUser }) => {
    const { data: pagePoll } = useGetPolls(id, { type: "DatesPoll" });
    const hasPoll = pagePoll?.totalResults !== 0;
    const hasVoted = pagePoll?.polls[0]?.hasSelected?.some(v => v._id === selectedUser?._id);

    const router = useRouter();

    if (!pagePoll)
        return (
            <View className="w-40">
                <Skeleton height={14} />
            </View>);

    if (!hasPoll) return (
        <Button
            onPress={() => router.push({
                pathname: "/[id]/polls/new",
                params: {
                    id: String(id),
                    type: "DatesPoll"
                }
            })}>
            <Text className="text-blue-600 font-medium">+ Créer un sondage</Text>
        </Button>
    );
    if (hasVoted) return (
        <Button className="flex-row items-center gap-2"
            onPress={() => router.push({
                pathname: "/[id]/polls/[pollId]",
                params: {
                    id: String(id),
                    pollId: pagePoll.polls[0]._id
                }
            })}>
            <Text className="text-xl">✅</Text>
            <Text className="text-green-600 font-medium">Vous avez voté</Text>
        </Button>
    );
    return (
        <Button className="flex-row items-center gap-1"
            onPress={() => router.push({
                pathname: "/[id]/polls/[pollId]",
                params: {
                    id: String(id),
                    pollId: pagePoll.polls[0]._id
                }
            })}>
            <Text className="text-xl">⏳</Text>
            <Text className="text-orange-600 font-medium">Voter maintenant</Text>
        </Button>
    );
};


export default function DatesPage() {

    const colors = useColors();

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const updateTrip = useUpdateTrip(id);
    const { me } = useContext(TripContext);

    const { control, reset, formState: { isDirty }, handleSubmit } = useForm<Trip>();
    const { field: { value: startDate, onChange: setStartDate } } = useController({
        control,
        name: "startDate",
    });

    const { field: { value: endDate, onChange: setEndDate } } = useController({
        control,
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

    const now = dayjs();
    const { formatRange } = useI18nTime();


    const disableCalendar = useMemo(() => Boolean(startDate && endDate && !isDirty), [startDate, endDate, isDirty]);


    return (
        <SafeAreaView style={styles.container} >

            <Animated.ScrollView  >
                {/* // Above calendar */}
                <View className="mx-2 mb-4 p-4 gap-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-xl">📅</Text>
                        {startDate && endDate ? (
                            <View>
                                <Text className="text-lg font-bold capitalize dark:text-white">
                                    {formatRange(dayjs(startDate), dayjs(endDate))}
                                </Text>
                                <Text className="text-base font-normal text-gray-500">
                                    {countDaysBetween(dayjs(startDate), dayjs(endDate))} jours
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-lg font-bold dark:text-white">Aucune date séléctionnée</Text>
                        )}
                    </View>
                    <PollStatus id={id}
                        selectedUser={me}
                    />
                </View>

                <View className="flex-1 m-2 py-5 rounded-xl bg-white dark:bg-gray-900">
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
                            textInactiveColor: colors.textInactiveColor,
                            monthTextColor: colors.text,
                            indicatorColor: colors.text,
                        
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
                                            color: date === startDate || date === endDate ? colors.calendarPrimary : colors.neutral,
                                            textColor: date === startDate || date === endDate ? colors.neutral : colors.text,
                                            selected: true,
                                            disableTouchEvent: true
                                        }
                                    }), {})
                                : {}
                        }
                    />
                </View>

                {/* Action bar below calendar */}
                <View className="flex-rowjustify-center gap-2 mx-2 my-4">
                    {endDate && startDate && isDirty && (
                        <Button
                            variant="contained"
                            title="Modifier"
                            onPress={handleSubmit(onSubmit)} />
                    )}
                    {endDate && startDate && !isDirty && (
                        <Button variant="outlined"
                            title="Réinitialiser"
                            onPress={() => { setStartDate(""); setEndDate(""); }}>

                        </Button>
                    )}
                </View>


            </Animated.ScrollView>
        </SafeAreaView>
    )
}