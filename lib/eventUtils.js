export const toIcon = (event) => {
    const type = event?.type || "ACTIVITY";
    switch (type) {
        case "MEAL":
            return "suit.spade";
        case "TRANSPORT":
            return "map";
        case "EXCURSION":
            return "smiley";
        case "OTHER":
            return "star";
        default:
            return "flame";
    }
}

export const toLabel = (event) => {
    const type = event?.type || "ACTIVITY";
    switch (type) {
        case "MEAL": return "repas";
        case "RESTAURANT": return "restaurant";
        case "SPORT": return "sport";
        case "PARTY": return "soirée";
        case "TRANSPORT": return "transport";
        case "EXCURSION": return "excursion";
        case "OTHER": return "autre";
        default: return "activité";
    }
}


export const translateRestriction = (value) => {

    switch (value) {
        case "hasHalal":
            return "Halal";
        case "hasKasher":
            return "Kasher";
        case "hasNoPork":
            return "Pas de porc";
        case "hasVegan":
            return "Végan";
        case "hasNoAlcohol":
            return "Sans alcool";
        default:
            return value;
    }

}