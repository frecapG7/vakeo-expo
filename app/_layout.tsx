import { Wordmark } from "@/components/brand/Wordmark";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import useColors from "@/hooks/styles/useColors";
import { useMigrate, hasPendingMigrations } from "@/hooks/api/useMigrate";
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

// Bootstrap v3 inconditionnel : la boucle /migrate tourne avant le montage
// de la navigation (voir MigrationGate). No-op sans trips v1 en storage
// (preflight hasPendingMigrations, zéro réseau). L'ancienne gate
// EXPO_PUBLIC_V3_ENABLED est retirée : le front est 100 % v3, un build
// sans migration cassait les voyages existants au lieu de les protéger.

// La boucle ne doit tourner qu'une fois par lancement de l'app, même si le
// layout est remonté (fast refresh) : le promise vit au niveau module.
let migrationRun: Promise<void> | null = null;

const MigrationGate = ({ children, onDone }: { children: ReactNode, onDone: () => void }) => {
  const { mutateAsync } = useMigrate();

  useEffect(() => {
    try {
      // Dev : les full reloads Metro remontent la gate alors qu'il n'y a plus
      // rien à migrer — pas de mutation, pas de log, splash levée immédiatement.
      // Si le log apparaît, c'est qu'il y a du vrai travail (ou des échecs à retenter).
      if (!hasPendingMigrations()) {
        onDone();
        return;
      }
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
    } catch (err) {
      // Contrat de la gate : quoi qu'il arrive, l'app démarre (splash levée).
      // Un preflight qui jette (stockage illisible, shape inattendue…) ne doit
      // jamais briquer le lancement — la migration sera retentée au boot suivant.
      console.error("Migration v3 : échec du preflight, démarrage sans migration", err);
      onDone();
    }
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
  const [migrationDone, setMigrationDone] = useState(false);

  // Splash masquée quand les polices sont prêtes, la migration terminée ET
  // le plancher de durée écoulé : sans plancher, un démarrage très rapide
  // (dev, warm start) fait flasher le splash. Un vrai cold start qui dépasse
  // déjà ce délai n'est jamais retardé.
  const [splashMinDurationDone, setSplashMinDurationDone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSplashMinDurationDone(true), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && migrationDone && splashMinDurationDone)
      SplashScreen.hide();
  }, [fontsLoaded, fontError, migrationDone, splashMinDurationDone]);


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

              {/* Icônes custom : toastify-react-native rend ses icônes par défaut via
                  l'ancien react-native-vector-icons (fonts non embarquées en Expo ->
                  glyphes rendus par la police de repli, caractères CJK sur Android).
                  On passe des ReactNodes via les packages scopés, comme IconSymbol. */}
              <ToastManager
                icons={{
                  success: <MaterialIcons name="check-circle" size={22} color="#22C55E" />,
                  error: <MaterialIcons name="error-outline" size={22} color="#EF4444" />,
                  info: <MaterialIcons name="info-outline" size={22} color="#3B82F6" />,
                  warn: <MaterialIcons name="warning" size={22} color="#F59E0B" />,
                  default: <MaterialIcons name="info-outline" size={22} color="#3B82F6" />,
                }}
                closeIcon={<MaterialIcons name="close" size={20} color="#9CA3AF" />}
              />
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
