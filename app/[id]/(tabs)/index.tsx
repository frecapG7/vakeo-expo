import { EventIcon } from "@/components/events/EventIcon";
import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { default as styles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetEvents } from "@/hooks/api/useEvents";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetDashboard, useGetTrip, useShareTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { countDaysBetween } from "@/lib/utils";
import { Poll, Trip, TripUser } from "@/types/models";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import * as Clipboard from 'expo-clipboard';
import { Image, ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useMemo, useRef } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Toast } from "toastify-react-native";

// LA FORMULE MAGIQUE UNIVERSELLE (La même que sur l'autre page)
const getDynamicPlatformInfo = (urlString) => {
    if (!urlString) return { name: "Cagnotte", logo: null };
    try {
        const validUrl = urlString.startsWith('http') ? urlString : `https://${urlString}`;
        const domain = new URL(validUrl).hostname; 
        const logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        let name = domain.replace('www.', '').split('.')[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return { name, logo };
    } catch (e) {
        return { name: "Consulter la cagnotte", logo: null };
    }
};

const EventsWidget = ({ trip, user, onClick, onNewClick }: { trip: Trip, user: TripUser, onClick: (event: Event) => void, onNewClick: () => void }) => {
    const { data: eventsPage } = useGetEvents(trip._id, { limit: 3 });
    const events = useMemo(() => eventsPage?.pages.flatMap((page) => page?.events), [eventsPage?.pages]);

    return (
        <Animated.ScrollView horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-5 justify-evenly">
            {events?.map((event) => (
                <Pressable
                    key={event._id}
                    onPress={() => onClick(event)}
                    className="bg-white dark:bg-gray-900 rounded-xl p-4  flex items-center">
                    <EventIcon name={event.type} size="md" />
                    <Text className="dark:text-white font-bold text-sm max-w-40" numberOfLines={2}>
                        {event.name}
                    </Text>
                </Pressable>
            ))}
            <Pressable
                className="bg-blue-400 rounded-xl p-4 w-100 h-100 items-center"
                onPress={onNewClick}>
                <IconSymbol name="plus" color="white" />
                <Text className="dark:text-white text-sm">Ajouter</Text>
            </Pressable>
        </Animated.ScrollView>
    )
}

const PollsWidget = ({ trip, user, onClick }: { trip: Trip, user: TripUser, onClick: (poll: Poll) => void }) => {
    const { data: page } = useGetPolls(trip._id, {
        excludeClosed: true,
        excludeSelectedBy: user?._id
    });
    const now = dayjs();
    return (
        <View className="gap-2">
            {page?.polls?.map((poll) => (
                <Pressable
                    key={poll._id}
                    onPress={() => onClick(poll)}
                    className="rounded-xl bg-white dark:bg-gray-900 p-2 gap-2 border-l-4 border-orange-400">
                    <View className="flex-row border-b border-gray-400 justify-between items-center">
                        <View className="flex-row fap-2 items-center">
                            <IconSymbol name="chart.bar.fill" color="orange" />
                            <Text className="font-bold text-lg dark:text-white">{poll?.question}</Text>
                        </View>
                        <View className="flex-row gap-1 items-center" >
                            <Text className="text-orange-300 font-bold text-sm">
                                {countDaysBetween(dayjs(poll?.createdAt), now)}j
                            </Text>
                            <IconSymbol name="exclamationmark.circle.fill" color="orange" />
                        </View>
                    </View>
                    <View className="flex-row justify-between items-center" >
                        <View className="flex-row items-center gap-2">
                            <Avatar src={poll.createdBy?.avatar} alt={poll.createdBy?.name?.charAt(0)} size2="xs" />
                            <Text className="dark:text-white">{poll.createdBy?.name}</Text>
                        </View>
                        <View className="flex-row items-center gap-5">
                            <View className="flex-row items-center">
                                <IconSymbol name="person.2.fill" color="gray" />
                                <Text className="text-gray-400">{poll.hasSelected.length}</Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            ))}
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
    const { formatRange } = useI18nTime();

    const handleShare = async () => {
        const { value } = await shareTrip.mutateAsync();
        await Clipboard.setStringAsync(`https://todo.com/token/${value}`);
        Toast.info("Lien copié dans le presse papier");
        bottomSheetModalRef.current?.close();
    }

    if (!trip)
        return (
            <Animated.ScrollView style={styles.container}>
                <View className="h-80 bg-gray-600"></View>
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

    // --- LE TROMPE-L'ŒIL (MOCK) ---
    // On simule une donnée pour que tu puisses voir le design final
    // Quand le backend marchera, tu changeras ça par : const urlCagnotte = trip?.expensesList?.[0]?.url;
    const urlCagnotte = "https://www.tricount.com/fr/ton-voyage"; 
    
    // On passe le lien à la formule pour extraire "Tricount" et son beau logo
    const { name: displayName, logo: displayLogo } = getDynamicPlatformInfo(urlCagnotte);
    // ------------------------------

    return (
        <BottomSheetModalProvider>
            <Animated.ScrollView style={{ flex: 1 }}>
                <View className="h-80 w-full">
                    <ImageBackground source={trip?.image} style={{ height: "100%", width: "100%" }} contentFit="cover">
                        <View className="flex-1 justify-between mt-10 p-2">
                            <View className="flex-row justify-between items-center">
                                <Pressable className="rounded-full bg-gray-800 p-1 shadow" onPress={() => router.dismissAll()}>
                                    <IconSymbol name="chevron.left" size={25} color="white" />
                                </Pressable>
                                <View className="flex-row gap-5 items-center">
                                    <Pressable className="items-center" onPressOut={() => router.push({ pathname: "/[id]/(tabs)/messages", params: { id: String(id) } })}>
                                        <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="md" badgeContent={0} />
                                        <Text className="text-white font-bold">{me?.name}</Text>
                                    </Pressable>
                                    <Pressable onPressOut={() => bottomSheetModalRef.current?.present()} className="bg-gray-800 rounded-full p-2">
                                        <IconSymbol name="ellipsis.circle" color="white" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View className="shadow mx-4 -mt-10 mb-5 p-2 rounded-xl bg-white dark:bg-gray-900 flex" >
                    <View className="px-5 gap-2">
                        <Text className="text-4xl font-bold dark:text-white" numberOfLines={2}>{trip?.name}</Text>
                        <View className="flex gap-1 items-start justify-start">
                            <AvatarsGroup
                                maxLength={5}
                                size2="sm"
                                avatars={trip?.users?.filter(u => u._id !== me?._id).map(u => ({
                                    avatar: u?.avatar,
                                    alt: u?.name?.charAt(0)
                                }))}
                            />
                            <Text numberOfLines={1} className="max-w-25 dark:text-white">
                                Avec {trip?.users?.filter(u => u._id !== me?._id).map(u => u.name).join(",")}
                            </Text>
                        </View>
                    </View>
                    <View className="flex my-5 gap-5">
                        <Pressable className="flex-row items-center gap-2" onPress={() => router.push({ pathname: "/[id]/dates", params: { id: String(id) } })}>
                            <View className="rounded-xl bg-blue-100 p-1">
                                <IconSymbol name="calendar" size={32} color="orange" />
                            </View>
                            {trip?.startDate ?
                                <View>
                                    <Text className="capitalize text-md dark:text-white font-bold" numberOfLines={2} >
                                        {formatRange(trip?.startDate, trip?.endDate)}
                                    </Text>
                                    <Text className="text-sm text-gray-600 dark:text-gray-200">
                                        {countDaysBetween(dayjs(trip?.startDate), dayjs(trip?.endDate))} jours
                                    </Text>
                                </View>
                                :
                                <Text className="capitalize text-md font-bold dark:text-white">Saisir des dates</Text>
                            }
                        </Pressable>
                        <Pressable className="flex-row items-center gap-2" onPress={() => router.push({ pathname: "/[id]/location", params: { id: String(id) } })}>
                            <View className="rounded-xl bg-blue-100 p-1">
                                <IconSymbol name="map" size={32} color="orange" />
                            </View>
                            <Text className="font-bold dark:text-white max-w-[80%]" numberOfLines={3}>
                                {trip?.location?.displayName || "Ajouter un lieu"}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {dashboard?.polls.pending > 0 &&
                    <View className="mx-5 my-2">
                        <View className="">
                            <Text className="font-bold text-2xl dark:text-white">Sondages</Text>
                            <Text className="text-md dark:text-white">On attend ta réponse sur des sondages</Text>
                        </View>
                        <PollsWidget trip={trip} user={me} onClick={(poll) => router.navigate({ pathname: "/[id]/polls/[pollId]", params: { id: String(id), pollId: poll._id } })} />
                    </View>
                }

                {/* --- TUILE CAGNOTTE AVEC LE DESIGN DEMANDÉ --- */}
                <View className="m-5 mt-2 gap-2">
                    <Text className="text-xl font-bold dark:text-white">
                        Cagnotte
                    </Text>
                    <Pressable 
                        className="flex-row bg-white dark:bg-gray-900 rounded-lg shadow p-5 justify-between items-center active:opacity-70"
                        onPress={() => router.push({
                            pathname: "/[id]/cagnotte",
                            params: { id: String(id) }
                        })}
                    >
                        {/* Affichage du Logo généré */}
                        {displayLogo ? (
                            <Image 
                                source={{ uri: displayLogo }} 
                                style={{ width: 40, height: 40, borderRadius: 8 }} 
                            />
                        ) : (
                            <View className="rounded-full bg-blue-200 items-center p-2">
                                <IconSymbol name="eurosign.circle" color="blue" size={24} />
                            </View>
                        )}
                        
                        <View className="flex-1 ml-4">
                            {/* Affichage du Nom généré (Tricount) */}
                            <Text className="text-lg font-bold dark:text-white capitalize" numberOfLines={1}>
                                Consulter sur {displayName}
                            </Text>
                            <Text className="text-gray-400">
                                Equilibre les dépenses du groupe
                            </Text>
                        </View>
                        <IconSymbol name="arrow.up.right" color="gray" />
                    </Pressable>
                </View>

                <BottomSheetModal ref={bottomSheetModalRef} backgroundStyle={{ backgroundColor: colors.background }}>
                    <BottomSheetView style={{ flex: 1, padding: 10, minHeight: 150 }}>
                        <View className="flex flex-grow gap-5 p-1 divide-y-5 divide-solid dark:divide-white">
                            <Button className="flex flex-row items-center gap-5" onPress={() => router.push({ pathname: "/[id]/goods", params: { id: String(id) } })}>
                                <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                    <IconSymbol name="cart" size={30} />
                                </View>
                                <Text className=" text-lg dark:text-white">Voir la liste de course</Text>
                            </Button>
                            <View className="w-60% bg-black dark:bg-gray-200 h-0.5" />
                            <Button className="flex flex-row items-center gap-5" onPress={() => router.push({ pathname: "/[id]/settings", params: { id: String(id) } })}>
                                <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                    <IconSymbol name="gear" size={30} />
                                </View>
                                <Text className=" text-lg dark:text-white">Réglages</Text>
                            </Button>
                            <View className="w-60% bg-black dark:bg-gray-200 h-0.5" />
                            <Button onPress={handleShare} className="flex flex-row gap-5 items-center" isLoading={shareTrip.isPending}>
                                <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                    {shareTrip.isPending ?
                                        (<Animated.View entering={FadeIn} exiting={FadeOut}><ActivityIndicator size={30} color="black" /></Animated.View>) :
                                        (<Animated.View entering={FadeIn} exiting={FadeOut}><IconSymbol name="doc.on.doc" size={30} /></Animated.View>)
                                    }
                                </View>
                                <Text className="text-lg dark:text-white">Partager le voyage</Text>
                            </Button>
                            <View className="w-60% bg-black dark:bg-gray-200 h-0.5" />
                            <Button onPress={() => console.log("toto")} className="flex flex-row items-center gap-5">
                                <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
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