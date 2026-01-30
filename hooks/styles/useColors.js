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
  darkColor: "rgb(28, 28, 30)"
};
const darkColor = {
  background: "#222121",
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