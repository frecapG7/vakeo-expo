import { StyleSheet } from "react-native";




const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    },
    bottomSheet: {
        flex: 1,
        // padding: 36,
        // alignItems: 'center'
    },
    image: {
        flex: 1,
        borderRadius: 10
    },
    headerTitle: {
        fontWeight: "bold",
        fontSize: 25,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    textInput: {
        // backgroundColor: "grey",
        color: "black",
        textAlign: "left",
        textTransform: "capitalize"
    }
});


export default styles;