import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetTrip, useShareTrip } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import * as Clipboard from 'expo-clipboard';
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";



export default function ItemDetailsLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);

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
        <SafeAreaView style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <Tabs screenOptions={{
                        headerBackground: () => <BackgroundHeader trip={trip} />,
                        headerTintColor: "white",
                        headerTitleStyle: styles.headerTitle,
                        headerRight: () => (
                            <View className="flex flex-row gap-2 justify-end items-center mx-5">
                                <Button onPress={() => router.push({
                                    pathname: "/[id]/messages",
                                    params: {
                                        id: String(id)
                                    }
                                })}
                                    className="bg-gray-800 rounded-full p-2">
                                    <IconSymbol name="message" size={25} color="white" />
                                </Button>
                                <Button onPress={handlePresentModalPress} className="bg-gray-800 p-2 rounded-full">
                                    <IconSymbol name="ellipsis.circle" size={25} color="white" />
                                </Button>
                            </View>
                        )
                    }}>
                        <Tabs.Screen name="index"
                            options={{
                                title: "Accueil",
                                headerShown: true,
                                href: {
                                    pathname: "/[id]",
                                    params: {
                                        id: String(id)
                                    }
                                },
                                headerTitle: trip?.name,
                                headerLeft: () => <Button onPress={() => router.dismissAll()}>
                                    <IconSymbol name="arrow.left" color="white" />
                                </Button>,
                                tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,
                            }} />
                        <Tabs.Screen
                            name="activities"
                            options={{
                                href: {
                                    pathname: "/[id]/(tabs)/activities",
                                    params: {
                                        id: String(id)
                                    }
                                },
                                tabBarIcon: ({ color }) => <IconSymbol name="calendar" color={color} />,
                                headerShown: false,
                                title: "Le Programme",

                            }}
                        />
                        <Tabs.Screen name="goods"
                            options={{
                                href: {
                                    pathname: "/[id]/(tabs)/goods",
                                    params: {
                                        id: String(id)
                                    }
                                },
                                tabBarIcon: ({ color }) => <IconSymbol name="cart" color={color} />,
                                headerShown: true,
                                title: "La Liste",
                            }} />
                        <Tabs.Screen name="calendar"
                            options={{
                                href: null,
                                tabBarIcon: ({ color, size }) => (
                                    <IconSymbol name="calendar" size={24} color={color} />
                                ),
                                title: "Calendrier",
                            }} />

                        <Tabs.Screen name="links"
                            options={{
                                href: null
                            }} />



                    </Tabs >

                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        onChange={handleSheetChanges}
                        backgroundStyle={{
                            backgroundColor: colors.neutral
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
                                    <Text className="text-lg dark:text-white">Voir les votes</Text>
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
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaView>



    );
}