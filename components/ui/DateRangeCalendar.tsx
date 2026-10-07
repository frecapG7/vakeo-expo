// components/ui/DateRangeCalendar.tsx
import { useColorScheme } from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { getDatesBetween } from "@/lib/utils";
import { IconSymbol } from "./IconSymbol";

interface DateRangeCalendarProps {
    startDate?: string;
    endDate?: string;
    onChange: ({ startDate, endDate }: { startDate: string; endDate: string }) => void;
    disabled?: boolean;
}

export const DateRangeCalendar = ({
    startDate: start = "",
    endDate: end = "",
    onChange,
    disabled = false,
}: DateRangeCalendarProps) => {
    const isDark = useColorScheme() === "dark";
    const text = isDark ? "#F6F8FD" : "#16265C";
    const surface = isDark ? "#101736" : "#F6F8FD";
    const muted = isDark ? "rgba(246,248,253,0.35)" : "rgba(22,38,92,0.35)";
    const ink = "#101736";

    const handleDateSelection = (dateString: string) => {
        if (disabled) return;

        const isCurrentSingleDay = start === dateString && end === dateString;
        if (isCurrentSingleDay) {
            onChange({ startDate: "", endDate: "" });
        } else if (start && end && start !== end) {
            onChange({ startDate: dateString, endDate: dateString });
        } else if (start) {
            if (dateString < start) {
                onChange({ startDate: dateString, endDate: start });
            } else {
                onChange({ startDate: start, endDate: dateString });
            }
        } else {
            onChange({ startDate: dateString, endDate: dateString });
        }
    };

    const markedDates = {
        ...(start && start !== end && {
            [start]: {
                startingDay: true,
                color: "#EE8B33",
                textColor: ink,
                selected: true,
                disableTouchEvent: true
            }
        }),
        ...(end && start !== end && {
            [end]: {
                endingDay: true,
                color: "#EE8B33",
                textColor: ink,
                selected: true,
                disableTouchEvent: true
            }
        }),
        ...(start && start === end && {
            [start]: {
                startingDay: true,
                endingDay: true,
                color: "#EE8B33",
                textColor: ink,
                selected: true,
                disableTouchEvent: true
            }
        }),
        ...(start && end && getDatesBetween(dayjs(start), dayjs(end))
            .reduce((acc: Record<string, any>, date) => ({
                ...acc,
                [date]: { color: "rgba(247,183,74,0.35)", textColor: text, selected: true, disableTouchEvent: true }
            }), {})
        )
    };

    return (
        <Calendar
            enableSwipeMonths
            theme={{
                calendarBackground: surface,
                textSectionTitleColor: text,
                dayTextColor: text,
                textSectionTitleDisabledColor: muted,
                selectedDayBackgroundColor: "#EE8B33",
                selectedDayTextColor: ink,
                todayTextColor: "#EE8B33",
                textDisabledColor: muted,
                dotColor: "#EE8B33",
                selectedDotColor: "#F6F8FD",
                arrowColor: "#EE8B33",
                disabledArrowColor: muted,
                monthTextColor: text,
                indicatorColor: "#EE8B33",
                textInactiveColor: muted,
            }}
            markingType="period"
            onDayPress={({ dateString }) => handleDateSelection(dateString)}
            markedDates={markedDates}
            renderArrow={(direction) => (
                <IconSymbol
                    name={direction === 'left' ? 'chevron.left' : 'chevron.right'}
                    size={24}
                    color="#EE8B33"
                />
            )}
        />
    );
};
