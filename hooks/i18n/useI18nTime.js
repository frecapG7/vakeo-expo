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
  return Intl.DateTimeFormat("fr-FR", {
    weekday: "long", 
    month: "long", // Affiche le mois en entier
    day: "numeric", // Affiche le jour du mois
  }).formatRange(new Date(startDate), new Date(endDate));
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


// Create an instance of Intl.RelativeTimeFormat
const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

// Helper function to calculate relative time
export const formatDuration = (startDate, endDate = new Date() ) => {
  if(!startDate)
    return "";
  const diff = new Date(endDate) - new Date(startDate);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

  if (seconds < 60) {
    return rtf.format(-seconds, "second");
  } else if (minutes < 60) {
    return rtf.format(-minutes, "minute");
  } else if (hours < 24) {
    return rtf.format(-hours, "hour");
  } else if (days < 7) {
    return rtf.format(-days, "day");
  } else if (weeks < 4) {
    return rtf.format(-weeks, "week");
  } else if (months < 12) {
    return rtf.format(-months, "month");
  } else {
    return rtf.format(-years, "year");
  }
};



export default () => {
  //TODO: use locale
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
