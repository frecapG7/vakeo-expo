import { Wordmark } from "@/components/brand/Wordmark";
import useColors from "@/hooks/styles/useColors";
import '@/lib/calendar-config';
import { DefaultTheme, SplashScreen, Stack, ThemeProvider } from "expo-router";
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";
import '../global.css';

Sentry.init({
  dsn: 'https://837ddb9d49c31b44a1245d82bbe43a23@o4510143029837824.ingest.de.sentry.io/4510143037046864',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, see: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  // enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
  // base this on env
  enabled: !__DEV__,
});


const queryClient = new QueryClient({});


export default Sentry.wrap(function RootLayout() {

  const colors = useColors();

  const [fontsLoaded, fontError] = useFonts({
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
  });

  // Splash masquée dès que les polices sont prêtes (ou en échec) — remplace l'ancien setTimeout(3000).
  useEffect(() => {
    if (fontsLoaded || fontError)
      SplashScreen.hide();
  }, [fontsLoaded, fontError]);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider value={colorScheme === "light" ? LightTheme : DarkTheme}> */}
        <ThemeProvider value={{
          ...DefaultTheme,
          colors
        }}>
          <SafeAreaProvider>
            <MenuProvider>
              <RootNav />

              <ToastManager />
            </MenuProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
});


const RootNav = () => {


  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{
        headerShown: true,
        headerTitle: () => <Wordmark size={22} />,
        headerTitleAlign: "center",
      }} />
      <Stack.Screen name="new"
        options={{
          headerShown: false,
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
