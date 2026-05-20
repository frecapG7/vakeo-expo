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
                <View className="flex-row items-end justify-between p-4">
                    <Text className="text-2xl font-bold dark:text-white">
                        Étape {tripStop?.name}
                    </Text>
                    <Button
                        onPress={onClose}
                        className="flex-row items-center">
                        <IconSymbol name="xmark.circle" color="gray" size={24} />
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
                            Adresse
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

                <Animated.View
                    key={tabValue}
                    entering={SlideInRight}
                    exiting={SlideOutLeft}
                    className="flex my-5 gap-4">
                    {tabValue === "location" ?

                        <View className="mx-4 gap-3">
                            <BottomLocationForm
                                control={control}
                                onCancel={onClose}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                        </View>
                        :
                        <View className="m-4">
                            <BottomAccommodationForm
                                control={control}
                                onCancel={onClose}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                        </View>
                    }
                </Animated.View>

            </BottomSheetView>

        </BottomSheet>

    )

}