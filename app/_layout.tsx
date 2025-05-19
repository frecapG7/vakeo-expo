import { Button } from "@/components/ui/Button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native";


// const Theme = ({ name, children }: { name: string, children: React.ReactNode }) => {
//   const { colorScheme } = useColorScheme();

//   return (
//     <View style={Colors[name][colorScheme]}>
//       {children}
//     </View>
//   )
// }

const queryClient = new QueryClient({});


export default function RootLayout() {


  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, paddingVertical: 10 }}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </SafeAreaView>
  );
}
