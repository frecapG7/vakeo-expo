import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGetTrip, useGetTripUser, useShareTrip } from "@/hooks/api/useTrips";
import { useGetStorageTrip } from "@/hooks/storage/useStorageTrips";
import useColors from "@/hooks/styles/useColors";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Toast } from "toastify-react-native";

export default function TripDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: storageTrip } = useGetStorageTrip(String(id));
    const { data: trip } = useGetTrip(String(id));

    const { data: me } = useGetTripUser(id, storageTrip?.user, {
        enabled: !!storageTrip?.user
    });

    const shareTrip = useShareTrip(String(id));

    const colors = useColors();

    
    useEffect(() => {
        if (!!storageTrip && !storageTrip.user)
            router.navigate('./pick-user');
    }, [router, storageTrip]);
    
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);
    
    const handleShare = async () => {
        const { value } = await shareTrip.mutateAsync();
        await Clipboard.setStringAsync(`https://todo.com/token/${value}`);
        Toast.info("Lien copié dans le presse papier");
        bottomSheetModalRef.current?.close();
    }
    return (
        <TripContext.Provider value={{
            me: {
                _id: me?._id,
                avatar: me?.avatar,
                name: me?.name
            }
        }}>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    <Stack >
                        <Stack.Screen name="(tabs)" options={{
                            headerShown: true,
                            title: trip?.name || "Mon voyage",
                            headerLeft: () => (
                                <Button onPress={() => router.dismissTo("/")} className="rounded-full bg-blue-200 p-2 mr-2">
                                    <Text>Vakeo</Text>
                                </Button>
                            ),
                            headerRight: () => (
                                <View className="flex flex-row gap-2 justify-end items-center mx-5">
                                    <Pressable onPress={() => router.push('./messages')}
                                        className="flex flex-row gap-1 items-center ring-1 rounded-full p-3 py-1 bg-blue-200">
                                        <IconSymbol name="message" size={20} color="#000" />
                                        <Text className="text-secondary text-sm">{trip?.users?.length}</Text>
                                    </Pressable>
                                    <Button onPress={handlePresentModalPress}>
                                        <IconSymbol name="ellipsis.circle" size={25} color={colors.text} />
                                    </Button>
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
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        onChange={handleSheetChanges}
                        backgroundStyle={{
                            backgroundColor: colors.background
                        }}
                    >
                        <BottomSheetView style={{ flex: 1, padding: 10, minHeight: 150 }}>
                            <View className="flex flex-grow gap-5 p-1 divide-y-5 divide-solid dark:divide-white">
                                <Button onPress={handleShare} className="flex flex-row gap-5 items-center" isLoading={shareTrip.isPending}>
                                    <View className="bg-gray-200 rounded-full p-2">
                                        {shareTrip.isPending ?
                                            (
                                                <Animated.View entering={FadeIn} exiting={FadeOut}>
                                                    <ActivityIndicator size={30} color="black" />
                                                </Animated.View>
                                            )
                                            :
                                            (
                                                <Animated.View entering={FadeIn} exiting={FadeOut}>
                                                    <IconSymbol name="doc.on.doc" size={30} />
                                                </Animated.View>
                                            )
                                        }
                                    </View>
                                    <Text className="text-lg dark:text-white">Partager le voyage</Text>
                                </Button>
                                <Button onPress={() => console.log("toto")} className="flex flex-row items-center gap-5">
                                    <View className="bg-gray-200 rounded-full p-2">
                                        <IconSymbol name="trash" size={30} />
                                    </View>
                                    <Text className="text-lg dark:text-white">Supprimer le voyage</Text>
                                </Button>
                            </View>
                        </BottomSheetView>
                    </BottomSheetModal>
                </BottomSheetModalProvider>
            </GestureHandlerRootView>

        </TripContext.Provider>

    )

}