import AnimatedCheckbox from "react-native-checkbox-reanimated"



export const Checkbox = ({ checked = false }: { checked: boolean }) => {

    return (
        <AnimatedCheckbox
            checked={checked}
            highlightColor="#b5d4f7"
            checkmarkColor="#483AA0"
            boxOutlineColor="#483AA0"
        />
    )
}