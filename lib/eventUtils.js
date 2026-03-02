
export const toIcon = (event) => {

    const type = event?.type || "ACTIVITY";
    switch (type) {
        case "MEAL":
            return "suit.spade";
        default:
            return "flame";
    }
}


export const toLabel = (event) => {

    const type = event?.type || "ACTIVITY";
    switch (type) {
        case "MEAL":
            return "repas";
        case "RESTAURANT":
            return "restaurant";
        case "SPORT":
            return "sport";
        case "PARTY":
            return "soirée";
        default:
            return "jeux";
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

