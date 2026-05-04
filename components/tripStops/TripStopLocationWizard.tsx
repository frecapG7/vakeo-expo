import styles from "@/constants/Styles";
import { usePutTripStop } from "@/hooks/api/useTripStop";
import useColors from "@/hooks/styles/useColors";
import { Trip, TripStop } from "@/types/models";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { IconSymbol } from "../ui/IconSymbol";
import { BottomLocationForm } from "./BottomLocationForm";

type WizardStep = 'choice' | 'addressForm' | 'pollCreation';

interface AccommodationWizardProps {
    visible: boolean;
    onClose: () => void;
    trip: Trip;
    tripStop?: TripStop;
}



export const TripStopLocationWizard = ({
    visible,
    onClose,
    trip,
    tripStop
}: AccommodationWizardProps) => {
    const colors = useColors();
    const bottomSheetRef = useRef<BottomSheet>(null);


    const [currentStep, setCurrentStep] = useState<WizardStep>('choice');

    useEffect(() => {
        if (visible)
            bottomSheetRef?.current?.snapToIndex(0);
        else
            bottomSheetRef.current?.close();
    }, [visible]);

    const { control, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm<TripStop>();
    const putTripStop = usePutTripStop(trip._id);

    useEffect(() => {
        if (tripStop)
            reset(tripStop);
    }, [tripStop, reset]);



    useEffect(() => {
        if (tripStop?.location)
            setCurrentStep("addressForm");
        else
            setCurrentStep("choice")

    }, [tripStop]);

    useEffect(() => {
        if (isSubmitSuccessful)
            setCurrentStep("choice");
    }, [isSubmitSuccessful]);

    const onSubmit = async (data: TripStop) => {
        await putTripStop.mutateAsync(data);
        onClose();
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            backgroundStyle={{
                backgroundColor: colors.background,
                ...styles.bottomSheet
            }}
            index={-1}
            enablePanDownToClose={true}
            enableOverDrag={false}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
            snapPoints={["50%", "80%"]}
            onClose={onClose}
        >
            <BottomSheetView style={{ flex: 1 }}>
                <View className="flex-row">
                    <IconSymbol name="map" color={colors.text} />
                    <Text className="text-lg font-bold dark:text-white">
                        Lieu de l&apos;étape {tripStop?.name}
                    </Text>
                </View>

                {currentStep === "choice" &&
                    <Animated.View entering={SlideInRight}
                        exiting={SlideOutLeft}
                        className="flex m-5 gap-4">
                        <Pressable
                            onPress={() => setCurrentStep("addressForm")}
                            className="flex-row items-center gap-2 rounded-xl px-2 py-4 border border-gray-400  dark:border-gray-200 active:border-blue-400">
                            <IconSymbol
                                name="mappin"
                                size={24}
                                color={colors.text} />
                            <View>
                                <Text className="text-xl dark:text-white">
                                    Saisis une adresse
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    Si tu connais déja l'adresse de l'étape.
                                </Text>
                            </View>
                        </Pressable>
                        <Pressable
                            onPress={() => setCurrentStep("pollCreation")}
                            className="flex-row items-center gap-2 rounded-xl px-2 py-4 border border-gray-400 dark:border-gray-200 active:border-blue-400 active:bg-blue-50"
                            disabled>
                            <IconSymbol name="chart.bar.fill" size={24} color={colors.text} />
                            <View>
                                <Text className="text-xl dark:text-white">
                                    Créer un sondage
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    Demande l&apos;avis de la communauté en créant un sondage.
                                </Text>
                            </View>
                        </Pressable>
                    </Animated.View>
                }
                {currentStep === "addressForm" &&
                    <Animated.View entering={SlideInRight}
                        exiting={SlideOutLeft}
                        className="flex my-5 gap-4">
                        <View className="flex-row">
                            <Pressable className="flex-row p-1 items-center border dark:border-gray-400 rounded-full"
                                onPress={() => setCurrentStep("choice")}>
                                <IconSymbol name="arrow.left" color="gray" size={12} />
                                <Text className="text-gray-400 text-sm">Retour</Text>
                            </Pressable>
                        </View>
                        <View className="m-4">

                            <BottomLocationForm
                                control={control}
                                onCancel={() => setCurrentStep("choice")}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                        </View>
                    </Animated.View>
                }
            </BottomSheetView>
        </BottomSheet>
    )
}