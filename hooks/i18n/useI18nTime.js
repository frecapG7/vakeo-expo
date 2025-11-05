
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
      month: "long"
    })
  if (months < 1)
    return `${formatDate2(start, {
      weekday: "long",
      day: "numeric"
    })} - ${formatDate2(end, {
      weekday: "long",
      day: "numeric",
      month: "long"
    })}`;

  if (years < 1)
    return `${formatDate2(start, {
      weekday: "long",
      day: "numeric",
      month: "long"
    })} - ${formatDate2(end, {
      weekday: "long",
      day: "numeric",
      month: "long"
    })}`;


  return `${formatDate2(start, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })} - ${formatDate2(end, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
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
    formatDuration
  };
};
