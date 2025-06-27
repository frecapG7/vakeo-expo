import { useColorScheme } from "nativewind";
import { StyleSheet } from "react-native";

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

export const useStyles = () => {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? darkStyles : lightStyles;
};
