import useColors from "@/hooks/styles/useColors";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import '../global.css';

Sentry.init({
  dsn: 'https://837ddb9d49c31b44a1245d82bbe43a23@o4510143029837824.ingest.de.sentry.io/4510143037046864',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,
  
  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
  
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,

  // base this on env
  enabled: false,
});


const queryClient = new QueryClient({});


export default Sentry.wrap(function RootLayout() {

  const colors = useColors();

  const [loaded, setLoaded] = useState(false);

  // TODO: setLoaded to true when font or else are all loaded
  useEffect(() => {
    setTimeout(() => setLoaded(true), 3000);
  }, [setLoaded]);


  useEffect(() => {
    if (loaded)
      SplashScreen.hide();
  }, [loaded]);


  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider value={colorScheme === "light" ? LightTheme : DarkTheme}> */}
        <ThemeProvider value={{
          ...DefaultTheme,
          colors
        }}>
          <SafeAreaProvider>
            <RootNav />
          </SafeAreaProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <Toast/>
    </>
  );
});


const RootNav = () => {


  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{
        headerShown: true,
        title: "Mes projets",
      }} />
      <Stack.Screen name="new" options={{
        title: "Nouveau voyage",
        headerBackTitle: "Annuler"
      }} />
      <Stack.Screen name="join" options={{
        title: "Rejoins un voyage",
        headerBackTitle: "Annuler"
      }} />
      <Stack.Screen name="[id]" options={{
        title: "Mon voyage",
        headerShown: false
      }} />
      <Stack.Screen name="token" options={{ headerShown: false }} />
    </Stack>
  );
}