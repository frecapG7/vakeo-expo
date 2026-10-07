import { TripStopDetailsEditor } from "@/components/tripStops/TripStopDetailsEditor";
import { FloatingAddButton } from "@/components/ui/FloatingAddButton";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { Screen } from "@/components/ui/Screen";
import { useTrip } from "@/context/TripContext";
import { useDeleteTripStop, useGetTripStops, usePostTripStop, usePutTripStop } from "@/hooks/api/useTripStop";
import { TripStop } from "@/types/models";
import { BlurTargetView } from "expo-blur";
import { Image, ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function TripLocation() {

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { trip, me } = useTrip();

    const [selectedTripStop, setSelectedTripStop] = useState<TripStop | undefined>();
    const [stopEditorOpen, setStopEditorOpen] = useState(false);

    // Full-bleed (edges={[]}) : relever le FAB au-dessus de la barre de navigation Android.
    const insets = useSafeAreaInsets();

    // Cible du blur Android du sheet éditeur (le contenu sous le sheet).
    const sheetBlurTarget = useRef<View>(null);

    const { data: tripStops, isLoading, isRefetching, refetch } = useGetTripStops(id);
    const postTripStop = usePostTripStop(id);
    const putTripStop = usePutTripStop(id);
    const deleteTripStop = useDeleteTripStop(id);

    // Gamification : etape complete = adresse ET hebergement, ratio partage avec le ring du dashboard.
    const totalStops = tripStops?.length ?? 0;
    const completedStops = tripStops?.filter(stop => !!stop?.location && !!stop?.accommodation).length ?? 0;


    const onDelete = (tripStop: TripStop) => {
        Alert.alert(`Supprimer l'étape ${tripStop.name} ?`,
            "", [
            {
                text: "Annuler",
            },
            {
                text: "Supprimer",
                onPress: async () => await deleteTripStop.mutateAsync(tripStop?._id)
            }
        ]
        );
    }

    // Un seul point d'entrée : l'éditeur en sheet. Sans stop → création.
    const openStopEditor = (tripStop?: TripStop) => {
        setSelectedTripStop(tripStop);
        setStopEditorOpen(true);
    }


    return (
        <Screen className="flex-1 bg-mist dark:bg-ink" edges={[]}>
            <BlurTargetView ref={sheetBlurTarget} style={{ flex: 1 }}>
                <Animated.FlatList
                    className="flex-1"
                    data={tripStops}
                    contentContainerClassName="px-4 pt-2 pb-24"
                    contentInsetAdjustmentBehavior="automatic"
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(i) => i?._id}
                    renderItem={({ item, index }) => {
                        const isLast = index === (tripStops?.length ?? 0) - 1;
                        const stopComplete = !!item?.location && !!item?.accommodation;
                        const nextStop = tripStops?.[index + 1];
                        const segmentPaved = stopComplete && !!nextStop?.location && !!nextStop?.accommodation;
                        // Sondages ouverts que je n'ai pas encore votes : seule info actionnable sur la carte.
                        const pendingPolls = item.polls?.filter(p => !p.isClosed
                            && !p.hasSelected?.some(user => user._id === me?._id)) ?? [];
                        return (
                            <View className="flex-row">
                                {/* Timeline rail : pointilles reliant les etapes */}
                                <View className="w-9">
                                    {!isLast && (
                                        <View className={`absolute left-[15px] top-9 bottom-0 ${segmentPaved
                                            ? "border-l-2 border-amber-deep"
                                            : "border-l-2 border-dashed border-amber-deep/40"}`} />
                                    )}
                                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isLast
                                        ? "bg-night dark:bg-amber-deep"
                                        : stopComplete
                                            ? "bg-amber-deep"
                                            : "bg-white dark:bg-night border-2 border-amber-deep"}`}>
                                        {isLast ? (
                                            <IconSymbol name="flag.fill" size={14} color="#F6F8FD" />
                                        ) : stopComplete ? (
                                            <IconSymbol name="checkmark" size={16} color="#F6F8FD" />
                                        ) : (
                                            <Text className="text-amber-deep text-sm font-bold">{index + 1}</Text>
                                        )}
                                    </View>
                                </View>

                                {/* Carte de l'etape */}
                                <View className="flex-1 ml-3 mb-5 rounded-2xl border border-mist dark:border-white/10 bg-white dark:bg-night shadow-sm overflow-hidden">
                                    <View className="flex-row items-center justify-between gap-2 px-3 pt-3">
                                        <View className="flex-row items-center gap-2 flex-1">
                                            <Text
                                                className="text-xl font-bold text-night dark:text-white flex-1"
                                                numberOfLines={1}
                                                onPress={() => openStopEditor(item)}
                                            >
                                                {item.name}
                                            </Text>
                                            {pendingPolls.length > 0 && (
                                                <Pressable
                                                    onPress={() => pendingPolls.length === 1
                                                        ? router.push({
                                                            pathname: "/[id]/polls/[pollId]",
                                                            params: { id: String(id), pollId: pendingPolls[0]._id }
                                                        })
                                                        : openStopEditor(item)}
                                                    className="flex-row items-center gap-1 px-2 py-1 rounded-full bg-danger/10 border border-danger/30">
                                                    <IconSymbol name="chart.bar.fill" size={12} color="#E5484D" />
                                                    <Text className="text-danger text-xs font-bold">
                                                        {pendingPolls.length}
                                                    </Text>
                                                </Pressable>
                                            )}
                                        </View>

                                        <View className="flex-row gap-2">
                                            <Button
                                                onPress={() => openStopEditor(item)}
                                                className="p-1.5 rounded-full bg-amber/15 dark:bg-amber/20"
                                            >
                                                <IconSymbol name="pencil" color="#EE8B33" size={16} />
                                            </Button>
                                            <Button
                                                onPress={() => onDelete(item)}
                                                className="p-1.5 rounded-full bg-danger/10 dark:bg-danger/20"
                                            >
                                                <IconSymbol name="trash.fill" color="#E5484D" size={16} />
                                            </Button>
                                        </View>
                                    </View>

                                    {/* Location Section */}
                                    <Pressable
                                        onPress={() => openStopEditor(item)}
                                        className="mt-1"
                                    >
                                        <Animated.View
                                            entering={SlideInRight}
                                            exiting={SlideOutRight}
                                            className="flex-row p-3 items-center gap-3 border-t border-mist dark:border-white/10"
                                        >
                                            <View className="p-2 rounded-full bg-amber/15 dark:bg-amber/20">
                                                <IconSymbol name="mappin" size={20} color="#EE8B33" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-night/60 dark:text-white/60" numberOfLines={2}>
                                                    {item?.location ? item?.location?.displayName : "Ajouter une adresse"}
                                                </Text>
                                            </View>
                                            {!item?.location && (
                                                <IconSymbol name="plus.circle" size={16} color="#EE8B33" />
                                            )}
                                        </Animated.View>
                                    </Pressable>

                                    {/* Accommodation Section */}
                                    <Pressable
                                        onPress={() => openStopEditor(item)}
                                    >
                                        <Animated.View
                                            entering={SlideInRight}
                                            exiting={SlideOutRight}
                                            className="flex-row p-3 items-center gap-3 border-t border-mist dark:border-white/10"
                                        >
                                            <View className="p-2 rounded-full bg-amber/15 dark:bg-amber/20">
                                                <IconSymbol name="house.fill" size={20} color="#EE8B33" />
                                            </View>

                                            <View className="flex-1">

                                                {item?.accommodation ? (
                                                    <View className="rounded-xl overflow-hidden">
                                                        <ImageBackground
                                                            source={item?.accommodation?.image}
                                                            className="flex-1"
                                                            contentFit="cover"
                                                            style={{
                                                                height: 80,
                                                                width: "100%",
                                                                flex: 1,
                                                                alignItems: "flex-end",
                                                                borderTopLeftRadius: 16,
                                                                borderTopRightRadius: 16
                                                            }}
                                                        >
                                                            <View className="absolute bottom-0 left-0 right-0 h-1/2 bg-black/40" />
                                                            {item?.accommodation?.icon && (
                                                                <View className="absolute bottom-2 right-2">
                                                                    <Image
                                                                        source={item?.accommodation?.icon}
                                                                        style={{
                                                                            width: 24,
                                                                            height: 24,
                                                                            borderRadius: 6
                                                                        }}
                                                                    />
                                                                </View>
                                                            )}
                                                        </ImageBackground>
                                                        <Text className="mt-1 text-sm font-medium text-night dark:text-white" numberOfLines={2}>
                                                            {item.accommodation.title}
                                                        </Text>
                                                    </View>
                                                ) :
                                                    <View className="flex-row items-center justify-between gap-2">
                                                        <Text className="text-night/60 dark:text-white/60" numberOfLines={2}>
                                                            Ajouter un hébergement
                                                        </Text>
                                                        <IconSymbol name="plus.circle" size={16} color="#EE8B33" />
                                                    </View>
                                                }
                                            </View>
                                        </Animated.View>
                                    </Pressable>
                                {stopComplete && (
                                    <View className="flex-row px-3 pb-3 pt-1">
                                        <View className="flex-row items-center gap-1 bg-amber/15 dark:bg-amber/20 rounded-full px-2.5 py-1">
                                            <IconSymbol name="checkmark" size={11} color="#EE8B33" />
                                            <Text className="text-amber-deep dark:text-amber text-xs font-bold">Étape complète</Text>
                                        </View>
                                    </View>
                                )}
                                </View>
                            </View>
                        )
                    }}
                    ListHeaderComponent={
                        <View className="mb-6 px-1">
                                <Text className="text-sm text-night/70 dark:text-white/70" numberOfLines={4}>
                                    Ajoute pour chaque étape une adresse et un hébergement.
                                </Text>
                            {totalStops > 0 && (
                                <View className="mt-4">
                                    <View className="flex-row justify-between items-baseline mb-1.5">
                                        <Text className="text-sm font-bold text-night dark:text-white">Préparation du trajet</Text>
                                        <Text className="text-xs text-night/50 dark:text-white/50">{completedStops}/{totalStops} complètes</Text>
                                    </View>
                                    <View className="h-2.5 rounded-full bg-white dark:bg-white/10 overflow-hidden border border-mist dark:border-white/10">
                                        <View className="h-2.5 rounded-full bg-amber-deep" style={{ width: `${(completedStops / totalStops) * 100}%` }} />
                                    </View>
                                </View>
                            )}
                        </View>
                    }
                    ListEmptyComponent={isLoading ?
                        <View className="my-2 gap-2">
                            <View className="ml-4 w-20">
                                <Skeleton height={5} />
                            </View>
                            <Skeleton height={40} />
                        </View>
                        :
                        <View className="flex-1 justify-center items-center p-8 ">
                            <IconSymbol name="map" size={48} color="#EE8B33" />
                            <Text className="text-lg text-night/50 dark:text-white/50 text-center mt-4">
                                Aucune étape
                            </Text>
                            <View className="mt-5">
                                <Button variant="contained"
                                    title="Ajouter une étape"
                                    onPress={() => openStopEditor()} />
                            </View>
                        </View>}
                    ListFooterComponent={totalStops > 0 && completedStops === totalStops ? (
                        <View className="mt-1 mx-1 rounded-2xl bg-amber items-center p-4">
                            <Text className="text-night font-bold text-base">Trajet au complet</Text>
                            <Text className="text-night/70 text-xs font-medium">Toutes les étapes sont prêtes</Text>
                        </View>
                    ) : null}
                    onRefresh={refetch}
                    refreshing={isRefetching}
                />
            </BlurTargetView>
            {Number(tripStops?.length) > 0 &&
                <FloatingAddButton
                    style={{ bottom: insets.bottom + 40 }}
                    onPress={() => openStopEditor()}
                    accessibilityLabel="Ajouter une étape" />
            }

            {stopEditorOpen && trip &&
                <TripStopDetailsEditor
                    onClose={() => {
                        setSelectedTripStop(undefined);
                        setStopEditorOpen(false)
                    }}
                    trip={trip}
                    tripStop={selectedTripStop}
                    blurTarget={sheetBlurTarget}
                    onSubmit={async (data) => {
                        if (data._id)
                            await putTripStop.mutateAsync(data);
                        else
                            await postTripStop.mutateAsync(data);
                    }}
                    isSubmitting={putTripStop.isPending || postTripStop.isPending}
                />
            }
        </Screen>
    )
}
