import { Wordmark } from "@/components/brand/Wordmark";
import useColors from "@/hooks/styles/useColors";
import { useMigrate } from "@/hooks/api/useMigrate";
import '@/lib/calendar-config';
import { DefaultTheme, SplashScreen, Stack, ThemeProvider } from "expo-router";
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { ReactNode, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";
import '../global.css';

Sentry.init({
  dsn: 'https://837ddb9d49c31b44a1245d82bbe43a23@o4510143029837824.ingest.de.sentry.io/4510143037046864',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, see docs: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  // enableLogs: true,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
  // base this on env
  enabled: !__DEV__,
});


const queryClient = new QueryClient({});

// Gate du bootstrap v3 (Phase 2) : désactivé, l'app est 100 % v1 et ne fait
// AUCUN appel réseau au lancement. Activé, la boucle /migrate tourne avant le
// montage de la navigation (voir MigrationGate) — Phase 2 + Phase 3 seront
// livrées dans la même version (cf. plan-migration-v3.md, journal 2026-09-29).
const V3_ENABLED = process.env.EXPO_PUBLIC_V3_ENABLED === "true";

// La boucle ne doit tourner qu'une fois par lancement de l'app, même si le
// layout est remonté (fast refresh) : le promise vit au niveau module.
let migrationRun: Promise<void> | null = null;

const MigrationGate = ({ children, onDone }: { children: ReactNode, onDone: () => void }) => {
  const { mutateAsync } = useMigrate();

  useEffect(() => {
    if (!migrationRun) {
      migrationRun = (async () => {
        try {
          const summary = await mutateAsync();
          console.log(`Migration v3 : ${summary.migrated} migré(s), ${summary.dropped} droppé(s), ${summary.failed} en échec`);
          if (summary.failed > 0)
            console.warn(`Migration v3 : ${summary.failed} trip(s) en échec — retentés au prochain lancement`);
        } catch (err) {
          // On ne bloque jamais l'app sur le bootstrap : les trips non migrés
          // sont resumables (clé méta `migration`, cf. hooks/api/useMigrate.ts).
          console.error("Migration v3 : échec du bootstrap", err);
        }
      })();
    }
    migrationRun.then(onDone);
  }, []);

  // Rien n'est monté pendant la migration : le splash couvre l'écran, et aucun
  // écran ne peut lancer de requête sur des ids en cours de réécriture.
  return null;
};


export default Sentry.wrap(function RootLayout() {

  const colors = useColors();

  const [fontsLoaded, fontError] = useFonts({
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
  });

  // Migration v3 : démarrée au premier rendu (MigrationGate), "done" quand elle
  // est terminée (réussie ou non — jamais de blocage sur le splash).
  const [migrationDone, setMigrationDone] = useState(!V3_ENABLED);

  // Splash masquée quand les polices sont prêtes ET la migration terminée.
  useEffect(() => {
    if ((fontsLoaded || fontError) && migrationDone)
      SplashScreen.hide();
  }, [fontsLoaded, fontError, migrationDone]);


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
              {migrationDone ? (
                <RootNav />
              ) : (
                <MigrationGate onDone={() => setMigrationDone(true)}>
                  <RootNav />
                </MigrationGate>
              )}

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
