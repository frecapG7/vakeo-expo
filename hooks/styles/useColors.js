import { useColorScheme } from "nativewind";


const lightColor = {
//   background: "rgba(196, 235, 187, 1)",
  background: "rgba(234, 248, 231, 1)",
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

const useColors = () => {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? darkColor : lightColor;
};

export default useColors;