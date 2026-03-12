import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { LinearProgress } from "@/components/ui/LinearProgress";
import { Skeleton } from "@/components/ui/Skeleton";
import { default as styles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetDashboard, useGetTrip, useShareTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import { Trip } from "@/types/models";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import * as Clipboard from 'expo-clipboard';
import { ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useRef } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Toast } from "toastify-react-native";

const PollsWidget = ({ trip }: { trip: Trip }) => {

    const { data: page } = useGetPolls(trip._id);

    return (
        <View className="gap-2">
            {page?.polls.slice(0, 2).map((poll) =>
                <View key={poll._id} className="pb-2 border-b border-gray-200">
                    <Text className="dark:text-white text-lg">
                        {poll.question}
                    </Text>

                    <View>
                        {poll.options.slice(0, 3).map((option) =>
                            <View className="gap-1 justify-start mt-2" key={option._id}>
                                <View className="flex-row items-center justify-between ">
                                    <Text className="dark:text-white text-xs max-w-[80%]" numberOfLines={3}>
                                        {option?.title || option?.value}
                                    </Text>
                                    <Text className="font-bold text-orange-400">
                                        {Number(option.percent).toFixed()} %
                                    </Text>
                                </View>
                                <LinearProgress progress={option.percent / 100} />
                                <View className="flex-row items-center gap-5">
                                    {poll.isAnonymous ?
                                        <Text className="text-gray-400">
                                            {option.selectedBy?.length} votes
                                        </Text>
                                        :
                                        <AvatarsGroup
                                            avatars={option.selectedBy?.map(u => ({
                                                avatar: u?.avatar,
                                                alt: u?.name?.charAt(0)
                                            }))}
                                            size2="xs"
                                            maxLength={5}
                                        />
                                    }
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            )}

            <Text className="dark:text-white text-center">
                Voir tout
            </Text>
        </View>

    )
}

export default function ItemDetails() {

    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(String(id));
    const { me } = useContext(TripContext);
    const { data: dashboard } = useGetDashboard(id, me?._id);
    const shareTrip = useShareTrip(String(id));

    const router = useRouter();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const colors = useColors();

    const { formatDate, formatRange } = useI18nTime();

    const handleShare = async () => {
        const { value } = await shareTrip.mutateAsync();
        await Clipboard.setStringAsync(`https://todo.com/token/${value}`);
        Toast.info("Lien copié dans le presse papier");
        bottomSheetModalRef.current?.close();
    }

    if (!trip || !router)
        return (
            <Animated.ScrollView style={styles.container}>
                <View className="h-80 bg-gray-600">
                </View>

                <View className="shadow mx-4 -mt-10 bg-yellow-50 dark:bg-gray-400 rounded-lg p-2 pb-10">
                    <View className="flex w-40">
                        <Skeleton height={20} />
                    </View>
                </View>
                <View className="mt-10 gap-5">
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                </View>
            </Animated.ScrollView>
        );

    return (
        <BottomSheetModalProvider>
            <Animated.ScrollView style={{ flex: 1 }}>
                <View className="h-80 w-full">
                    <ImageBackground source={trip?.image}
                        style={{
                            height: "100%",
                            width: "100%",
                        }}
                        contentFit="cover"
                    >
                        <View className="flex-1 justify-between mt-10 p-2">
                            <View className="flex-row justify-between items-center">
                                <Pressable className="rounded-full bg-gray-800 p-1 shadow"
                                    onPress={() => router.dismissAll()}>
                                    <IconSymbol name="chevron.left" size={25} color="white" />
                                </Pressable>
                                <View className="flex-row gap-5 items-center">

                                    <Pressable className="items-center"
                                        onPressOut={() => router.push({
                                            pathname: "/[id]/(tabs)/settings",
                                            params: {
                                                id: String(id)
                                            }
                                        })}>
                                        <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="md" />
                                        <Text className="text-white font-bold">{me?.name}</Text>
                                    </Pressable>
                                    <Pressable onPressOut={() => bottomSheetModalRef.current?.present()}
                                        className="bg-gray-800 rounded-full p-2">
                                        <IconSymbol name="ellipsis.circle" color="white" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>


                <View className="shadow mx-4 -mt-10 mb-5 p-2 rounded-lg bg-white dark:bg-gray-900 flex" >
                    <View className="px-5 gap-2">
                        <Text className="text-4xl font-bold dark:text-white" numberOfLines={2}>{trip?.name}</Text>
                        <View className="flex gap-1 items-start justify-start">
                            <AvatarsGroup
                                maxLength={5}
                                size2="sm"
                                avatars={trip?.users?.filter(u => u._id !== me?._id).map(u => ({
                                    avatar: u.avatar,
                                    alt: u?.name.charAt(0)
                                })
                                )}
                            />
                            <Text numberOfLines={1} className="max-w-25 dark:text-white">Avec {trip?.users
                                ?.filter(u => u._id !== me?._id)
                                .map(u => u.name)
                                .join(",")}
                            </Text>
                        </View>
                    </View>
                    <View className="flex my-5 gap-2">
                        <Button className="flex-row items-end border-b gap-2 border-gray-400 p-1" onPress={() => router.push({
                            pathname: "/[id]/dates",
                            params: {
                                id: String(id)
                            }
                        })}>
                            <IconSymbol name="calendar" size={32} color="gray" />
                            {trip?.startDate ?
                                <Text className="capitalize text-md text-gray-400" numberOfLines={2} >
                                    {formatRange(trip?.startDate, trip?.endDate)}
                                </Text>
                                :
                                <Text className="capitalize text-sm text-gray-400">
                                    Saisir des dates
                                </Text>
                            }
                        </Button>
                        {/* <Button className="flex-row items-end border-b border-gray-400 p-1" onPress={() => console.log("todo")}>
                        <IconSymbol name="map" size={32} color="gray" />
                        <Text className="text-sm text-gray-400" numberOfLines={2} >
                            Saisir un lieu
                        </Text>
                    </Button> */}
                    </View>

                    <View>
                        <Text className="dark:text-white text-lg font-bold">
                            Lieu
                        </Text>
                        <View className="flex-row gap-2 items -end">
                            <Text className="dark:text-white">
                                Ajouter un lieu
                            </Text>
                            <View className="bg-blue-400 rounded-full">
                                <IconSymbol name="plus" color="black" />
                            </View>
                        </View>
                    </View>
                </View>



                <View className="m-5">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-bold text-2xl dark:text-white">
                            Sondages
                        </Text>
                        {dashboard?.polls?.pending > 0 &&
                            <Animated.View className="rounded-full bg-orange-200 px-2 shadow">
                                <Text className="text-orange-600 font-bold">
                                    {dashboard?.polls?.pending} Actif
                                </Text>

                            </Animated.View>
                        }
                    </View>

                    <View
                        className="p-2 py-4 rounded-xl bg-stone-50 dark:bg-gray-900 shadow">
                        {dashboard?.polls.pending > 0 ?
                            <Pressable onPress={() => router.push({
                                pathname: "/[id]/polls",
                                params: {
                                    id: String(id)
                                }
                            })}>
                                <PollsWidget trip={trip} />
                            </Pressable>
                            :
                            <Pressable onPress={() => router.push({
                                pathname: "/[id]/polls/new",
                                params: {
                                    id: String(id)
                                }
                            })}
                                className="flex-row gap-2 items-end">

                                <Text className="text-lg dark:text-white">
                                    Démarrer un sondage
                                </Text>
                                <View className="bg-blue-400 rounded-full p-1" >
                                    <IconSymbol name="tray" color="white" />

                                </View>
                            </Pressable>
                        }


                    </View>
                </View>

                <View className="m-5 mt-2 gap-2">
                    <Text className="text-xl font-bold dark:text-white">
                        Cagnotte
                    </Text>
                    <View className="flex-row bg-white dark:bg-gray-900 rounded-lg shadow p-5 justify-between items-center">
                        <View className="rounded-full bg-blue-200 items-center p-1">
                            <IconSymbol name="eurosign.circle" color="blue" />
                        </View>
                        <View>
                            <Text className="text-lg font-bold dark:text-white">
                                Consulter sur tricount
                            </Text>
                            <Text className="text-gray-400">
                                Equilibre les dépenses du groupe
                            </Text>
                        </View>
                        <IconSymbol name="arrow.up.right" color="gray" />
                    </View>


                </View>

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    backgroundStyle={{
                        backgroundColor: colors.background
                    }}>
                    <BottomSheetView style={{ flex: 1, padding: 10, minHeight: 150 }}>
                        <View className="flex flex-grow gap-5 p-1 divide-y-5 divide-solid dark:divide-white">
                            {/* <Button onPress={() => router.navigate({
                                pathname: "/[id]/polls",
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
                            <View className="w-60% bg-black dark:bg-gray-200 h-0.5" /> */}

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
                                    <IconSymbol name="pencil" size={30} />
                                </View>
                                <Text className=" text-lg dark:text-white">Modifier le voyage</Text>
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
            </Animated.ScrollView>
        </BottomSheetModalProvider>
    )

}

