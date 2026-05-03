import DownArrowIcon from "@/assets/icons/down-arrow.png";
import TripStopNameForm from "@/components/trips/TripStopNameForm";
import { TripStopLocationWizard } from "@/components/tripStops/TripStopLocationWizard";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import styles from "@/constants/Styles";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useDeleteTripStop, useGetTripStops, usePostTripStop, usePutTripStop } from "@/hooks/api/useTripStop";
import useColors from "@/hooks/styles/useColors";
import dayjs from "@/lib/dayjs-config";
import { TripStop } from "@/types/models";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultValues = {
    name: "",
    location: { displayName: "" },
    accommodation: { title: "", url: "" }
}

export default function TripLocation() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);


    const [selectedTripStop, setSelectedTripStop] = useState<TripStop | undefined>();


    const now = dayjs();

    const [openModal, setOpenModal] = useState(false);
    const [openLocationWizard, setOpenLocationWizard] = useState(false);

    const { data: tripStops } = useGetTripStops(id);
    const postTripStop = usePostTripStop(id);
    const putTripStop = usePutTripStop(id);
    const deleteTripStop = useDeleteTripStop(id);

    const colors = useColors();


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
                        <Animated.View className="m-2 ">
                            <View className="flex-row justify-between items-end">
                                <Text className="text-2xl dark:text-white ml-4 font-bold"
                                    onLongPress={() => {
                                        setSelectedTripStop(item);
                                        setOpenModal(true);
                                    }}>
                                    {item.name}
                                </Text>
                                <View className="flex-row gap-2 mx-5 items-center">
                                    <Pressable
                                        onPress={() => {
                                            setSelectedTripStop(item);
                                            setOpenModal(true);
                                        }}
                                        className="p-1 rounded-full border border-blue-400 bg-blue-50 ">
                                        <IconSymbol name="pencil" color="black" size={14} />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => onDelete(item)}
                                        className="p-1 rounded-full bg-red-600">
                                        <IconSymbol
                                            name="trash.fill"
                                            color="white"
                                            size={14} />
                                    </Pressable>
                                </View>
                            </View>
                            <View className="border-l-4 border-orange-400 bg-white  dark:bg-gray-900 rounded-xl">
                                <Pressable onPress={() => {
                                    setSelectedTripStop(item);
                                    setOpenLocationWizard(true)
                                }}>
                                    <Animated.View
                                        entering={SlideInRight}
                                        exiting={SlideOutRight}
                                        className="flex-row p-2 items-center gap-4"
                                    >
                                        <IconSymbol name="mappin" size={24} color="gray" />
                                        <View className="flex-1 flex-shrink py-2 border-b border-gray-200">
                                            <Text className="text-gray-400" numberOfLines={4} ellipsizeMode="tail">
                                                {item?.location ? item?.location?.displayName : "Ajouter un lieu"}
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
                                        <IconSymbol name="house.fill" size={24} color="gray" />
                                        <View className="flex-shrink py-2 items-center">
                                            <Text className="text-gray-400" numberOfLines={4} ellipsizeMode="tail">
                                                {item?.accommodation ? item?.accommodation?.title : "Ajouter un hébergement"}
                                            </Text>
                                        </View>
                                    </Animated.View>
                                </Pressable>
                            </View>
                        </Animated.View>
                    }
                    ItemSeparatorComponent={
                        <View className="flex h-10">
                            <Image
                                source={DownArrowIcon}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 100,
                                }}
                                contentFit="contain"
                            />
                        </View>
                    }
                    ListHeaderComponent={
                        <View className="gap-2">
                            <Text className="text-2xl font-bold dark:text-white">
                                Étapes de l'escapade
                            </Text>
                            <View className="flex-row items-center gap-2">
                                <IconSymbol name="info.circle" size={16} color="gray" />
                                <Text className="text-md dark:text-gray-200">
                                    Ajoute des noms, lieus et hébergements
                                </Text>
                            </View>
                        </View>
                    }
                    ListEmptyComponent={<View className="flex-1 justify-center items-center p-8">
                        <IconSymbol name="map" size={48} color="gray" />
                        <Text className="text-lg text-gray-500 dark:text-gray-400 text-center mt-4">
                            Aucune étape ajoutée
                        </Text>
                    </View>}
                // contentContainerClassName="flex p-4"
                />
                <View className="m-4 ">
                    <Button
                        variant="contained"
                        title="Ajouter une étape"
                        onPress={() => setOpenModal(true)}>
                    </Button>
                </View>

                <Modal
                    transparent={true}
                    visible={openModal}
                    animationType="slide"
                >
                    <View
                        className="flex-1 justify-center items-center bg-gray-50/50 dark:bg-black/50"
                    >
                        <View className="w-4/5 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200">
                            <TripStopNameForm
                                onCancel={() => setOpenModal(false)}
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
                <TripStopLocationWizard
                    visible={openLocationWizard}
                    onClose={() => {
                        setSelectedTripStop(undefined);
                        setOpenLocationWizard(false)
                    }}
                    trip={trip}
                    tripStop={selectedTripStop}
                />

            </GestureHandlerRootView>
        </SafeAreaView>
    )
}