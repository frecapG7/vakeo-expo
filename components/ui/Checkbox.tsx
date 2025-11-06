import AnimatedCheckbox from "react-native-checkbox-reanimated"



export const Checkbox = ({ checked = false }: { checked: boolean }) => {

    return (
        <AnimatedCheckbox
            checked={checked}
            highlightColor="#4444ff"
            checkmarkColor="#483AA0"
            boxOutlineColor="#4444ff"
        />
    )
}