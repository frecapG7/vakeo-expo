import AnimatedCheckbox from "react-native-checkbox-reanimated"

export const Checkbox = ({ checked = false }: { checked: boolean }) => {

    return (
        <AnimatedCheckbox
            checked={checked}
            highlightColor="#F7B74A"
            checkmarkColor="#EE8B33"
            boxOutlineColor="#EE8B33"
        />
    )
}
