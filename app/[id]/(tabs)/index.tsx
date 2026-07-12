import { TripActionCard } from "@/components/trips/TripActionCard";
import { TripActionsDropdown } from "@/components/trips/TripActionsDropdown";
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
import dayjs from "@/lib/dayjs-config";
import { countDaysBetween } from "@/lib/utils";
import { ImageBackground } from "expo-image";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function ItemDetails() {

    const { id } = useGlobalSearchParams<{ id: string }>();
    const { data: trip } = useGetTrip(id, true);
    const { me } = useContext(TripContext);
    const { data: goodsCount } = useGetGoodsCount(id);
    const deleteTrip = useDeleteStorageTrip();

    const router = useRouter();

    const { formatRange } = useI18nTime();

    const handleShare = () => {
        router.push({ pathname: "/[id]/share", params: { id } })
    }

    const onDelete = async () => {
        await deleteTrip.mutateAsync(id);
        router.dismissAll();
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
        <MenuProvider>
            <Animated.ScrollView style={{ flex: 1, paddingBottom: bottomPadding }}>
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
                                                id
                                            }
                                        })}>
                                        <Avatar src={me?.avatar}
                                            alt={me?.name?.charAt(0)}
                                            size2="md"
                                            badgeContent={0} />
                                        <Text className="text-white font-bold">{me?.name}</Text>
                                    </Pressable>
                                    <TripActionsDropdown
                                        onShare={handleShare}
                                        onEdit={() => router.push({
                                            pathname: "/[id]/edit-general",
                                            params: { id }
                                        })}
                                        onDelete={onDelete}
                                        isDeleting={deleteTrip.isPending}
                                    />
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
                                params: { id }
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
                                    id
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
                                    id
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
                                    id
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
            </Animated.ScrollView>
        </MenuProvider>
    )

}

