import { TripUser } from "@/types/models";
import dayjs from "dayjs";





export const getDatesBetween = (startDate, endDate, inclusive = false) => {
    const dates = [];
    if (!startDate || !endDate)
        return dates;

    let currentDate = dayjs(startDate)
    if (!inclusive)
        currentDate.add(1, 'day');
    const end = dayjs(endDate);
    while (currentDate.isBefore(end)) {
        dates.push(currentDate);
        currentDate = currentDate.add(1, "day");
    }
    if (inclusive)
        dates.push(end);

    return dates;
}

export const containsUser = (user: TripUser, array?: TripUser[]): boolean => {
    return array?.map(u => u._id).includes(String(user._id)) || false;
}