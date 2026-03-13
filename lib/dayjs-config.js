// dayjs-config.js
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.tz.setDefault("Etc/GMT"); // Configuration globale

export default dayjs;