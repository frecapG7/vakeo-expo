import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Menu } from "@/components/ui/Menu";
import { TripContext } from "@/context/TripContext";
import { useGetTrip, useGetTripUser, useShareTrip } from "@/hooks/api/useTrips";
import { useGetStorageTrip } from "@/hooks/storage/useStorageTrips";
import useColors from "@/hooks/styles/useColors";
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Toast from "react-native-toast-message";



export default function TripDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: storageTrip } = useGetStorageTrip(String(id));
    const { data: trip } = useGetTrip(String(id));

    const { data: me } = useGetTripUser(id, storageTrip?.user, {
        enabled: !!storageTrip?.user
    });
    const buttonRef = useRef(null);

    const shareTrip = useShareTrip(String(id));

    const colors = useColors();


    const [openMenu, setOpenMenu] = useState(false);

    const handleShare = async () => {
        const { value } = await shareTrip.mutateAsync();
        await Clipboard.setStringAsync(`https://todo.com/token/${value}`);
        Toast.show({
            type: "success",
            text1: "Lien copié dans le presse-papier",
        });
        setOpenMenu(false);
    }



    useEffect(() => {
        if (!!storageTrip && !storageTrip.user)
            router.navigate('./pick-user');
    }, [router, storageTrip]);

    return (
        <TripContext.Provider value={{
            me: {
                _id: me?._id,
                avatar: me?.avatar,
                name: me?.name
            }
        }}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{
                    headerShown: true,
                    title: trip?.name || "Mon voyage",
                    headerRight: () => (
                        <View className="flex flex-row gap-2 justify-end items-center mx-5">
                            <Pressable onPress={() => router.push('./messages')}
                                className="flex flex-row gap-1 items-center ring-1 rounded-full p-3 py-1 bg-blue-200">
                                <IconSymbol name="message" size={20} color="#000" />
                                <Text className="text-secondary text-sm">{trip?.users?.length}</Text>
                            </Pressable>
                            <Button onPress={() => {
                                setOpenMenu(true);
                            }}>
                                <IconSymbol name="ellipsis.circle" size={25} color={colors.text} />
                            </Button>
                            <Menu open={openMenu} anchorEl={buttonRef?.current}>
                                <View className="flex gap-2 p-1">
                                    <Button onPress={handleShare} className="flex flex-row justify-between" isLoading={shareTrip.isPending}>
                                        <Text className="text-xs">Partager le voyage</Text>
                                        {shareTrip.isPending ?
                                            (
                                                <Animated.View entering={FadeIn} exiting={FadeOut}>
                                                    <ActivityIndicator size={15} />
                                                </Animated.View>
                                            )
                                            :
                                            (
                                                <Animated.View entering={FadeIn} exiting={FadeOut}>
                                                    <IconSymbol name="link" size={15} />
                                                </Animated.View>
                                            )
                                        }
                                    </Button>
                                    <Button onPress={() => console.log("toto")} className="flex flex-row justify-between">
                                        <Text className="text-xs text-red-600">Supprimer le voyage</Text>
                                        <IconSymbol name="trash" size={15} color="red" />
                                    </Button>
                                </View>

                            </Menu>
                        </View>
                    )
                }} />
                <Stack.Screen name="pick-user" options={{
                    presentation: "modal",
                    title: "Choisis qui tu es",

                }} />
                <Stack.Screen name="edit-user" options={{
                    presentation: "modal",
                    title: "Modifier mon utilisateur",
                    headerBackTitle: "Annuler"
                }} />
                <Stack.Screen name="messages" options={{
                    title: "Messagerie",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />
                <Stack.Screen name="dates"
                    options={{
                        presentation: "modal",
                        title: "Dates du séjour"
                    }} />
            </Stack>
        </TripContext.Provider>

    )

}