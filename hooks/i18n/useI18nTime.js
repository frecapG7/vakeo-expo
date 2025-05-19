const formatDate = (date, format) => {
  if (!date) {
    return "";
  }
  return Intl.DateTimeFormat("fr-FR", {
    // weekday: "long", // Affiche le jour de la semaine en entier
    // year: "", // Affiche l'année
    month: "long", // Affiche le mois en entier
    day: "numeric", // Affiche le jour du mois
  }).format(new Date(date));
};

export default () => {
  return {
    formatDate,
  };
};
