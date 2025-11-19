import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import useColors from "@/hooks/styles/useColors";
import { getDatesBetween } from "@/lib/utils";
import { getPercent } from "@/lib/voteUtils";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import { DayProps } from "react-native-calendars/src/calendar/day";
var minMax = require("dayjs/plugin/minMax");
dayjs.extend(minMax);

interface CustomDayProps extends DayProps {
}



const setMarkedDay = (markedDay, previousMarkedDays) => {

    const previousMarkedDay = previousMarkedDays[markedDay?.day];
    return {
        ...previousMarkedDays,
        [markedDay.day]: {
            startingDay: markedDay.startingDay,
            endingDay: markedDay.endingDay,
            selected: true,
            color: markedDay.color,
            textColor: markedDay.textColor,
            disableTouchEvent: markedDay.disableTouchEvent,
            nbOfVoters: markedDay.nbOfVoters,
            users: previousMarkedDay ? [...new Set([...previousMarkedDay.users, ...markedDay?.users])] : [...markedDay?.users]

        }
    }


}

const setResult = (date, prevResult, user, options) => {
    const result = prevResult[date.format("YYYY-MM-DD")] || {
        voters: [],
        ...options
    };
    result.voters?.push(user);
    return result;
}


const CustomDay: React.FC<CustomDayProps> = ({ date, marking, onPress, theme }: { date: DateData, marking?: any, onPress: (day: any) => void, theme?: any }) => {

    const { formatPercent } = useI18nNumbers();

    const percent = marking?.nbOfVoters ? getPercent(marking?.users?.length, marking?.nbOfVoters) : 0;

    return (
        <Pressable className="flex items-center justify-center p-2"
            onPress={() => onPress(date)}>
            <Text className={`text-xl rounded-full w-10 h-10 text-center items-center font-bold dark:text-white ${marking?.color && "border"}`}
                style={{
                    borderColor: marking?.color,
                    ...(marking?.selected && { backgroundColor: marking?.color }),
                    color: marking?.selected ? marking?.textColor : theme?.dayTextColor
                }}>
                {date.day}
            </Text>
            <Text className="text-sm text-black text-center italic dark:text-white">{percent ? formatPercent(percent, 0) : ""}</Text>
        </Pressable>
    )
}


export const DatesVoteForm = ({ control, user, disabled = false }: { control: any, user: any, disabled: boolean }) => {

    const colors = useColors();

    const { fields: votes, append, update } = useFieldArray({
        control,
        name: "votes",
        rules: {
            minLength: 1
        }
    });
    const minDate = useMemo(() => {
        if (votes?.length > 0)
            return dayjs.min(votes.map(v => dayjs(v.startDate).startOf("day")));
        return dayjs().startOf("day");
    }, [votes]);


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


    const calendarRef = useRef();

    const markedDays = useMemo(() => {
        let result: Record<string, any> = {};

        if (!!selectedStartDate)
            result = setMarkedDay({
                day: selectedStartDate.format("YYYY-MM-DD"),
                selected: true,
                color: colors.primary,
                textColor: colors.neutral,
                disableTouchEvent: true,
                nbOfVoters,
                users: [user]
            }, result)


        votes.forEach((vote) => {
            const selected = vote?.users.map(u => u._id).includes(user._id);

            result = setMarkedDay({
                day: dayjs(vote.startDate)?.format("YYYY-MM-DD"),
                selected: selected,
                color: colors.primary,
                textColor: colors.neutral,
                nbOfVoters,
            }, result);

            result = setMarkedDay({
                day: dayjs(vote.endDate)?.format("YYYY-MM-DD"),
                endingDay: true,
                selected: selected,
                color: colors.primary,
                textColor: colors.neutral,
                nbOfVoters,
            }, result);



            getDatesBetween(vote.startDate, vote.endDate, false)
                .filter(date => !dayjs(date).isSame(vote.startDate, "day") && !dayjs(date).isSame(vote.endDate, "day"))
                .map(date => date?.format('YYYY-MM-DD'))
                // .filter(v => v !== dayjs(vote.startDate).format("YYYY-MM-DD") && v !== dayjs(vote.endDate).format("YYYY-MM-DD"))
                // .forEach(day => {
                //     result[day] = {
                //         color: colors.neutral,
                //         textColor: colors.text,
                //         selected: selected,
                //         nbOfVoters,
                //         users: result[day] ? [...new Set([...result[day]?.users, ...vote?.users])] : [...vote?.users]

                //     }
                // });
                .forEach((day) => setMarkedDay({
                    day,
                    selected,
                    nbOfVoters,
                    users: vote?.users
                }, result));
        });
        return result;
    }, [votes, selectedStartDate])


    return (
        <View>
            <Text>{nbOfVoters}</Text>
            <CalendarList
                ref={calendarRef}
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
                markingType="period"
                minDate={dayjs(minDate).toISOString()}
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={1}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={6}
                // Enable or disable scrolling of calendar list
                scrollEnabled={true}
                // Enable or disable vertical scroll indicator. Default = false
                showScrollIndicator={true}
                markedDates={markedDays}
                onDayPress={({ dateString }) => {
                    if (disabled)
                        return;
                    if (!selectedStartDate)
                        setSelectedStartDate(dayjs(dateString).startOf("day"))
                    else {

                        const startDate = selectedStartDate;
                        const endDate = dayjs(dateString).endOf("day");

                        const index = votes?.findIndex(v => dayjs(startDate).isSame(v?.startDate) && endDate.isSame(v.endDate));
                        if (index !== -1) {
                            const newArray = votes[index]?.users;
                            newArray.push(user);
                            update(index, {
                                startDate,
                                endDate,
                                users: newArray
                            });
                        } else {
                            append({
                                startDate: selectedStartDate,
                                endDate: dayjs(dateString).endOf("day"),
                                users: [user]
                            });
                        }
                        setSelectedStartDate(null);

                    }
                }}
                dayComponent={CustomDay}

            />
        </View>
    )
}