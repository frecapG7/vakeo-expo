import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
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

    useEffect(() => {
        if (!!storageTrip && !storageTrip.user)
            router.navigate('./pick-user');
    }, [router, storageTrip]);


    const shareTrip = useShareTrip(String(id));

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const colors = useColors();
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <TripContext.Provider value={{
                    me,
                    showMenu: handlePresentModalPress
                }}>
                    <Stack screenOptions={{
                        // headerBackground: () => <BackgroundHeader trip={trip} />,
                        headerTintColor: "white",
                        headerTitleStyle: styles.headerTitle,
                        // headerTitleAlign: "left"
                    }}>
                        <Stack.Screen name="(tabs)" options={{
                            headerShown: false,
                            title: trip?.name || "",
                            headerRight: () => (
                                <View className="flex flex-row gap-2 justify-end items-center mx-5">
                                    <Pressable onPressOut={() => router.push({
                                        pathname: "/[id]/messages",
                                        params: {
                                            id: String(id)
                                        }
                                    })}
                                        className="bg-gray-800 rounded-full p-2">
                                        <IconSymbol name="message" size={25} color="white" />
                                    </Pressable>
                                    <Pressable onPressOut={handlePresentModalPress} className="bg-gray-800 p-2 rounded-full">
                                        <IconSymbol name="ellipsis.circle" size={25} color="white" />
                                    </Pressable>
                                </View>
                            ),
                            headerLeft: () => <Pressable onPressOut={() => router.dismissAll()} className="px-5">
                                <IconSymbol name="xmark" />
                            </Pressable>
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
                    
                        <Stack.Screen name="dates"
                            options={{
                                presentation: "modal",
                                title: "Dates du séjour"
                            }} />
                        <Stack.Screen name="votes"
                            options={{
                                title: "Votes",
                                headerShown: false
                            }} />
                    </Stack>
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        backgroundStyle={{
                            backgroundColor: colors.background
                        }}

                    >
                        <BottomSheetView style={{ flex: 1, padding: 10, minHeight: 150 }}>
                            <View className="flex flex-grow gap-5 p-1 divide-y-5 divide-solid dark:divide-white">
                                <Button onPress={() => router.navigate({
                                    pathname: "/[id]/votes",
                                    params: {
                                        id
                                    }
                                })}
                                    className="flex flex-row gap-5 items-center">
                                    <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                        <IconSymbol name="chart.bar.fill" size={30} />
                                    </View>
                                    <Text className="text-lg dark:text-white">Voir les sondages</Text>
                                </Button>
                                <View className="w-60% bg-black dark:bg-gray-200 h-0.5" />

                                <Button onPress={handleShare} className="flex flex-row gap-5 items-center" isLoading={shareTrip.isPending}>
                                    <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
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
                                <View className="w-60% bg-black dark:bg-gray-200 h-0.5" />
                                <Button onPress={() => console.log("toto")} className="flex flex-row items-center gap-5">
                                    <View className="bg-red-400 dark:bg-gray-200 rounded-full p-2">
                                        <IconSymbol name="trash" size={30} />
                                    </View>
                                    <Text className=" text-lg dark:text-white">Supprimer le voyage</Text>
                                </Button>
                            </View>
                        </BottomSheetView>
                    </BottomSheetModal>
                </TripContext.Provider>

            </BottomSheetModalProvider>
        </GestureHandlerRootView>

    )

}