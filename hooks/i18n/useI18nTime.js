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

export default () => {
  //TODO: use locale
  return {
    formatDate,
    formatHour,
    formatDay,
  };
};
