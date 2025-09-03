import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import '../global.css';


const queryClient = new QueryClient({});


export default function RootLayout() {


  const { colorScheme = "light" } = useColorScheme();


  const [loaded, setLoaded] = useState(false);


  // TODO: setLoaded to true when font or else are all loaded
  useEffect(() => {
    setTimeout(() => setLoaded(true), 3000);
  }, [setLoaded]);


  useEffect(() => {
    if(loaded)
      SplashScreen.hide();
  }, [loaded]);


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
