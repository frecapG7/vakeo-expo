import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import '../global.css';


const queryClient = new QueryClient({});


export default function RootLayout() {


  const { colorScheme = "light" } = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "light" ? LightTheme : DarkTheme}>
          <RootNav />
      </ThemeProvider>
    </QueryClientProvider>
  );
}


const RootNav = () => {


  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{
        headerShown: true,
        title: "Mes projets",
      }} />
      <Stack.Screen name="new" options={{
        presentation: "modal",
        title: "Nouveau voyage"
      }}/>
      <Stack.Screen name="join" options={{
        presentation: "modal",
        title: "Rejoins un voyage"
      }}/>
      <Stack.Screen name="[id]" options={{
        title: "Mon voyage",
        headerShown: true
      }} />
    </Stack>
  );
}


const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgba(196, 235, 187, 1)',
    primary: 'rgba(25, 23, 107, 1)',
  }
}
