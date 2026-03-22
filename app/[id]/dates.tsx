import { AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LinearProgress } from "@/components/ui/LinearProgress";
import styles from "@/constants/Styles";
import { useGetPolls } from "@/hooks/api/usePolls";
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
    const { data: pagePoll } = useGetPolls(id, { type: "DatesPoll" });
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

    const now = dayjs();
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
                    <View className="flex-row justify-between items-center bg-white dark:bg-gray-900 rounded-xl p-2 py-4 gap-2">
                        <View className="flex-row gap-1 items-center max-w-[80%] overflow-hidden">
                            <View className="p-1 bg-blue-100 rounded-xl">
                                <IconSymbol name="calendar" color="blue" size={34} />
                            </View>
                            <View>
                                {(startDate && endDate) &&
                                    <View>
                                        <Text className="capitalize font-bold dark:text-white" numberOfLines={3}>
                                            {formatRange(dayjs(startDate), dayjs(endDate))}
                                        </Text>
                                        <Text className="text-gray-400">
                                            {countDaysBetween(dayjs(startDate), dayjs(endDate))} jours
                                        </Text>
                                    </View>
                                }
                            </View>
                        </View>
                        {/* <View className="flex-row gap-1 "> */}
                        {(endDate && startDate) &&
                            <Animated.View
                                entering={FadeIn}
                                exiting={FadeOut}
                                className="flex">
                                {isDirty ?
                                    <Pressable
                                        disabled={updateTrip.isPending}
                                        onPress={handleSubmit(onSubmit)}
                                        className="bg-blue-400 rounded-xl p-2">
                                        {updateTrip.isPending ?
                                            <ActivityIndicator /> :
                                            <Text className="text-white text-xs">
                                                Modifier
                                            </Text>
                                        }
                                    </Pressable>
                                    :
                                    <Pressable
                                        className="bg-gray-400 rounded-xl p-2 items-center flex-0"
                                        onPress={() => {
                                            setEndDate("");
                                            setStartDate("");
                                        }}>
                                        <IconSymbol name="trash" color="white" />
                                    </Pressable>
                                }
                            </Animated.View>
                        }
                        {/* </View> */}
                    </View>
                </View>
                {pagePoll?.totalResults !== 0 &&
                    <View className="">
                        {/* <Text className="font-bold text-2xl dark:text-white">
                            Sondages
                        </Text> */}
                        {pagePoll?.polls.map(poll => (
                            <Pressable
                                key={poll._id}
                                onPress={() => router.navigate({
                                    pathname: "/[id]/polls/[pollId]",
                                    params: {
                                        id: String(id),
                                        pollId: poll._id
                                    }
                                })}
                                className="p-2 bg-white dark:bg-gray-900 rounded-xl">
                                <View className="flex-row justify-between">
                                    <View className="flex-row">
                                        <IconSymbol name="chart.bar.fill" color="orange" />
                                        <Text className="dark:text-white text-lg font-bold">
                                            {poll.question}
                                        </Text>
                                    </View>
                                    <Text className="text-orange-600 border border-orange-600 rounded-full px-2 bg-orange-200">
                                        {countDaysBetween(dayjs(poll.createdAt), now)}j
                                    </Text>
                                </View>
                                <View>
                                    {poll.options.slice(0, 3).map((option) =>
                                        <View className="gap-1 justify-start mt-2" key={option._id}>
                                            <View className="flex-row items-center justify-between ">
                                                <Text className="dark:text-white text-xs max-w-[80%] capitalize" numberOfLines={3}>
                                                    {formatRange(dayjs(option.startDate), dayjs(option.endDate))}
                                                </Text>
                                                <Text className="font-bold text-orange-400">
                                                    {Number(option.percent).toFixed()} %
                                                </Text>
                                            </View>
                                            <LinearProgress progress={option.percent / 100} />
                                            <View className="flex-row items-center gap-5">
                                                {poll.isAnonymous ?
                                                    <Text className="text-gray-400">
                                                        {option.selectedBy?.length} votes
                                                    </Text>
                                                    :
                                                    <AvatarsGroup
                                                        avatars={option.selectedBy?.map(u => ({
                                                            avatar: u?.avatar,
                                                            alt: u?.name?.charAt(0)
                                                        }))}
                                                        size2="xs"
                                                        maxLength={5}
                                                    />
                                                }
                                            </View>
                                        </View>
                                    )}
                                </View>
                                <View className="flex-row justify-end my-2 items-center gap-2">
                                    <IconSymbol name="person.2.fill" color="gray" />
                                    <Text className="text-gray-400">
                                        {poll.hasSelected.length}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                }
                {pagePoll?.totalResults === 0 &&
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
                }
            </View>
        </Animated.ScrollView>
    )
}