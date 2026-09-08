import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGlassHeaderOptions } from "@/hooks/styles/useGlassHeaderOptions";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import { Platform, Pressable, Text } from "react-native";

export default function AttendeesLayout() {


    const glass = useGlassHeaderOptions();
    const router = useRouter();
    const { trip } = useContext(TripContext);

    return (
        <Stack screenOptions={{
            headerShown: true,
            ...glass
        }}>
            <Stack.Screen name="index"
                options={{
                    title: "Participants",
                    headerLargeTitleEnabled: true,
                    headerTransparent: Platform.OS === "ios",
                    headerLeft: () =>
                        <Pressable onPress={() => router.back()}
                            className="mr-4">
                            <IconSymbol name="chevron.left" />
                        </Pressable>,
                    headerRight: () =>
                        trip?._id && <Pressable
                            onPress={() => router.push({
                                pathname: "/[id]/attendees/edit",
                                params: { id: trip?._id }
                            })}
                            className="ml-4">
                            <Text className="text-base font-medium dark:text-white">Modifier</Text>
                        </Pressable>,
                }}
            />
            <Stack.Screen name="edit"
                options={{
                    title: "Modifier"
                }}
            />

        </Stack>
    )
}