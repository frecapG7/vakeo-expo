



export const getPercent = (numerator, denominator) => {
    if (!denominator)
        return 0;

    return numerator / denominator;
}


export const getVoteLabel = (vote) => {
    if (vote?.status === "CLOSED")
        return `${vote?.createdBy.name} a voté ${getTypeLabel(vote.type)}`;
    return `${vote?.createdBy.name} veut voter ${getTypeLabel(vote.type)}`;
}


export const getTypeLabel = (type) => {
    switch (type) {
        case "DATES":
            return "les dates";
        case "HOUSING":
            return "quelles maison ?";
        default:
            return "type inconnu"
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