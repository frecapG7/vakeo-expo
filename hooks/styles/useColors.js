import { useColorScheme } from "nativewind";


const lightColor = {
//   background: "rgba(196, 235, 187, 1)",
  background: "rgba(255, 255, 255, 1)",
  primary: "#rgba(245, 149, 5, 1)",
  card: 'rgba(163, 225, 253, 1)',
  text: 'rgb(28, 28, 30)',
  border: 'rgb(216, 216, 216)',
  notification: 'rgb(255, 59, 48)',
  neutral: "#rgba(245, 214, 168, 1)",
  darkColor: "rgb(28, 28, 30)"
};
const darkColor = {
  background: "#1a1a1a",
  primary: "#rgba(255, 255, 255, 1)",
  card: "#1a1a1a",
  text: "#ffffff",
  border: "#ffffff",
  notification: "#ffffff",
  neutral: "#3c3d3cff"
}

const useColors = () => {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? darkColor : lightColor;
};

export default useColors;