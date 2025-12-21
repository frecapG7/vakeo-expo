
export const toIcon = (event) => {

    const type = event?.type || "ACTIVITY";
    switch (type) {
        case "MEAL":
            return "suit.spade";
        default:
            return "flame";
    }
} 