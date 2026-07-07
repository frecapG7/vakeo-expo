import { TripActionCard } from "@/components/trips/TripActionCard";
import { Avatar, AvatarsGroup } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { default as styles } from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetGoodsCount } from "@/hooks/api/useGoods";
import { useGetTrip } from "@/hooks/api/useTrips";
import useI18nTime from "@/hooks/i18n/useI18nTime";
import { useDeleteStorageTrip } from "@/hooks/storage/useStorageTrips";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { countDaysBetween } from "@/lib/utils";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { ImageBackground } from "expo-image";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useContext, useRef } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ItemDetails() {

    const { id } = useGlobalSearchParams<{ id: string }>();
    const { data: trip } = useGetTrip(id, true);
    const { me } = useContext(TripContext);
    const { data: goodsCount } = useGetGoodsCount(id);
    const deleteTrip = useDeleteStorageTrip();

    const router = useRouter();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const colors = useColors();

    const { formatRange } = useI18nTime();

    const handleShare = async () => {
        bottomSheetModalRef.current?.close();
        router.push({ pathname: "/[id]/share", params: { id: String(id) } })
    }


    const onDelete = async () => {
        await deleteTrip.mutateAsync(id);
        router.dismissAll();
    }
    const handleDelete = async () => {
        bottomSheetModalRef.current?.close();

        Alert.alert("Supprimer cette escapade ?",
            "", [
            {
                text: "Annuler",
            },
            {
                text: "Supprimer",
                onPress: onDelete
            }
        ]
        )
    };

    const otherUsers = me ? trip?.users?.filter(u => u._id !== me._id) || [] : [];
    const displayUsers = otherUsers.slice(0, 5);
    const hasMore = otherUsers.length > 5;

    const insets = useSafeAreaInsets();
    const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 0;

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
        <GestureHandlerRootView style={{ flex: 1, paddingBottom: bottomPadding }}>
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
                                                pathname: "/[id]/settings",
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
                        <View className="gap-1">
                            <Text className="text-4xl font-bold dark:text-white" numberOfLines={2}>{trip?.name}</Text>
                            <Button className="" onPress={() =>
                                router.push({
                                    pathname: "/[id]/attendees",
                                    params: { id: String(id) }
                                })
                            }>
                                <View className="gap-1 flex-1 items-start">
                                    <AvatarsGroup
                                        maxLength={5}
                                        size2="sm"
                                        avatars={otherUsers.map(u => ({
                                            avatar: u?.avatar,
                                            alt: u?.name?.charAt(0)
                                        }))}
                                    />
                                    <Text numberOfLines={1} ellipsizeMode="tail" className="dark:text-white text-sm">
                                        Avec {displayUsers.map(u => u.name).join(", ")}{hasMore && "..."}
                                    </Text>
                                </View>
                            </Button>
                        </View>
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
                                title={Number(trip?.stops?.length) > 0 ? `${Number(trip.stops?.length) > 1 ? `Voir les ${trip.stops?.length} étapes` : "Voir le lieu"}` : "Choisir un lieu"}
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
                    {trip?.description &&
                        <View className="mx-4 p-2 mb-5">
                            <Text className="text-lg font-bold ml-4 dark:text-white">
                                Description
                            </Text>
                            <Text className="dark:text-white">
                                {trip?.description}
                            </Text>
                        </View>
                    }
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        backgroundStyle={{ backgroundColor: colors.background }}
                    >
                        <BottomSheetView style={{ flex: 1 }}>
                            <View className="flex-col p-4">
                                <Button
                                    onPress={handleShare}
                                    className="flex-row gap-4 items-center justify-start"
                                >
                                    <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                        <Animated.View entering={FadeIn} exiting={FadeOut}>
                                            <IconSymbol name="doc.on.doc" size={30} />
                                        </Animated.View>
                                    </View>
                                    <Text className="text-lg dark:text-white">Partager le voyage</Text>
                                </Button>

                                <View className="h-px bg-gray-200 dark:bg-gray-700 my-3" />

                                <Button
                                    onPress={() => {
                                        bottomSheetModalRef.current?.close();
                                        router.push({
                                            pathname: "/[id]/edit-general",
                                            params: { id: String(id) }
                                        })
                                    }}
                                    className="flex-row gap-4 items-center justify-start"
                                >
                                    <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-2">
                                        <IconSymbol name="pencil" size={30} />
                                    </View>
                                    <Text className="text-lg dark:text-white">Modifier le voyage</Text>
                                </Button>

                                <View className="h-px bg-gray-200 dark:bg-gray-700 my-3" />

                                <Button
                                    onPress={handleDelete}
                                    className="flex-row gap-4 items-center justify-start"
                                >
                                    <View className="bg-red-400 dark:bg-red-600 rounded-full p-2">
                                        {deleteTrip.isPending ? <ActivityIndicator /> : <IconSymbol name="trash" size={30} />}
                                    </View>
                                    <Text className="text-lg text-red-500 dark:text-red-400">Supprimer le voyage</Text>
                                </Button>
                            </View>
                        </BottomSheetView>
                    </BottomSheetModal>
                </Animated.ScrollView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )

}

