



export const getPercent = (numerator, denominator) => {
    if (!denominator)
        return 0;

    return numerator / denominator;
}



export const getTypeLabel = (type) => {
    switch (type) {
        case "DATES":
            return "Quelles dates ?";
        case "HOUSING":
            return "Quelles maison ?";
        default:
            return "Type inconnu"
    }
}



export const getStatusLabel = (status) => {
    switch (status) {
        case "OPEN":
            return "En cours";
        case "CLOSED":
            return "Clôturé";
        default:
            return "Statut inconnu"
    }
}