import { TripUser } from "@/types/models";
import dayjs from "dayjs";


export const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;



// export const getDatesBetween = (startDate, endDate, inclusive = false) => {
//     const dates = [];
//     if (!startDate || !endDate)
//         return dates;

//     let currentDate = dayjs(startDate)
//     if (!inclusive)
//         currentDate.add(1, 'day');
//     const end = dayjs(endDate);
//     while (currentDate.isBefore(end)) {
//         dates.push(currentDate);
//         currentDate = currentDate.add(1, "day");
//     }
//     if (inclusive)
//         dates.push(end);

//     return dates;
// }

export const containsUser = (user: TripUser, array?: TripUser[]): boolean => {
    return array?.map(u => u._id).includes(String(user._id)) || false;
}

export const countDaysBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs, inclusive: boolean = true) => {
    // Différence en jours
    let diff = endDate.diff(startDate, 'day');
    // Si on veut inclure la date de fin dans le compte
    if (inclusive)
        diff += 1;
    return diff;
}


export const getDatesBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    if (!startDate || !endDate)
        return [];
    const dates = [];
    let currentDate = startDate.add(1, "day");
    while (currentDate.isBefore(endDate)) {
        dates.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.add(1, "day");
    }
    return dates;
}
