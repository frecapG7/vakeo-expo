import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import useColors from "@/hooks/styles/useColors";
import { getDatesBetween } from "@/lib/utils";
import { getPercent } from "@/lib/voteUtils";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import { DayProps } from "react-native-calendars/src/calendar/day";

interface CustomDayProps extends DayProps {
}


const CustomDay: React.FC<CustomDayProps> = ({ date, marking, onPress, theme }: { date: DateData, marking?: any, onPress: (day: any) => void, theme ?: any }) => {

    const { formatPercent } = useI18nNumbers();

    return (
        <Pressable className="p-1 flex items-center justify-center" onPress={() => onPress(date)} >
            <Text className="text-xl rounded-full p-2 dark:text-white"
                style={{
                    backgroundColor: marking?.color,
                    color: marking?.textColor || theme?.dayTextColor
                }} >
                {date.day}
            </Text>
            {marking?.percent &&
                <Text className="text-sm text-black text-center dark:text-white">{formatPercent(marking?.percent, 0)}</Text>
            }
        </Pressable>
    )
}


export const DatesVoteForm = ({ control, user }: { control: any, user: any }) => {

    const colors = useColors();

    const { fields: votes, append } = useFieldArray({
        control,
        name: "votes"
    });
    const [selectedStartDate, setSelectedStartDate] = useState();

    const voters = useWatch({
        control,
        name: "voters"
    });
    const nbOfVoters = useMemo(() => {
        if (!voters)
            return 1 // ME

        return voters.filter(v => v._id !== user._id)?.length + 1
    }, [voters]);


    const markedDays = useMemo(() => {
        const result = {};

        if (!!selectedStartDate) {
            result[selectedStartDate.format("YYYY-MM-DD")] = {
                startingDay: true,
                selected: true,
                color: colors.primary,
                textColor: colors.neutral,
                disableTouchEvent: true,

            }
        }

        votes.forEach((vote) => {
            result[dayjs(vote.startDate)?.format("YYYY-MM-DD")] = {
                startingDay: true,
                selected: true,
                color: colors.primary,
                textColor: colors.neutral,
                disableTouchEvent: true,
                nbOfVotes: vote.users.length,
                percent: getPercent(vote.users.length, nbOfVoters)

            };
            result[dayjs(vote.endDate)?.format("YYYY-MM-DD")] = {
                endingDay: true,
                selected: true,
                color: colors.primary,
                textColor: colors.neutral,
                disableTouchEvent: true,
                nbOfVotes: vote.users.length,
                percent: getPercent(vote.users.length, nbOfVoters)

            }
            getDatesBetween(vote.startDate, vote.endDate, false)
                .map(date => date?.format('YYYY-MM-DD'))
                .filter(v => v !== dayjs(vote.startDate).format("YYYY-MM-DD") && v !== dayjs(vote.endDate).format("YYYY-MM-DD"))
                .forEach(day => {
                    result[day] = {
                        color: colors.neutral,
                        textColor: colors.text,
                        selected: true,
                        disableTouchEvent: true,
                        nbOfVotes: vote.users.length,
                        percent: getPercent(vote.users.length, nbOfVoters)
                    }

                });
        });
        return result;
    }, [votes, selectedStartDate])



    return (
        <View>
            <CalendarList
                theme={{
                    backgroundColor: colors.background,
                    calendarBackground: colors.background,
                    textSectionTitleColor: colors.text,
                    dayTextColor: colors.text,
                    textSectionTitleDisabledColor: '#d9e1e8',
                    selectedDayBackgroundColor: '#00adf5',
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
                // onDayPress={({ dateString }) => onDayPress && onDayPress(dayjs(dateString))}
                markingType="period"
                minDate={dayjs().toISOString()}
                // minDate={start ? start : now.toISOString()}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={6}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={6}
                // Enable or disable scrolling of calendar list
                scrollEnabled={true}
                // Enable or disable vertical scroll indicator. Default = false
                showScrollIndicator={true}
                markedDates={markedDays}
                onDayPress={({ dateString }) => {
                    if (!selectedStartDate)
                        setSelectedStartDate(dayjs(dateString).startOf("day"))
                    else {
                        append({
                            startDate: selectedStartDate,
                            endDate: dayjs(dateString).endOf("day"),
                            users: [user]
                        });
                        setSelectedStartDate(null);

                    }
                }}
                dayComponent={CustomDay}

            />
        </View>
    )
}