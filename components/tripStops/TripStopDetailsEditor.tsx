import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import useColors from "@/hooks/styles/useColors";
import { Poll, Trip, TripStop, TripUser } from "@/types/models";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { PollStatus } from "../polls/PollStatus";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";
import { BottomAccommodationForm } from "./BottomAccommodationForm";
import { BottomLocationForm } from "./BottomLocationForm";




interface PollStatusDotProps {
    poll?: Poll;
    user?: TripUser;
}

const PollStatusDot = ({ poll, user }: PollStatusDotProps) => {
    if (!poll || !user) return null;

    const hasVoted = poll.hasSelected?.some(u => u._id === user._id);

    return (
        <View className={`w-2.5 h-2.5 rounded-full ml-1 ${hasVoted ? 'bg-green-500' : 'bg-red-500'}`} />
    );
};

interface AccommodationWizardProps {
    visible: boolean;
    onClose: () => void;
    trip: Trip;
    tripStop?: TripStop;
    onSubmit: (data: TripStop) => Promise<void>;
    isSubmitting?: boolean
}


export const TripStopDetailsEditor = ({
    visible,
    onClose,
    trip,
    tripStop,
    onSubmit,
    isSubmitting
}: AccommodationWizardProps) => {

    const colors = useColors();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [tabValue, setTabValue] = useState("location");
    const { me } = useContext(TripContext);
    const router = useRouter();

    useEffect(() => {
        if (visible)
            bottomSheetRef?.current?.snapToIndex(0);
        else
            bottomSheetRef.current?.close();
    }, [visible]);



    const { control, handleSubmit, reset, formState: { isSubmitSuccessful } } = useForm<TripStop>();

    useEffect(() => {
        if (tripStop)
            reset(tripStop);
        else
            reset({
                name: ""
            })
    }, [tripStop, reset]);


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
                        className={`flex-row items-center justify-center flex-1 py-2 ${tabValue === 'location' ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => setTabValue('location')}
                    >
                        <Text className={`text-center font-medium ${tabValue === 'location' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            Adresse
                        </Text>
                        <PollStatusDot
                            poll={tripStop?.polls?.find(p => !p.isClosed && p.type === "OtherPoll")}
                            user={me}
                        />
                    </Pressable>
                    <Pressable
                        className={`flex-row items-center justify-center flex-1 py-2 ${tabValue === 'accommodation' ? 'border-b-2 border-blue-500' : ''}`}
                        onPress={() => setTabValue('accommodation')}
                    >
                        <Text className={`text-center font-medium ${tabValue === 'accommodation' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            Hébergement
                        </Text>
                        <PollStatusDot
                            poll={tripStop?.polls?.find(p => !p.isClosed && p.type === "HousingPoll")}
                            user={me}
                        />
                    </Pressable>
                </View>

                <Animated.View
                    key={tabValue}
                    entering={SlideInRight}
                    exiting={SlideOutLeft}
                    className="flex my-5 gap-4">
                    {tabValue === "location" ?
                        <View className="mx-4 gap-3">
                            <View className="flex-row justify-end">
                                <PollStatus poll={tripStop?.polls?.filter(p => !p.isClosed && p.type === "OtherPoll")?.[0]}
                                    selectedUser={me}
                                    onNewClick={() => {
                                        onClose();
                                        router.push({
                                            pathname: "/[id]/polls/new",
                                            params: {
                                                id: trip._id,
                                                type: "OtherPoll",
                                                stop: tripStop?._id
                                            }
                                        }
                                        )
                                    }}
                                    onPollClick={(pollId) => {
                                        onClose();
                                        router.push({
                                            pathname: "/[id]/polls/[pollId]",
                                            params: {
                                                id: trip._id,
                                                pollId,
                                                stop: tripStop?._id
                                            }
                                        })
                                    }}
                                />
                            </View>
                            <BottomLocationForm
                                control={control}
                            />
                        </View>
                        :
                        <View className="mx-4 gap-3">
                            <View className="flex-row justify-end">
                                <PollStatus poll={tripStop?.polls?.filter(p => !p.isClosed && p.type === "HousingPoll")?.[0]}
                                    selectedUser={me}
                                    onNewClick={() => {
                                        onClose();
                                        router.push({
                                            pathname: "/[id]/polls/new",
                                            params: {
                                                id: trip._id,
                                                type: "HousingPoll"
                                            }
                                        })
                                    }}
                                    onPollClick={(pollId) => {
                                        onClose();
                                        router.push({
                                            pathname: "/[id]/polls/[pollId]",
                                            params: {
                                                id: trip._id,
                                                pollId
                                            }
                                        })
                                    }}
                                />
                            </View>
                            <BottomAccommodationForm
                                control={control}
                            />
                        </View>
                    }
                </Animated.View>

                <View className="mx-10">
                    <Button variant="contained"
                        title="Modifier"
                        onPress={handleSubmit(onSubmit)}
                        isLoading={isSubmitting}
                    />
                </View>
            </BottomSheetView>

        </BottomSheet>

    )

}