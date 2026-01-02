
export const toIcon = (event) => {

    const type = event?.type || "ACTIVITY";
    switch (type) {
        case "MEAL":
            return "suit.spade";
        default:
            return "flame";
    }
}


export const toLabel = (event) =>  {
    
    const type = event?.type || "ACTIVITY";
    switch (type) {
        case "MEAL":
            return "repas";
        default:
            return "activité";
    }
}