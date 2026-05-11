
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timeZone from "dayjs/plugin/timezone";
dayjs.extend(relativeTime);
dayjs.extend(timeZone);
dayjs.extend(duration);
dayjs.tz.setDefault("Etc/GMT")
// dayjs.locale("fr-FR")

const formatDate = (
  date,
  options = {
    day: "numeric",
    year: "numeric", // Affiche l'année
    month: "numeric", // Affiche le mois en entier
  }
) => {
  if (!date) {
    return "";
  }
  return Intl.DateTimeFormat("fr-FR", options).format(new Date(date));
};
const formatDate2 = (
  date,
  options
) => {
  if (!date) {
    return "";
  }
  return Intl.DateTimeFormat("fr-FR", options).format(new Date(date));
};

const formatHour = (date, format) => {
  if (!date) return "";
  return Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit", // Affiche l'heure au format 2 chiffres
    minute: "2-digit", // Affiche les minutes au format 2 chiffres
    timeZone: "Europe/Paris", // Définit le fuseau horaire
  }).format(new Date(date));
};

const formatDay = (date) => {
  if (!date) return "";

  return Intl.DateTimeFormat("fr-FR", {
    weekday: "long", // Affiche le jour de la semaine en entier
    month: "long", // Affiche le mois en entier
    day: "numeric", // Affiche le jour du mois
  }).format(new Date(date));
};



const formatRange = (startDate, endDate, options) => {
  if (!startDate || !endDate)
    return "";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end - start;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));


  if (days < 1)
    return formatDate2(start, {
      weekday: "long",
      day: "numeric",
      month: "long",
      ...(!options?.hideYear && { year: "numeric" })
    })
  if (months < 1)
    return `${formatDate2(start, {
      weekday: "long",
      day: "numeric"
    })} - ${formatDate2(end, {
      weekday: "long",
      day: "numeric",
      month: "long",
      ...(!options?.hideYear && { year: "numeric" })
    })}`;

  if (years < 1)
    return `${formatDate2(start, {
      weekday: "long",
      day: "numeric",
      month: "long"
    })} - ${formatDate2(end, {
      weekday: "long",
      day: "numeric",
      month: "long",
      ...(!options?.hideYear && { year: "numeric" })
    })}`;


  return `${formatDate2(start, {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(!options?.hideYear && { year: "numeric" })
  })} - ${formatDate2(end, {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(!options?.hideYear && { year: "numeric" })
  })}`;


}


const getDayName = (date) => {
  return formatDate2(date, {
    weekday: "long"
  });
}

const getDayNumber = (date) => {
  return formatDate2(date, {
    day: "2-digit"
  });
}

const getMonthName = (date) => {
  return formatDate2(date, {
    month: "long"
  });
}

const getTime = (date) => {
  return formatDate2(date, {
    hour: "2-digit",
    minute: "2-digit"
  })
}




// Helper function to calculate relative time
const formatDuration = (startDate, endDate = new Date()) => {
  if (!startDate)
    return "";

  return dayjs(startDate).from(dayjs(endDate))
};

/**
 * Simple duration formatter that works across all languages
 * Format: "2h 30min" or "45min"
 * @param {Date|string} startDate - Start date/time
 * @param {Date|string} endDate - End date/time (default: now)
 * @returns {string} Formatted duration string
 * Compact version without space: "2h30min"
 */
const formatDurationCompact = (startDate, endDate = new Date()) => {
  if (!startDate || !endDate) return "";

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const duration = dayjs.duration(end.diff(start));

  const hours = duration.hours();
  const minutes = duration.minutes();

  if (hours > 0) {
    return minutes > 0
      ? `${hours}h${minutes}min`
      : `${hours}h`;
  }
  return `${minutes}min`;
};



export default () => {
  //TODO: use locale

  dayjs.locale("fr");
  return {
    formatDate,
    formatHour,
    formatDay,
    formatRange,
    getDayName,
    getDayNumber,
    getMonthName,
    getTime,
    formatDuration,
    formatDurationCompact
  };
};

