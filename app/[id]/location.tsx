import DownArrowIcon from "@/assets/icons/down-arrow.png";
import TripStopNameForm from "@/components/trips/TripStopNameForm";
import { TripStopDetailsEditor } from "@/components/tripStops/TripStopDetailsEditor";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/constants/Styles";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useDeleteTripStop, useGetTripStops, usePostTripStop, usePutTripStop } from "@/hooks/api/useTripStop";
import dayjs from "@/lib/dayjs-config";
import { TripStop } from "@/types/models";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TripLocation() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);


    const [selectedTripStop, setSelectedTripStop] = useState<TripStop | undefined>();


    const now = dayjs();

    const [openModal, setOpenModal] = useState(false);
    const [openLocationWizard, setOpenLocationWizard] = useState(false);

    const { data: tripStops, isLoading, isRefetching, refetch } = useGetTripStops(id);
    const postTripStop = usePostTripStop(id);
    const putTripStop = usePutTripStop(id);
    const deleteTripStop = useDeleteTripStop(id);


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

    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.FlatList
                    className="flex-1"
                    data={tripStops}
                    keyExtractor={(i) => i?._id}
                    renderItem={({ item, index }) =>
                        <Animated.View className="mx-2 mb-3">
                            <View className="flex-row justify-between items-end my-2 ">
                                <Text className="text-2xl dark:text-white ml-4 font-bold "
                                    onLongPress={() => {
                                        setSelectedTripStop(item);
                                        setOpenModal(true);
                                    }}>
                                    {item.name}
                                </Text>
                                <View className="flex-row gap-4 mx-5 items-center">
                                    <Button
                                        onPress={() => {
                                            setSelectedTripStop(item);
                                            setOpenModal(true);
                                        }}
                                        className="p-1 rounded-full border border-blue-400 bg-blue-100 ">
                                        <IconSymbol
                                            name="pencil"
                                            color="blue"
                                            size={18} />
                                    </Button>
                                    <Button
                                        onPress={() => onDelete(item)}
                                        className="p-1 rounded-full border border-red-400 bg-white dark:bg-gray-900">
                                        <IconSymbol
                                            name="trash.fill"
                                            color="red"
                                            size={18} />
                                    </Button>
                                </View>
                            </View>
                            <View className="p-2 border-b-2 border-l-1 border-r-1 border-orange-400 bg-white  dark:bg-gray-900 rounded-xl">
                                <Pressable onPress={() => {
                                    setSelectedTripStop(item);
                                    setOpenLocationWizard(true)
                                }}>
                                    <Animated.View
                                        entering={SlideInRight}
                                        exiting={SlideOutRight}
                                        className="flex-row p-2 items-center gap-4"
                                    >
                                        <View className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                                            <IconSymbol name="mappin" size={24} color="orange" />

                                        </View>
                                        <View className="flex-1 flex-shrink py-2 border-b border-gray-200">
                                            <Text className="text-gray-600 dark:text-gray-400" numberOfLines={4} ellipsizeMode="tail">
                                                {item?.location ? item?.location?.displayName : "Ajouter une adresse"}
                                            </Text>
                                        </View>
                                    </Animated.View>
                                </Pressable>
                                <Pressable onPress={() => {
                                    setSelectedTripStop(item);
                                    setOpenLocationWizard(true)
                                }}>
                                    <Animated.View
                                        entering={SlideInRight}
                                        exiting={SlideOutRight}
                                        className="flex-row p-2 items-center gap-4"
                                    >
                                        <View className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                                            <IconSymbol name="house.fill" size={24} color="orange" />
                                        </View>
                                        <View className="flex-shrink py-2 items-center">
                                            <Text className="text-gray-600 dark:text-gray-400" numberOfLines={4} ellipsizeMode="tail">
                                                {item?.accommodation ? item?.accommodation?.title : "Ajouter un hébergement"}
                                            </Text>
                                        </View>
                                    </Animated.View>
                                </Pressable>
                            </View>
                        </Animated.View>
                    }
                    ItemSeparatorComponent={() =>
                        <View className="flex h-14">
                            <Image
                                source={DownArrowIcon}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 100,
                                    tintColor: "orange"
                                }}
                                contentFit="contain"
                            />
                        </View>
                    }
                    ListHeaderComponent={
                        <View className="gap-2 mb-6 ml-4">
                            <Text className="text-3xl font-bold dark:text-white">
                                Étapes de l&apos;escapade
                            </Text>
                            <View className="flex-row items-center gap-2">
                                <Text className="text-sm dark:text-gray-200" numberOfLines={4}>
                                    Ajoute pour chaque étape une adresse et un hébergement.
                                </Text>
                            </View>
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
                            <IconSymbol name="map" size={48} color="gray" />
                            <Text className="text-lg text-gray-500 dark:text-gray-400 text-center mt-4">
                                Aucune étape
                            </Text>
                            <View className="mt-5">
                                <Button variant="contained"
                                    title="Ajouter une étape"
                                    onPress={() => setOpenModal(true)} />
                            </View>
                        </View>}
                    onRefresh={refetch}
                    refreshing={isRefetching}
                />
                {Number(tripStops?.length) > 0 &&
                    <View className="m-4 ">
                        <Button
                            className="absolute bottom-10 right-6 p-2 rounded-full border border-white bg-orange-400 items-center justify-center shadow"
                            onPress={() => setOpenModal(true)}>
                            <IconSymbol name="plus" color="white" size={26} />
                        </Button>
                    </View>
                }

                <Modal
                    transparent={true}
                    visible={openModal}
                    animationType="slide"
                >
                    <View
                        className="flex-1 justify-center items-center bg-gray-50/50 dark:bg-gray-900/50"
                    >
                        <View className="w-4/5 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200">
                            <TripStopNameForm
                                onCancel={() => {
                                    setOpenModal(false)
                                    setSelectedTripStop(undefined)
                                }}
                                onSubmit={async (data) => {
                                    if (data._id)
                                        await putTripStop.mutateAsync(data);
                                    else
                                        await postTripStop.mutateAsync(data);
                                    setOpenModal(false);
                                    setSelectedTripStop(undefined);
                                }}
                                tripStop={selectedTripStop}
                            />
                        </View>
                    </View>
                </Modal>
                {trip &&
                    <TripStopDetailsEditor
                        visible={openLocationWizard}
                        onClose={() => {
                            setSelectedTripStop(undefined);
                            setOpenLocationWizard(false)
                        }}
                        trip={trip}
                        tripStop={selectedTripStop}
                    />
                }

            </GestureHandlerRootView>
        </SafeAreaView>
    )
}