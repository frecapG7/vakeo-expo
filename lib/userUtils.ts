

export const translateRestriction = (restriction: string): string => {

    switch (restriction) {
        case 'hasHalal':
            return "Halal";
        case 'hasKasher':
            return "Kasher";
        case "hasNoAlcohol":
            return "sans alcool";
        case "hasNoPork":
            return "sans porc"
        case "hasVegan":
            return "vegan"
        default:
            return restriction
    }
}