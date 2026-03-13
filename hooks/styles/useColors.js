import { useColorScheme } from "nativewind";


const lightColor = {
  //   background: "rgba(196, 235, 187, 1)",
  background: "rgb(250, 247, 220)",
  primary: "#rgb(43, 139, 248)",
  card: 'rgb(255, 255, 255)',
  text: 'rgb(28, 28, 30)',
  border: 'rgb(216, 216, 216)',
  notification: 'rgb(255, 59, 48)',
  neutral: "#rgb(241, 234, 222)",
  darkColor: "rgb(28, 28, 30)",
  calendarBackground: "#rgba(255, 255, 255, 1)",
  calendarPrimary: "#rgb(248, 146, 29)"
};
const darkColor = {
  background: "#222121",
  primary: "#rgba(255, 255, 255, 1)",
  card: "#1a1a1a",
  text: "#ffffff",
  border: "#ffffff",
  notification: "#ffffff",
  neutral: "#3c3d3cff",
  calendarBackground: "#101828",
  calendarPrimary: "#rgb(245, 193, 133)"
}

const useColors = () => {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? darkColor : lightColor;
};

export default useColors;