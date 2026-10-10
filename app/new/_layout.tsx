import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { useColorScheme } from "react-native";

export default function NewTripLayout() {

    const methods = useForm({
        defaultValues: {
            name: "",
            description: "",
            users: [{
                name: "Moi",
            }, {
                name: "",
            }],
            isPrivate: false
        }
    });

    const router = useRouter();
    const glass = useGlassHeaderOptions();
    const isDark = useColorScheme() === "dark";
    const text = isDark ? "#F6F8FD" : "#16265C";

    // Sortie du setup : retour à l'écran qui a ouvert /new (l'histoire expo-router
    // est unifiée, back dépile le push de /new lui-même). Chute dismissAll si aucun
    // historique (deep link direct) — pattern canGoBack de polls/[pollId].
    const exitSetup = () => router.canGoBack()
        ? router.back()
        : router.dismissAll();

    return (
        <FormProvider {...methods}>
            <Stack screenOptions={{
                headerShown: true,
                ...glass,
                headerTitleAlign: "center",
                headerRight: () => (
                    <Button onPress={exitSetup}>
                        <IconSymbol name="xmark" color={text} size={24} />
                    </Button>
                )
            }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="setup-general"
                    options={{
                        headerLeft: () => (
                            <Button onPress={exitSetup}>
                                <IconSymbol name="arrow.left" color="gray" />
                                <Chip text="1 sur 2" size="small" onPress={exitSetup} />
                            </Button>
                        ),
                        headerTitle: () => <HeaderTitle title="Nouvelle escapade" subtitle="Informations générales"/>,
                    }}
                />
                <Stack.Screen name="setup-users"
                    options={{
                        headerLeft: () => (
                            <Button onPress={() => router.dismissTo({
                                pathname: "/new/setup-general"
                            })}>
                                <IconSymbol name="arrow.left" color="gray" />
                                <Chip text="2 sur 2" size="small" onPress={() => router.dismissTo({
                                    pathname: "/new/setup-general"
                                })} />
                            </Button>
                        ),
                        headerTitle: () => <HeaderTitle title="Nouvelle escapade" subtitle="Ajouter des invités"/>,
                    }} />
            </Stack>
        </FormProvider>
    )
}
