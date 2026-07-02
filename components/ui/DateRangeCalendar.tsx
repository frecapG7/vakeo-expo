// components/ui/DateRangeCalendar.tsx
import { Calendar } from "react-native-calendars";
import { IconSymbol } from "./IconSymbol";
import useColors from "@/hooks/styles/useColors";
import dayjs from "dayjs";
import { getDatesBetween } from "@/lib/utils";

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
    const colors = useColors();

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
        ...(start && {
            [start]: {
                startingDay: true,
                color: '#fdb140',
                textColor: colors.neutral,
                selected: true,
                disableTouchEvent: true
            }
        }),
        ...(end && {
            [end]: {
                endingDay: true,
                color: '#fdb140',
                textColor: colors.neutral,
                selected: true,
                disableTouchEvent: true
            }
        }),
        ...(start && end && getDatesBetween(dayjs(start), dayjs(end))
            .filter(d => d !== start && d !== end)
            .reduce((acc: Record<string, any>, date) => ({
                ...acc,
                [date]: { color: colors.neutral, textColor: colors.text, selected: true, disableTouchEvent: true }
            }), {})
        )
    };

    return (
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
                textInactiveColor: colors.textInactiveColor,
            }}
            markingType="period"
            onDayPress={({ dateString }) => handleDateSelection(dateString)}
            markedDates={markedDates}
            renderArrow={(direction) => (
                <IconSymbol
                    name={direction === 'left' ? 'chevron.left' : 'chevron.right'}
                    size={24}
                    color={colors.primary}
                />
            )}
        />
    );
};