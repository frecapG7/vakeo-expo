import { StyleSheet } from "react-native";


export const popupMenuStyles = (colors) => ({
  optionsContainer: {
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
    width: 220,
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  optionWrapper: {
    margin: 4,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 5,
        paddingHorizontal: 5 
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
    headerSubTitle: {
        fontSize: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        // textShadowOffset: { width: 1, height: 1 },
        // textShadowRadius: 3,
    },
    textInput: {
        // backgroundColor: "grey",
        color: "black",
        textAlign: "left",
        // minHeight: 20,
        // maxHeight: 50,
        // height: 140,
        width: "100%"
        // textTransform: "capitalize"
    }
});


export default styles;