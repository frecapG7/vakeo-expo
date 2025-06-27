import { Button } from "@/components/ui/Button";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { useStyles } from "@/hooks/styles/useStyles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import '../global.css';


const queryClient = new QueryClient({});


export default function RootLayout() {


  const router = useRouter();
  const { container } = useStyles();

  return (
    <SafeAreaView style={container}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Stack initialRouteName="index">
            <Stack.Screen name="index" options={{
              headerShown: true,
              headerRight: () => (
                <Button
                  title="Ajouter"
                  className="bg-blue-200"
                  onPress={() => router.push("/trips/new")}
                />
              ),
              title: "Mes projets",
            }} />
            <Stack.Screen name="trips" options={{
              title: "Mes projets",
              headerShown: false
            }} />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaView>
  );
}
