import { LocaleConfig } from "react-native-calendars";

// Locale française de react-native-calendars. À importer (side-effect) par tout écran qui affiche un <Calendar> localisé.
LocaleConfig.locales["fr"] = {
    monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthNamesShort: ["Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."],
    dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    dayNamesShort: ["DIM.", "LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM."],
    today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";
