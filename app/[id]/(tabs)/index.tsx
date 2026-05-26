import { TripActionCard } from "@/components/trips/TripActionCard";
import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { default as styles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetGoodsCount } from "@/hooks/api/useGoods";
import { useGetPolls } from "@/hooks/api/usePolls";
import { useGetDashboard, useGetTrip, useShareTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { countDaysBetween } from "@/lib/utils";
import { Poll, Trip, TripUser } from "@/types/models";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";



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
                            <Text className="font-bold text-lg dark:text-white">
                                {poll?.question}
                            </Text>

                        </View>
                        <View className="flex-row gap-1 items-center" >
                            {/* <Text className="rounded-full border-orange-400 border bg-orange-200 p-2 text-orange-600 font-bold text-sm"> */}
                            <Text className="text-orange-300 font-bold text-sm">
                                {countDaysBetween(dayjs(poll?.createdAt), now)}j
                            </Text>
                            <IconSymbol name="exclamationmark.circle.fill" color="orange" />
                        </View>

                    </View>
                    <View className="flex-row justify-between items-center" >
                        <View className="flex-row items-center gap-2">
                            <Avatar src={poll.createdBy?.avatar}
                                alt={poll.createdBy?.name?.charAt(0)}
                                size2="xs"
                            />
                            <Text className="dark:text-white">
                                {poll.createdBy?.name}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-5">
                            <View className="flex-row items-center">
                                <IconSymbol name="person.2.fill" color="gray" />
                                <Text className="text-gray-400">
                                    {poll.hasSelected.length}
                                </Text>
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
    const { data: trip } = useGetTrip(id, true);
    const { me } = useContext(TripContext);
    const { data: goodsCount } = useGetGoodsCount(id);
    const { data: dashboard } = useGetDashboard(id, me?._id);

    const shareTrip = useShareTrip(String(id));

    const router = useRouter();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const colors = useColors();

    const { formatDate, formatRange } = useI18nTime();

    const handleShare = async () => {
        bottomSheetModalRef.current?.close();
        router.push({ pathname: "/[id]/share", params: { id: String(id) } })
    }

    if (!trip)
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


    const stopsCount = trip?.stops?.length || 0;
    const isSingleStop = stopsCount === 1;
    const hasStops = stopsCount > 0;


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                                        <IconSymbol name="arrow.left" size={25} color="white" />
                                    </Pressable>
                                    <View className="flex-row gap-5 items-center">

                                        <Pressable className="items-center"
                                            onPressOut={() => router.push({
                                                pathname: "/[id]/(tabs)/messages",
                                                params: {
                                                    id: String(id)
                                                }
                                            })}>
                                            <Avatar src={me?.avatar}
                                                alt={me?.name?.charAt(0)}
                                                size2="md"
                                                badgeContent={0} />
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


                    <View className="shadow mx-4 -mt-10 mb-5 px-2 pt-4 rounded-xl gap-5 bg-white dark:bg-gray-900 flex" >
                        <Button className="px-5 gap-2" onPress={() =>
                            router.push({
                                pathname: "/[id]/attendees",
                                params: {
                                    id: String(id)
                                }
                            })
                        }>
                            <Text className="text-4xl font-bold dark:text-white" numberOfLines={2}>{trip?.name}</Text>
                            <View className="flex gap-1 items-start justify-start">
                                <AvatarsGroup
                                    maxLength={5}
                                    size2="sm"
                                    avatars={trip?.users?.filter(u => u._id !== me?._id).map(u => ({
                                        avatar: u?.avatar,
                                        alt: u?.name?.charAt(0)
                                    })
                                    )}
                                />
                                <Text numberOfLines={1} className="flex dark:text-white">
                                    Avec {trip?.users
                                        ?.filter(u => u._id !== me?._id)
                                        .map(u => u.name)
                                        .join(", ")}

                                </Text>
                            </View>
                        </Button>
                        <View className="flex my-5 gap-3">
                            <TripActionCard
                                icon={{
                                    name: "calendar"
                                }}
                                title={trip?.startDate ? formatRange(trip?.startDate, trip?.endDate, { compactWeekday: true, compactMonth: true }) : "Choisir des dates"}
                                capitalizeTitle
                                subtitle={trip?.startDate && `${countDaysBetween(dayjs(trip?.startDate), dayjs(trip?.endDate))} jours`}
                                onPress={() => router.push({
                                    pathname: "/[id]/dates",
                                    params: {
                                        id: String(id)
                                    }
                                })} />

                            <TripActionCard
                                icon={{
                                    name: "map"
                                }}
                                title={Number(trip?.stops?.length) > 0 ? `${Number(trip.stops?.length) > 1 ? `Voir les ${trip.stops?.length} étapes` : "Voir le lieux"}` : "Choisir un lieu"}
                                subtitle={hasStops
                                    ? isSingleStop
                                        ? trip.stops?.[0].name
                                        : `De ${trip.stops?.[0].name} à ${String(trip.stops?.[stopsCount - 1].name)}`
                                    : ""}
                                onPress={() => router.push({
                                    pathname: "/[id]/location",
                                    params: {
                                        id: String(id)
                                    }
                                })}
                            />
                            <TripActionCard
                                icon={{
                                    name: "list.bullet"
                                }}
                                title="Voir la liste partagée"
                                subtitle={`${goodsCount?.totalCount ?? 0} élément(s) - ${goodsCount?.checkedCount ?? 0} validé(s)`}
                                onPress={() => router.push({
                                    pathname: "/[id]/goods",
                                    params: {
                                        id: String(id)
                                    }
                                })}
                            />
                        </View>
                    </View>


                    <View className="mx-4 p-2 mb-5">
                        <Text className="text-lg font-bold ml-4 dark:text-white">
                            Description
                        </Text>
                        <Text className="dark:text-white">
                            {trip?.description}
                        </Text>
                    </View>
                    {dashboard?.polls.pending > 0 &&
                        <View className="mx-5 my-2">
                            <View className="">
                                <Text className="font-bold text-2xl dark:text-white">
                                    Sondages
                                </Text>
                                <Text className="text-md dark:text-white">
                                    On attend ta réponse sur des sondages
                                </Text>
                            </View>
                            <PollsWidget
                                trip={trip}
                                user={me}
                                onClick={(poll) => router.navigate({
                                    pathname: "/[id]/polls/[pollId]",
                                    params: {
                                        id: String(id),
                                        pollId: poll._id
                                    }
                                })} />
                        </View>
                    }

                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        backgroundStyle={{
                            backgroundColor: colors.background
                        }}>
                        <BottomSheetView style={{ flex: 1, padding: 10, minHeight: 150 }}>
                            <View className="flex flex-grow gap-5 p-1 divide-y-5 divide-solid dark:divide-white">
                                <Button onPress={handleShare} className="flex flex-row gap-5 items-center" isLoading={shareTrip.isPending}>
                                    <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                        <Animated.View entering={FadeIn} exiting={FadeOut}>
                                            <IconSymbol name="doc.on.doc" size={30} />
                                        </Animated.View>
                                    </View>
                                    <Text className="text-lg dark:text-white">Partager le voyage</Text>
                                </Button>
                                <View className="w-60% bg-black dark:bg-gray-200 h-0.5" />
                                <Button onPress={() => router.push({
                                    pathname: "/[id]/edit-general",
                                    params: {
                                        id: String(id)
                                    }
                                })}
                                    className="flex flex-row items-center gap-5">
                                    <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                        <IconSymbol name="pencil" size={30} />
                                    </View>
                                    <Text className=" text-lg dark:text-white">Modifier le voyage</Text>
                                </Button>
                                <View className="w-60% bg-black dark:bg-gray-200 h-0.5" />
                                <Button
                                    className="flex flex-row items-center gap-5"
                                    onPress={() => router.push({
                                        pathname: "/[id]/settings",
                                        params: {
                                            id: String(id)
                                        }
                                    })}>
                                    <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                        <IconSymbol name="person" size={30} />
                                    </View>
                                    <Text className=" text-lg dark:text-white">Modifier mon profil</Text>
                                </Button>

                            </View>
                        </BottomSheetView>
                    </BottomSheetModal>
                </Animated.ScrollView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )

}

