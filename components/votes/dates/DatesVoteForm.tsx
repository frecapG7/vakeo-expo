import useI18nNumbers from "@/hooks/i18n/useI18nNumbers";
import useColors from "@/hooks/styles/useColors";
import { getDatesBetween } from "@/lib/utils";
import { getPercent } from "@/lib/voteUtils";
import { DateVote, TripUser } from "@/types/models";
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


const buildMarkedDays = (votes: DateVote[], user: TripUser) => {

    const result = {};

    votes.forEach(vote => {
        const startDate = dayjs(vote?.startDate);
        const endDate = dayjs(vote?.endDate);

        getDatesBetween(startDate, endDate, true)
            .map(date => dayjs(date).format("YYYY-MM-DD"))
            .forEach((dateKey) => {

                if (!result[dateKey])
                    result[dateKey] = {
                        startingDay: false,
                        endingDay: false,
                        users: [],
                        selected: false
                    }

                vote.users
                    .filter(user => !result[dateKey].users.includes(user._id))
                    .forEach(user => result[dateKey].users.push(user._id))

                if (startDate.format("YYYY-MM-DD") === dateKey)
                    result[dateKey].startingDay = true;
                if (endDate.format("YYYY-MM-DD") === dateKey)
                    result[dateKey].endingDay = true
                if (result[dateKey].users.includes(user._id))
                    result[dateKey].selected = true
            });
    });

    return result
};


const buildCustomDayClassName = (marking, active) => {

    let output = "text-xl rounded-full w-10 h-10 text-center items-center font-bold dark:text-white"

    if (marking?.startingDay)
        output = output + " bg-orange-200 dark:bg-gray-200 dark:text-black";
    if (marking?.endingDay)
        output = output + " bg-orange-400 dark:bg-gray-400";

    if(marking?.selected)
        output = output + " border dark:border-white"

    if(active)
        output = output + " bg-blue-200";
    return output;

}

const CustomDay = ({ date, marking, onPress, theme, percent , active}: { date: DateData, marking?: any, onPress: (day: any) => void, theme?: any, percent: String, active: boolean }) => {

    const className = buildCustomDayClassName(marking, active);

    return (
        <Pressable className="flex items-center justify-center p-2"
            onPress={() => onPress(date)}
            disabled={marking?.selected && !(marking?.startingDay || marking?.endingDay)}

        >
            <Text
                // className={`text-xl rounded-full w-10 h-10 text-center items-center font-bold dark:text-white ${isStartingOrEnding ? "bg-orange-200 dark:bg-gray-200" : ""} ${marking?.selected ? "border dark:border-white" : ""}`}
                className={className}
                style={{
                    // borderColor: marking?.color,
                    // ...((marking?.startingDay || marking?.endingDay) && { backgroundColor: theme?.primary }),
                    // color: marking?.selected ? marking?.textColor : theme?.dayTextColor
                }}>
                {date.day}
            </Text>
            <Text className="text-sm text-black text-center italic dark:text-white">{percent !== "0 %" && percent}</Text>
        </Pressable>
    )
}


export const DatesVoteForm = ({ control, user, disabled = false }: { control: any, user: TripUser, disabled: boolean }) => {

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


    const [activeDate, setActiveDate] = useState<string>("");
    const [selectedStartDate, setSelectedStartDate] = useState();

    const voters = useWatch({
        control,
        name: "voters"
    });
    const nbOfVoters = useMemo(() => {
        return voters?.filter(v => v._id !== user._id)?.length + 1
    }, [voters]);


    const calendarRef = useRef();

    const markedDays = useMemo(() => buildMarkedDays(votes, user, nbOfVoters), [votes]);

    const { formatPercent } = useI18nNumbers();


    return (
        <View>
            {/* <Text>{JSON.stringify(markedDays)}</Text> */}
            <Text>{JSON.stringify(activeDate)}</Text>
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
                    // primary: colors.primary
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
                    if (!activeDate)
                        setActiveDate(dateString);
                    else {

                        const startDate = dayjs(activeDate).startOf("day");
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
                                startDate: startDate,
                                endDate: endDate,
                                users: [user]
                            });
                        }
                        setActiveDate("");

                    }
                }}
                dayComponent={({ date, marking, onPress, theme }) =>
                    <CustomDay
                        date={date}
                        marking={marking}
                        onPress={onPress}
                        theme={theme}
                        percent={formatPercent(getPercent(marking?.users?.length, nbOfVoters), 0)} 
                        active={activeDate === date?.dateString}
                        />
                }


            />
        </View>
    )
}