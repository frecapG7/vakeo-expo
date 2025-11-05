


const formatPercent = (value, digits = 2) => {
    if (!value)
        return "0 %";
    return Intl.NumberFormat("fr-FR", {
        style: "percent",
        maximumFractionDigits: digits
    }).format(value);
}


export default () => {
    return {
        formatPercent
    }
}