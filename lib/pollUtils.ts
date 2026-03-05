

export const translateType = (type: string)  => {



  switch (type) {
        case "DatesPoll":
            return "dates";
        case "HousingPoll":
            return "hébergement";
        default:
            return "type inconnu"
    }

} 