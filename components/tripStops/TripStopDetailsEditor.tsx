import styles from "@/constants/Styles";
import { usePutTripStop } from "@/hooks/api/useTripStop";
import useColors from "@/hooks/styles/useColors";
import { Trip, TripStop } from "@/types/models";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";
import { BottomAccommodationForm } from "./BottomAccommodationForm";
import { BottomLocationForm } from "./BottomLocationForm";



type WizardStep = 'choice' | 'form' | 'pollCreation';


interface AccommodationWizardProps {
    visible: boolean;
    onClose: () => void;
    trip: Trip;
    tripStop?: TripStop;
}


export const TripStopDetailsEditor = ({
    visible,
    onClose,
    trip,
    tripStop

}: AccommodationWizardProps) => {

    const colors = useColors();
    const bottomSheetRef = useRef<BottomSheet>(null);



    const [tabValue, setTabValue] = useState("location");
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
        else
            reset({
                name: ""
            })
    }, [tripStop, reset]);



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
                <View className="flex-row items-between justify-between p-4">
                    <Text className="text-2xl font-bold dark:text-white">
                        Étape {tripStop?.name}
                    </Text>
                    <Button
                        onPress={onClose}
                        className="flex-row items-center">
                        <IconSymbol name="xmark.circle" color="gray" size={24} />
                        {/* <Text className="text-xs text-gray-400">
                            Fermer
                        </Text> */}
                    </Button>
                </View>

                {/* Horizontal Tab Navigation */}
                <View className="flex-row border-b border-gray-200 dark:border-gray-700 mt-2">
                    <Pressable
                        className={`flex-1 py-2 ${tabValue === 'location' ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => {
                            setTabValue('location');
                            if (tripStop?.location) {
                                setCurrentStep("form");
                            } else {
                                setCurrentStep("choice");
                            }
                        }}
                    >
                        <Text className={`text-center font-medium ${tabValue === 'location' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            Lieu
                        </Text>
                    </Pressable>
                    <Pressable
                        className={`flex-1 py-2 ${tabValue === 'accommodation' ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => {
                            setTabValue('accommodation');
                            if (tripStop?.accommodation)
                                setCurrentStep("form");
                            else
                                setCurrentStep("choice");
                        }}
                    >
                        <Text className={`text-center font-medium ${tabValue === 'accommodation' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            Hébergement
                        </Text>
                    </Pressable>
                </View>



                {currentStep === "choice" &&

                    <Animated.View entering={SlideInRight}
                        exiting={SlideOutLeft}
                        className="flex m-5 gap-4">
                        <Pressable
                            onPress={() => setCurrentStep("form")}
                            className="flex-row items-center gap-2 rounded-xl px-2 py-4 border border-gray-400  dark:border-gray-200 active:border-blue-400">
                            <IconSymbol
                                name="mappin"
                                size={24}
                                color={colors.text} />
                            <View>
                                <Text className="text-lg font-bold dark:text-white">
                                    Saisis {tabValue === "location" ? "un lieu" : "un lien vers l'hebergement"}
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    {tabValue === "location" ? "Si tu connais déja le lieu." : "Colles le lien vers l'hébergement."}
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

                {currentStep === "form" &&
                    <Animated.View entering={SlideInRight}
                        exiting={SlideOutLeft}
                        className="flex my-5 gap-4">
                        {tabValue === "location" ?

                            <View className="m-4">
                                <BottomLocationForm
                                    control={control}
                                    onCancel={() => setCurrentStep("choice")}
                                    onSubmit={handleSubmit(onSubmit)}
                                />
                            </View>
                            :
                            <View className="m-4">
                                <BottomAccommodationForm
                                    control={control}
                                    onCancel={() => setCurrentStep("choice")}
                                    onSubmit={handleSubmit(onSubmit)}
                                />
                            </View>
                        }
                    </Animated.View>
                }

            </BottomSheetView>

        </BottomSheet>

    )

}