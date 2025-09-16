import { useColorScheme } from "nativewind";
import { StyleSheet } from "react-native";

// V2 - No colors here
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  },
})

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29AB87",
    padding: 5,
  },
  header: {
    backgroundColor: "#38A169",
    tintColor: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  },
  tabs: {
    backgroundColor: "#38A169",
    tintColor: "#ffffff",
  },
  calendar: {
    calendarBackground: "#29AB87",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 5,
  },
  header: {
    backgroundColor: "#333333",
    tintColor: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  calendar: {
    backgroundColor: "#1a1a1a",
    calendarBackground: "#333333",
    todayTextColor: "#FFFFFF",
    selectedDayBackgroundColor: "#4A90E2",
    selectedDayTextColor: "#000102",
    dayTextColor: "#FFFFFF",
  },
});




const lightColor = {
  background: "rgba(196, 235, 187, 1)",
  primary: "#25b349ff",
  card: 'rgba(177, 230, 165, 1)',
  text: 'rgb(28, 28, 30)',
  border: 'rgb(216, 216, 216)',
  notification: 'rgb(255, 59, 48)',
};
const darkColor = {
  background: "#1a1a1a",
  primary: "#1a1a1a",
  card: "#1a1a1a",
  text: "#ffffff",
  border: "#ffffff",
  notification: "#ffffff"
}

export const useStyles = () => {
  const { colorScheme } = useColorScheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10
    },
    colors: colorScheme === "dark" ? darkColor : lightColor

  })
};
