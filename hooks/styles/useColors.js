import { useColorScheme } from "nativewind";


const lightColor = {
//   background: "rgba(196, 235, 187, 1)",
  background: "rgba(238, 247, 236, 1)",
  primary: "#25b349ff",
  card: 'rgba(177, 230, 165, 1)',
  text: 'rgb(28, 28, 30)',
  border: 'rgb(216, 216, 216)',
  notification: 'rgb(255, 59, 48)',
  neutral: "#90cfa0ff"
};
const darkColor = {
  background: "#1a1a1a",
  primary: "#087223ff",
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