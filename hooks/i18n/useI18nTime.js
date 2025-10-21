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



export default () => {
  //TODO: use locale
  return {
    formatDate,
    formatHour,
    formatDay,
    getDayName,
    getDayNumber,
    getMonthName,
    getTime
  };
};
